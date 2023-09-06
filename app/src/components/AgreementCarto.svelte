<script lang="ts">
  import { colorAgreementTypes } from "src/colors";
  import Cartogram from "./maps/Cartogram.svelte";
  import agreements from "../data/agreementsData.json";
  import countries from "../data/countries.json";
  import countryNameDictionary from "src/data/countryDictionary.json";
  import { createLookup } from "src/util";
  import type { CountryDataPoint } from "./maps/Cartogram.svelte";
  import type { AgreementName } from "src/types";

  export let agreement: AgreementName;
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

</script>


<div class="agreement-cartogram">
  <Cartogram
    {...datasetParams["agreements"]}
    slug={"agreements"}
    annotationShowing={false}
    staticPosition
  />
</div>


<style lang="scss">
  .agreement-cartogram {
    transform-origin: 0 0;
    aspect-ratio: 16/10;
    width: 100%;
    display: flex;
    position: relative;

    :global(.text) {
      background-color:rgba(255, 255, 255, 0.6);
      border-radius: 4px;
      padding: 0.625rem 0.313rem;
    }
    :global(.country) {
      border-radius: 20% !important;
    }
    :global(.line) {
      border: none !important;
    }
  }

</style>

