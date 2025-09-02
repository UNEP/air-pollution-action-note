<script lang="ts">
  import { clamp } from "src/util";

  export var canvasWidth: number;
  export var canvasHeight: number;
  export var x: number;
  export var y: number;
  export var text: string;
  export var region: string;
  export var radius: number | {x: number, y: number};
  export var forceTopWherePossible: boolean = false;
  export var justText: boolean = false;
  export var topClamp: number = 0;
  export var staticPosition: boolean = false;

  const noDims = !(canvasHeight > 0) || !(canvasWidth > 0);
  if (noDims) throw new Error('Annotation created with no canvas dims');

  var textEl: HTMLElement;
  var el: HTMLElement;
  var pos: string;
  var textShiftX: number;
  var textShiftY: number;
  export let selectedRegion;

  const clickHandler = (region) => {
        if (region !== 0) {
            selectedRegion = region;
        } else {
            selectedRegion = 0;
        }
  };
  const textWidth = 250;

  interface StyleCss {
      left?: number;
      top?: number;
      bottom?: number;
      right?: number;
      width?: number;
      height?: number;
      transform?: string;
  }

  $: limitedCanvasHeight = canvasHeight - topClamp;
  const perc = (a,b) => 100 * (a / b);
  const topPaddingPx = 5;
  const leftPaddingPx = 5;

  $: leftPadding = perc(leftPaddingPx, canvasWidth);
  $: topClampPerc = perc(topClamp, canvasHeight);
  $: xPerc = perc(x, canvasWidth);
  $: yPerc = perc(y - topClamp, limitedCanvasHeight);
  $: radiusX = perc(typeof radius === 'number' ? radius : radius.x, canvasWidth);
  $: radiusY = perc(typeof radius === 'number' ? radius : radius.y, limitedCanvasHeight);
  $: topMin = perc(topPaddingPx, limitedCanvasHeight);
  $: textWidthPerc = canvasWidth && perc(textWidth, canvasHeight);

  $: {
    if (staticPosition) pos = 'right';
    else {
      if (forceTopWherePossible) {
        if (yPerc < 15) {
          pos = xPerc > 50 ? 'left' : 'right';
        } else {
          pos = 'above';
        }
      }
      else {
        if (yPerc < 5) {
          pos = 'below';
        }
        else if (xPerc > 65 || xPerc < 35) {
          pos = xPerc > 50 ? 'left' : 'right';
        } else {
          pos = yPerc < 20 ? 'below' : 'above';
        }
      }
    }
    textShiftX = null;
    textShiftY = null;
    if (pos === 'left') {
      style = {
        right: 100 - (xPerc - radiusX),
        top: yPerc,
      };

    }
    else if (pos === 'right') {
      style = {
        left: xPerc + radiusX,
        top: yPerc,
      };
    }
    else if (pos === 'above') {
      style = {
        left: xPerc,
        top: forceTopWherePossible ? topMin : Math.max(topMin, yPerc - radiusY - 40),
        bottom: 100 - (yPerc - radiusY)
      };

    }
    else if (pos === 'below') {
      style = {
        left: xPerc,
        top: yPerc + radiusY,
        bottom: Math.max(0, 100 - yPerc - 50)
      };
    }

    if (pos === 'left' || pos === 'right') {
      if (yPerc < 10) {
        textShiftY = 0;
      }
      else if (yPerc > 90) {
        textShiftY = -100;
      }
      else {
        textShiftY = -50;
      }
    }
    else if (pos === 'above' || pos === 'below') {
      const _textShiftX = clamp(
        -(textWidthPerc / 3),
        -xPerc + leftPadding,
        (100 - xPerc) - textWidthPerc
      );
      textShiftX = 100 * _textShiftX / textWidthPerc;
    }
  }

  var style: StyleCss;

  function calcStyle(style: StyleCss) {
    const dimProps = ['left', 'top', 'bottom', 'right', 'width', 'height'];

    const dimStr = dimProps
      .filter(prop => style[prop] !== undefined)
      .map(prop => `${prop}: ${style[prop]}%; `)
      .join('');

    const transformStr = `transform: ${style.transform};`;
    return dimStr + transformStr;
  }

  $: styleStr = style ? calcStyle(style) : '';
  var textStyleStr: string;
  $: if (!staticPosition) {
    const translateX = textShiftX !== null ? `translateX(${textShiftX}%)` : '';
    const translateY = textShiftY !== null ? `translateY(${textShiftY}%)` : '';
    textStyleStr = (translateX || translateY) ? `transform: ${translateX} ${translateY};` : '';
  }

