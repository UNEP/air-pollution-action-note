<script lang="ts">
  import AgreementCarto from "./AgreementCarto.svelte";
  import Legend from "./common/Legend.svelte";
  import svg from "src/svg";
  import type { AgreementName } from "src/types";
  import { createEventDispatcher } from 'svelte';
  import { colorAgreementTypes, colorAgreementSimpleType} from "src/colors";

  export let title: string;
  export let body: string;
  export let tilegram: AgreementName;
  export let link: string;

  const agreementsWithObservers = ["asean-trans", "rapap"];

  const legendOptionsWithObservers = {
    title: "Agreement status",
    colors: colorAgreementTypes.range(),
    labels: colorAgreementTypes.domain(),
    type: "categorical"
  };

  const legendOptionsSimple = {
    title: "Agreement status",
    colors: colorAgreementSimpleType.range(),
    labels: colorAgreementSimpleType.domain(),
    type: "categorical"
  };

  const dispatch = createEventDispatcher();

  function onClickClose() {
    dispatch('modalClosed');
  }

  let selected: number = undefined;
  let selectedCategory: number;

  $: legendOptions = agreementsWithObservers.includes(tilegram) 
    ? legendOptionsWithObservers 
    : legendOptionsSimple;

  $: selectedCategory = (selected === 0) ? 1 : (selected === 1) ? 2 : undefined;
  
</script>

<div class="modal-card">
  <button class="close-button" on:click={onClickClose}>
    {@html svg.close}
  </button>

  <div class="modal-header">
    {@html title}
  </div>

  <div class="content-container">
    <div class="text">
      <div class="scrollable">
        {@html body}
        <div class="scroll-gradient" />
      </div>
      {#if link}
        <div class="link">
          <span class="icon">{@html svg.menu.policies}</span>
          <a href={link} target="_blank" rel=”noreferrer”>Read the agreement</a>
        </div>
      {/if}
    </div>
    <div class="tilegram">
      <AgreementCarto agreement={tilegram} category={selectedCategory}/>
      <div class="legend">
        <Legend
          title={legendOptions.title}
          colors={legendOptions.colors}
          labels={legendOptions.labels}
          type={legendOptions.type}
          bind:selected
       />
      </div>
    </div>
  </div>
</div>

<style lang="scss">

  .modal-card {
    background-color: #FFFFFF;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.20);
    padding: 3.5rem;
    box-sizing: border-box;
    max-width: 64rem;
    margin-right: 2rem;
    border-radius: 0.3rem;
  }
  .scrollable {
    position: relative;
    width: 100%;
  }

  .scrollable::-webkit-scrollbar {
    width: 1px;
  }
  .scrollable::-webkit-scrollbar-track {
    background: #D9D9D9;
    width: 1px;
  }
  .scrollable::-webkit-scrollbar-thumb {
    background: #505050;
    width: 1px;
  }

  .scroll-gradient {
    display: none;
  }

  .legend {
    margin-top: -3.5rem;
    margin-left: 1rem;
  }

  .link {
    color: #505050;
    font-weight: 300;
    display: block;
    box-sizing: border-box;
    height: 2.25rem;
    margin-top: 1.5rem;
    margin-left: -0.4rem;
    .icon {
      float: left;
      width: 2.25rem;
      height: 2.25rem;
    }
    a {
      display: inline-flex;
      margin-top: 0.5rem;
      height: 1.25rem;
    }
  }

  .text {
    line-height: 1.5rem;
  }
  .text,
  .tilegram {
    width: 50%;
  }

  .content-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 2rem;
    gap: 2rem;
  }

  .close-button {
    cursor: pointer;
    float: right;
    border: none;
    background: none;
    margin-top: -1.75rem;
    margin-right: -1.75rem;
  }

  .close-button :global(svg) {
    transition: ease-out 0.2s;
  }

  .close-button:hover :global(svg) {
    transform: scale(1.25);
  }

  @media(max-width: 768px) {
    .tilegram {
      width: 100%;
    }
    .tilegram :global(.agreement-cartogram) {
      pointer-events: none;
    }
    .content-container {
      flex-direction: column;
    }
    .scroll-gradient {
      display: block;
      position: sticky;
      pointer-events: none;
      user-select: none;
      left: inherit;
      right: inherit;
      bottom: 0;
      height: 2.5rem;
      width: 100%;
      background: linear-gradient(to bottom, transparent, #FFFFFF);
    }
    .text {
      width: 100%;
      height: 100%;
    }    
    .scrollable {
      height: 8rem;
      width: 85%;
      padding-right: calc(15% - 1rem);
      overflow-y: scroll;
    }
    .modal-card {
      width: calc(100% - 2rem);
      margin-right: 0;
      padding: 2rem;
    }
    .close-button {
      margin-right: 0;
      margin-top: 0;
    }
    .modal-header {
      width: 85%;
    }
    .legend {
      margin-left: 0;
      margin-top: -3rem;
    }
    .legend :global(.note) {
      font-size: 0.8125rem !important;
    }
  }

  @media(max-width: 400px) {
    .modal-card {
      width: calc(100% - 1rem);
    }
  }

</style>