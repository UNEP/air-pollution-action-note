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

  const generateText = (data: PoliciesData) => {
    let text: string = "";
    let metTargets: string[] = [];
    policies.forEach(p => {
      if (p.value === 1){
        metTargets.push(descLookUp[p.id].name.toLowerCase());
      }
    });

    if (metTargets.length <= 0){
      text = `Kenya hasn't met <b>any targets</b>.`;
    }
    else {
      if (metTargets.length >= 9) {
        text = `Kenya has met <b>all targets</b>: `;
      }
      else {
        text = `Kenya has met <b>` + metTargets.length + ` out of 9 targets</b>: `;
      }

      let n = 0;
      let groupLength = metTargets.length;
      text += metTargets[n];
      n++;
      while (n <= groupLength) {
        if (n === groupLength){
          text += `.`;
        }
        else if (n === groupLength - 1){
          text += ` and ` + metTargets[n];
        }
        else {
          text += `, ` + metTargets[n];
        }
        n++;
      }
    }
    return text;
  }

  $: policies = generatePolicies(data);
  $: text = generateText(data);

</script>

{#if text}
  <p class="col-text">{@html text}</p>
{/if}

<div class="policies-container">
  {#each policies as p}
    <div class="pol policy-name">{descLookUp[p.id].name}</div>
    <div class="pol bars-middle">
      <TargetBars value={p.value}/>
    </div>
    <div class="pol policy-description">{descLookUp[p.id][p.value]}</div>
  {/each}
</div>

<style>

  .policy-description {
    margin-left: 25px;
  }

  .policy-name {
    margin-right: 25px;
  }

  .bars-middle {
    max-width: 340px;
  }

  .policies-container {
    font-weight: 300;
    display: grid;
    grid-template-columns: minmax(100px, 340px) minmax(150px, 340px) minmax(100px, 340px);
    row-gap: 35px;
  }

  .policies-container-flex {
    display: flex;
    justify-content: space-between;
  }

  .pol {
    height: 35px;
  }
    
</style>