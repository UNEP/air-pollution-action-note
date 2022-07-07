<script lang="ts" context="module">
  import type { HierarchyRectangularNode } from 'd3-hierarchy';
  interface HierarchicalDatum {
    value?: number;
    type?: string;
    types?: HierarchicalDatum[];
  }
  type RegionLeaf = HierarchyRectangularNode<HierarchicalDatum>;
  export interface RegionTreemapData {
    leaves: RegionLeaf[],
    background: {
      borderTop: number,
      borderBottom: number,
      borderLeft: number,
      borderRight: number,
      color: string,
    },
    x: number,
    y: number,
    width: number,
    height: number,
    totalPollutingValue: number,
    mostPollutingValue: number,
    mostPollutingType: string,
    numCountries: number,
    region: string,
    nameX: number,
    nameY: number
  }
</script>
<script lang="ts">
  import Annotation from 'src/components/maps/Annotation.svelte';
  import * as d3 from 'src/d3';
  import {colorSectors, colorFuels} from 'src/colors';
  import type { CartoRegionData } from 'src/types';

  interface Position{
    x: number,
    y: number
  }
  export let data: CartoRegionData;
  export let width: number;
  export let height: number;
  export let source: string;
  export let showRegionName: boolean = true;
  export let legendElementSelected: string = "";
  export let annotationShowing: boolean = false;
  export let labels : {[key: string]: string};


  let referenceRegion : Position;
  const mapPropotions = (val) => Math.sqrt(val) * width * 0.03;
  let regions : RegionTreemapData[];
  let showInformation = true;
  let showConcreteType = false;
  let currentRegion: RegionTreemapData;
  let currentLeaf: RegionLeaf;

  let updateInformation = (cregion : RegionTreemapData, leaf: RegionLeaf) => {
    currentRegion = cregion;
    showConcreteType = leaf.data.type !== cregion.mostPollutingType;
    currentLeaf = leaf;
    showInformation = false;
  };

  let showHoverText = () => {
    return (
      `The largest contributing sector in <strong>${currentRegion.region.replace('+','and')}</strong>
      is <strong>${labels[currentRegion.mostPollutingType]}</strong>
      — <strong>${currentRegion.mostPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>
      of the total <strong>${currentRegion.totalPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>.`
    );
  };

  let showHoverTextAfter = () => {
    return (
      `The largest contributing sector is <strong>${labels[currentRegion.mostPollutingType]}</strong>
      — <strong>${currentRegion.mostPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>
      of the total <strong>${currentRegion.totalPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>.`
    );
  };

  let showCurrentLeaf = (
    currentType:string,
    currentValue:number) => {
    return (
      `<strong>${labels[currentType]}</strong> accounts for
       <strong>${(currentValue).toFixed(2)}</strong>
       µg/m<sup>3</sup> in <strong>${currentRegion.region.replace('+','and')}</strong>. 
       ${showHoverTextAfter()}`
    );
  };
  $:{
    regions = data.regions.map(region => {
      const convertX = (val: number) => width * val / data.scale_width;
      const convertY = (val: number) => height * val / data.scale_height;
      const hierarchy = d3.hierarchy<HierarchicalDatum>(region, node => node.types)
        .sum(node => node.value || 0)
        .sort((a,b) => b.value - a.value);
      const treemap = d3.treemap<HierarchicalDatum>()
        .size([
          mapPropotions(region.totalValue ),
          mapPropotions(region.totalValue)
        ])
        .padding(2)(hierarchy);
      const background = {
        borderTop  : 2,
        borderBottom: 2,
        borderLeft: 2,
        borderRight: 2,
        color: "#f9f9f9",
      };

      return {
        leaves : treemap.leaves(),
        background,
        x : convertX(region.posX),
        y : convertY(region.posY),
        width: (
          mapPropotions(treemap.value) +
          background.borderRight + background.borderLeft
        ),
        height: (
          mapPropotions(treemap.value) +
          background.borderBottom + background.borderTop
        ),
        totalPollutingValue : treemap.value,
        mostPollutingValue : treemap.children[0].data.value,
        mostPollutingType : treemap.children[0].data.type,
        numCountries : region.numCountries,
        region: region.region,
        nameX: convertX(region.posX),
        nameY: region.region === "Latin America + Caribbean" ?
          (
            convertX(region.posY) +
            mapPropotions(treemap.value) +
            background.borderRight + background.borderLeft + 5
          ) :
          convertX(region.posY) - 25
      };
    });
    referenceRegion = {
      x: regions[5].x + regions[5].width / 2,
      y: regions[5].y
    };
  }

  $: annotationShowing = !showInformation;

  let containerEl: Element;
  let pxAboveScreenTop: number = 0;
  const onWindowScroll = () => {
    const top = containerEl.getBoundingClientRect().top - 50;
    pxAboveScreenTop = top < 0 ? Math.abs(top) : 0;
  };


