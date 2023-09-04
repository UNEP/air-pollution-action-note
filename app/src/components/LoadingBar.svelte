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
      percentageLabel.style.setProperty('--move', percentage + '%');
    };
  }

</script>

<div class="container">
  <div class="label gray-text">
    World population breathing clean air (%)
  </div>

  <div class="progress-moved">
    <div class="progress-bar"></div>
    <span class="label percentage-label">{percentage}%</span>
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
    transform: translateX(calc(var(--move) - 1rem));
    border-radius: 1rem;
    transition: 0.4s linear;
    animation: progress 5s infinite
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
    background-color: #7CBFEF;
    animation: progress 5s infinite;
  }

</style>