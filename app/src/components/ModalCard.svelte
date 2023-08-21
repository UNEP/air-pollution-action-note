<script lang="ts">
  import AgreementCarto from "./AgreementCarto.svelte";
  import svg from "src/svg";
  import type { AgreementName } from "src/types";
  import { createEventDispatcher } from 'svelte';
  import { colorAgreementTypes, colorAgreementSimpleType} from "src/colors";
  import Legend from "./common/Legend.svelte";

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


  $: legendOptions = agreementsWithObservers.includes(tilegram) 
    ? legendOptionsWithObservers 
    : legendOptionsSimple;
  
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
      {@html body}
      {#if link}
        <div class="link">
          <span class="icon">{@html svg.menu.policies}</span>
          <a href={link} target="_blank" rel=”noreferrer”>Read the agreement</a>
        </div>
      {/if}
    </div>
    <div class="tilegram">
      <AgreementCarto agreement={tilegram} popupVersion />
      <div class="legend">
        <Legend
          title={legendOptions.title}
          colors={legendOptions.colors}
          labels={legendOptions.labels}
          type={legendOptions.type}
          selected={null}
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
    width: 64rem;
    border-radius: 0.3rem;
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
    width: 56rem;
    margin-top: 2rem;
    gap: 2rem;
    line-height: 1.5rem;
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

</style>