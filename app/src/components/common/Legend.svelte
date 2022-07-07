<script lang='ts'>
  export let title = '';
  export let colors: string[];
  export let labels: string[];
  export let type = 'sequential';
  export let selected: number;
</script>

<h3 class="note title">{@html title}</h3>

{#if type === 'sequential'}
<ol class="seq info" role="menu" aria-label="menu">
  {#each colors as c,i}
  <li
    role="menuitem"
    tabindex="0"
    style="width: { 100 / colors.length }%; background-color: {c};"
    class:selected-seq={selected === i}
    on:mouseout={() => selected = null}
    on:blur={() => selected = null}
    on:mouseover={() => selected = i}
    on:focus={() => selected = i}
  >
    {#if labels[i] !== undefined}
      <p class='note'>{labels[i]}</p>
    {/if}
  </li>
  {/each}
</ol>

{:else if type === 'categorical'}
<ul class="cat info" role="menu" aria-label="menu">
  {#each colors as c,i}
    <li role="menuitem"
    tabindex="0"
    class="cat-item note"
    class:selected-cat="{selected === i}"
    on:mouseout={() => selected = null}
    on:blur={() => selected = null}
    on:mouseover={() => selected = i}
    on:focus={() => selected = i}
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
            )`
        }"
      />{labels[i]}
    </li>
  {/each}
</ul>
{/if}

<style>
  .title {
    margin:0;
    padding:0;
  }
  .seq, .cat {
    list-style-type: none;
    margin:0;
    padding:0;
  }
  .seq {
    height:3rem;
  }
  li {
    display: inline-block;
    position:relative;
    line-height: 1;
    padding:.3rem;
    cursor: pointer;
    transition: all .3s;
  }
  .seq li {
    height: .7rem;
    box-sizing: border-box;
    border: 1px solid #f9f9f9;
    transition: all .3s;
  }
  li p {
    position:absolute;
    left:50%;
    width:100%;
    text-align: center;
    margin: .7rem 0 0 0;
    padding: 0;
  }
  .cat-symbol {
    width: .9rem;
    height: .9rem;
    border-radius: .2rem;
    display: inline-block;
    margin-right: .4rem;
    vertical-align:-0.1rem;
  }
  .cat-item {
    margin-right: 0;
  }
  .selected-cat {
    background-color: #FFF;
    border-radius: .3rem;
    box-shadow: 0 0 .5rem #00000022;
    transition: all .3s;
  }
  .selected-seq {
    box-shadow: 0 0 .5rem #00000044;
    border: 1px solid #000!important;
    transition: all .3s;
  }
</style>
