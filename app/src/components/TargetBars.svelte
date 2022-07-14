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

<!--<div class="grid-bars-container2">

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
    
</div>-->

<div class="grid-bars-container">
  {#each Array(4) as _, i}
    {#if value===indexToCategory[i]}
      <div class="new-tile"
        class:no-data={value===4} 
        class:not-met={value===3} 
        class:on-track={value===2} 
        class:target-met={value===1}
      />
    {:else}
      <div class="new-tile unknown"/>
    {/if}
  {/each}  
</div>


<style>

  .new-tile {
    max-width: 79px;
    margin-left: 2.5px;
    margin-right: 2.5px;
    width: 22.5%;
    height: 24px;
    border-radius: 3.5px;
    border: 1px solid #73AD21;
    background-color: #6791B1;
  }

  .target-met {
    background-color: #1C477E;
    border: 1px solid #163863;
  }

  .on-track {
    background-color: #6791B1;
    border: 1px solid #1C477E;
  }

  .not-met {
    background-color: #F7CD6E;
    border: 1px solid #BF8603;
  }

  .no-data {
    background-color: #BDBDBD;
    border: 1px solid #999999;
  }

  .unknown {
    background-color: transparent;
    border: 1px solid #999999;
  }

  .grid-bars-container {
    display: flex;
  }

    
</style>