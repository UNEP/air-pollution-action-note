<script lang="ts">
  import type { TextBlock } from "src/types";
  import EmbedFooter from "./EmbedFooter.svelte";

  export let isEmbed = false;
  export let embed: string;
  export let cartogramAnnotation: boolean;
  export let text: TextBlock[]
</script>
{#if isEmbed && embed === "policies"}
<div
  class="embed-additional-text-desktop-policies"
  class:hide={cartogramAnnotation}
>
  <p>
    To explore more about the climate emergency and the effects on the
    planet visit
    <b><a target="_blank" href="https://www.unep.org/">unep.org</a></b>
  </p>
</div>
{/if}

{#if !isEmbed}
<div class="footer">
  <EmbedFooter {embed} />
</div>

{#each text as t}
  <p class="col-text">{@html t.p}</p>
{/each}
{/if}