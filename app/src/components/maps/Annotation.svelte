<script lang="ts">
  import { clamp } from "src/util";

  export var canvasWidth: number;
  export var canvasHeight: number;
  export var x: number;
  export var y: number;
  export var text: string;
  export var radius: number | {x: number, y: number};
  export var forceTopWherePossible: boolean = false;
  export var justText: boolean = false;
  export var topClamp: number = 0;

  const noDims = !(canvasHeight > 0) || !(canvasWidth > 0);
  if (noDims) throw new Error('Annotation created with no canvas dims');

  var textEl: HTMLElement;
  var el: HTMLElement;
  var pos: string;
  var textShiftX: number;
  var textShiftY: number;

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

  $: {
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
  $: {
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
        {@html text}
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
    pointer-events: none;
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
    width: 250px;
    z-index: 5;
    pointer-events: none;
  }

</style>
