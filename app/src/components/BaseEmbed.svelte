<script lang="ts">
  import IframeResizingContainer from 'src/components/IframeResizingContainer.svelte';
  import Logo from './nav/Logo.svelte';

</script>

<IframeResizingContainer>
  <div class="container">
    <div class="content">

      <slot name="legend" />

      <div class="viz-pane">
        <slot name="viz" />
      </div>

      <div class="footer-embed wide">
        <div class="logo" >
          <a style="border-bottom: none" target="_blank" href="https://www.unep.org/">
          <Logo />
        </div>

        <div class="text-unep-endorsement">
          <p>The boundaries and names shown, and the designations used on
            this map do not imply official endorsement or acceptance by the United Nations.</p>
        </div>

      </div>

    </div>
  </div>
</IframeResizingContainer>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

  :global(body) {
    padding: 0;
    text-align: left;
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #F3F3F3;
    font-size: 24px;
  }

  .container {
    max-width: 100%;
    padding: 0 10px;
    margin: 0px 0px 0;
    margin: auto;
    overflow-x: hidden;
    position: relative;

    :global(.viz) {
      padding-bottom: 0;
    }

    :global(.embed-additional-text-desktop) {
      display: none;
      max-width: 300px;
      position: absolute;
      margin: 0;
      padding: 0;
    }
    
    :global(.embed-additional-text-desktop-policies) {
      display: none;
      max-width: 300px;
      position: absolute;
      margin-top: -12rem;
    }
  }

  .footer-embed {
    display: flex;
  }

  .text-unep-endorsement p {
    text-align: left;
    margin-top: 0;
    padding-top: 0px;
    font-size: 14px;
    line-height: 1.7;
    padding-left: 20px;
    font-weight: 300;
    color: dimgray;
    max-width: 600px;
  }

  .content {
    position: relative;
  }

  .viz-pane {
    position: relative;
    margin-left: 0%;
  }

  .logo {
    display: flex;
    align-items: flex-start;
  }

  .viz-pane {
    :global(.scrollable) {
      overflow: hidden;
    }
    :global(.scrollable-content) {
      position: relative;
    }
  }

  @media (min-width: 58rem) {
    .container {
      padding-left: 20px;
      :global(.embed-additional-text-desktop) {
        display: block;
      }
      :global(.embed-additional-text-desktop-policies) {
        display: block;
      }
    };

    .text-unep-endorsement {
      flex-grow: 1;
      p {
        padding-top: 10px;
        font-size: 16px;
      }
    }
  }
</style>