<script lang="ts">
  export let value: number;
  export let selected: number = null;

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

<div class="grid-bars-container">
  {#each Array(4) as _, i}
    {#if value===indexToCategory[i] && (selected===null || indexToCategory[selected]===value)}
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