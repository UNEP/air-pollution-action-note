<script lang="ts">
  // @ts-ignore
  import Scroller from "@sveltejs/svelte-scroller";
  import type { Content, TextBlock } from "src/types";
  import CartoWorld from "./CartoWorld.svelte";
  import Embed from "./Embed.svelte";

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
  let rangeValue: number;

  const normalize = (val: number) => {
    // Shift to positive to avoid issues when crossing the 0 line
    console.log({ val });
    if (val < 0) return 0;
    if (val > 1) return 1;

    return val;
  };

  const dataConf = {
    test: {
      sectionHeight: "70vh",
      sections: 7, //Need to specify
    },
  };

  $: rangeValue = normalize(progress);
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
        {rangeValue}
      >
        <input
          slot="range"
          type="range"
          id="volume"
          name="volume"
          min="0"
          max="1"
          step="0.1"
          bind:value={rangeValue}
        />
      </CartoWorld>
    </div>
    <div slot="foreground" id="scrolly-carto-foreground">
      {#each { length: dataConf[data].sections } as _, i}
        <section />
      {/each}
    </div>
  </Scroller>
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