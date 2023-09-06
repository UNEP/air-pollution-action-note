import { scaleOrdinal, scaleThreshold } from 'd3-scale';

export const colorSectors = scaleOrdinal<string>()
  .domain([
    'residential','transport','intlshipping','industry','commercial','afciddust',
    'othercombustion','remainingsources','otherfires','agrwasteburning','agriculture',
    'waste','solvents','energy','windblowndust'
  ])
  .range([
    '#007dc8','#811494','#9b7ccc','#ab4867','#ff9c9c','#b3b3b3','#8c8c8c','#666666',
    '#333333','#62b048','#1b6e29','#dcae89','#854f38','#ff8a18','url(#hash--windblown)'
  ]);

export const colorFuels = scaleOrdinal<string>()
  .domain(['process','liquid','solidbio','coal'])
  .range(['#407aa9','#faba26','#62b048','#333333']);

export const colorPM25 = scaleThreshold<number, string>()
  .domain([...new Array(8)].map((d,i) => (i + 1) * 5))
  .range(['#D9D9D9', '#ffbbb0', '#F18EA7', '#D3609E', '#C14291', '#8D0085']);

export const colorPM25distribution = scaleThreshold<number, string>()
  .domain([...new Array(8)].map((d,i) => (i + 1) * 10))
  .range(['#ffbeb3', '#f0a9ad', '#e094a7', '#d07fa1', '#c16b9b', '#b15694', '#a1408e','#912787', '#800080']);

export const colorHealth = scaleThreshold<number, string>()
  .domain([20,40,60,80,100,120])
  .range(['#ffcb5b', '#e8a768', '#d08371', '#b86078', '#9d3a7d', '#800080']);


export const colorPolices = scaleOrdinal<string>()
  .domain(['Target met', 'On track', 'Not met', 'No data'])
  .range(['#004982', '#5A93B4', '#ffcb5b', '#cacaca']);

export const colorDiseases = scaleOrdinal<number, string>()
  .domain([5, 15, 25, 35])
  .range(["#FFBEB3","#E094A7","#C16B9B","#A1408E","#800080"]);

export const colorAgreements = scaleOrdinal<string>()
.domain(['No agreements signed', 'Agreements signed'])
.range(["#D9D9D9", "#004982"])

export const colorAgreementTypes = scaleOrdinal<string>()
  .domain(['Participant', 'Observer'])
  .range(["#34659B", "#7CBFEF"])

export const colorAgreementSimpleType = scaleOrdinal<string>()
.domain(['Participant'])
.range(["#34659B"])
