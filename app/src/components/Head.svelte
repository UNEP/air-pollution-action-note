<script lang="ts">
  import type { DropdownOptionBlock, HeadBlock, HealthDisease } from "src/types";
  import Dropdown from "./Dropdown.svelte";
  import Title from "./Title.svelte";

  export let title: string;
  export let dropdown: DropdownOptionBlock[] = [];
  export let selectedElement: HealthDisease;
  export let number: number = 0;
  export let smaller: boolean = false;

  let blocks: HeadBlock[] = [];

  const components = {
    dropdown: Dropdown,
    title: Title,
  };

  const createBlocks = (number: number, dropdown: DropdownOptionBlock[]): HeadBlock[] => {
    let ret: HeadBlock[] = [];
    let auxTitle = title;
    if (title.includes("@number")) auxTitle = title.replace("@number", number.toFixed(1).toString());

    if (title.includes("@dropdown") && dropdown.length > 0) {
      let titleBlocks = auxTitle.split("@dropdown");
      ret.push({
        type: "title",
        title: titleBlocks[0],
      });
      ret.push({
        type: "dropdown",
        dropdown: dropdown,
      });
      ret.push({
        type: "title",
        title: titleBlocks[1],
      });
    } else {
      ret.push({
        type: "title",
        title: title,
      });
    }
    return ret;
  };

  $:  blocks = createBlocks(number, dropdown);
</script>

<h2 class="narrow align" style={smaller? "font-size: 1.25rem;": ""}>
  {#each blocks as block}
    <svelte:component
      this={components[block.type]}
      {block}
      bind:selectedElement
    />
  {/each}
</h2>

<style lang="scss">
  .align {
    vertical-align: middle;
  }
  .narrow{
    & > :global(span){
      font-size: 40px;
    }
  }
</style>
