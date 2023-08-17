<script lang="ts">
  import AgreementCard from "./AgreementCard.svelte";
  import ModalCard from "./ModalCard.svelte";
  import Legend from "./common/Legend.svelte";
  import Head from "./Head.svelte";
  import { scale } from "svelte/transition";
  import { colorAgreementTypes } from "src/colors";
  import agreementsLookup from "../data/agreementsLookup.json";
  import type { AgreementName } from "src/types";

  export let head: string;

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

</script>

<section id="agreements-grid" class="viz wide">

  <Head title={head} selectedElement={null}/>

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