</script>

<svelte:window on:scroll={onWindowScroll} />

<div class="text" bind:this={containerEl}>
{#if showInformation}
  <Annotation
    x={referenceRegion.x}
    y={referenceRegion.y}
    text={source}
    radius={2}
    forceTopWherePossible
    canvasWidth={width}
    canvasHeight={height}
  />
{:else}
  <Annotation
    x={currentRegion.x + currentLeaf.x0 + ((currentLeaf.x1 - currentLeaf.x0) / 2)}
    y={currentRegion.y + currentLeaf.y0 + ((currentLeaf.y1 - currentLeaf.y0) / 2)}
    text={showConcreteType ? showCurrentLeaf(currentLeaf.data.type, currentLeaf.data.value) : showHoverText()}
    radius={{
      x: (currentLeaf.x1 - currentLeaf.x0) / 2,
      y: (currentLeaf.y1 - currentLeaf.y0) / 2
    }}
    topClamp={pxAboveScreenTop}
    forceTopWherePossible
    canvasWidth={width} canvasHeight={height}
  />
{/if}
</div>

  {#if showRegionName}

  <div class="text">
    {#each regions as region}
    <Annotation
      x={region.nameX}
      y={region.nameY}
      text={region.region.replace('+','and')}
      radius={2}
      justText={true}
      canvasWidth={width}
      canvasHeight={height}
    />
    {/each}
  </div>
  {/if}
<div class="svg" {width} {height}>
  <svg id="treemapCartogram" {width} {height}>
    <filter id="shadow" x="-10%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-opacity="0.4"></feDropShadow>
    </filter>
    <defs>
      <pattern id="hash--windblown" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="4" height="4" transform="translate(0,0)" fill="#faba26"></rect>
        <rect width="2.4" height="4" transform="translate(0,0)" fill="#f9f9f9"></rect>
      </pattern>
    </defs>
    {#each regions as region}

      <g id={region.region.replace(/\s/g, '').replace('+','-') + "-group"} class="region">
        <rect
          id = {region.region.replace(/\s/g, '').replace('+','-') + "-background"}
          class="tile"
          width={region.width}
          height={region.height}
          x={region.x - region.background.borderRight}
          y={region.y - region.background.borderBottom}
          rx="2"
          ry="2"
          filter="none"
          on:mouseenter={()=>{showInformation = false; currentRegion = region; currentLeaf = region.leaves[0];}}
          on:mouseout={()=>{showInformation = true;}}
          on:blur={()=>{showInformation = true;}}
          style="fill: {region.background.color};"
        />

        <g id={region.region.replace(/\s/g, '').replace('+','-') + "-elements"}>
          {#each region.leaves as leaf}
          <rect
            class="tile leaf {leaf.data.type}"
            class:leaf--shadow={legendElementSelected === leaf.data.type}
            class:leaf--hide={ legendElementSelected !== leaf.data.type &&
                               legendElementSelected !== "null"}
            fill={data.type === "sectors" ? colorSectors(leaf.data.type) : colorFuels(leaf.data.type)}
            width={leaf.x1 - leaf.x0}
            height={leaf.y1 - leaf.y0}
            x={region.x + leaf.x0}
            y={region.y + leaf.y0}
            rx="2"
            ry="2"
            on:mouseenter={()=>{updateInformation(region, leaf);}}
            on:focus={()=>{updateInformation(region, leaf);}}
            on:mouseout={()=>{showInformation = true; showConcreteType = false;}}
            on:blur={()=>{showInformation = true; showConcreteType = false;}}
          />
          {/each}
        </g>
      </g>
    {/each}
  </svg>

</div>

<style>
  .leaf {
    stroke: transparent;
    stroke-linecap: butt;
    stroke-width: 0.5;
    transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, background-color 0.2s, opacity 0.45s ease 0.15s;
    outline-color: black;
  }
  @media (hover : hover) and (pointer : fine) {
    .leaf:hover {
      stroke: black;
      stroke-width:1.5;
      transition: .3s stroke;
    }
  }
  .region:hover{
    filter: drop-shadow( 0 0 3px rgba(0, 0, 0, 1));
  }
  .leaf--hide {
    opacity: 0.2;
  }

  .leaf--shadow {
    filter: drop-shadow( 0 0 3px rgba(0, 0, 0, 1));
  }

</style>