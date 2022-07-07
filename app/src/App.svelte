<script lang="ts">
  import type { Content } from 'src/types';
  import CartoWorld from 'src/components/CartoWorld.svelte';
  import CartoRegion from 'src/components/CartoRegion.svelte';
  import Intro from 'src/components/text/Intro.svelte';
  import Text from 'src/components/text/Text.svelte';
  import TopNav from 'src/components/nav/TopNav.svelte';
  import Footer from './components/nav/Footer.svelte';
  import text from 'src/text.json';
  import Menu from './components/nav/Menu.svelte';
  import BaseEmbed from './components/BaseEmbed.svelte';
  import MethodologySourcesText from 'src/components/MethodologySourcesText.svelte';
  import { strToId } from './util';

  const content: Content[] = text.article;
  
  export var embed: string;
  const embedBlock = embed && content.find(b => b.embed === embed);

  const components = {
    'carto-world': CartoWorld,
    'carto-region': CartoRegion,
    'intro': Intro,
    'text': Text,
    "menu": Menu,
    'methodology': MethodologySourcesText
  };
</script>
{#if embedBlock}
  <BaseEmbed>
    <div slot="viz" class="cartogram-pane">
      <svelte:component
        this={components[embedBlock.type]}
        {...embedBlock}
        content={content}
        block={embedBlock}
        isEmbed={true}
      />
    </div>
  </BaseEmbed>
{:else}
  <TopNav />
  <main>
    <article>
      {#each content as block}
        {#if components[block.type]}
          <svelte:component
            this={components[block.type]}
            {...block}
            block={block}
            id={block.menu ? strToId(block.menu) : null}
            content={content}
          />
        {:else}
          <div>Missing component for '{block.type}'</div>
        {/if}
      {/each}
    </article>
  </main>
  <Footer />
{/if}