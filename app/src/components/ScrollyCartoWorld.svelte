<script lang="ts">
  // @ts-ignore
  import Scroller from "@sveltejs/svelte-scroller";
  import type { Content, TextBlock } from "src/types";
  import gbdCleenAirData from "src/data/GBDCleanAirData.json";
  import CartoWorld from "./CartoWorld.svelte";
  import Embed from "./Embed.svelte";
  import ProgressBar from "./ProgressBar.svelte";
  import Tooltip from "./Tooltip.svelte";
  import type { GBDCleanAirData } from "./CartoWorld.svelte";
  import type { NumberValue } from "d3-scale";

  export var data;
  export var id: string;
  export var block: Content;
  export var head: string;
  export var text: TextBlock[];
  export var embed: string = "a";
  export var isEmbed: boolean;

  let index: number;
  let currentIdenx;
  let prevIndex: number;
  let offset: number;
  let progress: number;
  let cartogramAnnotation: boolean;
  let totalPopulation: number;
  let currentPopulation: number;
  let gbdData = gbdCleenAirData as GBDCleanAirData[];

  const gbdIndexToPop = {
    0: "int0Pop",
    1: "int1Pop",
    2: "int2Pop",
    3: "int3Pop",
    4: "int4Pop",
    5: "aqgPop",
  };

  totalPopulation = gbdData.reduce((acc, current) => acc + current.pop, 0);

  const dataConf = {
    test: {
      sectionHeight: "70vh",
      sections: 6, //Need to specify
      rangeTexts: ["WHO", "IT1", "IT2", "IT3", "IT4", "IT5"],
    },
  };

  $: currentPopulation = gbdData.reduce(
    (acc, current) =>
      acc +
      current[
        gbdIndexToPop[
          current.initialInt + index > 5 ? 5 : current.initialInt + index
        ]
      ],
    0
  );

  $: populationPercentage = Math.round(
    (currentPopulation / totalPopulation) * 100
  );

  $: {
    prevIndex = currentIdenx;
    currentIdenx = index;
  }
</script>

<div style="--section-height: {dataConf[data].sectionHeight};">
  <Scroller bind:index bind:offset bind:progress threshold={0}>
    <div slot="background" id="scrolly-carto-background">
      <div class="background">
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
          index={currentIdenx}
          {prevIndex}
        />
        <ProgressBar percentage={populationPercentage} />
      </div>
    </div>
    <div slot="foreground" id="scrolly-carto-foreground">
      {#each { length: dataConf[data].sections } as _, i}
        <section
          id="scrolly-carto-section-{i}"
          style={i === dataConf[data].sections - 1
            ? `height: calc(${dataConf[data].sectionHeight} * 2);`
            : ""}
        >
          SOME TEXT FLOATING
        </section>
      {/each}
    </div>
  </Scroller>
  <Tooltip country={"India"} />
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

  .background {
    display: grid;
    grid-template-rows: 80% auto;
    height: 100%;
    max-width: 100vw;
  }
</style>
