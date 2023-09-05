<script lang="ts">
  import { onMount } from "svelte";

  export let percentage = 50;

  let progressBar: HTMLElement;
  let percentageLabel: HTMLElement;

  onMount(() => {
    progressBar = document.querySelector('.progress-bar');
    percentageLabel = document.querySelector('.percentage-label');
  });
  $: if (percentage >= 0) {
    if(progressBar && percentageLabel) { 
      if (percentage === 0) progressBar.style.width = '0px';
      else progressBar.style.width = `${percentage}%`;
      percentageLabel.style.width = `${percentage}%`;
      percentageLabel.style.marginLeft = percentage > 98 ? '0.5rem' : '1.5rem';
    };
  }

</script>

<div class="container">
  <div class="label gray-text">
    World population breathing clean air (%)
  </div>

  <div class="progress-moved">
    <div class="progress-bar"></div>
    <h2 class="percentage-label">{percentage}%</h2>
  </div>
</div>

<style>

  .container {
    height: 80px;
  }

  .gray-text {
    color: #505050;
  }

  .percentage-label {
    width: 100%;
    position: relative;
    display: block;
    margin: 0.5rem;
    margin-left: 1.5rem;
    border-radius: 1rem;
    transition: 0.4s linear;
    animation: progress 5s infinite;
    text-align: end;
  }

  .progress-moved, .progress-bar {
    margin-top: 1rem;
    height: 8px;
    width: 100%;
    border-radius: 30px;
    transition: 0.4s linear;
  }

  .progress-moved {
    background-color: #D9D9D9;
  }

  .progress-bar {
    background-color: #00ABF1;
    animation: progress 5s infinite;
  }

  @media (max-width: 678px) {
    .percentage-label {
      width: 90vw;
      margin-left: 1rem;
    }
    .progress-moved, .progress-bar {
      height: 4px;
    }
  }

</style>