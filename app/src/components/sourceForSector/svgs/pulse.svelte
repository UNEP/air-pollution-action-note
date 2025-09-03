<script lang="ts">
    import { default as dataSectors } from 'src/data/sectorsPollution.json';
    export let selectedSector: string = '';
    export let isActive: boolean = false;
    
    const handleMouseEnter = (sector: string) => {
        selectedSector = sector;
        console.log('Selected sector:', sector);
    }

    const handleMouseLeave = () => {
        selectedSector = '';
    }

    // const dataSectors = {
    //     "International_shipping": {
    //         "title": "International shipping",
    //         "percentage": "0.7",
    //         "x": 68.6,
    //         "y": 45.0
    //     },
    //     "Energy": {
    //         "title": "Energy",
    //         "percentage": "10.2",
    //         "x": 15.3,
    //         "y": 17.3
    //     },
    //     "Industry": {
    //         "title": "Industry",
    //         "percentage": "11.7",
    //         "x": 9.7,
    //         "y": 48.2
    //     },
    //     "Solvent": {
    //         "title": "Solvent",
    //         "percentage": "0.2",
    //         "x": 32.0,
    //         "y": 43.0
    //     },
    //     "Waste": {
    //         "title": "Waste",
    //         "percentage": "4.8",
    //         "x": 61.4,
    //         "y": 78.6
    //     },
    //     "Agricultural_Waste_Burning": {
    //         "title": "Agricultural waste burning",
    //         "percentage": "0.7",
    //         "x": 41.4,
    //         "y": 59.7
    //     },
    //     "Agricultural": {
    //         "title": "Agricultural",
    //         "percentage": "8.3",
    //         "x": 61.7,
    //         "y": 64.3
    //     },
    //         "Landscape_Fire": {
    //         "title": "Landscape fire",
    //         "percentage": "3.4",
    //         "x": 79.7,
    //         "y": 21.7
    //     },
    //     "Other_combustion": {
    //         "title": "Other combustion",
    //         "percentage": "1.8",
    //         "x": 94.1,
    //         "y": 29.5
    //     },
    //     "Remaining_sources": {
    //         "title": "Remaining sources",
    //         "percentage": "5.2",
    //         "x": 88.1,
    //         "y": 35.4
    //     },
    //     "Antriphogenic": {
    //         "title": "Anthropogenic fugitive, combustion and industrial Dust",
    //         "percentage": "9.3",
    //         "x": 36.0,
    //         "y": 24.2
    //     },
    //     "Windblown_dust": {
    //         "title": "Windblown dust",
    //             "percentage": "16.1",
    //         "x": 59.6,
    //         "y": 23.9
    //     },
    //     "Residential": {
    //         "title": "Residential",
    //         "percentage": "19.2",
    //         "x": 84.2,
    //         "y": 67.4
    //     },
    //     "Transport": {
    //         "title": "Transport",
    //         "percentage": "6.9",
    //         "x": 39.1,
    //         "y": 80.6
    //     },
    //     "Commercial": {
    //         "title": "Commercial",
    //         "percentage": "1.5",
    //         "x": 12.3,
    //         "y": 71.6
    //     }
    // }
</script>

<div class="pulse-container" class:active={selectedSector !== ''}>
    {#each Object.keys(dataSectors) as sector}
        <div id={sector} class:active={selectedSector === sector} on:mouseenter={() => handleMouseEnter(sector)} on:mouseleave={handleMouseLeave} class="pulse-item {sector}" style="left: {dataSectors[sector].x}%; top: {dataSectors[sector].y}%;">
            <div class="annotation-text"><strong>{dataSectors[sector].title}</strong> accounts for <strong>{dataSectors[sector].percentage}%</strong> of global PM<sub>2.5</sub> emissions on average.</div>
        </div>
    {/each}
</div>

<style lang="scss">
    @keyframes pulse-outer {
        0% {
            transform: scale(1);
            opacity: 0.4;
        }
        50% {
            transform: scale(1.3);
            opacity: 0.2;
        }
        100% {
            transform: scale(1);
            opacity: 0.4;
        }
    }

    @keyframes pulse-middle {
        0% {
            transform: scale(1);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.3;
        }
        100% {
            transform: scale(1);
            opacity: 0.5;
        }
    }

    @keyframes pulse-inner {
        0% {
            box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.5);
        }
        100% {
            box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
        }
    }

    .pulse-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .pulse-item {
            position: absolute;
            top: 0;
            left: 0;
            background-color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid #A3A3A3;
            cursor: pointer;

            .annotation-text {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                width: 238px;
                height: fit-content;
                background: #FFF; 
                pointer-events: none;
                opacity: 0;
                /* Card */
                box-shadow: 0 4px 18.8px 0 rgba(0, 0, 0, 0.15);
                border-radius: 4px;
                padding: 10px;
                color: #1E1E1E;
                font-family: Roboto;
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 21.6px;
                bottom: 100px;
                transition: opacity 0.3s ease-in-out;
                &:before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateY(100%) translateX(-50%);
                    width: 1px;
                    height: 90px;
                    background-color: #949494;
                }
            }
            &.Antriphogenic,
            &.Energy,
            &.Landscape_Fire {
                .annotation-text {
                    bottom: unset;
                    top: 100px;
                    &:before {
                        height: 90px;
                        top: 0;
                        bottom: unset;
                        transform: translateY(-100%) translateX(-50%);
                    }
                }
            }
            &.Remaining_sources, 
            &.Other_combustion {
                .annotation-text {
                    bottom: 100px;
                    left: unset;
                    right: -20px;
                    transform: unset;
                    &:before {
                        height: 90px;
                        left: unset;
                        right: 30px;
                        transform: translateY(100%) translateX(0);
                    }
                }
            }

            &.Commercial,
            &.Industry {
                .annotation-text {
                    bottom: 100px;
                    left: -50px;
                    transform: unset;
                    &:before {
                        height: 90px;
                        left: 60px;
                        right: unset;
                        transform: translateY(100%) translateX(0);
                    }
                }
            }
        }

        &:not(.active) {
            .pulse-item {
                animation: pulse-inner 2s infinite;
            }
        }

        &.active {
            .pulse-item {
                opacity: 0.5;
                z-index: 10;
                &.active {
                    opacity: 1;
                    z-index: 11;
                    // animation: pulse-inner 2s infinite;

                    .annotation-text {
                        opacity: 1;
                    }
                }
            }
        }

    }
</style>