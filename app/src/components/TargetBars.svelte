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

<div class="grid-bars-container">

  {#each Array(4) as _, i}
    <svg width="80" height="24">
      {#if !(value === 4 && i !== 0)}
        <rect 
          fill= "#E5E5E5"
          class:highlight2={value===indexToCategory[i]} 
          style="--bg-color: {ColorFn(categories[value])};" 
          width="80" 
          height="24" 
          rx="4"
        />
      {:else}
        <rect x="0.5" y="0.5" width="79" height="23" rx="3.5" stroke="#BDBDBD" fill="none"/>
      {/if}
    </svg>
  {/each} 
    
</div>
  

<style>

  .highlight2 {
    fill: var(--bg-color);
  }

  .grid-bars-container {
    display: grid;
    grid-template-columns: 80px 80px 80px 80px;
    gap: 5px;
  }
    
</style>