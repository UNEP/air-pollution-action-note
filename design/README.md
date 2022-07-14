# Design
Should we open our Figma file to everyone that wants a peak? You can explore [Figma file here](https://www.figma.com/file/majnnQyQupv1DO3rtgAtJP/UNEP-Air-Pollution-Action-Note?node-id=0%3A1)


## Demers, tile grid maps and an Indian dessert
- [ ] Notes from user research on Dorling cartograms readibility
- [ ] Readibility improvements on the marks with borders
- [ ] @xocasgv twitter thread on UK cartograms for 2015 elections
- [ ] Slides from the SIGLibre presentation

We decided on this type of visualization, Demers or square cartograms, out of the design restrictions and data nuances. TK TK summary of those. We are working on a paper evaluating Demers cartograms and explaining a soon-to-be-open-sourced in-house tool that we develop to simplify their production.

But I guess it's important to confess that we love cartograms. We're biased here. And we've used them maaaaany times in the past.

[IMAGE OF FAVORITE CARTOGRAMS]

We've even gotten as far as to fight a hero of ours on twitter:

![Tweet defending cartograms](https://raw.githubusercontent.com/UNEP/air-pollution-action-note/9743f3e22c811b98b14e699a0e0058d8ab6cab21/design/tweet_carto.png?token=GHSAT0AAAAAABUM6L3QFE3VZS3Q7SJKIPUEYWQA3TA|width=400px){: height="36px" width="36px"}

Full thread here: [1](https://twitter.com/xocasgv/status/747784201412370432), [2](https://twitter.com/xocasgv/status/747784391909269506), [3](https://twitter.com/xocasgv/status/747784639440248832), [4](https://twitter.com/xocasgv/status/747784881908776960), [5](https://twitter.com/xocasgv/status/747785136951857152), [6](https://twitter.com/xocasgv/status/747785410273652737), [7](https://twitter.com/xocasgv/status/747785637554577409), [8](https://twitter.com/xocasgv/status/747785902852706309), [9](https://twitter.com/xocasgv/status/747786142414573569), [10](https://twitter.com/xocasgv/status/747786388548943872) 

Anyway ... 

There's some research on how effective cartograms are to compare, locate, find biggest values, or see the big picture ... But mostly folks have looked into Dorling and continuous cartograms. One particular study highlighted that Dorling cartograms not only perform well, but they're also subjectively appreciated by audiences who see them as helpful, easy to use and innovative. Given the similarities between Dorling and Demers cartograms, we have assumed they perform similarly until we complete our current research.

The goals of the visualizations were to:
* Minimize any issues with international borders
* Summarize the big trends
* Depict the data accurately
* Allow us to use different visual variables
* Preserve the integrity of the visualization regardless of the type of data
* Present the data in an engaging manner

The cartograms were created using Barfi, our in-house interactive tool that uses a force-directed layout to generate them. Barfi is a fudge-like Indian dessert usually cut in squares. @mattosborn's original name for the tool was 'fdg', which sounded like 'fudge'. Top imaginative branding here ...

You can read about the tool and how it was born [here](tktkt). But, in a nutshell:  

> Taking these restrictions into account, we decided to opt for two types of grammatically related  visualizations: tile grid maps and Demers cartograms (Bortins et al., 2002).
> 
> In tile grid maps, admin divisions become cells arranged on a grid that fits their geographic layout. Each cell allows multiple possibilities: a class can be displayed by color, a line plot to show a time trend, a histogram > to show a statistical distribution, or a broken bar to show parts of a total.
> 
> In Demers cartograms, admin units are visually coded as squares and geography is approximated. The visual mark, the square in this case, allows you to encode a numerical variable through area and a categorical variable through color.
> 
> Another advantage of this design solution is the use of the same visual mark, in this case squares, which allows us to create transitions between maps that facilitate a fluid sequential narrative.

You can also see us [talking about it at the SIGLibre conference](http://diobma.udg.edu/handle/10256.1/6776) — we are planning to open it up once our to-do list is ... well ... done.

## Color scales
- [ ] Inclusive color in dataviz
- [ ] Chroma.js
- [ ] Viz palette reports

## Interaction design
The Note is designed as a stack of information blocks, each composed of a data-driven header, an interactive visualization, and a few paragraphs that contextualize the data and the segment. You can scroll through, perusing the page and stopping whenever a fact or a visual catches your attention, or jump to a specific section of interest from the sticky menu.

[IMAGE OF THE BLOCKS]

Every data point has an annotation, and you can interact with it through your keyboard, click, or hover —depending on the device and technology you use. The legends allow you to filter the view based on the specific groupings it represents, if you hover or click or tab to the .

The insides 🔪🧠🫀🫁😱 of our cartogram component look like this.

````svelte
<div class="countries"
  role="graphics-document"
  aria-label={title}>
  {#each cartogramData as d (d.code)}
    {#if d.x && d.y}
      <div
        class="country {classesFn(d).join(' ')}"
        style={calcStyle(d)}
        data-code={d.code}
        tabindex="0"
        role="graphics-object"
        on:mouseenter={(evt) => onMouseEnterCountry(evt, d)}
        on:mouseleave={() => onMouseLeaveCountry()}
        on:focus={() => onMouseClick(d)}
        on:blur={() => onMouseLeaveCountry()}
      >
      <desc>{hoverTextFn(d)}</desc>
      {#if !hideLabels && d.width > 100}
        <span class="country-text">{d.short}</span>
      {/if}
      </div>
    {/if}
  {/each}
</div>
````

## References
