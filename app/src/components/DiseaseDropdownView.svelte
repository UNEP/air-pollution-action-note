<script lang="ts">
  import svg from "src/svg";
  import type { SelectOption } from "./Select.svelte";

  export let option: SelectOption;
</script>

<div class="container">
  <div class="icon">{@html svg.diseases[option.value]}</div>
  {option.label}
</div>

<style lang="scss">
  .container {
    display: flex;
    gap: 10px;
    align-items: center;
    background-color: transparent;
    padding: 5px;
  }
  .icon {
    width: 36px;
    height: 36px;
  }
  .arrow {
    transform: translateY(-0.1rem);
    width: 0.6em;
    height: 0.6em;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    justify-self: flex-end;
  }
</style>
