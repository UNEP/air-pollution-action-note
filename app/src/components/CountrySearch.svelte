<script lang="ts">
  import { onMount } from "svelte/internal";
  import Typeahead from "svelte-typeahead";
  import LinearDistribution from "./charts/LinearDistribution.svelte";
  import DeathCauses from "./DeathCauses.svelte";
  import countries from 'src/data/countryDictionary.json';
  import deathsdata from 'src/data/deathDatabase.json';
  import pm25data from 'src/data/pm25_coords.json';
  import healthData from 'src/data/deaths.json';
  import policiesData from 'src/data/policiesData.json';
  import policiesDescriptions from 'src/data/policiesDescriptions.json';
  import countryDictionary from 'src/data/countryDictionary.json';
  import alpha2Data from 'src/data/alpha2countries.json';
  import agreementsData from 'src/data/agreementsData.json';
  import SectionTitle from "./SectionTitle.svelte";
  import PolicyGrid from "./PolicyGrid.svelte";
  import { createLookup } from "src/util";
  import type { DeathsData } from "./DeathCauses.svelte";
  import type { Content } from "src/types";
  import type { CountryDataSquare } from "./charts/LinearDistribution.svelte";
  import AgreementsGrid from "./AgreementsGrid.svelte";
  import type { CountryAgreementsData } from "./AgreementsGrid.svelte";
  import { agreementList } from "./AgreementsGrid.svelte";
  import { clamp } from "src/util";

  export var id: string;
  export var head: string;
  export var block: Content;

  const MAX_RESULTS = 5;

  const geolocationOptions = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: Infinity
  };

  function geolocationSuccess(pos) {
    getCountryFromCoordinates(pos.coords.latitude, pos.coords.longitude);
  }

  function geolocationError(err) {
    getRandomCountry();
  }

  const getCountryFromCoordinates = async (lat: number, long: number) => {
    fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`)
    .then(response => response.json())
    .then(data => {
      let alpha2 = (data.address.country_code).toUpperCase();
      let alpha3 = geolocationLookUp[alpha2];
      typeaheadValue = countryNameLookUp[alpha3];
      selectCountry(alpha3);
    }).catch(error => {
      getRandomCountry();
      return []; 
    });
  }

  const getRandomCountry = () => {
    let filteredCountries = countryDictionary.filter(function (c) {
      return !countriesToBeFiltered.includes(c.id);
    });
    let randomPos = Math.floor(Math.random() * filteredCountries.length);
    let randomCountryID = filteredCountries[randomPos].id;
    typeaheadValue = countryNameLookUp[randomCountryID];
    selectCountry(randomCountryID);
  }

  onMount(async () => {
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, geolocationOptions);
  });  

  const countriesToBeFiltered = 
    ["AIA","VGB","CYM","CUW","SWZ","FLK","FRO",
    "GIB","VAT","JEY","LIE","MSR","NCL","NFK",
    "PCN","SHN","SPM","TCA","ESH","COK","MNP"];

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
  const geolocationLookUp = createLookup(alpha2Data, a => a.alpha_2, p => p.id);
  const countryNameLookUp = createLookup(countryDictionary, c => c.id, c => c.name);
  const agreementsLookup = createLookup(agreementsData, a => a.id, a => a);

  let numResults = 5;
  let typeaheadValue: string;
  let countryAgreementsData: CountryAgreementsData;
  let showDropdown = false;

  let currentCountry = {
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

  const extract = (item) => item.name;
  const filter = (item) => Boolean(CTBF_lookUp[item.id]);

  function updateSelectedCountry(event, detail) {
    event === "select" ? selectCountry(detail.original.id) : clearCountry();
  }

  const selectCountry = (newID: string) => {
    currentCountry.id = newID;
    currentCountry.PM25country = pm25LookUp[newID].pm25;
    currentCountry.timesPM25 = parseFloat((currentCountry.PM25country / 5).toFixed(1));
    currentCountry.totalDeaths = healthLookUp[newID].deaths;
    currentCountry.deathRatio = healthLookUp[newID].rate;
    countrySelected = true;
  }

  const clearCountry = () => {
    currentCountry.id = "";
    currentCountry.PM25country = 0;
    currentCountry.timesPM25 = 0;
    currentCountry.totalDeaths = 0;
    currentCountry.deathRatio = 0;
    countrySelected = false;
  }

  const minDistributionSize = 150;
  const maxDistributionSize = 385;
  let linearDistributionsWidth = maxDistributionSize;

  $: countryDeathsData = generateDeathsData(currentCountry.id);

  $: PM25commentary = ` µg/m<sup>3</sup> <br>each person's annual mean exposure <br>—` 
    + currentCountry.timesPM25 + ` times WHO's guideline.`;

  $: PMtimesCommentary = ` deaths per 100,000 people <br>attributable to fine particle 
    pollution in 2019 <br>(` + currentCountry.totalDeaths.toLocaleString('en-US')
    + ` in total in the country).`;

  $: numResults = showDropdown ? MAX_RESULTS : 0;

  $: countryAgreementsData = {
    id: currentCountry.id,
    name: countryNameLookUp[currentCountry.id],
    agreements: agreementList.filter((i) => agreementsLookup[currentCountry.id][i] > 0)
      .map((a) => ({id: a, status: agreementsLookup[currentCountry.id][a]}))
  };
</script>
  
<section {id} class="viz wide country-search">

  <SectionTitle {block} />

  <h2 class='narrow'>{@html head}</h2>

  <div class="search-bar">
    <Typeahead
      data={countries}
      bind:value={typeaheadValue} 
      {extract} 
      {filter}
      on:select={(e) => updateSelectedCountry("select", e.detail)}
      on:clear={(e) => updateSelectedCountry("clear", e.detail)}
      on:focus={() => showDropdown = true}
      limit={numResults}
      placeholder={`Search a country`}
      hideLabel
    />
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
        <p class="primary-text"><span class="bigger-text">{Math.round(currentCountry.deathRatio)}</span>{@html PMtimesCommentary}</p>
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

    <div class="agreements-grid-container">
      <AgreementsGrid 
        countryData={countryAgreementsData}
        searchVersion
      />
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
    cursor: pointer;
  }

  .search-bar :global([data-svelte-typeahead]) {
    margin: 0rem;
    max-width: 333px;
    margin-top: 30px;
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
    font-size: 1.5rem;
    border: 0;
    border-radius: 0;
    border-bottom: 0px solid #808080;
    border-radius: 6px;
    font-family: Roboto;
    font-weight: 300;
    background: linear-gradient(120deg, #f9f9f9, #e2e2e2);
    background-size: 300% 300%;
    -webkit-animation: SearchBarAnimation 3s ease infinite;
    -moz-animation: SearchBarAnimation 3s ease infinite;
    -o-animation: SearchBarAnimation 3s ease infinite;
    animation: SearchBarAnimation 3s ease infinite;
  }

  @-webkit-keyframes SearchBarAnimation {
    0%{background-position:0% 55%}
    50%{background-position:100% 46%}
    100%{background-position:0% 55%}
  }
  @-moz-keyframes SearchBarAnimation {
    0%{background-position:0% 55%}
    50%{background-position:100% 46%}
    100%{background-position:0% 55%}
  }
  @-o-keyframes SearchBarAnimation {
    0%{background-position:0% 55%}
    50%{background-position:100% 46%}
    100%{background-position:0% 55%}
  }
  @keyframes SearchBarAnimation {
    0%{background-position:0% 55%}
    50%{background-position:100% 46%}
    100%{background-position:0% 55%}
  }

  .search-bar :global([data-svelte-search] label) {
    margin-bottom: 0.25rem;
    display: inline-flex;
    font-size: 0.875rem;
  }
  
</style>