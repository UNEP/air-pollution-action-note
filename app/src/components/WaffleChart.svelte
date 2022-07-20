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
  
    const causes = {
      'stroke': {component: IconsStroke, name: 'Stroke'},
      'ischemic': {component: IconsIhd, name: 'Ischemic heart disease'},
      'lungcancer': {component: IconsTblc, name: 'Tracheal, bronchus, and lung cancer'},
      'lri': {component: IconsLri, name: 'Lower respiratory infections'},
      'copd': {component: IconsCopd, name: 'Chronic obstructive pulmonary disease'},
      'diabetes': {component: IconsDmt2, name: 'Type 2 diabetes'},
      'nd': {component: IconsNd, name: 'Neonatal disorders'},
    };
  
  </script>
  
  
  <div class="container">
    <div class="top-icons">
      <svelte:component this={causes[cause].component}/>
    </div>
  
    <div class="waffle-container">
      {#each Array(100) as _, i}
        <div class="circle" class:highlight={i < Math.round(percentage * 100)}/>
      {/each}
    </div>
  
    <div class="percent-text">{(percentage * 100).toFixed(2)}<span class="symbol">%</span></div>
  
    <div class="cause-text">{causes[cause].name}</div>
  </div>
  
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
  
  </style>