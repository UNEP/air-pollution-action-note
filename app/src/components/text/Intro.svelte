<script>
export let text;
export let head;
export let breadcrumbs;
</script>
<section class='intro col-text'>
  <nav class="inner-nav" role="navigation" labelledby="breadcrumbs-label">
    <h3 id="breadcrumbs-label" class="hidden">Breadcrumbs</h3>
    <ul class='breadcrumbs'>
      {#each breadcrumbs as b}
        {#if b.a}
        <li><a href='{b.a}'>{@html b.label}</a></li>
        {:else}
        <li>{@html b.label}</li>
        {/if}
      {/each}
    </ul>
  </nav>

  {#if head}
    <h1>{@html head}</h1>
  {/if}

  {#if text}
  {#each text as p}
      <p>{@html p.p}</p>
  {/each}
  {/if}

</section>

<style>
  .intro {
    border-bottom: 1px solid #3B536527;
    padding-top:2rem;
  }
  .breadcrumbs {
    list-style-type: none;
    margin:0;
    padding: 0;
  }
  li {
    display: inline-block;
    margin-right:.8rem;
    font-size: 1rem;
    color:#333;
    font-weight: 400;
  }
  li:not(:last-child)::after {
    content: '/';
    margin-left:.4rem;
  }
  li:last-child { font-weight: 700; }
  li a {
    border: none;
    transition: opacity .3s;
    opacity: .68;
  }
  li a:hover { opacity:1; }
  p { margin: 0; }
</style>