<script lang="ts" context="module">

  export type DeathsData = {
    copd: number,
    diabetes: number,
    ischemic: number,
    lungcancer: number,
    lri: number,
    stroke: number,
    nd: number
  }

</script>


<script lang="ts">
  import WaffleChart from "./WaffleChart.svelte";
  import WorldMeanDeaths from "../data/worldMean_deaths.json"

  export let data: DeathsData = WorldMeanDeaths;

</script>
  
  <div class="flex-container">
    <WaffleChart percentage={data.stroke} cause={'stroke'}/>
    <WaffleChart percentage={data.ischemic} cause={'ischemic'}/>
    <WaffleChart percentage={data.lungcancer} cause={'lungcancer'}/>
    <WaffleChart percentage={data.lri} cause={'lri'}/>
    <WaffleChart percentage={data.copd} cause={'copd'}/>
    <WaffleChart percentage={data.diabetes} cause={'diabetes'}/>
    <WaffleChart percentage={data.nd} cause={'nd'}/>
  </div>
  
  <style>
  
    .flex-container {
      display: flex;
      flex-direction: row;
      gap: 10px;
      row-gap: 20px;
      flex-wrap: wrap;
    }
  
  </style>