<script lang="ts">
  import type { HeadBlock } from "src/types";

  export let block: HeadBlock;
</script>

{@html block?.title}
