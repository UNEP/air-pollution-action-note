export function throttle(fn: () => void, wait: number): () => void {
  let isCalled = false;

  return function(...args){
    if (!isCalled){
      fn(...args);
      isCalled = true;
      setTimeout(function(){
        isCalled = false;
      }, wait);
    }
  };
}

interface DebouncedFunction {
    (): void;
    cancel: () => void;
}

export function trailingDebounce(fn: () => void, delay: number): DebouncedFunction {
  let timeout: number;
  const _fn = function() {
    if (timeout) window.clearTimeout(timeout);
    timeout = window.setTimeout(fn, delay);
  };
  _fn.cancel = () => window.clearTimeout(timeout);
  return _fn;
}

export function clamp(val: number, min:number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function* generateRange(end: number, start = 0, step = 1): Iterable<number> {
  let x = start - step;
  while(x < end - step) yield x += step;
}

export function createLookup<T, Y>
(
  arr: T[],
  keyFn: (d: T) => string,
  valFn: (d: T) => Y
): {[key: string]: Y} {

  const lookup: {[key: string]: Y} = {};

  arr.forEach(d => {
    const key = keyFn(d);
    lookup[key] = valFn(d);
  });

  return lookup;
}

export function displayVal(val: number, dp: number = null): string {
  if (dp === null) return val.toLocaleString();

  const multiplier = Math.pow(10, dp);
  return (Math.round(val * multiplier) / multiplier).toLocaleString();
}

export function getRandom<T>(data: T[]): T {
  const r = Math.floor(Math.random() * data.length);
  return data[r];
}

export function getXRandom<T>(data: T[], x: number): T[] {
  if (data.length < x) throw Error(`${data} has <${x} elements`);

  if (data.length === x) return data;

  const items = [];
  const remaining = [...data];
  for (let i = 0; i < x; i++) {
    const r = Math.floor(Math.random() * remaining.length);
    items.push(remaining[r]);
    remaining.splice(r, 1);
  }
  return items;
}

export interface RGB{
    r: number,
    g: number,
    b: number
}

export const strToId = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};
