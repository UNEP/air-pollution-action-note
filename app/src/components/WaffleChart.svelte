<script lang="ts">

    import IconsCopd from "src/svg/disease_icons/default/icons_copd.svelte";
    import IconsDmt2 from "src/svg/disease_icons/default/icons_dmt2.svelte";
    import IconsIhd from "src/svg/disease_icons/default/icons_ihd.svelte";
    import IconsNd from "src/svg/disease_icons/default/icons_nd.svelte";
    import IconsStroke from "src/svg/disease_icons/default/icons_stroke.svelte";
    import IconsTblc from "src/svg/disease_icons/default/icons_tblc.svelte";
    import IconsLri from "src/svg/disease_icons/default/icons_lri.svelte";
  
    export let percentage: number;
    export let cause: string;
    export let isOzone: boolean = false;
    export let isSingle: boolean = false;
  
    const causes = {
      'stroke': {component: IconsStroke, name: 'Stroke'},
      'ischemic': {component: IconsIhd, name: 'Ischemic heart disease'},
      'lungcancer': {component: IconsTblc, name: 'Tracheal, bronchus, and lung cancer'},
      'lri': {component: IconsLri, name: 'Lower respiratory infections'},
      'copd': {component: IconsCopd, name: 'Chronic obstructive pulmonary disease'},
      'diabetes': {component: IconsDmt2, name: 'Type 2 diabetes'},
      'nd': {component: IconsNd, name: 'Neonatal disorders'},
    };
    $: notAvailable = isOzone && cause !== 'copd';
    $: causeInfo = causes[cause];
    
    $: percentText = isOzone && !isSingle ? percentage.toFixed(0) : isOzone && Math.round(percentage) < 1 && percentage > 0 ? Number(percentage).toFixed(0) : Math.round(percentage);
    $: (isSingle) && console.log(percentage, percentText);
  </script>
  
  
  {#if causeInfo}
  <div class="container" role="graphics-document" class:disabled={notAvailable}>
    <div class="top-icons" role="graphics-object" aria-label="Icon for {causeInfo.name}">
      <svelte:component this={causeInfo.component}/>
    </div>

    <div class="waffle-container" role="graphics-object" aria-label="Chart displaying the percent of deaths from the disease attributable to air pollution (age-standardized)">
      {#each Array(100) as _, i}
        <div class="circle" class:highlight={i < Math.round(percentage)} class:highlight-ozone={isOzone && i < Math.round(percentage)} class:highlight-half-ozone={isOzone  && !isSingle && Number(percentage.toFixed(0))-i < 1 && Number(percentage.toFixed(0))-i > 0} />
      {/each}
    </div>

    <div class="percent-text">{notAvailable ? 'N/A' : percentText}<span class="symbol">{notAvailable ? '' : '%'}</span></div>

    <div class="cause-text">{causeInfo.name}</div>
  </div>
  {:else}
  <div class="container" role="graphics-document">
    <div class="cause-text">{cause}</div>
    <div class="percent-text">{notAvailable ? 'N/A' : percentText}<span class="symbol">{notAvailable ? '' : '%'}</span></div>
  </div>
  {/if}
  
  <style>
  
    .percent-text {
      font-size: 24px;
      font-weight: 300;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  
    .symbol {
      font-size: 15px;
      font-weight: inherit;
    }
  
    .cause-text {
      font-size: 15px;
      font-weight: 300;
    }
  
    .container {
      width: 99px;
    }
  
    .top-icons {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding-bottom: 15px;
      height: 63px;
    }
  
    .waffle-container {
      display: grid;
      gap: 1px;
      grid-template-columns: repeat(10, 9px);
    }
  
    .circle {
      border-radius: 50%;
      height: 9px;
      width: 9px;
      background-color: #D9D9D9;
    }
  
    .highlight {
      background-color: #800080;
    }

    .highlight-ozone {
      background-color: #E58124;
    }

    .highlight-half-ozone {
      background: linear-gradient(to right, #E58124 50%, #D9D9D9 50%);
    }
  
    :global(.disabled) {
      /* opacity: 0.5; */
      pointer-events: none;
    }

    :global(.disabled .top-icons svg path) {
      stroke: #D9D9D9;
    }
    :global(.disabled .waffle-container .circle) {
      background-color: #E9E9E9;
    }
    :global(.disabled .percent-text) {
      color: #BDBDBD;
    }
    :global(.disabled .cause-text) {
      color: #BDBDBD;
    }
  </style>