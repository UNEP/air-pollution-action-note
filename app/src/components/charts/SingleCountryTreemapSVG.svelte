<script lang="ts" context="module">
  import type { HierarchyRectangularNode } from 'd3-hierarchy';
  
  interface HierarchicalDatum {
    value: number;
    type: string;
    children?: HierarchicalDatum[];
  }
  
  type CountryLeaf = HierarchyRectangularNode<HierarchicalDatum>;
  
  export interface CountryTreemapData {
    leaves: CountryLeaf[];
    background: {
      borderTop: number;
      borderBottom: number;
      borderLeft: number;
      borderRight: number;
      color: string;
    };
    x: number;
    y: number;
    width: number;
    height: number;
    totalPollutingValue: number;
    mostPollutingValue: number;
    mostPollutingType: string;
    countryName: string;
    countryCode: string;
  }
</script>

<script lang="ts">
  import * as d3 from 'src/d3';
  import { colorSectors, colorFuels, colorSectorsDownloading } from 'src/colors';
  import Legend from 'src/components/common/Legend.svelte';
  
  // Props for the component
  export let countryCode: string = '';
  export let countryName: string = '';
  export let dataType: 'sectors' | 'fuels' = 'sectors';
  export let pollutionData: Array<{type: string, value: number}> = [];
  export let totalValue: number = 0;
  export let valueType: 'number' | 'percentage' = 'number';
  export let width: number = 400;
  export let height: number = 300;
  export let showLegend: boolean = true;
  export let showCountryName: boolean = true;
  export let labels: {[key: string]: string} = {};
  export let totalValuePopulation: number = 0;
  export let isDownloading: boolean = false;
  // Internal state
  let selectedType: string = '';
  let hoveredType: string = '';
  let containerElement: HTMLElement;
  let treemapData: CountryTreemapData;
  // Legend configuration
  const legendOptions = {
    sectors: {
      title: "Contribution of each <b>sector</b> to fine particle pollution",
      labels: [
        'Residential','Transport','International shipping',
        'Industry','Commercial','Anthropogenic fugitive, combustion and industrial dust',
        'Other combustion','Remaining sources','Landscape fires',
        'Agricultural waste burning','Agriculture',
        'Waste','Solvents','Energy','Windblown dust'
      ],
      selectionDictionary: [
        'residential', 'transport', 'intlshipping',
        'industry', 'commercial', 'afciddust', 'othercombustion',
        'remainingsources', 'otherfires', 'agrwasteburning', 'agriculture',
        'waste', 'solvents', 'energy','windblowndust'
      ],
      colors: colorSectors.range()
    },
    fuel: {
      title: "Contribution of each <b>type of fuel</b> to fine particle pollution",
      labels: ['Process','Liquid','Solid bio','Coal'],
      selectionDictionary: ['process', 'liquid', 'solidbio', 'coal'],
      colors: colorFuels.range()
    }
  };
  
  // Create mapping between types and labels if not provided
  $: if (!labels || Object.keys(labels).length === 0) {
    const pairLabels: {[key: string]: string} = {};
    legendOptions[dataType].selectionDictionary.forEach((element, index) => {
      pairLabels[element] = legendOptions[dataType].labels[index];
    });
    labels = pairLabels;
  }
  
  // Computed values
  $: sortedData = [...pollutionData].sort((a, b) => b.value - a.value);
  $: maxValue = sortedData.length > 0 ? sortedData[0].value : 0;
  $: selectedData = selectedType ? pollutionData.filter(d => d.type === selectedType) : pollutionData;

  let showHoverText = () => {
    const percentage = (treemapData.mostPollutingValue/treemapData.totalPollutingValue)*100;
    const value = treemapData.mostPollutingValue;
    return (
      `The largest contributing sector in <strong>${treemapData.countryName.replace('+','and')}</strong>
      is <strong>${labels[treemapData.mostPollutingType]}</strong>
      — ${valueType === 'number' ? `<strong>${value.toFixed(2)}</strong>µg/m<sup>3</sup>` : `<strong>${percentage.toFixed(2)}</strong>%`}
      of the total <strong>${totalValuePopulation.toFixed(2)}</strong> µg/m<sup>3</sup>.`
    );
  };

  let showHoverTextAfter = () => {
    const percentage = (treemapData.mostPollutingValue/treemapData.totalPollutingValue)*100;
    const value = treemapData.mostPollutingValue;
    return (
      `The largest contributing sector is <strong>${labels[treemapData.mostPollutingType]}</strong>
      — ${valueType === 'number' ? `<strong>${value.toFixed(2)}</strong>µg/m<sup>3</sup>` : `<strong>${percentage.toFixed(2)}</strong>%`}
      of the total <strong>${totalValuePopulation.toFixed(2)}</strong> µg/m<sup>3</sup>.`
    );
  };

  let showCurrentLeaf = (
    currentType:string,
    currentValue:number) => {
    const percentage = (currentValue/treemapData.totalPollutingValue)*100;

    return (
      `<strong>${labels[currentType]}</strong> accounts for
       ${valueType === 'number' ? `<strong>${currentValue.toFixed(2)}</strong>µg/m<sup>3</sup>` : `<strong>${percentage.toFixed(2)}</strong>%`} in <strong>${treemapData.countryName.replace('+','and')}</strong>. 
       ${showHoverTextAfter()}`
    );
  };

  let textToShow = '';

  // Initialize textToShow when treemapData is available
  $: if (treemapData && !hoveredType) {
    textToShow = showHoverText();
  }

  // Methods
  function handleTypeClick(type: string) {
    selectedType = selectedType === type ? '' : type;
  }
  
  function handleTypeHover(type: string) {
    hoveredType = type;
    legendElementSelected = type;
    if(labels[treemapData.mostPollutingType] === labels[type]) {
      textToShow = showHoverText();
    } else {
      textToShow = showCurrentLeaf(type, pollutionData.find(d => d.type === type)?.value || 0);
    }
  }
  
  function handleTypeLeave() {
    hoveredType = '';
    legendElementSelected = 'null';
    // Show default text when no hover
    textToShow = showHoverText();
  }
  
  function getTypeColor(type: string): string {
    const colorIndex = legendOptions[dataType].selectionDictionary.indexOf(type);
    return colorIndex >= 0 ? (isDownloading ? colorSectorsDownloading.range()[colorIndex] : legendOptions[dataType].colors[colorIndex]) : '#ccc';
  }
  
  function formatValue(value: number): string {
    if (valueType === 'percentage') {
      return `${((value / totalValue) * 100).toFixed(1)}%`;
    }
    return `${value.toFixed(2)} µg/m³`;
  }
  
  function getTooltipText(type: {type: string, value: number}): string {
    const typeName = labels[type.type] || type.type;
    const value = formatValue(type.value);
    const percentage = ((type.value / totalValue) * 100).toFixed(1);
    
    return `${typeName}: ${value} (${percentage}%)`;
  }
  
  // $: console.log(pollutionData, sortedData, selectedData);
  // Generate treemap data
  $: if (pollutionData.length > 0 && totalValue > 0) {
    const hierarchy = d3.hierarchy<HierarchicalDatum>({ value: 0, type: 'root', children: pollutionData }, node => node.children)
      .sum(node => node.value)
      .sort((a, b) => b.value - a.value);
    
    const treemap = d3.treemap<HierarchicalDatum>()
      .size([width, height])
      .padding(4)(hierarchy);
    
    const background = {
      borderTop: 4,
      borderBottom: 4,
      borderLeft: 4,
      borderRight: 4,
      color: "#f9f9f9",
    };
    
    treemapData = {
      leaves: treemap.leaves(),
      background,
      x: 0,
      y: 0,
      width: width,
      height: height,
      totalPollutingValue: treemap.value || 0,
      mostPollutingValue: treemap.children?.[0]?.data.value || 0,
      mostPollutingType: treemap.children?.[0]?.data.type || '',
      countryName,
      countryCode
    };
  }
  let legendElementSelectedIndex = -1;
  let legendElementSelected = "";
  $: {
    if(
      legendElementSelectedIndex >= 0 &&
      legendElementSelectedIndex < legendOptions[dataType].selectionDictionary.length &&
      legendElementSelectedIndex !== null
    )
      legendElementSelected =
        (legendOptions[dataType].selectionDictionary[legendElementSelectedIndex] + "")
          .toLocaleLowerCase().replaceAll('.', '').replaceAll(' ', '');
    else legendElementSelected = "null";
  }

  // Reactive statement to update text when no hover
  $: if (!hoveredType && treemapData) {
    textToShow = showHoverText();
  }

