<script lang="ts" context="module">

  export type DeathsData = {
    copd: number,
    diabetes: number,
    ischemic: number,
    lungcancer: number,
    lri: number,
    stroke: number,
    nd: number
  }

</script>


<script lang="ts">
  import WaffleChart from "./WaffleChart.svelte";
  import WorldMeanDeaths from "../data/diseasesGlobal.json"

  export let data: DeathsData = WorldMeanDeaths;

  const sentences = {
    ">20": "Fine particle pollution is a major cause of death from",
    ">5": "Fine particle pollution is an important factor in deaths from",
    "top3": "Fine particle pollution contributes to deaths by",
    "rest": " It is also a contributing factor on"
  }

  const names = {
    'stroke': 'stroke',
    'ischemic': 'ischemic heart disease',
    'lungcancer': 'tracheal, bronchus and lung cancer',
    'lri': 'lower respiratory infections',
    'copd': 'chronic obstructive pulmonary disease',
    'diabetes': 'type 2 diabetes',
    'nd': 'neonatal disorders'
  };

  let serializedData = [];
  let firstSentenceDiseases: string[];

  $: {
    serializedData = Object.entries(data);
    serializedData.sort((a, b) => (b[1] - a[1]));
  }

  const generateTextGreaterThan = (percent: number, sentence: string) => {
    let text = "";
    firstSentenceDiseases = [];
    serializedData.forEach(s => {
      if (s[1] >= percent)
      firstSentenceDiseases.push(s[0]);
    });

    if (firstSentenceDiseases.length > 0) {
      let n = 0;
      let groupLength = firstSentenceDiseases.length;
      text = sentence + ` <b>` + names[firstSentenceDiseases[n]] + `</b>`;
      n++;
      while (n <= groupLength) {
        if (n === groupLength){
          text += `.`;
        }
        else if (n === groupLength - 1){
          text += ` and <b>` + names[firstSentenceDiseases[n]] + `</b>`;
        }
        else {
          text += `, <b>` + names[firstSentenceDiseases[n]] + `</b>`;
        }
        n++;
      }
    }
    return text;
  }

  const generateTop3 = (sentence: string) => {
    firstSentenceDiseases = serializedData.slice(0, 3);
    let text = sentence + ` <b>` + names[firstSentenceDiseases[0][0]] + `</b>, <b>` 
      + names[firstSentenceDiseases[1][0]] + `</b> and <b>` + names[firstSentenceDiseases[2][0]] + `</b>.`;
    return text;
  }

  const generateSecondSentence = (sentence: string) => {
    let text = "";
    let n = firstSentenceDiseases.length;
    let groupLength = serializedData.length;
    text =  sentence + ` <b>` + names[serializedData[n][0]] + `</b>`;
    n++;
    while (n <= groupLength) {
      if (n === groupLength){
        text += `.`;
      }
      else if (n === groupLength - 1){
        text += ` and <b>` + names[serializedData[n][0]] + `</b>`;
      }
      else {
        text += `, <b>` + names[serializedData[n][0]] + `</b>`;
      }
      n++;
    }
    return text;
  }

  $: text = data !== WorldMeanDeaths ? generateText(data) : text = null;

  const generateText = (data: DeathsData) => {
    let sentence1 = generateTextGreaterThan(0.2, sentences[">20"]);
    if (firstSentenceDiseases.length <= 0) {
      sentence1 = generateTextGreaterThan(0.05, sentences[">5"]);
      if (firstSentenceDiseases.length <= 0) {
        sentence1 = generateTop3(sentences["top3"]);
      }
    }

    let sentence2 = "";
    if (firstSentenceDiseases.length < serializedData.length){
      sentence2 = generateSecondSentence(sentences["rest"]);
    }
    return sentence1 + sentence2;
  }

</script>

  {#if text}
    <p class="col-text">{@html text}</p>
  {/if}

  <h3 class="note col-text"><strong>Percent of deaths</strong> from each disease <strong>attributable to fine particle outdoor air pollution</strong> in 2019.</h3>

  <div class="flex-container">
    <WaffleChart percentage={data.stroke} cause={'stroke'}/>
    <WaffleChart percentage={data.ischemic} cause={'ischemic'}/>
    <WaffleChart percentage={data.lungcancer} cause={'lungcancer'}/>
    <WaffleChart percentage={data.lri} cause={'lri'}/>
    <WaffleChart percentage={data.copd} cause={'copd'}/>
    <WaffleChart percentage={data.diabetes} cause={'diabetes'}/>
    <WaffleChart percentage={data.nd} cause={'nd'}/>
  </div>
  
  <style>
  
    .flex-container {
      display: flex;
      flex-direction: row;
      gap: 10px;
      row-gap: 20px;
      flex-wrap: wrap;
      padding-bottom: 4rem;
    }

    .note {
      padding-bottom: 2rem;
    }
  
  </style>