<script lang="ts">
  import TargetBars from "./TargetBars.svelte";
  import Legend from "./common/Legend.svelte";
  import { countriesWithArticle } from "src/data";

  export let data: PoliciesData;
  export let desc: PoliciesDescription;
  
  interface PoliciesDescription {
    id: string,
    "ind-1": string,
    "tra-1": string,
    "tra-2": string,
    "waste-1": string,
    "aq-1": string,
    "agri-1": string,
    "aqms-1": string,
    "aqm-1": string
  }

  interface PoliciesData {
    name: string,
    id: string,
    "ind-1": number,
    "tra-1": number,
    "tra-2": number,
    "waste-1": number,
    "aq-1": number,
    "agri-1": number,
    "aqms-1": number,
    "aqm-1": number,
    pYes: number,
    pNo: number,
    pAlmost: number
  }

  let selected: number = null;

  const policy_name = {
    "ind-1": "Clean production incentives",
    "tra-1": "Vehicle emission standards",
    "tra-2": "Sulphur level in diesel",
    "waste-1": "Solid waste burning",
    "res-1": "Incentives for residential cooking and heating",
    "agri-1": "Sustainable agricultural practices",
    "aqms-1": "Air quality management strategies",
    "aqm-1": "Air quality monitoring",
    "aq-1": "Air quality standards"
  }

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
    let hasPoliciesData = Math.min(...policies.map(p => p.value)) != 4;
    
    if (hasPoliciesData) {

      let country = hasArticle ? "The " + countryName : countryName;
      let text: string = "";
      let metTargets: string[] = [];

      policies.forEach(p => {
        if (p.value === 1){
          metTargets.push(policy_name[p.id].toLowerCase());
        }
      });

      if (metTargets.length <= 0){
        text = country + ` hasn't met <b>any targets</b>.`;
      }
      else {
        if (metTargets.length >= 9) {
          text = country + ` has met <b>all targets</b>: `;
        }
        else {
          text = country + ` has met <b>` + metTargets.length + ` out of 9 targets</b>: `;
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
    else {
      let country = hasArticle ? "the " + countryName : countryName;
      return ("No data for " + country + "'" + (countryName.slice(-1) === 's' ? '' : 's') + " targets.");
    }
  }

  $: hasArticle = countriesWithArticle.includes(data.id);
  $: countryName = data.name;
  $: policies = generatePolicies(data);
  $: text = generateText(data);

</script>

{#if text}
  <p class="col-text">{@html text}</p>
{/if}

<div class="legend">
  <Legend
    title={`<b>Actions taken towards cleaner air</b>`}
    colors={["#BDBDBD", "#F7CD6E", "#6791B1", "#1C477E"]}
    labels={["No data", "Not met", "On track", "Target met"]}
    type={"categorical"}
    bind:selected
  />
</div>

<div class="policies-container">
  {#each policies as p}
    <div class="row policy-name">{policy_name[p.id]}</div>
    <div class="row bars-middle">
      <TargetBars {selected} value={p.value}/>
    </div>
    <div class="row policy-description">{desc ? desc[p.id] : "No data"}</div>
  {/each}
</div>

<style>

  .legend {
    display: block;
    margin-bottom: 50px;
    margin-top: 26px;
  }

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
    margin: auto;
    font-weight: 300;
    display: grid;
    grid-template-columns: minmax(100px, 175px) minmax(85px, 340px) minmax(100px, 250px);
    row-gap: 35px;
  }

  .row {
    height: 50px;
  }
    
</style>