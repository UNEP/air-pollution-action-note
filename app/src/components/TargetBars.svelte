<script lang="ts">

  import { colorPoliciesByCountry as ColorFn} from "src/colors";

  export let value: number;

  const indexToCategory = {
    3: 1,
    2: 2,
    1: 3,
    0: 4
  }

  const categories = {
    1: 'Target met',
    2: 'On track',
    3: 'Not met',
    4: 'No data'
  }

</script>

<div class="grid-bars-container2">

  {#each Array(4) as _, i}
    <svg class="col2" width="80" height="24">
      {#if value===indexToCategory[i]}
        <rect x="0.5" y="0.5" width="79" height="23" rx="3.5" 
          class:no-data={value===4} 
          class:not-met={value===3} 
          class:on-track={value===2} 
          class:target-met={value===1}
        />
      {:else}
        <rect x="0.5" y="0.5" width="79" height="23" rx="3.5" stroke="#999999" fill="none"/>
      {/if}
    </svg>
  {/each}  
    
</div>


<style>

  .target-met {
    fill: #1C477E;
    stroke: #163863;
  }

  .on-track {
    fill: #6791B1;
    stroke: #1C477E;
  }

  .not-met {
    fill: #F7CD6E;
    stroke: #BF8603;
  }

  .no-data {
    fill: #BDBDBD;
    stroke: #999999;
  }

  .grid-bars-container {
    display: grid;
    grid-template-columns: 80px 80px 80px 80px;
    gap: 5px;
  }

  .grid-bars-container2 {
    display: flex;
    justify-content: space-between;
  }

  .col2{
    width: 25%;
  }
    
</style>