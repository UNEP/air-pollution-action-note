<script>
    import Logo from "./Logo.svelte";
    const footerMenu = [
      {label: '© UNEP'},
      {label: 'Terms of Use', a: 'https://www.unep.org/node/18424/'},
      {label: 'Privacy', a: 'https://www.unep.org/node/28178/'},
      {label: 'Report a project concern', a: 'https://www.unep.org/about-un-environment/why-does-un-environment-matter/un-environment-project-concern'},
    ];

    const socialMenu = [
      {label: 'facebook-official', a: 'https://www.facebook.com/unep'},
      {label: 'twitter', a: 'https://twitter.com/UNEP'},
      {label: 'linkedin', a: 'https://www.linkedin.com/company/unep/'},
      {label: 'instagram', a: 'https://www.instagram.com/unep/'},
      {label: 'youtube', a: 'https://www.youtube.com/unenvironmentprogramme'},
      {label: 'weibo', a: 'https://www.weibo.com/unepandyou?is_hot=1'}
    ];
</script>

<footer class="fs footer">
    <nav class="footer-content" role="navigation" labelledby="footer-label">
        <Logo color="white" />
        <h3 id="footer-label" class="hidden">Footer menu</h3>
        <ul class='menu info'>
            {#each footerMenu as b}
            {#if b.a}
            <li><a href='{b.a}'>{@html b.label}</a></li>
            {:else}
            <li>{@html b.label}</li>
            {/if}
            {/each}
        </ul>
        <ul class='menu social'>
            {#each socialMenu as b}
            <li><a href='{b.a}' target='_blank' rel='noopener' aria-label='{b.a}'><i class="fa fa-{b.label} fa-lg"></i></a></li>
            {/each}
        </ul>
    </nav>
  </footer>

<style>
  .footer {
      background-color: #00abf1;
      padding-top: 2rem;
      margin-top: 2rem;
    }
  .menu {
    list-style-type: none;
    margin:2rem 0 0 0;
    padding: 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid #FFFFFF44;
  }
  .social {
    margin-top: 1rem;
  }
  li {
    display: inline-block;
    margin-right:.6rem;
    font-size: 1rem;
    color:#FFFFFFBB;
    font-weight: 400;
  }
  .social li {
    line-height: 1rem;
		font-size: .85rem;
		padding: 0 .18rem;
		vertical-align: .3rem;
	}
  .info li:not(:last-child)::after {
    content: '|';
    margin-left:.6rem;
  }
  li a {
    border: none;
    color:#FFFFFFBB;
    transition: color .3s;
  }
  .social li a { color:#FFFFFF;}
  li a:hover { color:#FFFFFFFF; }
  .social li a:hover { color:#FFFFFFBB; }

  @media screen and (min-width: 56rem) {
    .menu {
        width:40%;
        display: inline-block;
        margin:1.5rem 0 0 0;
				border-bottom: none;
    }
  }
</style>