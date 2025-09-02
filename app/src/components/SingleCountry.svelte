<script lang="ts">
  import { colorSectors, colorFuels } from "src/colors";
  import Legend from 'src/components/common/Legend.svelte';
  import { onMount } from 'svelte';

  // Props for the component
  export let countryCode: string = '';
  export let countryName: string = '';
  export let dataType: 'sectors' | 'fuels' = 'sectors';
  export let pollutionData: Array<{type: string, value: number}> = [];
  export let totalValue: number = 0;
  export let valueType: 'number' | 'percentage' = 'number';
  export let showLegend: boolean = true;
  export let showChart: boolean = true;
  export let showDetails: boolean = true;

  // Internal state
  let selectedSector: string = '';
  let hoveredSector: string = '';
  let chartWidth: number = 300;
  let chartHeight: number = 200;
  let containerElement: HTMLElement;

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

  // Create mapping between sector types and labels
  const pairLabels: {[key: string]: string} = {};
  legendOptions[dataType].selectionDictionary.forEach((element, index) => {
    pairLabels[element] = legendOptions[dataType].labels[index];
  });

  // Computed values
  $: sortedData = [...pollutionData].sort((a, b) => b.value - a.value);
  $: maxValue = sortedData.length > 0 ? sortedData[0].value : 0;
  $: selectedData = selectedSector ? pollutionData.filter(d => d.type === selectedSector) : pollutionData;

  // Methods
  function handleSectorClick(sectorType: string) {
    selectedSector = selectedSector === sectorType ? '' : sectorType;
  }

  function handleSectorHover(sectorType: string) {
    hoveredSector = sectorType;
  }

  function handleSectorLeave() {
    hoveredSector = '';
  }

  function getSectorColor(sectorType: string): string {
    const colorIndex = legendOptions[dataType].selectionDictionary.indexOf(sectorType);
    return colorIndex >= 0 ? legendOptions[dataType].colors[colorIndex] : '#ccc';
  }

  function formatValue(value: number): string {
    if (valueType === 'percentage') {
      return `${((value / totalValue) * 100).toFixed(1)}%`;
    }
    return `${value.toFixed(2)} µg/m³`;
  }

  function getTooltipText(sector: {type: string, value: number}): string {
    const sectorName = pairLabels[sector.type] || sector.type;
    const value = formatValue(sector.value);
    const percentage = ((sector.value / totalValue) * 100).toFixed(1);
    
    return `${sectorName}: ${value} (${percentage}%)`;
  }

  // Lifecycle
  onMount(() => {
    if (containerElement) {
      const resizeObserver = new ResizeObserver(() => {
        if (containerElement) {
          chartWidth = containerElement.clientWidth;
          chartHeight = chartWidth * 0.6;
        }
      });
      resizeObserver.observe(containerElement);
      return () => resizeObserver.disconnect();
    }
  });
</script>

