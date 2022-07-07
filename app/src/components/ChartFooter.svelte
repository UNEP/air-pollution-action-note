<script lang="ts">
  export var icon: string;
</script>

<footer >
  <div class="footer-content">
    <div class="footer-icon">{@html icon}</div>
    <span class="footer-text">
        <slot name="text" />
    </span>
    <slot name="content"/>
  </div>
</footer>

<style>
  footer {
      position: relative;
  }
  .footer-content {
      max-width: 1100px;
      height: 50px;
      font-size: 16px;
      display: flex;
      align-items: center;
      color: #505050;
      font-weight: 300;
      white-space: nowrap;
  }

  .footer-icon {
      flex: 0 0 28px;
      padding-left: 0px;
      margin-right: 6px;
      position: relative;
      top: 2px;
  }
  .footer-icon :global(svg *) {
      stroke: #666666;
  }
  @media (max-width: 700px) {
      .footer-icon {
          flex: 0 0 20px;
          top: 0;
      }
  }
</style>