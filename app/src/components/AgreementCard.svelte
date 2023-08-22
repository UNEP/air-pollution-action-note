<script lang="ts">
  import type { AgreementName } from 'src/types';
  import AgreementCarto from './AgreementCarto.svelte';
  import { createEventDispatcher } from 'svelte';

  export let title: string;
  export let tilegram: AgreementName;
  export let selected = false;
  export let simple = false;

  const dispatch = createEventDispatcher();

  function onClick() {
		dispatch('agreementClicked');
  }
</script>

<button class="card" class:selected on:click={onClick}>
  <span class="text">{@html title}</span>
  {#if !simple}
    <div class="tilegram">
      <img src={`img/agreements/${tilegram}.png`} alt={tilegram} />
    </div>
  {:else}
    <div class="status-band" />
  {/if}
</button>

<style lang="scss">

  .card {
    position: relative;
    border-radius: 6px;
    border: 1px solid #EFEFEF;
    display: flex;
    flex-direction: column;
    width: 15.75rem;
    padding: 1.25rem;
    gap: 1.25rem;
    transition: ease-out 0.2s;
    margin-bottom: 0.25rem;
    margin-right: 0.25rem;
    background: none;
    font: inherit;
    text-align: left;
    cursor: pointer;

    .text {
      height: 9rem;
      line-height: 1.5rem !important;
    }

    .tilegram {
      height: 7rem;
      img {
        height: 7rem; 
        width: 100%;
      }
    }
  }

  .status-band {
    height: 0.3rem;
    width: 100%;
    border-radius: 0px 0px 5px 5px;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .card:hover,
  .selected {
    border: 1px solid #BDBDBD;
  }

</style>