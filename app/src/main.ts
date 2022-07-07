import App from './App.svelte';

const urlParams = new URLSearchParams(window.location.search);

const app = new App({
  target: document.body,
  props: {
    embed: urlParams.get('embed')
  }
});



export default app;
