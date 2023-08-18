<script lang="ts">
  import type { AgreementName } from 'src/types';
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
      <img src="img/AgreementCartogramMockup.png" alt={tilegram}/>
    </div>
  {/if}
</button>

<style lang="scss">

  .card {
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
    }
  }

  .card:hover,
  .selected {
    border: 1px solid #BDBDBD;
  }

</style>