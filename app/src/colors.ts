import { scaleOrdinal, scaleThreshold } from 'd3-scale';

export const colorSectors = scaleOrdinal<string>()
  .domain([
    'residential','transport','intlshipping','industry','commercial','afciddust',
    'othercombustion','remainingsources','otherfires','agrwasteburning','agriculture',
    'waste','solvents','energy','windblowndust'
  ])
  .range([
    '#407aa9','#811494','#9b7ccc','#ab4867','#ff9c9c','#b3b3b3','#8c8c8c',
    '#666666','#333333','#62b048','#1b6e29','#bd8e71','#854f38','#ff8a18','url(#hash--windblown)'
  ]);

export const colorFuels = scaleOrdinal<string>()
  .domain(['process','liquid','solidbio','coal'])
  .range(['#407aa9','#faba26','#62b048','#333333']);

export const colorPM25 = scaleThreshold<number, string>()
  .domain([...new Array(8)].map((d,i) => (i + 1) * 10))
  .range(['#ffbeb3', '#f0a9ad', '#e094a7', '#d07fa1', '#c16b9b', '#b15694', '#a1408e'
    ,'#912787', '#800080']);

export const colorHealth = scaleThreshold<number, string>()
  .domain([20,40,60,80,100,120])
  .range(['#facc6e', '#e5a774', '#ca8679', '#aa677c', '#854b7f', '#583382']);


export const colorPolices = scaleOrdinal<string>()
  .domain(['Target met', 'On track', 'Not met', 'No data'])
  .range(['#0074B2', '#5A93B4', '#ffcf61', '#cacaca']);
