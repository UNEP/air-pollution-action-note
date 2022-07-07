<script lang="ts" context="module">

  export interface CountryDataPoint {
    name: string;
    short: string;
    code: string;
    x: number;
    y: number;
    value: number;
    rate?: number;
    color?: string;
    // waiting for svelte to add support for generics
    data?: any; /* eslint-disable-line @typescript-eslint/no-explicit-any */
  }

</script>

<script lang="ts">
  import * as d3 from 'src/d3';
  import { throttle, trailingDebounce } from 'src/util';
  import Annotation from './Annotation.svelte';

  interface CartogramDataPoint extends CountryDataPoint {
    category: string;
    left: number;
    top: number;
    width: number;
    height: number;
  }

  export var data: CountryDataPoint[];
  export var nodeSize = 100;
  export var domain: [number, number];
  export var helpText: {code: string, text: string} = null;
  export var categoryFn: (c: CountryDataPoint) => string = undefined;
  export var colorFn: (c: CountryDataPoint) => string = undefined;
  export var classesFn: (c: CountryDataPoint) => string[] = () => [];
  export var hoverTextFn: (c: CountryDataPoint) => string;
  export var onHoverFn: (c: CountryDataPoint) => void = () => null;
  export var hideLabels = false;
  export const rerenderFn: () => void = () => cartogramData = cartogramData;
  export var annotationShowing: boolean = false;

  let containerEl: Element;
  let loaded = false;

  // used to scale to container el
  const originalWidth = domain[0];
  const originalHeight = domain[1];
  let targetWidth: number = originalWidth;
  let targetHeight: number = originalHeight;
  let resizing = false;
  let hoverTimeout: number;
  let hoverData: {x: number, y: number, country: CartogramDataPoint} = null;
  let helpTextFade = false;
  let annotation: AnnotationData;
  let hoveredForX = false;

  $: largestVal = Math.max(...data.map(d => d.value));

  let clientWidth: number;
  let containerWidth: number;
  let containerHeight: number;

  function resize() {
    if (containerEl) {
      resizing = true;
      const ctrStyle = getComputedStyle(containerEl);

      const xPadding = parseFloat(ctrStyle.paddingLeft) + parseFloat(ctrStyle.paddingRight);
      const yPadding = parseFloat(ctrStyle.paddingTop) - parseFloat(ctrStyle.paddingBottom);

      containerWidth = containerEl.clientWidth - xPadding;
      containerHeight = containerEl.clientHeight - yPadding;

      const scale = Math.min(containerWidth / originalWidth, containerHeight / originalHeight);
      targetWidth = originalWidth * scale;
      targetHeight = originalHeight * scale;
      window.setTimeout(() => resizing = false);
    }
  }

  const throttledResize = throttle(resize, 100);
  $: clientWidth && throttledResize();

  $: radius = d3.scaleSqrt()
    .domain([0, largestVal])
    .range([0, nodeSize]);

  $: xScale = d3.scaleLinear()
    .domain([0, domain[0]])
    .range([0, targetWidth]);

  $: yScale = d3.scaleLinear()
    .domain([0, domain[1]])
    .range([0, targetHeight]);

  let cartogramData: CartogramDataPoint[];
  $: cartogramData = data.map(d => {
    const r = radius(d.value);
    return {
      ...d,

      category: categoryFn ? categoryFn(d) : null,
      left: xScale(d.x - r),
      top: yScale(d.y - r),

      // width height should be the same if the aspect is correct
      width: xScale(r * 2),
      height: yScale(r * 2)
    };
  });

  $: cartogramData.sort((a,b) => a.y - b.y);

  $: calcStyle = (d: CartogramDataPoint) => {
    const styles = [
      `left: ${d.left}px`,
      `top: ${d.top}px`,
      `width: ${d.width}px`,
      `height: ${d.height}px`,
      `background: ${d.color ? d.color : colorFn(d)};`,
    ];
    return styles.join(';');
  };

  window.setTimeout(() => {
    resize();
    loaded = true;
  }, 0);

  // ANNOTATIONS....  yea it's pretty complicated... :(
  interface AnnotationData {
    x: number;
    y: number;
    radius: number;
    html: string;
    class?: string
  }

  const _debouncedShowHelpText = trailingDebounce(() => helpTextFade = false, 200);

  function onMouseEnterCountry(evt: MouseEvent, country: CartogramDataPoint) {
    onHoverFn(country);
    helpTextFade = false;
    _debouncedShowHelpText.cancel();
    hoverData = {
      country,
      x: country.left + (country.width / 2),
      y: country.top + (country.height / 2)
    };
    hoverTimeout = window.setTimeout(() => hoveredForX = true, 350);
  }

  function onMouseClick(country: CartogramDataPoint) {
    onHoverFn(country);
    helpTextFade = false;
    _debouncedShowHelpText.cancel();
    hoverData = {
      country,
      x: country.left + (country.width / 2),
      y: country.top + (country.height / 2)
    };
    hoverTimeout = window.setTimeout(() => hoveredForX = true, 350);
  }

  function onMouseLeaveCountry() {
    clearHoverState();
    onHoverFn(null);
  }

  function clearHoverState() {
    hoverData = null;
    hoveredForX = false;
    window.clearTimeout(hoverTimeout);
    hoverTimeout = null;
    fadeInHelpText();
  }

  function fadeInHelpText() {
    helpTextFade = true;
    _debouncedShowHelpText();
  }

  $: helpCountry = helpText ? cartogramData.find(d => d.code === helpText.code) : null;

  $: helpAnnotation = helpCountry && {
    x: helpCountry.left + helpCountry.width / 2,
    y: helpCountry.top + helpCountry.height / 2,
    radius: 2 + helpCountry.width / 2,
    html: helpText.text,
    class: 'help'
  };

  $: countryAnnotation = hoverTextFn && hoverData && {
    x: hoverData.x,
    y: hoverData.y,
    radius: 2 + hoverData.country.width / 2,
    html: hoverTextFn(hoverData.country)
  };

  $: haveContainerDims = containerWidth > 0 && containerHeight > 0;
  $: annotation = haveContainerDims ? (countryAnnotation || helpAnnotation) : undefined;
  $: hideAnnotation = helpTextFade || (!countryAnnotation && hoverData);

  $: annotationShowing = annotation && !hideAnnotation && annotation !== helpAnnotation;

  $: data && fadeInHelpText();

  let pxAboveScreenTop: number = 0;
  const onWindowScroll = () => {
    const top = containerEl.getBoundingClientRect().top - 50;
    pxAboveScreenTop = top < 0 ? Math.abs(top) : 0;
  };

