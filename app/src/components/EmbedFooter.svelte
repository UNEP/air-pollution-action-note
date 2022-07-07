<script lang="ts">
  import svgs from '../svg';
  import ChartFooter from 'src/components/ChartFooter.svelte';
  export var embed: string;

  var showEmbedCode: boolean = false;
  var inputEl: HTMLInputElement;

  function click(evt: MouseEvent) {
    showEmbedCode = true;
    evt.preventDefault();
    window.setTimeout(() => {
      inputEl.focus();
      selectAll();
    }, 0);
  }

  function reset() {
    showEmbedCode = false;
  }

  function selectAll() {
    inputEl.setSelectionRange(0, inputEl.value.length);
  }

  const urlParts = window.location.href.split('/');
  const urlPath = urlParts.slice(0, -1).join('/');
  const embedScript = `${urlPath}/embed.js`;

  $: embed && reset();

</script>

<ChartFooter icon={svgs.embed}>
  <slot slot="text">
    {#if !showEmbedCode}
      <a href="EmbedCode" on:click={click}>Want to embed the visualizations?</a>
      {/if}
  </slot>
  <div slot="content" class="input-container">
    <input type="text" bind:this={inputEl} readonly={true}
      on:click={selectAll}
      on:blur={reset}
      class:visible={showEmbedCode}
      value="<script async src='{embedScript}' data-embed='{embed}'></script>" />
  </div>
</ChartFooter>

<style>
  .input-container {
      display: flex;
      align-items: center;
  }
  input {
      display: none;
      margin: 0;
      font-size: 13px;
      width: 250px;
      outline: 1px solid #555;
      outline-width: 0px;
      background: #f6f6f6;
      border: 1px solid #999;
      border-radius: 2px;
      padding: .4em;
  }

  .visible {
      display: block;
  }
</style>