</script>

{#if !justText}
    <div class="canvas-limiter" style="top: {topClampPerc}%; height: {perc(limitedCanvasHeight, canvasHeight)}%">
        <div class="annotation annotation--{pos}" style={styleStr}
            bind:this={el}>
            <div class="line line-before"></div>
            <div class="text" style={textStyleStr} bind:this={textEl}>
                {@html text} 
            </div>
            <div class="line line-after"></div>
        </div>
    </div>
{:else}
    <div class="just-text"
        bind:this={el}>
        <div class="text" style="transform: translate({x}px, {y}px);" bind:this={textEl}>
            <span>
              {@html text} 
            </span>
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <mask id="mask0_3078_115" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_3078_115)">
                <path d="M7 17H10.5C10.6417 17 10.7604 17.048 10.8563 17.144C10.9521 17.24 11 17.3589 11 17.5008C11 17.6426 10.9521 17.7613 10.8563 17.8568C10.7604 17.9523 10.6417 18 10.5 18H6.80775C6.57892 18 6.38708 17.9226 6.23225 17.7678C6.07742 17.6129 6 17.4211 6 17.1923V13.5C6 13.3583 6.048 13.2396 6.144 13.1438C6.24 13.0479 6.35892 13 6.50075 13C6.64258 13 6.76125 13.0479 6.85675 13.1438C6.95225 13.2396 7 13.3583 7 13.5V17ZM17 7H13.5C13.3583 7 13.2396 6.952 13.1438 6.856C13.0479 6.76 13 6.64108 13 6.49925C13 6.35742 13.0479 6.23875 13.1438 6.14325C13.2396 6.04775 13.3583 6 13.5 6H17.1923C17.4211 6 17.6129 6.07742 17.7678 6.23225C17.9226 6.38708 18 6.57892 18 6.80775V10.5C18 10.6417 17.952 10.7604 17.856 10.8563C17.76 10.9521 17.6411 11 17.4992 11C17.3574 11 17.2387 10.9521 17.1432 10.8563C17.0477 10.7604 17 10.6417 17 10.5V7Z" fill="#1C1B1F"/>
              </g>
            </svg> -->
        </div>
    </div>
{/if}

<style>
  .canvas-limiter {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    pointer-events: none;
  }
  .just-text{
    position: absolute;
    /* pointer-events: none; */
    height: auto !important;
    width: 0;
  }
  .annotation {
    display: flex;
    position: absolute;
    pointer-events: none;
    height: auto !important;
    width: 0;
  }

  .text {
    flex: 0 0;
    /* cursor: pointer; */
    display: flex;
    align-items: center;
    /* border-radius: 2px; */
    /* background: #F9F9F9; */
    gap: 4px;
    /* padding: 2px; */
    width: fit-content;
    /* margin-top: -6px; */
  }

  .text span {
    white-space: nowrap;
  }
  .prerender {
    visibility: hidden;
  }

  .line {
    flex: 1 1;
  }

  .annotation--right .line,
  .annotation--left .line {
    border-top: 1px solid #bbbbbb;
    height: 0;
  }
  .annotation--above .line,
  .annotation--below .line {
    border-left: 1px solid #bbbbbb;
    width: 0;
  }

  .annotation--left,
  .annotation--right {
    flex-direction: row;
    width: calc(250px + 5%);
  }

  .annotation--left .text,
  .annotation--right .text {
    flex: 0 0 250px;
  }

  .annotation--above,
  .annotation--below {
    flex-direction: column;
    height: 200px;
  }

  .annotation--above .line-before,
  .annotation--below .line-after,
  .annotation--left .line-before,
  .annotation--right .line-after {
    display: none;
  }

  .text {
    /* width: 250px; */
    z-index: 5;
    /* pointer-events: none; */
  }

</style>
