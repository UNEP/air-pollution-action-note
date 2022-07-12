<script lang="ts">
    import type {CountryDataSquare} from 'src/components/CountrySearch.svelte';
    import { createLookup } from "src/util";
    import { colorPM25, colorHealth } from "src/colors";
  
    const height = 100;
    const normalTileWidth = 3;
    const normalTileHeight = 20;
    const relevantTileWidth = 5;
    const relevantTileHeight = 34;
    const xBorderRadius = 10;
    const yBorderRadius = 2;
    const endingTileMargin = 10;
  
    export let selectedCountry: string;
    export let data: CountryDataSquare[];
    export let selectedDataset: string;
    export let width: number = 400;
  
    const colorFunction = (d: number) => selectedDataset === "pm25" ? colorPM25(d) : colorHealth(d);
  
    const dataLookUp = createLookup(data, d => d.id, d => d);

    const xLocation = (countryValue: number, width: number) => {
      return ( ( (countryValue - minValue) * (width - relevantTileWidth) ) / (maxValue - minValue) );
    };

    $: maxValue = Math.max(...data.map(d => d.value));
    $: minValue = Math.min(...data.map(d => d.value));
    $: console.log(selectedDataset, "  min value ->> ", minValue);
    $: console.log(selectedDataset, "  max value ->> ", maxValue);
  
    $: relevantCountry = {
      id: selectedCountry,
      value: dataLookUp[selectedCountry].value,
      relevantCountryColor: colorFunction(dataLookUp[selectedCountry].value)
    };
  
  </script>
  
  <div {width}>
      <svg {width} {height}>
        {#each data as d}
            {#if d.value !== null && d.id !== selectedCountry}
              <g id={d.id + d.value}>
                <rect
                  class= "normal-tile"
                  width= {d.id === selectedCountry ? relevantTileWidth : normalTileWidth}
                  height= {d.id === selectedCountry ? relevantTileHeight : normalTileHeight}
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
              x={xLocation(relevantCountry.value, width)}
              y=4
              rx="10"
              ry="1.5"
              filter="none"
              style = "--theme-color: {colorFunction(relevantCountry.value)}"
            />
          </g>
      </svg>
  </div>

  
  <style>

    .relevant-tile {
      fill: var(--theme-color);
      stroke-width: 0.75;
      stroke: black;
    }
  
    .normal-tile {
      fill: var(--theme-color);
    }

  </style>