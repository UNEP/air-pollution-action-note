<script lang="ts">
    import Select from "./Select.svelte";
    import type { HeadBlock } from "src/types";
    import DiseasesDropdownView from "./DiseaseDropdownView.svelte";

    export let block: HeadBlock = undefined;
    export let selectedElement;

    let items = block?.dropdown.map(item => ({
        value: item.value,
        label: item.label
    }));

    $: selectedElement = items[0];
</script>

<Select options={items} let:option={option} bind:selected={selectedElement}>
    <DiseasesDropdownView option={option}/>
</Select>

<style lang="scss">

</style>
