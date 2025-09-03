<script lang="ts">
  import { onMount } from "svelte/internal";
  import Typeahead from "svelte-typeahead";
  import LinearDistribution from "./charts/LinearDistribution.svelte";
  import DeathCauses from "./DeathCauses.svelte";
  import countries from "src/data/countryDictionary.json";
  import deathsdata from "src/data/deathDatabase.json";
  import sectorCountriesData from "src/data/sectors_updated.json";
  import sectorsTotalData from "src/data/sectorsTotalData.json";
  import pm25data from "src/data/pm25_coords.json";
  import healthData from "src/data/deaths.json";
  import policiesData from "src/data/policiesData.json";
  import policiesDescriptions from "src/data/policiesDescriptions.json";
  import countryDictionary from "src/data/countryDictionary.json";
  import alpha2Data from "src/data/alpha2countries.json";
  import agreementsData from "src/data/agreementsData.json";
  import SectionTitle from "./SectionTitle.svelte";
  import PolicyGrid from "./PolicyGrid.svelte";
  import SingleCountryTreemapSVG from "./charts/SingleCountryTreemapSVG.svelte";
  import { createLookup } from "src/util";
  import type { DeathsData } from "./DeathCauses.svelte";
  import type { Content } from "src/types";
  import type { CountryDataSquare } from "./charts/LinearDistribution.svelte";
  import AgreementsGrid from "./AgreementsGrid.svelte";
  import type { CountryAgreementsData } from "./AgreementsGrid.svelte";
  import { agreementList } from "./AgreementsGrid.svelte";
  import { clamp } from "src/util";
  import html2canvas from 'html2canvas';
  import SingleCountryTreemapDemo from "./charts/SingleCountryTreemapDemo.svelte";
  export var id: string;
  export var head: string;
  export var block: Content;

  const MAX_RESULTS = 5;

  const geolocationOptions = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: Infinity,
  };

  function geolocationSuccess(pos) {
    getCountryFromCoordinates(pos.coords.latitude, pos.coords.longitude);
  }

  function geolocationError(err) {
    getRandomCountry();
  }
  

  const getCountryFromCoordinates = async (lat: number, long: number) => {
    fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`)
      .then((response) => response.json())
      .then((data) => {
        let alpha2 = data.address.country_code.toUpperCase();
        let alpha3 = geolocationLookUp[alpha2];
        typeaheadValue = countryNameLookUp[alpha3];
        selectCountry(alpha3);
      })
      .catch((error) => {
        getRandomCountry();
        return [];
      });
  };
    let isDownloading = false;

  const capture = () => {
    isDownloading = true;
    setTimeout(() => {
    html2canvas(
			document.getElementById("countrySearch")
		).then(function(canvas) {
			const dataURL = canvas.toDataURL("image/png", 1.0);
			saveAs(dataURL, countryNameLookUp[currentCountry.id] + '-air-pollution-impact.png');
            isDownloading = false;
        
			// let target = document.querySelector("div[class^='gallery']")
			// target.appendChild(canvas);
		});
    }, 1000);
  }

  function saveAs(uri, filename) {

        var link = document.createElement('a');

        if (typeof link.download === 'string') {

            link.href = uri;
            link.download = filename;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

        } else {

            window.open(uri);

        }
    }

  const getRandomCountry = () => {
    let filteredCountries = countryDictionary.filter(function (c) {
      return !countriesToBeFiltered.includes(c.id);
    });
    let randomPos = Math.floor(Math.random() * filteredCountries.length);
    let randomCountryID = filteredCountries[randomPos].id;
    typeaheadValue = countryNameLookUp[randomCountryID];
    selectCountry(randomCountryID);
  };

  onMount(async () => {
    navigator.geolocation.getCurrentPosition(
      geolocationSuccess,
      geolocationError,
      geolocationOptions
    );
  });

  const countriesToBeFiltered = [
    "AIA",
    "VGB",
    "CYM",
    "CUW",
    "SWZ",
    "FLK",
    "FRO",
    "GIB",
    "VAT",
    "JEY",
    "LIE",
    "MSR",
    "NCL",
    "NFK",
    "PCN",
    "SHN",
    "SPM",
    "TCA",
    "ESH",
    "COK",
    "MNP",
  ];

  const countryPM25Data: CountryDataSquare[] = pm25data.map((d) => {
    return { id: d.id, value: d.pm25 };
  });

  const countryHealthData: CountryDataSquare[] = healthData.map((d) => {
    return { id: d.id, value: d.rate };
  });

  const descLookUp = createLookup(
    policiesDescriptions,
    (d) => d.id,
    (d) => d
  );
  const CTBF_lookUp = createLookup(
    countriesToBeFiltered,
    (c) => c,
    (c) => c
  );
  const pm25LookUp = createLookup(
    pm25data,
    (p) => p.id,
    (p) => p
  );
  const healthLookUp = createLookup(
    healthData,
    (h) => h.id,
    (h) => h
  );
  const deathsLookUp = createLookup(
    deathsdata,
    (d) => d.id,
    (d) => d
  );
  const policiesLookUp = createLookup(
    policiesData,
    (p) => p.id,
    (p) => p
  );
  const geolocationLookUp = createLookup(
    alpha2Data,
    (a) => a.alpha_2,
    (p) => p.id
  );
  const countryNameLookUp = createLookup(
    countryDictionary,
    (c) => c.id,
    (c) => c.name
  );
  const agreementsLookup = createLookup(
    agreementsData,
    (a) => a.id,
    (a) => a
  );

  let numResults = 5;
  let typeaheadValue: string;
  let countryAgreementsData: CountryAgreementsData;
  let showDropdown = false;

  let currentCountry = {
    id: "",
    PM25country: 0,
    timesPM25: 0,
    totalDeaths: 0,
    deathRatio: 0,
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
        nd: countryInfo.nd,
      };
      return deathsData;
    } else {
      return {
        copd: 0,
        diabetes: 0,
        ischemic: 0,
        lungcancer: 0,
        lri: 0,
        stroke: 0,
        nd: 0,
      };
    }
  };

  const extract = (item) => item.name;
  const filter = (item) => Boolean(CTBF_lookUp[item.id]);

  function updateSelectedCountry(event, detail) {
    event === "select" ? selectCountry(detail.original.id) : clearCountry();
  }

  const selectCountry = (newID: string) => {
    currentCountry.id = newID;
    currentCountry.PM25country = pm25LookUp[newID].pm25;
    currentCountry.timesPM25 = parseFloat(
      (currentCountry.PM25country / 5).toFixed(1)
    );
    currentCountry.totalDeaths = healthLookUp[newID].deaths;
    currentCountry.deathRatio = healthLookUp[newID].rate;
    countrySelected = true;
  };

  const clearCountry = () => {
    currentCountry.id = "";
    currentCountry.PM25country = 0;
    currentCountry.timesPM25 = 0;
    currentCountry.totalDeaths = 0;
    currentCountry.deathRatio = 0;
    countrySelected = false;
  };

  const minDistributionSize = 150;
  const maxDistributionSize = 385;
  let linearDistributionsWidth = maxDistributionSize;

  $: countryDeathsData = generateDeathsData(currentCountry.id);

  $: PM25commentary =
    ` µg/m<sup>3</sup> <br>each person's annual mean exposure <br>—` +
    currentCountry.timesPM25 +
    ` times WHO's guideline.`;

  $: PMtimesCommentary =
    ` deaths per 100,000 people <br>attributable to fine particulate outdoor air pollution in 2021   (` +
    currentCountry.totalDeaths.toLocaleString("en-US") +
    ` in total in the country) (age-standardized).`;

  $: numResults = showDropdown ? MAX_RESULTS : 0;
  $: countrySectorsData = (() => {
    const found = sectorCountriesData.find((d) => d.id === currentCountry.id);
    return found ? Object.entries(found).slice(1).map(([key, value]) => ({ type: key, value: value < 0 ? 0 : value })) : [];
  })();
  $: totalCountrySectorsData = countrySectorsData.reduce((sum, item) => sum + item.value, 0);
  $: totalSectorsData = sectorsTotalData.find((d) => d.id === currentCountry.id)?.total || 0;
  $: console.log(currentCountry.id, countrySectorsData, totalSectorsData);
  $: countryAgreementsData = {
    id: currentCountry.id,
    name: countryNameLookUp[currentCountry.id],
    agreements: agreementList
      .filter((i) => agreementsLookup[currentCountry.id][i] > 0)
      .map((a) => ({ id: a, status: agreementsLookup[currentCountry.id][a] })),
  };
</script>

<section {id} class="viz wide country-search">
  <div class="downloading" class:active={isDownloading}>Downloading...<br />Please wait...</div>
  <div id="countrySearch">
    <SectionTitle {block} />

    <h2 class="narrow">{@html head}</h2>
  
    <div class="search-bar">
      <Typeahead
        data={countries}
        bind:value={typeaheadValue}
        {extract}
        {filter}
        on:select={(e) => updateSelectedCountry("select", e.detail)}
        on:clear={(e) => updateSelectedCountry("clear", e.detail)}
        on:focus={() => (showDropdown = true)}
        limit={numResults}
        placeholder={`Search a country`}
        hideLabel
      />
      {#if countrySelected && !isDownloading}
          {#if !isDownloading}
              <button on:click={() => capture()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <mask id="mask0_3039_21" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                      <rect width="32" height="32" fill="#D9D9D9"/>
                      </mask>
                      <g mask="url(#mask0_3039_21)">
                      <path d="M16.0003 20.331C15.8568 20.331 15.7243 20.3075 15.603 20.2607C15.4817 20.2135 15.3628 20.1319 15.2463 20.0157L11.7543 16.5233C11.6243 16.3935 11.5563 16.2405 11.5503 16.0643C11.5443 15.8883 11.6123 15.7268 11.7543 15.5797C11.9012 15.4328 12.0597 15.358 12.2297 15.3553C12.3999 15.3529 12.5584 15.4251 12.7053 15.572L15.3337 18.2003V7.33366C15.3337 7.14388 15.3973 6.98532 15.5247 6.85799C15.652 6.73066 15.8105 6.66699 16.0003 6.66699C16.1901 6.66699 16.3487 6.73066 16.476 6.85799C16.6033 6.98532 16.667 7.14388 16.667 7.33366V18.2003L19.2953 15.572C19.4251 15.4422 19.5793 15.3743 19.758 15.3683C19.9367 15.3623 20.0994 15.4328 20.2463 15.5797C20.3883 15.7268 20.4605 15.8841 20.463 16.0517C20.4657 16.2192 20.3934 16.3764 20.2463 16.5233L16.7543 20.0157C16.6379 20.1319 16.519 20.2135 16.3977 20.2607C16.2763 20.3075 16.1439 20.331 16.0003 20.331ZM8.82099 25.3337C8.20721 25.3337 7.69477 25.1281 7.28366 24.717C6.87255 24.3059 6.66699 23.7934 6.66699 23.1797V20.6157C6.66699 20.4259 6.73066 20.2673 6.85799 20.14C6.98533 20.0127 7.14388 19.949 7.33366 19.949C7.52344 19.949 7.68199 20.0127 7.80933 20.14C7.93666 20.2673 8.00033 20.4259 8.00033 20.6157V23.1797C8.00033 23.385 8.08577 23.5731 8.25666 23.744C8.42755 23.9149 8.61566 24.0003 8.82099 24.0003H23.1797C23.385 24.0003 23.5731 23.9149 23.744 23.744C23.9149 23.5731 24.0003 23.385 24.0003 23.1797V20.6157C24.0003 20.4259 24.064 20.2673 24.1913 20.14C24.3187 20.0127 24.4772 19.949 24.667 19.949C24.8568 19.949 25.0153 20.0127 25.1427 20.14C25.27 20.2673 25.3337 20.4259 25.3337 20.6157V23.1797C25.3337 23.7934 25.1281 24.3059 24.717 24.717C24.3059 25.1281 23.7934 25.3337 23.1797 25.3337H8.82099Z" fill="white"/>
                      </g>
                  </svg>
                  <span>Download</span>  
              </button>
              {:else}
              <button>
                  <span>Downloading ...</span>
              </button>
          {/if}
      {/if}
    </div>
  
    {#if countrySelected}
      <div id="countryData">
        <div
          class="distributions-container"
          bind:clientWidth={linearDistributionsWidth}
        >
          <div class="distribution">
            <p class="primary-text">
              <span class="bigger-text">{currentCountry.PM25country}</span
              >{@html PM25commentary}
            </p>
            <LinearDistribution
              data={countryPM25Data}
              value={pm25LookUp[currentCountry.id].pm25}
              country={currentCountry.id}
              type="pm25"
              width={clamp(
                linearDistributionsWidth,
                minDistributionSize,
                maxDistributionSize
              )}
            />
          </div>
          <div class="distribution">
            <p class="primary-text">
              <span class="bigger-text"
                >{Math.round(currentCountry.deathRatio)}</span
              >{@html PMtimesCommentary}
            </p>
            <LinearDistribution
              data={countryHealthData}
              value={healthLookUp[currentCountry.id].rate}
              country={currentCountry.id}
              type="health"
              width={clamp(
                linearDistributionsWidth,
                minDistributionSize,
                maxDistributionSize
              )}
            />
          </div>
        </div>
  
        <div class="death-causes-container">
          <DeathCauses data={countryDeathsData} />
        </div>
  
        <!-- <div class="policy-grid-container">
          <PolicyGrid
            data={policiesLookUp[currentCountry.id]}
            desc={descLookUp[currentCountry.id]}
          />
        </div> -->
        {#if totalCountrySectorsData !== 0}
          <div class="single-country-treemap-container">
            <SingleCountryTreemapSVG
              countryCode={currentCountry.id}
              countryName={countryNameLookUp[currentCountry.id]}
              dataType={'sectors'}
              pollutionData={countrySectorsData}
              totalValue={totalCountrySectorsData}
              totalValuePopulation={totalSectorsData}
              valueType={`percentage`}
              width={300}
              height={300}
              showLegend={true}
              showCountryName={false}
              bind:isDownloading={isDownloading}
            />
          </div>
        {/if}
        <div class="agreements-grid-container">
          <AgreementsGrid countryData={countryAgreementsData} searchVersion />
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .distribution {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 385px;
  }
  .downloading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 990px;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: start;
    font-size: 20px;
    font-weight: normal;
    text-align: center;
    padding: 80px 0;
    pointer-events: none;
    opacity: 0;
  }

  .downloading.active {
    pointer-events: auto;
    opacity: 1;
  }

  #countrySearch {
    width: 100%;
    height: 100%;
    padding: 50px;
    margin-top: -50px;
    margin-left: -50px;
  }
    #countryData {
        width: fit-content;
        padding-top: 50px;
        margin-top: -50px;
        padding-left: 50px;
        margin-left: -50px;
    }
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

  .search-bar {
    display: flex;
    align-items: end;
    gap: 90px;
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
    color: #808080;
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

  .search-bar button {
    cursor: pointer;
    background-color: #1E1E1E;
    display: inline-flex;
    height: 46px;
    padding: 0px 32px 0px 24px;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .search-bar button span {
    color: var(--E0E0E0, #E0E0E0);
    text-align: center;

    /* Menu */
    font-family: Arial;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 21.6px; /* 135% */
  }

  @-webkit-keyframes SearchBarAnimation {
    0% {
      background-position: 0% 55%;
    }
    50% {
      background-position: 100% 46%;
    }
    100% {
      background-position: 0% 55%;
    }
  }
  @-moz-keyframes SearchBarAnimation {
    0% {
      background-position: 0% 55%;
    }
    50% {
      background-position: 100% 46%;
    }
    100% {
      background-position: 0% 55%;
    }
  }
  @-o-keyframes SearchBarAnimation {
    0% {
      background-position: 0% 55%;
    }
    50% {
      background-position: 100% 46%;
    }
    100% {
      background-position: 0% 55%;
    }
  }
  @keyframes SearchBarAnimation {
    0% {
      background-position: 0% 55%;
    }
    50% {
      background-position: 100% 46%;
    }
    100% {
      background-position: 0% 55%;
    }
  }

  .search-bar :global([data-svelte-search] label) {
    margin-bottom: 0.25rem;
    display: inline-flex;
    font-size: 0.875rem;
  }
</style>
