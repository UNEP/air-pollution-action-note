
#### Related Sustainable Development Goals
![SDG 3](https://img.shields.io/badge/Goal%203-Good%20health%20and%20well--being-4C9F38?style=for-the-badge)
![SDG 7](https://img.shields.io/badge/Goal%207-Affordable%20and%20clean%20energy-FCC30B?style=for-the-badge)
![SDG 11](https://img.shields.io/badge/Goal%2011-Sustainable%20cities%20and%20communities-FD9D24?style=for-the-badge)
![SDG 12](https://img.shields.io/badge/Goal%2012-Responsible%20consumption%20and%20production-BF8B2E?style=for-the-badge)
![SDG 13](https://img.shields.io/badge/Goal%2013-Climate%20action-3F7E44?style=for-the-badge)
![SDG 17](https://img.shields.io/badge/Goal%2013-Partnership%20for%20the%20goals-19486A?style=for-the-badge)

---
# Air Pollution Note
![Poster image for the Air Pollution Action Note interactive](https://github.com/UNEP/air-pollution-action-note/blob/cae2006e24023f7e583cc8a2a2b6ac253639982f/app/public/img/poster-2.jpg)

The Air Pollution Note is a data-driven dashboard that displays the different sources of air pollution, the health impact of outdoor air pollution, and what actions countries are taking to live with clean air. It aims to serve curious citizens engaged in the topic, as well as media professionals and academics.

It is live at https://www.unep.org/interactive/air-pollution-note/

#### Quick links
* [`app`](app) is the code to the interactive.
* [`data`](data) lists the sources, methodologies and some explanations on the data transformations —in the form of notebooks.
* [`design`](design) has some notes on the design of the interactive.

---
## Unlocking data through better communication
‘World Environment Situation Room’ (WESR) is UNEP’s strategic data platform that aggregates authoritative datasets on environmental topics — a very data-heavy hub for specialist audiences. unep.org has more than half a million visitors per month from almost every country in the world, from the informed and engaged general public, youth audiences, and media to policymakers and the private sector.

The objective of the data-driven notes is to bridge the gap between the diverse audience of unep.org and the specialist audience of WESR. They act as an entry point, serving the most critical data in an easy to grasp, engaging manner before driving curious audiences to the hub for more detailed data exploration.

---
#### Reusing and citing this project
You are welcome to reuse the content and data visualizations in this dashboard in your personal website or your media outlet as long as you abide the TK TK need to discuss license [terms of the license](LICENSE), which means you have to give credit and link back to the original work.

For **academic** citations, here is the BibTex citation:

````
 @misc{unep_2022, title={Air pollution note – data you need to know}, url={https://www.unep.org/interactive/air-pollution-note/}, journal={UNEP}, publisher={United Nations Environment Programme}, year={2022}, month={Jul}} 
````

For **media** references, use 'UNEP's Air pollution note' and link to 'https://www.unep.org/interactive/air-pollution-note/'

Here are the embeds for the individual data visualizations:
* Current state
````javascript
<script async src='https://www.unep.org/interactive/air-pollution-note/embed.js' data-embed='pm25'></script>
````

* Sources per sector 
````javascript
<script async src='https://www.unep.org/interactive/air-pollution-note/embed.js' data-embed='sectors'></script>
````

* Impact 
````javascript
<script async src='https://www.unep.org/interactive/air-pollution-note/embed.js' data-embed='health'></script>
````

* Policy actions 
````javascript
<script async src='https://www.unep.org/interactive/air-pollution-note/embed.js' data-embed='policies'></script>
````

