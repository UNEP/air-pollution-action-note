export interface MenuSpyParams {
    menuItemSelector: string;
    activeClass: string;
    threshold: number;
    enableLocationHash: boolean;
    hashTimeout: number;
    callback: () => void;
}

interface CacheItem extends Array<CacheItem>{
    elm : HTMLAnchorElement;
    target: HTMLAnchorElement;
    offset: number;
}

interface Offset{
    top: number;
    left: number;
}

class MenuSpy {
    element: Element;
    options: MenuSpyParams;
    lastInViewElm: Element;
    currScrollTop: number;
    menuHeight:number;
    menuItems:HTMLAnchorElement[];
    raf: number;
    scrollItems: CacheItem[];
    enable: boolean;

    debouncedAssignValuesFn: () => void;
    debouncedHashFn: () => void;

    constructor(element:Element, options?:MenuSpyParams) {
      if (!element) {
        return;
      }

      const defaults : MenuSpyParams = {
        menuItemSelector   : 'a[href^="#"]',
        activeClass        : 'active',
        threshold          : 15,
        enableLocationHash : true,
        hashTimeout        : 600,
        callback           : null,
      };
      this.enable = true;
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
      this.options = utils.extend(defaults, options);

      this.assignValues();
      this.debouncedAssignValuesFn = utils.debounce(() => this.assignValues());
      window.addEventListener('resize', this.debouncedAssignValuesFn);

      this.debouncedHashFn = utils.debounce(() => {
        const hash = this.lastInViewElm ? `#${this.lastInViewElm.id}` : '#';
        if (history.replaceState) {
          history.replaceState(null, null, hash);
        } else {
          const st = utils.scrollTop();
          window.location.hash = hash;
          window.scrollTo(0, st as number);
        }
      }, this.options.hashTimeout);

      this.cacheItems();
      this.scrollFn();
    }

    assignValues():void {
      this.currScrollTop = 0;
      this.lastInViewElm = null;
      this.menuHeight = (this.element as HTMLElement).offsetHeight + this.options.threshold;
      this.menuItems = [].slice.call(this.element.querySelectorAll(this.options.menuItemSelector));
      this.raf = null;
    }

    cacheItems():void {
      this.scrollItems = this.menuItems.map((elm) => {
        const target = elm.dataset.target ?
          document.querySelector(elm.dataset.target) :
          document.getElementById(elm.getAttribute('href').slice(1));
        if (target) {
          const offset = Math.floor(utils.getOffset(target).top);
          return { elm, target, offset } as CacheItem ;
        }

      });
      this.scrollItems = this.scrollItems.filter(Boolean).sort((a, b) => a.offset - b.offset);
    }

    tick():void {
      if(this.enable){
        this.cacheItems();
        this.scrollItems = this.scrollItems.filter(Boolean).sort((a, b) => a.offset - b.offset);
        const fromTop = this.currScrollTop + this.menuHeight;
        const inViewElms = this.scrollItems.filter((item) => item.offset < fromTop);
        if(inViewElms.length > 0)this.activateItem(inViewElms.pop());
        else this.activateItem(this.scrollItems[0]);
      }
    }

    activateItem(inViewElm:CacheItem):void {
      const { activeClass, callback } = this.options;

      if (!inViewElm) {
        this.scrollItems.forEach((item) => utils.removeClass(item.elm.parentNode, activeClass));
        this.lastInViewElm = null;

        if (this.options.enableLocationHash) {
          this.debouncedHashFn();
        }

        return;
      }

      if (this.lastInViewElm !== inViewElm.target) {
        this.lastInViewElm = inViewElm.target;

        this.scrollItems.forEach((item) => {
          utils.removeClass(item.elm.parentNode, activeClass);

          if (item.target === inViewElm.target) {

            utils.addClass(item.elm.parentNode, activeClass);

            if (typeof callback === "function") {
              callback.call(this, item);
            }

            if (this.options.enableLocationHash) {
              this.debouncedHashFn();
            }
          }
        });
      }
    }

    scrollFn():void {
      const st = utils.scrollTop();

      if (this.currScrollTop !== st) {
        this.currScrollTop = st as number;
        this.tick();
      }

      this.raf = window.requestAnimationFrame(this.scrollFn.bind(this));
    }

    destroy():void {
      if (this.raf) {
        window.cancelAnimationFrame(this.raf);
      }

      window.removeEventListener('resize', this.debouncedAssignValuesFn);
    }

    dissableUpdate():void{
      this.enable = false;
    }

    enableUpdate():void{
      this.enable = true;
    }
}

export default MenuSpy;
const utils = {


  debounce(fn : () => void, delay? : number){
    let timeout = null;
    return () => {
      // eslint-disable-next-line prefer-rest-params
      const args:IArguments = arguments;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const context = this;
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = 0;
          return fn.apply(context, args);
        }, delay);
      }
    };
  },

  removeClass(el : ParentNode, className : string){
    if ((el as HTMLElement).classList) {
      (el as HTMLElement).classList.remove(className);
    } else {
      (el as HTMLElement).className =
      (el as HTMLElement).className
        .replace(new RegExp(`(^|\\b)${className
          .split(' ')
          .join('|')}(\\b|$)`, 'gi'), ' ');
    }
  },

  addClass(el : ParentNode, className){
    if ((el as HTMLElement).classList) {
      (el as HTMLElement).classList.add(className);
    } else {
      const classes = (el as HTMLElement).className.split(' ');
      const existingIndex = classes.indexOf(className);

      if (existingIndex === -1) {
        classes.push(className);
      }

      (el as HTMLElement).className = classes.join(' ');
    }
  },

  scrollTop (): number | void {
    if(window.pageYOffset) return window.pageYOffset;
    else return document.documentElement.scrollTop;
  },

  extend(a : MenuSpyParams, b : MenuSpyParams){
    for (const key in b) {
      if (Object.prototype.hasOwnProperty.call(b, key)) {
        a[key] = b[key];
      }
    }

    return a;
  },

  getOffset(el:Element) : Offset{
    const rect = el.getBoundingClientRect();

    return ({
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    });
  }
};