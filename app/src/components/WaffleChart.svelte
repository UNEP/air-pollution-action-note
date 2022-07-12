<script lang="ts">

    import IconsCopd from "src/svg/icons_copd.svelte";
    import IconsDmt2 from "src/svg/icons_dmt2.svelte";
    import IconsIhd from "src/svg/icons_ihd.svelte";
    import IconsNd from "src/svg/icons_nd.svelte";
    import IconsStroke from "src/svg/icons_stroke.svelte";
    import IconsTblc from "src/svg/icons_tblc.svelte";
    import IconsLri from "src/svg/icons_lri.svelte";
  
    export let percentage: number = 1;
    export let cause: string = '494';
  
    const causes = {
      '494': {component: IconsStroke, name: 'Stroke'},
      '493': {component: IconsIhd, name: 'Ischemic heart disease'},
      '426': {component: IconsTblc, name: 'Tracheal, bronchus, and lung cancer'},
      '322': {component: IconsLri, name: 'Lower respiratory infections'},
      '509': {component: IconsCopd, name: 'Chronic obstructive pulmonary disease'},
      '976': {component: IconsDmt2, name: 'Diabetes mellitus type 2'},
      '380': {component: IconsNd, name: 'Neonatal disorders'},
    };
  
  </script>
  
  
  <div class="container">
    <div class="top-icons">
      <svelte:component this={causes[cause].component}/>
    </div>
  
    <div class="waffle-container">
      {#each Array(100) as _, i}
        <div class="circle" class:highlight={i < Math.round(percentage)}/>
      {/each}
    </div>
  
    <div class="percent-text">{percentage}<span class="symbol">%</span></div>
  
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
      background-color: #53367E;
    }
  
  </style>