</script>

<svelte:window on:scroll={onWindowScroll} />

<div class="cartogram" bind:this={containerEl}
  bind:clientWidth={clientWidth}
  class:cartogram-country-hover={hoverData}
  class:cartogram-resizing={resizing}
>
<filter id="shadow" x="+100px">
  <feDropShadow dx="0" dy="0" stdDeviation="4" flood-opacity="0.9"></feDropShadow>
</filter>
  {#if loaded}
    <div class="countries">
      {#each cartogramData as d (d.code)}
        {#if d.x && d.y}
          <div
            class="country {classesFn(d).join(' ')}"
            style={calcStyle(d)}
            data-code={d.code}
            tabindex="0"
            on:mouseenter={(evt) => onMouseEnterCountry(evt, d)}
            on:mouseleave={() => onMouseLeaveCountry()}
            on:focus={() => onMouseClick(d)}
            on:blur={() => onMouseLeaveCountry()}
          >
          {#if !hideLabels && d.width > 100}
            <span class="country-text">{d.short}</span>
          {/if}
          </div>
        {/if}
      {/each}
    </div>

  {/if}

  {#if annotation}
    <div class="annotation-container"
      class:annotation-hide={hideAnnotation} class:annotation-help={annotation.class === "help"}
    >
    <Annotation x={annotation.x} y={annotation.y} text={annotation.html}
      radius={annotation.radius} forceTopWherePossible={annotation === helpAnnotation}
      topClamp={annotation === helpAnnotation ? 0 : pxAboveScreenTop}
      canvasWidth={containerWidth} canvasHeight={containerHeight}
    />
    </div>
  {/if}

</div>

<style>
  .cartogram {
    transform-origin: 0 0;
    height: 100%;
    width: 100%;
    display: flex;
    position: relative;
  }

  .countries {
    flex: 0 0 100%;
    transform: rotateY(0.001deg);
  }

  .country {
    position: absolute;
    border-radius: 4px;
    cursor: pointer;
    opacity: 1;
    z-index: 2;
    transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, background-color 0.2s, opacity 0.45s ease 0.15s;
    will-change: opacity, background-color, border-radius;
    background: grey;
    outline-color: black;
  }

  .cartogram-resizing .country {
    transition: none;
  }

  .country-text {
    color: white;
    font-weight: 400;
    font-size: .85rem;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    width: min(100%, 50px);
    margin: auto;
    transform: translateY(-50%);
    text-align: center;
  }

  .cartogram-country-hover .country:not(:hover) {
    opacity: 0.65;
    transition: opacity 0.05s;
  }

  .cartogram-country-hover .country:hover {
    opacity: 0.999;
    transition: opacity 0s;
    z-index: 3;
  }

  .annotation-container {
    opacity: 1;
    pointer-events: none;
  }

  .annotation-help {
    transition: opacity 500ms;
  }

  .annotation-hide {
    opacity: 0;
    transition: opacity 0s;
  }

  .annotation-container :global(.line) {
    border-color :#bbbbbb !important;
  }

  .country--hide {
    opacity: 0.5;
  }

  .country--shadow {
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.4);
  }
</style>