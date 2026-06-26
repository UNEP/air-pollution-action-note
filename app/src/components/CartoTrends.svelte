<script lang="ts">
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import Head from "./Head.svelte";
  import pm25data from "src/data/pm25_coords.json";
  import trendsPM25 from "src/data/trends_pm25.json";
  import trendsOzone from "src/data/trends_ozone.json";
  import countryNameDictionary from "src/data/countryDictionary.json";
  import Legend from "src/components/common/Legend.svelte";
  import { colorTrendsPM25, colorTrendsOzone } from "src/colors";
  import { createLookup } from "src/util";

  import { onDestroy, onMount } from "svelte";
  import type { CountryDataPoint } from "src/components/maps/Cartogram.svelte";
  import type { Content, TextBlock } from "src/types";
  import ScrollableX from "./common/ScrollableX.svelte";
  import EmbedFooter from "./EmbedFooter.svelte";
  import SectionTitle from "src/components/SectionTitle.svelte";

  export var id: string;
  export var block: Content;
  export var head: string;
  export var headOzone: string;
  export var text: TextBlock[];
  export var embed: string;
  export var isEmbed = false;

  $: embedForFooter = embed as never;

  const countryNameDictionaryLookup = createLookup(
    countryNameDictionary,
    (d) => d.id,
    (d) => d
  );

  const trendsLookup = createLookup(
    trendsPM25,
    (d: { id: string }) => d.id,
    (d) => d
  );

  const trendsLookupOzone = createLookup(
    trendsOzone,
    (d: { id: string }) => d.id,
    (d) => d
  );

  /** Available years from trends data (keys that are 4-digit years) */
  let availableYears = (() => {
    const first = trendsPM25[0] as Record<string, string>;
    return Object.keys(first)
      .filter((k) => /^\d{4}$/.test(k)).map(Number).sort((a, b) => a - b);
  })();

  let availableYearsOzone = (() => {
    const first = trendsOzone[0] as Record<string, string>;
    return Object.keys(first)
      .filter((k) => /^\d{4}$/.test(k)).map(Number).sort((a, b) => a - b);
  })();
  /** Step for year labels: fewer on mobile to avoid clutter (uses viewport, not container) */
  let isMobileViewport = false;
  $: yearLabelStep = isMobileViewport ? 6 : 3;
  $: yearLabelStepOzone = isMobileViewport ? 6 : 3;
  let showYearLabel = (index: number) => index % yearLabelStep === 0;
  let showYearLabelOzone = (index: number) => index % yearLabelStepOzone === 0;

  $: showYearLabel = (index: number) => index % yearLabelStep === 0;
  $: showYearLabelOzone = (index: number) => index % yearLabelStepOzone === 0;

  let selectedYear: number =
    availableYears.length > 0 ? availableYears[availableYears.length - 1] : 2020;

  let selectedYearOzone: number =
    availableYearsOzone.length > 0 ? availableYearsOzone[availableYearsOzone.length - 1] : 2020;
  let legendElementSelectedIndex: number = null;
  let clientWidth = 0;
  let width: number;
  let height: number;
  let cartogramAnnotation: boolean;
  let rerender: () => void;
  let isPlaying = false;
  let playInterval: ReturnType<typeof setInterval> | null = null;
  let tooltipYear: number | null = null;
  let tooltipRect: DOMRect | null = null;
  let initialData = "pm25";
  const PLAY_SPEED_MS = 800;

  let timelineTrackPm25: HTMLDivElement | null = null;
  let timelineTrackOzone: HTMLDivElement | null = null;
  let dragMode: "pm25" | "ozone" | null = null;

  function getYearFromPosition(
    trackEl: HTMLDivElement,
    clientX: number,
    years: number[]
  ): number {
    const rect = trackEl.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const index = Math.round(fraction * (years.length - 1));
    const clamped = Math.max(0, Math.min(years.length - 1, index));
    return years[clamped];
  }

  function startDragPm25(_e?: MouseEvent | TouchEvent) {
    if (!timelineTrackPm25 || availableYears.length === 0 || dragMode === "pm25") return;
    stopTimeline();
    dragMode = "pm25";
    const updateYear = (clientX: number) => {
      if (timelineTrackPm25) {
        selectedYear = getYearFromPosition(
          timelineTrackPm25,
          clientX,
          availableYears
        );
      }
    };
    const onMove = (e: MouseEvent) => updateYear(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateYear(e.touches[0].clientX);
    };
    const onUp = () => {
      dragMode = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onTouchMove, { capture: true });
      document.removeEventListener("touchend", onUp);
      document.removeEventListener("touchcancel", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    document.addEventListener("touchend", onUp);
    document.addEventListener("touchcancel", onUp);
  }

  function startDragOzone(_e?: MouseEvent | TouchEvent) {
    if (!timelineTrackOzone || availableYearsOzone.length === 0 || dragMode === "ozone") return;
    stopTimelineOzone();
    dragMode = "ozone";
    const updateYear = (clientX: number) => {
      if (timelineTrackOzone) {
        selectedYearOzone = getYearFromPosition(
          timelineTrackOzone,
          clientX,
          availableYearsOzone
        );
      }
    };
    const onMove = (e: MouseEvent) => updateYear(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateYear(e.touches[0].clientX);
    };
    const onUp = () => {
      dragMode = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onTouchMove, { capture: true });
      document.removeEventListener("touchend", onUp);
      document.removeEventListener("touchcancel", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    document.addEventListener("touchend", onUp);
    document.addEventListener("touchcancel", onUp);
  }

  function showTooltip(year: number, el: HTMLElement) {
    tooltipYear = year;
    tooltipRect = el.getBoundingClientRect();
  }
  function hideTooltip() {
    tooltipYear = null;
    tooltipRect = null;
  }

  function goToYear(year: number) {
    selectedYear = year;
  }

  function goToYearOzone(year: number) {
    selectedYearOzone = year;
  }


  function playTimeline() {
    if (isPlaying || availableYears.length === 0) return;
    isPlaying = true;
    playInterval = setInterval(() => {
      const i = availableYears.indexOf(selectedYear);
      if (i < 0) return;
      const nextIndex = i >= availableYears.length - 1 ? 0 : i + 1;
      selectedYear = availableYears[nextIndex];
    }, PLAY_SPEED_MS);
  }

  function playTimelineOzone() {
    if (isPlaying || availableYearsOzone.length === 0) return;
    isPlaying = true;
    playInterval = setInterval(() => {
      const i = availableYearsOzone.indexOf(selectedYearOzone);
      if (i < 0) return;
      const nextIndex = i >= availableYearsOzone.length - 1 ? 0 : i + 1;
      selectedYearOzone = availableYearsOzone[nextIndex];
    }, PLAY_SPEED_MS);
  }

  function stopTimelineOzone() {
    if (playInterval != null) {
      clearInterval(playInterval);
      playInterval = null;
    }
    isPlaying = false;
  }

  function stopTimeline() {
    if (playInterval != null) {
      clearInterval(playInterval);
      playInterval = null;
    }
    isPlaying = false;
  }

  onDestroy(stopTimeline);
  onDestroy(stopTimelineOzone);

  onMount(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    isMobileViewport = mq.matches;
    const listener = () => {
      isMobileViewport = mq.matches;
    };
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  });

  $: legendIsHovered = legendElementSelectedIndex !== null;

  /** Dataset for the cartogram: countries with PM2.5 value for selectedYear */
  $: trendsData = pm25data
    .filter((d) => trendsLookup[d.id])
    .map((d) => {
      const trendRow = trendsLookup[d.id] as Record<string, string>;
      const value = Number(trendRow[String(selectedYear)]);
      return {
        name: countryNameDictionaryLookup[d.id]?.name ?? trendRow.name ?? d.id,
        short: countryNameDictionaryLookup[d.id]?.short ?? d.id,
        code: d.id,
        x: d.x,
        y: d.y,
        value: value,
        color: colorTrendsPM25(value),
      };
    });

    $: trendsDataOzone = pm25data
    .filter((d) => trendsLookupOzone[d.id])
    .map((d) => {
      const trendRow = trendsLookupOzone[d.id] as Record<string, string>;
      const value = Number(trendRow[String(selectedYearOzone)]);
      return {
        name: countryNameDictionaryLookup[d.id]?.name ?? trendRow.name ?? d.id,
        short: countryNameDictionaryLookup[d.id]?.short ?? d.id,
        code: d.id,
        x: d.x,
        y: d.y,
        value: value,
        color: colorTrendsOzone(value),
      };
    });
    

  const datasetParams = {
    nodeSize: 12,
    helpText: {
      code: "JPN",
      text: () =>
        `<strong>Each square is a country</strong>, sized by the annual mean levels of <strong>fine particulate matter PM<sub>2.5</sub></strong> in <strong>${selectedYear}</strong>, measured in µg/m<sup>3</sup>.`,
    },
    hoverTextFn: (d: CountryDataPoint) =>
      `In <strong>${d.name}</strong>, people were exposed to an average of <strong>${Number(d.value).toFixed(1)} μg/m<sup>3</sup></strong> in <strong>${selectedYear}</strong>.`,
    classesFn: (d: CountryDataPoint) => {
      if (!legendIsHovered) return [];
      const isSelected =
        colorTrendsPM25.range().indexOf(d.color) === legendElementSelectedIndex;
      return [isSelected ? "country--shadow" : "country--hide"];
    },
    color: colorTrendsPM25,
    legendTitle: `Concentration of fine particulate matter PM<sub>2.5</sub> (µg/m<sup>3</sup>)`,
    legendDomain: colorTrendsPM25.domain().map((e) => String(e)),
    legendType: "sequential",
    domain: [700, 400] as [number, number],
    linearDomain: null,
    internalLabels: null,
  };

  const datasetParamsOzone = {
    nodeSize: 8,
    helpText: {
      code: "JPN",
      text: () =>
        `<strong>Each square is a country</strong>, sized by the annual mean levels of <strong>ground-level ozone</strong> during the peak season in <strong>${selectedYearOzone}</strong>, measured in µg/m<sup>3</sup>.`,
    },
    hoverTextFn: (d: CountryDataPoint) =>
      `In <strong>${d.name}</strong>, people are exposed to an average of <strong>${Number(d.value).toFixed(1)} µg/m<sup>3</sup></strong> of ground-level ozone during the peak season in <strong>${selectedYearOzone}</strong>.`,
    classesFn: (d: CountryDataPoint) => {
      if (!legendIsHovered) return [];
      const isSelected =
        colorTrendsOzone.range().indexOf(d.color) === legendElementSelectedIndex;
      return [isSelected ? "country--shadow" : "country--hide"];
    },
    color: colorTrendsOzone,
    legendTitle: `8-hour average ground-level ozone concentration during peak seasons (6 months of a year) (µg/m<sup>3</sup>)`,
    legendDomain: colorTrendsOzone.domain().map((e) => String(e)),
    legendType: "sequential",
    domain: [700, 400] as [number, number],
    linearDomain: null,
    internalLabels: null,
  };

  $: (legendElementSelectedIndex !== undefined || selectedYear) && rerender && rerender();

  $: width = Math.max(clientWidth, 700);
  $: height = width * 0.55;

  function changeData(data: "pm25" | "ozone") {
    initialData = data;
    stopTimeline();
    stopTimelineOzone();
    // selectedYear = availableYears[availableYears.length - 1] || 2020;
    // selectedYearOzone = availableYearsOzone[availableYearsOzone.length - 1] || 2020;
  }
</script>

<section {id} class="viz wide">
  {#if !isEmbed && block.menu}
    <SectionTitle {block} />
  {/if}
  <div class="ozone-options">
    <button on:click={() => changeData("pm25")} class:active={initialData === "pm25"}>PM2.5</button>
    <button on:click={() => changeData("ozone")} class:active={initialData === "ozone"}>Ozone</button>
  </div>
  {#key initialData}
  <Head
    title={initialData === "pm25" ? head : headOzone}
    bind:selectedElement={selectedYear}
    number={selectedYear}
  />
{/key}
  <div class="right-narrow">
  {#key initialData}
    <Legend
      title={initialData === "pm25" ? datasetParams.legendTitle : datasetParamsOzone.legendTitle}
      colors={initialData === "pm25" ? datasetParams.color.range() : datasetParamsOzone.color.range()}
      labels={initialData === "pm25" ? datasetParams.legendDomain : datasetParamsOzone.legendDomain}
      type={initialData === "pm25" ? datasetParams.legendType : datasetParamsOzone.legendType}
      linearDomain={initialData === "pm25" ? datasetParams.linearDomain : datasetParamsOzone.linearDomain}
      internalLabels={initialData === "pm25" ? datasetParams.internalLabels : datasetParamsOzone.internalLabels}
      bind:selected={legendElementSelectedIndex}
    />
    {/key}
  </div>
  <div class="margin-breakout-mobile" bind:clientWidth>
    <ScrollableX>
      <div
        style="width:{width}px; height:{height}px"
        class="cartogram-container"
      >
        <Cartogram
          data={initialData === "pm25" ? trendsData : trendsDataOzone}
          slug="trends"
          bind:rerenderFn={rerender}
          bind:annotationShowing={cartogramAnnotation}
          nodeSize={initialData === "pm25" ? datasetParams.nodeSize : datasetParamsOzone.nodeSize}
          domain={initialData === "pm25" ? datasetParams.domain : datasetParamsOzone.domain}
          helpText={initialData === "pm25" ? datasetParams.helpText : datasetParamsOzone.helpText}
          hoverTextFn={initialData === "pm25" ? datasetParams.hoverTextFn : datasetParamsOzone.hoverTextFn}
          classesFn={initialData === "pm25" ? datasetParams.classesFn : datasetParamsOzone.classesFn}
          legendTitle={initialData === "pm25" ? datasetParams.legendTitle : datasetParamsOzone.legendTitle}
        />
      </div>
      {#if availableYears.length > 0 && initialData === "pm25"}
        <div class="timeline-controls">
          <button
            type="button"
            class="play-stop"
            aria-label={isPlaying ? "Stop timeline" : "Play timeline"}
            on:click={() => (isPlaying ? stopTimeline() : playTimeline())}
          >
            {#if isPlaying}
              <img src="img/pause.svg" alt="Pause" />
              {:else}
              <img src="img/play_arrow.svg" alt="Play" />
            {/if}
          </button>
          <div class="timeline-track-container">        
            <div
              class="timeline-track"
              class:dragging={dragMode === "pm25"}
              role="slider"
              aria-valuenow={selectedYear}
              aria-valuemin={availableYears[0]}
              aria-valuemax={availableYears[availableYears.length - 1]}
              tabindex="0"
              bind:this={timelineTrackPm25}
              on:mousedown={startDragPm25}
              on:touchstart={startDragPm25}
            >
              {#each availableYears as year, i}
                <button
                  type="button"
                  class="year-tick"
                  class:selected={year === selectedYear}
                  class:active={year <= selectedYear}
                  on:mouseenter={(e) => showTooltip(year, e.currentTarget)}
                  on:mouseleave={hideTooltip}
                  on:click={() => { goToYear(year); stopTimeline(); }}
                >
                  <span class="tick-mark"></span>
                  {#if showYearLabel(i)}
                    <span class="year-label">{year}</span>
                  {:else}
                    <span class="year-label year-label--empty" aria-hidden="true"> </span>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
          {#if tooltipYear != null && tooltipRect != null}
            <div
              class="timeline-tooltip"
              style="left: {tooltipRect.left + tooltipRect.width / 2}px; top: {tooltipRect.top - 8}px;"
              role="tooltip"
            >
              {tooltipYear}
            </div>
          {/if}
        </div>
      {/if}
    
      {#if availableYearsOzone.length > 0 && initialData === "ozone"}
        <div class="timeline-controls">
          <button
            type="button"
            class="play-stop"
            aria-label={isPlaying ? "Stop timeline" : "Play timeline"}
            on:click={() => (isPlaying ? stopTimelineOzone() : playTimelineOzone())}
          >
            {#if isPlaying}
              <img src="img/pause.svg" alt="Pause" />
              {:else}
              <img src="img/play_arrow.svg" alt="Play" />
            {/if}
          </button>
          <div class="timeline-track-container">
              <div
                class="timeline-track"
                class:dragging={dragMode === "ozone"}
                role="slider"
                aria-valuenow={selectedYearOzone}
                aria-valuemin={availableYearsOzone[0]}
                aria-valuemax={availableYearsOzone[availableYearsOzone.length - 1]}
                tabindex="0"
                bind:this={timelineTrackOzone}
                on:mousedown={startDragOzone}
                on:touchstart={startDragOzone}
              >
                {#each availableYearsOzone as year, i}
                  <button
                    type="button"
                    class="year-tick"
                    class:selected={year === selectedYearOzone}
                    class:active={year <= selectedYearOzone}
                    on:mouseenter={(e) => showTooltip(year, e.currentTarget)}
                    on:mouseleave={hideTooltip}
                    on:click={() => { goToYearOzone(year); stopTimelineOzone(); }}
                  >
                    <span class="tick-mark"></span>
                    {#if showYearLabelOzone(i)}
                      <span class="year-label">{year}</span>
                    {:else}
                      <span class="year-label year-label--empty" aria-hidden="true"> </span>
                    {/if}
                  </button>
                {/each}
              </div>
          </div>
          {#if tooltipYear != null && tooltipRect != null}
            <div
              class="timeline-tooltip"
              style="left: {tooltipRect.left + tooltipRect.width / 2}px; top: {tooltipRect.top - 8}px;"
              role="tooltip"
            >
              {tooltipYear}
            </div>
          {/if}
        </div>
      {/if}
    </ScrollableX>
  </div>


  {#if !isEmbed}
    <div class="footer">
      <EmbedFooter embed={embedForFooter} />
    </div>
    {#each text as t}
      <p class="col-text">{@html t.p}</p>
    {/each}
  {/if}
</section>

<style lang="scss">
  .footer {
    margin-bottom: 30px;
  }

  .cartogram-container {
    overflow: hidden;
  }

  .timeline-controls {
    display: flex;
    align-items: start;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .play-stop {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    flex-shrink: 0;

  }

  .timeline-tooltip {
    position: fixed;
    transform: translate(-50%, -120%);
    padding: 0.35rem 0.6rem;
    font-size: 0.8rem;
    white-space: nowrap;
    background: white;
    color: #1E1E1E;
    border-radius: 4px;
    pointer-events: none;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .timeline-track-container {
    overflow-x: auto;
    flex: 1;
  }
  .timeline-track {
    flex: 1;
    flex-wrap: nowrap;
    min-width: 0;
    // width: fit-content;
    display: flex;
    align-items: flex-end;
    gap: 0;
    padding: 0.5rem 0;
    padding-top: 12px;
    overflow-y: visible;
    position: relative;
    scroll-behavior: smooth;
    margin-top: 14px;
    cursor: grab;
    user-select: none;

    @media screen and (max-width: 1024px) {
      width: fit-content;
    }
    @media screen and (max-width: 768px) {
      width: 100%;
    }
    &.dragging {
      cursor: grabbing;
    }

    &:before {
      content: '';
      width: 100%;
      height: 6px;
      background: #999;      
      border-radius: 4px;
      position: absolute;
      top: 4px;
      left: 0;
    }
  }

  .year-tick {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: center;
    padding: 0;
    // min-width: 28px;
    border: none;
    background: none;
    cursor: pointer;
    flex-shrink: 0;
    position: relative;
    line-height: 22px;
    min-width: 20px;
    height: 34px;

    @media (max-width: 1024px) {
      min-width: 20px;
    }

    @media (max-width: 768px) {
      min-width: 16px;
    }

    span {
        font-family: 'Roboto', sans-serif;
        font-weight: 300;
        font-size: 16px;
        color: #505050;
        
        @media (max-width: 1024px) {
          font-size: 14px;
        }

        @media (max-width: 768px) {
          &.year-label {
            position: absolute;
            top: 10px;
            left: 0;
          }
          font-size: 12px;
        }
    }

    .tick-mark {
      width: 1px;
      height: 12px;
      background: #505050;
      margin-top: 4px;
      @media (max-width: 768px) {
        margin-top: 2px;
        height: 10px;
      }
    }

    &:before {
      width: 100%;
      height: 6px;
      background: #1E1E1E;
      margin-bottom: 2px;
      
      content: '';
      position: absolute;
      top: -9px;
      left: 0;
      opacity: 0;
    }
    &:first-child:before {
        border-radius: 4px 0 0 4px;
    }
    &:last-child:before {
        border-radius: 0 4px 4px 0;
    }
    &:after {
      content: '';
      width: 12px;
      height: 12px;
      background: #1E1E1E;      
      border-radius: 50%;
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
    }
    &.selected:after {
      opacity: 1;
    }

    &.selected:before {
      width: 50%;
    }

    &.active:before {
      opacity: 1;
    }

    .year-label {
      white-space: nowrap;
    //   opacity: 0.85;
    }
    // &:hover .tick-mark {
    //   background: #555;
    //   height: 10px;
    // }
    // &.selected .tick-mark {
    //   height: 14px;
    //   background: #004982;
    //   width: 3px;
    // }
    // &.selected .year-label {
    //   font-weight: 600;
    //   opacity: 1;
    // }
    .year-label--empty {
      visibility: hidden;
      user-select: none;
    }
  }

  :global(.annotation .text) {
    background: #f9f9f9e0;
    border-radius: 4px;
    padding: 0 10px 5px;
  }
</style>
