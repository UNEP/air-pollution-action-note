<script lang="ts" context="module">

  export interface CountryDataSquare {
    id: string,
    value: number
  }

</script>

<script lang="ts">
    import { colorPM25, colorHealth } from "src/colors";
  
    const height = 100;
    const normalTileWidth = 3;
    const normalTileHeight = 20;
    const relevantTileWidth = 5;
    const relevantTileHeight = 34;
    const xBorderRadius = 10;
    const yBorderRadius = 2;
  
    export let country: string;
    export let data: CountryDataSquare[];
    export let type: string;
    export let width: number = 385;
    export let value: number;
  
    const colorFunction = (d: number) => type === "pm25" ? colorPM25(d) : colorHealth(d);

    const xLocation = (countryValue: number, width: number) => (((countryValue - minValue) * (width - relevantTileWidth))/(maxValue - minValue));

    $: maxValue = Math.max(...data.map(d => d.value));
    $: minValue = Math.min(...data.map(d => d.value));
  
  </script>
  
<div {width}>
  <svg {width} {height}>
    {#each data as d}
      {#if d.value && d.id !== country}
        <g>
          <rect
            class= "normal-tile"
            width={normalTileWidth}
            height={normalTileHeight}
            x={xLocation(d.value, width)}
            y=10
            rx={xBorderRadius}
            ry={yBorderRadius}
            filter="none"
            style = "--theme-color: {colorFunction(d.value)}"
          />
        </g>
      {/if}
    {/each}
      <g>
        <rect
          class= "relevant-tile"
          width= {relevantTileWidth}
          height= {relevantTileHeight}
          x={xLocation(value, width)}
          y=4
          rx="10"
          ry="1.5"
          filter="none"
          style = "--theme-color: {colorFunction(value)}"
        />
      </g>
  </svg>
</div>

  
  <style>

    .relevant-tile {
      fill: var(--theme-color);
      stroke-width: 1;
      stroke: black;
      z-index: 100;
    }
  
    .normal-tile {
      fill: var(--theme-color);
      z-index: 5;
    }

  </style>