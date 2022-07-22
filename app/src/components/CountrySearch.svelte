<script lang="ts">
  import Typeahead from "svelte-typeahead";
  import LinearDistribution from "./charts/LinearDistribution.svelte";
  import DeathCauses from "./DeathCauses.svelte";
  import countries from 'src/data/countryDictionary.json';
  import deathsdata from 'src/data/deathDatabase.json';
  import pm25data from 'src/data/pm25.json';
  import healthData from 'src/data/health.json';
  import policiesData from 'src/data/policiesData.json';
  import policiesDescriptions from 'src/data/policiesDescriptions.json';
  import SectionTitle from "./SectionTitle.svelte";
  import PolicyGrid from "./PolicyGrid.svelte";
  import { createLookup } from "src/util";
  import type { DeathsData } from "./DeathCauses.svelte";
  import type { Content } from "src/types";
  import type { CountryDataSquare } from "./charts/LinearDistribution.svelte";

  export var id: string;
  export var head: string;
  export var block: Content;

  const countriesToBeFiltered = ["AIA","VGB","CYM","CUW","SWZ","FLK","FRO",
    "GIB","VAT","JEY","LIE","MSR","NCL","NFK","PCN","SHN","SPM","TCA","ESH"];

  const countryPM25Data: CountryDataSquare[] = pm25data.map(d => {
    return { id: d.id, value: d.pm25 };
  });

  const countryHealthData: CountryDataSquare[] = healthData.map(d => {
    return { id: d.id, value: d.rate };
  });

  const descLookUp = createLookup(policiesDescriptions, d => d.id, d => d);
  const CTBF_lookUp = createLookup(countriesToBeFiltered, c => c, c => c);
  const pm25LookUp = createLookup(pm25data, p => p.id, p => p);
  const healthLookUp = createLookup(healthData, h => h.id, h => h);
  const deathsLookUp = createLookup(deathsdata, d => d.id, d => d);
  const policiesLookUp = createLookup(policiesData, p => p.id, p => p);

  const maxNumSearchResults = 5;

  $: currentCountry = {
    id: "",
    PM25country: 0,
    timesPM25: 0,
    totalDeaths: 0,
    deathRatio: 0
  };

  let countrySelected = false;

  const generateDeathsData = (countryID: string) => {
    let countryInfo = deathsLookUp[countryID];
    if (countryInfo) {
      let deathsData: DeathsData = {
        copd: countryInfo.copd,
        diabetes: countryInfo.diabetes,
        ischemic: countryInfo.ischemic,
        lungcancer: countryInfo.lungcancer,
        lri: countryInfo.lri,
        stroke: countryInfo.stroke,
        nd: countryInfo.nd
      }
      return deathsData;
    }
    else {
      return {
        copd: 0,
        diabetes: 0,
        ischemic: 0,
        lungcancer: 0,
        lri: 0,
        stroke: 0,
        nd: 0
      }
    }
  }

  const generatePoliciesData = (countryID: string) => {
    let countryInfo = policiesLookUp[countryID];
    if (countryInfo) {
      return countryInfo;
    }
  }
  

  function toFilter(countryID:string){
    if (!CTBF_lookUp[countryID])
      return false;
    else 
      return true;
  }

  const extract = (item) => item.name;
  const filter = (item) => toFilter(item.id);

  function updateSelectedCountry(event, detail) {
    if (event === "select"){
      let newID = detail.original.id;
      currentCountry.id = newID;
      currentCountry.PM25country = pm25LookUp[newID].pm25;
      currentCountry.timesPM25 = parseFloat((currentCountry.PM25country / 5).toFixed(1));
      currentCountry.totalDeaths = healthLookUp[newID].deaths;
      currentCountry.deathRatio = healthLookUp[newID].rate;
      countrySelected = true;
    }
    else{
      currentCountry.id = "";
      currentCountry.PM25country = 0;
      currentCountry.timesPM25 = 0;
      currentCountry.totalDeaths = 0;
      currentCountry.deathRatio = 0;
      countrySelected = false;
    }
  }

  $: countryDeathsData = generateDeathsData(currentCountry.id);
  $: countryPoliciesData = generatePoliciesData(currentCountry.id);

  $: PM25commentary = ` µg/m<sup>3</sup> <br>each person's annual mean exposure <br>—` 
  + currentCountry.timesPM25 + ` times WHO's guideline.`;

  $: PMtimesCommentary = ` deaths per 100,000 people <br>attributable to fine particle 
    pollution in 2017 <br>(` + currentCountry.totalDeaths.toLocaleString('en-US')
    + ` in total in the country).`;

  const minDistributionSize = 150;
  const maxDistributionSize = 385;
  let linearDistributionsWidth: number = maxDistributionSize;

  const clamp = (n: number, min: number, max:number) => Math.min(Math.max(n, min), max);

</script>
  
