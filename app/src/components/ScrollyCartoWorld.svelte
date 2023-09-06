<script lang="ts">
  // @ts-ignore
  import Scroller from "@sveltejs/svelte-scroller";
  import type { Content, TextBlock } from "src/types";
  import gbdCleenAirData from "src/data/GBDCleanAirData.json";
  import CartoWorld from "./CartoWorld.svelte";
  import ProgressBar from "./ProgressBar.svelte";
  import type { GBDCleanAirData } from "./CartoWorld.svelte";
  import type { NumberValue } from "d3-scale";

  export var data;
  export var id: string;
  export var block: Content;
  export var head: string;
  export var text: TextBlock[];
  export var cards: TextBlock[];
  export var embed: string = "a";
  export var isEmbed: boolean;

  let index: number;
  let currentIndex;
  let prevIndex: number;
  let offset: number;
  let progress: number;
  let cartogramAnnotation: boolean;
  let totalPopulation: number;
  let currentPopulation: number;
  let gbdData = gbdCleenAirData as GBDCleanAirData[];
  let top: number = 0;
  let bottom: number = 1;
  let innerWidth: number;

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
    prevIndex = currentIndex;
    currentIndex = index;
  }

  $: top = innerWidth > 768 ? 0 : 0.06;
  $: bottom = innerWidth > 768 ? 1 : 0.8;

  $: console.log({currentIndex, prevIndex})
</script>

<svelte:window bind:innerWidth />

<section
  class="scrolly-carto-container"
  style="--section-height: {dataConf[data].sectionHeight};"
>
  <Scroller bind:index bind:offset bind:progress threshold={0} {top} {bottom}>
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
          index={currentIndex}
          {prevIndex}
        />
        <ProgressBar percentage={populationPercentage} />
      </div>
    </div>
    <div slot="foreground" id="scrolly-carto-foreground">
      {#each cards as card, i}
        <section id="scrolly-carto-section-{i}" class="step">
          <p class="scrolly-card">
            {@html card.p}
          </p>
        </section>
      {/each}
    </div>
  </Scroller>
</section>

<style>
  :global(svelte-scroller-foreground) {
    pointer-events: none;
  }
  :global(svelte-scroller-background-container) {
    pointer-events: all !important;
  }

  .background {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 70rem;
    max-width: 100vw;
  }

  .step {
    height: 70rem;
    padding-top: 35rem;
    margin-right: 1rem;
  }

  .scrolly-card {
    height: fit-content;
    max-height: 7.8rem;
    width: 22.5rem;

    padding: 2rem;

    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    filter: drop-shadow(0 0 5px rgb(0 0 0 / 20%));
  }

  @media (max-width: 678px) {
    .background,
    .step {
      height: 70vh;
    }

    .scrolly-card {
      padding: 0.5rem;
      width: auto;
    }

    .background {
      padding: 0 10px 0 10px;
    }
  }
</style>
