<script lang="ts">

  import TargetBars from "./TargetBars.svelte";
  import descriptions from 'src/data/policiesDescriptions.json'; //algeria y venezuela -> amarillo strong
  import { createLookup } from "src/util";

  export let data: PoliciesData;

  interface PoliciesData {
    name: string;
    id: string;
    "ind-1": number;
    "tra-1": number;
    "tra-2": number;
    "waste-1": number;
    "aq-1": number;
    "agri-1": number;
    "aqms-1": number;
    "aqm-1": number;
    pYes: number;
    pNo: number;
    pAlmost: number;
  }

  const descLookUp = createLookup(descriptions, d => d.id, d => d);

  $: policies = generatePolicies(data);

  const generatePolicies = (data: PoliciesData) => {
    let array = [];
    for (const [key, value] of Object.entries(data)) {
      if (key !== "name" && key !== "id" && key !== "pYes" && key !== "pNo" && key !== "pAlmost") {
        let policy = {id: key, value: value}
        array.push(policy);
      }
    }
    return array;
  }

</script>

<div class="policies-container">
  {#each policies as p}
    <div>{descLookUp[p.id].name}</div>
    <TargetBars value={p.value}/>
    <div>{descLookUp[p.id][p.value]}</div>
  {/each}
</div>

<style>

  .policies-container {
    display: grid;
    grid-template-columns: 215px 340px 215px;
    row-gap: 35px;
  }
    
</style>