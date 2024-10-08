<script lang="ts" context="module">
  export type CountryAgreementsData = {
    id: string,
    name: string,
    agreements: Agreement[]
  };
  type Agreement = { 
    id: string, 
    status: number 
  };
  export const agreementList = [
    "eanet", "asean-trans", "male", "neaspec",
    "rapap", "clrtap", "eu-directive", "us-canada", "lusaka",
    "nairobi", "abidjan", "lat-caribbean", "arctic"
  ];
</script>

<script lang="ts">
  import AgreementCard from "./AgreementCard.svelte";
  import ModalCard from "./ModalCard.svelte";
  import Legend from "./common/Legend.svelte";
  import Head from "./Head.svelte";
  import { scale } from "svelte/transition";
  import { colorAgreementTypes } from "src/colors";
  import agreementsLookup from "../data/agreementsLookup.json";
  import type { AgreementName, TextBlock } from "src/types";
  import { countriesWithArticle } from "src/data";
  import IntersectionObserver from "svelte-intersection-observer";
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import type { Options } from '@splidejs/splide';
  import '@splidejs/splide/dist/css/themes/splide-default.min.css';
  
  export let head: string = null;
  export var text: TextBlock[];
  export let searchVersion = false;
  export let countryData: CountryAgreementsData = null;
 
  const legendOptions = {
    title: "<strong>Agreement status</strong>",
    colors: colorAgreementTypes.range(),
    labels: colorAgreementTypes.domain(),
    type: "categorical"
  };

  const colorBandFn = (status: number) => (status === 1)
    ? legendOptions.colors[0]
    : legendOptions.colors[1];

  const threshold = 0.4;
  const vOffset = 250;

  let index = 0;
  let modalVisible = false;
  let selectedAgreementType: number;
  let selectedAgreement: number;
  let splideOptions: Options;
  let intersecting: boolean;
  let isGrid: boolean;
  let innerWidth: number;
  let innerHeight: number;
  let splide: Splide;
  let element;

  function openAgreementModal(i: number) {
    selectedAgreement = i;
    modalVisible = true;
  }

  function verticalScrollToCard(i: number) {
    let scrollOffset = document
      .getElementById(`agreement-card-${i}`)
      .getBoundingClientRect().top + window.scrollY - vOffset;
    window.scrollTo({
      top: scrollOffset,
      behavior: 'smooth',
    });
  }

  function onAgreementCardClicked(i: number) {
    if (!isGrid && i !== index) 
      splide.go(i);
    if (intersecting)
      openAgreementModal(i);
    else {
      verticalScrollToCard(i);
      openAgreementModal(i);
    }
  };

  function onModalClosed(){
    modalVisible = false;
    selectedAgreement = null;
  };

  function getCountryDescription(id: string){
    let hasArticle = countriesWithArticle.includes(id);
    let countryName = hasArticle ? `The ${countryData.name} ` : `${countryData.name} `;
    let nAgreements = countryData.agreements.length;
    if (nAgreements <= 0)
      return `${countryName} hasn't signed any agreements regarding air quality.`;
    if (nAgreements === 1)
      return `${countryName} has signed a single agreement regarding air quality:`;
    return `${countryName} has signed a total of ${nAgreements} agreements regarding air quality:`;
  };

  $: countrySentence = searchVersion ? getCountryDescription(countryData.id) : null;

  $: agreementsData = !countryData 
    ? Object.entries(agreementsLookup).map(a => ({
      id: a[0] as AgreementName,
      title: a[1].name,
      body: a[1].definition,
      link: a[1].url,
      status: null
    }))
    : countryData.agreements.map(a => ({
      id: a.id as AgreementName,
      title: agreementsLookup[a.id].name,
      body: agreementsLookup[a.id].definition,
      link: agreementsLookup[a.id].url,
      status: a.status
    }));

  $: if (!intersecting) onModalClosed();

  $: splideOptions = {
    type: 'slide',
    arrows: false,
    height: searchVersion ? 165 : 285,
    pagination: false,
    autoWidth: true,
    gap: 20,
    focus: 'center'
  };

  $: isGrid = ((innerWidth > 768) || (searchVersion && countryData?.agreements.length <= 1));
  
</script>

<svelte:window bind:innerWidth bind:innerHeight/>

<IntersectionObserver {element} bind:intersecting {threshold}>
  <section id="agreements-grid" class="viz wide" bind:this={element}>
    {#if !searchVersion}
      <Head title={head} selectedElement={null}/>
    {:else}
      <p class="narrow align">{@html countrySentence}</p>
    {/if}
    {#if (!searchVersion) || (searchVersion && countryData.agreements.length > 0)}
      <div class="right-narrow">
        <Legend
          title={legendOptions.title}
          colors={legendOptions.colors}
          labels={legendOptions.labels}
          type={legendOptions.type}
          interactive={false}
          bind:selected={selectedAgreementType}
        />
      </div>
    {/if}
    {#if isGrid}
      <div class="grid">
        {#each agreementsData as a, i}
          <div class="card"
            id={`agreement-card-${i}`} 
            class:simple={searchVersion} 
            style="--band-color: {colorBandFn(a.status)};">
            <AgreementCard 
              title={a.title}
              tilegram={a.id} 
              selected={selectedAgreement === i}
              simple={searchVersion}
              on:agreementClicked={() => onAgreementCardClicked(i)}/>
          </div>
        {/each}
      </div>
    {:else}
      <div class="caroussel-container" style="--card-height: {searchVersion ? 165 : 285}px;">
        <Splide 
          bind:this={splide}
          on:move={(e) => (index = e.detail.index)}
          aria-label="Agreements"
          options={splideOptions}
          hasTrack={true}
        >
            {#each agreementsData as a, i}
              <SplideSlide>
                <div class="card"
                  id={`agreement-card-${i}`} 
                  class:simple={searchVersion} 
                  style="--band-color: {colorBandFn(a.status)};"
                >
                  <AgreementCard 
                    title={a.title}
                    tilegram={a.id} 
                    selected={selectedAgreement === i}
                    simple={searchVersion}
                    on:agreementClicked={() => onAgreementCardClicked(i)}
                  />
                </div>
              </SplideSlide>
            {/each}
        </Splide>
      </div>
    {/if}
    {#if modalVisible}
      <div class="modal" transition:scale >
        <ModalCard 
          title={agreementsData[selectedAgreement].title}
          body={agreementsData[selectedAgreement].body}
          tilegram={agreementsData[selectedAgreement].id}
          link={agreementsData[selectedAgreement].link}
          on:modalClosed={onModalClosed} 
        />
      </div>
    {/if}
    {#if text}
      {#each text as t}
        <p class="col-text">{@html t.p}</p>
      {/each}
    {/if}
  </section>
</IntersectionObserver>


<style lang="scss">
  .caroussel-container {
    width: 100%;
    position: relative;
    height: var(--card-height);
  }

  .grid,
  .caroussel-container {
    margin-bottom: 4rem;
  }

  .grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .modal {
    position: fixed;
    display: block;
    top: 40%;
    z-index: 20;
  }

  .simple :global(.status-band) {
    background-color: var(--band-color);
  }

  @media(max-width: 768px) {
    .modal {
      bottom: 4rem;
      top: auto;
    }
  }

</style>