<div class="single-country" bind:this={containerElement}>
  <!-- Header -->
  <div class="country-header">
    <h3 class="country-name">{countryName || countryCode}</h3>
    {#if totalValue > 0}
      <div class="total-value">
        Total: <strong>{formatValue(totalValue)}</strong>
      </div>
    {/if}
  </div>

  <!-- Legend -->
  {#if showLegend}
    <div class="legend-section">
      <Legend
        title={legendOptions[dataType].title}
        colors={legendOptions[dataType].colors}
        labels={legendOptions[dataType].labels}
        type={'categorical'}
        bind:selected={selectedSector}
      />
    </div>
  {/if}

  <!-- Chart Section -->
  {#if showChart && pollutionData.length > 0}
    <div class="chart-section">
      <div class="chart-container" style="width: {chartWidth}px; height: {chartHeight}px;">
        <svg width={chartWidth} height={chartHeight} class="country-chart">
          <!-- Background -->
          <rect width={chartWidth} height={chartHeight} fill="#f9f9f9" rx="4"/>
          
          <!-- Chart title -->
          <text x={chartWidth/2} y="20" text-anchor="middle" class="chart-title">
            {dataType === 'sectors' ? 'Sector Contribution' : 'Fuel Type Contribution'}
          </text>

          <!-- Data visualization -->
          {#each selectedData as sector, i}
            {@const barWidth = chartWidth * 0.8}
            {@const barHeight = (chartHeight - 60) / selectedData.length}
            {@const x = chartWidth * 0.1}
            {@const y = 40 + (i * barHeight)}
            {@const width = (sector.value / maxValue) * barWidth}
            {@const color = getSectorColor(sector.type)}
            {@const isSelected = selectedSector === '' || selectedSector === sector.type}
            {@const isHovered = hoveredSector === sector.type}
            
            <g class="chart-bar" 
               class:selected={isSelected}
               class:hovered={isHovered}
               on:click={() => handleSectorClick(sector.type)}
               on:mouseenter={() => handleSectorHover(sector.type)}
               on:mouseleave={handleSectorLeave}>
              
              <!-- Bar -->
              <rect 
                x={x} 
                y={y + 5} 
                width={width} 
                height={barHeight - 10} 
                fill={color}
                rx="3"
                opacity={isSelected ? 1 : 0.3}
                stroke={isHovered ? "#333" : "transparent"}
                style="stroke-width: {isHovered ? '2' : '0'}"
              />
              
              <!-- Label -->
              <text 
                x={x + 5} 
                y={y + barHeight/2 + 4} 
                class="bar-label"
                opacity={isSelected ? 1 : 0.5}>
                {pairLabels[sector.type] || sector.type}
              </text>
              
              <!-- Value -->
              <text 
                x={x + width + 5} 
                y={y + barHeight/2 + 4} 
                class="bar-value"
                opacity={isSelected ? 1 : 0.5}>
                {formatValue(sector.value)}
              </text>
            </g>
          {/each}
        </svg>
      </div>
    </div>
  {/if}

  <!-- Details Section -->
  {#if showDetails && pollutionData.length > 0}
    <div class="details-section">
      <h4>Detailed Breakdown</h4>
      <div class="data-table">
        {#each sortedData as sector}
          {@const isSelected = selectedSector === '' || selectedSector === sector.type}
          {@const isHovered = hoveredSector === sector.type}
          
          <div class="data-row" 
               class:selected={isSelected}
               class:hovered={isHovered}
               on:click={() => handleSectorClick(sector.type)}
               on:mouseenter={() => handleSectorHover(sector.type)}
               on:mouseleave={handleSectorLeave}>
            
            <div class="sector-info">
              <div class="color-indicator" style="background-color: {getSectorColor(sector.type)}"></div>
              <span class="sector-name">{pairLabels[sector.type] || sector.type}</span>
            </div>
            
            <div class="sector-values">
              <span class="sector-value">{formatValue(sector.value)}</span>
              <span class="sector-percentage">
                {((sector.value / totalValue) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- No Data Message -->
  {#if pollutionData.length === 0}
    <div class="no-data">
      <p>No pollution data available for this country.</p>
    </div>
  {/if}
</div>

<style>
  .single-country {
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 0 auto;
  }

  .country-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
  }

  .country-name {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
    font-weight: 600;
  }

  .total-value {
    font-size: 1.1rem;
    color: #666;
  }

  .legend-section {
    margin-bottom: 25px;
  }

  .chart-section {
    margin-bottom: 25px;
  }

  .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fafafa;
    border-radius: 8px;
    padding: 20px;
  }

  .country-chart {
    background: white;
    border-radius: 4px;
  }

  .chart-title {
    font-size: 14px;
    font-weight: 600;
    fill: #333;
  }

  .chart-bar {
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .chart-bar.selected {
    opacity: 1;
  }

  .chart-bar:hovered {
    opacity: 1;
  }

  .bar-label {
    font-size: 11px;
    fill: #333;
    font-weight: 500;
  }

  .bar-value {
    font-size: 11px;
    fill: #666;
    font-weight: 500;
  }

  .details-section h4 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1.1rem;
  }

  .data-table {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .data-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }

  .data-row:hovered {
    background-color: #f8f9fa;
    border-color: #e9ecef;
  }

  .data-row.selected {
    background-color: #e3f2fd;
    border-color: #2196f3;
  }

  .sector-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .color-indicator {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid #ddd;
  }

  .sector-name {
    font-weight: 500;
    color: #333;
  }

  .sector-values {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .sector-value {
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
  }

  .sector-percentage {
    font-size: 0.8rem;
    color: #666;
  }

  .no-data {
    text-align: center;
    padding: 40px 20px;
    color: #666;
  }

  .no-data p {
    margin: 0;
    font-size: 1.1rem;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .single-country {
      padding: 15px;
      margin: 10px;
    }

    .country-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .chart-container {
      padding: 15px;
    }

    .data-row {
      padding: 8px 12px;
    }
  }
</style>
