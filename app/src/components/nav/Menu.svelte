<script lang="ts">
  import svg, {alignment} from 'src/svg';
  import MenuSpy from "src/components/nav/menuspy";
  import { onMount } from "svelte";
  import * as animateScroll from "svelte-scrollto";
  import type {MenuSpyParams} from 'src/components/nav/menuspy';
  import type { Content } from 'src/types';
  import { strToId } from 'src/util';

  export let content: Content[];

  const options = content
    .filter(c => c.menu)
    .map(c => ({
      title: c.menu,
      id: strToId(c.menu),
      icon: c.icon
    }));

  var elm : Element;
  var ms : MenuSpy;
  var msParams : MenuSpyParams = {
    menuItemSelector : 'div[href^="#"]',
    activeClass: 'active',
    threshold: 600,
    enableLocationHash: false,
    hashTimeout: 0,
    callback: null
  };
  let width: number;
  let smallScreen: boolean;

  onMount(() => {
    elm = document.querySelector('#main-menu');
    ms = new MenuSpy(elm, msParams);
    getScreen();
  });

  function getScreen () {
    smallScreen = width < 1200;
  }

</script>

<svelte:window bind:innerWidth={width} on:resize={getScreen}/>
<nav class="mainnavbuttons margin-breakout-mobile" id="main-menu">
  {#each options as option, i}
    <button
      class={i === 0 ? "active" : ""}
      on:click=
      {
        animateScroll.scrollTo({
          element: `#${option.id}`,
          offset: smallScreen ? -24 : 24,
          onStart: () => {
            ms.activateItem(ms.scrollItems[i]);
            ms.dissableUpdate();
          },
          onDone: () => { ms.enableUpdate(); ms.tick(); }
        })
      }
    >
      <div class="buttoncontent" href='#{option.id}' id="{option.id}div">
        <div class="icon" style={alignment[option.icon] || ''}>{@html svg.menu[option.icon]}</div>
        <div class="text-container">
          <div class="text">{option.title}</div>
        </div>
      </div>

    </button>
  {/each}
</nav>

<style>

  .mainnavbuttons {
    position: sticky;
    top:0;
    left: 100%;
    z-index: 6;
    width: 210px;
    border-top: 1px solid #DCDCDC;
  }

  button {
    width: 100%;
    height: 44px;
    border: none;
    outline: none;
    padding: 0;
    border-bottom: 2px solid #DCDCDC;
    border-right: 2px solid #DCDCDC;
    border-left: 2px solid #DCDCDC;
    cursor: default;
    background-color:#f9f9f9;
    box-sizing: content-box;
  }

  .buttoncontent {
    width: 100%;
    height: 100%;
    height: 100%;
    box-sizing: border-box;
    align-items: center;
  }

  .text-container {
    padding-left: 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    text-align: left;
    margin-left: 10px;
    height: 100%;
  }

  .icon {
    float: left;
    width: 36px;
    height: 36px;
    margin: 4px 7px;
    z-index: 2;
  }

  button:not(.active){
    cursor: pointer;
  }
  .active .icon :global(svg *){
    stroke: #e5e5e5;
  }

  .active .text {
    color: #e0e0e0;
  }

  .active{
    background-color: #181818;
  }



  @media (hover : hover) and (pointer : fine){
    button:hover:not(.active) :global(svg *){
      stroke: #e5e5e5;
    }

    button:hover:not(.active)  .text{
      color: #e5e5e5;
    }

    button:hover:not(.active) {
      background-color: #555;
    }
  }

  @media (min-width: 1200px) {
    .mainnavbuttons {
      margin-right: -215px;
    }
  }

  @media (max-width: 1200px) {

    .text-container{
      display: none;
    }
    .active .text-container{
      display: flex;

    }

    .text {
      opacity: 0;
    }
    .active .text{
      opacity: 0;
      animation: fadeIn 300ms forwards;
      animation-delay: 150ms;
    }

    .mainnavbuttons {
      display: flex;
      float: none;
      right: 0;
      width: 100%;
      border-top: none;
      border-left: 1px solid #DCDCDC;
    }

    button {
      flex-grow: 0;
      flex-shrink: 1;
      flex-basis: 50px;
      transition: flex 500ms cubic-bezier(0.190, 1.000, 0.220, 1.000);
      border-top: 1px solid #DCDCDC;
      border-left:none;
    }

    button.active {
      flex-grow: 1;
    }

    button .buttoncontent {
      width: 100% !important;
      transition: background-color 300ms, border-color 300ms;
    }
  }

  @media (max-width: 600px) {
    .mainnavbuttons {
      width: auto;
      left: auto;
    }
  }

  @media (max-width: 319px) {
    .active .text-container{
      display: none;
    }
  }
  @media (max-width: 400px) {

    button {
      flex-basis: 44px;
    }
    .icon {
      width: 30px;
      height: 30px;
      margin: 7px 7px;
    }
    .text {
      font-size: 0.9rem;
    }
  }
  @media (min-width: 1200px){
    .mainnavbuttons {
      height: 0;
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>