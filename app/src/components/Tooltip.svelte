<script lang="ts">
  import svg from "src/svg";

  export let country: string;
  export let interimTarget = 'AQG';

</script>

<div class="tooltip-container">
  <div class="label">
    <span class="bold">{country}</span> meets 
    <div class="text-target">
      <div class="icon">{@html svg.whitecheck}</div> 
      {interimTarget}
    </div> 
  </div>
</div>

<style>

  .tooltip-container {
    display: flex;
    width: fit-content;

    padding: .5rem;
    border-radius: 3px;

    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);

    animation-name: appear-disappear;
	  animation-duration: 3s;
  }

  .text-target {
    display: inline-flex;
    gap: 3px;

    padding: 0.25rem;
    border-radius: 3px;

    background-color: #00ABF1;
    color: white;
    font-weight: 600;
  }

  .bold {
    font-weight: 700;
  }

  .icon {
    width: 12px;
    height: 12px;
  }

  @keyframes appear-disappear {
    0% {
      opacity: 0;
      transform: translateY(0px);
    }
    50% {
      opacity: 1;
      transform: translateY(-15px);
    }
    100% {
      display: none;
      opacity: 0;
      transform: translateY(-15px);
    }
  }
  
</style>