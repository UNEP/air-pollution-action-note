<script lang="ts">
  import { colorAgreementTypes } from "src/colors";
  import agreements from "../data/agreementsData.json";
  import countries from "../data/countries.json";
  import countryNameDictionary from "src/data/countryDictionary.json";

  import { createLookup } from "src/util";

  import type { CountryDataPoint } from "./maps/Cartogram.svelte";
  import Cartogram from "./maps/Cartogram.svelte";

  export let popupVersion = false;
  export let agreement: string = "rapap";
  export let category = null;
  
  const agreementsLookup = createLookup(
    agreements,
    (d) => d.id,
    (d) => d
  );
  const countryNameDictionaryLookup = createLookup(
    countryNameDictionary,
    (d) => d.id,
    (d) => d
  );

  $: datasetParams = {
    agreements: {
      data: countries
        .filter((d) => agreementsLookup[d.code])
        .map((d) => {
          return {
            name: countryNameDictionaryLookup[d.code]?.name,
            short: countryNameDictionaryLookup[d.code]?.short,
            code: d.code,
            x: d.x,
            y: d.y,
            value: 5,
            data: agreementsLookup[d.code],
          };
        }),
      nodeSize: 16,
      helpText: { code: "", text: () => '' },
      hoverTextFn: (d: CountryDataPoint) => (d.data.name),
      colorFn: (d: CountryDataPoint) => {
        let agreementsData = d.data;
        const colors = colorAgreementTypes.range();
        const hasValue = category && category === agreementsData[agreement];

        if (category) return hasValue ? colors[agreementsData[agreement] - 1] : '#D9D9D9';
        return agreementsData[agreement] !== 0 ? colors[agreementsData[agreement] - 1] : "#D9D9D9";
      },
      classesFn: (d: CountryDataPoint) => {
        let agreementsData = d.data;
        const hasValue = category && category === agreementsData[agreement];

        return hasValue ? ["country--shadow"] : [];
      },
      color: colorAgreementTypes,
      legendTitle: '',
      legendDomain: colorAgreementTypes.range(),
      legendType: "sequential",
      domain: [1300, 1300 / (740 / 420)] as [number, number],
      linearDomain: null,
      internalLabels: null,
    },
  };

  let width = 0;
  let height = 0;

  let rerender: () => void;
  // TODO: Ajust with the Agreements Grid component
  $: {
    width = popupVersion ? 450 : 210;
    height = width * 0.62;
  }

</script>


<div
  style="width: {width}px; height: {height}px"
  class="cartogram-container agreement-cartogram"
  class:grid-version={!popupVersion}
>
  <Cartogram
    {...datasetParams["agreements"]}
    slug={"agreements"}
    bind:rerenderFn={rerender}
    annotationShowing={false}
    staticPosition
  />
</div>


<style>
  .agreement-cartogram {
    transform-origin: 0 0;
    height: 100%;
    width: 100%;
    display: flex;
    position: relative;
  }

  .agreement-cartogram :global(.text) {
    background:rgba(255, 255, 255, 0.6);
    border-radius: 4px;
    padding: 10px 5px;
  }

  .agreement-cartogram :global(.annotation) {
    width: calc(250px + 3%) !important;
  }

  .agreement-cartogram :global(.line) {
    border: none !important;
  }

  .grid-version :global(.country) {
    pointer-events: none !important;
  }

</style>

