<script lang="ts">
  import TreemapCountriesSVG from 'src/components/charts/TreemapCountriesSVG.svelte';
  import {sectoralBD} from 'src/data';
  import Legend from 'src/components/common/Legend.svelte';
  import { colorFuels, colorSectors } from "src/colors";
  import ScrollableX from './common/ScrollableX.svelte';

  interface Text {
    p : string;
  }
  enum TreemapType{
    fuel = 0, sectors = 1
  }
  const data = 'sectors';
//   export let id: string;
//   export var block: Content;
//   export let head : string;
//   export let text : Text[];
//   export let embed: string;
//   export let isEmbed = false;

  let cartogramAnnotation: boolean;

  const treemapParams = {
    [TreemapType.fuel] : {
      help: {
        text:
        `<strong>Each big square is a world region</strong>, sized
         by the annual mean levels of <strong>fine particular
         matter PM<sub>2.5</sub></strong>, measured in µg/m<sup>3</sup>.`
      }
    },
    [TreemapType.sectors] : {
      help: {
        text:
        `<strong>Each big square is a world region</strong>, colored by
         contributing sector and sized by the annual mean levels of
         <strong>fine particular matter PM<sub>2.5</sub></strong>,
         measured in µg/m<sup>3</sup>.`
      }
    }
  };
  const legendOptions = {
    sectors: {
      title: "Contribution of each <b>sector</b> to fine particle pollution",
      labels: [
        'Residential','Transport','International shipping',
        'Industry','Commercial','Anthropogenic fugitive, combustion and industrial dust',
        'Other combustion','Remaining sources','Landscape fires',
        'Agricultural waste burning','Agriculture',
        'Waste','Solvents','Energy','Windblown dust'
      ],
      selectionDictionary: [
        'residential', 'transport', 'intlshipping',
        'industry', 'commercial', 'afciddust', 'othercombustion',
        'remainingsources', 'otherfires', 'agrwasteburning', 'agriculture',
        'waste', 'solvents', 'energy','windblowndust'
      ],
      colors: colorSectors.range()
    },
    fuel: {
      title: "Contribution of each <b>type of fuel</b> to fine particle pollution",
      labels: ['Process','Liquid','Solid bio','Coal'],
      selectionDictionary: ['process', 'liquid', 'solidbio', 'coal'],
      colors: colorFuels.range()
    }
  };


  const pairLabels: {[key: string]: string} = {};
  let cont = 0;

  legendOptions[data].selectionDictionary.forEach(element => {
    const key = element;
    pairLabels[key] = legendOptions[data].labels[cont];
    cont++;
  });

  const currentData = sectoralBD;
  const scaleRate = currentData.scale_height / currentData.scale_width;
  let clientWidth: number = 0;
  let width: number;
  let height: number;

  export let valueType;


  $: width = Math.max(clientWidth, 700);

  $: height = width * scaleRate;
  let legendElementSelectedIndex = -1;
  let legendElementSelected = "";
  $: {
    if(
      legendElementSelectedIndex >= 0 &&
      legendElementSelectedIndex < legendOptions[data].selectionDictionary.length &&
      legendElementSelectedIndex !== null
    )
      legendElementSelected =
        (legendOptions[data].selectionDictionary[legendElementSelectedIndex] + "")
          .toLocaleLowerCase().replaceAll('.', '').replaceAll(' ', '');
    else legendElementSelected = "null";
  }
</script>
<section class='viz' style="width: 100%;">
    <Legend
        title = {legendOptions[data].title}
        colors = {legendOptions[data].colors}
        labels = {legendOptions[data].labels}
        type = {'categorical'}
    bind:selected = {legendElementSelectedIndex}
    />

  <div class="scroll-container scroll-countries margin-breakout-mobile" bind:clientWidth={clientWidth}>
    <ScrollableX>
      <div class="treemap-container" class:background={cartogramAnnotation}>
        <TreemapCountriesSVG
          data={currentData}
          {width}
          {height}
          source = {treemapParams[TreemapType[data]].help.text}
          legendElementSelected = {legendElementSelected}
          labels = {pairLabels}
          bind:annotationShowing={cartogramAnnotation}
          bind:valueType
        />
      </div>
    </ScrollableX>
  </div>

</section>

<style>
    .viz {
        padding: 20px 0 0;
    }
  .footer {
    margin-bottom: 30px;
  }

  .treemap-container {
    position: relative;
    overflow: hidden;
    width: fit-content;
    transition: 300ms background-color 700ms;
  }

    .scroll-countries :global(.overflow-right) {
        transform: translateX(100%);
        background: none;
        width: 40px;
        height: 340px;
    }

    .scroll-countries :global(.overflow-left) {
        transform: translateX(-100%);
        background: none;
        width: 40px;
        height: 340px;
    }

  /* .background {
    background-color: #f9f9f9;
    transition: 150ms background-color;
  } */

  .treemap-container :global(.annotation .text) {
    background: #f9f9f9;
    border-radius: 4px;
    padding: 0 10px 5px;
  }

</style>