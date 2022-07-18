<script lang="ts" context="module">
  export interface InternalLabels {
    label: string;
    border?: boolean;
    icon?: string;
  }
</script>

<script lang="ts">
  import svg from "src/svg";

  export let title = "";
  export let colors: string[];
  export let labels: string[];
  export let type = "sequential";
  export let selected: number;
  export let linearDomain: number[] = null;
  export let internalLabels: InternalLabels[] = null;

  let legendWidths = null;


  const calcLinearLabels = (labels: string[]) => {
    let ret = [];
    let normalizedLabels = labels.map(label => Number(label.match(/(\d+)/)[0]));
    let globalDistance = linearDomain[1] - linearDomain[0];
    
    ret.push((normalizedLabels[0] - linearDomain[0]) / globalDistance * 100);

    normalizedLabels.reduce((acc, curr) => {
      let distance = curr - acc;
      ret.push((distance / globalDistance) * 100);
      return curr;
    }, linearDomain[0]);

    ret.push((linearDomain[1] - normalizedLabels[normalizedLabels.length - 1]) / globalDistance * 100);

    return ret
  };

  if(linearDomain) legendWidths = calcLinearLabels(labels);
</script>

<h3 class="note title">{@html title}</h3>

{#if type === "sequential"}
  <ol
    class="seq info"
    class:internal-labels={internalLabels}
    role="menu"
    aria-label="Legend"
  >
    {#each colors as c, i}
      <li
        role="menuitem"
        aria-label="Legend item #{i + 1}"
        tabindex="0"
        style="width: {legendWidths
          ? legendWidths[i]
          : 100 / colors.length}%; background-color: {c};"
        class:selected-seq={selected === i}
        class:border={internalLabels ? internalLabels[i]?.border : false}
        on:mouseout={() => (selected = null)}
        on:blur={() => (selected = null)}
        on:mouseover={() => (selected = i)}
        on:focus={() => (selected = i)}
      >
        {#if internalLabels}
        {#if internalLabels[i]?.icon}
          <div class="icon">{@html svg[internalLabels[i]?.icon]}</div>
        {/if}
          <div class="internal-label">{internalLabels[i] ? internalLabels[i].label : ""}</div>
        {/if}
        {#if labels[i] !== undefined}
          <p class="note">{labels[i]}</p>
        {/if}
      </li>
    {/each}
  </ol>
{:else if type === "categorical"}
  <ul class="cat info" role="menu" aria-label="Legend">
    {#each colors as c, i}
      <li
        role="menuitem"
        aria-label={labels[i]}
        tabindex="0"
        class="cat-item note"
        class:selected-cat={selected === i}
        on:mouseout={() => (selected = null)}
        on:blur={() => (selected = null)}
        on:mouseover={() => (selected = i)}
        on:focus={() => (selected = i)}
      >
        <div
          class="cat-symbol"
          style="background-color: {c !== 'url(#hash--windblown)' ? c : ''};
        background-size: {c !== 'url(#hash--windblown)' ? '' : '5.66px 5.66px'};
        background-image: {c !== 'url(#hash--windblown)'
            ? ''
            : `linear-gradient(
              135deg,
              #faba26 25%,
              #f9f9f9 25%,
              #f9f9f9 50%,
              #faba26 50%,
              #faba26 75%,
              #f9f9f9 75%,
              #f9f9f9 100%
            )`}"
        />
        {labels[i]}
      </li>
    {/each}
  </ul>
{/if}

<style lang="scss">
  .border {
    border: 2px solid #000 !important;
  }
  .border:hover {
    border: 2px solid #000 !important;
  }
  .icon {
    width: 20px;
    position: absolute;
    left: -8px;
    top: calc(50% - 8px);
  }
  .internal-labels {
    display: flex;
    & li {
      height: 30px !important;
      & .internal-label {
        display: flex;
        align-items: center;
        height: -webkit-fill-available, -moz-available;
        justify-content: center;
      }
      & p {
        margin: 0.5rem 0 0 0;
      }
    }
  }
  .title {
    margin: 0;
    padding: 0;
  }
  .seq,
  .cat {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .seq {
    height: 3rem;
  }
  li {
    display: inline-block;
    position: relative;
    line-height: 1;
    padding: 0.3rem;
    cursor: pointer;
    transition: all 0.3s;
  }
  .seq li {
    height: 0.7rem;
    box-sizing: border-box;
    border: 1px solid #f9f9f9;
    transition: all 0.3s;
  }
  li p {
    position: absolute;
    left: 50%;
    width: 100%;
    text-align: center;
    margin: 0.7rem 0 0 0;
    padding: 0;
  }
  .cat-symbol {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 0.2rem;
    display: inline-block;
    margin-right: 0.4rem;
    vertical-align: -0.1rem;
  }
  .cat-item {
    margin-right: 0;
  }
  .selected-cat {
    background-color: #fff;
    border-radius: 0.3rem;
    box-shadow: 0 0 0.5rem #00000022;
    transition: all 0.3s;
  }
  .selected-seq {
    box-shadow: 0 0 0.5rem #00000044;
    border: 1px solid #000 !important;
    transition: all 0.3s;
  }
</style>
