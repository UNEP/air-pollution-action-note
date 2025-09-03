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
  import AnnotationCountry from 'src/components/maps/AnnotationCountry.svelte';
  import CountrySvg from './CountrySVG.svelte';
//   import AnnotationRegion from 'src/components/maps/AnnotationRegion.svelte';
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
  export let valueType;
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
      — <strong>${currentRegion.mostPollutingValue.toFixed(2)}</strong>${valueType === 'number' ? `µg/m<sup>3</sup>` : '%'}
      of the total <strong>${currentRegion.totalPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>.`
    );
  };

  let showHoverTextAfter = () => {
    return (
      `The largest contributing sector is <strong>${labels[currentRegion.mostPollutingType]}</strong>
      — <strong>${currentRegion.mostPollutingValue.toFixed(2)}</strong>${valueType === 'number' ? `µg/m<sup>3</sup>` : '%'}
      of the total <strong>${currentRegion.totalPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>.`
    );
  };

  let showCurrentLeaf = (
    currentType:string,
    currentValue:number) => {
    return (
      `<strong>${labels[currentType]}</strong> accounts for
       <strong>${(currentValue).toFixed(2)}</strong>${valueType === 'number' ? `µg/m<sup>3</sup>` : '%'} in <strong>${currentRegion.region.replace('+','and')}</strong>. 
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
          mapPropotions(50),
          mapPropotions(50)
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
        x : convertX(10),
        y : convertY(10),
        width: (
          mapPropotions(50) +
          background.borderRight + background.borderLeft
        ),
        height: (
          mapPropotions(50) +
          background.borderBottom + background.borderTop
        ),
        totalPollutingValue : treemap.value,
        mostPollutingValue : treemap.children[0].data.value,
        mostPollutingType : treemap.children[0].data.type,
        numCountries : region.numCountries,
        region: region.region,
        nameX: convertX(0),
        nameY: region.region === "Latin America + Caribbean" ?
          (
            convertX(0) +
            mapPropotions(treemap.value) +
            background.borderRight + background.borderLeft + 5
          ) :
          convertX(0) - 25
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
<div class="svgs">
    {#each regions as region}
      <CountrySvg
        bind:valueType
        region={region}
        bind:legendElementSelected
        labels={labels}
      />
    {/each}
</div>




<style>
    .svgs {
        display: flex;
        flex-wrap: nowrap;
        margin-left: -10px;
        margin-top: 20px;
        padding-bottom: 200px;
    }


</style>