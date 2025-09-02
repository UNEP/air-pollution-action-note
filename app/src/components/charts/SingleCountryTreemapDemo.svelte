<script lang="ts">
  import SingleCountryTreemapSVG from './SingleCountryTreemapSVG.svelte';
  
  // Sample data for demonstration
  const sampleSectorsData = [
    { type: 'residential', value: 21.0 },
    { type: 'industry', value: 12.1 },
    { type: 'energy', value: 10.2 },
    { type: 'transport', value: 5.5 },
    { type: 'agriculture', value: 7.7 },
    { type: 'afciddust', value: 9.4 },
    { type: 'waste', value: 3.4 },
    { type: 'windblowndust', value: 2.8 },
    { type: 'otherfires', value: 0.8 },
    { type: 'agrwasteburning', value: 0.8 },
    { type: 'commercial', value: 1.6 },
    { type: 'othercombustion', value: 2.5 },
    { type: 'intlshipping', value: 0.6 },
    { type: 'solvents', value: 0.3 },
    { type: 'remainingsources', value: 3.1 }
  ];
  
  const sampleFuelsData = [
    { type: 'process', value: 45.2 },
    { type: 'liquid', value: 28.7 },
    { type: 'coal', value: 18.9 },
    { type: 'solidbio', value: 7.2 }
  ];
  
  const totalSectorsValue = sampleSectorsData.reduce((sum, item) => sum + item.value, 0);
  const totalFuelsValue = sampleFuelsData.reduce((sum, item) => sum + item.value, 0);
  
  let currentDataType: 'sectors' | 'fuels' = 'sectors';
  let currentValueType: 'number' | 'percentage' = 'number';
</script>

<div class="demo-container">
  <h1>Single Country Treemap Demo</h1>
  
  <div class="controls">
    <label>
      Data Type:
      <select bind:value={currentDataType}>
        <option value="sectors">Sectors</option>
        <option value="fuels">Fuels</option>
      </select>
    </label>
    
    <label>
      Value Type:
      <select bind:value={currentValueType}>
        <option value="number">Absolute Values</option>
        <option value="percentage">Percentages</option>
      </select>
    </label>
  </div>
  
  <div class="treemap-section">
    <h2>India - Air Pollution by {currentDataType === 'sectors' ? 'Sectors' : 'Fuel Types'}</h2>
    
    <SingleCountryTreemapSVG
      countryCode="IND"
      countryName="India"
      dataType={currentDataType}
      pollutionData={currentDataType === 'sectors' ? sampleSectorsData : sampleFuelsData}
      totalValue={currentDataType === 'sectors' ? totalSectorsValue : totalFuelsValue}
      valueType={currentValueType}
      width={400}
      height={400}
      showLegend={true}
      showCountryName={true}
    />
  </div>
</div>

<style>
  .demo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }
  
  h2 {
    color: #444;
    margin-bottom: 20px;
  }
  
  h3 {
    color: #555;
    margin-bottom: 15px;
  }
  
  .controls {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    justify-content: center;
    align-items: center;
  }
  
  .controls label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }
  
  .controls select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .treemap-section {
    margin-bottom: 40px;
    text-align: center;
  }
  
  .info-section {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 8px;
    margin-top: 30px;
  }
  
  .info-section ul {
    margin-bottom: 20px;
    padding-left: 20px;
  }
  
  .info-section li {
    margin-bottom: 8px;
    color: #555;
  }
  
  .info-section pre {
    background: #2d3748;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .info-section code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
  
  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
      gap: 15px;
    }
    
    .demo-container {
      padding: 15px;
    }
  }
</style>
