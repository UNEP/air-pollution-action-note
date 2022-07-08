<script>
  import UNEPLogoBlue from 'src/assets/unep.svg';
  import UNEPLogoWhite from 'src/assets/unepwhite.svg';

  export let color = undefined;
</script>

<div class="logo">
  <img src={!color || color === 'blue' ? UNEPLogoBlue : UNEPLogoWhite} alt='Logo of the United Nations Environment Programme | 50 year anniversary'>
</div>