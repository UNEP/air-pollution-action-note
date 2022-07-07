<script lang="ts">
  import type { Content, TextBlock } from 'src/types';
  import SectionTitle from "src/components/SectionTitle.svelte";

  export let id: string;
  export let text: TextBlock[];
  export let block: Content;
</script>

<section class="infoSquare margin-breakout-mobile" {id}>
  <SectionTitle {block} />
  {#each text as t}
    <p class='info-text'>{@html t.p}</p>
  {/each}
</section>

<style>
  .infoSquare {
    padding: 1rem 1rem;
    background-color:#E8E8E8;
    overflow: auto;
    max-width: 800px;
  }

  @media (min-width: 400px) {
    .infoSquare {
      padding: 1rem 2rem;
    }
  }

  .info-text {
    color:#505050;
    padding-bottom:0!important;
    font-size: 1.125rem;
  }

  @media (min-width: 58rem) {
    .infoSquare {
      margin: 1rem 0 0;
      padding: 3.6rem;
    }
  }
</style>