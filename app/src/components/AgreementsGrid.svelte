<script lang="ts" context="module">
  export type CountryAgreementsData = {
    id: string,
    name: string,
    agreements: string[]
  };
</script>

<script lang="ts">
  import AgreementCard from "./AgreementCard.svelte";
  import ModalCard from "./ModalCard.svelte";
  import Legend from "./common/Legend.svelte";
  import Head from "./Head.svelte";
  import { scale } from "svelte/transition";
  import { colorAgreementTypes } from "src/colors";
  import agreementsLookup from "../data/agreementsLookup.json";
  import type { AgreementName } from "src/types";
  import { countriesWithArticle } from "src/data";

  export let head: string = null;
  export let searchVersion = false;
  export let countryData: CountryAgreementsData = null;

  const agreementsData = Object.entries(agreementsLookup).map(a => ({
    id: a[0] as AgreementName,
    title: a[1].name,
    body: a[1].definition,
    link: a[1].url
  }));
 
  const legendOptions = {
    title: "Agreement status",
    colors: colorAgreementTypes.range(),
    labels: colorAgreementTypes.domain(),
    type: "categorical"
  };

  let modalVisible = false;
  let selectedAgreementType: number;
  let selectedAgreement: number;

  function onAgreementCardClicked(i: number) {
    selectedAgreement = i;
    modalVisible = true;
  };

  function onModalClosed(){
    modalVisible = false;
    selectedAgreement = null;
  };

  //work in progress

  function getCountryDescription(id: string){
    let hasArticle = countriesWithArticle.includes(id);
    let countryName = hasArticle ? `The ${countryData.name} ` : `${countryData.name} `;
    return "Kenya has signed a total of 4 agreements regarding air quality:";
  };

  $: countrySentence = searchVersion ? getCountryDescription(countryData.id) : null;

  $: if (searchVersion) console.log(countryData.agreements);

</script>

<section id="agreements-grid" class="viz wide">

  {#if !searchVersion}
    <Head title={head} selectedElement={null}/>
  {:else}
    <p class="narrow align">{@html countrySentence}</p>
  {/if}

  <div class="right-narrow">
    <Legend
      title={legendOptions.title}
      colors={legendOptions.colors}
      labels={legendOptions.labels}
      type={legendOptions.type}
      bind:selected={selectedAgreementType}
    />
  </div>
  <div class="grid">
    {#each agreementsData as a, i}
      <div class="card">
        <AgreementCard 
          title={a.title}
          tilegram={a.id} 
          selected={selectedAgreement === i}
          simple={searchVersion}
          on:agreementClicked={() => onAgreementCardClicked(i)}/>
      </div>
    {/each}
  </div>

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
  

</section>

<style lang="scss">
  .grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: -1.25rem;
  }

  .modal {
    position: fixed;
    display: block;
    top: 40%;
    width: 1024px;
    z-index: 20;
  }

</style>