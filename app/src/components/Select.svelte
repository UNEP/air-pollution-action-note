<script lang="ts" context="module">
    export interface SelectOption{
        label: string;
        value?: string;
        icon?: string;
    }
</script>
<script lang="ts">
    import { scale } from 'svelte/transition';
    export let options: SelectOption[];
    export let selected = options[0].value? options[0].value : 0;
    let currentIndex = 0;
    let listboxVisible = false;
    const chooseOption = (index: number) => {
      currentIndex = index;
      listboxVisible = false;
    };
    const handleKeyDown: svelte.JSX.KeyboardEventHandler<Window> = e => {
      if (listboxVisible){
        if (e.key === 'ArrowUp' && currentIndex > 0){
          currentIndex--;
          e.preventDefault();
        }
        else if (e.key === 'ArrowDown' && currentIndex < options.length - 1){
          currentIndex++;
          e.preventDefault();
        }
      }
    };
    $: selected = options[currentIndex].value? options[currentIndex].value : currentIndex;
</script>
  
<svelte:window on:keydown={handleKeyDown} />
  
<div class="madlib-selector">
<div class="selector-area"
    on:click={() => listboxVisible = !listboxVisible}
    on:blur={() => listboxVisible = false}
>

    <slot option={options[currentIndex]}/>
    <svg class="arrow" viewBox="0 0 13 8">
        <path d="M0.630249 1L6.36134 6.5L12.0924 1" />
    </svg>
</div>

{#if listboxVisible}
    <div class="listbox" transition:scale>
    {#each options as opt, i}
        {#if i !== currentIndex}
        <div class="option"
        on:focus={() => chooseOption(i)} tabindex="-1">
            <slot option={opt}/>
        
        </div>
        {/if}
    {/each}
    </div>
{/if}
</div>
  
  
<style lang="scss">
    .madlib-selector {
      display: inline-block;
      vertical-align: middle;
      line-height: 100%;
    }
    .option {
      display: block;
      border-bottom: #1e1e1e solid 2px;
      cursor: pointer;
      position: relative;
      color: #a8a8a8;
      &:hover {
        box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.2);
        background-color: inherit;
        color: #1e1e1e;
        :global(.icon svg){
          stroke: #1e1e1e;
        }
      }
      &:hover {
        position: relative;
        z-index: 1;
      }
      
      :global(.icon svg){
        stroke: #a8a8a8;
      }
    }
    .selector-area {
      border-bottom: #1e1e1e solid 2px;
      border-radius: inherit;
      cursor: pointer;
      background-blend-mode: soft-light;
      background: rgba(249, 249, 249, 0.08);
      color: inherit;
      display: flex;
      gap: 10px;
      align-items: center;
      justify-items: space-between;
      s
      &:focus {
        outline: 0.1rem solid;
      }
    }
    .listbox {
      position: absolute;
      display: block;
      padding: 0;
      background-color: #f9f9f9;
      border: none;
      z-index: 1;
    }
    .arrow {
      transform: translateY(-0.1rem);
      width: 0.6em;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.5;
    }

</style>