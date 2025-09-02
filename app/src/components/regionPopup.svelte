<script lang="ts">
    import CartoCountries from "./CartoCountries.svelte";
    export let selectedRegion;
    export let valueType;
</script>
<div class="backdrop">
    <div class="region-popup">
        <div>
            <div class="header">
                <div class="title">{@html selectedRegion}</div>
                <svg xmlns="http://www.w3.org/2000/svg" style="cursor: pointer;" width="32" height="32" viewBox="0 0 32 32" fill="none" on:click={() => selectedRegion = 0}>
                    <mask id="mask0_3031_11911" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                      <rect width="32" height="32" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_3031_11911)">
                      <path d="M8.46285 24.3403L7.65918 23.5367L15.1962 16L7.65918 8.46334L8.46285 7.65967L15.9995 15.1967L23.5362 7.65967L24.3398 8.46334L16.8028 16L24.3398 23.5367L23.5362 24.3403L15.9995 16.8033L8.46285 24.3403Z" fill="#1C1B1F"/>
                    </g>
                </svg>
            </div>
            <CartoCountries bind:valueType />
        </div>
    </div>
</div>

<style>
    .backdrop {
        width: calc(100vw - 80px);
        height: 100vh;
        overflow-y: auto;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        background: rgba(0, 0, 0, 0.5);
        padding: 20px 40px;
    }

    .region-popup {
        border-radius: 4px;
        background: #FFF;
        box-shadow: 0px 4px 18.8px 0px rgba(0, 0, 0, 0.15);
        padding: 40px 40px 0;
        max-width: 1200px;
        width: 100%;
        /* top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        position: absolute; */
        z-index: 100;
        
    }

    .region-popup .header {
        display: flex;
        justify-content: space-between;
    }

    .region-popup .header .title {
        color: #1E1E1E;
        /* H3 */
        font-family: Roboto;
        font-size: 19px;
        font-style: normal;
        font-weight: 700;
        line-height: 29px; /* 152.632% */
    }
</style>