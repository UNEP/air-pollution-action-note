<script lang="ts">
  import { colorPM25 } from "src/colors";
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  export let index: number = 0;
  export let texts: string[] = []

  let colors = colorPM25.range().reverse();
  const dispatch = createEventDispatcher()

  const onClickFn = ((_index) => {
    dispatch('indexChanged', {
      index: _index
    });
  })
</script>

<div class="range-container">
  {#each { length: colors.length } as _, i }
    <div class="range-element" class:selected={index === i} style="background-color: {colors[i]};" on:click={() => onClickFn(i)}>
      {#if index === i}
        <div class="range-element-text" transition:fade>
          {texts[i]}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .range-container {
    width: 45px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    position: relative;
  }

  .range-element {
    width: 20px;
    height: 75px;
    display: grid;
    place-items: center;
    transition: all 0.2s ease-in;
    cursor: pointer;
  }

  .selected {
    border: 1px solid black;
    width: 40px;
  }
</style>