</script>

<div class="single-country-treemap" bind:this={containerElement}>
  {#if showCountryName && countryName}
    <div class="country-title">
      <h3>{countryName}</h3>
      <p class="subtitle">
        Total: {formatValue(totalValue)} 
        {#if valueType === 'percentage'}
          (100%)
        {/if}
      </p>
    </div>
  {/if}
  {#if showLegend}
  <Legend
    title = {legendOptions[dataType].title}
    colors = {isDownloading ? colorSectorsDownloading.range() : legendOptions[dataType].colors}
    labels = {legendOptions[dataType].labels}
    type = {'categorical'}
    bind:selected = {legendElementSelectedIndex}
  />
  {/if}
  {#if treemapData}
    <div class="treemap-container">
      <div>
        <div class="country-name">{countryName}</div>
        <svg {width} {height}>
          <defs>
            <filter id="shadow" x="-10%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-opacity="0.4"></feDropShadow>
            </filter>
          </defs>
          
          <!-- Background -->
          <rect
            class="background"
            width={treemapData.width}
            height={treemapData.height}
            x={treemapData.x}
            y={treemapData.y}
            rx="4"
            ry="4"
            fill={treemapData.background.color}
            stroke="#e0e0e0"
            stroke-width="1"
          />
          
          <!-- Treemap tiles -->
          {#each treemapData.leaves as leaf}
            <rect
              class="tile leaf {leaf.data.type}"
              class:leaf--shadow={legendElementSelected === leaf.data.type}
              class:leaf--hide={ legendElementSelected !== leaf.data.type &&
                                legendElementSelected !== "null"}
              fill={!isDownloading ? getTypeColor(leaf.data.type) : colorSectorsDownloading.range()[legendOptions[dataType].selectionDictionary.indexOf(leaf.data.type)]}
              width={leaf.x1 - leaf.x0}
              height={leaf.y1 - leaf.y0}
              x={treemapData.x + leaf.x0}
              y={treemapData.y + leaf.y0}
              rx="2"
              ry="2"
              on:click={() => handleTypeClick(leaf.data.type)}
              on:mouseenter={() => handleTypeHover(leaf.data.type)}
              on:mouseleave={handleTypeLeave}
            />
          {/each}
        </svg>
      </div>
      <div class="annotation">{@html textToShow}</div>
    </div>
  {/if}
</div>

<style>
  .single-country-treemap {
    max-width: 929px;
  }

  .treemap-container {
    display: flex;
  }


  
  .country-title {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .country-title h3 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
  
  .subtitle {
    margin: 0;
    font-size: 14px;
    color: #666;
  }
  
  .treemap-container {
    display: flex;
    margin-top: 52px;
    padding: 24px 24px 48px;
    gap: 48px;
  }
  
  .treemap-container .country-name {
    color: #1E1E1E;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    line-height: 21.6px; /* 135% */
    margin-bottom: 8px;
  }

  .treemap-container svg {
    box-shadow: 0 1px 6.6px rgba(0, 0, 0, 0.25);
  }


  .treemap-container .annotation {
    color: #1E1E1E;
    font-family: Roboto;
    font-size: 16px;
    max-width: 290px;
    font-style: normal;
    padding: 45px 10px;
    font-weight: 400;
    line-height: 21.6px; /* 135% */
  }

  .background {
    transition: all 0.2s ease;
  }
  
  .tile {
    stroke: transparent;
    stroke-width: 0.5;
    transition: all 0.2s ease;
    cursor: pointer;
    outline: none;
  }
  
  .tile:hover {
    stroke: #333;
    stroke-width: 2;
    filter: brightness(1.1);
  }
  
  .tile--selected {
    stroke: #333;
    stroke-width: 3;
    filter: brightness(1.2);
  }
  
  .tile--hide {
    opacity: 0.3;
  }
  
  .tile-label {
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .legend {
    margin-top: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .legend h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .legend-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .legend-item:hover {
    background-color: #e9ecef;
  }
  
  .legend-item--selected {
    background-color: #e9ecef;
    font-weight: 600;
  }
  
  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    border: 1px solid #ddd;
  }
  
  .legend-label {
    font-size: 14px;
    color: #333;
  }
  
  .leaf--hide {
    opacity: 0.2;
  }

  .leaf--shadow {
    filter: drop-shadow( 0 0 3px rgba(0, 0, 0, 1));
  }
  
  @media (max-width: 768px) {
    .legend-items {
      grid-template-columns: 1fr;
    }
    
    .country-title h3 {
      font-size: 20px;
    }
  }
</style>
