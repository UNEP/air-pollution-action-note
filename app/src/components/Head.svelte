<script lang="ts">
  import type { DropdownOptionBlock, HeadBlock, HealthDisease } from "src/types";
  import Dropdown from "./Dropdown.svelte";
  import Title from "./Title.svelte";

  export let title: string;
  export let dropdown: DropdownOptionBlock[] = [];
  export let selectedElement: HealthDisease;
  export let number: number = 0;

  let blocks: HeadBlock[] = [];

  const components = {
    dropdown: Dropdown,
    title: Title,
  };

  const createBlocks = (): HeadBlock[] => {
    let ret: HeadBlock[] = [];
    if (title.includes("@number"))
      title = title.replace("@number", number.toString());
    if (title.includes("@dropdown") && dropdown.length > 0) {
      let titleBlocks = title.split("@dropdown");
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
    console.log(ret);
    return ret;
  };

  blocks = createBlocks();
</script>

<h2 class="narrow align">
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
</style>
