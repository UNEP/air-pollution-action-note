<script lang="ts">
  import type { HeadBlock } from "src/types";

  export let block: HeadBlock;

  console.log(block);
</script>

{@html block?.title}