<section {id} class="viz wide country-search">

  <SectionTitle {block} />

  <h2 class='narrow'>{@html head}</h2>

  <div class="search-bar">
    <Typeahead 
      data={countries} 
      {extract} 
      {filter}
      on:select={(e) => updateSelectedCountry("select", e.detail)}
      on:clear={(e) => updateSelectedCountry("clear", e.detail)}
      limit={maxNumSearchResults}
      placeholder={ `Search a country`}
      hideLabel>
    </Typeahead>
  </div>

  {#if countrySelected}
    <div class="distributions-container" bind:clientWidth={linearDistributionsWidth}>
      <div class="distribution">
        <p class="primary-text"><span class="bigger-text">{currentCountry.PM25country}</span>{@html PM25commentary}</p>
          <LinearDistribution
            data = {countryPM25Data}
            value = {pm25LookUp[currentCountry.id].pm25}
            country = {currentCountry.id}
            type = "pm25"
            width = {clamp(linearDistributionsWidth, minDistributionSize, maxDistributionSize)}
          />
      </div>
      <div class="distribution">
        <p class="primary-text"><span class="bigger-text">{currentCountry.deathRatio}</span>{@html PMtimesCommentary}</p>
          <LinearDistribution
            data = {countryHealthData}
            value = {healthLookUp[currentCountry.id].rate}
            country = {currentCountry.id}
            type = "health"
            width = {clamp(linearDistributionsWidth, minDistributionSize, maxDistributionSize)}
          />
      </div>
    </div>

    <div class="death-causes-container">
      <DeathCauses data={countryDeathsData}/>
    </div>

    <div class="policy-grid-container">
      <PolicyGrid data={policiesLookUp[currentCountry.id]} desc={descLookUp[currentCountry.id]}/>
    </div>

  {/if}
</section>
  
<style>

  .primary-text {
    margin-bottom: 0;
    padding-bottom: 10px;
  }

  .country-search {
    margin-bottom: 0rem;
  }

  .distributions-container {
    display: flex;
    flex-direction: row;
    column-gap: 3rem;
    flex-wrap: wrap;
    margin-top: 2.5rem;
  }

  .bigger-text {
    font-size: 200%;
  }

  .search-bar :global([data-svelte-typeahead] ::-webkit-search-cancel-button) {
    -webkit-appearance: none;
    appearance: none;
    height: 10px;
    width: 10px;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjEyMy4wNXB4IiBoZWlnaHQ9IjEyMy4wNXB4IiB2aWV3Qm94PSIwIDAgMTIzLjA1IDEyMy4wNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTIzLjA1IDEyMy4wNTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTEyMS4zMjUsMTAuOTI1bC04LjUtOC4zOTljLTIuMy0yLjMtNi4xLTIuMy04LjUsMGwtNDIuNCw0Mi4zOTlMMTguNzI2LDEuNzI2Yy0yLjMwMS0yLjMwMS02LjEwMS0yLjMwMS04LjUsMGwtOC41LDguNQ0KCQljLTIuMzAxLDIuMy0yLjMwMSw2LjEsMCw4LjVsNDMuMSw0My4xbC00Mi4zLDQyLjVjLTIuMywyLjMtMi4zLDYuMSwwLDguNWw4LjUsOC41YzIuMywyLjMsNi4xLDIuMyw4LjUsMGw0Mi4zOTktNDIuNGw0Mi40LDQyLjQNCgkJYzIuMywyLjMsNi4xLDIuMyw4LjUsMGw4LjUtOC41YzIuMy0yLjMsMi4zLTYuMSwwLTguNWwtNDIuNS00Mi40bDQyLjQtNDIuMzk5QzEyMy42MjUsMTcuMTI1LDEyMy42MjUsMTMuMzI1LDEyMS4zMjUsMTAuOTI1eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=);
    background-size: 10px 10px;
  }

  .search-bar :global([data-svelte-typeahead]) {
    margin: 0rem;
    max-width: 333px;
    margin-top: 30px;
    background-color: #f9f9f9;
    z-index: 5;
  }

  .search-bar :global([data-svelte-typeahead] mark) {
    background-color: transparent;
    color: #121212;
    font-weight: bold;
  }

  .search-bar :global([data-svelte-search] input:focus) {
    outline-width: 0px;
    background-color: #f9f9f9;
  }

  .search-bar :global(li) {
    color: #808080
  }

  .search-bar :global([data-svelte-search] input) {
    width: 100%;
    padding: 0.5rem 10px;
    background: #f9f9f9;
    font-size: 1.5rem;
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid #808080;
    border-radius: 6px;
    font-family: Roboto;
    font-weight: 300;
  }

  .search-bar :global([data-svelte-search] label) {
    margin-bottom: 0.25rem;
    display: inline-flex;
    font-size: 0.875rem;
  }
  
</style>