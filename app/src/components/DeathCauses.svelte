<script lang="ts">
    import WaffleChart from "./WaffleChart.svelte";
  </script>
  
  <div class="flex-container">
    <WaffleChart percentage={34.64} cause={'494'}></WaffleChart>
    <WaffleChart percentage={2.64} cause={'493'}></WaffleChart>
    <WaffleChart percentage={71.64} cause={'426'}></WaffleChart>
    <WaffleChart percentage={9.77} cause={'322'}></WaffleChart>
    <WaffleChart percentage={32.64} cause={'509'}></WaffleChart>
    <WaffleChart percentage={64.64} cause={'976'}></WaffleChart>
    <WaffleChart percentage={38.64} cause={'380'}></WaffleChart>
  </div>
  
  <style>
  
    .flex-container {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  
  </style>