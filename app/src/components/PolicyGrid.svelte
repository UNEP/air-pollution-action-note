<script lang="ts">

  import TargetBars from "./TargetBars.svelte";

</script>

<div class="policies-container">
  <TargetBars value={1}/>
</div>

<div class="policies-container">
  <TargetBars value={2}/>
</div>

<div class="policies-container">
  <TargetBars value={3}/>
</div>

<div class="policies-container">
  <TargetBars value={4}/>
</div>

<style>

  .policies-container {
    display: grid;
    grid-template-columns: 215px 340px 215px;
  }

  .policy-bars-names {
    display: grid;
    grid-template-columns: 85px 85px 85px 85px;
  }
    
</style>