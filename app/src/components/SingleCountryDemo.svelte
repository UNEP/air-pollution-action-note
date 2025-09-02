<script lang="ts">
  import SingleCountry from './SingleCountry.svelte';

  // Sample data for demonstration
  const sampleSectorData = [
    { type: 'residential', value: 4.26 },
    { type: 'transport', value: 1.54 },
    { type: 'industry', value: 1.20 },
    { type: 'energy', value: 2.11 },
    { type: 'agriculture', value: 0.55 },
    { type: 'waste', value: 0.82 },
    { type: 'windblowndust', value: 22.57 },
    { type: 'otherfires', value: 4.90 }
  ];

  const sampleFuelData = [
    { type: 'coal', value: 15.2 },
    { type: 'liquid', value: 8.7 },
    { type: 'solidbio', value: 12.1 },
    { type: 'process', value: 3.4 }
  ];

  let selectedDataType: 'sectors' | 'fuels' = 'sectors';
  let selectedValueType: 'number' | 'percentage' = 'number';
  let showLegend = true;
  let showChart = true;
  let showDetails = true;

  $: currentData = selectedDataType === 'sectors' ? sampleSectorData : sampleFuelData;
  $: totalValue = currentData.reduce((sum, item) => sum + item.value, 0);
</script>

<div class="demo-container">
  <h2>SingleCountry Component Demo</h2>
  
  <!-- Controls -->
  <div class="controls">
    <div class="control-group">
      <label>
        <input type="radio" bind:group={selectedDataType} value="sectors">
        Sectors Data
      </label>
      <label>
        <input type="radio" bind:group={selectedDataType} value="fuels">
        Fuels Data
      </label>
    </div>
    
    <div class="control-group">
      <label>
        <input type="radio" bind:group={selectedValueType} value="number">
        Absolute Values (µg/m³)
      </label>
      <label>
        <input type="radio" bind:group={selectedValueType} value="percentage">
        Percentages
      </label>
    </div>
    
    <div class="control-group">
      <label>
        <input type="checkbox" bind:checked={showLegend}>
        Show Legend
      </label>
      <label>
        <input type="checkbox" bind:checked={showChart}>
        Show Chart
      </label>
      <label>
        <input type="checkbox" bind:checked={showDetails}>
        Show Details Table
      </label>
    </div>
  </div>

  <!-- SingleCountry Component -->
  <SingleCountry
    countryCode="USA"
    countryName="United States"
    dataType={selectedDataType}
    pollutionData={currentData}
    totalValue={totalValue}
    valueType={selectedValueType}
    {showLegend}
    {showChart}
    {showDetails}
  />

  <!-- Usage Instructions -->
  <div class="usage-info">
    <h3>Usage Instructions</h3>
    <p>This component can be used to display detailed pollution data for individual countries. It includes:</p>
    <ul>
      <li><strong>Interactive Legend:</strong> Click on legend items to filter the data</li>
      <li><strong>Bar Chart:</strong> Visual representation of pollution data by sector/fuel type</li>
      <li><strong>Detailed Table:</strong> Clickable rows showing exact values and percentages</li>
      <li><strong>Responsive Design:</strong> Adapts to different screen sizes</li>
    </ul>
    
    <h4>Props:</h4>
    <ul>
      <li><code>countryCode</code>: ISO country code (e.g., "USA")</li>
      <li><code>countryName</code>: Full country name (e.g., "United States")</li>
      <li><code>dataType</code>: Either "sectors" or "fuels"</li>
      <li><code>pollutionData</code>: Array of &#123;type, value&#125; objects</li>
      <li><code>totalValue</code>: Sum of all pollution values</li>
      <li><code>valueType</code>: "number" for absolute values, "percentage" for relative</li>
      <li><code>showLegend</code>: Boolean to show/hide legend</li>
      <li><code>showChart</code>: Boolean to show/hide chart</li>
      <li><code>showDetails</code>: Boolean to show/hide details table</li>
    </ul>
  </div>
</div>

<style>
  .demo-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
  }

  .demo-container h2 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }

  .controls {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .control-group {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .control-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: 500;
  }

  .control-group input[type="radio"],
  .control-group input[type="checkbox"] {
    margin: 0;
  }

  .usage-info {
    margin-top: 40px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .usage-info h3 {
    color: #333;
    margin-top: 0;
  }

  .usage-info h4 {
    color: #555;
    margin-top: 20px;
  }

  .usage-info ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  .usage-info li {
    margin: 5px 0;
    line-height: 1.5;
  }

  .usage-info code {
    background: #e9ecef;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }

  @media (max-width: 768px) {
    .control-group {
      flex-direction: column;
      gap: 10px;
    }
    
    .demo-container {
      padding: 15px;
    }
  }
</style>
