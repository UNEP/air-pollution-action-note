<script>
export let text;
export let head;
</script>
<section class='col-text'>
  {#if head}
  <h2>{@html head}</h2>
  {/if}
  {#if text}
  {#each text as p,i}
      <p>{@html p.p}</p>
  {/each}
  {/if}
</section>