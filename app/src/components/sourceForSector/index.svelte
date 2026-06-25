<script lang="ts">
  import Sector from './svgs/sector.svelte';
  import Pulse from './svgs/pulse.svelte';

  let selectedSector: string = '';

  $: isActive = selectedSector !== '';
  // $: {
  //   console.log('selectedSector', selectedSector);
  //   console.log('isActive', isActive);
  // };
</script>

<div class="source-for-sector" class:active={isActive}>
    <img src="img/bg-sector.svg" alt="Source for sector" />
    <Sector selectedSector={selectedSector} isActive={isActive} />
    <Pulse bind:selectedSector isActive={isActive} />
</div>

<style lang="scss">
  .source-for-sector {
    margin-bottom: 32px;
    position: relative;
    width: 100%;
    min-width: 800px;
    aspect-ratio: 1021 / 716;

    @media (max-width: 1024px) {
      margin: 0px 20px;
    }
     
    img {
        width: 100%;
        height: auto;
        display: block;
    }

    &.active {
      img {
        opacity: 0.5;
      }
    }
  }
</style>