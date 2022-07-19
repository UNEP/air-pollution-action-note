<script lang="ts">
  export let value: number;
  export let selected: number = null;

  const indexToCategory = {
    3: 1,
    2: 3,
    1: 2,
    0: 4
  }

</script>

<div class="grid-bars-container">
  {#each Array(4) as _, i}
    {#if value===indexToCategory[i] && (selected===null || indexToCategory[selected]===value)}
      <div class="bar-tile"
        class:no-data={value===4} 
        class:not-met={value===2} 
        class:on-track={value===3} 
        class:target-met={value===1}
      />
    {:else}
      <div class="bar-tile unknown"/>
    {/if}
  {/each}  
</div>


<style>

  .bar-tile {
    max-width: 79px;
    margin-left: 2.5px;
    margin-right: 2.5px;
    width: 22.5%;
    height: 24px;
    border-radius: 3.5px;
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