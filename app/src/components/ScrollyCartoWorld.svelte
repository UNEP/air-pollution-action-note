<script lang="ts">
  // @ts-ignore
  import Scroller from "@sveltejs/svelte-scroller";
  import type { Content, TextBlock } from "src/types";
  import CartoWorld from "./CartoWorld.svelte";
  import Embed from "./Embed.svelte";
  import RangeItReduction from "./RangeITReduction.svelte";
  import * as animateScroll from "svelte-scrollto";
  import LoadingBar from "./LoadingBar.svelte";
  import Tooltip from "./Tooltip.svelte";

  export var data;
  export var id: string;
  export var block: Content;
  export var head: string;
  export var text: TextBlock[];
  export var embed: string = "a";
  export var isEmbed: boolean;

  let index: number;
  let offset: number;
  let progress: number;
  let cartogramAnnotation: boolean;

  const normalize = (val: number) => {
    // Shift to positive to avoid issues when crossing the 0 line
    if (val < 0) return 0;
    if (val > 1) return 1;

    return val;
  };

  const dataConf = {
    test: {
      sectionHeight: "70vh",
      sections: 6, //Need to specify
      rangeTexts: ['WHO', 'IT1', 'IT2', 'IT3', 'IT4', 'IT5']
    },
  };

  const onIndexChangedFn = (e: CustomEvent) => {
    const {detail} = e;
    console.log(detail);
    //const dest = document.getElementById(`scrolly-carto-section-${detail.index + 1}`);
    animateScroll.scrollTo({ element: `#scrolly-carto-section-${detail.index}`, offset: 200});
  }

</script>

<div style="--section-height: {dataConf[data].sectionHeight};">
  <Scroller bind:index bind:offset bind:progress threshold={0}>
    <div slot="background" id="scrolly-carto-background">
      <CartoWorld
        {data}
        {id}
        {block}
        {head}
        {text}
        {embed}
        {isEmbed}
        showEmbed={false}
        bind:cartogramAnnotation
        {index}
      />
    </div>
    <div slot="foreground" id="scrolly-carto-foreground">
      {#each { length: dataConf[data].sections } as _, i}
        <section id='scrolly-carto-section-{i}' style="{i === dataConf[data].sections - 1 ? `height: calc(${dataConf[data].sectionHeight} * 2);` : ''}">
          SOME TEXT FLOATING
          </section>
      {/each}
    </div>
  </Scroller>
  <LoadingBar/>
  <Tooltip country={'India'}/>
</div>

<Embed {isEmbed} {embed} {cartogramAnnotation} {text} />

<style>
  section {
    height: var(--section-height);
  }

  :global(svelte-scroller-foreground) {
    pointer-events: none;
  }
  :global(svelte-scroller-background-container) {
    pointer-events: all !important;
  }
</style>