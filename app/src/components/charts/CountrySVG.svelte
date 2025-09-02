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
    import {colorSectors, colorFuels} from 'src/colors';
    export let labels : {[key: string]: string};
    export let region;
    export let valueType;
    export let legendElementSelected;
     let showConcreteType = false;
    
    let showInformation = true;
    let currentRegion: RegionTreemapData;
    let currentLeaf: RegionLeaf;


    let showHoverText = () => {
        const percentage = (currentRegion.mostPollutingValue/currentRegion.totalPollutingValue)*100;
        const value = currentRegion.mostPollutingValue;
        return (
        `The largest contributing sector in <strong>${currentRegion.region.replace('+','and')}</strong>
        is <strong>${labels[currentRegion.mostPollutingType]}</strong>
        — ${valueType === 'number' ? `<strong>${value.toFixed(2)}</strong> µg/m<sup>3</sup>` : `<strong>${percentage.toFixed(2)}</strong>%`}
        of the total <strong>${currentRegion.totalPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>.`
        );
    };

    let showHoverTextAfter = () => {
        const percentage = (currentRegion.mostPollutingValue/currentRegion.totalPollutingValue)*100;
        const value = currentRegion.mostPollutingValue;
        return (
        `The largest contributing sector is <strong>${labels[currentRegion.mostPollutingType]}</strong>
        — ${valueType === 'number' ? `<strong>${value.toFixed(2)}</strong> µg/m<sup>3</sup>` : `<strong>${percentage.toFixed(2)}</strong>%`}
        of the total <strong>${currentRegion.totalPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>.`
        );
    };

    let updateInformation = (cregion : RegionTreemapData, leaf: RegionLeaf) => {
        currentRegion = cregion;
        showConcreteType = leaf.data.type !== cregion.mostPollutingType;
        currentLeaf = leaf;
        showInformation = false;
    };

    let showCurrentLeaf = (
        currentType:string,
        currentValue:number) => {
            const percentage = (currentValue/currentRegion.totalPollutingValue)*100;

        return (
        `<strong>${labels[currentType]}</strong> accounts for
        ${valueType === 'number' ? `<strong>${currentValue.toFixed(2)}</strong>µg/m<sup>3</sup>` : `<strong>${percentage.toFixed(2)}</strong>%`} in <strong>${currentRegion.region.replace('+','and')}</strong>. 
        ${showHoverTextAfter()}`
        );
    };
</script>

<div class="svg">
    <div class="text">
    {#if !showInformation}
        <AnnotationCountry
            x={0}
            y={currentRegion.y + currentLeaf.y0 + ((currentLeaf.y1 - currentLeaf.y0) / 2)}
            text={showConcreteType ? showCurrentLeaf(currentLeaf.data.type, currentLeaf.data.value) : showHoverText()}
            radius={{
            x: (currentLeaf.x1 - currentLeaf.x0) / 2,
            y: (currentLeaf.y1 - currentLeaf.y0) / 2
            }}
            staticPosition={true}
            forceTopWherePossible
            canvasWidth={250} canvasHeight={250}
        />
    {/if}
    </div>
    <div class="country_name text">Country Name</div>
    <svg id="treemapCartogram" width="{region.width + 15}" height="{region.height + 15}">
        <filter id="shadow" x="-10%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-opacity="0.4"></feDropShadow>
        </filter>
        <defs>
        <pattern id="hash--windblown" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="4" height="4" transform="translate(0,0)" fill="#faba26"></rect>
            <rect width="2.4" height="4" transform="translate(0,0)" fill="#f9f9f9"></rect>
        </pattern>
        </defs>


        <g id={region.region.replace(/\s/g, '').replace('+','-') + "-group"} class="region">
            <rect
            id = {region.region.replace(/\s/g, '').replace('+','-') + "-background"}
            class="tile"
            width={region.width}
            height={region.height}
            x={region.x - region.background.borderRight}
            y={region.y - region.background.borderBottom}
            rx="0"
            ry="0"
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
                fill={ colorSectors(leaf.data.type) }
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
    </svg>
    
</div>

<style>
    .svg {
        position: relative;
    }
    .leaf {
        stroke: transparent;
        stroke-linecap: butt;
        stroke-width: 0.5;
        transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, background-color 0.2s, opacity 0.45s ease 0.15s;
        outline-color: black;
    }
    .country_name {
        padding: 0px 20px;
        margin-bottom: -10px;

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