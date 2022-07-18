
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity$3 = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now$1 = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root.host) {
            return root;
        }
        return document;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text$1(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text$1(' ');
    }
    function empty$1() {
        return text$1('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children$1(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch$1(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity$3, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now$1() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch$1(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch$1(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch$1(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children$1(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function ascending$1(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(f) {
      let delta = f;
      let compare = f;

      if (f.length === 1) {
        delta = (d, x) => f(d) - x;
        compare = ascendingComparator(f);
      }

      function left(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      }

      function right(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }

      function center(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function ascendingComparator(f) {
      return (d, x) => ascending$1(f(d), x);
    }

    function number$1(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending$1);
    const bisectRight = ascendingBisect.right;
    bisector(number$1).center;
    var bisect = bisectRight;

    function extent(values, valueof) {
      let min;
      let max;
      if (valueof === undefined) {
        for (const value of values) {
          if (value != null) {
            if (min === undefined) {
              if (value >= value) min = max = value;
            } else {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
      } else {
        let index = -1;
        for (let value of values) {
          if ((value = valueof(value, ++index, values)) != null) {
            if (min === undefined) {
              if (value >= value) min = max = value;
            } else {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
      }
      return [min, max];
    }

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function max(values, valueof) {
      let max;
      if (valueof === undefined) {
        for (const value of values) {
          if (value != null
              && (max < value || (max === undefined && value >= value))) {
            max = value;
          }
        }
      } else {
        let index = -1;
        for (let value of values) {
          if ((value = valueof(value, ++index, values)) != null
              && (max < value || (max === undefined && value >= value))) {
            max = value;
          }
        }
      }
      return max;
    }

    function min(values, valueof) {
      let min;
      if (valueof === undefined) {
        for (const value of values) {
          if (value != null
              && (min > value || (min === undefined && value >= value))) {
            min = value;
          }
        }
      } else {
        let index = -1;
        for (let value of values) {
          if ((value = valueof(value, ++index, values)) != null
              && (min > value || (min === undefined && value >= value))) {
            min = value;
          }
        }
      }
      return min;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    const implicit = Symbol("implicit");

    function ordinal() {
      var index = new Map(),
          domain = [],
          range = [],
          unknown = implicit;

      function scale(d) {
        var key = d + "", i = index.get(key);
        if (!i) {
          if (unknown !== implicit) return unknown;
          index.set(key, i = domain.push(d));
        }
        return range[(i - 1) % range.length];
      }

      scale.domain = function(_) {
        if (!arguments.length) return domain.slice();
        domain = [], index = new Map();
        for (const value of _) {
          const key = value + "";
          if (index.has(key)) continue;
          index.set(key, domain.push(value));
        }
        return scale;
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), scale) : range.slice();
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      scale.copy = function() {
        return ordinal(domain, range).unknown(unknown);
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant$3 = x => () => x;

    function linear$1(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant$3(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant$3(isNaN(a) ? b : a);
    }

    var interpolateRgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb$1(start, end) {
        var r = color((start = rgb(start)).r, (end = rgb(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb$1.gamma = rgbGamma;

      return rgb$1;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate$1(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate$1(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function interpolateString(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate$1(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant$3(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
          : b instanceof color ? interpolateRgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    var degrees = 180 / Math.PI;

    var identity$2 = {
      translateX: 0,
      translateY: 0,
      rotate: 0,
      skewX: 0,
      scaleX: 1,
      scaleY: 1
    };

    function decompose(a, b, c, d, e, f) {
      var scaleX, scaleY, skewX;
      if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
      if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
      if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
      if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
      return {
        translateX: e,
        translateY: f,
        rotate: Math.atan2(b, a) * degrees,
        skewX: Math.atan(skewX) * degrees,
        scaleX: scaleX,
        scaleY: scaleY
      };
    }

    var svgNode;

    /* eslint-disable no-undef */
    function parseCss(value) {
      const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
      return m.isIdentity ? identity$2 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
    }

    function parseSvg(value) {
      if (value == null) return identity$2;
      if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svgNode.setAttribute("transform", value);
      if (!(value = svgNode.transform.baseVal.consolidate())) return identity$2;
      value = value.matrix;
      return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
    }

    function interpolateTransform(parse, pxComma, pxParen, degParen) {

      function pop(s) {
        return s.length ? s.pop() + " " : "";
      }

      function translate(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
          var i = s.push("translate(", null, pxComma, null, pxParen);
          q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
        } else if (xb || yb) {
          s.push("translate(" + xb + pxComma + yb + pxParen);
        }
      }

      function rotate(a, b, s, q) {
        if (a !== b) {
          if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
          q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
        } else if (b) {
          s.push(pop(s) + "rotate(" + b + degParen);
        }
      }

      function skewX(a, b, s, q) {
        if (a !== b) {
          q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
        } else if (b) {
          s.push(pop(s) + "skewX(" + b + degParen);
        }
      }

      function scale(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
          var i = s.push(pop(s) + "scale(", null, ",", null, ")");
          q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
        } else if (xb !== 1 || yb !== 1) {
          s.push(pop(s) + "scale(" + xb + "," + yb + ")");
        }
      }

      return function(a, b) {
        var s = [], // string constants and placeholders
            q = []; // number interpolators
        a = parse(a), b = parse(b);
        translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
        rotate(a.rotate, b.rotate, s, q);
        skewX(a.skewX, b.skewX, s, q);
        scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
        a = b = null; // gc
        return function(t) {
          var i = -1, n = q.length, o;
          while (++i < n) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        };
      };
    }

    var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
    var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$1(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisect(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate = interpolate$1,
          transform,
          untransform,
          unknown,
          clamp = identity$1,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$1) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate = _, rescale()) : interpolate;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity$1, identity$1);
    }

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale$1(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale$1;
    var format;
    var formatPrefix;

    defaultLocale$1({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale$1(definition) {
      locale$1 = formatLocale$1(definition);
      format = locale$1.format;
      formatPrefix = locale$1.formatPrefix;
      return locale$1;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    function transformPow(exponent) {
      return function(x) {
        return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
      };
    }

    function transformSqrt(x) {
      return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
    }

    function transformSquare(x) {
      return x < 0 ? -x * x : x * x;
    }

    function powish(transform) {
      var scale = transform(identity$1, identity$1),
          exponent = 1;

      function rescale() {
        return exponent === 1 ? transform(identity$1, identity$1)
            : exponent === 0.5 ? transform(transformSqrt, transformSquare)
            : transform(transformPow(exponent), transformPow(1 / exponent));
      }

      scale.exponent = function(_) {
        return arguments.length ? (exponent = +_, rescale()) : exponent;
      };

      return linearish(scale);
    }

    function pow() {
      var scale = powish(transformer());

      scale.copy = function() {
        return copy(scale, pow()).exponent(scale.exponent());
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function sqrt() {
      return pow.apply(null, arguments).exponent(0.5);
    }

    function threshold() {
      var domain = [0.5],
          range = [0, 1],
          unknown,
          n = 1;

      function scale(x) {
        return x != null && x <= x ? range[bisect(domain, x, 0, n)] : unknown;
      }

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
      };

      scale.invertExtent = function(y) {
        var i = range.indexOf(y);
        return [domain[i - 1], domain[i]];
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      scale.copy = function() {
        return threshold()
            .domain(domain)
            .range(range)
            .unknown(unknown);
      };

      return initRange.apply(scale, arguments);
    }

    var t0 = new Date,
        t1 = new Date;

    function newInterval(floori, offseti, count, field) {

      function interval(date) {
        return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
      }

      interval.floor = function(date) {
        return floori(date = new Date(+date)), date;
      };

      interval.ceil = function(date) {
        return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
      };

      interval.round = function(date) {
        var d0 = interval(date),
            d1 = interval.ceil(date);
        return date - d0 < d1 - date ? d0 : d1;
      };

      interval.offset = function(date, step) {
        return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
      };

      interval.range = function(start, stop, step) {
        var range = [], previous;
        start = interval.ceil(start);
        step = step == null ? 1 : Math.floor(step);
        if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
        do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
        while (previous < start && start < stop);
        return range;
      };

      interval.filter = function(test) {
        return newInterval(function(date) {
          if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
        }, function(date, step) {
          if (date >= date) {
            if (step < 0) while (++step <= 0) {
              while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
            } else while (--step >= 0) {
              while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
            }
          }
        });
      };

      if (count) {
        interval.count = function(start, end) {
          t0.setTime(+start), t1.setTime(+end);
          floori(t0), floori(t1);
          return Math.floor(count(t0, t1));
        };

        interval.every = function(step) {
          step = Math.floor(step);
          return !isFinite(step) || !(step > 0) ? null
              : !(step > 1) ? interval
              : interval.filter(field
                  ? function(d) { return field(d) % step === 0; }
                  : function(d) { return interval.count(0, d) % step === 0; });
        };
      }

      return interval;
    }

    const durationSecond = 1000;
    const durationMinute = durationSecond * 60;
    const durationHour = durationMinute * 60;
    const durationDay = durationHour * 24;
    const durationWeek = durationDay * 7;

    var day = newInterval(
      date => date.setHours(0, 0, 0, 0),
      (date, step) => date.setDate(date.getDate() + step),
      (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay,
      date => date.getDate() - 1
    );

    var timeDay = day;

    function weekday(i) {
      return newInterval(function(date) {
        date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setDate(date.getDate() + step * 7);
      }, function(start, end) {
        return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
      });
    }

    var sunday = weekday(0);
    var monday = weekday(1);
    weekday(2);
    weekday(3);
    var thursday = weekday(4);
    weekday(5);
    weekday(6);

    var year = newInterval(function(date) {
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step);
    }, function(start, end) {
      return end.getFullYear() - start.getFullYear();
    }, function(date) {
      return date.getFullYear();
    });

    // An optimized implementation for this simple case.
    year.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setFullYear(Math.floor(date.getFullYear() / k) * k);
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setFullYear(date.getFullYear() + step * k);
      });
    };

    var timeYear = year;

    var utcDay = newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step);
    }, function(start, end) {
      return (end - start) / durationDay;
    }, function(date) {
      return date.getUTCDate() - 1;
    });

    var utcDay$1 = utcDay;

    function utcWeekday(i) {
      return newInterval(function(date) {
        date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCDate(date.getUTCDate() + step * 7);
      }, function(start, end) {
        return (end - start) / durationWeek;
      });
    }

    var utcSunday = utcWeekday(0);
    var utcMonday = utcWeekday(1);
    utcWeekday(2);
    utcWeekday(3);
    var utcThursday = utcWeekday(4);
    utcWeekday(5);
    utcWeekday(6);

    var utcYear = newInterval(function(date) {
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step);
    }, function(start, end) {
      return end.getUTCFullYear() - start.getUTCFullYear();
    }, function(date) {
      return date.getUTCFullYear();
    });

    // An optimized implementation for this simple case.
    utcYear.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
        date.setUTCMonth(0, 1);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCFullYear(date.getUTCFullYear() + step * k);
      });
    };

    var utcYear$1 = utcYear;

    function localDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date.setFullYear(d.y);
        return date;
      }
      return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
    }

    function utcDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date.setUTCFullYear(d.y);
        return date;
      }
      return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
    }

    function newDate(y, m, d) {
      return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
    }

    function formatLocale(locale) {
      var locale_dateTime = locale.dateTime,
          locale_date = locale.date,
          locale_time = locale.time,
          locale_periods = locale.periods,
          locale_weekdays = locale.days,
          locale_shortWeekdays = locale.shortDays,
          locale_months = locale.months,
          locale_shortMonths = locale.shortMonths;

      var periodRe = formatRe(locale_periods),
          periodLookup = formatLookup(locale_periods),
          weekdayRe = formatRe(locale_weekdays),
          weekdayLookup = formatLookup(locale_weekdays),
          shortWeekdayRe = formatRe(locale_shortWeekdays),
          shortWeekdayLookup = formatLookup(locale_shortWeekdays),
          monthRe = formatRe(locale_months),
          monthLookup = formatLookup(locale_months),
          shortMonthRe = formatRe(locale_shortMonths),
          shortMonthLookup = formatLookup(locale_shortMonths);

      var formats = {
        "a": formatShortWeekday,
        "A": formatWeekday,
        "b": formatShortMonth,
        "B": formatMonth,
        "c": null,
        "d": formatDayOfMonth,
        "e": formatDayOfMonth,
        "f": formatMicroseconds,
        "g": formatYearISO,
        "G": formatFullYearISO,
        "H": formatHour24,
        "I": formatHour12,
        "j": formatDayOfYear,
        "L": formatMilliseconds,
        "m": formatMonthNumber,
        "M": formatMinutes,
        "p": formatPeriod,
        "q": formatQuarter,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatSeconds,
        "u": formatWeekdayNumberMonday,
        "U": formatWeekNumberSunday,
        "V": formatWeekNumberISO,
        "w": formatWeekdayNumberSunday,
        "W": formatWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatYear,
        "Y": formatFullYear,
        "Z": formatZone,
        "%": formatLiteralPercent
      };

      var utcFormats = {
        "a": formatUTCShortWeekday,
        "A": formatUTCWeekday,
        "b": formatUTCShortMonth,
        "B": formatUTCMonth,
        "c": null,
        "d": formatUTCDayOfMonth,
        "e": formatUTCDayOfMonth,
        "f": formatUTCMicroseconds,
        "g": formatUTCYearISO,
        "G": formatUTCFullYearISO,
        "H": formatUTCHour24,
        "I": formatUTCHour12,
        "j": formatUTCDayOfYear,
        "L": formatUTCMilliseconds,
        "m": formatUTCMonthNumber,
        "M": formatUTCMinutes,
        "p": formatUTCPeriod,
        "q": formatUTCQuarter,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatUTCSeconds,
        "u": formatUTCWeekdayNumberMonday,
        "U": formatUTCWeekNumberSunday,
        "V": formatUTCWeekNumberISO,
        "w": formatUTCWeekdayNumberSunday,
        "W": formatUTCWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatUTCYear,
        "Y": formatUTCFullYear,
        "Z": formatUTCZone,
        "%": formatLiteralPercent
      };

      var parses = {
        "a": parseShortWeekday,
        "A": parseWeekday,
        "b": parseShortMonth,
        "B": parseMonth,
        "c": parseLocaleDateTime,
        "d": parseDayOfMonth,
        "e": parseDayOfMonth,
        "f": parseMicroseconds,
        "g": parseYear,
        "G": parseFullYear,
        "H": parseHour24,
        "I": parseHour24,
        "j": parseDayOfYear,
        "L": parseMilliseconds,
        "m": parseMonthNumber,
        "M": parseMinutes,
        "p": parsePeriod,
        "q": parseQuarter,
        "Q": parseUnixTimestamp,
        "s": parseUnixTimestampSeconds,
        "S": parseSeconds,
        "u": parseWeekdayNumberMonday,
        "U": parseWeekNumberSunday,
        "V": parseWeekNumberISO,
        "w": parseWeekdayNumberSunday,
        "W": parseWeekNumberMonday,
        "x": parseLocaleDate,
        "X": parseLocaleTime,
        "y": parseYear,
        "Y": parseFullYear,
        "Z": parseZone,
        "%": parseLiteralPercent
      };

      // These recursive directive definitions must be deferred.
      formats.x = newFormat(locale_date, formats);
      formats.X = newFormat(locale_time, formats);
      formats.c = newFormat(locale_dateTime, formats);
      utcFormats.x = newFormat(locale_date, utcFormats);
      utcFormats.X = newFormat(locale_time, utcFormats);
      utcFormats.c = newFormat(locale_dateTime, utcFormats);

      function newFormat(specifier, formats) {
        return function(date) {
          var string = [],
              i = -1,
              j = 0,
              n = specifier.length,
              c,
              pad,
              format;

          if (!(date instanceof Date)) date = new Date(+date);

          while (++i < n) {
            if (specifier.charCodeAt(i) === 37) {
              string.push(specifier.slice(j, i));
              if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
              else pad = c === "e" ? " " : "0";
              if (format = formats[c]) c = format(date, pad);
              string.push(c);
              j = i + 1;
            }
          }

          string.push(specifier.slice(j, i));
          return string.join("");
        };
      }

      function newParse(specifier, Z) {
        return function(string) {
          var d = newDate(1900, undefined, 1),
              i = parseSpecifier(d, specifier, string += "", 0),
              week, day;
          if (i != string.length) return null;

          // If a UNIX timestamp is specified, return it.
          if ("Q" in d) return new Date(d.Q);
          if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

          // If this is utcParse, never use the local timezone.
          if (Z && !("Z" in d)) d.Z = 0;

          // The am-pm flag is 0 for AM, and 1 for PM.
          if ("p" in d) d.H = d.H % 12 + d.p * 12;

          // If the month was not specified, inherit from the quarter.
          if (d.m === undefined) d.m = "q" in d ? d.q : 0;

          // Convert day-of-week and week-of-year to day-of-year.
          if ("V" in d) {
            if (d.V < 1 || d.V > 53) return null;
            if (!("w" in d)) d.w = 1;
            if ("Z" in d) {
              week = utcDate(newDate(d.y, 0, 1)), day = week.getUTCDay();
              week = day > 4 || day === 0 ? utcMonday.ceil(week) : utcMonday(week);
              week = utcDay$1.offset(week, (d.V - 1) * 7);
              d.y = week.getUTCFullYear();
              d.m = week.getUTCMonth();
              d.d = week.getUTCDate() + (d.w + 6) % 7;
            } else {
              week = localDate(newDate(d.y, 0, 1)), day = week.getDay();
              week = day > 4 || day === 0 ? monday.ceil(week) : monday(week);
              week = timeDay.offset(week, (d.V - 1) * 7);
              d.y = week.getFullYear();
              d.m = week.getMonth();
              d.d = week.getDate() + (d.w + 6) % 7;
            }
          } else if ("W" in d || "U" in d) {
            if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
            day = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
            d.m = 0;
            d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
          }

          // If a time zone is specified, all fields are interpreted as UTC and then
          // offset according to the specified time zone.
          if ("Z" in d) {
            d.H += d.Z / 100 | 0;
            d.M += d.Z % 100;
            return utcDate(d);
          }

          // Otherwise, all fields are in local time.
          return localDate(d);
        };
      }

      function parseSpecifier(d, specifier, string, j) {
        var i = 0,
            n = specifier.length,
            m = string.length,
            c,
            parse;

        while (i < n) {
          if (j >= m) return -1;
          c = specifier.charCodeAt(i++);
          if (c === 37) {
            c = specifier.charAt(i++);
            parse = parses[c in pads ? specifier.charAt(i++) : c];
            if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
          } else if (c != string.charCodeAt(j++)) {
            return -1;
          }
        }

        return j;
      }

      function parsePeriod(d, string, i) {
        var n = periodRe.exec(string.slice(i));
        return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseShortWeekday(d, string, i) {
        var n = shortWeekdayRe.exec(string.slice(i));
        return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseWeekday(d, string, i) {
        var n = weekdayRe.exec(string.slice(i));
        return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseShortMonth(d, string, i) {
        var n = shortMonthRe.exec(string.slice(i));
        return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseMonth(d, string, i) {
        var n = monthRe.exec(string.slice(i));
        return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseLocaleDateTime(d, string, i) {
        return parseSpecifier(d, locale_dateTime, string, i);
      }

      function parseLocaleDate(d, string, i) {
        return parseSpecifier(d, locale_date, string, i);
      }

      function parseLocaleTime(d, string, i) {
        return parseSpecifier(d, locale_time, string, i);
      }

      function formatShortWeekday(d) {
        return locale_shortWeekdays[d.getDay()];
      }

      function formatWeekday(d) {
        return locale_weekdays[d.getDay()];
      }

      function formatShortMonth(d) {
        return locale_shortMonths[d.getMonth()];
      }

      function formatMonth(d) {
        return locale_months[d.getMonth()];
      }

      function formatPeriod(d) {
        return locale_periods[+(d.getHours() >= 12)];
      }

      function formatQuarter(d) {
        return 1 + ~~(d.getMonth() / 3);
      }

      function formatUTCShortWeekday(d) {
        return locale_shortWeekdays[d.getUTCDay()];
      }

      function formatUTCWeekday(d) {
        return locale_weekdays[d.getUTCDay()];
      }

      function formatUTCShortMonth(d) {
        return locale_shortMonths[d.getUTCMonth()];
      }

      function formatUTCMonth(d) {
        return locale_months[d.getUTCMonth()];
      }

      function formatUTCPeriod(d) {
        return locale_periods[+(d.getUTCHours() >= 12)];
      }

      function formatUTCQuarter(d) {
        return 1 + ~~(d.getUTCMonth() / 3);
      }

      return {
        format: function(specifier) {
          var f = newFormat(specifier += "", formats);
          f.toString = function() { return specifier; };
          return f;
        },
        parse: function(specifier) {
          var p = newParse(specifier += "", false);
          p.toString = function() { return specifier; };
          return p;
        },
        utcFormat: function(specifier) {
          var f = newFormat(specifier += "", utcFormats);
          f.toString = function() { return specifier; };
          return f;
        },
        utcParse: function(specifier) {
          var p = newParse(specifier += "", true);
          p.toString = function() { return specifier; };
          return p;
        }
      };
    }

    var pads = {"-": "", "_": " ", "0": "0"},
        numberRe = /^\s*\d+/, // note: ignores next directive
        percentRe = /^%/,
        requoteRe = /[\\^$*+?|[\]().{}]/g;

    function pad(value, fill, width) {
      var sign = value < 0 ? "-" : "",
          string = (sign ? -value : value) + "",
          length = string.length;
      return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
    }

    function requote(s) {
      return s.replace(requoteRe, "\\$&");
    }

    function formatRe(names) {
      return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
    }

    function formatLookup(names) {
      return new Map(names.map((name, i) => [name.toLowerCase(), i]));
    }

    function parseWeekdayNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.w = +n[0], i + n[0].length) : -1;
    }

    function parseWeekdayNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.u = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.U = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberISO(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.V = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.W = +n[0], i + n[0].length) : -1;
    }

    function parseFullYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 4));
      return n ? (d.y = +n[0], i + n[0].length) : -1;
    }

    function parseYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
    }

    function parseZone(d, string, i) {
      var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
      return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
    }

    function parseQuarter(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
    }

    function parseMonthNumber(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
    }

    function parseDayOfMonth(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.d = +n[0], i + n[0].length) : -1;
    }

    function parseDayOfYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
    }

    function parseHour24(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.H = +n[0], i + n[0].length) : -1;
    }

    function parseMinutes(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.M = +n[0], i + n[0].length) : -1;
    }

    function parseSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.S = +n[0], i + n[0].length) : -1;
    }

    function parseMilliseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.L = +n[0], i + n[0].length) : -1;
    }

    function parseMicroseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 6));
      return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
    }

    function parseLiteralPercent(d, string, i) {
      var n = percentRe.exec(string.slice(i, i + 1));
      return n ? i + n[0].length : -1;
    }

    function parseUnixTimestamp(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = +n[0], i + n[0].length) : -1;
    }

    function parseUnixTimestampSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.s = +n[0], i + n[0].length) : -1;
    }

    function formatDayOfMonth(d, p) {
      return pad(d.getDate(), p, 2);
    }

    function formatHour24(d, p) {
      return pad(d.getHours(), p, 2);
    }

    function formatHour12(d, p) {
      return pad(d.getHours() % 12 || 12, p, 2);
    }

    function formatDayOfYear(d, p) {
      return pad(1 + timeDay.count(timeYear(d), d), p, 3);
    }

    function formatMilliseconds(d, p) {
      return pad(d.getMilliseconds(), p, 3);
    }

    function formatMicroseconds(d, p) {
      return formatMilliseconds(d, p) + "000";
    }

    function formatMonthNumber(d, p) {
      return pad(d.getMonth() + 1, p, 2);
    }

    function formatMinutes(d, p) {
      return pad(d.getMinutes(), p, 2);
    }

    function formatSeconds(d, p) {
      return pad(d.getSeconds(), p, 2);
    }

    function formatWeekdayNumberMonday(d) {
      var day = d.getDay();
      return day === 0 ? 7 : day;
    }

    function formatWeekNumberSunday(d, p) {
      return pad(sunday.count(timeYear(d) - 1, d), p, 2);
    }

    function dISO(d) {
      var day = d.getDay();
      return (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
    }

    function formatWeekNumberISO(d, p) {
      d = dISO(d);
      return pad(thursday.count(timeYear(d), d) + (timeYear(d).getDay() === 4), p, 2);
    }

    function formatWeekdayNumberSunday(d) {
      return d.getDay();
    }

    function formatWeekNumberMonday(d, p) {
      return pad(monday.count(timeYear(d) - 1, d), p, 2);
    }

    function formatYear(d, p) {
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatYearISO(d, p) {
      d = dISO(d);
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatFullYear(d, p) {
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatFullYearISO(d, p) {
      var day = d.getDay();
      d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatZone(d) {
      var z = d.getTimezoneOffset();
      return (z > 0 ? "-" : (z *= -1, "+"))
          + pad(z / 60 | 0, "0", 2)
          + pad(z % 60, "0", 2);
    }

    function formatUTCDayOfMonth(d, p) {
      return pad(d.getUTCDate(), p, 2);
    }

    function formatUTCHour24(d, p) {
      return pad(d.getUTCHours(), p, 2);
    }

    function formatUTCHour12(d, p) {
      return pad(d.getUTCHours() % 12 || 12, p, 2);
    }

    function formatUTCDayOfYear(d, p) {
      return pad(1 + utcDay$1.count(utcYear$1(d), d), p, 3);
    }

    function formatUTCMilliseconds(d, p) {
      return pad(d.getUTCMilliseconds(), p, 3);
    }

    function formatUTCMicroseconds(d, p) {
      return formatUTCMilliseconds(d, p) + "000";
    }

    function formatUTCMonthNumber(d, p) {
      return pad(d.getUTCMonth() + 1, p, 2);
    }

    function formatUTCMinutes(d, p) {
      return pad(d.getUTCMinutes(), p, 2);
    }

    function formatUTCSeconds(d, p) {
      return pad(d.getUTCSeconds(), p, 2);
    }

    function formatUTCWeekdayNumberMonday(d) {
      var dow = d.getUTCDay();
      return dow === 0 ? 7 : dow;
    }

    function formatUTCWeekNumberSunday(d, p) {
      return pad(utcSunday.count(utcYear$1(d) - 1, d), p, 2);
    }

    function UTCdISO(d) {
      var day = d.getUTCDay();
      return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
    }

    function formatUTCWeekNumberISO(d, p) {
      d = UTCdISO(d);
      return pad(utcThursday.count(utcYear$1(d), d) + (utcYear$1(d).getUTCDay() === 4), p, 2);
    }

    function formatUTCWeekdayNumberSunday(d) {
      return d.getUTCDay();
    }

    function formatUTCWeekNumberMonday(d, p) {
      return pad(utcMonday.count(utcYear$1(d) - 1, d), p, 2);
    }

    function formatUTCYear(d, p) {
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCYearISO(d, p) {
      d = UTCdISO(d);
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCFullYear(d, p) {
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCFullYearISO(d, p) {
      var day = d.getUTCDay();
      d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCZone() {
      return "+0000";
    }

    function formatLiteralPercent() {
      return "%";
    }

    function formatUnixTimestamp(d) {
      return +d;
    }

    function formatUnixTimestampSeconds(d) {
      return Math.floor(+d / 1000);
    }

    var locale;
    var timeParse;

    defaultLocale({
      dateTime: "%x, %X",
      date: "%-m/%-d/%Y",
      time: "%-I:%M:%S %p",
      periods: ["AM", "PM"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      timeParse = locale.parse;
      return locale;
    }

    const pi = Math.PI,
        tau = 2 * pi,
        epsilon = 1e-6,
        tauEpsilon = tau - epsilon;

    function Path() {
      this._x0 = this._y0 = // start of current subpath
      this._x1 = this._y1 = null; // end of current subpath
      this._ = "";
    }

    function path() {
      return new Path;
    }

    Path.prototype = path.prototype = {
      constructor: Path,
      moveTo: function(x, y) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
      },
      closePath: function() {
        if (this._x1 !== null) {
          this._x1 = this._x0, this._y1 = this._y0;
          this._ += "Z";
        }
      },
      lineTo: function(x, y) {
        this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      quadraticCurveTo: function(x1, y1, x, y) {
        this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      bezierCurveTo: function(x1, y1, x2, y2, x, y) {
        this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      arcTo: function(x1, y1, x2, y2, r) {
        x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
        var x0 = this._x1,
            y0 = this._y1,
            x21 = x2 - x1,
            y21 = y2 - y1,
            x01 = x0 - x1,
            y01 = y0 - y1,
            l01_2 = x01 * x01 + y01 * y01;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x1,y1).
        if (this._x1 === null) {
          this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
        else if (!(l01_2 > epsilon));

        // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
        // Equivalently, is (x1,y1) coincident with (x2,y2)?
        // Or, is the radius zero? Line to (x1,y1).
        else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Otherwise, draw an arc!
        else {
          var x20 = x2 - x0,
              y20 = y2 - y0,
              l21_2 = x21 * x21 + y21 * y21,
              l20_2 = x20 * x20 + y20 * y20,
              l21 = Math.sqrt(l21_2),
              l01 = Math.sqrt(l01_2),
              l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
              t01 = l / l01,
              t21 = l / l21;

          // If the start tangent is not coincident with (x0,y0), line to.
          if (Math.abs(t01 - 1) > epsilon) {
            this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
          }

          this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
        }
      },
      arc: function(x, y, r, a0, a1, ccw) {
        x = +x, y = +y, r = +r, ccw = !!ccw;
        var dx = r * Math.cos(a0),
            dy = r * Math.sin(a0),
            x0 = x + dx,
            y0 = y + dy,
            cw = 1 ^ ccw,
            da = ccw ? a0 - a1 : a1 - a0;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x0,y0).
        if (this._x1 === null) {
          this._ += "M" + x0 + "," + y0;
        }

        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
          this._ += "L" + x0 + "," + y0;
        }

        // Is this arc empty? We’re done.
        if (!r) return;

        // Does the angle go the wrong way? Flip the direction.
        if (da < 0) da = da % tau + tau;

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon) {
          this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
        }

        // Is this arc non-empty? Draw an arc!
        else if (da > epsilon) {
          this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
        }
      },
      rect: function(x, y, w, h) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
      },
      toString: function() {
        return this._;
      }
    };

    function constant$2(x) {
      return function constant() {
        return x;
      };
    }

    function array$1(x) {
      return typeof x === "object" && "length" in x
        ? x // Array, TypedArray, NodeList, array-like
        : Array.from(x); // Map, Set, iterable, string, or anything else
    }

    function Linear(context) {
      this._context = context;
    }

    Linear.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; // proceed
          default: this._context.lineTo(x, y); break;
        }
      }
    };

    function curveLinear(context) {
      return new Linear(context);
    }

    function x(p) {
      return p[0];
    }

    function y(p) {
      return p[1];
    }

    function line(x$1, y$1) {
      var defined = constant$2(true),
          context = null,
          curve = curveLinear,
          output = null;

      x$1 = typeof x$1 === "function" ? x$1 : (x$1 === undefined) ? x : constant$2(x$1);
      y$1 = typeof y$1 === "function" ? y$1 : (y$1 === undefined) ? y : constant$2(y$1);

      function line(data) {
        var i,
            n = (data = array$1(data)).length,
            d,
            defined0 = false,
            buffer;

        if (context == null) output = curve(buffer = path());

        for (i = 0; i <= n; ++i) {
          if (!(i < n && defined(d = data[i], i, data)) === defined0) {
            if (defined0 = !defined0) output.lineStart();
            else output.lineEnd();
          }
          if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
        }

        if (buffer) return output = null, buffer + "" || null;
      }

      line.x = function(_) {
        return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant$2(+_), line) : x$1;
      };

      line.y = function(_) {
        return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant$2(+_), line) : y$1;
      };

      line.defined = function(_) {
        return arguments.length ? (defined = typeof _ === "function" ? _ : constant$2(!!_), line) : defined;
      };

      line.curve = function(_) {
        return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
      };

      line.context = function(_) {
        return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
      };

      return line;
    }

    function area(x0, y0, y1) {
      var x1 = null,
          defined = constant$2(true),
          context = null,
          curve = curveLinear,
          output = null;

      x0 = typeof x0 === "function" ? x0 : (x0 === undefined) ? x : constant$2(+x0);
      y0 = typeof y0 === "function" ? y0 : (y0 === undefined) ? constant$2(0) : constant$2(+y0);
      y1 = typeof y1 === "function" ? y1 : (y1 === undefined) ? y : constant$2(+y1);

      function area(data) {
        var i,
            j,
            k,
            n = (data = array$1(data)).length,
            d,
            defined0 = false,
            buffer,
            x0z = new Array(n),
            y0z = new Array(n);

        if (context == null) output = curve(buffer = path());

        for (i = 0; i <= n; ++i) {
          if (!(i < n && defined(d = data[i], i, data)) === defined0) {
            if (defined0 = !defined0) {
              j = i;
              output.areaStart();
              output.lineStart();
            } else {
              output.lineEnd();
              output.lineStart();
              for (k = i - 1; k >= j; --k) {
                output.point(x0z[k], y0z[k]);
              }
              output.lineEnd();
              output.areaEnd();
            }
          }
          if (defined0) {
            x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
            output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
          }
        }

        if (buffer) return output = null, buffer + "" || null;
      }

      function arealine() {
        return line().defined(defined).curve(curve).context(context);
      }

      area.x = function(_) {
        return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$2(+_), x1 = null, area) : x0;
      };

      area.x0 = function(_) {
        return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$2(+_), area) : x0;
      };

      area.x1 = function(_) {
        return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant$2(+_), area) : x1;
      };

      area.y = function(_) {
        return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$2(+_), y1 = null, area) : y0;
      };

      area.y0 = function(_) {
        return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$2(+_), area) : y0;
      };

      area.y1 = function(_) {
        return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant$2(+_), area) : y1;
      };

      area.lineX0 =
      area.lineY0 = function() {
        return arealine().x(x0).y(y0);
      };

      area.lineY1 = function() {
        return arealine().x(x0).y(y1);
      };

      area.lineX1 = function() {
        return arealine().x(x1).y(y0);
      };

      area.defined = function(_) {
        return arguments.length ? (defined = typeof _ === "function" ? _ : constant$2(!!_), area) : defined;
      };

      area.curve = function(_) {
        return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
      };

      area.context = function(_) {
        return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
      };

      return area;
    }

    function sign(x) {
      return x < 0 ? -1 : 1;
    }

    // Calculate the slopes of the tangents (Hermite-type interpolation) based on
    // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
    // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
    // NOV(II), P. 443, 1990.
    function slope3(that, x2, y2) {
      var h0 = that._x1 - that._x0,
          h1 = x2 - that._x1,
          s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
          s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
          p = (s0 * h1 + s1 * h0) / (h0 + h1);
      return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
    }

    // Calculate a one-sided slope.
    function slope2(that, t) {
      var h = that._x1 - that._x0;
      return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
    }

    // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
    // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
    // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
    function point(that, t0, t1) {
      var x0 = that._x0,
          y0 = that._y0,
          x1 = that._x1,
          y1 = that._y1,
          dx = (x1 - x0) / 3;
      that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
    }

    function MonotoneX(context) {
      this._context = context;
    }

    MonotoneX.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 =
        this._y0 = this._y1 =
        this._t0 = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 2: this._context.lineTo(this._x1, this._y1); break;
          case 3: point(this, this._t0, slope2(this, this._t0)); break;
        }
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        var t1 = NaN;

        x = +x, y = +y;
        if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; break;
          case 2: this._point = 3; point(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
          default: point(this, this._t0, t1 = slope3(this, x, y)); break;
        }

        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
        this._t0 = t1;
      }
    };

    (Object.create(MonotoneX.prototype)).point = function(x, y) {
      MonotoneX.prototype.point.call(this, y, x);
    };

    function monotoneX(context) {
      return new MonotoneX(context);
    }

    function count(node) {
      var sum = 0,
          children = node.children,
          i = children && children.length;
      if (!i) sum = 1;
      else while (--i >= 0) sum += children[i].value;
      node.value = sum;
    }

    function node_count() {
      return this.eachAfter(count);
    }

    function node_each(callback, that) {
      let index = -1;
      for (const node of this) {
        callback.call(that, node, ++index, this);
      }
      return this;
    }

    function node_eachBefore(callback, that) {
      var node = this, nodes = [node], children, i, index = -1;
      while (node = nodes.pop()) {
        callback.call(that, node, ++index, this);
        if (children = node.children) {
          for (i = children.length - 1; i >= 0; --i) {
            nodes.push(children[i]);
          }
        }
      }
      return this;
    }

    function node_eachAfter(callback, that) {
      var node = this, nodes = [node], next = [], children, i, n, index = -1;
      while (node = nodes.pop()) {
        next.push(node);
        if (children = node.children) {
          for (i = 0, n = children.length; i < n; ++i) {
            nodes.push(children[i]);
          }
        }
      }
      while (node = next.pop()) {
        callback.call(that, node, ++index, this);
      }
      return this;
    }

    function node_find(callback, that) {
      let index = -1;
      for (const node of this) {
        if (callback.call(that, node, ++index, this)) {
          return node;
        }
      }
    }

    function node_sum(value) {
      return this.eachAfter(function(node) {
        var sum = +value(node.data) || 0,
            children = node.children,
            i = children && children.length;
        while (--i >= 0) sum += children[i].value;
        node.value = sum;
      });
    }

    function node_sort(compare) {
      return this.eachBefore(function(node) {
        if (node.children) {
          node.children.sort(compare);
        }
      });
    }

    function node_path(end) {
      var start = this,
          ancestor = leastCommonAncestor(start, end),
          nodes = [start];
      while (start !== ancestor) {
        start = start.parent;
        nodes.push(start);
      }
      var k = nodes.length;
      while (end !== ancestor) {
        nodes.splice(k, 0, end);
        end = end.parent;
      }
      return nodes;
    }

    function leastCommonAncestor(a, b) {
      if (a === b) return a;
      var aNodes = a.ancestors(),
          bNodes = b.ancestors(),
          c = null;
      a = aNodes.pop();
      b = bNodes.pop();
      while (a === b) {
        c = a;
        a = aNodes.pop();
        b = bNodes.pop();
      }
      return c;
    }

    function node_ancestors() {
      var node = this, nodes = [node];
      while (node = node.parent) {
        nodes.push(node);
      }
      return nodes;
    }

    function node_descendants() {
      return Array.from(this);
    }

    function node_leaves() {
      var leaves = [];
      this.eachBefore(function(node) {
        if (!node.children) {
          leaves.push(node);
        }
      });
      return leaves;
    }

    function node_links() {
      var root = this, links = [];
      root.each(function(node) {
        if (node !== root) { // Don’t include the root’s parent, if any.
          links.push({source: node.parent, target: node});
        }
      });
      return links;
    }

    function* node_iterator() {
      var node = this, current, next = [node], children, i, n;
      do {
        current = next.reverse(), next = [];
        while (node = current.pop()) {
          yield node;
          if (children = node.children) {
            for (i = 0, n = children.length; i < n; ++i) {
              next.push(children[i]);
            }
          }
        }
      } while (next.length);
    }

    function hierarchy(data, children) {
      if (data instanceof Map) {
        data = [undefined, data];
        if (children === undefined) children = mapChildren;
      } else if (children === undefined) {
        children = objectChildren;
      }

      var root = new Node(data),
          node,
          nodes = [root],
          child,
          childs,
          i,
          n;

      while (node = nodes.pop()) {
        if ((childs = children(node.data)) && (n = (childs = Array.from(childs)).length)) {
          node.children = childs;
          for (i = n - 1; i >= 0; --i) {
            nodes.push(child = childs[i] = new Node(childs[i]));
            child.parent = node;
            child.depth = node.depth + 1;
          }
        }
      }

      return root.eachBefore(computeHeight);
    }

    function node_copy() {
      return hierarchy(this).eachBefore(copyData);
    }

    function objectChildren(d) {
      return d.children;
    }

    function mapChildren(d) {
      return Array.isArray(d) ? d[1] : null;
    }

    function copyData(node) {
      if (node.data.value !== undefined) node.value = node.data.value;
      node.data = node.data.data;
    }

    function computeHeight(node) {
      var height = 0;
      do node.height = height;
      while ((node = node.parent) && (node.height < ++height));
    }

    function Node(data) {
      this.data = data;
      this.depth =
      this.height = 0;
      this.parent = null;
    }

    Node.prototype = hierarchy.prototype = {
      constructor: Node,
      count: node_count,
      each: node_each,
      eachAfter: node_eachAfter,
      eachBefore: node_eachBefore,
      find: node_find,
      sum: node_sum,
      sort: node_sort,
      path: node_path,
      ancestors: node_ancestors,
      descendants: node_descendants,
      leaves: node_leaves,
      links: node_links,
      copy: node_copy,
      [Symbol.iterator]: node_iterator
    };

    function required(f) {
      if (typeof f !== "function") throw new Error;
      return f;
    }

    function constantZero() {
      return 0;
    }

    function constant$1(x) {
      return function() {
        return x;
      };
    }

    function roundNode(node) {
      node.x0 = Math.round(node.x0);
      node.y0 = Math.round(node.y0);
      node.x1 = Math.round(node.x1);
      node.y1 = Math.round(node.y1);
    }

    function treemapDice(parent, x0, y0, x1, y1) {
      var nodes = parent.children,
          node,
          i = -1,
          n = nodes.length,
          k = parent.value && (x1 - x0) / parent.value;

      while (++i < n) {
        node = nodes[i], node.y0 = y0, node.y1 = y1;
        node.x0 = x0, node.x1 = x0 += node.value * k;
      }
    }

    function treemapSlice(parent, x0, y0, x1, y1) {
      var nodes = parent.children,
          node,
          i = -1,
          n = nodes.length,
          k = parent.value && (y1 - y0) / parent.value;

      while (++i < n) {
        node = nodes[i], node.x0 = x0, node.x1 = x1;
        node.y0 = y0, node.y1 = y0 += node.value * k;
      }
    }

    var phi = (1 + Math.sqrt(5)) / 2;

    function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
      var rows = [],
          nodes = parent.children,
          row,
          nodeValue,
          i0 = 0,
          i1 = 0,
          n = nodes.length,
          dx, dy,
          value = parent.value,
          sumValue,
          minValue,
          maxValue,
          newRatio,
          minRatio,
          alpha,
          beta;

      while (i0 < n) {
        dx = x1 - x0, dy = y1 - y0;

        // Find the next non-empty node.
        do sumValue = nodes[i1++].value; while (!sumValue && i1 < n);
        minValue = maxValue = sumValue;
        alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
        beta = sumValue * sumValue * alpha;
        minRatio = Math.max(maxValue / beta, beta / minValue);

        // Keep adding nodes while the aspect ratio maintains or improves.
        for (; i1 < n; ++i1) {
          sumValue += nodeValue = nodes[i1].value;
          if (nodeValue < minValue) minValue = nodeValue;
          if (nodeValue > maxValue) maxValue = nodeValue;
          beta = sumValue * sumValue * alpha;
          newRatio = Math.max(maxValue / beta, beta / minValue);
          if (newRatio > minRatio) { sumValue -= nodeValue; break; }
          minRatio = newRatio;
        }

        // Position and record the row orientation.
        rows.push(row = {value: sumValue, dice: dx < dy, children: nodes.slice(i0, i1)});
        if (row.dice) treemapDice(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);
        else treemapSlice(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
        value -= sumValue, i0 = i1;
      }

      return rows;
    }

    var squarify = (function custom(ratio) {

      function squarify(parent, x0, y0, x1, y1) {
        squarifyRatio(ratio, parent, x0, y0, x1, y1);
      }

      squarify.ratio = function(x) {
        return custom((x = +x) > 1 ? x : 1);
      };

      return squarify;
    })(phi);

    function index() {
      var tile = squarify,
          round = false,
          dx = 1,
          dy = 1,
          paddingStack = [0],
          paddingInner = constantZero,
          paddingTop = constantZero,
          paddingRight = constantZero,
          paddingBottom = constantZero,
          paddingLeft = constantZero;

      function treemap(root) {
        root.x0 =
        root.y0 = 0;
        root.x1 = dx;
        root.y1 = dy;
        root.eachBefore(positionNode);
        paddingStack = [0];
        if (round) root.eachBefore(roundNode);
        return root;
      }

      function positionNode(node) {
        var p = paddingStack[node.depth],
            x0 = node.x0 + p,
            y0 = node.y0 + p,
            x1 = node.x1 - p,
            y1 = node.y1 - p;
        if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
        if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
        node.x0 = x0;
        node.y0 = y0;
        node.x1 = x1;
        node.y1 = y1;
        if (node.children) {
          p = paddingStack[node.depth + 1] = paddingInner(node) / 2;
          x0 += paddingLeft(node) - p;
          y0 += paddingTop(node) - p;
          x1 -= paddingRight(node) - p;
          y1 -= paddingBottom(node) - p;
          if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
          if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
          tile(node, x0, y0, x1, y1);
        }
      }

      treemap.round = function(x) {
        return arguments.length ? (round = !!x, treemap) : round;
      };

      treemap.size = function(x) {
        return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
      };

      treemap.tile = function(x) {
        return arguments.length ? (tile = required(x), treemap) : tile;
      };

      treemap.padding = function(x) {
        return arguments.length ? treemap.paddingInner(x).paddingOuter(x) : treemap.paddingInner();
      };

      treemap.paddingInner = function(x) {
        return arguments.length ? (paddingInner = typeof x === "function" ? x : constant$1(+x), treemap) : paddingInner;
      };

      treemap.paddingOuter = function(x) {
        return arguments.length ? treemap.paddingTop(x).paddingRight(x).paddingBottom(x).paddingLeft(x) : treemap.paddingTop();
      };

      treemap.paddingTop = function(x) {
        return arguments.length ? (paddingTop = typeof x === "function" ? x : constant$1(+x), treemap) : paddingTop;
      };

      treemap.paddingRight = function(x) {
        return arguments.length ? (paddingRight = typeof x === "function" ? x : constant$1(+x), treemap) : paddingRight;
      };

      treemap.paddingBottom = function(x) {
        return arguments.length ? (paddingBottom = typeof x === "function" ? x : constant$1(+x), treemap) : paddingBottom;
      };

      treemap.paddingLeft = function(x) {
        return arguments.length ? (paddingLeft = typeof x === "function" ? x : constant$1(+x), treemap) : paddingLeft;
      };

      return treemap;
    }

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace(name) {
      var prefix = name += "", i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
    }

    function creatorInherit(name) {
      return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml && document.documentElement.namespaceURI === xhtml
            ? document.createElement(name)
            : document.createElementNS(uri, name);
      };
    }

    function creatorFixed(fullname) {
      return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator(name) {
      var fullname = namespace(name);
      return (fullname.local
          ? creatorFixed
          : creatorInherit)(fullname);
    }

    function none() {}

    function selector(selector) {
      return selector == null ? none : function() {
        return this.querySelector(selector);
      };
    }

    function selection_select(select) {
      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection$1(subgroups, this._parents);
    }

    // Given something array like (or null), returns something that is strictly an
    // array. This is used to ensure that array-like objects passed to d3.selectAll
    // or selection.selectAll are converted into proper arrays when creating a
    // selection; we don’t ever want to create a selection backed by a live
    // HTMLCollection or NodeList. However, note that selection.selectAll will use a
    // static NodeList as a group, since it safely derived from querySelectorAll.
    function array(x) {
      return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
    }

    function empty() {
      return [];
    }

    function selectorAll(selector) {
      return selector == null ? empty : function() {
        return this.querySelectorAll(selector);
      };
    }

    function arrayAll(select) {
      return function() {
        return array(select.apply(this, arguments));
      };
    }

    function selection_selectAll(select) {
      if (typeof select === "function") select = arrayAll(select);
      else select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection$1(subgroups, parents);
    }

    function matcher(selector) {
      return function() {
        return this.matches(selector);
      };
    }

    function childMatcher(selector) {
      return function(node) {
        return node.matches(selector);
      };
    }

    var find = Array.prototype.find;

    function childFind(match) {
      return function() {
        return find.call(this.children, match);
      };
    }

    function childFirst() {
      return this.firstElementChild;
    }

    function selection_selectChild(match) {
      return this.select(match == null ? childFirst
          : childFind(typeof match === "function" ? match : childMatcher(match)));
    }

    var filter = Array.prototype.filter;

    function children() {
      return Array.from(this.children);
    }

    function childrenFilter(match) {
      return function() {
        return filter.call(this.children, match);
      };
    }

    function selection_selectChildren(match) {
      return this.selectAll(match == null ? children
          : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
    }

    function selection_filter(match) {
      if (typeof match !== "function") match = matcher(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection$1(subgroups, this._parents);
    }

    function sparse(update) {
      return new Array(update.length);
    }

    function selection_enter() {
      return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      constructor: EnterNode,
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
      querySelector: function(selector) { return this._parent.querySelector(selector); },
      querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant(x) {
      return function() {
        return x;
      };
    }

    function bindIndex(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = new Map,
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
          if (nodeByKeyValue.has(keyValue)) {
            exit[i] = node;
          } else {
            nodeByKeyValue.set(keyValue, node);
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = key.call(parent, data[i], i, data) + "";
        if (node = nodeByKeyValue.get(keyValue)) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue.delete(keyValue);
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
          exit[i] = node;
        }
      }
    }

    function datum(node) {
      return node.__data__;
    }

    function selection_data(value, key) {
      if (!arguments.length) return Array.from(this, datum);

      var bind = key ? bindKey : bindIndex,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection$1(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    // Given some data, this returns an array-like view of it: an object that
    // exposes a length property and allows numeric indexing. Note that unlike
    // selectAll, this isn’t worried about “live” collections because the resulting
    // array will only be used briefly while data is being bound. (It is possible to
    // cause the data to change while iterating by using a key function, but please
    // don’t; we’d rather avoid a gratuitous copy.)
    function arraylike(data) {
      return typeof data === "object" && "length" in data
        ? data // Array, TypedArray, NodeList, array-like
        : Array.from(data); // Map, Set, iterable, string, or anything else
    }

    function selection_exit() {
      return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_join(onenter, onupdate, onexit) {
      var enter = this.enter(), update = this, exit = this.exit();
      if (typeof onenter === "function") {
        enter = onenter(enter);
        if (enter) enter = enter.selection();
      } else {
        enter = enter.append(onenter + "");
      }
      if (onupdate != null) {
        update = onupdate(update);
        if (update) update = update.selection();
      }
      if (onexit == null) exit.remove(); else onexit(exit);
      return enter && update ? enter.merge(update).order() : update;
    }

    function selection_merge(context) {
      var selection = context.selection ? context.selection() : context;

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection$1(merges, this._parents);
    }

    function selection_order() {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort(compare) {
      if (!compare) compare = ascending;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection$1(sortgroups, this._parents).order();
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call() {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes() {
      return Array.from(this);
    }

    function selection_node() {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size() {
      let size = 0;
      for (const node of this) ++size; // eslint-disable-line no-unused-vars
      return size;
    }

    function selection_empty() {
      return !this.node();
    }

    function selection_each(callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove$1(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS$1(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant$1(name, value) {
      return function() {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS$1(fullname, value) {
      return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction$1(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS$1(fullname, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr(name, value) {
      var fullname = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local
            ? node.getAttributeNS(fullname.space, fullname.local)
            : node.getAttribute(fullname);
      }

      return this.each((value == null
          ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
          ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
          : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
    }

    function defaultView(node) {
      return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView; // node is a Document
    }

    function styleRemove$1(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant$1(name, value, priority) {
      return function() {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction$1(name, value, priority) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style(name, value, priority) {
      return arguments.length > 1
          ? this.each((value == null
                ? styleRemove$1 : typeof value === "function"
                ? styleFunction$1
                : styleConstant$1)(name, value, priority == null ? "" : priority))
          : styleValue(this.node(), name);
    }

    function styleValue(node, name) {
      return node.style.getPropertyValue(name)
          || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove(name) {
      return function() {
        delete this[name];
      };
    }

    function propertyConstant(name, value) {
      return function() {
        this[name] = value;
      };
    }

    function propertyFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
      };
    }

    function selection_property(name, value) {
      return arguments.length > 1
          ? this.each((value == null
              ? propertyRemove : typeof value === "function"
              ? propertyFunction
              : propertyConstant)(name, value))
          : this.node()[name];
    }

    function classArray(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList(node) {
      return node.classList || new ClassList(node);
    }

    function ClassList(node) {
      this._node = node;
      this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
      add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
      return function() {
        classedAdd(this, names);
      };
    }

    function classedFalse(names) {
      return function() {
        classedRemove(this, names);
      };
    }

    function classedFunction(names, value) {
      return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
      };
    }

    function selection_classed(name, value) {
      var names = classArray(name + "");

      if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function"
          ? classedFunction : value
          ? classedTrue
          : classedFalse)(names, value));
    }

    function textRemove() {
      this.textContent = "";
    }

    function textConstant$1(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction$1(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text(value) {
      return arguments.length
          ? this.each(value == null
              ? textRemove : (typeof value === "function"
              ? textFunction$1
              : textConstant$1)(value))
          : this.node().textContent;
    }

    function htmlRemove() {
      this.innerHTML = "";
    }

    function htmlConstant(value) {
      return function() {
        this.innerHTML = value;
      };
    }

    function htmlFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html(value) {
      return arguments.length
          ? this.each(value == null
              ? htmlRemove : (typeof value === "function"
              ? htmlFunction
              : htmlConstant)(value))
          : this.node().innerHTML;
    }

    function raise() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise() {
      return this.each(raise);
    }

    function lower() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower() {
      return this.each(lower);
    }

    function selection_append(name) {
      var create = typeof name === "function" ? name : creator(name);
      return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull() {
      return null;
    }

    function selection_insert(name, before) {
      var create = typeof name === "function" ? name : creator(name),
          select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
      return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove() {
      return this.each(remove);
    }

    function selection_cloneShallow() {
      var clone = this.cloneNode(false), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_cloneDeep() {
      var clone = this.cloneNode(true), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_clone(deep) {
      return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
    }

    function selection_datum(value) {
      return arguments.length
          ? this.property("__data__", value)
          : this.node().__data__;
    }

    function contextListener(listener) {
      return function(event) {
        listener.call(this, event, this.__data__);
      };
    }

    function parseTypenames$1(typenames) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {type: t, name: name};
      });
    }

    function onRemove(typename) {
      return function() {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;
        else delete this.__on;
      };
    }

    function onAdd(typename, value, options) {
      return function() {
        var on = this.__on, o, listener = contextListener(value);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
            this.addEventListener(o.type, o.listener = listener, o.options = options);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, options);
        o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
        if (!on) this.__on = [o];
        else on.push(o);
      };
    }

    function selection_on(typename, value, options) {
      var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd : onRemove;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
      return this;
    }

    function dispatchEvent(node, type, params) {
      var window = defaultView(node),
          event = window.CustomEvent;

      if (typeof event === "function") {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
      return function() {
        return dispatchEvent(this, type, params);
      };
    }

    function dispatchFunction(type, params) {
      return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch(type, params) {
      return this.each((typeof params === "function"
          ? dispatchFunction
          : dispatchConstant)(type, params));
    }

    function* selection_iterator() {
      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) yield node;
        }
      }
    }

    var root = [null];

    function Selection$1(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection() {
      return new Selection$1([[document.documentElement]], root);
    }

    function selection_selection() {
      return this;
    }

    Selection$1.prototype = selection.prototype = {
      constructor: Selection$1,
      select: selection_select,
      selectAll: selection_selectAll,
      selectChild: selection_selectChild,
      selectChildren: selection_selectChildren,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      join: selection_join,
      merge: selection_merge,
      selection: selection_selection,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      classed: selection_classed,
      text: selection_text,
      html: selection_html,
      raise: selection_raise,
      lower: selection_lower,
      append: selection_append,
      insert: selection_insert,
      remove: selection_remove,
      clone: selection_clone,
      datum: selection_datum,
      on: selection_on,
      dispatch: selection_dispatch,
      [Symbol.iterator]: selection_iterator
    };

    function select(selector) {
      return typeof selector === "string"
          ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
          : new Selection$1([[selector]], root);
    }

    var noop = {value: () => {}};

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get$1(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set$1(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    var frame = 0, // is an animation frame pending?
        timeout$1 = 0, // is a timeout pending?
        interval = 0, // are any timers active?
        pokeDelay = 1000, // how frequently we check for clock skew
        taskHead,
        taskTail,
        clockLast = 0,
        clockNow = 0,
        clockSkew = 0,
        clock = typeof performance === "object" && performance.now ? performance : Date,
        setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

    function now() {
      return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
    }

    function clearNow() {
      clockNow = 0;
    }

    function Timer() {
      this._call =
      this._time =
      this._next = null;
    }

    Timer.prototype = timer.prototype = {
      constructor: Timer,
      restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
          if (taskTail) taskTail._next = this;
          else taskHead = this;
          taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
      },
      stop: function() {
        if (this._call) {
          this._call = null;
          this._time = Infinity;
          sleep();
        }
      }
    };

    function timer(callback, delay, time) {
      var t = new Timer;
      t.restart(callback, delay, time);
      return t;
    }

    function timerFlush() {
      now(); // Get the current time, if not already set.
      ++frame; // Pretend we’ve set an alarm, if we haven’t already.
      var t = taskHead, e;
      while (t) {
        if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
        t = t._next;
      }
      --frame;
    }

    function wake() {
      clockNow = (clockLast = clock.now()) + clockSkew;
      frame = timeout$1 = 0;
      try {
        timerFlush();
      } finally {
        frame = 0;
        nap();
        clockNow = 0;
      }
    }

    function poke() {
      var now = clock.now(), delay = now - clockLast;
      if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
    }

    function nap() {
      var t0, t1 = taskHead, t2, time = Infinity;
      while (t1) {
        if (t1._call) {
          if (time > t1._time) time = t1._time;
          t0 = t1, t1 = t1._next;
        } else {
          t2 = t1._next, t1._next = null;
          t1 = t0 ? t0._next = t2 : taskHead = t2;
        }
      }
      taskTail = t0;
      sleep(time);
    }

    function sleep(time) {
      if (frame) return; // Soonest alarm already set, or will be.
      if (timeout$1) timeout$1 = clearTimeout(timeout$1);
      var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
      if (delay > 24) {
        if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
        if (interval) interval = clearInterval(interval);
      } else {
        if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
      }
    }

    function timeout(callback, delay, time) {
      var t = new Timer;
      delay = delay == null ? 0 : +delay;
      t.restart(elapsed => {
        t.stop();
        callback(elapsed + delay);
      }, delay, time);
      return t;
    }

    var emptyOn = dispatch("start", "end", "cancel", "interrupt");
    var emptyTween = [];

    var CREATED = 0;
    var SCHEDULED = 1;
    var STARTING = 2;
    var STARTED = 3;
    var RUNNING = 4;
    var ENDING = 5;
    var ENDED = 6;

    function schedule(node, name, id, index, group, timing) {
      var schedules = node.__transition;
      if (!schedules) node.__transition = {};
      else if (id in schedules) return;
      create(node, id, {
        name: name,
        index: index, // For context during callback.
        group: group, // For context during callback.
        on: emptyOn,
        tween: emptyTween,
        time: timing.time,
        delay: timing.delay,
        duration: timing.duration,
        ease: timing.ease,
        timer: null,
        state: CREATED
      });
    }

    function init(node, id) {
      var schedule = get(node, id);
      if (schedule.state > CREATED) throw new Error("too late; already scheduled");
      return schedule;
    }

    function set(node, id) {
      var schedule = get(node, id);
      if (schedule.state > STARTED) throw new Error("too late; already running");
      return schedule;
    }

    function get(node, id) {
      var schedule = node.__transition;
      if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
      return schedule;
    }

    function create(node, id, self) {
      var schedules = node.__transition,
          tween;

      // Initialize the self timer when the transition is created.
      // Note the actual delay is not known until the first callback!
      schedules[id] = self;
      self.timer = timer(schedule, 0, self.time);

      function schedule(elapsed) {
        self.state = SCHEDULED;
        self.timer.restart(start, self.delay, self.time);

        // If the elapsed delay is less than our first sleep, start immediately.
        if (self.delay <= elapsed) start(elapsed - self.delay);
      }

      function start(elapsed) {
        var i, j, n, o;

        // If the state is not SCHEDULED, then we previously errored on start.
        if (self.state !== SCHEDULED) return stop();

        for (i in schedules) {
          o = schedules[i];
          if (o.name !== self.name) continue;

          // While this element already has a starting transition during this frame,
          // defer starting an interrupting transition until that transition has a
          // chance to tick (and possibly end); see d3/d3-transition#54!
          if (o.state === STARTED) return timeout(start);

          // Interrupt the active transition, if any.
          if (o.state === RUNNING) {
            o.state = ENDED;
            o.timer.stop();
            o.on.call("interrupt", node, node.__data__, o.index, o.group);
            delete schedules[i];
          }

          // Cancel any pre-empted transitions.
          else if (+i < id) {
            o.state = ENDED;
            o.timer.stop();
            o.on.call("cancel", node, node.__data__, o.index, o.group);
            delete schedules[i];
          }
        }

        // Defer the first tick to end of the current frame; see d3/d3#1576.
        // Note the transition may be canceled after start and before the first tick!
        // Note this must be scheduled before the start event; see d3/d3-transition#16!
        // Assuming this is successful, subsequent callbacks go straight to tick.
        timeout(function() {
          if (self.state === STARTED) {
            self.state = RUNNING;
            self.timer.restart(tick, self.delay, self.time);
            tick(elapsed);
          }
        });

        // Dispatch the start event.
        // Note this must be done before the tween are initialized.
        self.state = STARTING;
        self.on.call("start", node, node.__data__, self.index, self.group);
        if (self.state !== STARTING) return; // interrupted
        self.state = STARTED;

        // Initialize the tween, deleting null tween.
        tween = new Array(n = self.tween.length);
        for (i = 0, j = -1; i < n; ++i) {
          if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
            tween[++j] = o;
          }
        }
        tween.length = j + 1;
      }

      function tick(elapsed) {
        var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
            i = -1,
            n = tween.length;

        while (++i < n) {
          tween[i].call(node, t);
        }

        // Dispatch the end event.
        if (self.state === ENDING) {
          self.on.call("end", node, node.__data__, self.index, self.group);
          stop();
        }
      }

      function stop() {
        self.state = ENDED;
        self.timer.stop();
        delete schedules[id];
        for (var i in schedules) return; // eslint-disable-line no-unused-vars
        delete node.__transition;
      }
    }

    function interrupt(node, name) {
      var schedules = node.__transition,
          schedule,
          active,
          empty = true,
          i;

      if (!schedules) return;

      name = name == null ? null : name + "";

      for (i in schedules) {
        if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
        active = schedule.state > STARTING && schedule.state < ENDING;
        schedule.state = ENDED;
        schedule.timer.stop();
        schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
        delete schedules[i];
      }

      if (empty) delete node.__transition;
    }

    function selection_interrupt(name) {
      return this.each(function() {
        interrupt(this, name);
      });
    }

    function tweenRemove(id, name) {
      var tween0, tween1;
      return function() {
        var schedule = set(this, id),
            tween = schedule.tween;

        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
          tween1 = tween0 = tween;
          for (var i = 0, n = tween1.length; i < n; ++i) {
            if (tween1[i].name === name) {
              tween1 = tween1.slice();
              tween1.splice(i, 1);
              break;
            }
          }
        }

        schedule.tween = tween1;
      };
    }

    function tweenFunction(id, name, value) {
      var tween0, tween1;
      if (typeof value !== "function") throw new Error;
      return function() {
        var schedule = set(this, id),
            tween = schedule.tween;

        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
          tween1 = (tween0 = tween).slice();
          for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
            if (tween1[i].name === name) {
              tween1[i] = t;
              break;
            }
          }
          if (i === n) tween1.push(t);
        }

        schedule.tween = tween1;
      };
    }

    function transition_tween(name, value) {
      var id = this._id;

      name += "";

      if (arguments.length < 2) {
        var tween = get(this.node(), id).tween;
        for (var i = 0, n = tween.length, t; i < n; ++i) {
          if ((t = tween[i]).name === name) {
            return t.value;
          }
        }
        return null;
      }

      return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
    }

    function tweenValue(transition, name, value) {
      var id = transition._id;

      transition.each(function() {
        var schedule = set(this, id);
        (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
      });

      return function(node) {
        return get(node, id).value[name];
      };
    }

    function interpolate(a, b) {
      var c;
      return (typeof b === "number" ? interpolateNumber
          : b instanceof color ? interpolateRgb
          : (c = color(b)) ? (b = c, interpolateRgb)
          : interpolateString)(a, b);
    }

    function attrRemove(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant(name, interpolate, value1) {
      var string00,
          string1 = value1 + "",
          interpolate0;
      return function() {
        var string0 = this.getAttribute(name);
        return string0 === string1 ? null
            : string0 === string00 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, value1);
      };
    }

    function attrConstantNS(fullname, interpolate, value1) {
      var string00,
          string1 = value1 + "",
          interpolate0;
      return function() {
        var string0 = this.getAttributeNS(fullname.space, fullname.local);
        return string0 === string1 ? null
            : string0 === string00 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, value1);
      };
    }

    function attrFunction(name, interpolate, value) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttribute(name);
        string0 = this.getAttribute(name);
        string1 = value1 + "";
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
      };
    }

    function attrFunctionNS(fullname, interpolate, value) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
        string0 = this.getAttributeNS(fullname.space, fullname.local);
        string1 = value1 + "";
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
      };
    }

    function transition_attr(name, value) {
      var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
      return this.attrTween(name, typeof value === "function"
          ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
          : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
          : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
    }

    function attrInterpolate(name, i) {
      return function(t) {
        this.setAttribute(name, i.call(this, t));
      };
    }

    function attrInterpolateNS(fullname, i) {
      return function(t) {
        this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
      };
    }

    function attrTweenNS(fullname, value) {
      var t0, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
        return t0;
      }
      tween._value = value;
      return tween;
    }

    function attrTween(name, value) {
      var t0, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
        return t0;
      }
      tween._value = value;
      return tween;
    }

    function transition_attrTween(name, value) {
      var key = "attr." + name;
      if (arguments.length < 2) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      var fullname = namespace(name);
      return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
    }

    function delayFunction(id, value) {
      return function() {
        init(this, id).delay = +value.apply(this, arguments);
      };
    }

    function delayConstant(id, value) {
      return value = +value, function() {
        init(this, id).delay = value;
      };
    }

    function transition_delay(value) {
      var id = this._id;

      return arguments.length
          ? this.each((typeof value === "function"
              ? delayFunction
              : delayConstant)(id, value))
          : get(this.node(), id).delay;
    }

    function durationFunction(id, value) {
      return function() {
        set(this, id).duration = +value.apply(this, arguments);
      };
    }

    function durationConstant(id, value) {
      return value = +value, function() {
        set(this, id).duration = value;
      };
    }

    function transition_duration(value) {
      var id = this._id;

      return arguments.length
          ? this.each((typeof value === "function"
              ? durationFunction
              : durationConstant)(id, value))
          : get(this.node(), id).duration;
    }

    function easeConstant(id, value) {
      if (typeof value !== "function") throw new Error;
      return function() {
        set(this, id).ease = value;
      };
    }

    function transition_ease(value) {
      var id = this._id;

      return arguments.length
          ? this.each(easeConstant(id, value))
          : get(this.node(), id).ease;
    }

    function easeVarying(id, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (typeof v !== "function") throw new Error;
        set(this, id).ease = v;
      };
    }

    function transition_easeVarying(value) {
      if (typeof value !== "function") throw new Error;
      return this.each(easeVarying(this._id, value));
    }

    function transition_filter(match) {
      if (typeof match !== "function") match = matcher(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Transition(subgroups, this._parents, this._name, this._id);
    }

    function transition_merge(transition) {
      if (transition._id !== this._id) throw new Error;

      for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Transition(merges, this._parents, this._name, this._id);
    }

    function start(name) {
      return (name + "").trim().split(/^|\s+/).every(function(t) {
        var i = t.indexOf(".");
        if (i >= 0) t = t.slice(0, i);
        return !t || t === "start";
      });
    }

    function onFunction(id, name, listener) {
      var on0, on1, sit = start(name) ? init : set;
      return function() {
        var schedule = sit(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

        schedule.on = on1;
      };
    }

    function transition_on(name, listener) {
      var id = this._id;

      return arguments.length < 2
          ? get(this.node(), id).on.on(name)
          : this.each(onFunction(id, name, listener));
    }

    function removeFunction(id) {
      return function() {
        var parent = this.parentNode;
        for (var i in this.__transition) if (+i !== id) return;
        if (parent) parent.removeChild(this);
      };
    }

    function transition_remove() {
      return this.on("end.remove", removeFunction(this._id));
    }

    function transition_select(select) {
      var name = this._name,
          id = this._id;

      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
            schedule(subgroup[i], name, id, i, subgroup, get(node, id));
          }
        }
      }

      return new Transition(subgroups, this._parents, name, id);
    }

    function transition_selectAll(select) {
      var name = this._name,
          id = this._id;

      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
              if (child = children[k]) {
                schedule(child, name, id, k, children, inherit);
              }
            }
            subgroups.push(children);
            parents.push(node);
          }
        }
      }

      return new Transition(subgroups, parents, name, id);
    }

    var Selection = selection.prototype.constructor;

    function transition_selection() {
      return new Selection(this._groups, this._parents);
    }

    function styleNull(name, interpolate) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0 = styleValue(this, name),
            string1 = (this.style.removeProperty(name), styleValue(this, name));
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, string10 = string1);
      };
    }

    function styleRemove(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant(name, interpolate, value1) {
      var string00,
          string1 = value1 + "",
          interpolate0;
      return function() {
        var string0 = styleValue(this, name);
        return string0 === string1 ? null
            : string0 === string00 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, value1);
      };
    }

    function styleFunction(name, interpolate, value) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0 = styleValue(this, name),
            value1 = value(this),
            string1 = value1 + "";
        if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
      };
    }

    function styleMaybeRemove(id, name) {
      var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
      return function() {
        var schedule = set(this, id),
            on = schedule.on,
            listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

        schedule.on = on1;
      };
    }

    function transition_style(name, value, priority) {
      var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
      return value == null ? this
          .styleTween(name, styleNull(name, i))
          .on("end.style." + name, styleRemove(name))
        : typeof value === "function" ? this
          .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
          .each(styleMaybeRemove(this._id, name))
        : this
          .styleTween(name, styleConstant(name, i, value), priority)
          .on("end.style." + name, null);
    }

    function styleInterpolate(name, i, priority) {
      return function(t) {
        this.style.setProperty(name, i.call(this, t), priority);
      };
    }

    function styleTween(name, value, priority) {
      var t, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
        return t;
      }
      tween._value = value;
      return tween;
    }

    function transition_styleTween(name, value, priority) {
      var key = "style." + (name += "");
      if (arguments.length < 2) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
    }

    function textConstant(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction(value) {
      return function() {
        var value1 = value(this);
        this.textContent = value1 == null ? "" : value1;
      };
    }

    function transition_text(value) {
      return this.tween("text", typeof value === "function"
          ? textFunction(tweenValue(this, "text", value))
          : textConstant(value == null ? "" : value + ""));
    }

    function textInterpolate(i) {
      return function(t) {
        this.textContent = i.call(this, t);
      };
    }

    function textTween(value) {
      var t0, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
        return t0;
      }
      tween._value = value;
      return tween;
    }

    function transition_textTween(value) {
      var key = "text";
      if (arguments.length < 1) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      return this.tween(key, textTween(value));
    }

    function transition_transition() {
      var name = this._name,
          id0 = this._id,
          id1 = newId();

      for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            var inherit = get(node, id0);
            schedule(node, name, id1, i, group, {
              time: inherit.time + inherit.delay + inherit.duration,
              delay: 0,
              duration: inherit.duration,
              ease: inherit.ease
            });
          }
        }
      }

      return new Transition(groups, this._parents, name, id1);
    }

    function transition_end() {
      var on0, on1, that = this, id = that._id, size = that.size();
      return new Promise(function(resolve, reject) {
        var cancel = {value: reject},
            end = {value: function() { if (--size === 0) resolve(); }};

        that.each(function() {
          var schedule = set(this, id),
              on = schedule.on;

          // If this node shared a dispatch with the previous node,
          // just assign the updated shared dispatch and we’re done!
          // Otherwise, copy-on-write.
          if (on !== on0) {
            on1 = (on0 = on).copy();
            on1._.cancel.push(cancel);
            on1._.interrupt.push(cancel);
            on1._.end.push(end);
          }

          schedule.on = on1;
        });

        // The selection was empty, resolve end immediately
        if (size === 0) resolve();
      });
    }

    var id = 0;

    function Transition(groups, parents, name, id) {
      this._groups = groups;
      this._parents = parents;
      this._name = name;
      this._id = id;
    }

    function newId() {
      return ++id;
    }

    var selection_prototype = selection.prototype;

    Transition.prototype = {
      constructor: Transition,
      select: transition_select,
      selectAll: transition_selectAll,
      selectChild: selection_prototype.selectChild,
      selectChildren: selection_prototype.selectChildren,
      filter: transition_filter,
      merge: transition_merge,
      selection: transition_selection,
      transition: transition_transition,
      call: selection_prototype.call,
      nodes: selection_prototype.nodes,
      node: selection_prototype.node,
      size: selection_prototype.size,
      empty: selection_prototype.empty,
      each: selection_prototype.each,
      on: transition_on,
      attr: transition_attr,
      attrTween: transition_attrTween,
      style: transition_style,
      styleTween: transition_styleTween,
      text: transition_text,
      textTween: transition_textTween,
      remove: transition_remove,
      tween: transition_tween,
      delay: transition_delay,
      duration: transition_duration,
      ease: transition_ease,
      easeVarying: transition_easeVarying,
      end: transition_end,
      [Symbol.iterator]: selection_prototype[Symbol.iterator]
    };

    function cubicInOut$1(t) {
      return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
    }

    var defaultTiming = {
      time: null, // Set on use.
      delay: 0,
      duration: 250,
      ease: cubicInOut$1
    };

    function inherit(node, id) {
      var timing;
      while (!(timing = node.__transition) || !(timing = timing[id])) {
        if (!(node = node.parentNode)) {
          throw new Error(`transition ${id} not found`);
        }
      }
      return timing;
    }

    function selection_transition(name) {
      var id,
          timing;

      if (name instanceof Transition) {
        id = name._id, name = name._name;
      } else {
        id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
      }

      for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            schedule(node, name, id, i, group, timing || inherit(node, id));
          }
        }
      }

      return new Transition(groups, this._parents, name, id);
    }

    selection.prototype.interrupt = selection_interrupt;
    selection.prototype.transition = selection_transition;

    var d3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        scaleSqrt: sqrt,
        scaleLinear: linear,
        scaleOrdinal: ordinal,
        line: line,
        area: area,
        curveMonotoneX: monotoneX,
        extent: extent,
        max: max,
        min: min,
        get timeParse () { return timeParse; },
        hierarchy: hierarchy,
        treemap: index,
        select: select
    });

    function throttle(fn, wait) {
        let isCalled = false;
        return function (...args) {
            if (!isCalled) {
                fn(...args);
                isCalled = true;
                setTimeout(function () {
                    isCalled = false;
                }, wait);
            }
        };
    }
    function trailingDebounce(fn, delay) {
        let timeout;
        const _fn = function () {
            if (timeout)
                window.clearTimeout(timeout);
            timeout = window.setTimeout(fn, delay);
        };
        _fn.cancel = () => window.clearTimeout(timeout);
        return _fn;
    }
    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
    function createLookup(arr, keyFn, valFn) {
        const lookup = {};
        arr.forEach(d => {
            const key = keyFn(d);
            lookup[key] = valFn(d);
        });
        return lookup;
    }
    const strToId = (str) => {
        return str
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    };

    /* src/components/maps/Annotation.svelte generated by Svelte v3.42.3 */

    const { Error: Error_1 } = globals;
    const file$m = "src/components/maps/Annotation.svelte";

    // (128:0) {:else}
    function create_else_block$4(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "text svelte-1gfhztq");
    			set_style(div0, "transform", "translate(" + /*x*/ ctx[1] + "px, " + /*y*/ ctx[2] + "px)");
    			add_location(div0, file$m, 130, 4, 3863);
    			attr_dev(div1, "class", "just-text svelte-1gfhztq");
    			add_location(div1, file$m, 128, 0, 3816);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			div0.innerHTML = /*text*/ ctx[3];
    			/*div0_binding*/ ctx[29](div0);
    			/*div1_binding_1*/ ctx[30](div1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*text*/ 8) div0.innerHTML = /*text*/ ctx[3];
    			if (dirty[0] & /*x, y*/ 6) {
    				set_style(div0, "transform", "translate(" + /*x*/ ctx[1] + "px, " + /*y*/ ctx[2] + "px)");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*div0_binding*/ ctx[29](null);
    			/*div1_binding_1*/ ctx[30](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(128:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (117:0) {#if !justText}
    function create_if_block$c(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let div3_class_value;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "line line-before svelte-1gfhztq");
    			add_location(div0, file$m, 120, 6, 3612);
    			attr_dev(div1, "class", "text svelte-1gfhztq");
    			attr_dev(div1, "style", /*textStyleStr*/ ctx[9]);
    			add_location(div1, file$m, 121, 6, 3655);
    			attr_dev(div2, "class", "line line-after svelte-1gfhztq");
    			add_location(div2, file$m, 124, 6, 3756);
    			attr_dev(div3, "class", div3_class_value = "annotation annotation--" + /*pos*/ ctx[5] + " svelte-1gfhztq");
    			attr_dev(div3, "style", /*styleStr*/ ctx[10]);
    			add_location(div3, file$m, 118, 2, 3525);
    			attr_dev(div4, "class", "canvas-limiter svelte-1gfhztq");
    			set_style(div4, "top", /*topClampPerc*/ ctx[11] + "%");
    			set_style(div4, "height", /*perc*/ ctx[12](/*limitedCanvasHeight*/ ctx[6], /*canvasHeight*/ ctx[0]) + "%");
    			add_location(div4, file$m, 117, 0, 3413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			div1.innerHTML = /*text*/ ctx[3];
    			/*div1_binding*/ ctx[27](div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			/*div3_binding*/ ctx[28](div3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*text*/ 8) div1.innerHTML = /*text*/ ctx[3];
    			if (dirty[0] & /*textStyleStr*/ 512) {
    				attr_dev(div1, "style", /*textStyleStr*/ ctx[9]);
    			}

    			if (dirty[0] & /*pos*/ 32 && div3_class_value !== (div3_class_value = "annotation annotation--" + /*pos*/ ctx[5] + " svelte-1gfhztq")) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (dirty[0] & /*styleStr*/ 1024) {
    				attr_dev(div3, "style", /*styleStr*/ ctx[10]);
    			}

    			if (dirty[0] & /*topClampPerc*/ 2048) {
    				set_style(div4, "top", /*topClampPerc*/ ctx[11] + "%");
    			}

    			if (dirty[0] & /*limitedCanvasHeight, canvasHeight*/ 65) {
    				set_style(div4, "height", /*perc*/ ctx[12](/*limitedCanvasHeight*/ ctx[6], /*canvasHeight*/ ctx[0]) + "%");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			/*div1_binding*/ ctx[27](null);
    			/*div3_binding*/ ctx[28](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(117:0) {#if !justText}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*justText*/ ctx[4]) return create_if_block$c;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const textWidth = 250;
    const topPaddingPx = 5;
    const leftPaddingPx = 5;

    function calcStyle(style) {
    	const dimProps = ['left', 'top', 'bottom', 'right', 'width', 'height'];
    	const dimStr = dimProps.filter(prop => style[prop] !== undefined).map(prop => `${prop}: ${style[prop]}%; `).join('');
    	const transformStr = `transform: ${style.transform};`;
    	return dimStr + transformStr;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let limitedCanvasHeight;
    	let leftPadding;
    	let topClampPerc;
    	let xPerc;
    	let yPerc;
    	let radiusX;
    	let radiusY;
    	let topMin;
    	let textWidthPerc;
    	let styleStr;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Annotation', slots, []);
    	let { canvasWidth } = $$props;
    	let { canvasHeight } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	let { text } = $$props;
    	let { radius } = $$props;
    	let { forceTopWherePossible = false } = $$props;
    	let { justText = false } = $$props;
    	let { topClamp = 0 } = $$props;
    	const noDims = !(canvasHeight > 0) || !(canvasWidth > 0);
    	if (noDims) throw new Error('Annotation created with no canvas dims');
    	var textEl;
    	var el;
    	var pos;
    	var textShiftX;
    	var textShiftY;
    	const perc = (a, b) => 100 * (a / b);
    	var style;
    	var textStyleStr;

    	const writable_props = [
    		'canvasWidth',
    		'canvasHeight',
    		'x',
    		'y',
    		'text',
    		'radius',
    		'forceTopWherePossible',
    		'justText',
    		'topClamp'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Annotation> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			textEl = $$value;
    			$$invalidate(7, textEl);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(8, el);
    		});
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			textEl = $$value;
    			$$invalidate(7, textEl);
    		});
    	}

    	function div1_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(8, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('canvasWidth' in $$props) $$invalidate(13, canvasWidth = $$props.canvasWidth);
    		if ('canvasHeight' in $$props) $$invalidate(0, canvasHeight = $$props.canvasHeight);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('radius' in $$props) $$invalidate(14, radius = $$props.radius);
    		if ('forceTopWherePossible' in $$props) $$invalidate(15, forceTopWherePossible = $$props.forceTopWherePossible);
    		if ('justText' in $$props) $$invalidate(4, justText = $$props.justText);
    		if ('topClamp' in $$props) $$invalidate(16, topClamp = $$props.topClamp);
    	};

    	$$self.$capture_state = () => ({
    		clamp,
    		canvasWidth,
    		canvasHeight,
    		x,
    		y,
    		text,
    		radius,
    		forceTopWherePossible,
    		justText,
    		topClamp,
    		noDims,
    		textEl,
    		el,
    		pos,
    		textShiftX,
    		textShiftY,
    		textWidth,
    		perc,
    		topPaddingPx,
    		leftPaddingPx,
    		style,
    		calcStyle,
    		textStyleStr,
    		styleStr,
    		textWidthPerc,
    		xPerc,
    		leftPadding,
    		yPerc,
    		radiusY,
    		topMin,
    		radiusX,
    		limitedCanvasHeight,
    		topClampPerc
    	});

    	$$self.$inject_state = $$props => {
    		if ('canvasWidth' in $$props) $$invalidate(13, canvasWidth = $$props.canvasWidth);
    		if ('canvasHeight' in $$props) $$invalidate(0, canvasHeight = $$props.canvasHeight);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('radius' in $$props) $$invalidate(14, radius = $$props.radius);
    		if ('forceTopWherePossible' in $$props) $$invalidate(15, forceTopWherePossible = $$props.forceTopWherePossible);
    		if ('justText' in $$props) $$invalidate(4, justText = $$props.justText);
    		if ('topClamp' in $$props) $$invalidate(16, topClamp = $$props.topClamp);
    		if ('textEl' in $$props) $$invalidate(7, textEl = $$props.textEl);
    		if ('el' in $$props) $$invalidate(8, el = $$props.el);
    		if ('pos' in $$props) $$invalidate(5, pos = $$props.pos);
    		if ('textShiftX' in $$props) $$invalidate(17, textShiftX = $$props.textShiftX);
    		if ('textShiftY' in $$props) $$invalidate(18, textShiftY = $$props.textShiftY);
    		if ('style' in $$props) $$invalidate(19, style = $$props.style);
    		if ('textStyleStr' in $$props) $$invalidate(9, textStyleStr = $$props.textStyleStr);
    		if ('styleStr' in $$props) $$invalidate(10, styleStr = $$props.styleStr);
    		if ('textWidthPerc' in $$props) $$invalidate(20, textWidthPerc = $$props.textWidthPerc);
    		if ('xPerc' in $$props) $$invalidate(21, xPerc = $$props.xPerc);
    		if ('leftPadding' in $$props) $$invalidate(22, leftPadding = $$props.leftPadding);
    		if ('yPerc' in $$props) $$invalidate(23, yPerc = $$props.yPerc);
    		if ('radiusY' in $$props) $$invalidate(24, radiusY = $$props.radiusY);
    		if ('topMin' in $$props) $$invalidate(25, topMin = $$props.topMin);
    		if ('radiusX' in $$props) $$invalidate(26, radiusX = $$props.radiusX);
    		if ('limitedCanvasHeight' in $$props) $$invalidate(6, limitedCanvasHeight = $$props.limitedCanvasHeight);
    		if ('topClampPerc' in $$props) $$invalidate(11, topClampPerc = $$props.topClampPerc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*canvasHeight, topClamp*/ 65537) {
    			$$invalidate(6, limitedCanvasHeight = canvasHeight - topClamp);
    		}

    		if ($$self.$$.dirty[0] & /*canvasWidth*/ 8192) {
    			$$invalidate(22, leftPadding = perc(leftPaddingPx, canvasWidth));
    		}

    		if ($$self.$$.dirty[0] & /*topClamp, canvasHeight*/ 65537) {
    			$$invalidate(11, topClampPerc = perc(topClamp, canvasHeight));
    		}

    		if ($$self.$$.dirty[0] & /*x, canvasWidth*/ 8194) {
    			$$invalidate(21, xPerc = perc(x, canvasWidth));
    		}

    		if ($$self.$$.dirty[0] & /*y, topClamp, limitedCanvasHeight*/ 65604) {
    			$$invalidate(23, yPerc = perc(y - topClamp, limitedCanvasHeight));
    		}

    		if ($$self.$$.dirty[0] & /*radius, canvasWidth*/ 24576) {
    			$$invalidate(26, radiusX = perc(typeof radius === 'number' ? radius : radius.x, canvasWidth));
    		}

    		if ($$self.$$.dirty[0] & /*radius, limitedCanvasHeight*/ 16448) {
    			$$invalidate(24, radiusY = perc(typeof radius === 'number' ? radius : radius.y, limitedCanvasHeight));
    		}

    		if ($$self.$$.dirty[0] & /*limitedCanvasHeight*/ 64) {
    			$$invalidate(25, topMin = perc(topPaddingPx, limitedCanvasHeight));
    		}

    		if ($$self.$$.dirty[0] & /*canvasWidth, canvasHeight*/ 8193) {
    			$$invalidate(20, textWidthPerc = canvasWidth && perc(textWidth, canvasHeight));
    		}

    		if ($$self.$$.dirty[0] & /*forceTopWherePossible, yPerc, xPerc*/ 10518528) {
    			{
    				if (forceTopWherePossible) {
    					if (yPerc < 15) {
    						$$invalidate(5, pos = xPerc > 50 ? 'left' : 'right');
    					} else {
    						$$invalidate(5, pos = 'above');
    					}
    				} else {
    					if (yPerc < 5) {
    						$$invalidate(5, pos = 'below');
    					} else if (xPerc > 65 || xPerc < 35) {
    						$$invalidate(5, pos = xPerc > 50 ? 'left' : 'right');
    					} else {
    						$$invalidate(5, pos = yPerc < 20 ? 'below' : 'above');
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*pos, xPerc, radiusX, yPerc, forceTopWherePossible, topMin, radiusY, textWidthPerc, leftPadding*/ 133201952) {
    			{
    				$$invalidate(17, textShiftX = null);
    				$$invalidate(18, textShiftY = null);

    				if (pos === 'left') {
    					$$invalidate(19, style = {
    						right: 100 - (xPerc - radiusX),
    						top: yPerc
    					});
    				} else if (pos === 'right') {
    					$$invalidate(19, style = { left: xPerc + radiusX, top: yPerc });
    				} else if (pos === 'above') {
    					$$invalidate(19, style = {
    						left: xPerc,
    						top: forceTopWherePossible
    						? topMin
    						: Math.max(topMin, yPerc - radiusY - 40),
    						bottom: 100 - (yPerc - radiusY)
    					});
    				} else if (pos === 'below') {
    					$$invalidate(19, style = {
    						left: xPerc,
    						top: yPerc + radiusY,
    						bottom: Math.max(0, 100 - yPerc - 50)
    					});
    				}

    				if (pos === 'left' || pos === 'right') {
    					if (yPerc < 10) {
    						$$invalidate(18, textShiftY = 0);
    					} else if (yPerc > 90) {
    						$$invalidate(18, textShiftY = -100);
    					} else {
    						$$invalidate(18, textShiftY = -50);
    					}
    				} else if (pos === 'above' || pos === 'below') {
    					const _textShiftX = clamp(-(textWidthPerc / 3), -xPerc + leftPadding, 100 - xPerc - textWidthPerc);
    					$$invalidate(17, textShiftX = 100 * _textShiftX / textWidthPerc);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*style*/ 524288) {
    			$$invalidate(10, styleStr = style ? calcStyle(style) : '');
    		}

    		if ($$self.$$.dirty[0] & /*textShiftX, textShiftY*/ 393216) {
    			{
    				const translateX = textShiftX !== null ? `translateX(${textShiftX}%)` : '';
    				const translateY = textShiftY !== null ? `translateY(${textShiftY}%)` : '';

    				$$invalidate(9, textStyleStr = translateX || translateY
    				? `transform: ${translateX} ${translateY};`
    				: '');
    			}
    		}
    	};

    	return [
    		canvasHeight,
    		x,
    		y,
    		text,
    		justText,
    		pos,
    		limitedCanvasHeight,
    		textEl,
    		el,
    		textStyleStr,
    		styleStr,
    		topClampPerc,
    		perc,
    		canvasWidth,
    		radius,
    		forceTopWherePossible,
    		topClamp,
    		textShiftX,
    		textShiftY,
    		style,
    		textWidthPerc,
    		xPerc,
    		leftPadding,
    		yPerc,
    		radiusY,
    		topMin,
    		radiusX,
    		div1_binding,
    		div3_binding,
    		div0_binding,
    		div1_binding_1
    	];
    }

    class Annotation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(
    			this,
    			options,
    			instance$o,
    			create_fragment$o,
    			safe_not_equal,
    			{
    				canvasWidth: 13,
    				canvasHeight: 0,
    				x: 1,
    				y: 2,
    				text: 3,
    				radius: 14,
    				forceTopWherePossible: 15,
    				justText: 4,
    				topClamp: 16
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Annotation",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*canvasWidth*/ ctx[13] === undefined && !('canvasWidth' in props)) {
    			console.warn("<Annotation> was created without expected prop 'canvasWidth'");
    		}

    		if (/*canvasHeight*/ ctx[0] === undefined && !('canvasHeight' in props)) {
    			console.warn("<Annotation> was created without expected prop 'canvasHeight'");
    		}

    		if (/*x*/ ctx[1] === undefined && !('x' in props)) {
    			console.warn("<Annotation> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[2] === undefined && !('y' in props)) {
    			console.warn("<Annotation> was created without expected prop 'y'");
    		}

    		if (/*text*/ ctx[3] === undefined && !('text' in props)) {
    			console.warn("<Annotation> was created without expected prop 'text'");
    		}

    		if (/*radius*/ ctx[14] === undefined && !('radius' in props)) {
    			console.warn("<Annotation> was created without expected prop 'radius'");
    		}
    	}

    	get canvasWidth() {
    		throw new Error_1("<Annotation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canvasWidth(value) {
    		throw new Error_1("<Annotation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get canvasHeight() {
    		throw new Error_1("<Annotation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canvasHeight(value) {
    		throw new Error_1("<Annotation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error_1("<Annotation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error_1("<Annotation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error_1("<Annotation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error_1("<Annotation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error_1("<Annotation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error_1("<Annotation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radius() {
    		throw new Error_1("<Annotation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radius(value) {
    		throw new Error_1("<Annotation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get forceTopWherePossible() {
    		throw new Error_1("<Annotation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set forceTopWherePossible(value) {
    		throw new Error_1("<Annotation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get justText() {
    		throw new Error_1("<Annotation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set justText(value) {
    		throw new Error_1("<Annotation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get topClamp() {
    		throw new Error_1("<Annotation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topClamp(value) {
    		throw new Error_1("<Annotation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/maps/Cartogram.svelte generated by Svelte v3.42.3 */

    const { Object: Object_1, window: window_1 } = globals;
    const file$l = "src/components/maps/Cartogram.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[57] = list[i];
    	return child_ctx;
    }

    // (162:2) {#if loaded}
    function create_if_block_1$8(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*cartogramData*/ ctx[9];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*d*/ ctx[57].code;
    	validate_each_keys(ctx, each_value, get_each_context$c, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$c(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$c(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "countries svelte-sdm8di");
    			attr_dev(div, "role", "graphics-document");
    			attr_dev(div, "aria-label", /*title*/ ctx[17]);
    			add_location(div, file$l, 162, 4, 5350);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*classesFn, cartogramData, calcStyle, onMouseEnterCountry, onMouseLeaveCountry, onMouseClick, hideLabels, hoverTextFn*/ 1901063) {
    				each_value = /*cartogramData*/ ctx[9];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$c, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$c, null, get_each_context$c);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(162:2) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (167:8) {#if d.x && d.y}
    function create_if_block_2$4(ctx) {
    	let div;
    	let desc;
    	let t0_value = /*hoverTextFn*/ ctx[1](/*d*/ ctx[57]) + "";
    	let t0;
    	let t1;
    	let t2;
    	let div_class_value;
    	let div_style_value;
    	let div_data_code_value;
    	let mounted;
    	let dispose;
    	let if_block = !/*hideLabels*/ ctx[2] && /*d*/ ctx[57].width > 100 && create_if_block_3$2(ctx);

    	function mouseenter_handler(...args) {
    		return /*mouseenter_handler*/ ctx[42](/*d*/ ctx[57], ...args);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[44](/*d*/ ctx[57]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			desc = svg_element("desc");
    			t0 = text$1(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			add_location(desc, file$l, 178, 10, 5927);
    			attr_dev(div, "class", div_class_value = "country " + /*classesFn*/ ctx[0](/*d*/ ctx[57]).join(' ') + " svelte-sdm8di");
    			attr_dev(div, "style", div_style_value = /*calcStyle*/ ctx[16](/*d*/ ctx[57]));
    			attr_dev(div, "data-code", div_data_code_value = /*d*/ ctx[57].code);
    			attr_dev(div, "tabindex", "0");
    			attr_dev(div, "role", "graphics-object");
    			add_location(div, file$l, 167, 10, 5507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, desc);
    			append_dev(desc, t0);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseenter", mouseenter_handler, false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[43], false, false, false),
    					listen_dev(div, "focus", focus_handler, false, false, false),
    					listen_dev(div, "blur", /*blur_handler*/ ctx[45], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*hoverTextFn, cartogramData*/ 514 && t0_value !== (t0_value = /*hoverTextFn*/ ctx[1](/*d*/ ctx[57]) + "")) set_data_dev(t0, t0_value);

    			if (!/*hideLabels*/ ctx[2] && /*d*/ ctx[57].width > 100) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$2(ctx);
    					if_block.c();
    					if_block.m(div, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*classesFn, cartogramData*/ 513 && div_class_value !== (div_class_value = "country " + /*classesFn*/ ctx[0](/*d*/ ctx[57]).join(' ') + " svelte-sdm8di")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty[0] & /*calcStyle, cartogramData*/ 66048 && div_style_value !== (div_style_value = /*calcStyle*/ ctx[16](/*d*/ ctx[57]))) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty[0] & /*cartogramData*/ 512 && div_data_code_value !== (div_data_code_value = /*d*/ ctx[57].code)) {
    				attr_dev(div, "data-code", div_data_code_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(167:8) {#if d.x && d.y}",
    		ctx
    	});

    	return block;
    }

    // (180:10) {#if !hideLabels && d.width > 100}
    function create_if_block_3$2(ctx) {
    	let span;
    	let t_value = /*d*/ ctx[57].short + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text$1(t_value);
    			attr_dev(span, "class", "country-text svelte-sdm8di");
    			add_location(span, file$l, 180, 12, 6014);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*cartogramData*/ 512 && t_value !== (t_value = /*d*/ ctx[57].short + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(180:10) {#if !hideLabels && d.width > 100}",
    		ctx
    	});

    	return block;
    }

    // (166:6) {#each cartogramData as d (d.code)}
    function create_each_block$c(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let if_block = /*d*/ ctx[57].x && /*d*/ ctx[57].y && create_if_block_2$4(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty$1();
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*d*/ ctx[57].x && /*d*/ ctx[57].y) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(166:6) {#each cartogramData as d (d.code)}",
    		ctx
    	});

    	return block;
    }

    // (189:2) {#if annotation}
    function create_if_block$b(ctx) {
    	let div;
    	let annotation_1;
    	let div_id_value;
    	let current;

    	annotation_1 = new Annotation({
    			props: {
    				x: /*annotation*/ ctx[5].x,
    				y: /*annotation*/ ctx[5].y,
    				text: /*annotation*/ ctx[5].html,
    				radius: /*annotation*/ ctx[5].radius,
    				forceTopWherePossible: /*annotation*/ ctx[5] === /*helpAnnotation*/ ctx[10],
    				topClamp: /*annotation*/ ctx[5] === /*helpAnnotation*/ ctx[10]
    				? 0
    				: /*pxAboveScreenTop*/ ctx[15],
    				canvasWidth: /*containerWidth*/ ctx[7],
    				canvasHeight: /*containerHeight*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(annotation_1.$$.fragment);
    			attr_dev(div, "id", div_id_value = "" + (/*slug*/ ctx[3] + "-annotation"));
    			attr_dev(div, "class", "annotation-container svelte-sdm8di");
    			toggle_class(div, "annotation-hide", /*hideAnnotation*/ ctx[11]);
    			toggle_class(div, "annotation-help", /*annotation*/ ctx[5].class === "help");
    			add_location(div, file$l, 189, 4, 6162);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(annotation_1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const annotation_1_changes = {};
    			if (dirty[0] & /*annotation*/ 32) annotation_1_changes.x = /*annotation*/ ctx[5].x;
    			if (dirty[0] & /*annotation*/ 32) annotation_1_changes.y = /*annotation*/ ctx[5].y;
    			if (dirty[0] & /*annotation*/ 32) annotation_1_changes.text = /*annotation*/ ctx[5].html;
    			if (dirty[0] & /*annotation*/ 32) annotation_1_changes.radius = /*annotation*/ ctx[5].radius;
    			if (dirty[0] & /*annotation, helpAnnotation*/ 1056) annotation_1_changes.forceTopWherePossible = /*annotation*/ ctx[5] === /*helpAnnotation*/ ctx[10];

    			if (dirty[0] & /*annotation, helpAnnotation, pxAboveScreenTop*/ 33824) annotation_1_changes.topClamp = /*annotation*/ ctx[5] === /*helpAnnotation*/ ctx[10]
    			? 0
    			: /*pxAboveScreenTop*/ ctx[15];

    			if (dirty[0] & /*containerWidth*/ 128) annotation_1_changes.canvasWidth = /*containerWidth*/ ctx[7];
    			if (dirty[0] & /*containerHeight*/ 256) annotation_1_changes.canvasHeight = /*containerHeight*/ ctx[8];
    			annotation_1.$set(annotation_1_changes);

    			if (!current || dirty[0] & /*slug*/ 8 && div_id_value !== (div_id_value = "" + (/*slug*/ ctx[3] + "-annotation"))) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty[0] & /*hideAnnotation*/ 2048) {
    				toggle_class(div, "annotation-hide", /*hideAnnotation*/ ctx[11]);
    			}

    			if (dirty[0] & /*annotation*/ 32) {
    				toggle_class(div, "annotation-help", /*annotation*/ ctx[5].class === "help");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(annotation_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(annotation_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(annotation_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(189:2) {#if annotation}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div;
    	let filter;
    	let feDropShadow;
    	let t0;
    	let t1;
    	let div_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*loaded*/ ctx[13] && create_if_block_1$8(ctx);
    	let if_block1 = /*annotation*/ ctx[5] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			filter = svg_element("filter");
    			feDropShadow = svg_element("feDropShadow");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(feDropShadow, "dx", "0");
    			attr_dev(feDropShadow, "dy", "0");
    			attr_dev(feDropShadow, "stdDeviation", "4");
    			attr_dev(feDropShadow, "flood-opacity", "0.9");
    			add_location(feDropShadow, file$l, 159, 2, 5240);
    			attr_dev(filter, "id", "shadow");
    			attr_dev(filter, "x", "+100px");
    			add_location(filter, file$l, 158, 0, 5206);
    			attr_dev(div, "class", "cartogram svelte-sdm8di");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[47].call(div));
    			toggle_class(div, "cartogram-country-hover", /*hoverData*/ ctx[4]);
    			toggle_class(div, "cartogram-resizing", /*resizing*/ ctx[14]);
    			add_location(div, file$l, 153, 0, 5042);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, filter);
    			append_dev(filter, feDropShadow);
    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			/*div_binding*/ ctx[46](div);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[47].bind(div));
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "scroll", /*onWindowScroll*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*loaded*/ ctx[13]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$8(ctx);
    					if_block0.c();
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*annotation*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*annotation*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$b(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*hoverData*/ 16) {
    				toggle_class(div, "cartogram-country-hover", /*hoverData*/ ctx[4]);
    			}

    			if (dirty[0] & /*resizing*/ 16384) {
    				toggle_class(div, "cartogram-resizing", /*resizing*/ ctx[14]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*div_binding*/ ctx[46](null);
    			div_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let largestVal;
    	let radius;
    	let xScale;
    	let yScale;
    	let calcStyle;
    	let helpCountry;
    	let helpAnnotation;
    	let countryAnnotation;
    	let haveContainerDims;
    	let hideAnnotation;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cartogram', slots, []);
    	let { data } = $$props;
    	let { nodeSize = 100 } = $$props;
    	let { domain } = $$props;
    	let { helpText = null } = $$props;
    	let { categoryFn = undefined } = $$props;
    	let { colorFn = undefined } = $$props;
    	let { classesFn = () => [] } = $$props;
    	let { hoverTextFn } = $$props;
    	let { onHoverFn = () => null } = $$props;
    	let { hideLabels = false } = $$props;
    	const rerenderFn = () => (((((((((($$invalidate(9, cartogramData), $$invalidate(23, data)), $$invalidate(40, radius)), $$invalidate(27, categoryFn)), $$invalidate(39, xScale)), $$invalidate(38, yScale)), $$invalidate(41, largestVal)), $$invalidate(24, nodeSize)), $$invalidate(25, domain)), $$invalidate(32, targetWidth)), $$invalidate(33, targetHeight));
    	let { annotationShowing = false } = $$props;
    	let { legendTitle } = $$props;
    	let { slug } = $$props;
    	const title = legendTitle.replaceAll("\\<.*?\\>", "").toLowerCase();
    	let containerEl;
    	let loaded = false;

    	// used to scale to container el
    	const originalWidth = domain[0];

    	const originalHeight = domain[1];
    	let targetWidth = originalWidth;
    	let targetHeight = originalHeight;
    	let resizing = false;
    	let hoverTimeout;
    	let hoverData = null;
    	let helpTextFade = false;
    	let annotation;
    	let hoveredForX = false;
    	let clientWidth;
    	let containerWidth;
    	let containerHeight;

    	function resize() {
    		if (containerEl) {
    			$$invalidate(14, resizing = true);
    			const ctrStyle = getComputedStyle(containerEl);
    			const xPadding = parseFloat(ctrStyle.paddingLeft) + parseFloat(ctrStyle.paddingRight);
    			const yPadding = parseFloat(ctrStyle.paddingTop) - parseFloat(ctrStyle.paddingBottom);
    			$$invalidate(7, containerWidth = containerEl.clientWidth - xPadding);
    			$$invalidate(8, containerHeight = containerEl.clientHeight - yPadding);
    			const scale = Math.min(containerWidth / originalWidth, containerHeight / originalHeight);
    			$$invalidate(32, targetWidth = originalWidth * scale);
    			$$invalidate(33, targetHeight = originalHeight * scale);
    			window.setTimeout(() => $$invalidate(14, resizing = false));
    		}
    	}

    	const throttledResize = throttle(resize, 100);
    	let cartogramData;

    	window.setTimeout(
    		() => {
    			resize();
    			$$invalidate(13, loaded = true);
    		},
    		0
    	);

    	const _debouncedShowHelpText = trailingDebounce(() => $$invalidate(34, helpTextFade = false), 200);

    	function onMouseEnterCountry(evt, country) {
    		onHoverFn(country);
    		$$invalidate(34, helpTextFade = false);
    		_debouncedShowHelpText.cancel();

    		$$invalidate(4, hoverData = {
    			country,
    			x: country.left + country.width / 2,
    			y: country.top + country.height / 2
    		});

    		hoverTimeout = window.setTimeout(() => hoveredForX = true, 350);
    	}

    	function onMouseClick(country) {
    		onHoverFn(country);
    		$$invalidate(34, helpTextFade = false);
    		_debouncedShowHelpText.cancel();

    		$$invalidate(4, hoverData = {
    			country,
    			x: country.left + country.width / 2,
    			y: country.top + country.height / 2
    		});

    		hoverTimeout = window.setTimeout(() => hoveredForX = true, 350);
    	}

    	function onMouseLeaveCountry() {
    		clearHoverState();
    		onHoverFn(null);
    	}

    	function clearHoverState() {
    		$$invalidate(4, hoverData = null);
    		hoveredForX = false;
    		window.clearTimeout(hoverTimeout);
    		hoverTimeout = null;
    		fadeInHelpText();
    	}

    	function fadeInHelpText() {
    		$$invalidate(34, helpTextFade = true);
    		_debouncedShowHelpText();
    	}

    	let pxAboveScreenTop = 0;

    	const onWindowScroll = () => {
    		const top = containerEl.getBoundingClientRect().top - 50;
    		$$invalidate(15, pxAboveScreenTop = top < 0 ? Math.abs(top) : 0);
    	};

    	const writable_props = [
    		'data',
    		'nodeSize',
    		'domain',
    		'helpText',
    		'categoryFn',
    		'colorFn',
    		'classesFn',
    		'hoverTextFn',
    		'onHoverFn',
    		'hideLabels',
    		'annotationShowing',
    		'legendTitle',
    		'slug'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cartogram> was created with unknown prop '${key}'`);
    	});

    	const mouseenter_handler = (d, evt) => onMouseEnterCountry(evt, d);
    	const mouseleave_handler = () => onMouseLeaveCountry();
    	const focus_handler = d => onMouseClick(d);
    	const blur_handler = () => onMouseLeaveCountry();

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerEl = $$value;
    			$$invalidate(12, containerEl);
    		});
    	}

    	function div_elementresize_handler() {
    		clientWidth = this.clientWidth;
    		$$invalidate(6, clientWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(23, data = $$props.data);
    		if ('nodeSize' in $$props) $$invalidate(24, nodeSize = $$props.nodeSize);
    		if ('domain' in $$props) $$invalidate(25, domain = $$props.domain);
    		if ('helpText' in $$props) $$invalidate(26, helpText = $$props.helpText);
    		if ('categoryFn' in $$props) $$invalidate(27, categoryFn = $$props.categoryFn);
    		if ('colorFn' in $$props) $$invalidate(28, colorFn = $$props.colorFn);
    		if ('classesFn' in $$props) $$invalidate(0, classesFn = $$props.classesFn);
    		if ('hoverTextFn' in $$props) $$invalidate(1, hoverTextFn = $$props.hoverTextFn);
    		if ('onHoverFn' in $$props) $$invalidate(29, onHoverFn = $$props.onHoverFn);
    		if ('hideLabels' in $$props) $$invalidate(2, hideLabels = $$props.hideLabels);
    		if ('annotationShowing' in $$props) $$invalidate(22, annotationShowing = $$props.annotationShowing);
    		if ('legendTitle' in $$props) $$invalidate(31, legendTitle = $$props.legendTitle);
    		if ('slug' in $$props) $$invalidate(3, slug = $$props.slug);
    	};

    	$$self.$capture_state = () => ({
    		d3,
    		throttle,
    		trailingDebounce,
    		Annotation,
    		data,
    		nodeSize,
    		domain,
    		helpText,
    		categoryFn,
    		colorFn,
    		classesFn,
    		hoverTextFn,
    		onHoverFn,
    		hideLabels,
    		rerenderFn,
    		annotationShowing,
    		legendTitle,
    		slug,
    		title,
    		containerEl,
    		loaded,
    		originalWidth,
    		originalHeight,
    		targetWidth,
    		targetHeight,
    		resizing,
    		hoverTimeout,
    		hoverData,
    		helpTextFade,
    		annotation,
    		hoveredForX,
    		clientWidth,
    		containerWidth,
    		containerHeight,
    		resize,
    		throttledResize,
    		cartogramData,
    		_debouncedShowHelpText,
    		onMouseEnterCountry,
    		onMouseClick,
    		onMouseLeaveCountry,
    		clearHoverState,
    		fadeInHelpText,
    		pxAboveScreenTop,
    		onWindowScroll,
    		helpAnnotation,
    		hideAnnotation,
    		countryAnnotation,
    		haveContainerDims,
    		helpCountry,
    		calcStyle,
    		yScale,
    		xScale,
    		radius,
    		largestVal
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(23, data = $$props.data);
    		if ('nodeSize' in $$props) $$invalidate(24, nodeSize = $$props.nodeSize);
    		if ('domain' in $$props) $$invalidate(25, domain = $$props.domain);
    		if ('helpText' in $$props) $$invalidate(26, helpText = $$props.helpText);
    		if ('categoryFn' in $$props) $$invalidate(27, categoryFn = $$props.categoryFn);
    		if ('colorFn' in $$props) $$invalidate(28, colorFn = $$props.colorFn);
    		if ('classesFn' in $$props) $$invalidate(0, classesFn = $$props.classesFn);
    		if ('hoverTextFn' in $$props) $$invalidate(1, hoverTextFn = $$props.hoverTextFn);
    		if ('onHoverFn' in $$props) $$invalidate(29, onHoverFn = $$props.onHoverFn);
    		if ('hideLabels' in $$props) $$invalidate(2, hideLabels = $$props.hideLabels);
    		if ('annotationShowing' in $$props) $$invalidate(22, annotationShowing = $$props.annotationShowing);
    		if ('legendTitle' in $$props) $$invalidate(31, legendTitle = $$props.legendTitle);
    		if ('slug' in $$props) $$invalidate(3, slug = $$props.slug);
    		if ('containerEl' in $$props) $$invalidate(12, containerEl = $$props.containerEl);
    		if ('loaded' in $$props) $$invalidate(13, loaded = $$props.loaded);
    		if ('targetWidth' in $$props) $$invalidate(32, targetWidth = $$props.targetWidth);
    		if ('targetHeight' in $$props) $$invalidate(33, targetHeight = $$props.targetHeight);
    		if ('resizing' in $$props) $$invalidate(14, resizing = $$props.resizing);
    		if ('hoverTimeout' in $$props) hoverTimeout = $$props.hoverTimeout;
    		if ('hoverData' in $$props) $$invalidate(4, hoverData = $$props.hoverData);
    		if ('helpTextFade' in $$props) $$invalidate(34, helpTextFade = $$props.helpTextFade);
    		if ('annotation' in $$props) $$invalidate(5, annotation = $$props.annotation);
    		if ('hoveredForX' in $$props) hoveredForX = $$props.hoveredForX;
    		if ('clientWidth' in $$props) $$invalidate(6, clientWidth = $$props.clientWidth);
    		if ('containerWidth' in $$props) $$invalidate(7, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(8, containerHeight = $$props.containerHeight);
    		if ('cartogramData' in $$props) $$invalidate(9, cartogramData = $$props.cartogramData);
    		if ('pxAboveScreenTop' in $$props) $$invalidate(15, pxAboveScreenTop = $$props.pxAboveScreenTop);
    		if ('helpAnnotation' in $$props) $$invalidate(10, helpAnnotation = $$props.helpAnnotation);
    		if ('hideAnnotation' in $$props) $$invalidate(11, hideAnnotation = $$props.hideAnnotation);
    		if ('countryAnnotation' in $$props) $$invalidate(35, countryAnnotation = $$props.countryAnnotation);
    		if ('haveContainerDims' in $$props) $$invalidate(36, haveContainerDims = $$props.haveContainerDims);
    		if ('helpCountry' in $$props) $$invalidate(37, helpCountry = $$props.helpCountry);
    		if ('calcStyle' in $$props) $$invalidate(16, calcStyle = $$props.calcStyle);
    		if ('yScale' in $$props) $$invalidate(38, yScale = $$props.yScale);
    		if ('xScale' in $$props) $$invalidate(39, xScale = $$props.xScale);
    		if ('radius' in $$props) $$invalidate(40, radius = $$props.radius);
    		if ('largestVal' in $$props) $$invalidate(41, largestVal = $$props.largestVal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data*/ 8388608) {
    			$$invalidate(41, largestVal = Math.max(...data.map(d => d.value)));
    		}

    		if ($$self.$$.dirty[0] & /*clientWidth*/ 64) {
    			clientWidth && throttledResize();
    		}

    		if ($$self.$$.dirty[0] & /*nodeSize*/ 16777216 | $$self.$$.dirty[1] & /*largestVal*/ 1024) {
    			$$invalidate(40, radius = sqrt().domain([0, largestVal]).range([0, nodeSize]));
    		}

    		if ($$self.$$.dirty[0] & /*domain*/ 33554432 | $$self.$$.dirty[1] & /*targetWidth*/ 2) {
    			$$invalidate(39, xScale = linear().domain([0, domain[0]]).range([0, targetWidth]));
    		}

    		if ($$self.$$.dirty[0] & /*domain*/ 33554432 | $$self.$$.dirty[1] & /*targetHeight*/ 4) {
    			$$invalidate(38, yScale = linear().domain([0, domain[1]]).range([0, targetHeight]));
    		}

    		if ($$self.$$.dirty[0] & /*data, categoryFn*/ 142606336 | $$self.$$.dirty[1] & /*radius, xScale, yScale*/ 896) {
    			$$invalidate(9, cartogramData = data.map(d => {
    				const r = radius(d.value);

    				return Object.assign(Object.assign({}, d), {
    					category: categoryFn ? categoryFn(d) : null,
    					left: xScale(d.x - r),
    					top: yScale(d.y - r),
    					// width height should be the same if the aspect is correct
    					width: xScale(r * 2),
    					height: yScale(r * 2)
    				});
    			}));
    		}

    		if ($$self.$$.dirty[0] & /*cartogramData*/ 512) {
    			cartogramData.sort((a, b) => a.y - b.y);
    		}

    		if ($$self.$$.dirty[0] & /*colorFn*/ 268435456) {
    			$$invalidate(16, calcStyle = d => {
    				const styles = [
    					`left: ${d.left}px`,
    					`top: ${d.top}px`,
    					`width: ${d.width}px`,
    					`height: ${d.height}px`,
    					`background: ${d.color ? d.color : colorFn(d)};`
    				];

    				return styles.join(';');
    			});
    		}

    		if ($$self.$$.dirty[0] & /*helpText, cartogramData*/ 67109376) {
    			$$invalidate(37, helpCountry = helpText
    			? cartogramData.find(d => d.code === helpText.code)
    			: null);
    		}

    		if ($$self.$$.dirty[0] & /*helpText*/ 67108864 | $$self.$$.dirty[1] & /*helpCountry*/ 64) {
    			$$invalidate(10, helpAnnotation = helpCountry && {
    				x: helpCountry.left + helpCountry.width / 2,
    				y: helpCountry.top + helpCountry.height / 2,
    				radius: 2 + helpCountry.width / 2,
    				html: helpText.text(),
    				class: 'help'
    			});
    		}

    		if ($$self.$$.dirty[0] & /*hoverTextFn, hoverData*/ 18) {
    			$$invalidate(35, countryAnnotation = hoverTextFn && hoverData && {
    				x: hoverData.x,
    				y: hoverData.y,
    				radius: 2 + hoverData.country.width / 2,
    				html: hoverTextFn(hoverData.country)
    			});
    		}

    		if ($$self.$$.dirty[0] & /*containerWidth, containerHeight*/ 384) {
    			$$invalidate(36, haveContainerDims = containerWidth > 0 && containerHeight > 0);
    		}

    		if ($$self.$$.dirty[0] & /*helpAnnotation*/ 1024 | $$self.$$.dirty[1] & /*haveContainerDims, countryAnnotation*/ 48) {
    			$$invalidate(5, annotation = haveContainerDims
    			? countryAnnotation || helpAnnotation
    			: undefined);
    		}

    		if ($$self.$$.dirty[0] & /*hoverData*/ 16 | $$self.$$.dirty[1] & /*helpTextFade, countryAnnotation*/ 24) {
    			$$invalidate(11, hideAnnotation = helpTextFade || !countryAnnotation && hoverData);
    		}

    		if ($$self.$$.dirty[0] & /*annotation, hideAnnotation, helpAnnotation*/ 3104) {
    			$$invalidate(22, annotationShowing = annotation && !hideAnnotation && annotation !== helpAnnotation);
    		}

    		if ($$self.$$.dirty[0] & /*data*/ 8388608) {
    			data && fadeInHelpText();
    		}
    	};

    	return [
    		classesFn,
    		hoverTextFn,
    		hideLabels,
    		slug,
    		hoverData,
    		annotation,
    		clientWidth,
    		containerWidth,
    		containerHeight,
    		cartogramData,
    		helpAnnotation,
    		hideAnnotation,
    		containerEl,
    		loaded,
    		resizing,
    		pxAboveScreenTop,
    		calcStyle,
    		title,
    		onMouseEnterCountry,
    		onMouseClick,
    		onMouseLeaveCountry,
    		onWindowScroll,
    		annotationShowing,
    		data,
    		nodeSize,
    		domain,
    		helpText,
    		categoryFn,
    		colorFn,
    		onHoverFn,
    		rerenderFn,
    		legendTitle,
    		targetWidth,
    		targetHeight,
    		helpTextFade,
    		countryAnnotation,
    		haveContainerDims,
    		helpCountry,
    		yScale,
    		xScale,
    		radius,
    		largestVal,
    		mouseenter_handler,
    		mouseleave_handler,
    		focus_handler,
    		blur_handler,
    		div_binding,
    		div_elementresize_handler
    	];
    }

    class Cartogram extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(
    			this,
    			options,
    			instance$n,
    			create_fragment$n,
    			safe_not_equal,
    			{
    				data: 23,
    				nodeSize: 24,
    				domain: 25,
    				helpText: 26,
    				categoryFn: 27,
    				colorFn: 28,
    				classesFn: 0,
    				hoverTextFn: 1,
    				onHoverFn: 29,
    				hideLabels: 2,
    				rerenderFn: 30,
    				annotationShowing: 22,
    				legendTitle: 31,
    				slug: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cartogram",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[23] === undefined && !('data' in props)) {
    			console.warn("<Cartogram> was created without expected prop 'data'");
    		}

    		if (/*domain*/ ctx[25] === undefined && !('domain' in props)) {
    			console.warn("<Cartogram> was created without expected prop 'domain'");
    		}

    		if (/*hoverTextFn*/ ctx[1] === undefined && !('hoverTextFn' in props)) {
    			console.warn("<Cartogram> was created without expected prop 'hoverTextFn'");
    		}

    		if (/*legendTitle*/ ctx[31] === undefined && !('legendTitle' in props)) {
    			console.warn("<Cartogram> was created without expected prop 'legendTitle'");
    		}

    		if (/*slug*/ ctx[3] === undefined && !('slug' in props)) {
    			console.warn("<Cartogram> was created without expected prop 'slug'");
    		}
    	}

    	get data() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodeSize() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodeSize(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get domain() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set domain(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helpText() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helpText(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categoryFn() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categoryFn(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorFn() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorFn(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classesFn() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classesFn(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoverTextFn() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoverTextFn(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onHoverFn() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onHoverFn(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabels() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabels(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rerenderFn() {
    		return this.$$.ctx[30];
    	}

    	set rerenderFn(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get annotationShowing() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set annotationShowing(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legendTitle() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legendTitle(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get slug() {
    		throw new Error("<Cartogram>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slug(value) {
    		throw new Error("<Cartogram>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var pm25data = [
    	{
    		id: "AND",
    		pm25: 9.1,
    		x: 249.586,
    		y: 157
    	},
    	{
    		id: "ARE",
    		pm25: 44,
    		x: 423.658,
    		y: 264.134
    	},
    	{
    		id: "AFG",
    		pm25: 52,
    		x: 438.872,
    		y: 226.557
    	},
    	{
    		id: "ATG",
    		pm25: 18,
    		x: 163.133,
    		y: 193.045
    	},
    	{
    		id: "ALB",
    		pm25: 19,
    		x: 302.054,
    		y: 210.522
    	},
    	{
    		id: "ARM",
    		pm25: 34,
    		x: 406.958,
    		y: 210.339
    	},
    	{
    		id: "AGO",
    		pm25: 28,
    		x: 302.154,
    		y: 332.935
    	},
    	{
    		id: "ARG",
    		pm25: 14,
    		x: 145.674,
    		y: 332.966
    	},
    	{
    		id: "ASM",
    		pm25: 6.3,
    		x: 669.883,
    		y: 332.934
    	},
    	{
    		id: "AUT",
    		pm25: 12,
    		x: 302.054,
    		y: 158.045
    	},
    	{
    		id: "AUS",
    		pm25: 6.7,
    		x: 546.88,
    		y: 332.934
    	},
    	{
    		id: "AZE",
    		pm25: 25,
    		x: 406.958,
    		y: 193.013
    	},
    	{
    		id: "BIH",
    		pm25: 29,
    		x: 319.514,
    		y: 193.013
    	},
    	{
    		id: "BRB",
    		pm25: 21,
    		x: 180.642,
    		y: 210.554
    	},
    	{
    		id: "BGD",
    		pm25: 63,
    		x: 495.996,
    		y: 246.162
    	},
    	{
    		id: "BEL",
    		pm25: 13,
    		x: 249.578,
    		y: 140.586
    	},
    	{
    		id: "BFA",
    		pm25: 54,
    		x: 283.234,
    		y: 263.277
    	},
    	{
    		id: "BGR",
    		pm25: 19,
    		x: 337.022,
    		y: 175.554
    	},
    	{
    		id: "BHR",
    		pm25: 59,
    		x: 445.356,
    		y: 245.851
    	},
    	{
    		id: "BDI",
    		pm25: 33,
    		x: 354.581,
    		y: 332.934
    	},
    	{
    		id: "BEN",
    		pm25: 47,
    		x: 283.829,
    		y: 281.427
    	},
    	{
    		id: "BMU",
    		pm25: 7.1,
    		x: 110.706,
    		y: 158.126
    	},
    	{
    		id: "BRN",
    		pm25: 7.7,
    		x: 529.371,
    		y: 280.458
    	},
    	{
    		id: "BOL",
    		pm25: 27,
    		x: 145.674,
    		y: 297.998
    	},
    	{
    		id: "BRA",
    		pm25: 12,
    		x: 163.133,
    		y: 297.998
    	},
    	{
    		id: "BHS",
    		pm25: 16,
    		x: 110.656,
    		y: 175.586
    	},
    	{
    		id: "BTN",
    		pm25: 40,
    		x: 499.383,
    		y: 227.941
    	},
    	{
    		id: "BWA",
    		pm25: 25,
    		x: 319.662,
    		y: 350.443
    	},
    	{
    		id: "BLR",
    		pm25: 16,
    		x: 337.022,
    		y: 123.077
    	},
    	{
    		id: "BLZ",
    		pm25: 21,
    		x: 75.688,
    		y: 193.045
    	},
    	{
    		id: "CAN",
    		pm25: 7.1,
    		x: 75.688,
    		y: 140.618
    	},
    	{
    		id: "COD",
    		pm25: 36,
    		x: 319.662,
    		y: 318.748
    	},
    	{
    		id: "CAF",
    		pm25: 46,
    		x: 345.997,
    		y: 297.967
    	},
    	{
    		id: "COG",
    		pm25: 39,
    		x: 302.154,
    		y: 317.582
    	},
    	{
    		id: "CHE",
    		pm25: 9.9,
    		x: 284.546,
    		y: 158.045
    	},
    	{
    		id: "CIV",
    		pm25: 56,
    		x: 248.138,
    		y: 282.185
    	},
    	{
    		id: "CHL",
    		pm25: 23,
    		x: 128.165,
    		y: 332.966
    	},
    	{
    		id: "CMR",
    		pm25: 64,
    		x: 327.138,
    		y: 300.845
    	},
    	{
    		id: "CHN",
    		pm25: 48,
    		x: 511.912,
    		y: 210.521
    	},
    	{
    		id: "COL",
    		pm25: 22,
    		x: 128.165,
    		y: 280.49
    	},
    	{
    		id: "CRI",
    		pm25: 17,
    		x: 93.197,
    		y: 245.522
    	},
    	{
    		id: "CUB",
    		pm25: 18,
    		x: 110.656,
    		y: 193.045
    	},
    	{
    		id: "CPV",
    		pm25: 51,
    		x: 224.294,
    		y: 228.03
    	},
    	{
    		id: "CYP",
    		pm25: 16,
    		x: 354.531,
    		y: 228.03
    	},
    	{
    		id: "CZE",
    		pm25: 17,
    		x: 302.054,
    		y: 140.586
    	},
    	{
    		id: "DEU",
    		pm25: 12,
    		x: 284.546,
    		y: 140.586
    	},
    	{
    		id: "DJI",
    		pm25: 43,
    		x: 371.99,
    		y: 280.458
    	},
    	{
    		id: "DNK",
    		pm25: 9.8,
    		x: 284.546,
    		y: 123.077
    	},
    	{
    		id: "DMA",
    		pm25: 19,
    		x: 163.133,
    		y: 228.013
    	},
    	{
    		id: "DOM",
    		pm25: 18,
    		x: 145.674,
    		y: 193.045
    	},
    	{
    		id: "DZA",
    		pm25: 33,
    		x: 284.595,
    		y: 225.701
    	},
    	{
    		id: "ECU",
    		pm25: 20,
    		x: 128.165,
    		y: 297.998
    	},
    	{
    		id: "EST",
    		pm25: 5.9,
    		x: 337.022,
    		y: 88.109
    	},
    	{
    		id: "EGY",
    		pm25: 68,
    		x: 337.279,
    		y: 237.984
    	},
    	{
    		id: "ERI",
    		pm25: 44,
    		x: 363.158,
    		y: 262.998
    	},
    	{
    		id: "ESP",
    		pm25: 9.7,
    		x: 249.498,
    		y: 175.554
    	},
    	{
    		id: "ETH",
    		pm25: 34,
    		x: 354.482,
    		y: 280.507
    	},
    	{
    		id: "FIN",
    		pm25: 5.6,
    		x: 319.514,
    		y: 88.109
    	},
    	{
    		id: "FJI",
    		pm25: 11,
    		x: 634.374,
    		y: 350.443
    	},
    	{
    		id: "FSM",
    		pm25: 10,
    		x: 599.357,
    		y: 297.966
    	},
    	{
    		id: "FRA",
    		pm25: 11,
    		x: 267.086,
    		y: 158.045
    	},
    	{
    		id: "GAB",
    		pm25: 37,
    		x: 309.13,
    		y: 300.188
    	},
    	{
    		id: "GBR",
    		pm25: 10,
    		x: 249.578,
    		y: 105.618
    	},
    	{
    		id: "GRD",
    		pm25: 21,
    		x: 163.133,
    		y: 245.522
    	},
    	{
    		id: "GEO",
    		pm25: 18,
    		x: 389.499,
    		y: 193.013
    	},
    	{
    		id: "GHA",
    		pm25: 54,
    		x: 264.489,
    		y: 263.277
    	},
    	{
    		id: "GRL",
    		pm25: 6.5,
    		x: 109.706,
    		y: 88.109
    	},
    	{
    		id: "GMB",
    		pm25: 58,
    		x: 243.112,
    		y: 244.105
    	},
    	{
    		id: "GIN",
    		pm25: 53,
    		x: 245.826,
    		y: 263.195
    	},
    	{
    		id: "GNQ",
    		pm25: 45,
    		x: 292.685,
    		y: 300.867
    	},
    	{
    		id: "GRC",
    		pm25: 14,
    		x: 337.022,
    		y: 210.522
    	},
    	{
    		id: "GTM",
    		pm25: 28,
    		x: 58.229,
    		y: 193.045
    	},
    	{
    		id: "GUM",
    		pm25: 8.2,
    		x: 581,
    		y: 283.789
    	},
    	{
    		id: "GNB",
    		pm25: 54,
    		x: 227.163,
    		y: 263.173
    	},
    	{
    		id: "GUY",
    		pm25: 20,
    		x: 163.133,
    		y: 280.49
    	},
    	{
    		id: "HND",
    		pm25: 23,
    		x: 75.688,
    		y: 210.554
    	},
    	{
    		id: "HRV",
    		pm25: 18,
    		x: 302.054,
    		y: 193.013
    	},
    	{
    		id: "HTI",
    		pm25: 19,
    		x: 128.165,
    		y: 193.045
    	},
    	{
    		id: "HUN",
    		pm25: 16,
    		x: 319.514,
    		y: 158.045
    	},
    	{
    		id: "IDN",
    		pm25: 19,
    		x: 529.371,
    		y: 297.966
    	},
    	{
    		id: "IRL",
    		pm25: 7.9,
    		x: 232.069,
    		y: 105.618
    	},
    	{
    		id: "ISR",
    		pm25: 20,
    		x: 371.99,
    		y: 245.49
    	},
    	{
    		id: "IND",
    		pm25: 83,
    		x: 474.411,
    		y: 247.577
    	},
    	{
    		id: "IRQ",
    		pm25: 48,
    		x: 404.914,
    		y: 226.745
    	},
    	{
    		id: "IRN",
    		pm25: 38,
    		x: 421.722,
    		y: 227.667
    	},
    	{
    		id: "ISL",
    		pm25: 5.7,
    		x: 162.133,
    		y: 88.109
    	},
    	{
    		id: "ITA",
    		pm25: 16,
    		x: 284.546,
    		y: 175.554
    	},
    	{
    		id: "JAM",
    		pm25: 15,
    		x: 110.656,
    		y: 210.554
    	},
    	{
    		id: "JOR",
    		pm25: 31,
    		x: 388.484,
    		y: 245.49
    	},
    	{
    		id: "JPN",
    		pm25: 13,
    		x: 564.389,
    		y: 193.013
    	},
    	{
    		id: "KEN",
    		pm25: 22,
    		x: 354.581,
    		y: 315.475
    	},
    	{
    		id: "KGZ",
    		pm25: 24,
    		x: 459.435,
    		y: 193.012
    	},
    	{
    		id: "KHM",
    		pm25: 22,
    		x: 529.371,
    		y: 245.49
    	},
    	{
    		id: "KIR",
    		pm25: 9.5,
    		x: 634.374,
    		y: 315.475
    	},
    	{
    		id: "COM",
    		pm25: 17,
    		x: 407.008,
    		y: 332.934
    	},
    	{
    		id: "KNA",
    		pm25: 8.8,
    		x: 145.674,
    		y: 210.554
    	},
    	{
    		id: "PRK",
    		pm25: 44,
    		x: 529.372,
    		y: 193.013
    	},
    	{
    		id: "KOR",
    		pm25: 27,
    		x: 529.371,
    		y: 210.522
    	},
    	{
    		id: "KWT",
    		pm25: 61,
    		x: 425.651,
    		y: 245.694
    	},
    	{
    		id: "KAZ",
    		pm25: 20,
    		x: 476.944,
    		y: 175.554
    	},
    	{
    		id: "LAO",
    		pm25: 21,
    		x: 529.372,
    		y: 228.03
    	},
    	{
    		id: "LBN",
    		pm25: 29,
    		x: 371.989,
    		y: 228.03
    	},
    	{
    		id: "LCA",
    		pm25: 21,
    		x: 163.133,
    		y: 210.554
    	},
    	{
    		id: "LKA",
    		pm25: 20,
    		x: 476.944,
    		y: 264.977
    	},
    	{
    		id: "LBR",
    		pm25: 51,
    		x: 257.351,
    		y: 300.844
    	},
    	{
    		id: "LSO",
    		pm25: 28,
    		x: 337.122,
    		y: 385.411
    	},
    	{
    		id: "LTU",
    		pm25: 10,
    		x: 319.514,
    		y: 105.618
    	},
    	{
    		id: "LUX",
    		pm25: 10,
    		x: 267.086,
    		y: 140.586
    	},
    	{
    		id: "LVA",
    		pm25: 12,
    		x: 337.022,
    		y: 105.618
    	},
    	{
    		id: "LBY",
    		pm25: 39,
    		x: 318.782,
    		y: 240.4
    	},
    	{
    		id: "MAR",
    		pm25: 35,
    		x: 264.87,
    		y: 226.556
    	},
    	{
    		id: "MCO",
    		pm25: 12,
    		x: 266.494,
    		y: 174.645
    	},
    	{
    		id: "MDA",
    		pm25: 14,
    		x: 354.531,
    		y: 158.045
    	},
    	{
    		id: "MNE",
    		pm25: 21,
    		x: 319.514,
    		y: 210.522
    	},
    	{
    		id: "MDG",
    		pm25: 18,
    		x: 407.008,
    		y: 350.443
    	},
    	{
    		id: "MHL",
    		pm25: 9,
    		x: 616.866,
    		y: 297.966
    	},
    	{
    		id: "MKD",
    		pm25: 30,
    		x: 337.022,
    		y: 193.013
    	},
    	{
    		id: "MLI",
    		pm25: 61,
    		x: 303.21,
    		y: 261.079
    	},
    	{
    		id: "MMR",
    		pm25: 29,
    		x: 514.522,
    		y: 228.03
    	},
    	{
    		id: "MNG",
    		pm25: 38,
    		x: 494.403,
    		y: 193.013
    	},
    	{
    		id: "MRT",
    		pm25: 67,
    		x: 282.896,
    		y: 243.52
    	},
    	{
    		id: "MLT",
    		pm25: 13,
    		x: 267.186,
    		y: 193.418
    	},
    	{
    		id: "MUS",
    		pm25: 15,
    		x: 424.467,
    		y: 350.443
    	},
    	{
    		id: "MDV",
    		pm25: 11,
    		x: 459.435,
    		y: 297.966
    	},
    	{
    		id: "MWI",
    		pm25: 22,
    		x: 337.122,
    		y: 332.935
    	},
    	{
    		id: "MEX",
    		pm25: 20,
    		x: 75.688,
    		y: 175.586
    	},
    	{
    		id: "MYS",
    		pm25: 17,
    		x: 511.912,
    		y: 262.999
    	},
    	{
    		id: "MOZ",
    		pm25: 21,
    		x: 354.581,
    		y: 350.443
    	},
    	{
    		id: "NAM",
    		pm25: 24,
    		x: 302.154,
    		y: 350.443
    	},
    	{
    		id: "NER",
    		pm25: 80,
    		x: 324.44,
    		y: 259.746
    	},
    	{
    		id: "NGA",
    		pm25: 70,
    		x: 303.209,
    		y: 281.647
    	},
    	{
    		id: "NIC",
    		pm25: 20,
    		x: 75.688,
    		y: 228.013
    	},
    	{
    		id: "NLD",
    		pm25: 12,
    		x: 267.086,
    		y: 123.077
    	},
    	{
    		id: "NOR",
    		pm25: 6.6,
    		x: 284.546,
    		y: 88.109
    	},
    	{
    		id: "NPL",
    		pm25: 83,
    		x: 479.746,
    		y: 224.575
    	},
    	{
    		id: "NRU",
    		pm25: 5.9,
    		x: 616.866,
    		y: 315.475
    	},
    	{
    		id: "NIU",
    		pm25: 6.8,
    		x: 669.392,
    		y: 350.443
    	},
    	{
    		id: "NZL",
    		pm25: 6,
    		x: 564.389,
    		y: 350.443
    	},
    	{
    		id: "OMN",
    		pm25: 45,
    		x: 406.55,
    		y: 264.224
    	},
    	{
    		id: "PAN",
    		pm25: 13,
    		x: 110.656,
    		y: 263.03
    	},
    	{
    		id: "PER",
    		pm25: 31,
    		x: 128.165,
    		y: 315.458
    	},
    	{
    		id: "PNG",
    		pm25: 16,
    		x: 546.88,
    		y: 297.966
    	},
    	{
    		id: "PHL",
    		pm25: 19,
    		x: 564.389,
    		y: 262.998
    	},
    	{
    		id: "PAK",
    		pm25: 63,
    		x: 458.163,
    		y: 225.992
    	},
    	{
    		id: "POL",
    		pm25: 23,
    		x: 302.054,
    		y: 123.077
    	},
    	{
    		id: "PSE",
    		pm25: 31,
    		x: 354.958,
    		y: 245.489
    	},
    	{
    		id: "PRT",
    		pm25: 8.3,
    		x: 232.069,
    		y: 175.554
    	},
    	{
    		id: "PLW",
    		pm25: 6.9,
    		x: 581.898,
    		y: 297.966
    	},
    	{
    		id: "PRY",
    		pm25: 13,
    		x: 145.674,
    		y: 315.458
    	},
    	{
    		id: "QAT",
    		pm25: 76,
    		x: 443.194,
    		y: 266.652
    	},
    	{
    		id: "ROU",
    		pm25: 16,
    		x: 337.022,
    		y: 158.045
    	},
    	{
    		id: "SRB",
    		pm25: 25,
    		x: 319.514,
    		y: 175.554
    	},
    	{
    		id: "RUS",
    		pm25: 12,
    		x: 476.944,
    		y: 158.045
    	},
    	{
    		id: "RWA",
    		pm25: 36,
    		x: 337.122,
    		y: 318.749
    	},
    	{
    		id: "SAU",
    		pm25: 62,
    		x: 405.714,
    		y: 245.617
    	},
    	{
    		id: "SLB",
    		pm25: 13,
    		x: 599.357,
    		y: 332.934
    	},
    	{
    		id: "SYC",
    		pm25: 16,
    		x: 422.555,
    		y: 310.705
    	},
    	{
    		id: "SDN",
    		pm25: 55,
    		x: 345.194,
    		y: 262.998
    	},
    	{
    		id: "SWE",
    		pm25: 5.6,
    		x: 302.054,
    		y: 88.109
    	},
    	{
    		id: "SGP",
    		pm25: 19,
    		x: 511.912,
    		y: 280.458
    	},
    	{
    		id: "SVN",
    		pm25: 17,
    		x: 302.054,
    		y: 175.554
    	},
    	{
    		id: "SVK",
    		pm25: 18,
    		x: 319.514,
    		y: 140.586
    	},
    	{
    		id: "SLE",
    		pm25: 51,
    		x: 229.48,
    		y: 281.669
    	},
    	{
    		id: "SMR",
    		pm25: 9.9,
    		x: 284.546,
    		y: 193.062
    	},
    	{
    		id: "SEN",
    		pm25: 60,
    		x: 262.66,
    		y: 244.051
    	},
    	{
    		id: "SOM",
    		pm25: 30,
    		x: 377.088,
    		y: 297.966
    	},
    	{
    		id: "SUR",
    		pm25: 21,
    		x: 180.642,
    		y: 280.49
    	},
    	{
    		id: "STP",
    		pm25: 31,
    		x: 276.7,
    		y: 318.444
    	},
    	{
    		id: "SLV",
    		pm25: 22,
    		x: 58.229,
    		y: 210.554
    	},
    	{
    		id: "SYR",
    		pm25: 31,
    		x: 388.827,
    		y: 228.03
    	},
    	{
    		id: "TCD",
    		pm25: 59,
    		x: 323.586,
    		y: 280.911
    	},
    	{
    		id: "TGO",
    		pm25: 46,
    		x: 266.363,
    		y: 281.339
    	},
    	{
    		id: "THA",
    		pm25: 27,
    		x: 512.853,
    		y: 245.49
    	},
    	{
    		id: "TJK",
    		pm25: 38,
    		x: 459.435,
    		y: 207.966
    	},
    	{
    		id: "TKL",
    		pm25: 6.7,
    		x: 669.392,
    		y: 315.426
    	},
    	{
    		id: "TLS",
    		pm25: 16,
    		x: 529.371,
    		y: 315.475
    	},
    	{
    		id: "TKM",
    		pm25: 26,
    		x: 441.421,
    		y: 210.521
    	},
    	{
    		id: "TUN",
    		pm25: 30,
    		x: 302.104,
    		y: 244.036
    	},
    	{
    		id: "TON",
    		pm25: 11,
    		x: 651.883,
    		y: 351.254
    	},
    	{
    		id: "TUR",
    		pm25: 26,
    		x: 371.99,
    		y: 210.522
    	},
    	{
    		id: "TTO",
    		pm25: 22,
    		x: 145.674,
    		y: 245.522
    	},
    	{
    		id: "TUV",
    		pm25: 6,
    		x: 651.883,
    		y: 315.426
    	},
    	{
    		id: "TZA",
    		pm25: 25,
    		x: 372.04,
    		y: 332.934
    	},
    	{
    		id: "UKR",
    		pm25: 15,
    		x: 337.022,
    		y: 140.586
    	},
    	{
    		id: "UGA",
    		pm25: 35,
    		x: 362.332,
    		y: 297.967
    	},
    	{
    		id: "USA",
    		pm25: 7.7,
    		x: 75.688,
    		y: 158.077
    	},
    	{
    		id: "URY",
    		pm25: 9.5,
    		x: 163.133,
    		y: 315.458
    	},
    	{
    		id: "UZB",
    		pm25: 35,
    		x: 441.976,
    		y: 193.013
    	},
    	{
    		id: "VCT",
    		pm25: 21,
    		x: 145.674,
    		y: 228.013
    	},
    	{
    		id: "VEN",
    		pm25: 22,
    		x: 145.674,
    		y: 280.49
    	},
    	{
    		id: "VIR",
    		pm25: 9,
    		x: 128.165,
    		y: 210.554
    	},
    	{
    		id: "VNM",
    		pm25: 20,
    		x: 546.88,
    		y: 245.49
    	},
    	{
    		id: "VUT",
    		pm25: 13,
    		x: 616.866,
    		y: 350.443
    	},
    	{
    		id: "WSM",
    		pm25: 11,
    		x: 652.374,
    		y: 332.934
    	},
    	{
    		id: "YEM",
    		pm25: 44,
    		x: 387.197,
    		y: 262.998
    	},
    	{
    		id: "ZAF",
    		pm25: 29,
    		x: 319.662,
    		y: 367.902
    	},
    	{
    		id: "ZMB",
    		pm25: 26,
    		x: 319.662,
    		y: 333.149
    	},
    	{
    		id: "ZWE",
    		pm25: 21,
    		x: 337.122,
    		y: 350.443
    	}
    ];

    var countries = [
    	{
    		code: "ARG",
    		x: 219.1,
    		y: 531.2
    	},
    	{
    		code: "AUS",
    		x: 1030,
    		y: 566.4
    	},
    	{
    		code: "AUT",
    		x: 536.4,
    		y: 213.8
    	},
    	{
    		code: "BEL",
    		x: 430.6,
    		y: 178.6
    	},
    	{
    		code: "BGR",
    		x: 606.9,
    		y: 249.1
    	},
    	{
    		code: "BRA",
    		x: 254.3,
    		y: 460.6
    	},
    	{
    		code: "CAN",
    		x: 78,
    		y: 143.4
    	},
    	{
    		code: "CHN",
    		x: 959.5,
    		y: 319.6
    	},
    	{
    		code: "CYP",
    		x: 642.2,
    		y: 354.9
    	},
    	{
    		code: "CZE",
    		x: 536.4,
    		y: 178.6
    	},
    	{
    		code: "DEU",
    		x: 501.1,
    		y: 178.6
    	},
    	{
    		code: "DNK",
    		x: 501.1,
    		y: 143.3
    	},
    	{
    		code: "ESP",
    		x: 430.6,
    		y: 249.1
    	},
    	{
    		code: "EST",
    		x: 606.9,
    		y: 72.8
    	},
    	{
    		code: "FIN",
    		x: 571.6,
    		y: 72.8
    	},
    	{
    		code: "FRA",
    		x: 465.9,
    		y: 213.8
    	},
    	{
    		code: "GBR",
    		x: 430.6,
    		y: 108.1
    	},
    	{
    		code: "GRC",
    		x: 606.9,
    		y: 319.6
    	},
    	{
    		code: "HRV",
    		x: 536.4,
    		y: 284.3
    	},
    	{
    		code: "HUN",
    		x: 571.6,
    		y: 213.8
    	},
    	{
    		code: "IDN",
    		x: 994.7,
    		y: 495.9
    	},
    	{
    		code: "IND",
    		x: 889,
    		y: 390.1
    	},
    	{
    		code: "IRL",
    		x: 395.3,
    		y: 108.1
    	},
    	{
    		code: "ISL",
    		x: 254.3,
    		y: 72.8
    	},
    	{
    		code: "ITA",
    		x: 501.1,
    		y: 249.1
    	},
    	{
    		code: "JPN",
    		x: 1065.3,
    		y: 284.3
    	},
    	{
    		code: "KOR",
    		x: 994.7,
    		y: 319.6
    	},
    	{
    		code: "LTU",
    		x: 571.6,
    		y: 108.1
    	},
    	{
    		code: "LUX",
    		x: 465.9,
    		y: 178.6
    	},
    	{
    		code: "LVA",
    		x: 606.9,
    		y: 108.1
    	},
    	{
    		code: "MEX",
    		x: 78,
    		y: 213.9
    	},
    	{
    		code: "MLT",
    		x: 466.1,
    		y: 284.4
    	},
    	{
    		code: "NLD",
    		x: 465.9,
    		y: 143.3
    	},
    	{
    		code: "POL",
    		x: 536.4,
    		y: 143.3
    	},
    	{
    		code: "PRT",
    		x: 395.3,
    		y: 249.1
    	},
    	{
    		code: "ROU",
    		x: 606.9,
    		y: 213.8
    	},
    	{
    		code: "RUS",
    		x: 889,
    		y: 213.8
    	},
    	{
    		code: "SAU",
    		x: 747.9,
    		y: 390.1
    	},
    	{
    		code: "SVK",
    		x: 571.6,
    		y: 178.6
    	},
    	{
    		code: "SVN",
    		x: 536.4,
    		y: 249.1
    	},
    	{
    		code: "SWE",
    		x: 536.4,
    		y: 72.8
    	},
    	{
    		code: "TUR",
    		x: 677.4,
    		y: 319.6
    	},
    	{
    		code: "USA",
    		x: 78,
    		y: 178.6
    	},
    	{
    		code: "ZAF",
    		x: 571.9,
    		y: 636.9
    	},
    	{
    		code: "ABW",
    		x: null,
    		y: null
    	},
    	{
    		code: "AFG",
    		x: 818.5,
    		y: 354.9
    	},
    	{
    		code: "AGO",
    		x: 536.6,
    		y: 566.4
    	},
    	{
    		code: "ALB",
    		x: 536.4,
    		y: 319.6
    	},
    	{
    		code: "AND",
    		x: null,
    		y: null
    	},
    	{
    		code: "ARE",
    		x: 783.2,
    		y: 425.4
    	},
    	{
    		code: "ARM",
    		x: 747.9,
    		y: 319.6
    	},
    	{
    		code: "ATG",
    		x: 254.3,
    		y: 249.1
    	},
    	{
    		code: "AZE",
    		x: 747.9,
    		y: 284.3
    	},
    	{
    		code: "BDI",
    		x: 642.3,
    		y: 566.4
    	},
    	{
    		code: "BEN",
    		x: 501.1,
    		y: 460.6
    	},
    	{
    		code: "BFA",
    		x: 500.9,
    		y: 425.4
    	},
    	{
    		code: "BGD",
    		x: 924.2,
    		y: 390.1
    	},
    	{
    		code: "BHR",
    		x: 818.5,
    		y: 390.1
    	},
    	{
    		code: "BHS",
    		x: 148.5,
    		y: 213.9
    	},
    	{
    		code: "BIH",
    		x: 571.6,
    		y: 284.3
    	},
    	{
    		code: "BLR",
    		x: 606.9,
    		y: 143.3
    	},
    	{
    		code: "BLZ",
    		x: 78,
    		y: 249.1
    	},
    	{
    		code: "BOL",
    		x: 219.1,
    		y: 460.6
    	},
    	{
    		code: "BRB",
    		x: 289.6,
    		y: 284.4
    	},
    	{
    		code: "BRN",
    		x: 994.7,
    		y: 460.6
    	},
    	{
    		code: "BTN",
    		x: 924.2,
    		y: 354.9
    	},
    	{
    		code: "BWA",
    		x: 571.9,
    		y: 601.7
    	},
    	{
    		code: "CAF",
    		x: 607.1,
    		y: 495.9
    	},
    	{
    		code: "CHE",
    		x: 501.1,
    		y: 213.8
    	},
    	{
    		code: "CHL",
    		x: 183.8,
    		y: 531.2
    	},
    	{
    		code: "CIV",
    		x: 430.7,
    		y: 460.6
    	},
    	{
    		code: "CMR",
    		x: 571.5,
    		y: 495.9
    	},
    	{
    		code: "COD",
    		x: 571.9,
    		y: 531.2
    	},
    	{
    		code: "COG",
    		x: 536.6,
    		y: 531.2
    	},
    	{
    		code: "COL",
    		x: 183.8,
    		y: 425.4
    	},
    	{
    		code: "COM",
    		x: 748,
    		y: 566.4
    	},
    	{
    		code: "CPV",
    		x: 395.3,
    		y: 354.9
    	},
    	{
    		code: "CRI",
    		x: 113.3,
    		y: 354.9
    	},
    	{
    		code: "CUB",
    		x: 148.5,
    		y: 249.1
    	},
    	{
    		code: "DJI",
    		x: 677.4,
    		y: 460.6
    	},
    	{
    		code: "DMA",
    		x: 254.3,
    		y: 319.6
    	},
    	{
    		code: "DOM",
    		x: 219.1,
    		y: 249.1
    	},
    	{
    		code: "DZA",
    		x: 501.2,
    		y: 354.9
    	},
    	{
    		code: "ECU",
    		x: 183.8,
    		y: 460.6
    	},
    	{
    		code: "EGY",
    		x: 606.8,
    		y: 390.1
    	},
    	{
    		code: "ERI",
    		x: 642.1,
    		y: 425.4
    	},
    	{
    		code: "ETH",
    		x: 642.1,
    		y: 460.7
    	},
    	{
    		code: "FJI",
    		x: 1206.4,
    		y: 601.7
    	},
    	{
    		code: "FSM",
    		x: 1135.8,
    		y: 495.9
    	},
    	{
    		code: "GAB",
    		x: 536.5,
    		y: 495.9
    	},
    	{
    		code: "GEO",
    		x: 712.7,
    		y: 284.3
    	},
    	{
    		code: "GHA",
    		x: 465.8,
    		y: 425.4
    	},
    	{
    		code: "GIN",
    		x: 430.7,
    		y: 425.4
    	},
    	{
    		code: "GMB",
    		x: 430.7,
    		y: 390.1
    	},
    	{
    		code: "GNB",
    		x: 395.4,
    		y: 425.4
    	},
    	{
    		code: "GNQ",
    		x: 501.3,
    		y: 495.9
    	},
    	{
    		code: "GRD",
    		x: 254.3,
    		y: 354.9
    	},
    	{
    		code: "GTM",
    		x: 42.8,
    		y: 249.1
    	},
    	{
    		code: "GUY",
    		x: 254.3,
    		y: 425.4
    	},
    	{
    		code: "HKG",
    		x: null,
    		y: null
    	},
    	{
    		code: "HND",
    		x: 78,
    		y: 284.4
    	},
    	{
    		code: "HTI",
    		x: 183.8,
    		y: 249.1
    	},
    	{
    		code: "IRN",
    		x: 783.2,
    		y: 354.9
    	},
    	{
    		code: "IRQ",
    		x: 747.9,
    		y: 354.9
    	},
    	{
    		code: "ISR",
    		x: 677.4,
    		y: 390.1
    	},
    	{
    		code: "JAM",
    		x: 148.5,
    		y: 284.4
    	},
    	{
    		code: "JOR",
    		x: 712.7,
    		y: 390.1
    	},
    	{
    		code: "KAZ",
    		x: 889,
    		y: 249.1
    	},
    	{
    		code: "KEN",
    		x: 642.3,
    		y: 531.2
    	},
    	{
    		code: "KGZ",
    		x: 853.7,
    		y: 284.3
    	},
    	{
    		code: "KHM",
    		x: 994.7,
    		y: 390.1
    	},
    	{
    		code: "KIR",
    		x: 1206.4,
    		y: 531.2
    	},
    	{
    		code: "KNA",
    		x: 219.1,
    		y: 284.4
    	},
    	{
    		code: "KWT",
    		x: 783.2,
    		y: 390.1
    	},
    	{
    		code: "LAO",
    		x: 994.7,
    		y: 354.9
    	},
    	{
    		code: "LBN",
    		x: 677.4,
    		y: 354.9
    	},
    	{
    		code: "LBR",
    		x: 465.9,
    		y: 495.9
    	},
    	{
    		code: "LBY",
    		x: 571.7,
    		y: 390.1
    	},
    	{
    		code: "LCA",
    		x: 254.3,
    		y: 284.4
    	},
    	{
    		code: "LIE",
    		x: null,
    		y: null
    	},
    	{
    		code: "LKA",
    		x: 889,
    		y: 425.4
    	},
    	{
    		code: "LSO",
    		x: 607.1,
    		y: 672.2
    	},
    	{
    		code: "MAC",
    		x: null,
    		y: null
    	},
    	{
    		code: "MAR",
    		x: 466,
    		y: 354.9
    	},
    	{
    		code: "MCO",
    		x: null,
    		y: null
    	},
    	{
    		code: "MDA",
    		x: 642.2,
    		y: 213.8
    	},
    	{
    		code: "MDG",
    		x: 748,
    		y: 601.7
    	},
    	{
    		code: "MDV",
    		x: 853.7,
    		y: 495.9
    	},
    	{
    		code: "MHL",
    		x: 1171.1,
    		y: 495.9
    	},
    	{
    		code: "MKD",
    		x: 606.9,
    		y: 284.3
    	},
    	{
    		code: "MLI",
    		x: 536.5,
    		y: 425.4
    	},
    	{
    		code: "MMR",
    		x: 959.5,
    		y: 354.9
    	},
    	{
    		code: "MNE",
    		x: 571.6,
    		y: 319.6
    	},
    	{
    		code: "MNG",
    		x: 924.2,
    		y: 284.3
    	},
    	{
    		code: "MOZ",
    		x: 642.3,
    		y: 601.7
    	},
    	{
    		code: "MRT",
    		x: 501.3,
    		y: 390.1
    	},
    	{
    		code: "MUS",
    		x: 783.2,
    		y: 601.7
    	},
    	{
    		code: "MWI",
    		x: 607.1,
    		y: 566.4
    	},
    	{
    		code: "MYS",
    		x: 959.5,
    		y: 425.4
    	},
    	{
    		code: "NAM",
    		x: 536.6,
    		y: 601.7
    	},
    	{
    		code: "NER",
    		x: 571.7,
    		y: 425.4
    	},
    	{
    		code: "NGA",
    		x: 536.6,
    		y: 460.6
    	},
    	{
    		code: "NIC",
    		x: 78,
    		y: 319.6
    	},
    	{
    		code: "NOR",
    		x: 501.1,
    		y: 72.8
    	},
    	{
    		code: "NPL",
    		x: 889,
    		y: 354.9
    	},
    	{
    		code: "NRU",
    		x: 1171.1,
    		y: 531.2
    	},
    	{
    		code: "NZL",
    		x: 1065.3,
    		y: 601.7
    	},
    	{
    		code: "OMN",
    		x: 747.9,
    		y: 425.4
    	},
    	{
    		code: "PAK",
    		x: 853.7,
    		y: 354.9
    	},
    	{
    		code: "PAN",
    		x: 148.5,
    		y: 390.1
    	},
    	{
    		code: "PER",
    		x: 183.8,
    		y: 495.9
    	},
    	{
    		code: "PHL",
    		x: 1065.3,
    		y: 425.4
    	},
    	{
    		code: "PLW",
    		x: 1100.6,
    		y: 495.9
    	},
    	{
    		code: "PNG",
    		x: 1030,
    		y: 495.9
    	},
    	{
    		code: "PRK",
    		x: 994.7,
    		y: 284.3
    	},
    	{
    		code: "PRY",
    		x: 219.1,
    		y: 495.9
    	},
    	{
    		code: "QAT",
    		x: 818.5,
    		y: 425.4
    	},
    	{
    		code: "RWA",
    		x: 607.1,
    		y: 531.2
    	},
    	{
    		code: "SDN",
    		x: 607.1,
    		y: 425.4
    	},
    	{
    		code: "SEN",
    		x: 465.9,
    		y: 390.1
    	},
    	{
    		code: "SGP",
    		x: 959.5,
    		y: 460.6
    	},
    	{
    		code: "SLB",
    		x: 1135.8,
    		y: 566.4
    	},
    	{
    		code: "SLE",
    		x: 395.4,
    		y: 460.6
    	},
    	{
    		code: "SLV",
    		x: 42.8,
    		y: 284.4
    	},
    	{
    		code: "SOM",
    		x: 677.4,
    		y: 495.9
    	},
    	{
    		code: "SRB",
    		x: 571.6,
    		y: 249.1
    	},
    	{
    		code: "SSD",
    		x: 607.1,
    		y: 460.6
    	},
    	{
    		code: "STP",
    		x: 466,
    		y: 531.2
    	},
    	{
    		code: "SUR",
    		x: 289.6,
    		y: 425.4
    	},
    	{
    		code: "SWZ",
    		x: 607.1,
    		y: 636.9
    	},
    	{
    		code: "SYR",
    		x: 712.7,
    		y: 354.9
    	},
    	{
    		code: "TCA",
    		x: null,
    		y: null
    	},
    	{
    		code: "TCD",
    		x: 571.9,
    		y: 460.6
    	},
    	{
    		code: "TGO",
    		x: 466,
    		y: 460.6
    	},
    	{
    		code: "THA",
    		x: 959.5,
    		y: 390.1
    	},
    	{
    		code: "TJK",
    		x: 853.7,
    		y: 319.6
    	},
    	{
    		code: "TKM",
    		x: 818.5,
    		y: 319.6
    	},
    	{
    		code: "TLS",
    		x: 994.7,
    		y: 531.2
    	},
    	{
    		code: "TON",
    		x: 1241.7,
    		y: 601.7
    	},
    	{
    		code: "TTO",
    		x: 219.1,
    		y: 354.9
    	},
    	{
    		code: "TUN",
    		x: 536.5,
    		y: 390.1
    	},
    	{
    		code: "TWN",
    		x: 1065.3,
    		y: 390.1
    	},
    	{
    		code: "TZA",
    		x: 677.5,
    		y: 566.4
    	},
    	{
    		code: "UGA",
    		x: 642.4,
    		y: 495.9
    	},
    	{
    		code: "UKR",
    		x: 606.9,
    		y: 178.6
    	},
    	{
    		code: "URY",
    		x: 254.3,
    		y: 495.9
    	},
    	{
    		code: "UZB",
    		x: 818.5,
    		y: 284.3
    	},
    	{
    		code: "VCT",
    		x: 219.1,
    		y: 319.6
    	},
    	{
    		code: "VEN",
    		x: 219.1,
    		y: 425.4
    	},
    	{
    		code: "VGB",
    		x: null,
    		y: null
    	},
    	{
    		code: "VNM",
    		x: 1030,
    		y: 390.1
    	},
    	{
    		code: "VUT",
    		x: 1171.1,
    		y: 601.7
    	},
    	{
    		code: "WSM",
    		x: 1206.4,
    		y: 566.4
    	},
    	{
    		code: "YEM",
    		x: 712.7,
    		y: 425.4
    	},
    	{
    		code: "ZMB",
    		x: 571.9,
    		y: 566.4
    	},
    	{
    		code: "ZWE",
    		x: 607.1,
    		y: 601.7
    	},
    	{
    		code: "ASM",
    		x: 1241.7,
    		y: 566.4
    	},
    	{
    		code: "BMU",
    		x: 148.6,
    		y: 178.6
    	},
    	{
    		code: "GRL",
    		x: 148.6,
    		y: 72.8
    	},
    	{
    		code: "GUM",
    		x: 1100.6,
    		y: 460.6
    	},
    	{
    		code: "NIU",
    		x: 1277,
    		y: 601.7
    	},
    	{
    		code: "PSE",
    		x: 642.1,
    		y: 390.1
    	},
    	{
    		code: "SYC",
    		x: 748,
    		y: 495.9
    	},
    	{
    		code: "SMR",
    		x: 501.1,
    		y: 284.4
    	},
    	{
    		code: "TKL",
    		x: 1277,
    		y: 531.1
    	},
    	{
    		code: "TUV",
    		x: 1241.7,
    		y: 531.1
    	},
    	{
    		code: "VIR",
    		x: 183.8,
    		y: 284.4
    	}
    ];

    var policies$1 = [
    	{
    		name: "Afghanistan",
    		id: "AFG",
    		"ind-1": 2,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 22.22222222222222,
    		pNo: 100,
    		pAlmost: 22.22222222222222
    	},
    	{
    		name: "Albania",
    		id: "ALB",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 4,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Algeria",
    		id: "DZA",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 66.66666666666667,
    		pNo: 100,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Andorra",
    		id: "AND",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Angola",
    		id: "AGO",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Antigua and Barbuda",
    		id: "ATG",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Argentina",
    		id: "ARG",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 66.66666666666667,
    		pNo: 100,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Armenia",
    		id: "ARM",
    		"ind-1": 2,
    		"tra-1": 1,
    		"tra-2": 2,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 66.66666666666667,
    		pNo: 100,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Australia",
    		id: "AUS",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Austria",
    		id: "AUT",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 66.66666666666667,
    		pNo: 77.77777777777779,
    		pAlmost: 77.77777777777779
    	},
    	{
    		name: "Azerbaijan",
    		id: "AZE",
    		"ind-1": 2,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Bahamas",
    		id: "BHS",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 3,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 100,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Bahrain",
    		id: "BHR",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "Bangladesh",
    		id: "BGD",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Barbados",
    		id: "BRB",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 1,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Belarus",
    		id: "BLR",
    		"ind-1": 3,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 3,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 55.55555555555556,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Belgium",
    		id: "BEL",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Belize",
    		id: "BLZ",
    		"ind-1": 2,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 33.333333333333336,
    		pNo: 100,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Benin",
    		id: "BEN",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Bhutan",
    		id: "BTN",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Bolivia",
    		id: "BOL",
    		"ind-1": 2,
    		"tra-1": 2,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Bosnia and Herzegovina",
    		id: "BIH",
    		"ind-1": 3,
    		"tra-1": 2,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 55.55555555555556,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Botswana",
    		id: "BWA",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Brazil",
    		id: "BRA",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 2,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 66.66666666666667,
    		pNo: 100,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Brunei Darussalam",
    		id: "BRN",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 33.333333333333336,
    		pNo: 88.88888888888889,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Bulgaria",
    		id: "BGR",
    		"ind-1": 2,
    		"tra-1": 2,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 66.66666666666667,
    		pNo: 100,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Burkina Faso",
    		id: "BFA",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "Burundi",
    		id: "BDI",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 1,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Cabo Verde",
    		id: "CPV",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Cambodia",
    		id: "KHM",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Cameroon",
    		id: "CMR",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 100,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Canada",
    		id: "CAN",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Central African Rep.",
    		id: "CAF",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Chad",
    		id: "TCD",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Chile",
    		id: "CHL",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "China",
    		id: "CHN",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 55.55555555555556,
    		pNo: 77.77777777777777,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Colombia",
    		id: "COL",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 66.66666666666667,
    		pNo: 100,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Comoros",
    		id: "COM",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Dem. Rep. of the Congo",
    		id: "COD",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Cook Isl.",
    		id: "#N/A",
    		"ind-1": 1,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 3,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 55.55555555555555,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "Costa Rica",
    		id: "CRI",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 66.66666666666667,
    		pNo: 100,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Côte d’Ivoire",
    		id: "CIV",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 66.66666666666667,
    		pNo: 100,
    		pAlmost: 77.77777777777779
    	},
    	{
    		name: "Croatia",
    		id: "HRV",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 55.55555555555556,
    		pNo: 77.77777777777779,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Cuba",
    		id: "CUB",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 4,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Cyprus",
    		id: "CYP",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 66.66666666666667,
    		pNo: 77.77777777777779,
    		pAlmost: 77.77777777777779
    	},
    	{
    		name: "Czechia",
    		id: "CZE",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 55.55555555555556,
    		pNo: 77.77777777777779,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Denmark",
    		id: "DNK",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Djibouti",
    		id: "DJI",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Dominica",
    		id: "DMA",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Dominican Rep.",
    		id: "DOM",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "Ecuador",
    		id: "ECU",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 2,
    		"aqm-1": 2,
    		pYes: 22.22222222222222,
    		pNo: 88.88888888888889,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Egypt",
    		id: "EGY",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "El Salvador",
    		id: "SLV",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 44.44444444444444,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Equatorial Guinea",
    		id: "GNQ",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Eritrea",
    		id: "ERI",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Estonia",
    		id: "EST",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Ethiopia",
    		id: "ETH",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 11.11111111111111,
    		pNo: 88.88888888888889,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Fiji",
    		id: "FJI",
    		"ind-1": 1,
    		"tra-1": 4,
    		"tra-2": 2,
    		"waste-1": 2,
    		"res-1": 4,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 55.55555555555555,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "Finland",
    		id: "FIN",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "France",
    		id: "FRA",
    		"ind-1": 3,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 44.44444444444444,
    		pNo: 66.66666666666666,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "Gabon",
    		id: "GAB",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Gambia",
    		id: "GMB",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Georgia",
    		id: "GEO",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Germany",
    		id: "DEU",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 55.55555555555556,
    		pNo: 66.66666666666667,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Ghana",
    		id: "GHA",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Greece",
    		id: "GRC",
    		"ind-1": 2,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 44.44444444444444,
    		pNo: 66.66666666666667,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Grenada",
    		id: "GRD",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Guatemala",
    		id: "GTM",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 2,
    		pYes: 22.22222222222222,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Guinea",
    		id: "GIN",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 4,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Guinea-Bissau",
    		id: "GNB",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Guyana",
    		id: "GUY",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Haiti",
    		id: "HTI",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 2,
    		pYes: 11.11111111111111,
    		pNo: 100,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Honduras",
    		id: "HND",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 2,
    		pYes: 22.22222222222222,
    		pNo: 100,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Hungary",
    		id: "HUN",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Iceland",
    		id: "ISL",
    		"ind-1": 2,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 44.44444444444444,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "India",
    		id: "IND",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "Indonesia",
    		id: "IDN",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Islamic Rep. of Iran",
    		id: "IRN",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Iraq",
    		id: "IRQ",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "Ireland",
    		id: "IRL",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 55.55555555555556,
    		pNo: 66.66666666666667,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Israel",
    		id: "ISR",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 77.77777777777777,
    		pNo: 88.88888888888889,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Italy",
    		id: "ITA",
    		"ind-1": 2,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 44.44444444444444,
    		pNo: 66.66666666666667,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Jamaica",
    		id: "JAM",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Japan",
    		id: "JPN",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 55.55555555555556,
    		pNo: 77.77777777777779,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Jordan",
    		id: "JOR",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "Kazakhstan",
    		id: "KAZ",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 2,
    		"res-1": 4,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 1,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "Kenya",
    		id: "KEN",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 2,
    		pYes: 44.44444444444444,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Kiribati",
    		id: "KIR",
    		"ind-1": 1,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 4,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 44.44444444444444,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "Dem. People’s Rep. of Korea",
    		id: "PRK",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 4,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 3,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 55.55555555555556,
    		pNo: 88.88888888888889,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Kuwait",
    		id: "KWT",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 4,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Kyrgyzstan",
    		id: "KGZ",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Lao People’s Dem. Rep.",
    		id: "LAO",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Latvia",
    		id: "LVA",
    		"ind-1": 3,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 33.333333333333336,
    		pNo: 55.55555555555556,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Lebanon",
    		id: "LBN",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 4,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Lesotho",
    		id: "LSO",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 100,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Liberia",
    		id: "LBR",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 100,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Libya",
    		id: "LBY",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 3,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Liechtenstein",
    		id: "LIE",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 66.66666666666667,
    		pNo: 77.77777777777779,
    		pAlmost: 77.77777777777779
    	},
    	{
    		name: "Lithuania",
    		id: "LTU",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Luxembourg",
    		id: "LUX",
    		"ind-1": 3,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 3,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 33.333333333333336,
    		pNo: 66.66666666666667,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Madagascar",
    		id: "MDG",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Malawi",
    		id: "MWI",
    		"ind-1": 2,
    		"tra-1": 1,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 33.333333333333336,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Malaysia",
    		id: "MYS",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 44.44444444444444,
    		pNo: 100,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Maldives",
    		id: "MDV",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 3,
    		pYes: 33.333333333333336,
    		pNo: 88.88888888888889,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Mali",
    		id: "MLI",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 88.88888888888889,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Malta",
    		id: "MLT",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 44.44444444444444,
    		pNo: 55.55555555555556,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Marshall Islands",
    		id: "MHL",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 4,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Mauritania",
    		id: "MRT",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 4,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Mauritius",
    		id: "MUS",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Mexico",
    		id: "MEX",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Fed. States of Micronesia",
    		id: "FSM",
    		"ind-1": 1,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 4,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 44.44444444444444,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "Rep. of Moldova",
    		id: "MDA",
    		"ind-1": 3,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 3,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 55.55555555555556,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Monaco",
    		id: "MCO",
    		"ind-1": 2,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Mongolia",
    		id: "MNG",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Montenegro",
    		id: "MNE",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Morocco",
    		id: "MAR",
    		"ind-1": 1,
    		"tra-1": 4,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 33.333333333333336,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Mozambique",
    		id: "MOZ",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 77.77777777777777,
    		pNo: 100,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Myanmar",
    		id: "MMR",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 2,
    		pYes: 33.333333333333336,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Namibia",
    		id: "NAM",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 88.88888888888889,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Nauru",
    		id: "NRU",
    		"ind-1": 1,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 44.44444444444444,
    		pAlmost: 22.22222222222222
    	},
    	{
    		name: "Nepal",
    		id: "NPL",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 77.77777777777777,
    		pNo: 100,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Netherlands",
    		id: "NLD",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "New Zealand",
    		id: "NZL",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 55.55555555555556,
    		pNo: 77.77777777777779,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Nicaragua",
    		id: "NIC",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 2,
    		pYes: 44.44444444444444,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Niger",
    		id: "NER",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Nigeria",
    		id: "NGA",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Niue",
    		id: "NIU",
    		"ind-1": 3,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 3,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 44.44444444444444,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "North Macedonia",
    		id: "MKD",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Norway",
    		id: "NOR",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Oman",
    		id: "OMN",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Pakistan",
    		id: "PAK",
    		"ind-1": 2,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 2,
    		pYes: 11.11111111111111,
    		pNo: 100,
    		pAlmost: 11.11111111111111
    	},
    	{
    		name: "Palau",
    		id: "PLW",
    		"ind-1": 2,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 44.44444444444444,
    		pAlmost: 11.11111111111111
    	},
    	{
    		name: "Panama",
    		id: "PAN",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 1,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 2,
    		"aqm-1": 2,
    		pYes: 33.333333333333336,
    		pNo: 88.88888888888889,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Papua New Guinea",
    		id: "PNG",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 4,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 55.55555555555556,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Paraguay",
    		id: "PRY",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 33.333333333333336,
    		pNo: 77.77777777777777,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Peru",
    		id: "PER",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 77.77777777777777,
    		pNo: 100,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Philippines",
    		id: "PHL",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Poland",
    		id: "POL",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Portugal",
    		id: "PRT",
    		"ind-1": 3,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 44.44444444444444,
    		pNo: 66.66666666666666,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "Qatar",
    		id: "QAT",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 2,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Congo",
    		id: "COG",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 100,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Romania",
    		id: "ROU",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Russian Fed.",
    		id: "RUS",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Rwanda",
    		id: "RWA",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Samoa",
    		id: "WSM",
    		"ind-1": 1,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 4,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 44.44444444444444,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "San Marino",
    		id: "SMR",
    		"ind-1": 2,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 44.44444444444444,
    		pAlmost: 22.22222222222222
    	},
    	{
    		name: "Sao Tome and Principe",
    		id: "STP",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Saudi Arabia",
    		id: "SAU",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "Senegal",
    		id: "SEN",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Serbia",
    		id: "SRB",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 77.77777777777777,
    		pNo: 100,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Seychelles",
    		id: "SYC",
    		"ind-1": 2,
    		"tra-1": 2,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 22.22222222222222
    	},
    	{
    		name: "Sierra Leone",
    		id: "SLE",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Singapore",
    		id: "SGP",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Slovakia",
    		id: "SVK",
    		"ind-1": 3,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 4,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 33.333333333333336,
    		pNo: 66.66666666666667,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Slovenia",
    		id: "SVN",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 4,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 44.44444444444444,
    		pNo: 66.66666666666667,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Solomon Islands",
    		id: "SLB",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Somalia",
    		id: "SOM",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "South Africa",
    		id: "ZAF",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 77.77777777777777,
    		pNo: 100,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Rep. of Korea",
    		id: "KOR",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 66.66666666666667,
    		pNo: 77.77777777777779,
    		pAlmost: 77.77777777777779
    	},
    	{
    		name: "South Sudan",
    		id: "SSD",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Spain",
    		id: "ESP",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 77.77777777777777,
    		pNo: 100,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Sri Lanka",
    		id: "LKA",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 2,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Saint Vincent and the Grenadines",
    		id: "VCT",
    		"ind-1": 3,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 3,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 33.333333333333336,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Saint Kitts and Nevis",
    		id: "KNA",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Saint Lucia",
    		id: "LCA",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 77.77777777777777,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Sudan",
    		id: "SDN",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Suriname",
    		id: "SUR",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 11.11111111111111,
    		pNo: 100,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "Eswatini",
    		id: "SWZ",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 88.88888888888889,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Sweden",
    		id: "SWE",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Switzerland",
    		id: "CHE",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 100,
    		pNo: 100,
    		pAlmost: 100
    	},
    	{
    		name: "Syrian Arab Rep.",
    		id: "SYR",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "Tajikistan",
    		id: "TJK",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 2,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 55.55555555555555,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "United Rep. of Tanzania",
    		id: "TZA",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "Thailand",
    		id: "THA",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 77.77777777777777,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Timor-Leste",
    		id: "TLS",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Togo",
    		id: "TGO",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 77.77777777777777,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Tonga",
    		id: "TON",
    		"ind-1": 1,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 4,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 44.44444444444444,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "Trinidad and Tobago",
    		id: "TTO",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 2,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Tunisia",
    		id: "TUN",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 55.55555555555556,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Turkey",
    		id: "TUR",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Turkmenistan",
    		id: "TKM",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 4,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Tuvalu",
    		id: "TUV",
    		"ind-1": 1,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 3,
    		pYes: 33.333333333333336,
    		pNo: 77.77777777777777,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Uganda",
    		id: "UGA",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 2,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 33.333333333333336,
    		pNo: 100,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Ukraine",
    		id: "UKR",
    		"ind-1": 3,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 4,
    		"aq-1": 3,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 66.66666666666667,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "United Arab Emirates",
    		id: "ARE",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 2,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "United Kingdom",
    		id: "GBR",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 2,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 55.55555555555556,
    		pNo: 77.77777777777779,
    		pAlmost: 66.66666666666667
    	},
    	{
    		name: "United States of America",
    		id: "USA",
    		"ind-1": 1,
    		"tra-1": 1,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 1,
    		pYes: 88.88888888888889,
    		pNo: 100,
    		pAlmost: 88.88888888888889
    	},
    	{
    		name: "Uruguay",
    		id: "URY",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 1,
    		"waste-1": 1,
    		"res-1": 1,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 77.77777777777777,
    		pNo: 100,
    		pAlmost: 77.77777777777777
    	},
    	{
    		name: "Uzbekistan",
    		id: "UZB",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 4,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Vanuatu",
    		id: "VUT",
    		"ind-1": 2,
    		"tra-1": 3,
    		"tra-2": 4,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 0,
    		pNo: 66.66666666666667,
    		pAlmost: 33.333333333333336
    	},
    	{
    		name: "Venezuela",
    		id: "VEN",
    		"ind-1": 1,
    		"tra-1": 2,
    		"tra-2": 3,
    		"waste-1": 2,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 1,
    		"aqms-1": 1,
    		"aqm-1": 2,
    		pYes: 44.44444444444444,
    		pNo: 100,
    		pAlmost: 55.55555555555556
    	},
    	{
    		name: "Viet Nam",
    		id: "VNM",
    		"ind-1": 2,
    		"tra-1": 2,
    		"tra-2": 2,
    		"waste-1": 3,
    		"res-1": 2,
    		"aq-1": 1,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 77.77777777777777,
    		pAlmost: 33.33333333333333
    	},
    	{
    		name: "Yemen",
    		id: "YEM",
    		"ind-1": 2,
    		"tra-1": 4,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 11.11111111111111,
    		pNo: 66.66666666666666,
    		pAlmost: 44.44444444444444
    	},
    	{
    		name: "Zambia",
    		id: "ZMB",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "Zimbabwe",
    		id: "ZWE",
    		"ind-1": 1,
    		"tra-1": 3,
    		"tra-2": 3,
    		"waste-1": 3,
    		"res-1": 1,
    		"aq-1": 2,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 3,
    		pYes: 22.22222222222222,
    		pNo: 77.77777777777777,
    		pAlmost: 66.66666666666666
    	},
    	{
    		name: "American Samoa",
    		id: "ASM",
    		"ind-1": 4,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 4,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 4,
    		pYes: 0,
    		pNo: 0,
    		pAlmost: 0
    	},
    	{
    		name: "Bermuda",
    		id: "BMU",
    		"ind-1": 4,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 4,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 4,
    		pYes: 0,
    		pNo: 0,
    		pAlmost: 0
    	},
    	{
    		name: "Greenland",
    		id: "GRL",
    		"ind-1": 4,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 4,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 4,
    		pYes: 0,
    		pNo: 0,
    		pAlmost: 0
    	},
    	{
    		name: "Guam",
    		id: "GUM",
    		"ind-1": 4,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 4,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 4,
    		pYes: 0,
    		pNo: 0,
    		pAlmost: 0
    	},
    	{
    		name: "State of Palestine",
    		id: "PSE",
    		"ind-1": 4,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 4,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 4,
    		pYes: 0,
    		pNo: 0,
    		pAlmost: 0
    	},
    	{
    		name: "Tokelau",
    		id: "TKL",
    		"ind-1": 4,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 4,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 4,
    		pYes: 0,
    		pNo: 0,
    		pAlmost: 0
    	},
    	{
    		name: "United States Virgin Islands",
    		id: "VIR",
    		"ind-1": 4,
    		"tra-1": 4,
    		"tra-2": 4,
    		"waste-1": 4,
    		"res-1": 4,
    		"aq-1": 4,
    		"agri-1": 4,
    		"aqms-1": 4,
    		"aqm-1": 4,
    		pYes: 0,
    		pNo: 0,
    		pAlmost: 0
    	}
    ];

    var diseases = [
    	{
    		id: "CHN",
    		short: "China",
    		name: "China",
    		copd: "0.25403873980854347",
    		diabetes: "0.18891831778418244",
    		ischemic: "0.19944217264430647",
    		lungcancer: "0.22630049876695915",
    		lri: "0.1987798182625026",
    		stroke: "0.2474256539837388",
    		nd: "0.09685974699894025"
    	},
    	{
    		id: "PRK",
    		short: "N. Kor.",
    		name: "Dem. People’s Rep. of Korea",
    		copd: "0.18646638218646894",
    		diabetes: "0.09810048410427218",
    		ischemic: "0.12639321425866412",
    		lungcancer: "0.1382626092458508",
    		lri: "0.15143598398488284",
    		stroke: "0.15760912666441354",
    		nd: "0.06269875525333825"
    	},
    	{
    		id: "KHM",
    		short: "Camb.",
    		name: "Cambodia",
    		copd: "0.09341660441236815",
    		diabetes: "0.047109781457337185",
    		ischemic: "0.06321824669847122",
    		lungcancer: "0.0670555444094899",
    		lri: "0.07321957338129854",
    		stroke: "0.07291931448697668",
    		nd: "0.029440288706936983"
    	},
    	{
    		id: "IDN",
    		short: "Indo.",
    		name: "Indonesia",
    		copd: "0.1212899812869454",
    		diabetes: "0.11292852823041398",
    		ischemic: "0.12430627322601756",
    		lungcancer: "0.11473864478977575",
    		lri: "0.09283298641597788",
    		stroke: "0.13427022896424487",
    		nd: "0.051537675025651694"
    	},
    	{
    		id: "LAO",
    		short: "Laos",
    		name: "Lao People’s Dem. Rep.",
    		copd: "0.08568879455162064",
    		diabetes: "0.04270323729175858",
    		ischemic: "0.06040863908255984",
    		lungcancer: "0.0626339827618204",
    		lri: "0.06737513466978201",
    		stroke: "0.07276565925632353",
    		nd: "0.025339891746855997"
    	},
    	{
    		id: "MYS",
    		short: "Mal.",
    		name: "Malaysia",
    		copd: "0.11141089121286346",
    		diabetes: "0.1463464717926109",
    		ischemic: "0.1255323429033967",
    		lungcancer: "0.11780894518249892",
    		lri: "0.08290736265208101",
    		stroke: "0.13135450995953465",
    		nd: "0.06537749789268908"
    	},
    	{
    		id: "MDV",
    		short: "Mald.",
    		name: "Maldives",
    		copd: "0.0694331126102896",
    		diabetes: "0.07735823488962273",
    		ischemic: "0.06752217749656811",
    		lungcancer: "0.06745349919717052",
    		lri: "0.05194974503505838",
    		stroke: "0.07424187820486614",
    		nd: "0.03244086434393066"
    	},
    	{
    		id: "MMR",
    		short: "Mya.",
    		name: "Myanmar",
    		copd: "0.13812617891840573",
    		diabetes: "0.07937771732552765",
    		ischemic: "0.09984459002290222",
    		lungcancer: "0.10496435009038257",
    		lri: "0.10963997981318298",
    		stroke: "0.11963991232663237",
    		nd: "0.0502106048079361"
    	},
    	{
    		id: "PHL",
    		short: "Phil.",
    		name: "Philippines",
    		copd: "0.1110543084244542",
    		diabetes: "0.0960668895970268",
    		ischemic: "0.11339731216075406",
    		lungcancer: "0.10676258295412043",
    		lri: "0.08398531083310995",
    		stroke: "0.1224676977550262",
    		nd: "0.035312923726538256"
    	},
    	{
    		id: "LKA",
    		short: "Sri L.",
    		name: "Sri Lanka",
    		copd: "0.125946864898226",
    		diabetes: "0.11028367168684272",
    		ischemic: "0.11097963228676509",
    		lungcancer: "0.11671880702262677",
    		lri: "0.09784677649860239",
    		stroke: "0.12232779915365054",
    		nd: "0.054518227235560254"
    	},
    	{
    		id: "THA",
    		short: "Tha.",
    		name: "Thailand",
    		copd: "0.17831897647573242",
    		diabetes: "0.16846591717154968",
    		ischemic: "0.152725691868488",
    		lungcancer: "0.16780579403084486",
    		lri: "0.13738667547058586",
    		stroke: "0.18698599589925313",
    		nd: "0.07622926540376979"
    	},
    	{
    		id: "TLS",
    		short: "T.L.",
    		name: "Timor-Leste",
    		copd: "0.07223842406576812",
    		diabetes: "0.03820728414333067",
    		ischemic: "0.05090312187867313",
    		lungcancer: "0.054150953189133086",
    		lri: "0.05673188945375409",
    		stroke: "0.06166669040630232",
    		nd: "0.023892187794717277"
    	},
    	{
    		id: "VNM",
    		short: "Viet.",
    		name: "Viet Nam",
    		copd: "0.12700807713896758",
    		diabetes: "0.10309757614139574",
    		ischemic: "0.10655868809316713",
    		lungcancer: "0.11378499050277013",
    		lri: "0.09801413744346835",
    		stroke: "0.1301840453695901",
    		nd: "0.05463264901425094"
    	},
    	{
    		id: "FJI",
    		short: "Fiji",
    		name: "Fiji",
    		copd: "0.07068026001872788",
    		diabetes: "0.07101635878843808",
    		ischemic: "0.07918031716871692",
    		lungcancer: "0.06774147832566418",
    		lri: "0.05437573923800804",
    		stroke: "0.08440521845996432",
    		nd: "0.03136457351437835"
    	},
    	{
    		id: "KIR",
    		short: "Kiri.",
    		name: "Kiribati",
    		copd: "0.044243844141069015",
    		diabetes: "0.02268114572006882",
    		ischemic: "0.03683950554329445",
    		lungcancer: "0.03146763241651727",
    		lri: "0.034617395367661466",
    		stroke: "0.042967493065681546",
    		nd: "0.009854361770142808"
    	},
    	{
    		id: "MHL",
    		short: "Mar. Is.",
    		name: "Marshall Islands",
    		copd: "0.05531543771218641",
    		diabetes: "0.04124644148221418",
    		ischemic: "0.058772035837061073",
    		lungcancer: "0.046941215595284594",
    		lri: "0.04264035254403222",
    		stroke: "0.067553541628119",
    		nd: "0.01909059259283115"
    	},
    	{
    		id: "FSM",
    		short: "Micr.",
    		name: "Fed. States of Micronesia",
    		copd: "0.06444642544937629",
    		diabetes: "0.0538615612013002",
    		ischemic: "0.06951478072039588",
    		lungcancer: "0.05738203325176631",
    		lri: "0.0499573214305362",
    		stroke: "0.07863121512990641",
    		nd: "0.022852019112529223"
    	},
    	{
    		id: "PNG",
    		short: "Pap. N.G.",
    		name: "Papua New Guinea",
    		copd: "0.05118244079147563",
    		diabetes: "0.024548054563996086",
    		ischemic: "0.03729537671250752",
    		lungcancer: "0.034183022017359455",
    		lri: "0.04024884500805406",
    		stroke: "0.041244050779903466",
    		nd: "0.012063230268551255"
    	},
    	{
    		id: "WSM",
    		short: "Samoa",
    		name: "Samoa",
    		copd: "0.06215747010414236",
    		diabetes: "0.043204059686459066",
    		ischemic: "0.05390144249749508",
    		lungcancer: "0.05273207781721508",
    		lri: "0.04909265927756426",
    		stroke: "0.06304192202717315",
    		nd: "0.022309928981391804"
    	},
    	{
    		id: "SLB",
    		short: "Solo. Is.",
    		name: "Solomon Islands",
    		copd: "0.043432955253099925",
    		diabetes: "0.019484305804284983",
    		ischemic: "0.032925780100258234",
    		lungcancer: "0.029203357818558755",
    		lri: "0.03510129843635089",
    		stroke: "0.03616784035383589",
    		nd: "0.01229208483824953"
    	},
    	{
    		id: "TON",
    		short: "Tonga",
    		name: "Tonga",
    		copd: "0.06781574531503874",
    		diabetes: "0.0594036574937923",
    		ischemic: "0.06189100428915835",
    		lungcancer: "0.06253790813529922",
    		lri: "0.051975284558079926",
    		stroke: "0.06673053900252779",
    		nd: "0.028750689757728452"
    	},
    	{
    		id: "VUT",
    		short: "Van.",
    		name: "Vanuatu",
    		copd: "0.0560706165120616",
    		diabetes: "0.029660750506425713",
    		ischemic: "0.04558654655699982",
    		lungcancer: "0.0428278521743791",
    		lri: "0.044976156862793985",
    		stroke: "0.05232736476201515",
    		nd: "0.016913566791320927"
    	},
    	{
    		id: "ARM",
    		short: "Arm.",
    		name: "Armenia",
    		copd: "0.21698202282668458",
    		diabetes: "0.20408776702363",
    		ischemic: "0.1782694103260711",
    		lungcancer: "0.20349606235427967",
    		lri: "0.16820880922683407",
    		stroke: "0.20957158351103167",
    		nd: "0.10231311989285688"
    	},
    	{
    		id: "AZE",
    		short: "Aze.",
    		name: "Azerbaijan",
    		copd: "0.16759810970444514",
    		diabetes: "0.17538934564895756",
    		ischemic: "0.1625590946834805",
    		lungcancer: "0.163717211094806",
    		lri: "0.1312319751690366",
    		stroke: "0.18561273706258188",
    		nd: "0.08097274766318519"
    	},
    	{
    		id: "GEO",
    		short: "Geo.",
    		name: "Georgia",
    		copd: "0.11833486302546274",
    		diabetes: "0.12027229091453345",
    		ischemic: "0.09851333081729881",
    		lungcancer: "0.11611695077804593",
    		lri: "0.0904360331565685",
    		stroke: "0.11440557166885397",
    		nd: "0.053429303625759976"
    	},
    	{
    		id: "KAZ",
    		short: "Kaz.",
    		name: "Kazakhstan",
    		copd: "0.13610762427780299",
    		diabetes: "0.1467420934288846",
    		ischemic: "0.12620001654938226",
    		lungcancer: "0.13428353583253458",
    		lri: "0.10366423207748267",
    		stroke: "0.1491678986598778",
    		nd: "0.06370034027530622"
    	},
    	{
    		id: "KGZ",
    		short: "Kyr.",
    		name: "Kyrgyzstan",
    		copd: "0.14921408624386448",
    		diabetes: "0.12357494020403724",
    		ischemic: "0.11784483200100321",
    		lungcancer: "0.1325143560536316",
    		lri: "0.11527509966684185",
    		stroke: "0.16135532588925494",
    		nd: "0.05901729374326786"
    	},
    	{
    		id: "MNG",
    		short: "Mon.",
    		name: "Mongolia",
    		copd: "0.21243239878595507",
    		diabetes: "0.15059989007194685",
    		ischemic: "0.1853409485388745",
    		lungcancer: "0.17850868736987954",
    		lri: "0.16865755511701322",
    		stroke: "0.23706652635268924",
    		nd: "0.09071131440591106"
    	},
    	{
    		id: "TJK",
    		short: "Taj.",
    		name: "Tajikistan",
    		copd: "0.20385191541433978",
    		diabetes: "0.14381295867813024",
    		ischemic: "0.16714856419095078",
    		lungcancer: "0.16688098350047115",
    		lri: "0.16266760775850972",
    		stroke: "0.20576663009367777",
    		nd: "0.07343824790297575"
    	},
    	{
    		id: "TKM",
    		short: "Turkm.",
    		name: "Turkmenistan",
    		copd: "0.1719809077175347",
    		diabetes: "0.18546833454702924",
    		ischemic: "0.17096829923544962",
    		lungcancer: "0.16929319951724928",
    		lri: "0.13515077270236775",
    		stroke: "0.213944106095777",
    		nd: "0.07770755557675547"
    	},
    	{
    		id: "UZB",
    		short: "Uzb.",
    		name: "Uzbekistan",
    		copd: "0.21393124900654759",
    		diabetes: "0.18885670475989702",
    		ischemic: "0.20705548935814502",
    		lungcancer: "0.19473059539422358",
    		lri: "0.1696001728096637",
    		stroke: "0.254169890660989",
    		nd: "0.10347324155187256"
    	},
    	{
    		id: "ALB",
    		short: "Alb.",
    		name: "Albania",
    		copd: "0.12396703940919825",
    		diabetes: "0.12597246438189919",
    		ischemic: "0.1028154501280589",
    		lungcancer: "0.12059546914696218",
    		lri: "0.09467463916542",
    		stroke: "0.11184374412674546",
    		nd: "0.0658295446315976"
    	},
    	{
    		id: "BIH",
    		short: "B. and H.",
    		name: "Bosnia and Herzegovina",
    		copd: "0.18672747591538363",
    		diabetes: "0.16326653160638452",
    		ischemic: "0.1465776042169262",
    		lungcancer: "0.17281243831033813",
    		lri: "0.14492265131161375",
    		stroke: "0.17007079209494383",
    		nd: "0.10169992228701487"
    	},
    	{
    		id: "BGR",
    		short: "Bu.",
    		name: "Bulgaria",
    		copd: "0.13169764596183434",
    		diabetes: "0.14962596268628134",
    		ischemic: "0.11364520066561105",
    		lungcancer: "0.13314121248563207",
    		lri: "0.09950433436460551",
    		stroke: "0.12703765017556798",
    		nd: "0.05792990485263031"
    	},
    	{
    		id: "HRV",
    		short: "Cro.",
    		name: "Croatia",
    		copd: "0.12583732565020067",
    		diabetes: "0.15513779319666962",
    		ischemic: "0.10329543916702862",
    		lungcancer: "0.13022399233237783",
    		lri: "0.09419876007783297",
    		stroke: "0.11692273100516452",
    		nd: "0.07183663779201244"
    	},
    	{
    		id: "CZE",
    		short: "Czechia",
    		name: "Czechia",
    		copd: "0.11321717883027496",
    		diabetes: "0.14954114301433677",
    		ischemic: "0.09499128211858758",
    		lungcancer: "0.11980329893813595",
    		lri: "0.08418471063654108",
    		stroke: "0.10301714808191585",
    		nd: "0.06263194365904373"
    	},
    	{
    		id: "HUN",
    		short: "Hun.",
    		name: "Hungary",
    		copd: "0.11213813737970854",
    		diabetes: "0.13737702017231368",
    		ischemic: "0.09528596728955467",
    		lungcancer: "0.11580977402740393",
    		lri: "0.08409316011533155",
    		stroke: "0.10797762872597436",
    		nd: "0.054954487821706414"
    	},
    	{
    		id: "MKD",
    		short: "Mac.",
    		name: "North Macedonia",
    		copd: "0.19519693469029248",
    		diabetes: "0.18121785375397906",
    		ischemic: "0.16962543775198083",
    		lungcancer: "0.18459809285885395",
    		lri: "0.1511814191281101",
    		stroke: "0.18904568095794136",
    		nd: "0.08714828298209659"
    	},
    	{
    		id: "MNE",
    		short: "Mont.",
    		name: "Montenegro",
    		copd: "0.14304943114223262",
    		diabetes: "0.15139869482862214",
    		ischemic: "0.12828815653422448",
    		lungcancer: "0.141397392666058",
    		lri: "0.10898740265138385",
    		stroke: "0.13738738018885152",
    		nd: "0.0730742635276319"
    	},
    	{
    		id: "POL",
    		short: "Pol.",
    		name: "Poland",
    		copd: "0.15147345149980126",
    		diabetes: "0.17200953403015265",
    		ischemic: "0.12529169512070587",
    		lungcancer: "0.15219653924579762",
    		lri: "0.11552338283229463",
    		stroke: "0.14525956307183935",
    		nd: "0.07816902417669"
    	},
    	{
    		id: "ROU",
    		short: "Rom.",
    		name: "Romania",
    		copd: "0.10589976885718853",
    		diabetes: "0.13211604611916017",
    		ischemic: "0.09149290294133292",
    		lungcancer: "0.11005553026806693",
    		lri: "0.07916625551758498",
    		stroke: "0.10157600930629686",
    		nd: "0.059251882638890786"
    	},
    	{
    		id: "SRB",
    		short: "Ser.",
    		name: "Serbia",
    		copd: "0.16898617858585685",
    		diabetes: "0.1723633094597863",
    		ischemic: "0.13916190339106133",
    		lungcancer: "0.16467797921635177",
    		lri: "0.12946616013432918",
    		stroke: "0.15773253613017504",
    		nd: "0.07658277017423447"
    	},
    	{
    		id: "SVK",
    		short: "Slovak.",
    		name: "Slovakia",
    		copd: "0.12545847617192865",
    		diabetes: "0.16276226435488758",
    		ischemic: "0.11022894550308346",
    		lungcancer: "0.13219813051490126",
    		lri: "0.09371565691875919",
    		stroke: "0.1268871623430185",
    		nd: "0.05375011028100823"
    	},
    	{
    		id: "SVN",
    		short: "Slo.",
    		name: "Slovenia",
    		copd: "0.11545677585310496",
    		diabetes: "0.14855202059178826",
    		ischemic: "0.0951000226741076",
    		lungcancer: "0.121275841759343",
    		lri: "0.08612663332704194",
    		stroke: "0.10109690777021958",
    		nd: "0.06685594530188758"
    	},
    	{
    		id: "BLR",
    		short: "Bela.",
    		name: "Belarus",
    		copd: "0.11045983675830465",
    		diabetes: "0.1459224082025811",
    		ischemic: "0.10290781537000633",
    		lungcancer: "0.11683741862207694",
    		lri: "0.08215489028828807",
    		stroke: "0.11544444544156526",
    		nd: "0.06797405381612777"
    	},
    	{
    		id: "EST",
    		short: "Est.",
    		name: "Estonia",
    		copd: "0.02507945598286348",
    		diabetes: "0.03821621317534852",
    		ischemic: "0.02139225472264745",
    		lungcancer: "0.027312088097030274",
    		lri: "0.018148214961683107",
    		stroke: "0.02472364501650077",
    		nd: "0.03482353217284713"
    	},
    	{
    		id: "LVA",
    		short: "Lat.",
    		name: "Latvia",
    		copd: "0.0763428224063646",
    		diabetes: "0.10619984018755184",
    		ischemic: "0.0672299952365543",
    		lungcancer: "0.08214116016914866",
    		lri: "0.05628280398783431",
    		stroke: "0.0716916056497673",
    		nd: "0.05535756344942205"
    	},
    	{
    		id: "LTU",
    		short: "Lith.",
    		name: "Lithuania",
    		copd: "0.0616364095272036",
    		diabetes: "0.09261968275854401",
    		ischemic: "0.05408994401608362",
    		lungcancer: "0.06788539889991824",
    		lri: "0.04508618470091388",
    		stroke: "0.0598785848756191",
    		nd: "0.04572906190349238"
    	},
    	{
    		id: "MDA",
    		short: "Mold.",
    		name: "Rep. of Moldova",
    		copd: "0.09050701914030142",
    		diabetes: "0.11691615740603428",
    		ischemic: "0.08233980582505013",
    		lungcancer: "0.09497325388508662",
    		lri: "0.06804518710547552",
    		stroke: "0.0990580215520863",
    		nd: "0.06164604020464523"
    	},
    	{
    		id: "RUS",
    		short: "Russian Fed.",
    		name: "Russian Fed.",
    		copd: "0.07220563757207657",
    		diabetes: "0.09993692884391812",
    		ischemic: "0.06973176883273643",
    		lungcancer: "0.0764394746329124",
    		lri: "0.052468017675306136",
    		stroke: "0.0736423211615099",
    		nd: "0.050464899222696945"
    	},
    	{
    		id: "UKR",
    		short: "Ukr.",
    		name: "Ukraine",
    		copd: "0.09574709536951836",
    		diabetes: "0.12390786526115123",
    		ischemic: "0.09043638545976186",
    		lungcancer: "0.10077286652933162",
    		lri: "0.07115123398516404",
    		stroke: "0.10277423490888472",
    		nd: "0.06148095392620168"
    	},
    	{
    		id: "BRN",
    		short: "Bru.",
    		name: "Brunei Darussalam",
    		copd: "0.03619610963917448",
    		diabetes: "0.05871071555115775",
    		ischemic: "0.048344458382769115",
    		lungcancer: "0.040629771698747735",
    		lri: "0.026384422142434576",
    		stroke: "0.047945492584575644",
    		nd: "0.03492744750362036"
    	},
    	{
    		id: "JPN",
    		short: "Japan",
    		name: "Japan",
    		copd: "0.08588571737264229",
    		diabetes: "0.12282766882101455",
    		ischemic: "0.06902369541745437",
    		lungcancer: "0.09339282223054683",
    		lri: "0.06323571871874799",
    		stroke: "0.07035353395544186",
    		nd: "0.04400515297550259"
    	},
    	{
    		id: "KOR",
    		short: "Rep. of Korea",
    		name: "Rep. of Korea",
    		copd: "0.18602701569754698",
    		diabetes: "0.20482061970725984",
    		ischemic: "0.1523483597419673",
    		lungcancer: "0.18566871719562975",
    		lri: "0.14171603811331362",
    		stroke: "0.17486183919208576",
    		nd: "0.06308343978454681"
    	},
    	{
    		id: "SGP",
    		short: "Sin.",
    		name: "Singapore",
    		copd: "0.12749765207195102",
    		diabetes: "0.16272572038067554",
    		ischemic: "0.12509935445094433",
    		lungcancer: "0.13355566473619487",
    		lri: "0.09537690852485879",
    		stroke: "0.12735477918210475",
    		nd: "0.06464483242378875"
    	},
    	{
    		id: "AUS",
    		short: "Aus.",
    		name: "Australia",
    		copd: "0.02725694341193061",
    		diabetes: "0.045323408311924406",
    		ischemic: "0.02378767251052338",
    		lungcancer: "0.030834654441964253",
    		lri: "0.01948648294647423",
    		stroke: "0.02323391298821493",
    		nd: "0.04401582993239375"
    	},
    	{
    		id: "NZL",
    		short: "N.Z.",
    		name: "New Zealand",
    		copd: "0.020558763592879562",
    		diabetes: "0.034985099221530876",
    		ischemic: "0.018642765741006512",
    		lungcancer: "0.02341851880831113",
    		lri: "0.014665322643276659",
    		stroke: "0.018267572077364024",
    		nd: "0.04362428765193138"
    	},
    	{
    		id: "AND",
    		short: "And.",
    		name: "Andorra",
    		copd: "0.048712587812243385",
    		diabetes: "0.07769685095951372",
    		ischemic: "0.043589662239589676",
    		lungcancer: "0.05461490669535265",
    		lri: "0.03528027268562505",
    		stroke: "0.043749446449823086",
    		nd: "0.05418983771828415"
    	},
    	{
    		id: "AUT",
    		short: "Au.",
    		name: "Austria",
    		copd: "0.07624402468186653",
    		diabetes: "0.11236409910828048",
    		ischemic: "0.061805366704136784",
    		lungcancer: "0.08355616636315893",
    		lri: "0.05588402282487121",
    		stroke: "0.06560881853733457",
    		nd: "0.05881073699704967"
    	},
    	{
    		id: "BEL",
    		short: "Bel.",
    		name: "Belgium",
    		copd: "0.08054304779854239",
    		diabetes: "0.11814564536379876",
    		ischemic: "0.068019846745212",
    		lungcancer: "0.08818117760873292",
    		lri: "0.05911474956103814",
    		stroke: "0.0693103429846628",
    		nd: "0.055558682651195686"
    	},
    	{
    		id: "CYP",
    		short: "Cyprus",
    		name: "Cyprus",
    		copd: "0.10413754586096209",
    		diabetes: "0.1437641443887331",
    		ischemic: "0.10099394860002342",
    		lungcancer: "0.11191866329926461",
    		lri: "0.0771561211737761",
    		stroke: "0.09687391739031719",
    		nd: "0.04655774665187256"
    	},
    	{
    		id: "DNK",
    		short: "Den.",
    		name: "Denmark",
    		copd: "0.055264445467191906",
    		diabetes: "0.08665304098029776",
    		ischemic: "0.047819125392427185",
    		lungcancer: "0.06170788419888812",
    		lri: "0.04015832386259583",
    		stroke: "0.050239564228813295",
    		nd: "0.05874505384983486"
    	},
    	{
    		id: "FIN",
    		short: "Fin.",
    		name: "Finland",
    		copd: "0.016276750270823342",
    		diabetes: "0.028231883348609942",
    		ischemic: "0.014026970324473751",
    		lungcancer: "0.018632748325026767",
    		lri: "0.011575305436654141",
    		stroke: "0.01448870749352961",
    		nd: "0.039042359242096626"
    	},
    	{
    		id: "FRA",
    		short: "Fra.",
    		name: "France",
    		copd: "0.06967496904708692",
    		diabetes: "0.10468313925846386",
    		ischemic: "0.056122645300395006",
    		lungcancer: "0.07681522981776885",
    		lri: "0.05092105175991763",
    		stroke: "0.05779369696756096",
    		nd: "0.055988524978196334"
    	},
    	{
    		id: "DEU",
    		short: "Ger.",
    		name: "Germany",
    		copd: "0.07313255612839537",
    		diabetes: "0.10928637108736773",
    		ischemic: "0.06161046003158839",
    		lungcancer: "0.08050760332654182",
    		lri: "0.05350143861898854",
    		stroke: "0.06488212933826974",
    		nd: "0.058210351858427656"
    	},
    	{
    		id: "GRC",
    		short: "Gr.",
    		name: "Greece",
    		copd: "0.09363864600312156",
    		diabetes: "0.13115307013540334",
    		ischemic: "0.08015877313881724",
    		lungcancer: "0.10096842800063402",
    		lri: "0.06904058910189895",
    		stroke: "0.07807769562511142",
    		nd: "0.06496644094871172"
    	},
    	{
    		id: "ISL",
    		short: "Ice.",
    		name: "Iceland",
    		copd: "0.017293849100756733",
    		diabetes: "0.029512955740553026",
    		ischemic: "0.01511433067565806",
    		lungcancer: "0.019687867320862182",
    		lri: "0.012318679779829061",
    		stroke: "0.014889299213851945",
    		nd: "0.044560866246110845"
    	},
    	{
    		id: "IRL",
    		short: "Ire.",
    		name: "Ireland",
    		copd: "0.03740434870102424",
    		diabetes: "0.06150427017882892",
    		ischemic: "0.034883187872055126",
    		lungcancer: "0.0423016887053626",
    		lri: "0.026907535469920103",
    		stroke: "0.033840631206146846",
    		nd: "0.0463443072667598"
    	},
    	{
    		id: "ISR",
    		short: "Isr.",
    		name: "Israel",
    		copd: "0.13507617773024033",
    		diabetes: "0.16828101176032226",
    		ischemic: "0.10843689816250511",
    		lungcancer: "0.14007049701191904",
    		lri: "0.10121917025805874",
    		stroke: "0.11834016150627427",
    		nd: "0.07875094282879763"
    	},
    	{
    		id: "ITA",
    		short: "Ita.",
    		name: "Italy",
    		copd: "0.10258413144646662",
    		diabetes: "0.13548336252385607",
    		ischemic: "0.08036759068331002",
    		lungcancer: "0.11325853414222023",
    		lri: "0.08148263620425451",
    		stroke: "0.0828025252136294",
    		nd: "0.061138844116320416"
    	},
    	{
    		id: "LUX",
    		short: "Lux.",
    		name: "Luxembourg",
    		copd: "0.0578539873261196",
    		diabetes: "0.09040495205325526",
    		ischemic: "0.05060028922582876",
    		lungcancer: "0.0645558346393733",
    		lri: "0.042099830380376506",
    		stroke: "0.05102781420678938",
    		nd: "0.052640266514436505"
    	},
    	{
    		id: "MLT",
    		short: "Malta",
    		name: "Malta",
    		copd: "0.08323886797977317",
    		diabetes: "0.12157651977086731",
    		ischemic: "0.07365110598451287",
    		lungcancer: "0.09100407107273761",
    		lri: "0.06115012592211269",
    		stroke: "0.07507317842314261",
    		nd: "0.05776742363001794"
    	},
    	{
    		id: "NLD",
    		short: "Neth.",
    		name: "Netherlands",
    		copd: "0.0752147163685618",
    		diabetes: "0.1123564007264475",
    		ischemic: "0.06643040575644972",
    		lungcancer: "0.08281349876231495",
    		lri: "0.05504099087278384",
    		stroke: "0.06657271579421965",
    		nd: "0.05732885036535058"
    	},
    	{
    		id: "NOR",
    		short: "Nor.",
    		name: "Norway",
    		copd: "0.0248875390076849",
    		diabetes: "0.0410804149443116",
    		ischemic: "0.020915381886703367",
    		lungcancer: "0.02822688798301091",
    		lri: "0.017647447456474303",
    		stroke: "0.020957925174338466",
    		nd: "0.046020352458205044"
    	},
    	{
    		id: "PRT",
    		short: "Port.",
    		name: "Portugal",
    		copd: "0.04157682820507228",
    		diabetes: "0.06622188942166495",
    		ischemic: "0.036421636079025696",
    		lungcancer: "0.04652919689592371",
    		lri: "0.030036694196240117",
    		stroke: "0.03638212230671543",
    		nd: "0.040754060480030066"
    	},
    	{
    		id: "ESP",
    		short: "Spa.",
    		name: "Spain",
    		copd: "0.05522259830123048",
    		diabetes: "0.08510343902586781",
    		ischemic: "0.046798299333134626",
    		lungcancer: "0.061271313829334116",
    		lri: "0.04016246697027442",
    		stroke: "0.04599747775760539",
    		nd: "0.042483516926911796"
    	},
    	{
    		id: "SWE",
    		short: "Swe.",
    		name: "Sweden",
    		copd: "0.0172111965001229",
    		diabetes: "0.029746989663095066",
    		ischemic: "0.014574975996404187",
    		lungcancer: "0.019559151460886378",
    		lri: "0.012302119426550379",
    		stroke: "0.014623656699553648",
    		nd: "0.04650010890003397"
    	},
    	{
    		id: "CHE",
    		short: "Switz.",
    		name: "Switzerland",
    		copd: "0.05632277231160871",
    		diabetes: "0.08782339878643391",
    		ischemic: "0.04463964071866315",
    		lungcancer: "0.06277109261578359",
    		lri: "0.04093853954032797",
    		stroke: "0.04627224454099472",
    		nd: "0.054313396777490704"
    	},
    	{
    		id: "GBR",
    		short: "U.K.",
    		name: "United Kingdom",
    		copd: "0.055093388342621764",
    		diabetes: "0.08558910352320878",
    		ischemic: "0.050525577779536826",
    		lungcancer: "0.06108161005089935",
    		lri: "0.040814742931653915",
    		stroke: "0.047289456353996506",
    		nd: "0.05216017528924733"
    	},
    	{
    		id: "ARG",
    		short: "Arg.",
    		name: "Argentina",
    		copd: "0.0873615840632908",
    		diabetes: "0.11705053651331576",
    		ischemic: "0.0822535980397935",
    		lungcancer: "0.09254121938661755",
    		lri: "0.06470371101993916",
    		stroke: "0.09339370069338127",
    		nd: "0.050677768426237724"
    	},
    	{
    		id: "CHL",
    		short: "Chile",
    		name: "Chile",
    		copd: "0.15472851739426313",
    		diabetes: "0.1753106050534959",
    		ischemic: "0.13872919262852687",
    		lungcancer: "0.1555074037806822",
    		lri: "0.11734721515107896",
    		stroke: "0.1505082348185602",
    		nd: "0.08281783138578575"
    	},
    	{
    		id: "URY",
    		short: "Uru.",
    		name: "Uruguay",
    		copd: "0.05435803120493511",
    		diabetes: "0.07971859425708087",
    		ischemic: "0.05039086962927182",
    		lungcancer: "0.05918738295176499",
    		lri: "0.03988508410286232",
    		stroke: "0.051736135227480884",
    		nd: "0.0436832414668866"
    	},
    	{
    		id: "CAN",
    		short: "Can.",
    		name: "Canada",
    		copd: "0.0304668493521179",
    		diabetes: "0.05068974063423596",
    		ischemic: "0.02821789049697726",
    		lungcancer: "0.0345425268161512",
    		lri: "0.021859273999472063",
    		stroke: "0.027025575093887415",
    		nd: "0.045126962324998805"
    	},
    	{
    		id: "USA",
    		short: "United States of America",
    		name: "United States of America",
    		copd: "0.035413956873392154",
    		diabetes: "0.05823692648089119",
    		ischemic: "0.034421202970307124",
    		lungcancer: "0.03991096066526951",
    		lri: "0.025874667195292127",
    		stroke: "0.03461727430104328",
    		nd: "0.04615866422913006"
    	},
    	{
    		id: "ATG",
    		short: "A. and B.",
    		name: "Antigua and Barbuda",
    		copd: "0.11678303870267936",
    		diabetes: "0.14975346198672018",
    		ischemic: "0.11332209580984774",
    		lungcancer: "0.12252323029886839",
    		lri: "0.08753270412611873",
    		stroke: "0.1274112611720938",
    		nd: "0.06036168230425289"
    	},
    	{
    		id: "BHS",
    		short: "Bah.",
    		name: "Bahamas",
    		copd: "0.10136479974960995",
    		diabetes: "0.13372636867119475",
    		ischemic: "0.11223481669766396",
    		lungcancer: "0.1074166427382415",
    		lri: "0.07599927607187747",
    		stroke: "0.12136368074137209",
    		nd: "0.05355407520532544"
    	},
    	{
    		id: "BRB",
    		short: "Barb.",
    		name: "Barbados",
    		copd: "0.14305457683564438",
    		diabetes: "0.17272175625877265",
    		ischemic: "0.1299031465329433",
    		lungcancer: "0.14711359915083794",
    		lri: "0.10795620725839249",
    		stroke: "0.14271044000464467",
    		nd: "0.07452265523408848"
    	},
    	{
    		id: "BLZ",
    		short: "Belize",
    		name: "Belize",
    		copd: "0.13604235185986083",
    		diabetes: "0.13311851904616306",
    		ischemic: "0.12651215012505884",
    		lungcancer: "0.12905430466418197",
    		lri: "0.10507733767456",
    		stroke: "0.146538705713496",
    		nd: "0.062132780876729826"
    	},
    	{
    		id: "CUB",
    		short: "Cuba",
    		name: "Cuba",
    		copd: "0.11824272715484713",
    		diabetes: "0.14616312951942456",
    		ischemic: "0.1051745531950238",
    		lungcancer: "0.12234440794325913",
    		lri: "0.08851393500243779",
    		stroke: "0.11778128926451716",
    		nd: "0.06337585135406927"
    	},
    	{
    		id: "DMA",
    		short: "Domin.",
    		name: "Dominica",
    		copd: "0.1240483927876283",
    		diabetes: "0.14496156463704693",
    		ischemic: "0.1105099405285726",
    		lungcancer: "0.12608527103154446",
    		lri: "0.09370021118738484",
    		stroke: "0.12429631879316073",
    		nd: "0.056868947990469605"
    	},
    	{
    		id: "DOM",
    		short: "Dom. Rep.",
    		name: "Dominican Rep.",
    		copd: "0.11597363493306914",
    		diabetes: "0.12603112449582815",
    		ischemic: "0.11246407277686987",
    		lungcancer: "0.11337738164157111",
    		lri: "0.08839528638373151",
    		stroke: "0.12849525739447068",
    		nd: "0.05360253098629031"
    	},
    	{
    		id: "GRD",
    		short: "Gre.",
    		name: "Grenada",
    		copd: "0.14264500391829749",
    		diabetes: "0.1649732347817811",
    		ischemic: "0.14325620302935785",
    		lungcancer: "0.1443594460039362",
    		lri: "0.10805945463274458",
    		stroke: "0.15749703955230335",
    		nd: "0.06534976013991098"
    	},
    	{
    		id: "GUY",
    		short: "Guy.",
    		name: "Guyana",
    		copd: "0.13168120348689322",
    		diabetes: "0.1457150179947367",
    		ischemic: "0.13999873796007062",
    		lungcancer: "0.13046679515007725",
    		lri: "0.10060473112855452",
    		stroke: "0.1555755873648131",
    		nd: "0.06160120856584313"
    	},
    	{
    		id: "HTI",
    		short: "Haiti",
    		name: "Haiti",
    		copd: "0.06918662918043421",
    		diabetes: "0.030787455389549474",
    		ischemic: "0.045443463171859565",
    		lungcancer: "0.04776723784928802",
    		lri: "0.0546051584782132",
    		stroke: "0.05254709089877989",
    		nd: "0.023075792055410514"
    	},
    	{
    		id: "JAM",
    		short: "Jam.",
    		name: "Jamaica",
    		copd: "0.10205731533942541",
    		diabetes: "0.12247473687064904",
    		ischemic: "0.09028851495070907",
    		lungcancer: "0.1045276699434308",
    		lri: "0.07671180060175649",
    		stroke: "0.10187889220708386",
    		nd: "0.05029240716082168"
    	},
    	{
    		id: "LCA",
    		short: "St. L.",
    		name: "Saint Lucia",
    		copd: "0.14139101450846586",
    		diabetes: "0.16396642129536476",
    		ischemic: "0.1307527659774704",
    		lungcancer: "0.143239644479483",
    		lri: "0.10711184850549549",
    		stroke: "0.14586290502980148",
    		nd: "0.0705641721629992"
    	},
    	{
    		id: "VCT",
    		short: "Vct.",
    		name: "Saint Vincent and the Grenadines",
    		copd: "0.14004431525123703",
    		diabetes: "0.15961827132121684",
    		ischemic: "0.12875643714009943",
    		lungcancer: "0.14050641004580727",
    		lri: "0.1059842644524389",
    		stroke: "0.148604487069336",
    		nd: "0.06581915717148293"
    	},
    	{
    		id: "SUR",
    		short: "Suri.",
    		name: "Suriname",
    		copd: "0.13913494047530914",
    		diabetes: "0.14842001254658135",
    		ischemic: "0.13794742310946848",
    		lungcancer: "0.13612743545254957",
    		lri: "0.10641389887124965",
    		stroke: "0.15457232791836736",
    		nd: "0.06063442325566311"
    	},
    	{
    		id: "TTO",
    		short: "T.",
    		name: "Trinidad and Tobago",
    		copd: "0.14517186129270357",
    		diabetes: "0.17179558151908095",
    		ischemic: "0.1437545179723264",
    		lungcancer: "0.14811054788976954",
    		lri: "0.1101773029649535",
    		stroke: "0.15342026520858848",
    		nd: "0.06116516001517234"
    	},
    	{
    		id: "BOL",
    		short: "Bol.",
    		name: "Bolivia",
    		copd: "0.16038810243017063",
    		diabetes: "0.12947818815840118",
    		ischemic: "0.12795743842796045",
    		lungcancer: "0.13826923392935886",
    		lri: "0.12517048734753145",
    		stroke: "0.15639033448537945",
    		nd: "0.05561559304093931"
    	},
    	{
    		id: "ECU",
    		short: "Ecu.",
    		name: "Ecuador",
    		copd: "0.13466784984359687",
    		diabetes: "0.15607184129774185",
    		ischemic: "0.12600604854303532",
    		lungcancer: "0.13539708180704743",
    		lri: "0.10215878693273844",
    		stroke: "0.14493286781179165",
    		nd: "0.05636251007964574"
    	},
    	{
    		id: "PER",
    		short: "Peru",
    		name: "Peru",
    		copd: "0.19146090635731092",
    		diabetes: "0.1663126520056521",
    		ischemic: "0.14405802776573887",
    		lungcancer: "0.1721465900999078",
    		lri: "0.14982340595272287",
    		stroke: "0.1804640850005827",
    		nd: "0.0880056763538393"
    	},
    	{
    		id: "COL",
    		short: "Col.",
    		name: "Colombia",
    		copd: "0.14692946743844276",
    		diabetes: "0.15283062505917705",
    		ischemic: "0.12209289594722351",
    		lungcancer: "0.1414666743421657",
    		lri: "0.11186889943043363",
    		stroke: "0.14319645975643958",
    		nd: "0.06218212341080158"
    	},
    	{
    		id: "CRI",
    		short: "Co. Rica",
    		name: "Costa Rica",
    		copd: "0.11808208565765338",
    		diabetes: "0.1453557281246075",
    		ischemic: "0.11026256851341473",
    		lungcancer: "0.1215611778326889",
    		lri: "0.08857763663779619",
    		stroke: "0.11527690910072914",
    		nd: "0.06357331977046936"
    	},
    	{
    		id: "SLV",
    		short: "El Sal.",
    		name: "El Salvador",
    		copd: "0.14524607843729465",
    		diabetes: "0.14298543728288593",
    		ischemic: "0.11565205460100067",
    		lungcancer: "0.1349639811207425",
    		lri: "0.11130060780682009",
    		stroke: "0.13557928718975856",
    		nd: "0.052219385524125694"
    	},
    	{
    		id: "GTM",
    		short: "Gua.",
    		name: "Guatemala",
    		copd: "0.142766265903025",
    		diabetes: "0.09272075740000069",
    		ischemic: "0.09906215769944342",
    		lungcancer: "0.11113369663451986",
    		lri: "0.11410830744334392",
    		stroke: "0.12205699048426141",
    		nd: "0.04891304378870852"
    	},
    	{
    		id: "HND",
    		short: "Hon.",
    		name: "Honduras",
    		copd: "0.11333162872892459",
    		diabetes: "0.06859880238967953",
    		ischemic: "0.07726062932104329",
    		lungcancer: "0.07997278920389989",
    		lri: "0.09073792296689687",
    		stroke: "0.0942936881214414",
    		nd: "0.037764348328237524"
    	},
    	{
    		id: "MEX",
    		short: "Mex.",
    		name: "Mexico",
    		copd: "0.1313371590231316",
    		diabetes: "0.14359482269972385",
    		ischemic: "0.11721877096920298",
    		lungcancer: "0.12745592056999627",
    		lri: "0.10107132703760284",
    		stroke: "0.13426564429786927",
    		nd: "0.0551217498892857"
    	},
    	{
    		id: "NIC",
    		short: "Nic.",
    		name: "Nicaragua",
    		copd: "0.11235866680227642",
    		diabetes: "0.07581312004066912",
    		ischemic: "0.07810847664213895",
    		lungcancer: "0.08845073007662561",
    		lri: "0.08754804329191779",
    		stroke: "0.09605542655089108",
    		nd: "0.03798977112504736"
    	},
    	{
    		id: "PAN",
    		short: "Pan.",
    		name: "Panama",
    		copd: "0.08684783972113923",
    		diabetes: "0.1081465151068443",
    		ischemic: "0.07796919814161804",
    		lungcancer: "0.08932212801749043",
    		lri: "0.0651469081919968",
    		stroke: "0.08528555899640358",
    		nd: "0.045272553566808024"
    	},
    	{
    		id: "VEN",
    		short: "Ven.",
    		name: "Venezuela",
    		copd: "0.14787154019527232",
    		diabetes: "0.17579637878187662",
    		ischemic: "0.14759938356844543",
    		lungcancer: "0.15078346128058678",
    		lri: "0.11191783902075317",
    		stroke: "0.16210222653208686",
    		nd: "0.07165093673060935"
    	},
    	{
    		id: "BRA",
    		short: "Brazil",
    		name: "Brazil",
    		copd: "0.07460312698109424",
    		diabetes: "0.0874940042573106",
    		ischemic: "0.07762734928478833",
    		lungcancer: "0.07683254225584266",
    		lri: "0.05753212356859991",
    		stroke: "0.08074185653159965",
    		nd: "0.03846202698659433"
    	},
    	{
    		id: "PRY",
    		short: "Para.",
    		name: "Paraguay",
    		copd: "0.08130477740606168",
    		diabetes: "0.07358514055826589",
    		ischemic: "0.07139501671188522",
    		lungcancer: "0.0757037897879835",
    		lri: "0.061998138162861406",
    		stroke: "0.08269784705726796",
    		nd: "0.033640876295154956"
    	},
    	{
    		id: "DZA",
    		short: "Alg.",
    		name: "Algeria",
    		copd: "0.21313719856712926",
    		diabetes: "0.2132363287658334",
    		ischemic: "0.1953324393211708",
    		lungcancer: "0.20618840004753183",
    		lri: "0.16631276148088867",
    		stroke: "0.21682937607959574",
    		nd: "0.11322157865391155"
    	},
    	{
    		id: "BHR",
    		short: "Bah.",
    		name: "Bahrain",
    		copd: "0.329950620962577",
    		diabetes: "0.23878572961894637",
    		ischemic: "0.30938713892346903",
    		lungcancer: "0.2831355554884898",
    		lri: "0.26502721616301755",
    		stroke: "0.3545604667155689",
    		nd: "0.10409420530805635"
    	},
    	{
    		id: "EGY",
    		short: "Egy.",
    		name: "Egypt",
    		copd: "0.3543652880832436",
    		diabetes: "0.24030308535245645",
    		ischemic: "0.30621089925948786",
    		lungcancer: "0.2921567849522761",
    		lri: "0.2891299104378818",
    		stroke: "0.34922514425793105",
    		nd: "0.17874896887940905"
    	},
    	{
    		id: "IRN",
    		short: "Iran",
    		name: "Islamic Rep. of Iran",
    		copd: "0.23527739493967853",
    		diabetes: "0.2228737509864187",
    		ischemic: "0.20773343108015033",
    		lungcancer: "0.22087614613064754",
    		lri: "0.18840587899240663",
    		stroke: "0.23238479453458444",
    		nd: "0.11775747803374763"
    	},
    	{
    		id: "IRQ",
    		short: "Iraq",
    		name: "Iraq",
    		copd: "0.2845362236441012",
    		diabetes: "0.2281379386109538",
    		ischemic: "0.2571495318382883",
    		lungcancer: "0.252242811126534",
    		lri: "0.22776651069376963",
    		stroke: "0.3005724017592412",
    		nd: "0.14538899219405269"
    	},
    	{
    		id: "JOR",
    		short: "Jor.",
    		name: "Jordan",
    		copd: "0.20325526461754437",
    		diabetes: "0.21236945692189582",
    		ischemic: "0.2110984439894415",
    		lungcancer: "0.19917253465500026",
    		lri: "0.15751895553458514",
    		stroke: "0.21806326576297266",
    		nd: "0.10173179529573158"
    	},
    	{
    		id: "KWT",
    		short: "Ku.",
    		name: "Kuwait",
    		copd: "0.33705764594922233",
    		diabetes: "0.23966016768676293",
    		ischemic: "0.31217434397033905",
    		lungcancer: "0.2866894932100507",
    		lri: "0.2708795723006588",
    		stroke: "0.32638043858026605",
    		nd: "0.15844000178205486"
    	},
    	{
    		id: "LBN",
    		short: "Leb.",
    		name: "Lebanon",
    		copd: "0.1938895822994677",
    		diabetes: "0.2087073678202637",
    		ischemic: "0.179156740721467",
    		lungcancer: "0.19252601785926057",
    		lri: "0.14903339243829325",
    		stroke: "0.18289677033358767",
    		nd: "0.09401845246125708"
    	},
    	{
    		id: "LBY",
    		short: "Lib.",
    		name: "Libya",
    		copd: "0.24196484469504745",
    		diabetes: "0.22182350475492338",
    		ischemic: "0.22962662142041562",
    		lungcancer: "0.22710168296272637",
    		lri: "0.19003668099674195",
    		stroke: "0.2545321404326257",
    		nd: "0.1090718288658306"
    	},
    	{
    		id: "MAR",
    		short: "Mor.",
    		name: "Morocco",
    		copd: "0.22301354962075423",
    		diabetes: "0.20719687370931203",
    		ischemic: "0.20690810796066766",
    		lungcancer: "0.20973052413895324",
    		lri: "0.17392805629625077",
    		stroke: "0.2309636619408277",
    		nd: "0.11783521371051572"
    	},
    	{
    		id: "PSE",
    		short: null,
    		name: "State of Palestine",
    		copd: "0.2049145544971779",
    		diabetes: "0.20922453523832107",
    		ischemic: "0.2055433548908422",
    		lungcancer: "0.1989230951477552",
    		lri: "0.15924189841054084",
    		stroke: "0.21443885710633329",
    		nd: "0.08441888548720801"
    	},
    	{
    		id: "OMN",
    		short: "Oman",
    		name: "Oman",
    		copd: "0.269305098617797",
    		diabetes: "0.2296731395406402",
    		ischemic: "0.2591581096749809",
    		lungcancer: "0.24605455339305485",
    		lri: "0.21397080103207536",
    		stroke: "0.2910541248623792",
    		nd: "0.1270460954730611"
    	},
    	{
    		id: "QAT",
    		short: "Qatar",
    		name: "Qatar",
    		copd: "0.3779314927810239",
    		diabetes: "0.2428480873080106",
    		ischemic: "0.3463658418169393",
    		lungcancer: "0.3056804014558035",
    		lri: "0.3114675527352863",
    		stroke: "0.43331200438735734",
    		nd: "0.18264324242042212"
    	},
    	{
    		id: "SAU",
    		short: "S. Ara.",
    		name: "Saudi Arabia",
    		copd: "0.33618444300399636",
    		diabetes: "0.23710584181236052",
    		ischemic: "0.3289366859595807",
    		lungcancer: "0.2823516555510117",
    		lri: "0.2704511440147125",
    		stroke: "0.37754061514297105",
    		nd: "0.1474401042458185"
    	},
    	{
    		id: "SYR",
    		short: "Syr.",
    		name: "Syrian Arab Rep.",
    		copd: "0.20150512478911947",
    		diabetes: "0.21233054273617188",
    		ischemic: "0.20602363684272412",
    		lungcancer: "0.19952373804428353",
    		lri: "0.1585561048499404",
    		stroke: "0.22576203819665092",
    		nd: "0.10211515762969556"
    	},
    	{
    		id: "TUN",
    		short: "Tuni.",
    		name: "Tunisia",
    		copd: "0.20181303916470908",
    		diabetes: "0.21088834368163292",
    		ischemic: "0.18426554973411616",
    		lungcancer: "0.198426552106476",
    		lri: "0.1556396976245287",
    		stroke: "0.2027117923264709",
    		nd: "0.1044049516352934"
    	},
    	{
    		id: "TUR",
    		short: "Tur.",
    		name: "Türkiye",
    		copd: "0.17701616283497215",
    		diabetes: "0.19830843709922039",
    		ischemic: "0.16267211387005187",
    		lungcancer: "0.1775618861189364",
    		lri: "0.13468710359211616",
    		stroke: "0.17572833099178065",
    		nd: "0.08809314879152683"
    	},
    	{
    		id: "ARE",
    		short: "U.A.E.",
    		name: "United Arab Emirates",
    		copd: "0.26770159082216083",
    		diabetes: "0.23148259693784182",
    		ischemic: "0.3249670090074592",
    		lungcancer: "0.2468675820499459",
    		lri: "0.21123050091709727",
    		stroke: "0.3775423512219125",
    		nd: "0.12791268067645722"
    	},
    	{
    		id: "YEM",
    		short: "Yemen",
    		name: "Yemen",
    		copd: "0.20547021072787414",
    		diabetes: "0.12498412064173092",
    		ischemic: "0.1585588303660941",
    		lungcancer: "0.15561514201774748",
    		lri: "0.16243044219551483",
    		stroke: "0.176959057070131",
    		nd: "0.07279453558178162"
    	},
    	{
    		id: "AFG",
    		short: "Afg.",
    		name: "Afghanistan",
    		copd: "0.1391705965337115",
    		diabetes: "0.05772357855351105",
    		ischemic: "0.08898544922284747",
    		lungcancer: "0.08671366877694586",
    		lri: "0.1078260804348944",
    		stroke: "0.09892473741144005",
    		nd: "0.040164635459282075"
    	},
    	{
    		id: "BGD",
    		short: "Bangl.",
    		name: "Bangladesh",
    		copd: "0.23165673737040762",
    		diabetes: "0.1083762690866323",
    		ischemic: "0.14827466697292857",
    		lungcancer: "0.15502493316385726",
    		lri: "0.1840635294573584",
    		stroke: "0.1687911708606509",
    		nd: "0.07834551118563005"
    	},
    	{
    		id: "BTN",
    		short: "Bhu.",
    		name: "Bhutan",
    		copd: "0.17968421940163465",
    		diabetes: "0.10365117489445898",
    		ischemic: "0.12261672566396324",
    		lungcancer: "0.12908784479442953",
    		lri: "0.14049625189296197",
    		stroke: "0.14025078928830823",
    		nd: "0.05629703553620652"
    	},
    	{
    		id: "IND",
    		short: "India",
    		name: "India",
    		copd: "0.3017056743306487",
    		diabetes: "0.16230739322195836",
    		ischemic: "0.21664531672917894",
    		lungcancer: "0.21286224449276453",
    		lri: "0.2437121804067776",
    		stroke: "0.23398905727993158",
    		nd: "0.10878121518224856"
    	},
    	{
    		id: "NPL",
    		short: "Nep.",
    		name: "Nepal",
    		copd: "0.2587527299053213",
    		diabetes: "0.11574862917200399",
    		ischemic: "0.1598032962772534",
    		lungcancer: "0.16204510765780142",
    		lri: "0.20483722168872678",
    		stroke: "0.18563470789273434",
    		nd: "0.08470921453949205"
    	},
    	{
    		id: "PAK",
    		short: "Pak.",
    		name: "Pakistan",
    		copd: "0.24554628788879593",
    		diabetes: "0.12753784340079022",
    		ischemic: "0.18271548100868862",
    		lungcancer: "0.17694725390526453",
    		lri: "0.19164818087207264",
    		stroke: "0.1959626984420037",
    		nd: "0.08777365438362868"
    	},
    	{
    		id: "AGO",
    		short: "An.",
    		name: "Angola",
    		copd: "0.13939283575501832",
    		diabetes: "0.09029285696627232",
    		ischemic: "0.10865948168179083",
    		lungcancer: "0.10679198888436656",
    		lri: "0.11029743904969176",
    		stroke: "0.12765222332877751",
    		nd: "0.056588704456427504"
    	},
    	{
    		id: "CAF",
    		short: "C.A.F.",
    		name: "Central African Rep.",
    		copd: "0.08683762136353132",
    		diabetes: "0.034914292573070334",
    		ischemic: "0.05109238075575633",
    		lungcancer: "0.05084792068548702",
    		lri: "0.06569970763074767",
    		stroke: "0.058438467237465444",
    		nd: "0.024372644121860867"
    	},
    	{
    		id: "COG",
    		short: "Congo",
    		name: "Congo",
    		copd: "0.19682213706153245",
    		diabetes: "0.12582313759343397",
    		ischemic: "0.15949560836072854",
    		lungcancer: "0.15752990925190655",
    		lri: "0.15806066762472165",
    		stroke: "0.19141664524019558",
    		nd: "0.1064365971269849"
    	},
    	{
    		id: "COD",
    		short: "D.R.C.",
    		name: "Dem. Rep. of the Congo",
    		copd: "0.0983460249803283",
    		diabetes: "0.04454003258806872",
    		ischemic: "0.05873075969799294",
    		lungcancer: "0.06290862787392157",
    		lri: "0.07979779044666938",
    		stroke: "0.06979020737893925",
    		nd: "0.031020379822013222"
    	},
    	{
    		id: "GNQ",
    		short: "Eq. Gui.",
    		name: "Equatorial Guinea",
    		copd: "0.2533334423542981",
    		diabetes: "0.19133381554497544",
    		ischemic: "0.21241595590842388",
    		lungcancer: "0.21759305038910998",
    		lri: "0.2036702943983145",
    		stroke: "0.2546499409809851",
    		nd: "0.16701770922586026"
    	},
    	{
    		id: "GAB",
    		short: "Gabon",
    		name: "Gabon",
    		copd: "0.22684478422571225",
    		diabetes: "0.20165148991151316",
    		ischemic: "0.21007833021579647",
    		lungcancer: "0.20859565854582823",
    		lri: "0.1780723942880494",
    		stroke: "0.24535911887287312",
    		nd: "0.13788877140512698"
    	},
    	{
    		id: "BDI",
    		short: "Buru.",
    		name: "Burundi",
    		copd: "0.06525056528252618",
    		diabetes: "0.025608578957534076",
    		ischemic: "0.03639358360037601",
    		lungcancer: "0.03753055214693999",
    		lri: "0.04944708511405504",
    		stroke: "0.04211597281330858",
    		nd: "0.018337206491169405"
    	},
    	{
    		id: "COM",
    		short: "Como.",
    		name: "Comoros",
    		copd: "0.07058202776132093",
    		diabetes: "0.03521334475658849",
    		ischemic: "0.043595178288769826",
    		lungcancer: "0.04862014577045649",
    		lri: "0.05524606829959704",
    		stroke: "0.052359533752085324",
    		nd: "0.027535024875383396"
    	},
    	{
    		id: "DJI",
    		short: "Dji.",
    		name: "Djibouti",
    		copd: "0.22813563878458715",
    		diabetes: "0.1617653052173202",
    		ischemic: "0.19583514052085502",
    		lungcancer: "0.1855413217842335",
    		lri: "0.18075703352277694",
    		stroke: "0.2300710318377014",
    		nd: "0.1150166047455172"
    	},
    	{
    		id: "ERI",
    		short: "Eri.",
    		name: "Eritrea",
    		copd: "0.14282491401691205",
    		diabetes: "0.06600878206148066",
    		ischemic: "0.0953243777754116",
    		lungcancer: "0.09101876443004916",
    		lri: "0.11485684475845126",
    		stroke: "0.10997163977417543",
    		nd: "0.0527475829812849"
    	},
    	{
    		id: "ETH",
    		short: "Ethi.",
    		name: "Ethiopia",
    		copd: "0.08112876073160923",
    		diabetes: "0.03775522822722594",
    		ischemic: "0.04900815857763164",
    		lungcancer: "0.05377186142080398",
    		lri: "0.058798131695527944",
    		stroke: "0.05701888877352487",
    		nd: "0.02176651630546188"
    	},
    	{
    		id: "KEN",
    		short: "Ken.",
    		name: "Kenya",
    		copd: "0.08973386209760516",
    		diabetes: "0.058341073146518214",
    		ischemic: "0.06878046709063597",
    		lungcancer: "0.071777228854807",
    		lri: "0.06838563707452089",
    		stroke: "0.08188272886437271",
    		nd: "0.036728159143940835"
    	},
    	{
    		id: "MDG",
    		short: "Mada.",
    		name: "Madagascar",
    		copd: "0.05530352196213345",
    		diabetes: "0.025162816261061313",
    		ischemic: "0.037498712294222594",
    		lungcancer: "0.036653481318058456",
    		lri: "0.04421134606546438",
    		stroke: "0.043246372264787565",
    		nd: "0.02067201221854119"
    	},
    	{
    		id: "MWI",
    		short: "Mala.",
    		name: "Malawi",
    		copd: "0.061403444930972335",
    		diabetes: "0.026670953167514132",
    		ischemic: "0.036438952004322005",
    		lungcancer: "0.03794862390277921",
    		lri: "0.04838965472199829",
    		stroke: "0.04195844703384086",
    		nd: "0.02128801031670802"
    	},
    	{
    		id: "MUS",
    		short: "Maur.",
    		name: "Mauritius",
    		copd: "0.0980250104821854",
    		diabetes: "0.1332825143995367",
    		ischemic: "0.10360632800220262",
    		lungcancer: "0.10457039058348229",
    		lri: "0.07289897478047973",
    		stroke: "0.1116542289540285",
    		nd: "0.05528536414678733"
    	},
    	{
    		id: "MOZ",
    		short: "Moz.",
    		name: "Mozambique",
    		copd: "0.048543530380465716",
    		diabetes: "0.0198823584939401",
    		ischemic: "0.027433217603465003",
    		lungcancer: "0.02785435504894557",
    		lri: "0.036892211509084345",
    		stroke: "0.033011731201425",
    		nd: "0.01296700719413888"
    	},
    	{
    		id: "RWA",
    		short: "Rwa.",
    		name: "Rwanda",
    		copd: "0.11208455461791801",
    		diabetes: "0.050662462977689955",
    		ischemic: "0.06721588350118043",
    		lungcancer: "0.07298313316806601",
    		lri: "0.09136444005954156",
    		stroke: "0.08151399915620922",
    		nd: "0.04258257780432722"
    	},
    	{
    		id: "SYC",
    		short: "Seych.",
    		name: "Seychelles",
    		copd: "0.10319958264912027",
    		diabetes: "0.14058175194826694",
    		ischemic: "0.11401417692464962",
    		lungcancer: "0.11034038575272037",
    		lri: "0.07674966714769416",
    		stroke: "0.12203303055172116",
    		nd: "0.06589843020689334"
    	},
    	{
    		id: "SOM",
    		short: "Som.",
    		name: "Somalia",
    		copd: "0.02488232175945004",
    		diabetes: "0.009090853580158044",
    		ischemic: "0.013410720191340748",
    		lungcancer: "0.013623887393344166",
    		lri: "0.016851938722013862",
    		stroke: "0.014775737329400043",
    		nd: "0.006743032260464832"
    	},
    	{
    		id: "TZA",
    		short: "Tanz.",
    		name: "United Rep. of Tanzania",
    		copd: "0.08020058766460372",
    		diabetes: "0.03729094342543866",
    		ischemic: "0.04950034454991289",
    		lungcancer: "0.05395867476509112",
    		lri: "0.06436244025852096",
    		stroke: "0.057835023482239734",
    		nd: "0.02830290499765075"
    	},
    	{
    		id: "UGA",
    		short: "Ug.",
    		name: "Uganda",
    		copd: "0.10404018134496347",
    		diabetes: "0.04619569233027621",
    		ischemic: "0.06116502167843743",
    		lungcancer: "0.06422699906868867",
    		lri: "0.08297487340652894",
    		stroke: "0.07288225527913171",
    		nd: "0.03546537614208103"
    	},
    	{
    		id: "ZMB",
    		short: "Zambia",
    		name: "Zambia",
    		copd: "0.11365817953763954",
    		diabetes: "0.06345375564348613",
    		ischemic: "0.08556095885047707",
    		lungcancer: "0.08394448029342404",
    		lri: "0.09062188987642879",
    		stroke: "0.10031565294424977",
    		nd: "0.05369485883805671"
    	},
    	{
    		id: "BWA",
    		short: "Bots.",
    		name: "Botswana",
    		copd: "0.15238019366740788",
    		diabetes: "0.12677360742709526",
    		ischemic: "0.1461321361915338",
    		lungcancer: "0.13748214320764865",
    		lri: "0.11931268449621309",
    		stroke: "0.16370959260546739",
    		nd: "0.11239841384359228"
    	},
    	{
    		id: "LSO",
    		short: "Les.",
    		name: "Lesotho",
    		copd: "0.1327978563593601",
    		diabetes: "0.07809464312137639",
    		ischemic: "0.10265553295008237",
    		lungcancer: "0.1019257156124758",
    		lri: "0.10616033447486468",
    		stroke: "0.11681795894357304",
    		nd: "0.07074991863718907"
    	},
    	{
    		id: "NAM",
    		short: "Nam.",
    		name: "Namibia",
    		copd: "0.1436062462242741",
    		diabetes: "0.10980966724536738",
    		ischemic: "0.1207534233259761",
    		lungcancer: "0.12473301328951318",
    		lri: "0.11239182855951832",
    		stroke: "0.1382359299074811",
    		nd: "0.08327242119758925"
    	},
    	{
    		id: "ZAF",
    		short: "S. Africa",
    		name: "South Africa",
    		copd: "0.17954427595779807",
    		diabetes: "0.16969420586117326",
    		ischemic: "0.16686341391626436",
    		lungcancer: "0.16438272948484042",
    		lri: "0.14326085776531217",
    		stroke: "0.18409313111701733",
    		nd: "0.1125908019475322"
    	},
    	{
    		id: "SWZ",
    		short: "Eswatini",
    		name: "Eswatini",
    		copd: "0.1315979244928909",
    		diabetes: "0.09296316361974895",
    		ischemic: "0.11539359082807828",
    		lungcancer: "0.11038630339204245",
    		lri: "0.10335534055437148",
    		stroke: "0.13082626228713756",
    		nd: "0.061891947480252105"
    	},
    	{
    		id: "ZWE",
    		short: "Zimb.",
    		name: "Zimbabwe",
    		copd: "0.0920761923206073",
    		diabetes: "0.04705176737539058",
    		ischemic: "0.0629558553659012",
    		lungcancer: "0.06423090154133443",
    		lri: "0.07325431009365228",
    		stroke: "0.07408896208762036",
    		nd: "0.04402661663410039"
    	},
    	{
    		id: "BEN",
    		short: "Benin",
    		name: "Benin",
    		copd: "0.12313568545405709",
    		diabetes: "0.050932796332251624",
    		ischemic: "0.06871937888566937",
    		lungcancer: "0.07560505817026052",
    		lri: "0.09768853187885546",
    		stroke: "0.08055802658104162",
    		nd: "0.038088617687350446"
    	},
    	{
    		id: "BFA",
    		short: "B.F.",
    		name: "Burkina Faso",
    		copd: "0.09185631218042956",
    		diabetes: "0.036203222030650455",
    		ischemic: "0.04868827461154799",
    		lungcancer: "0.052432385868874845",
    		lri: "0.06872448803354521",
    		stroke: "0.05630429608389586",
    		nd: "0.027750465694720977"
    	},
    	{
    		id: "CMR",
    		short: "Cam.",
    		name: "Cameroon",
    		copd: "0.2376624036246621",
    		diabetes: "0.11608861543223015",
    		ischemic: "0.15592476381440268",
    		lungcancer: "0.1621153534989052",
    		lri: "0.19399460483103992",
    		stroke: "0.1886526337701583",
    		nd: "0.11034430327350016"
    	},
    	{
    		id: "CPV",
    		short: "C. Verde",
    		name: "Cabo Verde",
    		copd: "0.2684183943341506",
    		diabetes: "0.17956011416145784",
    		ischemic: "0.1848771091172364",
    		lungcancer: "0.21694158338178507",
    		lri: "0.21514919541122038",
    		stroke: "0.23230072291444556",
    		nd: "0.13889511426428128"
    	},
    	{
    		id: "TCD",
    		short: "Chad",
    		name: "Chad",
    		copd: "0.09564581443367444",
    		diabetes: "0.035075507375627195",
    		ischemic: "0.04881254284789931",
    		lungcancer: "0.0532374689997928",
    		lri: "0.06887087099251293",
    		stroke: "0.05584779898163628",
    		nd: "0.023851436944784036"
    	},
    	{
    		id: "CIV",
    		short: "Ivo. Co.",
    		name: "Côte d’Ivoire",
    		copd: "0.17447039730124927",
    		diabetes: "0.0770510334875414",
    		ischemic: "0.1073051338045513",
    		lungcancer: "0.11139826139926806",
    		lri: "0.13805065018635398",
    		stroke: "0.12709643431337891",
    		nd: "0.0646111317547849"
    	},
    	{
    		id: "GMB",
    		short: "Gamb.",
    		name: "Gambia",
    		copd: "0.15624828238587898",
    		diabetes: "0.06439762381858384",
    		ischemic: "0.08554211702240908",
    		lungcancer: "0.0938049028342259",
    		lri: "0.1267292931216578",
    		stroke: "0.1028676046245879",
    		nd: "0.05678351435577445"
    	},
    	{
    		id: "GHA",
    		short: "Gha.",
    		name: "Ghana",
    		copd: "0.23924780093157863",
    		diabetes: "0.13268073898816382",
    		ischemic: "0.1660199423241605",
    		lungcancer: "0.17501835059878532",
    		lri: "0.1949171082891912",
    		stroke: "0.20270406832339116",
    		nd: "0.08662692455832244"
    	},
    	{
    		id: "GIN",
    		short: "Guinea",
    		name: "Guinea",
    		copd: "0.10885044555706797",
    		diabetes: "0.041437070958574074",
    		ischemic: "0.0559748884382727",
    		lungcancer: "0.06362490546672993",
    		lri: "0.08357078712575697",
    		stroke: "0.06562128786630268",
    		nd: "0.029851902796923627"
    	},
    	{
    		id: "GNB",
    		short: "Gui.-B.",
    		name: "Guinea-Bissau",
    		copd: "0.12257750765777656",
    		diabetes: "0.04778945142741775",
    		ischemic: "0.06995048215230874",
    		lungcancer: "0.07200236033525692",
    		lri: "0.09749136623468647",
    		stroke: "0.08246727529946708",
    		nd: "0.039165305172427195"
    	},
    	{
    		id: "LBR",
    		short: "Libe.",
    		name: "Liberia",
    		copd: "0.12619286532267096",
    		diabetes: "0.05169005527785119",
    		ischemic: "0.07018646873066436",
    		lungcancer: "0.0772437956233384",
    		lri: "0.1025707761050547",
    		stroke: "0.08399191626159735",
    		nd: "0.04617988531554155"
    	},
    	{
    		id: "MLI",
    		short: "Mali",
    		name: "Mali",
    		copd: "0.10196725473706711",
    		diabetes: "0.03631463829094609",
    		ischemic: "0.048316488910236204",
    		lungcancer: "0.05531137803083116",
    		lri: "0.07365726075676332",
    		stroke: "0.05601501642238344",
    		nd: "0.028804715138940545"
    	},
    	{
    		id: "MRT",
    		short: "Mau.",
    		name: "Mauritania",
    		copd: "0.26328934078496075",
    		diabetes: "0.13288346839529847",
    		ischemic: "0.16092159818095145",
    		lungcancer: "0.18174769311941757",
    		lri: "0.21288602258516176",
    		stroke: "0.19889469663850912",
    		nd: "0.12220765567547943"
    	},
    	{
    		id: "NER",
    		short: "Niger",
    		name: "Niger",
    		copd: "0.08662339197260965",
    		diabetes: "0.031022330474017215",
    		ischemic: "0.04354435938819266",
    		lungcancer: "0.04779635844690053",
    		lri: "0.06101264619779786",
    		stroke: "0.048477427993353195",
    		nd: "0.02630746206963577"
    	},
    	{
    		id: "NGA",
    		short: "Nig.",
    		name: "Nigeria",
    		copd: "0.22374928616366327",
    		diabetes: "0.12453223049171776",
    		ischemic: "0.14361323459186365",
    		lungcancer: "0.16125904213310358",
    		lri: "0.14819954981095682",
    		stroke: "0.16576323878268295",
    		nd: "0.07487704843662651"
    	},
    	{
    		id: "STP",
    		short: "S.T. and P.",
    		name: "Sao Tome and Principe",
    		copd: "0.14761020730494454",
    		diabetes: "0.08957263437593352",
    		ischemic: "0.10035352829031631",
    		lungcancer: "0.11044829023103678",
    		lri: "0.11735425702505718",
    		stroke: "0.12420057028759487",
    		nd: "0.06528426965737749"
    	},
    	{
    		id: "SEN",
    		short: "Sen.",
    		name: "Senegal",
    		copd: "0.16945076783403767",
    		diabetes: "0.07065679019383922",
    		ischemic: "0.09133078484626889",
    		lungcancer: "0.10363470723991196",
    		lri: "0.13296205098707128",
    		stroke: "0.11103858993857674",
    		nd: "0.06280900817783228"
    	},
    	{
    		id: "SLE",
    		short: "S. Leone",
    		name: "Sierra Leone",
    		copd: "0.11422240601921083",
    		diabetes: "0.0442563505398683",
    		ischemic: "0.060639879334354094",
    		lungcancer: "0.06789687131368213",
    		lri: "0.0897201052392797",
    		stroke: "0.07027189250393072",
    		nd: "0.03206009432736688"
    	},
    	{
    		id: "TGO",
    		short: "Togo",
    		name: "Togo",
    		copd: "0.14205421345252017",
    		diabetes: "0.062492366733633925",
    		ischemic: "0.08843792510378001",
    		lungcancer: "0.09175818466656609",
    		lri: "0.11580943051302431",
    		stroke: "0.10582270345988086",
    		nd: "0.05064398389766209"
    	},
    	{
    		id: "ASM",
    		short: null,
    		name: "American Samoa",
    		copd: "0.03544328623755645",
    		diabetes: "0.043293242484018425",
    		ischemic: "0.040501896283259335",
    		lungcancer: "0.03612977341171057",
    		lri: "0.026786309819187455",
    		stroke: "0.0436169832061087",
    		nd: "0.02470907543105068"
    	},
    	{
    		id: "BMU",
    		short: null,
    		name: "Bermuda",
    		copd: "0.03239555639103599",
    		diabetes: "0.05127907162222495",
    		ischemic: "0.02998685953769968",
    		lungcancer: "0.0361468467571846",
    		lri: "0.023530646809503765",
    		stroke: "0.03186173831191999",
    		nd: "0.03838356326862121"
    	},
    	{
    		id: "#N/A",
    		name: "Cook Isl.",
    		copd: "0.029506859862262765",
    		diabetes: "0.04287763579111932",
    		ischemic: "0.032761806864458926",
    		lungcancer: "0.03155613229749715",
    		lri: "0.02146928545375408",
    		stroke: "0.03389293727619151",
    		nd: "0.03097330536387142"
    	},
    	{
    		id: "GRL",
    		short: null,
    		name: "Greenland",
    		copd: "0.026933647619856522",
    		diabetes: "0.04202760874350533",
    		ischemic: "0.03162723527931689",
    		lungcancer: "0.02988636227091358",
    		lri: "0.019579143849592664",
    		stroke: "0.03201883647016912",
    		nd: "0.04163871447911491"
    	},
    	{
    		id: "GUM",
    		short: null,
    		name: "Guam",
    		copd: "0.044363513451416155",
    		diabetes: "0.06672163477009178",
    		ischemic: "0.05122272615941053",
    		lungcancer: "0.04865550891386346",
    		lri: "0.03329117908420353",
    		stroke: "0.05489219234885177",
    		nd: "0.037950473390285046"
    	},
    	{
    		id: "MCO",
    		short: "Mo.",
    		name: "Monaco",
    		copd: "0.07185514606607706",
    		diabetes: "0.10832403114625075",
    		ischemic: "0.05914238474299082",
    		lungcancer: "0.07925374725798685",
    		lri: "0.052523618922271496",
    		stroke: "0.06025905698929279",
    		nd: "0.04829329507351514"
    	},
    	{
    		id: "NRU",
    		short: "Nauru",
    		name: "Nauru",
    		copd: "0.02566432382423538",
    		diabetes: "0.032982140520995344",
    		ischemic: "0.038970163744444154",
    		lungcancer: "0.02641547324676535",
    		lri: "0.020691288311322026",
    		stroke: "0.04260788311337005",
    		nd: "0.024673465428666625"
    	},
    	{
    		id: "NIU",
    		short: null,
    		name: "Niue",
    		copd: "0.0330837544309512",
    		diabetes: "0.047267824340410304",
    		ischemic: "0.036761939551745344",
    		lungcancer: "0.03545994320160608",
    		lri: "0.02474686433121288",
    		stroke: "0.03891528216098709",
    		nd: "0.03253060100687016"
    	},
    	{
    		id: "#N/A",
    		name: "Northern Mariana Islands",
    		copd: "0.0488500890169842",
    		diabetes: "0.0642595265981167",
    		ischemic: "0.061132274122903174",
    		lungcancer: "0.05132202842431597",
    		lri: "0.03640483173429607",
    		stroke: "0.06493646601704002",
    		nd: "0.03170329861755527"
    	},
    	{
    		id: "PLW",
    		short: "Palau",
    		name: "Palau",
    		copd: "0.027918448531346358",
    		diabetes: "0.04628387065481152",
    		ischemic: "0.03993987190394558",
    		lungcancer: "0.03163174317373088",
    		lri: "0.020563980443314374",
    		stroke: "0.040858411913237226",
    		nd: "0.043286951611099744"
    	},
    	{
    		id: "KNA",
    		short: "Kna.",
    		name: "Saint Kitts and Nevis",
    		copd: "0.04799162152345526",
    		diabetes: "0.07303673614865511",
    		ischemic: "0.05484813891867584",
    		lungcancer: "0.052957737438513924",
    		lri: "0.03533172099408499",
    		stroke: "0.05795076504286958",
    		nd: "0.04213778390081307"
    	},
    	{
    		id: "SMR",
    		short: null,
    		name: "San Marino",
    		copd: "0.056213849962121594",
    		diabetes: "0.08784966653796196",
    		ischemic: "0.04694689050497687",
    		lungcancer: "0.06264986963525411",
    		lri: "0.04086667942030892",
    		stroke: "0.04745952482927349",
    		nd: "0.0510223186822824"
    	},
    	{
    		id: "TKL",
    		short: null,
    		name: "Tokelau",
    		copd: "0.02639920606198975",
    		diabetes: "0.043639773782429434",
    		ischemic: "0.03201676656566448",
    		lungcancer: "0.02995130252912202",
    		lri: "0.01977601015279568",
    		stroke: "0.03342863169077327",
    		nd: "0.040370895093869"
    	},
    	{
    		id: "TUV",
    		short: null,
    		name: "Tuvalu",
    		copd: "0.033008633746277743",
    		diabetes: "0.032085572340257745",
    		ischemic: "0.034608590154954426",
    		lungcancer: "0.030281050275103496",
    		lri: "0.02495940446896965",
    		stroke: "0.03982955660185242",
    		nd: "0.02177656760768947"
    	},
    	{
    		id: "VIR",
    		short: null,
    		name: "United States Virgin Islands",
    		copd: "0.04856502163674286",
    		diabetes: "0.07570188578907872",
    		ischemic: "0.05262046946966736",
    		lungcancer: "0.05409437194981462",
    		lri: "0.03539246129681299",
    		stroke: "0.055924186271483906",
    		nd: "0.04741819955244729"
    	},
    	{
    		id: "SSD",
    		short: null,
    		name: "South Sudan",
    		copd: "0.10342627579603611",
    		diabetes: "0.043529628085900836",
    		ischemic: "0.058357972951623455",
    		lungcancer: "0.06326438520296418",
    		lri: "0.07915905949320294",
    		stroke: "0.06869906533383477",
    		nd: "0.030135579940052497"
    	},
    	{
    		id: "SDN",
    		short: "Sud.",
    		name: "Sudan",
    		copd: "0.24462136850287644",
    		diabetes: "0.14283607764649964",
    		ischemic: "0.1805741581656336",
    		lungcancer: "0.1835894372783722",
    		lri: "0.19898795150667428",
    		stroke: "0.2038663610082005",
    		nd: "0.07593521717236681"
    	}
    ];

    var countryNameDictionary = [
    	{
    		id: "ARG",
    		short: "Arg.",
    		name: "Argentina"
    	},
    	{
    		id: "AUS",
    		short: "Aus.",
    		name: "Australia"
    	},
    	{
    		id: "AUT",
    		short: "Au.",
    		name: "Austria"
    	},
    	{
    		id: "BEL",
    		short: "Bel.",
    		name: "Belgium"
    	},
    	{
    		id: "BGR",
    		short: "Bu.",
    		name: "Bulgaria"
    	},
    	{
    		id: "BRA",
    		short: "Brazil",
    		name: "Brazil"
    	},
    	{
    		id: "CAN",
    		short: "Can.",
    		name: "Canada"
    	},
    	{
    		id: "CHN",
    		short: "China",
    		name: "China"
    	},
    	{
    		id: "CYP",
    		short: "Cyprus",
    		name: "Cyprus"
    	},
    	{
    		id: "CZE",
    		short: "Czechia",
    		name: "Czechia"
    	},
    	{
    		id: "DEU",
    		short: "Ger.",
    		name: "Germany"
    	},
    	{
    		id: "DNK",
    		short: "Den.",
    		name: "Denmark"
    	},
    	{
    		id: "ESP",
    		short: "Spa.",
    		name: "Spain"
    	},
    	{
    		id: "EST",
    		short: "Est.",
    		name: "Estonia"
    	},
    	{
    		id: "FIN",
    		short: "Fin.",
    		name: "Finland"
    	},
    	{
    		id: "FRA",
    		short: "Fra.",
    		name: "France"
    	},
    	{
    		id: "GBR",
    		short: "U.K.",
    		name: "United Kingdom"
    	},
    	{
    		id: "GRC",
    		short: "Gr.",
    		name: "Greece"
    	},
    	{
    		id: "HRV",
    		short: "Cro.",
    		name: "Croatia"
    	},
    	{
    		id: "HUN",
    		short: "Hun.",
    		name: "Hungary"
    	},
    	{
    		id: "IDN",
    		short: "Indo.",
    		name: "Indonesia"
    	},
    	{
    		id: "IND",
    		short: "India",
    		name: "India"
    	},
    	{
    		id: "IRL",
    		short: "Ire.",
    		name: "Ireland"
    	},
    	{
    		id: "ISL",
    		short: "Ice.",
    		name: "Iceland"
    	},
    	{
    		id: "ITA",
    		short: "Ita.",
    		name: "Italy"
    	},
    	{
    		id: "JPN",
    		short: "Japan",
    		name: "Japan"
    	},
    	{
    		id: "KOR",
    		short: "Rep. of Korea",
    		name: "Rep. of Korea"
    	},
    	{
    		id: "LTU",
    		short: "Lith.",
    		name: "Lithuania"
    	},
    	{
    		id: "LUX",
    		short: "Lux.",
    		name: "Luxembourg"
    	},
    	{
    		id: "LVA",
    		short: "Lat.",
    		name: "Latvia"
    	},
    	{
    		id: "MEX",
    		short: "Mex.",
    		name: "Mexico"
    	},
    	{
    		id: "MLT",
    		short: "Malta",
    		name: "Malta"
    	},
    	{
    		id: "NLD",
    		short: "Neth.",
    		name: "Netherlands"
    	},
    	{
    		id: "POL",
    		short: "Pol.",
    		name: "Poland"
    	},
    	{
    		id: "PRT",
    		short: "Port.",
    		name: "Portugal"
    	},
    	{
    		id: "ROU",
    		short: "Rom.",
    		name: "Romania"
    	},
    	{
    		id: "RUS",
    		short: "Russian Fed.",
    		name: "Russian Fed."
    	},
    	{
    		id: "SAU",
    		short: "S. Ara.",
    		name: "Saudi Arabia"
    	},
    	{
    		id: "SVK",
    		short: "Slovak.",
    		name: "Slovakia"
    	},
    	{
    		id: "SVN",
    		short: "Slo.",
    		name: "Slovenia"
    	},
    	{
    		id: "SWE",
    		short: "Swe.",
    		name: "Sweden"
    	},
    	{
    		id: "TUR",
    		short: "Tur.",
    		name: "Türkiye"
    	},
    	{
    		id: "USA",
    		short: "United States of America",
    		name: "United States of America"
    	},
    	{
    		id: "ZAF",
    		short: "S. Africa",
    		name: "South Africa"
    	},
    	{
    		id: "AFG",
    		short: "Afg.",
    		name: "Afghanistan"
    	},
    	{
    		id: "AGO",
    		short: "An.",
    		name: "Angola"
    	},
    	{
    		id: "ALB",
    		short: "Alb.",
    		name: "Albania"
    	},
    	{
    		id: "AND",
    		short: "And.",
    		name: "Andorra"
    	},
    	{
    		id: "ARE",
    		short: "U.A.E.",
    		name: "United Arab Emirates"
    	},
    	{
    		id: "ARM",
    		short: "Arm.",
    		name: "Armenia"
    	},
    	{
    		id: "ATG",
    		short: "A. and B.",
    		name: "Antigua and Barbuda"
    	},
    	{
    		id: "AZE",
    		short: "Aze.",
    		name: "Azerbaijan"
    	},
    	{
    		id: "BDI",
    		short: "Buru.",
    		name: "Burundi"
    	},
    	{
    		id: "BEN",
    		short: "Benin",
    		name: "Benin"
    	},
    	{
    		id: "BFA",
    		short: "B.F.",
    		name: "Burkina Faso"
    	},
    	{
    		id: "BGD",
    		short: "Bangl.",
    		name: "Bangladesh"
    	},
    	{
    		id: "BHR",
    		short: "Bah.",
    		name: "Bahrain"
    	},
    	{
    		id: "BHS",
    		short: "Bah.",
    		name: "Bahamas"
    	},
    	{
    		id: "BIH",
    		short: "B. and H.",
    		name: "Bosnia and Herzegovina"
    	},
    	{
    		id: "BLR",
    		short: "Bela.",
    		name: "Belarus"
    	},
    	{
    		id: "BLZ",
    		short: "Belize",
    		name: "Belize"
    	},
    	{
    		id: "BOL",
    		short: "Bol.",
    		name: "Bolivia"
    	},
    	{
    		id: "BRB",
    		short: "Barb.",
    		name: "Barbados"
    	},
    	{
    		id: "BRN",
    		short: "Bru.",
    		name: "Brunei Darussalam"
    	},
    	{
    		id: "BTN",
    		short: "Bhu.",
    		name: "Bhutan"
    	},
    	{
    		id: "BWA",
    		short: "Bots.",
    		name: "Botswana"
    	},
    	{
    		id: "CAF",
    		short: "C.A.F.",
    		name: "Central African Rep."
    	},
    	{
    		id: "CHE",
    		short: "Switz.",
    		name: "Switzerland"
    	},
    	{
    		id: "CHL",
    		short: "Chile",
    		name: "Chile"
    	},
    	{
    		id: "CIV",
    		short: "Ivo. Co.",
    		name: "Côte d’Ivoire"
    	},
    	{
    		id: "CMR",
    		short: "Cam.",
    		name: "Cameroon"
    	},
    	{
    		id: "COD",
    		short: "D.R.C.",
    		name: "Dem. Rep. of the Congo"
    	},
    	{
    		id: "COG",
    		short: "Congo",
    		name: "Congo"
    	},
    	{
    		id: "COL",
    		short: "Col.",
    		name: "Colombia"
    	},
    	{
    		id: "COM",
    		short: "Como.",
    		name: "Comoros"
    	},
    	{
    		id: "CPV",
    		short: "C. Verde",
    		name: "Cabo Verde"
    	},
    	{
    		id: "CRI",
    		short: "Co. Rica",
    		name: "Costa Rica"
    	},
    	{
    		id: "CUB",
    		short: "Cuba",
    		name: "Cuba"
    	},
    	{
    		id: "DJI",
    		short: "Dji.",
    		name: "Djibouti"
    	},
    	{
    		id: "DMA",
    		short: "Domin.",
    		name: "Dominica"
    	},
    	{
    		id: "DOM",
    		short: "Dom. Rep.",
    		name: "Dominican Rep."
    	},
    	{
    		id: "DZA",
    		short: "Alg.",
    		name: "Algeria"
    	},
    	{
    		id: "ECU",
    		short: "Ecu.",
    		name: "Ecuador"
    	},
    	{
    		id: "EGY",
    		short: "Egy.",
    		name: "Egypt"
    	},
    	{
    		id: "ERI",
    		short: "Eri.",
    		name: "Eritrea"
    	},
    	{
    		id: "ETH",
    		short: "Ethi.",
    		name: "Ethiopia"
    	},
    	{
    		id: "FJI",
    		short: "Fiji",
    		name: "Fiji"
    	},
    	{
    		id: "FSM",
    		short: "Micr.",
    		name: "Fed. States of Micronesia"
    	},
    	{
    		id: "GAB",
    		short: "Gabon",
    		name: "Gabon"
    	},
    	{
    		id: "GEO",
    		short: "Geo.",
    		name: "Georgia"
    	},
    	{
    		id: "GHA",
    		short: "Gha.",
    		name: "Ghana"
    	},
    	{
    		id: "GIN",
    		short: "Guinea",
    		name: "Guinea"
    	},
    	{
    		id: "GMB",
    		short: "Gamb.",
    		name: "Gambia"
    	},
    	{
    		id: "GNB",
    		short: "Gui.-B.",
    		name: "Guinea-Bissau"
    	},
    	{
    		id: "GNQ",
    		short: "Eq. Gui.",
    		name: "Equatorial Guinea"
    	},
    	{
    		id: "GRD",
    		short: "Gre.",
    		name: "Grenada"
    	},
    	{
    		id: "GTM",
    		short: "Gua.",
    		name: "Guatemala"
    	},
    	{
    		id: "GUY",
    		short: "Guy.",
    		name: "Guyana"
    	},
    	{
    		id: "HND",
    		short: "Hon.",
    		name: "Honduras"
    	},
    	{
    		id: "HTI",
    		short: "Haiti",
    		name: "Haiti"
    	},
    	{
    		id: "IRN",
    		short: "Iran",
    		name: "Islamic Rep. of Iran"
    	},
    	{
    		id: "IRQ",
    		short: "Iraq",
    		name: "Iraq"
    	},
    	{
    		id: "ISR",
    		short: "Isr.",
    		name: "Israel"
    	},
    	{
    		id: "JAM",
    		short: "Jam.",
    		name: "Jamaica"
    	},
    	{
    		id: "JOR",
    		short: "Jor.",
    		name: "Jordan"
    	},
    	{
    		id: "KAZ",
    		short: "Kaz.",
    		name: "Kazakhstan"
    	},
    	{
    		id: "KEN",
    		short: "Ken.",
    		name: "Kenya"
    	},
    	{
    		id: "KGZ",
    		short: "Kyr.",
    		name: "Kyrgyzstan"
    	},
    	{
    		id: "KHM",
    		short: "Camb.",
    		name: "Cambodia"
    	},
    	{
    		id: "KIR",
    		short: "Kiri.",
    		name: "Kiribati"
    	},
    	{
    		id: "KNA",
    		short: "Kna.",
    		name: "Saint Kitts and Nevis"
    	},
    	{
    		id: "KWT",
    		short: "Ku.",
    		name: "Kuwait"
    	},
    	{
    		id: "LAO",
    		short: "Laos",
    		name: "Lao People’s Dem. Rep."
    	},
    	{
    		id: "LBN",
    		short: "Leb.",
    		name: "Lebanon"
    	},
    	{
    		id: "LBR",
    		short: "Libe.",
    		name: "Liberia"
    	},
    	{
    		id: "LBY",
    		short: "Lib.",
    		name: "Libya"
    	},
    	{
    		id: "LCA",
    		short: "St. L.",
    		name: "Saint Lucia"
    	},
    	{
    		id: "LIE",
    		short: "Lie.",
    		name: "Liechtenstein"
    	},
    	{
    		id: "LKA",
    		short: "Sri L.",
    		name: "Sri Lanka"
    	},
    	{
    		id: "LSO",
    		short: "Les.",
    		name: "Lesotho"
    	},
    	{
    		id: "MAR",
    		short: "Mor.",
    		name: "Morocco"
    	},
    	{
    		id: "MCO",
    		short: "Mo.",
    		name: "Monaco"
    	},
    	{
    		id: "MDA",
    		short: "Mold.",
    		name: "Rep. of Moldova"
    	},
    	{
    		id: "MDG",
    		short: "Mada.",
    		name: "Madagascar"
    	},
    	{
    		id: "SYC",
    		short: "Seych.",
    		name: "Seychelles"
    	},
    	{
    		id: "MDV",
    		short: "Mald.",
    		name: "Maldives"
    	},
    	{
    		id: "MHL",
    		short: "Mar. Is.",
    		name: "Marshall Islands"
    	},
    	{
    		id: "MKD",
    		short: "Mac.",
    		name: "North Macedonia"
    	},
    	{
    		id: "MLI",
    		short: "Mali",
    		name: "Mali"
    	},
    	{
    		id: "MMR",
    		short: "Mya.",
    		name: "Myanmar"
    	},
    	{
    		id: "MNE",
    		short: "Mont.",
    		name: "Montenegro"
    	},
    	{
    		id: "MNG",
    		short: "Mon.",
    		name: "Mongolia"
    	},
    	{
    		id: "MOZ",
    		short: "Moz.",
    		name: "Mozambique"
    	},
    	{
    		id: "MRT",
    		short: "Mau.",
    		name: "Mauritania"
    	},
    	{
    		id: "MUS",
    		short: "Maur.",
    		name: "Mauritius"
    	},
    	{
    		id: "MWI",
    		short: "Mala.",
    		name: "Malawi"
    	},
    	{
    		id: "MYS",
    		short: "Mal.",
    		name: "Malaysia"
    	},
    	{
    		id: "NAM",
    		short: "Nam.",
    		name: "Namibia"
    	},
    	{
    		id: "NER",
    		short: "Niger",
    		name: "Niger"
    	},
    	{
    		id: "NGA",
    		short: "Nig.",
    		name: "Nigeria"
    	},
    	{
    		id: "NIC",
    		short: "Nic.",
    		name: "Nicaragua"
    	},
    	{
    		id: "NOR",
    		short: "Nor.",
    		name: "Norway"
    	},
    	{
    		id: "NPL",
    		short: "Nep.",
    		name: "Nepal"
    	},
    	{
    		id: "NRU",
    		short: "Nauru",
    		name: "Nauru"
    	},
    	{
    		id: "NZL",
    		short: "N.Z.",
    		name: "New Zealand"
    	},
    	{
    		id: "OMN",
    		short: "Oman",
    		name: "Oman"
    	},
    	{
    		id: "PAK",
    		short: "Pak.",
    		name: "Pakistan"
    	},
    	{
    		id: "PAN",
    		short: "Pan.",
    		name: "Panama"
    	},
    	{
    		id: "PER",
    		short: "Peru",
    		name: "Peru"
    	},
    	{
    		id: "PHL",
    		short: "Phil.",
    		name: "Philippines"
    	},
    	{
    		id: "PLW",
    		short: "Palau",
    		name: "Palau"
    	},
    	{
    		id: "PNG",
    		short: "Pap. N.G.",
    		name: "Papua New Guinea"
    	},
    	{
    		id: "PRK",
    		short: "N. Kor.",
    		name: "Dem. People’s Rep. of Korea"
    	},
    	{
    		id: "PRY",
    		short: "Para.",
    		name: "Paraguay"
    	},
    	{
    		id: "QAT",
    		short: "Qatar",
    		name: "Qatar"
    	},
    	{
    		id: "RWA",
    		short: "Rwa.",
    		name: "Rwanda"
    	},
    	{
    		id: "SDN",
    		short: "Sud.",
    		name: "Sudan"
    	},
    	{
    		id: "SEN",
    		short: "Sen.",
    		name: "Senegal"
    	},
    	{
    		id: "SGP",
    		short: "Sin.",
    		name: "Singapore"
    	},
    	{
    		id: "SLB",
    		short: "Solo. Is.",
    		name: "Solomon Islands"
    	},
    	{
    		id: "SLE",
    		short: "S. Leone",
    		name: "Sierra Leone"
    	},
    	{
    		id: "SLV",
    		short: "El Sal.",
    		name: "El Salvador"
    	},
    	{
    		id: "SOM",
    		short: "Som.",
    		name: "Somalia"
    	},
    	{
    		id: "SRB",
    		short: "Ser.",
    		name: "Serbia"
    	},
    	{
    		id: "SSD",
    		short: null,
    		name: "South Sudan"
    	},
    	{
    		id: "STP",
    		short: "S.T. and P.",
    		name: "Sao Tome and Principe"
    	},
    	{
    		id: "SUR",
    		short: "Suri.",
    		name: "Suriname"
    	},
    	{
    		id: "SWZ",
    		short: "Eswatini",
    		name: "Eswatini"
    	},
    	{
    		id: "SYR",
    		short: "Syr.",
    		name: "Syrian Arab Rep."
    	},
    	{
    		id: "TCA",
    		short: "Tca.",
    		name: "Turks and Caicos Islands"
    	},
    	{
    		id: "TCD",
    		short: "Chad",
    		name: "Chad"
    	},
    	{
    		id: "TGO",
    		short: "Togo",
    		name: "Togo"
    	},
    	{
    		id: "THA",
    		short: "Tha.",
    		name: "Thailand"
    	},
    	{
    		id: "TJK",
    		short: "Taj.",
    		name: "Tajikistan"
    	},
    	{
    		id: "TKM",
    		short: "Turkm.",
    		name: "Turkmenistan"
    	},
    	{
    		id: "TLS",
    		short: "T.L.",
    		name: "Timor-Leste"
    	},
    	{
    		id: "TON",
    		short: "Tonga",
    		name: "Tonga"
    	},
    	{
    		id: "TTO",
    		short: "T.",
    		name: "Trinidad and Tobago"
    	},
    	{
    		id: "TUN",
    		short: "Tuni.",
    		name: "Tunisia"
    	},
    	{
    		id: "TZA",
    		short: "Tanz.",
    		name: "United Rep. of Tanzania"
    	},
    	{
    		id: "UGA",
    		short: "Ug.",
    		name: "Uganda"
    	},
    	{
    		id: "UKR",
    		short: "Ukr.",
    		name: "Ukraine"
    	},
    	{
    		id: "URY",
    		short: "Uru.",
    		name: "Uruguay"
    	},
    	{
    		id: "UZB",
    		short: "Uzb.",
    		name: "Uzbekistan"
    	},
    	{
    		id: "VCT",
    		short: "Vct.",
    		name: "Saint Vincent and the Grenadines"
    	},
    	{
    		id: "VEN",
    		short: "Ven.",
    		name: "Venezuela"
    	},
    	{
    		id: "VGB",
    		short: "Br. V. Is.",
    		name: "British Virgin Islands"
    	},
    	{
    		id: "VNM",
    		short: "Viet.",
    		name: "Viet Nam"
    	},
    	{
    		id: "VUT",
    		short: "Van.",
    		name: "Vanuatu"
    	},
    	{
    		id: "WSM",
    		short: "Samoa",
    		name: "Samoa"
    	},
    	{
    		id: "YEM",
    		short: "Yemen",
    		name: "Yemen"
    	},
    	{
    		id: "ZMB",
    		short: "Zambia",
    		name: "Zambia"
    	},
    	{
    		id: "ZWE",
    		short: "Zimb.",
    		name: "Zimbabwe"
    	},
    	{
    		id: "ASM",
    		short: null,
    		name: "American Samoa"
    	},
    	{
    		id: "AIA",
    		short: null,
    		name: "Anguilla"
    	},
    	{
    		id: "BMU",
    		short: null,
    		name: "Bermuda"
    	},
    	{
    		id: "CYM",
    		short: null,
    		name: "British Virgin Islands"
    	},
    	{
    		id: "CUW",
    		short: null,
    		name: "Curaçao"
    	},
    	{
    		id: "FLK",
    		short: null,
    		name: "Falkland Islands (Malvinas)"
    	},
    	{
    		id: "FRO",
    		short: null,
    		name: "Faroe Islands"
    	},
    	{
    		id: "GIB",
    		short: null,
    		name: "Gibraltar"
    	},
    	{
    		id: "GRL",
    		short: null,
    		name: "Greenland"
    	},
    	{
    		id: "GUM",
    		short: null,
    		name: "Guam"
    	},
    	{
    		id: "VAT",
    		short: null,
    		name: "Holy See"
    	},
    	{
    		id: "JEY",
    		short: null,
    		name: "Jersey"
    	},
    	{
    		id: "MSR",
    		short: null,
    		name: "Montserrat"
    	},
    	{
    		id: "NCL",
    		short: null,
    		name: "New Caledonia"
    	},
    	{
    		id: "NIU",
    		short: null,
    		name: "Niue"
    	},
    	{
    		id: "NFK",
    		short: null,
    		name: "Norfolk Island"
    	},
    	{
    		id: "PCN",
    		short: null,
    		name: "Pitcairn"
    	},
    	{
    		id: "SHN",
    		short: null,
    		name: "Saint Helena"
    	},
    	{
    		id: "SPM",
    		short: null,
    		name: "Saint Pierre et Miquelon"
    	},
    	{
    		id: "SMR",
    		short: null,
    		name: "San Marino"
    	},
    	{
    		id: "PSE",
    		short: null,
    		name: "State of Palestine"
    	},
    	{
    		id: "TKL",
    		short: null,
    		name: "Tokelau"
    	},
    	{
    		id: "TUV",
    		short: null,
    		name: "Tuvalu"
    	},
    	{
    		id: "VIR",
    		short: null,
    		name: "United States Virgin Islands"
    	},
    	{
    		id: "ESH",
    		short: null,
    		name: "Western Sahara"
    	},
    	{
    		id: "COQ",
    		name: "Cook Isl."
    	},
    	{
    		id: "MNP",
    		name: "Northern Mariana Islands"
    	}
    ];

    var deaths_data = [
    	{
    		id: "AND",
    		x: 234,
    		y: 132,
    		deaths: 11,
    		rate: 13.24
    	},
    	{
    		id: "ARE",
    		x: 385.569,
    		y: 243.075,
    		deaths: 3252,
    		rate: 35.19
    	},
    	{
    		id: "AFG",
    		x: 406.663,
    		y: 203.447,
    		deaths: 8679,
    		rate: 22.67
    	},
    	{
    		id: "ATG",
    		x: 134.917,
    		y: 164.156,
    		deaths: 30,
    		rate: 33.9
    	},
    	{
    		id: "ALB",
    		x: 288.457,
    		y: 183.615,
    		deaths: 1532,
    		rate: 56.32
    	},
    	{
    		id: "ARM",
    		x: 406.283,
    		y: 183.615,
    		deaths: 3091,
    		rate: 102.36
    	},
    	{
    		id: "AGO",
    		x: 288.569,
    		y: 322.317,
    		deaths: 5563,
    		rate: 18.46
    	},
    	{
    		id: "ARG",
    		x: 115.134,
    		y: 322.696,
    		deaths: 12590,
    		rate: 27.91
    	},
    	{
    		id: "AUT",
    		x: 288.457,
    		y: 124.156,
    		deaths: 2389,
    		rate: 26.79
    	},
    	{
    		id: "AUS",
    		x: 565.86,
    		y: 326.062,
    		deaths: 1781,
    		rate: 7.25
    	},
    	{
    		id: "AZE",
    		x: 407.32,
    		y: 161.315,
    		deaths: 7860,
    		rate: 76.47
    	},
    	{
    		id: "BIH",
    		x: 308.239,
    		y: 163.777,
    		deaths: 3622,
    		rate: 109.76
    	},
    	{
    		id: "BRB",
    		x: 154.755,
    		y: 183.994,
    		deaths: 175,
    		rate: 58.77
    	},
    	{
    		id: "BGD",
    		x: 548.449,
    		y: 237.385,
    		deaths: 73976,
    		rate: 46.45
    	},
    	{
    		id: "BEL",
    		x: 228.997,
    		y: 104.373,
    		deaths: 3491,
    		rate: 30.57
    	},
    	{
    		id: "BFA",
    		x: 261.327,
    		y: 243.075,
    		deaths: 3384,
    		rate: 14.91
    	},
    	{
    		id: "BGR",
    		x: 328.078,
    		y: 143.994,
    		deaths: 9072,
    		rate: 130.82
    	},
    	{
    		id: "BHR",
    		x: 391.9,
    		y: 223.236,
    		deaths: 624,
    		rate: 43.25
    	},
    	{
    		id: "BDI",
    		x: 347.973,
    		y: 322.317,
    		deaths: 977,
    		rate: 8.19
    	},
    	{
    		id: "BEN",
    		x: 266.855,
    		y: 262.857,
    		deaths: 2304,
    		rate: 18.19
    	},
    	{
    		id: "BRN",
    		x: 546.021,
    		y: 262.857,
    		deaths: 39,
    		rate: 8.92
    	},
    	{
    		id: "BOL",
    		x: 115.134,
    		y: 283.075,
    		deaths: 3885,
    		rate: 32.34
    	},
    	{
    		id: "BRA",
    		x: 134.917,
    		y: 284.528,
    		deaths: 43575,
    		rate: 20.11
    	},
    	{
    		id: "BHS",
    		x: 75.457,
    		y: 144.373,
    		deaths: 99,
    		rate: 26.26
    	},
    	{
    		id: "BTN",
    		x: 531.524,
    		y: 216.738,
    		deaths: 270,
    		rate: 35.8
    	},
    	{
    		id: "BWA",
    		x: 308.408,
    		y: 342.155,
    		deaths: 942,
    		rate: 40.28
    	},
    	{
    		id: "BLR",
    		x: 328.078,
    		y: 82.326,
    		deaths: 8403,
    		rate: 88.45
    	},
    	{
    		id: "BLZ",
    		x: 35.836,
    		y: 164.867,
    		deaths: 93,
    		rate: 22.68
    	},
    	{
    		id: "CAN",
    		x: 35.836,
    		y: 101.356,
    		deaths: 3765,
    		rate: 10.31
    	},
    	{
    		id: "COD",
    		x: 308.408,
    		y: 303.528,
    		deaths: 11060,
    		rate: 12.62
    	},
    	{
    		id: "CAF",
    		x: 328.19,
    		y: 282.696,
    		deaths: 931,
    		rate: 17.57
    	},
    	{
    		id: "COG",
    		x: 288.569,
    		y: 302.534,
    		deaths: 1803,
    		rate: 34.24
    	},
    	{
    		id: "CHE",
    		x: 268.618,
    		y: 124.156,
    		deaths: 1374,
    		rate: 15.66
    	},
    	{
    		id: "CIV",
    		x: 229.053,
    		y: 262.857,
    		deaths: 6732,
    		rate: 25.72
    	},
    	{
    		id: "CHL",
    		x: 95.296,
    		y: 322.696,
    		deaths: 5808,
    		rate: 31.91
    	},
    	{
    		id: "CMR",
    		x: 308.183,
    		y: 288.516,
    		deaths: 10250,
    		rate: 35.22
    	},
    	{
    		id: "CHN",
    		x: 561.332,
    		y: 133.366,
    		deaths: 1423633,
    		rate: 100.09
    	},
    	{
    		id: "COL",
    		x: 95.296,
    		y: 263.236,
    		deaths: 13033,
    		rate: 27.28
    	},
    	{
    		id: "CRI",
    		x: 55.675,
    		y: 223.615,
    		deaths: 938,
    		rate: 19.89
    	},
    	{
    		id: "CUB",
    		x: 75.457,
    		y: 164.156,
    		deaths: 5845,
    		rate: 51.46
    	},
    	{
    		id: "CPV",
    		x: 209.159,
    		y: 203.454,
    		deaths: 319,
    		rate: 56.6
    	},
    	{
    		id: "CYP",
    		x: 322.891,
    		y: 200.822,
    		deaths: 413,
    		rate: 31.44
    	},
    	{
    		id: "CZE",
    		x: 288.457,
    		y: 104.373,
    		deaths: 6255,
    		rate: 58.77
    	},
    	{
    		id: "DEU",
    		x: 268.716,
    		y: 106.204,
    		deaths: 27041,
    		rate: 31.85
    	},
    	{
    		id: "DJI",
    		x: 367.699,
    		y: 262.857,
    		deaths: 453,
    		rate: 37.66
    	},
    	{
    		id: "DNK",
    		x: 268.618,
    		y: 84.535,
    		deaths: 1298,
    		rate: 22.37
    	},
    	{
    		id: "DMA",
    		x: 134.917,
    		y: 203.777,
    		deaths: 33,
    		rate: 48.05
    	},
    	{
    		id: "DOM",
    		x: 115.134,
    		y: 164.156,
    		deaths: 3798,
    		rate: 34.9
    	},
    	{
    		id: "DZA",
    		x: 269.865,
    		y: 203.454,
    		deaths: 21613,
    		rate: 51.65
    	},
    	{
    		id: "ECU",
    		x: 95.296,
    		y: 283.075,
    		deaths: 4236,
    		rate: 24.08
    	},
    	{
    		id: "EST",
    		x: 328.078,
    		y: 44.914,
    		deaths: 160,
    		rate: 12.19
    	},
    	{
    		id: "EGY",
    		x: 303.841,
    		y: 223.651,
    		deaths: 90559,
    		rate: 91.41
    	},
    	{
    		id: "ERI",
    		x: 347.883,
    		y: 243.202,
    		deaths: 1380,
    		rate: 20.56
    	},
    	{
    		id: "ESP",
    		x: 228.997,
    		y: 143.994,
    		deaths: 8880,
    		rate: 19.3
    	},
    	{
    		id: "ETH",
    		x: 347.86,
    		y: 262.913,
    		deaths: 8957,
    		rate: 8.33
    	},
    	{
    		id: "FIN",
    		x: 308.239,
    		y: 44.914,
    		deaths: 385,
    		rate: 6.96
    	},
    	{
    		id: "FJI",
    		x: 645.158,
    		y: 343.531,
    		deaths: 330,
    		rate: 36.21
    	},
    	{
    		id: "FSM",
    		x: 625.32,
    		y: 282.696,
    		deaths: 32,
    		rate: 31.34
    	},
    	{
    		id: "FRA",
    		x: 248.738,
    		y: 124.156,
    		deaths: 13245,
    		rate: 20.01
    	},
    	{
    		id: "GAB",
    		x: 288.513,
    		y: 283.573,
    		deaths: 821,
    		rate: 46.91
    	},
    	{
    		id: "GBR",
    		x: 228.997,
    		y: 64.752,
    		deaths: 14449,
    		rate: 21.49
    	},
    	{
    		id: "GRD",
    		x: 134.917,
    		y: 223.615,
    		deaths: 51,
    		rate: 49.41
    	},
    	{
    		id: "GEO",
    		x: 387.537,
    		y: 163.777,
    		deaths: 3112,
    		rate: 84.92
    	},
    	{
    		id: "GHA",
    		x: 248.774,
    		y: 243.075,
    		deaths: 12544,
    		rate: 39.78
    	},
    	{
    		id: "GMB",
    		x: 229.053,
    		y: 223.236,
    		deaths: 487,
    		rate: 21.68
    	},
    	{
    		id: "GIN",
    		x: 229.053,
    		y: 243.075,
    		deaths: 2455,
    		rate: 19.42
    	},
    	{
    		id: "GNQ",
    		x: 268.731,
    		y: 282.696,
    		deaths: 397,
    		rate: 27.96
    	},
    	{
    		id: "GRC",
    		x: 328.078,
    		y: 183.615,
    		deaths: 5715,
    		rate: 55.29
    	},
    	{
    		id: "GTM",
    		x: 16.054,
    		y: 164.156,
    		deaths: 3734,
    		rate: 21.01
    	},
    	{
    		id: "GNB",
    		x: 209.215,
    		y: 243.075,
    		deaths: 355,
    		rate: 18.67
    	},
    	{
    		id: "GUY",
    		x: 134.917,
    		y: 263.236,
    		deaths: 411,
    		rate: 53.33
    	},
    	{
    		id: "HND",
    		x: 35.836,
    		y: 183.994,
    		deaths: 1783,
    		rate: 18.17
    	},
    	{
    		id: "HRV",
    		x: 288.457,
    		y: 163.777,
    		deaths: 3072,
    		rate: 72.32
    	},
    	{
    		id: "HTI",
    		x: 95.296,
    		y: 164.156,
    		deaths: 1822,
    		rate: 14.69
    	},
    	{
    		id: "HUN",
    		x: 308.239,
    		y: 124.364,
    		deaths: 6940,
    		rate: 71.74
    	},
    	{
    		id: "IDN",
    		x: 552.368,
    		y: 300.021,
    		deaths: 106710,
    		rate: 41.13
    	},
    	{
    		id: "IRL",
    		x: 209.159,
    		y: 64.752,
    		deaths: 535,
    		rate: 10.9
    	},
    	{
    		id: "ISR",
    		x: 352.019,
    		y: 223.236,
    		deaths: 2280,
    		rate: 24.49
    	},
    	{
    		id: "IND",
    		x: 461.79,
    		y: 283.156,
    		deaths: 979682,
    		rate: 70.44
    	},
    	{
    		id: "IRQ",
    		x: 359.784,
    		y: 205.081,
    		deaths: 25378,
    		rate: 60.25
    	},
    	{
    		id: "IRN",
    		x: 385.468,
    		y: 200.55,
    		deaths: 41742,
    		rate: 49.52
    	},
    	{
    		id: "ISL",
    		x: 134.917,
    		y: 84.914,
    		deaths: 16,
    		rate: 4.64
    	},
    	{
    		id: "ITA",
    		x: 268.618,
    		y: 143.994,
    		deaths: 24666,
    		rate: 40.9
    	},
    	{
    		id: "JAM",
    		x: 75.457,
    		y: 183.994,
    		deaths: 938,
    		rate: 33.37
    	},
    	{
    		id: "JOR",
    		x: 360.024,
    		y: 223.236,
    		deaths: 3074,
    		rate: 26.42
    	},
    	{
    		id: "JPN",
    		x: 677.929,
    		y: 163.777,
    		deaths: 39692,
    		rate: 31.06
    	},
    	{
    		id: "KEN",
    		x: 347.973,
    		y: 302.534,
    		deaths: 5490,
    		rate: 10.93
    	},
    	{
    		id: "KGZ",
    		x: 465.19,
    		y: 163.777,
    		deaths: 2586,
    		rate: 39.57
    	},
    	{
    		id: "KHM",
    		x: 597.813,
    		y: 232.148,
    		deaths: 3499,
    		rate: 21.07
    	},
    	{
    		id: "KIR",
    		x: 662.328,
    		y: 301.869,
    		deaths: 18,
    		rate: 15.17
    	},
    	{
    		id: "COM",
    		x: 356.433,
    		y: 341.077,
    		deaths: 93,
    		rate: 13.02
    	},
    	{
    		id: "PRK",
    		x: 653.367,
    		y: 163.189,
    		deaths: 21590,
    		rate: 82.3
    	},
    	{
    		id: "KOR",
    		x: 653.372,
    		y: 184.203,
    		deaths: 21837,
    		rate: 40.89
    	},
    	{
    		id: "KWT",
    		x: 386.552,
    		y: 223.236,
    		deaths: 1526,
    		rate: 34.47
    	},
    	{
    		id: "KAZ",
    		x: 465.618,
    		y: 126.504,
    		deaths: 10133,
    		rate: 55.09
    	},
    	{
    		id: "LAO",
    		x: 597.418,
    		y: 221.119,
    		deaths: 1376,
    		rate: 19.22
    	},
    	{
    		id: "LBN",
    		x: 329.172,
    		y: 203.454,
    		deaths: 3303,
    		rate: 63.8
    	},
    	{
    		id: "LCA",
    		x: 134.917,
    		y: 183.994,
    		deaths: 80,
    		rate: 45.81
    	},
    	{
    		id: "LKA",
    		x: 486.618,
    		y: 357.503,
    		deaths: 7261,
    		rate: 33.22
    	},
    	{
    		id: "LBR",
    		x: 248.836,
    		y: 282.696,
    		deaths: 656,
    		rate: 13.7
    	},
    	{
    		id: "LSO",
    		x: 328.19,
    		y: 381.776,
    		deaths: 839,
    		rate: 40.11
    	},
    	{
    		id: "LTU",
    		x: 308.239,
    		y: 64.752,
    		deaths: 1264,
    		rate: 45.24
    	},
    	{
    		id: "LUX",
    		x: 248.836,
    		y: 104.373,
    		deaths: 91,
    		rate: 14.71
    	},
    	{
    		id: "LVA",
    		x: 328.078,
    		y: 64.752,
    		deaths: 1119,
    		rate: 58.42
    	},
    	{
    		id: "LBY",
    		x: 278.472,
    		y: 223.236,
    		deaths: 3368,
    		rate: 50
    	},
    	{
    		id: "MAR",
    		x: 247.701,
    		y: 203.454,
    		deaths: 27063,
    		rate: 75.27
    	},
    	{
    		id: "MDA",
    		x: 347.916,
    		y: 124.156,
    		deaths: 2102,
    		rate: 56.99
    	},
    	{
    		id: "MNE",
    		x: 308.239,
    		y: 183.615,
    		deaths: 564,
    		rate: 90.92
    	},
    	{
    		id: "MDG",
    		x: 363.296,
    		y: 342.413,
    		deaths: 2246,
    		rate: 8.42
    	},
    	{
    		id: "MHL",
    		x: 645.158,
    		y: 282.696,
    		deaths: 12,
    		rate: 21.11
    	},
    	{
    		id: "MKD",
    		x: 328.078,
    		y: 163.777,
    		deaths: 2751,
    		rate: 127.79
    	},
    	{
    		id: "MLI",
    		x: 270.144,
    		y: 240.19,
    		deaths: 3246,
    		rate: 14.81
    	},
    	{
    		id: "MMR",
    		x: 578.612,
    		y: 226.789,
    		deaths: 24169,
    		rate: 44.2
    	},
    	{
    		id: "MNG",
    		x: 475.764,
    		y: 138.195,
    		deaths: 2245,
    		rate: 66.27
    	},
    	{
    		id: "MRT",
    		x: 258.353,
    		y: 223.236,
    		deaths: 1411,
    		rate: 35.15
    	},
    	{
    		id: "MLT",
    		x: 248.948,
    		y: 163.833,
    		deaths: 147,
    		rate: 33.47
    	},
    	{
    		id: "MUS",
    		x: 375.801,
    		y: 341.956,
    		deaths: 606,
    		rate: 47.47
    	},
    	{
    		id: "MDV",
    		x: 466.779,
    		y: 351.844,
    		deaths: 49,
    		rate: 9.83
    	},
    	{
    		id: "MWI",
    		x: 328.19,
    		y: 322.317,
    		deaths: 1312,
    		rate: 7.11
    	},
    	{
    		id: "MEX",
    		x: 35.836,
    		y: 150.228,
    		deaths: 36582,
    		rate: 29.28
    	},
    	{
    		id: "MYS",
    		x: 537.222,
    		y: 263.854,
    		deaths: 10551,
    		rate: 33.71
    	},
    	{
    		id: "MOZ",
    		x: 347.973,
    		y: 342.155,
    		deaths: 1879,
    		rate: 6.36
    	},
    	{
    		id: "NAM",
    		x: 288.569,
    		y: 342.155,
    		deaths: 789,
    		rate: 32.83
    	},
    	{
    		id: "NER",
    		x: 278.712,
    		y: 240.363,
    		deaths: 2971,
    		rate: 12.75
    	},
    	{
    		id: "NGA",
    		x: 288.899,
    		y: 262.852,
    		deaths: 68533,
    		rate: 31.9
    	},
    	{
    		id: "NIC",
    		x: 35.836,
    		y: 203.777,
    		deaths: 1002,
    		rate: 15.39
    	},
    	{
    		id: "NLD",
    		x: 248.836,
    		y: 84.535,
    		deaths: 4569,
    		rate: 26.63
    	},
    	{
    		id: "NOR",
    		x: 268.618,
    		y: 44.914,
    		deaths: 393,
    		rate: 7.35
    	},
    	{
    		id: "NPL",
    		x: 469.926,
    		y: 203.199,
    		deaths: 17948,
    		rate: 59.01
    	},
    	{
    		id: "NZL",
    		x: 585.699,
    		y: 342.155,
    		deaths: 303,
    		rate: 6.74
    	},
    	{
    		id: "OMN",
    		x: 378.022,
    		y: 243.075,
    		deaths: 1553,
    		rate: 33.88
    	},
    	{
    		id: "PAN",
    		x: 75.457,
    		y: 243.454,
    		deaths: 650,
    		rate: 15.62
    	},
    	{
    		id: "PER",
    		x: 95.296,
    		y: 302.857,
    		deaths: 8905,
    		rate: 26.19
    	},
    	{
    		id: "PNG",
    		x: 577.916,
    		y: 282.696,
    		deaths: 1181,
    		rate: 11.97
    	},
    	{
    		id: "PHL",
    		x: 646.929,
    		y: 245.075,
    		deaths: 32019,
    		rate: 28.55
    	},
    	{
    		id: "PAK",
    		x: 436.909,
    		y: 192.04,
    		deaths: 114008,
    		rate: 50.88
    	},
    	{
    		id: "POL",
    		x: 288.457,
    		y: 82.704,
    		deaths: 27762,
    		rate: 72.23
    	},
    	{
    		id: "PRT",
    		x: 209.159,
    		y: 143.994,
    		deaths: 2086,
    		rate: 19.58
    	},
    	{
    		id: "PRY",
    		x: 115.134,
    		y: 302.857,
    		deaths: 1045,
    		rate: 15.08
    	},
    	{
    		id: "QAT",
    		x: 392.018,
    		y: 243.075,
    		deaths: 539,
    		rate: 18.82
    	},
    	{
    		id: "ROU",
    		x: 328.078,
    		y: 126.906,
    		deaths: 14577,
    		rate: 75.78
    	},
    	{
    		id: "SRB",
    		x: 308.239,
    		y: 143.994,
    		deaths: 10609,
    		rate: 121.29
    	},
    	{
    		id: "RUS",
    		x: 415.618,
    		y: 103.43,
    		deaths: 73859,
    		rate: 50.34
    	},
    	{
    		id: "RWA",
    		x: 328.19,
    		y: 302.534,
    		deaths: 1758,
    		rate: 13.86
    	},
    	{
    		id: "SAU",
    		x: 373.844,
    		y: 225.952,
    		deaths: 17795,
    		rate: 49.8
    	},
    	{
    		id: "SLB",
    		x: 625.32,
    		y: 322.317,
    		deaths: 109,
    		rate: 16.63
    	},
    	{
    		id: "SWE",
    		x: 288.457,
    		y: 44.914,
    		deaths: 649,
    		rate: 6.35
    	},
    	{
    		id: "SGP",
    		x: 533.216,
    		y: 274.304,
    		deaths: 1331,
    		rate: 23.48
    	},
    	{
    		id: "SVN",
    		x: 288.457,
    		y: 143.994,
    		deaths: 823,
    		rate: 39.68
    	},
    	{
    		id: "SVK",
    		x: 308.239,
    		y: 104.373,
    		deaths: 3472,
    		rate: 63.86
    	},
    	{
    		id: "SLE",
    		x: 209.215,
    		y: 262.857,
    		deaths: 1542,
    		rate: 18.61
    	},
    	{
    		id: "SEN",
    		x: 248.836,
    		y: 223.236,
    		deaths: 3369,
    		rate: 22.26
    	},
    	{
    		id: "SOM",
    		x: 367.699,
    		y: 282.696,
    		deaths: 770,
    		rate: 3.79
    	},
    	{
    		id: "SUR",
    		x: 154.755,
    		y: 263.236,
    		deaths: 261,
    		rate: 45.32
    	},
    	{
    		id: "STP",
    		x: 248.892,
    		y: 302.534,
    		deaths: 52,
    		rate: 25.32
    	},
    	{
    		id: "SLV",
    		x: 16.054,
    		y: 183.994,
    		deaths: 1901,
    		rate: 30.39
    	},
    	{
    		id: "SYR",
    		x: 341.021,
    		y: 203.454,
    		deaths: 10474,
    		rate: 72.28
    	},
    	{
    		id: "TCD",
    		x: 311.158,
    		y: 262.857,
    		deaths: 2614,
    		rate: 15.94
    	},
    	{
    		id: "TGO",
    		x: 248.892,
    		y: 262.857,
    		deaths: 1619,
    		rate: 20.44
    	},
    	{
    		id: "THA",
    		x: 580.097,
    		y: 250.66,
    		deaths: 32211,
    		rate: 45.94
    	},
    	{
    		id: "TJK",
    		x: 465.514,
    		y: 183.577,
    		deaths: 4758,
    		rate: 50.12
    	},
    	{
    		id: "TLS",
    		x: 546.021,
    		y: 324.181,
    		deaths: 210,
    		rate: 15.73
    	},
    	{
    		id: "TKM",
    		x: 446.997,
    		y: 164.056,
    		deaths: 3577,
    		rate: 70.37
    	},
    	{
    		id: "TUN",
    		x: 267.718,
    		y: 223.236,
    		deaths: 7337,
    		rate: 63.41
    	},
    	{
    		id: "TON",
    		x: 664.997,
    		y: 342.155,
    		deaths: 20,
    		rate: 19.54
    	},
    	{
    		id: "TUR",
    		x: 356.493,
    		y: 179.394,
    		deaths: 41524,
    		rate: 51.04
    	},
    	{
    		id: "TTO",
    		x: 115.134,
    		y: 223.615,
    		deaths: 890,
    		rate: 64.15
    	},
    	{
    		id: "TZA",
    		x: 367.755,
    		y: 321.557,
    		deaths: 6246,
    		rate: 11.01
    	},
    	{
    		id: "UKR",
    		x: 328.078,
    		y: 103.622,
    		deaths: 42916,
    		rate: 97.44
    	},
    	{
    		id: "UGA",
    		x: 348.029,
    		y: 282.696,
    		deaths: 4586,
    		rate: 11.15
    	},
    	{
    		id: "USA",
    		x: 35.836,
    		y: 121.364,
    		deaths: 47787,
    		rate: 14.57
    	},
    	{
    		id: "URY",
    		x: 134.917,
    		y: 302.857,
    		deaths: 733,
    		rate: 21.33
    	},
    	{
    		id: "UZB",
    		x: 446.997,
    		y: 147.893,
    		deaths: 26749,
    		rate: 79.43
    	},
    	{
    		id: "VCT",
    		x: 115.134,
    		y: 203.777,
    		deaths: 62,
    		rate: 54.8
    	},
    	{
    		id: "VEN",
    		x: 115.134,
    		y: 261.783,
    		deaths: 12384,
    		rate: 44.12
    	},
    	{
    		id: "VNM",
    		x: 616.075,
    		y: 228.939,
    		deaths: 37457,
    		rate: 38.87
    	},
    	{
    		id: "VUT",
    		x: 640.158,
    		y: 341.78,
    		deaths: 54,
    		rate: 18.33
    	},
    	{
    		id: "WSM",
    		x: 664.997,
    		y: 322.317,
    		deaths: 41,
    		rate: 19.4
    	},
    	{
    		id: "YEM",
    		x: 367.136,
    		y: 243.218,
    		deaths: 11282,
    		rate: 35.81
    	},
    	{
    		id: "ZAF",
    		x: 308.408,
    		y: 361.938,
    		deaths: 24780,
    		rate: 44.58
    	},
    	{
    		id: "ZMB",
    		x: 308.408,
    		y: 322.317,
    		deaths: 2949,
    		rate: 16.17
    	},
    	{
    		id: "ZWE",
    		x: 328.19,
    		y: 342.155,
    		deaths: 2607,
    		rate: 17.37
    	}
    ];

    var arrowRight = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 22\"><path d=\"M15.244 11.767L8.39 18.672a1.12 1.12 0 11-1.59-1.579l6.064-6.11-6.11-6.064a1.12 1.12 0 011.58-1.59l6.904 6.854a1.117 1.117 0 01.006 1.584\"/></svg>";

    var arrowLeft = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 22\"><path d=\"M6.756 11.767l6.854 6.905a1.12 1.12 0 101.59-1.579l-6.064-6.11 6.11-6.064a1.12 1.12 0 00-1.58-1.59l-6.904 6.854a1.117 1.117 0 00-.006 1.584\"/></svg>";

    var arrowDown = "\n<svg version=\"1.0\"\nviewBox=\"0 0 800.000000 467.000000\">\n<g transform=\"translate(0.000000,467.000000) scale(0.100000,-0.100000)\"\nfill=\"#000000\" stroke=\"none\">\n<path d=\"M1913 3656 c-112 -37 -200 -122 -229 -224 -22 -75 -15 -180 17 -247\n18 -40 219 -248 1038 -1074 559 -563 1034 -1036 1056 -1051 111 -76 289 -79\n404 -6 20 13 495 486 1057 1052 823 830 1025 1039 1043 1079 32 67 39 172 17\n248 -24 83 -86 154 -171 197 -61 32 -76 35 -149 35 -149 -1 -83 56 -1073 -936\n-485 -486 -891 -895 -902 -909 l-21 -25 -26 30 c-15 17 -421 426 -903 909\n-737 739 -884 883 -928 903 -65 30 -170 39 -230 19z\"/>\n</g>\n</svg>\n";

    var dataSource = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\"><defs><style>.svg-ds-1{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;}</style></defs><g id=\"icon\"><path class=\"svg-ds-1\" d=\"M4.5,18V6.5a2,2,0,0,1,2-2h23a2,2,0,0,1,2,2v23a2,2,0,0,1-2,2H18\"/><line class=\"svg-ds-1\" x1=\"4\" y1=\"11\" x2=\"31\" y2=\"11\"/><line class=\"svg-ds-1\" x1=\"24\" y1=\"16\" x2=\"28\" y2=\"16\"/><line class=\"svg-ds-1\" x1=\"20\" y1=\"21\" x2=\"28\" y2=\"21\"/><line class=\"svg-ds-1\" x1=\"22\" y1=\"26\" x2=\"28\" y2=\"26\"/><line class=\"svg-ds-1\" x1=\"8\" y1=\"16\" x2=\"14\" y2=\"16\"/><line class=\"svg-ds-1\" x1=\"3\" y1=\"30\" x2=\"12\" y2=\"21\"/><polyline class=\"svg-ds-1\" points=\"4 21 12 21 12 29\"/></g></svg>";

    var embed = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\"><defs><style>.svg-embed-1{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.93px;}</style></defs><g id=\"icon\"><path class=\"svg-embed-1\" d=\"M20.5,31.5H6.5a2,2,0,0,1-2-2V6.5a2,2,0,0,1,2-2h14a2,2,0,0,1,2,2V9\"/><polyline class=\"svg-embed-1\" points=\"17 16.5 14 19.5 17 22.5\"/><polyline class=\"svg-embed-1\" points=\"24 22.5 27 19.5 24 16.5\"/><line class=\"svg-embed-1\" x1=\"18.5\" y1=\"24\" x2=\"22.5\" y2=\"15\"/><rect class=\"svg-embed-1\" x=\"8.5\" y=\"12\" width=\"23\" height=\"15\"/></g></svg>";

    var data$1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g id=\"ux\"><path d=\"M6.5,16.5V8.4A1.4,1.4,0,0,1,7.9,7H24a1.4,1.4,0,0,1,1.4,1.4V24.5A1.4,1.4,0,0,1,24,25.9H15.9\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><line x1=\"6.1\" y1=\"11.6\" x2=\"25\" y2=\"11.6\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><line x1=\"20.1\" y1=\"15.1\" x2=\"22.9\" y2=\"15.1\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><line x1=\"17.3\" y1=\"18.6\" x2=\"22.9\" y2=\"18.6\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><line x1=\"18.7\" y1=\"22.1\" x2=\"22.9\" y2=\"22.1\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><line x1=\"8.9\" y1=\"15.1\" x2=\"13.1\" y2=\"15.1\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><line x1=\"5.4\" y1=\"24.9\" x2=\"11.7\" y2=\"18.6\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><polyline points=\"6.1 18.6 11.7 18.6 11.7 24.2\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/></g></svg>";

    var deaths = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g id=\"ux\"><circle cx=\"10.9\" cy=\"16.7\" r=\"2.5\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><path d=\"M18.6,23.4c0-2,.3-4.7,3.5-4.7s3.5,2.7,3.5,4.7\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><circle cx=\"15.8\" cy=\"10.4\" r=\"1.8\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><path d=\"M6.7,26.9c0-2.4.4-5.6,4.2-5.6s4.2,3.2,4.2,5.6\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><line x1=\"20\" y1=\"12.8\" x2=\"24.2\" y2=\"17\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.31\"/><line x1=\"20\" y1=\"17\" x2=\"24.2\" y2=\"12.8\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.31\"/></g></svg>";

    var fuels = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g id=\"ux\"><path d=\"M11.4,27S4.1,23.1,8.3,15.4\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><path d=\"M20.5,27s6.7-4.6,3.2-11.6\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><path d=\"M20.9,23.7a6,6,0,0,0,1.8-4.3,6.2,6.2,0,0,0-2.7-5C15.3,10.5,16,7,16,7s-7.7,5.6-5.6,11.9\" fill=\"none\" stroke=\"gray\" stroke-linejoin=\"bevel\" stroke-width=\"1.4\"/><path d=\"M15.6,27s5.6-1.3,0-9.3C10,25.7,15.6,27,15.6,27Z\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/></g></svg>";

    var pm25 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g id=\"ux\"><path d=\"M10,28.3H23.9\" fill=\"none\" stroke=\"gray\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.4\"/><path d=\"M6.9,24.8H26.4\" fill=\"none\" stroke=\"gray\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.4\"/><path d=\"M6.9,21.3h17\" fill=\"none\" stroke=\"gray\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.4\"/><path d=\"M10,17.8H21.2\" fill=\"none\" stroke=\"gray\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.4\"/><path d=\"M13.3,14.3h1.1\" fill=\"none\" stroke=\"gray\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.4\"/><circle cx=\"17.9\" cy=\"8.4\" r=\"0.5\" fill=\"none\" stroke=\"gray\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.4\"/><circle cx=\"26.7\" cy=\"14.4\" r=\"1.8\" fill=\"none\" stroke=\"gray\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.4\"/><circle cx=\"6.3\" cy=\"11.6\" r=\"1.8\" fill=\"none\" stroke=\"gray\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.4\"/><circle cx=\"10.9\" cy=\"5.1\" r=\"0.5\" fill=\"none\" stroke=\"gray\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.4\"/><circle cx=\"23.4\" cy=\"3.7\" r=\"0.5\" fill=\"none\" stroke=\"gray\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.4\"/></g></svg>";

    var sectors = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g id=\"ux\"><polygon points=\"6.5 7.6 10.8 7.6 10.8 17.4 18.1 13.9 18.1 17.4 25.4 13.9 25.4 26.4 6.5 26.4 6.5 7.6\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/><rect x=\"18.2\" y=\"21.7\" width=\"3.3\" height=\"4.7\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/></g></svg>";

    var policies = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\" d=\"M19.5 20.9V28l2.5-2 2.4 2v-7.1\"/><g fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"><path d=\"M18 10h-7.6M14 17h-3.6M19 13.5h-8.6M16 20.5h-5.6\"/><circle cx=\"22\" cy=\"20.9\" r=\"2.4\"/></g><path d=\"M16.6 25H8.8a1.4 1.4 0 01-1.4-1.4V7.5a1.4 1.4 0 011.4-1.4h11.8A1.4 1.4 0 0122 7.5v8\" fill=\"none\" stroke=\"gray\" stroke-miterlimit=\"10\" stroke-width=\"1.4\"/></svg>";

    var nd$1 = "<svg viewBox=\"0 0 67 63\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M34.0527 32.1255L27.3858 32.2181\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M36.6625 40.4287C36.6625 40.4287 22.0408 41.0309 20.7074 35.6574C19.374 30.2839 22.4511 30.3534 24.1264 29.4037C25.8017 28.4541 24.5822 24.7714 29.5055 24.7019\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M16.5819 50.5853C16.5819 50.5853 19.0663 40.1625 15.3511 35.5301C11.6358 30.8978 6.72393 36.5261 6.00595 40.9731\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7.03163 37.9854C6.4087 37.4555 5.65946 37.1016 4.85924 36.9593C4.05902 36.817 3.23603 36.8913 2.47304 37.1747C0.193736 38.1938 -0.27352 45.5593 5.11702 47.806C9.59585 49.6705 9.4135 41.6681 9.4135 41.6681\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7.95476 47.3659L8.19408 51.9982C8.49039 57.8697 13.8923 65.8953 27.0781 60.2091C40.2638 54.5229 42.1101 49.4273 47.3183 40.0815C51.0107 33.4688 61.1308 35.5534 64.9144 24.2968C70.6127 7.38868 54.9653 1.74879 51.2387 1.135C47.512 0.521215 39.7168 1.00761 34.9417 9.92489C33.4487 12.7159 33.8818 15.0205 32.7991 15.53C30.9187 16.4218 29.6081 16.5144 30.2349 18.8653C30.5407 20.4874 30.2913 22.1669 29.5283 23.6251C29.5283 23.6251 28.4912 29.7166 35.2266 32.4497C37.3691 33.3067 39.2495 31.4885 43.1129 36.1787\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M37.3349 17.2786C37.3349 17.2786 38.1441 20.0001 41.5174 18.3324\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M46.7256 26.8791C46.7256 26.8791 50.042 31.9863 53.233 27.0992C55.7972 23.1733 50.9537 20.8918 49.985 21.1698\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M17.2885 40.7185C17.2885 40.7185 17.9609 38.935 21.528 37.5569\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>";

    var stroke$1 = "<svg viewBox=\"0 0 67 63\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M28.343 43.1323C29.177 44.9013 30.3835 46.493 31.8898 47.8114C33.3961 49.1298 35.1708 50.1476 37.107 50.8032C40.5794 52 43.4761 54.3346 45.2649 57.3783L45.8942 58.4741L47.5258 61.663\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M52.6304 62.1781L51.9545 58.6824C51.3202 55.387 49.9628 52.2521 47.9687 49.4773\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M23.5998 10.8599C21.3622 11.3092 20.7445 14.246 21.7235 15.2432C20.4943 15.4234 19.3739 16.0103 18.5641 16.8984C17.7543 17.7864 17.3083 18.9171 17.3065 20.0869C17.3119 20.3219 17.3353 20.5563 17.3764 20.7882C16.9724 20.692 16.5578 20.6405 16.1411 20.6348C14.5792 20.5552 13.0362 20.9866 11.7743 21.8556C10.5123 22.7245 9.60927 23.9775 9.21851 25.4017\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M32.6434 10.0708C34.5314 7.99967 35.86 5.62169 35.184 2.94784C34.6013 0.635608 29.928 -0.547908 27.8069 3.38617C27.4533 4.44636 27.1692 5.52597 26.9562 6.6189\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M26.3035 34.8258C26.3035 34.8258 33.5524 29.9712 39.7175 32.6341C43.039 34.0806 48.0619 34.2011 50.3112 31.4615C52.2924 29.0507 52.3973 25.9823 55.6371 25.8508C56.502 25.8638 57.3292 26.186 57.9504 26.7519C58.5717 27.3178 58.9405 28.0849 58.9819 28.8973\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M9.16026 13.5446C8.81463 13.2127 8.55332 12.8116 8.3959 12.3714C8.23848 11.9311 8.18902 11.463 8.25124 11.0022C8.34518 9.95379 8.84609 8.97452 9.65851 8.25102C10.4709 7.52752 11.5381 7.11038 12.6565 7.07911C13.4131 7.00401 14.1772 7.12215 14.8684 7.42108C15.5596 7.72 16.1523 8.18865 16.584 8.77767\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M34.1002 23.0895C36.9518 22.0026 40.1175 21.8864 43.0506 22.7607\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M20.7213 32.93C20.4699 34.3446 19.8625 35.6822 18.9498 36.8312C18.6025 37.375 18.1219 37.8328 17.5482 38.1664C16.9745 38.4999 16.3242 38.6997 15.6517 38.749C15.0817 38.7481 14.5196 38.6243 14.0084 38.3873C13.1402 37.9857 12.4749 37.2788 12.1565 36.4196C11.8381 35.5603 11.8921 34.6178 12.3069 33.7957C13.216 32.0643 15.6517 27.9111 18.472 26.5851C21.8401 25.0071 25.651 25.4016 27.4923 25.5988H27.7138\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M15.8265 13.5664C15.793 14.3304 16.0252 15.0838 16.4878 15.7125C16.9504 16.3413 17.6183 16.8113 18.3904 17.0512\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M52.9567 34.4751C50.0431 36.0532 48.668 33.5656 49.4604 32.2834\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M44.8104 29.5878C43.2954 29.3686 40.0322 31.2097 42.6311 33.4561\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M11.9223 34.6725H9.87114C7.49104 34.6638 5.21158 33.7687 3.53186 32.1831C1.85214 30.5975 0.90904 28.4506 0.909058 26.2126V24.0867C0.909056 23.3921 1.05474 22.7044 1.33776 22.0628C1.62079 21.4212 2.0356 20.8385 2.55845 20.3479C3.0813 19.8572 3.70193 19.4684 4.3848 19.2036C5.06767 18.9388 5.79938 18.8033 6.53804 18.8047H7.70346\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M16.8753 38.4861C17.2702 39.8224 18.1199 41.0003 19.2944 41.8395C20.4688 42.6786 21.9033 43.1328 23.3784 43.1325H32.3754C33.801 43.1333 35.1902 42.7096 36.3438 41.9221C37.4974 41.1346 38.3562 40.0239 38.7969 38.7491\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M42.4912 48.9951C43.5887 49.3184 44.7325 49.481 45.8826 49.4772H52.6304C53.8235 49.4772 54.9677 49.0316 55.8113 48.2383C56.655 47.4451 57.1289 46.3691 57.1289 45.2473C57.1289 44.1254 56.655 43.0495 55.8113 42.2563C54.9677 41.463 53.8235 41.0173 52.6304 41.0173H51.465\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M56.4646 43.0336C59.1481 42.6748 61.6038 41.4177 63.3807 39.4932C65.1577 37.5687 66.1365 35.106 66.1376 32.5574V27.2206C66.1345 24.415 64.9471 21.7253 62.8361 19.7424C60.7252 17.7595 57.8634 16.6458 54.8797 16.6458H53.7142\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M8.3211 11.9995C6.32362 14.2417 4.74715 16.7877 3.65942 19.5279\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M27.8419 2.95874C22.9071 3.14802 18.1238 4.61564 14.0201 7.19965\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M53.2597 7.61604C49.2594 4.58261 44.2738 2.93097 39.1348 2.93678H35.184\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M59.7511 17.6102C59.9908 16.8677 60.1126 16.0959 60.1124 15.3199C60.1093 13.2438 59.23 11.2537 57.6677 9.78663C56.1053 8.3196 53.9876 7.4956 51.7796 7.49561C50.3284 7.49673 48.9026 7.85422 47.6434 8.53271C46.3843 9.21119 45.3354 10.1871 44.6006 11.3639\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M48.6214 22.4429C48.2729 22.8218 47.8416 23.1257 47.3569 23.3337C46.8722 23.5417 46.3455 23.649 45.8127 23.6483C45.3266 23.6483 44.8452 23.5581 44.3962 23.3828C43.9472 23.2076 43.5395 22.9507 43.1962 22.627C42.853 22.3032 42.5812 21.919 42.3962 21.4963C42.2112 21.0735 42.1168 20.6206 42.1183 20.1635C42.1092 19.6222 42.2352 19.0865 42.4862 18.5993C42.7372 18.1121 43.1061 17.687 43.5634 17.3582\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M25.1032 21.6319C25.1032 22.7537 25.5771 23.8296 26.4208 24.6229C27.2644 25.4162 28.4086 25.8618 29.6017 25.8618C30.7948 25.8618 31.939 25.4162 32.7826 24.6229C33.6263 23.8296 34.1002 22.7537 34.1002 21.6319C34.0268 20.6087 33.7459 19.6081 33.2728 18.6841\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>\n";

    var ischemic$1 = "<svg viewBox=\"0 0 67 63\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M63.5102 24.0974C60.6502 25.2224 58.9185 24.8174 55.3763 25.2224\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M58.4331 18.1462C58.4331 18.1462 54.1431 21.5212 52.2802 21.9375\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M1.04953 40.7025C6.15292 40.005 8.48814 37.71 11.2563 37.71\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M2.47955 34.3126C6.92698 35.2351 9.8657 34.2113 11.3744 34.3126\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M31.7748 4.26364L28.7968 1.04614\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M36.8651 4.15124C36.5102 4.08146 36.151 4.02888 35.7893 3.99374L35.9205 0.84375\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M42.7032 7.22243C41.9808 6.48178 41.1262 5.84388 40.1711 5.33243L42.2046 1.02368\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M27.8259 5.55762C26.9209 6.02142 26.084 6.57664 25.3333 7.21137\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M46.6258 19.1924L47.2555 19.5186C55.7306 23.6249 57.0818 26.4374 54.7597 27.9224\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M13.1848 6.75L14.3656 14.31C15.0609 18.7187 15.0609 23.1876 14.3656 27.5962C9.89189 33.3337 10.8496 40.5225 13.1455 43.65C15.2183 46.4737 17.829 43.8975 21.017 40.275\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M30.0824 30.4312C33.0999 26.6737 32.2209 24.0075 29.1247 22.9725C27.9095 22.5746 26.6314 22.3357 25.3333 22.2637L21.5156 5.79373C21.0433 5.09623 19.469 4.66872 17.8028 4.73622\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M14.6411 44.7638C14.6411 44.9325 14.7329 45.1013 14.7854 45.27C25.0577 64.1925 43.5428 62.145 56.4652 62.145C62.0803 62.145 67.2886 56.835 65.7405 46.8563C64.6385 39.8588 60.4928 27.5625 56.3603 27.4275C52.6213 29.0363 47.6228 28.6988 42.7031 27.4838C42.2273 27.3765 41.7986 27.152 41.4699 26.8381C41.1412 26.5242 40.9268 26.1347 40.8533 25.7175L40.7352 24.9975C40.5137 23.5909 40.6177 22.1607 41.0412 20.7886C41.4647 19.4165 42.1995 18.1295 43.2035 17.001C44.2075 15.8726 45.461 14.925 46.8924 14.2123C48.3238 13.4996 49.905 13.0358 51.5455 12.8475L52.2408 12.7688C53.9726 11.8575 53.2116 9.02253 51.6767 9.20253L45.445 9.91128C42.4861 10.2496 39.6699 11.2078 37.2455 12.7013C36.3272 13.275 35.0415 11.115 33.0998 12.4425C30.476 14.2425 30.8827 16.8413 31.4599 18.6188C30.6316 20.087 30.0824 21.6593 29.8331 23.2763\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M22.0403 26.4824C22.0403 26.4824 25.3988 24.3337 25.3332 22.2637\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M38.0196 30.555C38.0196 30.555 41.1288 28.305 41.2994 26.7188\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>\n";

    var lri$1 = "<svg viewBox=\"0 0 67 63\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M39.1218 15.796V13.3188C39.1219 12.3055 39.4261 11.3131 39.9989 10.4578C40.5717 9.60256 41.3894 8.91982 42.3563 8.48949C43.3232 8.05917 44.3992 7.89906 45.4585 8.02793C46.5178 8.1568 47.5164 8.56929 48.3376 9.21715L52.3445 12.3741C56.654 15.7827 60.1195 20.05 62.495 24.8729C64.8705 29.6957 66.0977 34.9557 66.0893 40.2793V57.9189C66.0882 58.5856 65.9224 59.2428 65.605 59.8376C65.2876 60.4325 64.8277 60.9484 64.262 61.344C63.6964 61.7395 63.0409 62.0036 62.3481 62.1151C61.6554 62.2266 60.9448 62.1824 60.2733 61.986L51.7738 59.5204C48.095 58.4497 44.8756 56.2867 42.5893 53.3498C40.3029 50.4129 39.0705 46.8571 39.0732 43.2058V20.4737\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M43.6143 28.6772V35.1639C43.6183 36.1275 43.855 37.0774 44.3064 37.9406V37.9406C44.8507 38.9756 45.6872 39.8468 46.7227 40.4572C47.7583 41.0675 48.9521 41.3929 50.1711 41.3971H52.5995\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M46.1277 40.314L47.9976 45.0724\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M50.5232 32.6406L53.6558 29.2878\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M34.6292 0.864014V17.9275C34.6292 18.4928 34.8658 19.0349 35.2871 19.4347C35.7084 19.8344 36.2797 20.059 36.8755 20.059V20.059C37.7609 20.0575 38.6379 20.2218 39.4562 20.5426C40.2745 20.8634 41.018 21.3344 41.6441 21.9285C42.2702 22.5226 42.7665 23.2281 43.1046 24.0046C43.4427 24.7811 43.6159 25.6133 43.6143 26.4535V29.6564C43.6175 30.5039 43.9746 31.3157 44.6073 31.9139C45.2399 32.512 46.0967 32.8479 46.9898 32.8479H55.9749\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M43.6143 26.4535C43.6143 27.0188 43.851 27.561 44.2723 27.9607C44.6935 28.3605 45.2649 28.585 45.8606 28.585V28.585C46.1566 28.5865 46.45 28.5325 46.724 28.4261C46.9979 28.3196 47.247 28.1629 47.4568 27.9648C47.6667 27.7667 47.8333 27.5312 47.9469 27.2719C48.0605 27.0125 48.119 26.7344 48.119 26.4535V24.322\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M27.8782 15.7961V13.3189C27.8812 12.3057 27.5793 11.3126 27.008 10.4565C26.4367 9.60046 25.6198 8.91687 24.6533 8.48612C23.6867 8.05537 22.6107 7.89535 21.5516 8.02486C20.4925 8.15437 19.4944 8.56803 18.6745 9.21723L14.6676 12.3741C10.3521 15.78 6.88013 20.0459 4.4983 24.8688C2.11647 29.6917 0.883285 34.9532 0.886358 40.2794V57.919C0.889439 58.5862 1.05708 59.2434 1.37587 59.8381C1.69465 60.4328 2.15573 60.9485 2.7222 61.3438C3.28866 61.7391 3.94477 62.0031 4.63803 62.1146C5.33129 62.2261 6.04244 62.1821 6.71456 61.9861L15.214 59.5205C18.8938 58.4513 22.1144 56.2888 24.401 53.3515C26.6876 50.4143 27.9193 46.8577 27.9146 43.2059V20.4738\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M23.3856 28.6772V35.1639C23.4082 36.1361 23.1877 37.0995 22.7421 37.9752V37.9752C22.2012 39.0127 21.3654 39.8861 20.3292 40.4969C19.2929 41.1076 18.0973 41.4314 16.8775 41.4316H14.449\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M20.8843 40.314L19.0023 45.0724\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M16.4768 32.6406L13.3441 29.2878\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M32.3829 0.864014V17.9275C32.3829 18.4928 32.1462 19.0349 31.725 19.4347C31.3037 19.8344 30.7323 20.059 30.1366 20.059V20.059C29.2506 20.0575 28.373 20.2217 27.554 20.5424C26.735 20.8631 25.9907 21.3339 25.3636 21.9278C24.7366 22.5217 24.2391 23.2272 23.8997 24.0037C23.5603 24.7803 23.3856 25.6127 23.3856 26.4535V29.6564C23.3856 30.5029 23.0312 31.3147 22.4005 31.9132C21.7697 32.5117 20.9142 32.8479 20.0222 32.8479H11.025\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M23.3856 26.4535C23.3856 27.0188 23.149 27.561 22.7277 27.9607C22.3064 28.3605 21.7351 28.585 21.1393 28.585V28.585C20.5436 28.585 19.9723 28.3605 19.551 27.9607C19.1297 27.561 18.8931 27.0188 18.8931 26.4535V24.322\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M59.5691 49.9231H59.3505\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M52.8301 47.7915H52.6116\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M57.3227 41.3855H57.1042\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M59.5691 34.991H59.3505\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M57.3227 26.4536H57.1042\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7.43095 49.9231H7.64951\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M14.1698 47.7915H14.4005\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M9.6772 41.3855H9.89576\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7.43095 34.991H7.64951\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M9.6772 26.4536H9.89576\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>\n";

    var lungcancer$1 = "<svg viewBox=\"0 0 67 64\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M47.9506 17.2334H41.2781V21.6914C41.2799 22.1952 41.4718 22.6862 41.8277 23.0975C42.1836 23.5089 42.6861 23.8205 43.2667 23.9899L66.0187 31.0457\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M47.9506 17.2334C48.1459 17.2334 48.3392 17.2018 48.5194 17.1404C48.6997 17.079 48.8632 16.9891 49.0007 16.8758C49.1381 16.7624 49.2468 16.628 49.3203 16.4802C49.3938 16.3324 49.4308 16.1742 49.429 16.0146V14.7959\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M19.4812 0.801758C19.604 4.7773 21.2311 8.6241 24.1389 11.8131C25.7743 13.8443 24.8977 21.6913 24.8977 21.6913C24.8949 22.1963 24.7011 22.6883 24.3427 23.0998C23.9843 23.5113 23.479 23.8222 22.8959 23.9898L0.981262 31.0456\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M49.416 14.7958V9.93157H53.0008C53.1634 9.95497 53.3309 9.93726 53.4809 9.8808C53.6309 9.82434 53.7562 9.73182 53.8401 9.61561C53.9241 9.49939 53.9626 9.36502 53.9505 9.23045C53.9385 9.09587 53.8764 8.9675 53.7727 8.8625L49.573 0.801758\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M46.446 13.5772H40.3099C39.3942 13.5567 38.4897 13.7461 37.6989 14.124C36.9081 14.5019 36.2625 15.0531 35.8354 15.7153C34.8018 17.2334 34.1607 19.3181 34.1607 25.23\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M48.6702 5.18506L39.695 6.64969C36.5943 7.16284 31.7665 8.59538 31.7665 14.7318L31.4394 25.23\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M37.7849 34.4561V32.9594C37.7849 30.2333 41.1996 28.5228 43.777 30.276L46.5769 32.179C49.5925 34.2321 52.0192 36.8015 53.6854 39.7056C55.3516 42.6096 56.2167 45.7773 56.2193 48.9847V59.6753C56.216 60.0776 56.0979 60.4736 55.8744 60.8321C55.6509 61.1905 55.3282 61.5014 54.932 61.7401C54.5357 61.9788 54.0768 62.1387 53.5916 62.2071C53.1065 62.2755 52.6086 62.2505 52.1373 62.1342L46.2105 60.6375C43.7036 60.0183 41.5178 58.7388 39.9937 56.9984C38.4697 55.258 37.693 53.1546 37.7849 51.0159V37.2998\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M40.4669 42.0142V45.9269C40.4636 46.5098 40.6295 47.085 40.9509 47.6054V47.6054C41.3312 48.2295 41.9174 48.7544 42.6433 49.1208C43.3691 49.4873 44.2059 49.6807 45.0591 49.6794H46.76\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> \n<path d=\"M42.2201 49.0381L43.5415 51.9032\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M45.3078 44.4089L47.5058 42.3777\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M34.1607 25.23V35.5251C34.1607 35.6945 34.2017 35.8622 34.2815 36.0185C34.3612 36.1749 34.478 36.3167 34.6252 36.436C34.7723 36.5553 34.947 36.6496 35.139 36.7134C35.331 36.7772 35.5365 36.8094 35.7438 36.808V36.808C36.9976 36.8108 38.199 37.2198 39.0843 37.9452C39.9697 38.6707 40.4669 39.6534 40.4669 40.678V42.6023C40.4669 43.1136 40.7146 43.6042 41.1559 43.9668C41.5971 44.3294 42.1961 44.5345 42.8219 44.5373H49.1281\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M40.4669 40.6778C40.4669 41.0181 40.6323 41.3444 40.9267 41.585C41.2212 41.8256 41.6205 41.9607 42.0369 41.9607V41.9607C42.4545 41.9607 42.8552 41.8259 43.1517 41.5856C43.4482 41.3454 43.6165 41.0191 43.62 40.6778V39.3843\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M28.3255 34.2423V32.7456C28.3316 32.1243 28.1167 31.5149 27.7069 30.9915C27.2972 30.4681 26.7102 30.0533 26.0173 29.7974C25.3244 29.5415 24.5554 29.4555 23.8039 29.55C23.0524 29.6444 22.3506 29.9152 21.7838 30.3295L18.9709 32.2324C15.9553 34.2856 13.5286 36.855 11.8624 39.759C10.1962 42.6631 9.33114 45.8308 9.32846 49.0381V59.7288C9.33182 60.131 9.44993 60.5271 9.6734 60.8855C9.89688 61.2439 10.2196 61.5548 10.6158 61.7935C11.0121 62.0322 11.471 62.1921 11.9561 62.2605C12.4413 62.3289 12.9392 62.304 13.4105 62.1876L19.3372 60.6909C21.9143 60.0435 24.1692 58.7377 25.7706 56.9654C27.372 55.1931 28.2354 53.0478 28.2339 50.8448V37.1394\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M25.1332 42.0142V45.9269C25.1364 46.5098 24.9705 47.085 24.6491 47.6054V47.6054C24.2688 48.2295 23.6827 48.7544 22.9568 49.1208C22.2309 49.4873 21.3942 49.6807 20.5409 49.6794H18.8401\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M23.38 49.0381L22.0586 51.9032\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M20.2923 44.4089L18.1074 42.3777\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M31.4394 25.23V35.5251C31.4394 35.6945 31.3984 35.8622 31.3187 36.0185C31.2389 36.1749 31.1221 36.3167 30.9749 36.436C30.8278 36.5553 30.6531 36.6496 30.4611 36.7134C30.2692 36.7772 30.0636 36.8094 29.8563 36.808V36.808C28.6025 36.8108 27.4012 37.2198 26.5158 37.9452C25.6304 38.6707 25.1332 39.6534 25.1332 40.678V42.6023C25.1332 43.1136 24.8855 43.6042 24.4442 43.9668C24.003 44.3294 23.404 44.5345 22.7782 44.5373H16.472\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M25.1332 40.6778C25.1332 41.0181 24.9678 41.3444 24.6733 41.585C24.3789 41.8256 23.9796 41.9607 23.5632 41.9607V41.9607C23.1468 41.9607 22.7474 41.8256 22.453 41.585C22.1586 41.3444 21.9932 41.0181 21.9932 40.6778V39.3843\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M35.3644 20.8896C34.8222 20.9816 34.2652 20.9996 33.7159 20.9431\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M35.3644 23.3057C34.8181 23.3746 34.2621 23.3746 33.7159 23.3057\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M35.3644 25.7217C34.818 25.7897 34.2622 25.7897 33.7159 25.7217\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M35.3644 28.1272C34.8222 28.2191 34.2652 28.2372 33.7159 28.1807\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M35.3644 30.5432C34.818 30.6113 34.2622 30.6113 33.7159 30.5432\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M35.3644 32.9592C34.818 33.0273 34.2622 33.0273 33.7159 32.9592\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>";

    var diabetes$1 = "<svg viewBox=\"0 0 67 63\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M10.1206 50.7514H15.571C16.3987 50.7531 17.2185 50.5785 17.9835 50.2377C18.7485 49.8969 19.4435 49.3967 20.0288 48.7656C20.6141 48.1346 21.078 47.3851 21.3941 46.5603C21.7101 45.7355 21.8721 44.8515 21.8705 43.959V43.0063\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M38.6693 28.2089C36.1449 28.5801 34.4696 25.9571 34.4696 14.4756\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M34.4696 5.44389C34.4696 4.24834 34.9093 3.10157 35.6922 2.25503C36.4752 1.40849 37.5375 0.931254 38.6463 0.927979H51.624\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M21.7558 43.0435L19.8395 43.5755C16.7581 44.7384 13.9583 46.6326 11.6467 49.1183L6.7241 54.4384C6.2428 54.9519 5.63174 55.3009 4.96739 55.4419C4.30303 55.5828 3.61489 55.5094 2.98905 55.2307C2.36321 54.9521 1.82748 54.4806 1.44889 53.8754C1.0703 53.2701 0.865669 52.5579 0.860592 51.8278V21.8991C0.875712 16.3444 2.92811 11.0216 6.56983 7.09266C10.2115 3.16369 15.1468 0.94756 20.2985 0.927979H58.3367C58.9628 0.93064 59.5764 1.11739 60.1115 1.46813C60.6465 1.81886 61.0826 2.32029 61.373 2.91845C61.6633 3.5166 61.7969 4.18882 61.7593 4.86273C61.7216 5.53664 61.5142 6.18672 61.1594 6.74299L54.3665 17.2842C51.9135 21.0922 48.467 24.029 44.4639 25.7222L39.5184 27.8255C36.2815 29.1915 33.3968 31.3769 31.1076 34.1972L30.3617 35.1252C27.8717 38.1687 25.3014 41.7072 21.7558 43.0435Z\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M34.4696 54.4631V62.0721\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M28.4225 37.5254C29.8187 37.9689 31.084 38.796 32.0944 39.9256\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M34.4696 38.4656V30.8442\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M34.4696 62.0721V54.4631\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M66.1165 25.6974C66.1633 25.3221 66.141 24.9405 66.051 24.5744C65.961 24.2083 65.805 23.865 65.5919 23.5639C65.3788 23.2629 65.1127 23.0101 64.809 22.82C64.5052 22.6299 64.1697 22.5061 63.8215 22.4559C63.2144 22.3673 62.5975 22.5072 62.0749 22.852C61.5523 23.1969 61.156 23.7256 60.9529 24.3488C60.3288 24.3091 59.7116 24.5065 59.2085 24.9065C58.7054 25.3066 58.3482 25.8842 58.199 26.5387C57.5112 26.3556 56.7842 26.4742 56.1775 26.8685C55.5708 27.2629 55.134 27.9008 54.9632 28.642C54.274 28.4627 53.547 28.5844 52.9408 28.9808C52.3346 29.3771 51.8984 30.0159 51.7273 30.7577C51.0429 30.586 50.3233 30.7117 49.7242 31.1076C49.1251 31.5035 48.6946 32.1379 48.5259 32.8734C48.0202 32.7359 47.488 32.7623 46.9961 32.9493C46.5042 33.1364 46.0744 33.4758 45.7606 33.925C45.61 33.8491 45.4523 33.791 45.2901 33.7518C44.7843 33.6143 44.2522 33.6407 43.7603 33.8278C43.2684 34.0148 42.8386 34.3542 42.5247 34.8035C42.3725 34.7288 42.2153 34.6667 42.0543 34.6179C41.3651 34.4385 40.6382 34.5603 40.032 34.9566C39.4257 35.353 38.9895 35.9917 38.8185 36.7336C38.2565 36.586 37.6654 36.6388 37.1337 36.8842C36.6019 37.1296 36.1584 37.5543 35.8695 38.0945C34.0281 38.4226 32.3545 39.4444 31.1463 40.9782C29.9381 42.512 29.2738 44.4583 29.2716 46.4706C29.2715 48.7046 30.0882 50.8485 31.5446 52.4374C33.001 54.0263 34.9797 54.932 37.0514 54.958C38.6786 54.9555 40.2651 54.4092 41.5925 53.3945C42.92 52.3797 43.9231 50.9463 44.464 49.2915C45.0293 49.1897 45.5491 48.894 45.946 48.4481C46.3429 48.0023 46.5958 47.4302 46.6671 46.817C47.0145 46.8674 47.3678 46.8434 47.7065 46.7462C48.0453 46.649 48.363 46.4806 48.6413 46.2507C48.9195 46.0207 49.153 45.7338 49.3281 45.4064C49.5033 45.0789 49.6167 44.7174 49.6619 44.3426C50.01 44.393 50.3639 44.3691 50.7034 44.272C51.0429 44.175 51.3614 44.0068 51.6406 43.777C51.9198 43.5472 52.1542 43.2603 52.3306 42.9328C52.5069 42.6052 52.6217 42.2435 52.6683 41.8681C53.0164 41.9186 53.3703 41.8946 53.7098 41.7976C54.0493 41.7005 54.3677 41.5323 54.6469 41.3025C54.9261 41.0727 55.1606 40.7858 55.3369 40.4583C55.5132 40.1308 55.628 39.769 55.6746 39.3936C56.3771 39.4922 57.0873 39.2875 57.6504 38.824C58.2135 38.3605 58.5839 37.6758 58.6809 36.9191C59.0284 36.9696 59.3816 36.9455 59.7204 36.8483C60.0592 36.7511 60.3769 36.5827 60.6551 36.3528C60.9334 36.1229 61.1668 35.8359 61.342 35.5085C61.5171 35.1811 61.6306 34.8195 61.6758 34.4447C62.0239 34.4952 62.3778 34.4712 62.7173 34.3742C63.0568 34.2771 63.3753 34.1089 63.6545 33.8791C63.9336 33.6493 64.1681 33.3624 64.3444 33.0349C64.5208 32.7074 64.6355 32.3456 64.6821 31.9702C64.7457 31.5567 64.7182 31.1329 64.6018 30.733C64.9954 30.524 65.3353 30.2138 65.5914 29.8297C65.8476 29.4457 66.0121 28.9995 66.0705 28.5307C66.1476 27.904 66.0264 27.2675 65.7263 26.7243C65.9158 26.4119 66.0482 26.0634 66.1165 25.6974V25.6974Z\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M23.1901 42.3381V52.236C23.1901 62.1339 31.3141 62.1339 31.3141 62.1339\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M39.8627 38.0698C39.8627 38.0698 39.4381 39.3071 41.274 39.3071\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M35.1007 46.9161C34.6064 46.2415 34.3734 45.387 34.4504 44.5313C34.5274 43.6757 34.9085 42.8854 35.5138 42.3259\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M49.2833 40.4947C49.2833 40.4947 51.8765 39.9751 50.7979 36.9438\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M54.0108 35.5086C54.0108 35.5086 54.7681 34.1848 51.6241 33.5291\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M54.0911 34.123C54.4732 33.6935 54.7612 33.1772 54.934 32.612C55.1067 32.0467 55.1598 31.447 55.0894 30.8567\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M58.9793 32.4402C59.0029 32.6493 59.0657 32.8511 59.1637 33.0334C59.2617 33.2157 59.3929 33.3746 59.5495 33.5007C59.7061 33.6267 59.8848 33.7172 60.0747 33.7668C60.2646 33.8163 60.4619 33.8238 60.6546 33.7888\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M44.1312 41.6205C44.4761 41.2148 44.9476 40.9602 45.4556 40.9054C45.9636 40.8506 46.4725 40.9995 46.8851 41.3236\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M40.5511 46.4705C40.5511 46.4705 39.0594 46.854 38.6693 44.825\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M43.0411 45.085C42.9756 45.2532 42.943 45.4343 42.9455 45.6168C42.9479 45.7993 42.9853 45.9792 43.0554 46.1454C43.1254 46.3115 43.2266 46.4602 43.3525 46.5822C43.4784 46.7042 43.6263 46.7968 43.7869 46.8542\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M38.6693 54.7725V62.0721\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M34.5385 36.1521C35.0611 36.6662 35.5446 37.2248 35.9843 37.8224\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>";

    var copd$1 = "<svg viewBox=\"0 0 67 63\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12.2353 61.7943C12.0831 60.7558 12.0083 59.7113 12.0113 58.666V26.0798\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M12.0112 13.9251V9.87357C11.9961 8.21209 12.5951 6.58207 13.7374 5.17668C14.8797 3.77129 16.5173 2.64946 18.4561 1.94414C20.395 1.23882 22.5538 0.979574 24.6768 1.19714C26.7997 1.4147 28.7978 2.09995 30.4341 3.17167L38.4417 8.33116C47.0521 13.8945 53.9798 20.8595 58.7337 28.7322C63.4875 36.6049 65.9512 45.1927 65.95 53.8867V61.7943\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M39.6036 34.9651C38.8244 36.6659 37.3347 38.1158 35.3714 39.0842C33.408 40.0525 31.0838 40.4837 28.7682 40.3092C25.2265 40.1354 22.9726 38.6256 22.9726 36.5835V35.9644C23.7678 36.2317 24.6258 36.3686 25.4924 36.3663\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M45.7213 40.6894L38.7917 40.2875L41.9975 36.6704\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M38.9736 54.7339C34.7739 54.7339 27.4943 55.125 24.1485 49.455C23.4041 48.2462 23.0031 46.9275 22.9726 45.5881V42.2317C27.3669 42.7752 31.8357 42.8556 36.2578 42.4707C39.4211 42.4561 42.5822 42.6012 45.7212 42.9051\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M31.1342 61.2621L29.4123 56.7109C32.5717 57.1463 35.802 57.1757 38.9737 56.7978\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M1.04994 1.12964V14.0446C1.04994 21.0398 5.24969 21.8219 8.69348 22.4193C14.2092 23.3426 19.0249 26.4274 19.0249 31.3479V45.5881C18.9073 47.4257 19.4605 49.2517 20.6208 50.8562C23.8818 54.3542 26.5144 58.1801 28.4463 62.2288\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M47.2612 30.6094L49.1371 32.0649\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M47.2612 32.0758L49.1371 30.6311\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M52.0209 44.5237L53.8968 45.9792\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M52.0209 45.9901L53.8968 44.5454\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M47.0932 55.1033L48.9691 56.5588\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M47.0932 56.5697L48.9691 55.125\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7.65754 5.71338C6.16097 6.10537 4.58919 6.29638 3.00982 6.2782\" stroke=\"#263238\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7.65754 3.28027C6.16097 3.67227 4.58919 3.86329 3.00982 3.84511\" stroke=\"#263238\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7.65754 8.14648C6.16097 8.53848 4.58919 8.72949 3.00982 8.71131\" stroke=\"#263238\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7.65754 10.5796C6.16097 10.9716 4.58919 11.1626 3.00982 11.1444\" stroke=\"#263238\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7.90953 13.0127C6.41296 13.4047 4.84117 13.5957 3.26181 13.5775\" stroke=\"#263238\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M8.17551 15.4458C6.68378 15.8378 5.11658 16.0288 3.54179 16.0106\" stroke=\"#263238\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M9.68742 16.9558C8.46956 17.7382 7.09298 18.3585 5.61367 18.7915\" stroke=\"#263238\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M12.0113 17.7703C11.1099 18.7756 9.99793 19.6568 8.72148 20.3772\" stroke=\"#263238\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M7.65754 0.890625C6.16097 1.28262 4.58919 1.47363 3.00982 1.45545\" stroke=\"#263238\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M21.2507 22.6148C21.5727 22.832 20.9148 22.365 21.2507 22.6148\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M17.275 20.2468C17.889 20.5486 18.4824 20.8749 19.0529 21.2244\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M6.6916 0.814697V13.2952C6.6916 17.955 10.0514 17.64 14.7411 19.215\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M22.4127 27.8613V32.1193C22.4127 32.1193 23.0286 33.3358 24.1346 33.3249\" stroke=\"#263238\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>";

    var check = "<svg viewBox=\"0 0 17 13\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5 4H8.2439V2H9.09756H12V11H9.09756V13H5V4Z\" fill=\"#D9D9D9\"/>\n<path d=\"M5.85246 11.0698L0 5.75386L1.6539 4.25188L5.85246 8.06369L14.7306 0L16.3869 1.5041L5.85246 11.0698Z\" fill=\"#263238\"/>\n</svg>\n";

    const alignment = {
        pm25: 'transform: translateY(-7%)',
        sectors: 'transform: translateY(-8%)',
    };
    var svg = {
        dataSource,
        embed,
        check,
        arrows: {
            right: arrowRight,
            left: arrowLeft,
            down: arrowDown
        },
        menu: {
            data: data$1,
            deaths,
            fuels,
            pm25,
            sectors,
            policies
        },
        diseases: {
            nd: nd$1,
            stroke: stroke$1,
            ischemic: ischemic$1,
            lri: lri$1,
            lungcancer: lungcancer$1,
            diabetes: diabetes$1,
            copd: copd$1
        }
    };

    /* src/components/common/Legend.svelte generated by Svelte v3.42.3 */

    const { console: console_1$2 } = globals;
    const file$k = "src/components/common/Legend.svelte";

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (67:33) 
    function create_if_block_4(ctx) {
    	let ul;
    	let each_value_1 = /*colors*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "cat info svelte-h10xyx");
    			attr_dev(ul, "role", "menu");
    			attr_dev(ul, "aria-label", "Legend");
    			add_location(ul, file$k, 67, 2, 2198);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels, selected, colors*/ 13) {
    				each_value_1 = /*colors*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(67:33) ",
    		ctx
    	});

    	return block;
    }

    // (33:0) {#if type === "sequential"}
    function create_if_block$a(ctx) {
    	let ol;
    	let each_value = /*colors*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ol, "class", "seq info svelte-h10xyx");
    			attr_dev(ol, "role", "menu");
    			attr_dev(ol, "aria-label", "Legend");
    			toggle_class(ol, "internal-labels", /*internalLabels*/ ctx[5]);
    			add_location(ol, file$k, 33, 2, 1113);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ol, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*legendWidths, colors, selected, internalLabels, labels, undefined, svg*/ 109) {
    				each_value = /*colors*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ol, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*internalLabels*/ 32) {
    				toggle_class(ol, "internal-labels", /*internalLabels*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ol);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(33:0) {#if type === \\\"sequential\\\"}",
    		ctx
    	});

    	return block;
    }

    // (69:4) {#each colors as c, i}
    function create_each_block_1$3(ctx) {
    	let li;
    	let div;
    	let t0;
    	let t1_value = /*labels*/ ctx[3][/*i*/ ctx[19]] + "";
    	let t1;
    	let t2;
    	let li_aria_label_value;
    	let mounted;
    	let dispose;

    	function mouseover_handler_1() {
    		return /*mouseover_handler_1*/ ctx[14](/*i*/ ctx[19]);
    	}

    	function focus_handler_1() {
    		return /*focus_handler_1*/ ctx[15](/*i*/ ctx[19]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = space();
    			t1 = text$1(t1_value);
    			t2 = space();
    			attr_dev(div, "class", "cat-symbol svelte-h10xyx");

    			set_style(div, "background-color", /*c*/ ctx[17] !== 'url(#hash--windblown)'
    			? /*c*/ ctx[17]
    			: '');

    			set_style(div, "background-size", /*c*/ ctx[17] !== 'url(#hash--windblown)'
    			? ''
    			: '5.66px 5.66px');

    			set_style(div, "background-image", /*c*/ ctx[17] !== 'url(#hash--windblown)'
    			? ''
    			: `linear-gradient(
              135deg,
              #faba26 25%,
              #f9f9f9 25%,
              #f9f9f9 50%,
              #faba26 50%,
              #faba26 75%,
              #f9f9f9 75%,
              #f9f9f9 100%
            )`);

    			add_location(div, file$k, 80, 8, 2627);
    			attr_dev(li, "role", "menuitem");
    			attr_dev(li, "aria-label", li_aria_label_value = /*labels*/ ctx[3][/*i*/ ctx[19]]);
    			attr_dev(li, "tabindex", "0");
    			attr_dev(li, "class", "cat-item note svelte-h10xyx");
    			toggle_class(li, "selected-cat", /*selected*/ ctx[0] === /*i*/ ctx[19]);
    			add_location(li, file$k, 69, 6, 2285);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "mouseout", /*mouseout_handler_1*/ ctx[12], false, false, false),
    					listen_dev(li, "blur", /*blur_handler_1*/ ctx[13], false, false, false),
    					listen_dev(li, "mouseover", mouseover_handler_1, false, false, false),
    					listen_dev(li, "focus", focus_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*colors*/ 4) {
    				set_style(div, "background-color", /*c*/ ctx[17] !== 'url(#hash--windblown)'
    				? /*c*/ ctx[17]
    				: '');
    			}

    			if (dirty & /*colors*/ 4) {
    				set_style(div, "background-size", /*c*/ ctx[17] !== 'url(#hash--windblown)'
    				? ''
    				: '5.66px 5.66px');
    			}

    			if (dirty & /*colors*/ 4) {
    				set_style(div, "background-image", /*c*/ ctx[17] !== 'url(#hash--windblown)'
    				? ''
    				: `linear-gradient(
              135deg,
              #faba26 25%,
              #f9f9f9 25%,
              #f9f9f9 50%,
              #faba26 50%,
              #faba26 75%,
              #f9f9f9 75%,
              #f9f9f9 100%
            )`);
    			}

    			if (dirty & /*labels*/ 8 && t1_value !== (t1_value = /*labels*/ ctx[3][/*i*/ ctx[19]] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*labels*/ 8 && li_aria_label_value !== (li_aria_label_value = /*labels*/ ctx[3][/*i*/ ctx[19]])) {
    				attr_dev(li, "aria-label", li_aria_label_value);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li, "selected-cat", /*selected*/ ctx[0] === /*i*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(69:4) {#each colors as c, i}",
    		ctx
    	});

    	return block;
    }

    // (55:8) {#if internalLabels}
    function create_if_block_2$3(ctx) {
    	let t0;
    	let div;

    	let t1_value = (/*internalLabels*/ ctx[5][/*i*/ ctx[19]]
    	? /*internalLabels*/ ctx[5][/*i*/ ctx[19]].label
    	: "") + "";

    	let t1;
    	let if_block = /*internalLabels*/ ctx[5][/*i*/ ctx[19]]?.icon && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");
    			t1 = text$1(t1_value);
    			attr_dev(div, "class", "note internal-label svelte-h10xyx");
    			add_location(div, file$k, 58, 10, 1932);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (/*internalLabels*/ ctx[5][/*i*/ ctx[19]]?.icon) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*internalLabels*/ 32 && t1_value !== (t1_value = (/*internalLabels*/ ctx[5][/*i*/ ctx[19]]
    			? /*internalLabels*/ ctx[5][/*i*/ ctx[19]].label
    			: "") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(55:8) {#if internalLabels}",
    		ctx
    	});

    	return block;
    }

    // (56:8) {#if internalLabels[i]?.icon}
    function create_if_block_3$1(ctx) {
    	let div;
    	let raw_value = svg[/*internalLabels*/ ctx[5][/*i*/ ctx[19]]?.icon] + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "icon svelte-h10xyx");
    			add_location(div, file$k, 56, 10, 1847);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*internalLabels*/ 32 && raw_value !== (raw_value = svg[/*internalLabels*/ ctx[5][/*i*/ ctx[19]]?.icon] + "")) div.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(56:8) {#if internalLabels[i]?.icon}",
    		ctx
    	});

    	return block;
    }

    // (61:8) {#if labels[i] !== undefined}
    function create_if_block_1$7(ctx) {
    	let p;
    	let t_value = /*labels*/ ctx[3][/*i*/ ctx[19]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text$1(t_value);
    			attr_dev(p, "class", "note svelte-h10xyx");
    			add_location(p, file$k, 61, 10, 2084);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 8 && t_value !== (t_value = /*labels*/ ctx[3][/*i*/ ctx[19]] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(61:8) {#if labels[i] !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (40:4) {#each colors as c, i}
    function create_each_block$b(ctx) {
    	let li;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*internalLabels*/ ctx[5] && create_if_block_2$3(ctx);
    	let if_block1 = /*labels*/ ctx[3][/*i*/ ctx[19]] !== undefined && create_if_block_1$7(ctx);

    	function mouseover_handler() {
    		return /*mouseover_handler*/ ctx[10](/*i*/ ctx[19]);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[11](/*i*/ ctx[19]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			attr_dev(li, "role", "menuitem");
    			attr_dev(li, "aria-label", "Legend item #" + (/*i*/ ctx[19] + 1));
    			attr_dev(li, "tabindex", "0");

    			set_style(li, "width", (/*legendWidths*/ ctx[6]
    			? /*legendWidths*/ ctx[6][/*i*/ ctx[19]]
    			: 100 / /*colors*/ ctx[2].length) + "%");

    			set_style(li, "background-color", /*c*/ ctx[17]);
    			attr_dev(li, "class", "svelte-h10xyx");
    			toggle_class(li, "selected-seq", /*selected*/ ctx[0] === /*i*/ ctx[19]);

    			toggle_class(li, "border", /*internalLabels*/ ctx[5]
    			? /*internalLabels*/ ctx[5][/*i*/ ctx[19]]?.border
    			: false);

    			add_location(li, file$k, 40, 6, 1258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if (if_block0) if_block0.m(li, null);
    			append_dev(li, t0);
    			if (if_block1) if_block1.m(li, null);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "mouseout", /*mouseout_handler*/ ctx[8], false, false, false),
    					listen_dev(li, "blur", /*blur_handler*/ ctx[9], false, false, false),
    					listen_dev(li, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(li, "focus", focus_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*internalLabels*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					if_block0.m(li, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*labels*/ ctx[3][/*i*/ ctx[19]] !== undefined) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$7(ctx);
    					if_block1.c();
    					if_block1.m(li, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*legendWidths, colors*/ 68) {
    				set_style(li, "width", (/*legendWidths*/ ctx[6]
    				? /*legendWidths*/ ctx[6][/*i*/ ctx[19]]
    				: 100 / /*colors*/ ctx[2].length) + "%");
    			}

    			if (dirty & /*colors*/ 4) {
    				set_style(li, "background-color", /*c*/ ctx[17]);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li, "selected-seq", /*selected*/ ctx[0] === /*i*/ ctx[19]);
    			}

    			if (dirty & /*internalLabels*/ 32) {
    				toggle_class(li, "border", /*internalLabels*/ ctx[5]
    				? /*internalLabels*/ ctx[5][/*i*/ ctx[19]]?.border
    				: false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(40:4) {#each colors as c, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let h3;
    	let t;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[4] === "sequential") return create_if_block$a;
    		if (/*type*/ ctx[4] === "categorical") return create_if_block_4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    			attr_dev(h3, "class", "note title svelte-h10xyx");
    			add_location(h3, file$k, 30, 0, 1040);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			h3.innerHTML = /*title*/ ctx[1];
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 2) h3.innerHTML = /*title*/ ctx[1];
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t);

    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Legend', slots, []);
    	let { title = "" } = $$props;
    	let { colors } = $$props;
    	let { labels } = $$props;
    	let { type = "sequential" } = $$props;
    	let { selected } = $$props;
    	let { linearDomain = null } = $$props;
    	let { internalLabels = null } = $$props;
    	let legendWidths = null;

    	const calcLinearLabels = labels => {
    		let ret = [];
    		let normalizedLabels = labels.map(label => Number(label.match(/(\d+)/)[0]));
    		let globalDistance = linearDomain[1] - linearDomain[0];
    		ret.push((normalizedLabels[0] - linearDomain[0]) / globalDistance * 100);

    		normalizedLabels.reduce(
    			(acc, curr) => {
    				let distance = curr - acc;
    				ret.push(distance / globalDistance * 100);
    				console.log('acc', acc, 'curr', curr, 'distance', distance, 'ret', ret);
    				return curr;
    			},
    			linearDomain[0]
    		);

    		ret.push((linearDomain[1] - normalizedLabels[normalizedLabels.length - 1]) / globalDistance * 100);
    		return ret;
    	};

    	if (linearDomain) legendWidths = calcLinearLabels(labels);

    	const writable_props = [
    		'title',
    		'colors',
    		'labels',
    		'type',
    		'selected',
    		'linearDomain',
    		'internalLabels'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Legend> was created with unknown prop '${key}'`);
    	});

    	const mouseout_handler = () => $$invalidate(0, selected = null);
    	const blur_handler = () => $$invalidate(0, selected = null);
    	const mouseover_handler = i => $$invalidate(0, selected = i);
    	const focus_handler = i => $$invalidate(0, selected = i);
    	const mouseout_handler_1 = () => $$invalidate(0, selected = null);
    	const blur_handler_1 = () => $$invalidate(0, selected = null);
    	const mouseover_handler_1 = i => $$invalidate(0, selected = i);
    	const focus_handler_1 = i => $$invalidate(0, selected = i);

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('colors' in $$props) $$invalidate(2, colors = $$props.colors);
    		if ('labels' in $$props) $$invalidate(3, labels = $$props.labels);
    		if ('type' in $$props) $$invalidate(4, type = $$props.type);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('linearDomain' in $$props) $$invalidate(7, linearDomain = $$props.linearDomain);
    		if ('internalLabels' in $$props) $$invalidate(5, internalLabels = $$props.internalLabels);
    	};

    	$$self.$capture_state = () => ({
    		svg,
    		title,
    		colors,
    		labels,
    		type,
    		selected,
    		linearDomain,
    		internalLabels,
    		legendWidths,
    		calcLinearLabels
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('colors' in $$props) $$invalidate(2, colors = $$props.colors);
    		if ('labels' in $$props) $$invalidate(3, labels = $$props.labels);
    		if ('type' in $$props) $$invalidate(4, type = $$props.type);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('linearDomain' in $$props) $$invalidate(7, linearDomain = $$props.linearDomain);
    		if ('internalLabels' in $$props) $$invalidate(5, internalLabels = $$props.internalLabels);
    		if ('legendWidths' in $$props) $$invalidate(6, legendWidths = $$props.legendWidths);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selected,
    		title,
    		colors,
    		labels,
    		type,
    		internalLabels,
    		legendWidths,
    		linearDomain,
    		mouseout_handler,
    		blur_handler,
    		mouseover_handler,
    		focus_handler,
    		mouseout_handler_1,
    		blur_handler_1,
    		mouseover_handler_1,
    		focus_handler_1
    	];
    }

    class Legend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			title: 1,
    			colors: 2,
    			labels: 3,
    			type: 4,
    			selected: 0,
    			linearDomain: 7,
    			internalLabels: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Legend",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*colors*/ ctx[2] === undefined && !('colors' in props)) {
    			console_1$2.warn("<Legend> was created without expected prop 'colors'");
    		}

    		if (/*labels*/ ctx[3] === undefined && !('labels' in props)) {
    			console_1$2.warn("<Legend> was created without expected prop 'labels'");
    		}

    		if (/*selected*/ ctx[0] === undefined && !('selected' in props)) {
    			console_1$2.warn("<Legend> was created without expected prop 'selected'");
    		}
    	}

    	get title() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labels() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labels(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get linearDomain() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linearDomain(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get internalLabels() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set internalLabels(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const colorSectors = ordinal()
        .domain([
        'residential', 'transport', 'intlshipping', 'industry', 'commercial', 'afciddust',
        'othercombustion', 'remainingsources', 'otherfires', 'agrwasteburning', 'agriculture',
        'waste', 'solvents', 'energy', 'windblowndust'
    ])
        .range([
        '#007dc8', '#811494', '#9b7ccc', '#ab4867', '#ff9c9c', '#b3b3b3', '#8c8c8c', '#666666',
        '#333333', '#62b048', '#1b6e29', '#dcae89', '#854f38', '#ff8a18', 'url(#hash--windblown)'
    ]);
    const colorFuels = ordinal()
        .domain(['process', 'liquid', 'solidbio', 'coal'])
        .range(['#407aa9', '#faba26', '#62b048', '#333333']);
    const colorPM25 = threshold()
        .domain([...new Array(8)].map((d, i) => (i + 1) * 5))
        .range(['#D9D9D9', '#ffbbb0', '#F18EA7', '#D3609E', '#C14291', '#8D0085']);
    const colorHealth = threshold()
        .domain([20, 40, 60, 80, 100, 120])
        .range(['#ffcb5b', '#e8a768', '#d08371', '#b86078', '#9d3a7d', '#800080']);
    const colorPolices = ordinal()
        .domain(['Target met', 'On track', 'Not met', 'No data'])
        .range(['#004982', '#5A93B4', '#ffcb5b', '#cacaca']);
    const colorDiseases = ordinal()
        .domain([5, 15, 25, 35])
        .range(["#FFBEB3", "#E094A7", "#C16B9B", "#A1408E", "#800080"]);

    /* src/components/common/ScrollableX.svelte generated by Svelte v3.42.3 */
    const file$j = "src/components/common/ScrollableX.svelte";

    // (54:2) {#if isScrollable}
    function create_if_block$9(ctx) {
    	let div1;
    	let div0;
    	let raw0_value = svg.arrows.right + "";
    	let t;
    	let div3;
    	let div2;
    	let raw1_value = svg.arrows.left + "";
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			div3 = element("div");
    			div2 = element("div");
    			attr_dev(div0, "class", "svelte-lar0y2");
    			add_location(div0, file$j, 55, 6, 1577);
    			attr_dev(div1, "class", "overflow overflow-right svelte-lar0y2");
    			toggle_class(div1, "overflow-visible", !/*atEnd*/ ctx[2]);
    			add_location(div1, file$j, 54, 4, 1472);
    			attr_dev(div2, "class", "svelte-lar0y2");
    			add_location(div2, file$j, 58, 6, 1734);
    			attr_dev(div3, "class", "overflow overflow-left svelte-lar0y2");
    			toggle_class(div3, "overflow-visible", !/*atStart*/ ctx[3]);
    			add_location(div3, file$j, 57, 4, 1629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			div0.innerHTML = raw0_value;
    			insert_dev(target, t, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			div2.innerHTML = raw1_value;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*scrollRightSmooth*/ ctx[10], false, false, false),
    					listen_dev(div3, "click", /*scrollLeftSmooth*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*atEnd*/ 4) {
    				toggle_class(div1, "overflow-visible", !/*atEnd*/ ctx[2]);
    			}

    			if (dirty & /*atStart*/ 8) {
    				toggle_class(div3, "overflow-visible", !/*atStart*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(54:2) {#if isScrollable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);
    	let if_block = /*isScrollable*/ ctx[1] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "scrollable-content svelte-lar0y2");
    			add_location(div0, file$j, 49, 2, 1354);
    			attr_dev(div1, "class", "scrollable svelte-lar0y2");
    			toggle_class(div1, "scrollable-dragging", /*dragging*/ ctx[4]);
    			toggle_class(div1, "scrollable-enabled", /*isScrollable*/ ctx[1]);
    			add_location(div1, file$j, 48, 0, 1225);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[17](div0);
    			append_dev(div1, t);
    			if (if_block) if_block.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "resize", /*update*/ ctx[5], false, false, false),
    					listen_dev(window, "mousemove", /*drag*/ ctx[8], false, false, false),
    					listen_dev(window, "mouseup", /*endDrag*/ ctx[9], false, false, false),
    					listen_dev(div0, "scroll", /*onscroll*/ ctx[6], false, false, false),
    					listen_dev(div1, "mousedown", /*startDrag*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isScrollable*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*dragging*/ 16) {
    				toggle_class(div1, "scrollable-dragging", /*dragging*/ ctx[4]);
    			}

    			if (dirty & /*isScrollable*/ 2) {
    				toggle_class(div1, "scrollable-enabled", /*isScrollable*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[17](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScrollableX', slots, ['default']);
    	var el;
    	var isScrollable = false;
    	var scrollLeft = 0;
    	var atEnd = false;
    	var atStart = true;
    	var scrollWidth;
    	var clientWidth;

    	function update() {
    		$$invalidate(13, scrollWidth = el.scrollWidth);
    		$$invalidate(14, clientWidth = el.clientWidth);
    		$$invalidate(1, isScrollable = clientWidth < scrollWidth);
    	}

    	function onscroll() {
    		$$invalidate(12, scrollLeft = el.scrollLeft);
    		$$invalidate(13, scrollWidth = el.scrollWidth);
    	}

    	onMount(() => document.fonts.ready.then(update));
    	afterUpdate(update);
    	var dragging = false;
    	var lastClientX;

    	function startDrag(evt) {
    		lastClientX = evt.clientX;
    		$$invalidate(4, dragging = true);
    	}

    	function drag(evt) {
    		if (dragging) {
    			const deltaX = evt.clientX - lastClientX;
    			$$invalidate(0, el.scrollLeft -= deltaX, el);
    			lastClientX = evt.clientX;
    		}
    	}

    	function endDrag() {
    		$$invalidate(4, dragging = false);
    	}

    	function scrollRightSmooth() {
    		el.scrollTo({
    			left: el.scrollLeft + 200,
    			behavior: 'smooth'
    		});
    	}

    	function scrollLeftSmooth() {
    		el.scrollTo({
    			left: el.scrollLeft - 200,
    			behavior: 'smooth'
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScrollableX> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(15, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		afterUpdate,
    		svgs: svg,
    		el,
    		isScrollable,
    		scrollLeft,
    		atEnd,
    		atStart,
    		scrollWidth,
    		clientWidth,
    		update,
    		onscroll,
    		dragging,
    		lastClientX,
    		startDrag,
    		drag,
    		endDrag,
    		scrollRightSmooth,
    		scrollLeftSmooth
    	});

    	$$self.$inject_state = $$props => {
    		if ('el' in $$props) $$invalidate(0, el = $$props.el);
    		if ('isScrollable' in $$props) $$invalidate(1, isScrollable = $$props.isScrollable);
    		if ('scrollLeft' in $$props) $$invalidate(12, scrollLeft = $$props.scrollLeft);
    		if ('atEnd' in $$props) $$invalidate(2, atEnd = $$props.atEnd);
    		if ('atStart' in $$props) $$invalidate(3, atStart = $$props.atStart);
    		if ('scrollWidth' in $$props) $$invalidate(13, scrollWidth = $$props.scrollWidth);
    		if ('clientWidth' in $$props) $$invalidate(14, clientWidth = $$props.clientWidth);
    		if ('dragging' in $$props) $$invalidate(4, dragging = $$props.dragging);
    		if ('lastClientX' in $$props) lastClientX = $$props.lastClientX;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*scrollWidth, clientWidth, scrollLeft*/ 28672) {
    			$$invalidate(2, atEnd = scrollWidth === clientWidth + scrollLeft);
    		}

    		if ($$self.$$.dirty & /*scrollLeft*/ 4096) {
    			$$invalidate(3, atStart = scrollLeft === 0);
    		}
    	};

    	return [
    		el,
    		isScrollable,
    		atEnd,
    		atStart,
    		dragging,
    		update,
    		onscroll,
    		startDrag,
    		drag,
    		endDrag,
    		scrollRightSmooth,
    		scrollLeftSmooth,
    		scrollLeft,
    		scrollWidth,
    		clientWidth,
    		$$scope,
    		slots,
    		div0_binding
    	];
    }

    class ScrollableX extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScrollableX",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src/components/ChartFooter.svelte generated by Svelte v3.42.3 */

    const file$i = "src/components/ChartFooter.svelte";
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});
    const get_text_slot_changes = dirty => ({});
    const get_text_slot_context = ctx => ({});

    function create_fragment$k(ctx) {
    	let footer;
    	let div1;
    	let div0;
    	let t0;
    	let span;
    	let t1;
    	let current;
    	const text_slot_template = /*#slots*/ ctx[2].text;
    	const text_slot = create_slot(text_slot_template, ctx, /*$$scope*/ ctx[1], get_text_slot_context);
    	const content_slot_template = /*#slots*/ ctx[2].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[1], get_content_slot_context);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			span = element("span");
    			if (text_slot) text_slot.c();
    			t1 = space();
    			if (content_slot) content_slot.c();
    			attr_dev(div0, "class", "footer-icon svelte-2oqsuz");
    			add_location(div0, file$i, 5, 4, 91);
    			attr_dev(span, "class", "footer-text");
    			add_location(span, file$i, 6, 4, 139);
    			attr_dev(div1, "class", "footer-content svelte-2oqsuz");
    			add_location(div1, file$i, 4, 2, 58);
    			attr_dev(footer, "class", "svelte-2oqsuz");
    			add_location(footer, file$i, 3, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div1);
    			append_dev(div1, div0);
    			div0.innerHTML = /*icon*/ ctx[0];
    			append_dev(div1, t0);
    			append_dev(div1, span);

    			if (text_slot) {
    				text_slot.m(span, null);
    			}

    			append_dev(div1, t1);

    			if (content_slot) {
    				content_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*icon*/ 1) div0.innerHTML = /*icon*/ ctx[0];
    			if (text_slot) {
    				if (text_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						text_slot,
    						text_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(text_slot_template, /*$$scope*/ ctx[1], dirty, get_text_slot_changes),
    						get_text_slot_context
    					);
    				}
    			}

    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[1], dirty, get_content_slot_changes),
    						get_content_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_slot, local);
    			transition_in(content_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_slot, local);
    			transition_out(content_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (text_slot) text_slot.d(detaching);
    			if (content_slot) content_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChartFooter', slots, ['text','content']);
    	let { icon } = $$props;
    	const writable_props = ['icon'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChartFooter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ icon });

    	$$self.$inject_state = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, $$scope, slots];
    }

    class ChartFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$k, create_fragment$k, safe_not_equal, { icon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChartFooter",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[0] === undefined && !('icon' in props)) {
    			console.warn("<ChartFooter> was created without expected prop 'icon'");
    		}
    	}

    	get icon() {
    		throw new Error("<ChartFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<ChartFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/EmbedFooter.svelte generated by Svelte v3.42.3 */
    const file$h = "src/components/EmbedFooter.svelte";
    const get_default_slot_changes$1 = dirty => ({});
    const get_default_slot_context$1 = ctx => ({ slot: "text" });

    // (28:4) {#if !showEmbedCode}
    function create_if_block$8(ctx) {
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Want to embed the visualizations?";
    			attr_dev(a, "href", "EmbedCode");
    			add_location(a, file$h, 28, 6, 714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(28:4) {#if !showEmbedCode}",
    		ctx
    	});

    	return block;
    }

    // (27:20)      
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let if_block = !/*showEmbedCode*/ ctx[1] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*showEmbedCode*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(27:20)      ",
    		ctx
    	});

    	return block;
    }

    // (27:2) 
    function create_text_slot(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$1);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*showEmbedCode*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_text_slot.name,
    		type: "slot",
    		source: "(27:2) ",
    		ctx
    	});

    	return block;
    }

    // (32:2) 
    function create_content_slot(ctx) {
    	let div;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			attr_dev(input, "type", "text");
    			input.readOnly = true;
    			attr_dev(input, "title", /*embed*/ ctx[0]);
    			input.value = input_value_value = "<script async src='" + /*embedScript*/ ctx[6] + "' data-embed='" + /*embed*/ ctx[0] + "'></script>";
    			attr_dev(input, "class", "svelte-xqu2bd");
    			toggle_class(input, "visible", /*showEmbedCode*/ ctx[1]);
    			add_location(input, file$h, 32, 4, 862);
    			attr_dev(div, "slot", "content");
    			attr_dev(div, "class", "input-container svelte-xqu2bd");
    			add_location(div, file$h, 31, 2, 813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			/*input_binding*/ ctx[8](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "click", /*selectAll*/ ctx[5], false, false, false),
    					listen_dev(input, "blur", /*reset*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*embed*/ 1) {
    				attr_dev(input, "title", /*embed*/ ctx[0]);
    			}

    			if (dirty & /*embed*/ 1 && input_value_value !== (input_value_value = "<script async src='" + /*embedScript*/ ctx[6] + "' data-embed='" + /*embed*/ ctx[0] + "'></script>") && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*showEmbedCode*/ 2) {
    				toggle_class(input, "visible", /*showEmbedCode*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(32:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let chartfooter;
    	let current;

    	chartfooter = new ChartFooter({
    			props: {
    				icon: svg.embed,
    				$$slots: {
    					content: [create_content_slot],
    					text: [create_text_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chartfooter.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(chartfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const chartfooter_changes = {};

    			if (dirty & /*$$scope, embed, inputEl, showEmbedCode*/ 519) {
    				chartfooter_changes.$$scope = { dirty, ctx };
    			}

    			chartfooter.$set(chartfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chartfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chartfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chartfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EmbedFooter', slots, ['default']);
    	let { embed } = $$props;
    	var showEmbedCode = false;
    	var inputEl;

    	function click(evt) {
    		$$invalidate(1, showEmbedCode = true);
    		evt.preventDefault();

    		window.setTimeout(
    			() => {
    				inputEl.focus();
    				selectAll();
    			},
    			0
    		);
    	}

    	function reset() {
    		$$invalidate(1, showEmbedCode = false);
    	}

    	function selectAll() {
    		inputEl.setSelectionRange(0, inputEl.value.length);
    	}

    	const urlParts = window.location.href.split('/');
    	const urlPath = urlParts.slice(0, -1).join('/');
    	const embedScript = `${urlPath}/embed.js`;
    	const writable_props = ['embed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EmbedFooter> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputEl = $$value;
    			$$invalidate(2, inputEl);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('embed' in $$props) $$invalidate(0, embed = $$props.embed);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		svgs: svg,
    		ChartFooter,
    		embed,
    		showEmbedCode,
    		inputEl,
    		click,
    		reset,
    		selectAll,
    		urlParts,
    		urlPath,
    		embedScript
    	});

    	$$self.$inject_state = $$props => {
    		if ('embed' in $$props) $$invalidate(0, embed = $$props.embed);
    		if ('showEmbedCode' in $$props) $$invalidate(1, showEmbedCode = $$props.showEmbedCode);
    		if ('inputEl' in $$props) $$invalidate(2, inputEl = $$props.inputEl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*embed*/ 1) {
    			embed && reset();
    		}
    	};

    	return [
    		embed,
    		showEmbedCode,
    		inputEl,
    		click,
    		reset,
    		selectAll,
    		embedScript,
    		slots,
    		input_binding,
    		$$scope
    	];
    }

    class EmbedFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$j, create_fragment$j, safe_not_equal, { embed: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EmbedFooter",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*embed*/ ctx[0] === undefined && !('embed' in props)) {
    			console.warn("<EmbedFooter> was created without expected prop 'embed'");
    		}
    	}

    	get embed() {
    		throw new Error("<EmbedFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set embed(value) {
    		throw new Error("<EmbedFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/SectionTitle.svelte generated by Svelte v3.42.3 */
    const file$g = "src/components/SectionTitle.svelte";

    function create_fragment$i(ctx) {
    	let div2;
    	let div0;
    	let raw0_value = svg.menu[/*block*/ ctx[0].icon] + "";
    	let div0_style_value;
    	let t;
    	let div1;
    	let raw1_value = /*block*/ ctx[0].menu + "";

    	const block_1 = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "kicker-icon svelte-jvn33y");
    			attr_dev(div0, "style", div0_style_value = alignment[/*block*/ ctx[0].icon] || '');
    			add_location(div0, file$g, 5, 2, 113);
    			attr_dev(div1, "class", "kicker-text svelte-jvn33y");
    			add_location(div1, file$g, 6, 2, 212);
    			attr_dev(div2, "class", "kicker svelte-jvn33y");
    			add_location(div2, file$g, 4, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			div0.innerHTML = raw0_value;
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			div1.innerHTML = raw1_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*block*/ 1 && raw0_value !== (raw0_value = svg.menu[/*block*/ ctx[0].icon] + "")) div0.innerHTML = raw0_value;
    			if (dirty & /*block*/ 1 && div0_style_value !== (div0_style_value = alignment[/*block*/ ctx[0].icon] || '')) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*block*/ 1 && raw1_value !== (raw1_value = /*block*/ ctx[0].menu + "")) div1.innerHTML = raw1_value;		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SectionTitle', slots, []);
    	
    	let { block } = $$props;
    	const writable_props = ['block'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SectionTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('block' in $$props) $$invalidate(0, block = $$props.block);
    	};

    	$$self.$capture_state = () => ({ svg, alignment, block });

    	$$self.$inject_state = $$props => {
    		if ('block' in $$props) $$invalidate(0, block = $$props.block);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [block];
    }

    class SectionTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$i, create_fragment$i, safe_not_equal, { block: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SectionTitle",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*block*/ ctx[0] === undefined && !('block' in props)) {
    			console.warn("<SectionTitle> was created without expected prop 'block'");
    		}
    	}

    	get block() {
    		throw new Error("<SectionTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<SectionTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src/components/Select.svelte generated by Svelte v3.42.3 */
    const file$f = "src/components/Select.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    const get_default_slot_changes_1 = dirty => ({ option: dirty & /*options*/ 1 });
    const get_default_slot_context_1 = ctx => ({ option: /*opt*/ ctx[11] });

    const get_default_slot_changes = dirty => ({
    	option: dirty & /*options, currentIndex*/ 3
    });

    const get_default_slot_context = ctx => ({
    	option: /*options*/ ctx[0][/*currentIndex*/ ctx[1]]
    });

    // (41:0) {#if listboxVisible}
    function create_if_block$7(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	let each_value = /*options*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "listbox svelte-82po7i");
    			add_location(div, file$f, 41, 4, 1170);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*chooseOption, $$scope, options, currentIndex*/ 75) {
    				each_value = /*options*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, scale, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!div_transition) div_transition = create_bidirectional_transition(div, scale, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(41:0) {#if listboxVisible}",
    		ctx
    	});

    	return block;
    }

    // (44:8) {#if i !== currentIndex}
    function create_if_block_1$6(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], get_default_slot_context_1);

    	function focus_handler() {
    		return /*focus_handler*/ ctx[10](/*i*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			attr_dev(div, "class", "option svelte-82po7i");
    			attr_dev(div, "tabindex", "-1");
    			add_location(div, file$f, 44, 8, 1280);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "focus", focus_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, options*/ 65)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(44:8) {#if i !== currentIndex}",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#each options as opt, i}
    function create_each_block$a(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*i*/ ctx[13] !== /*currentIndex*/ ctx[1] && create_if_block_1$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[13] !== /*currentIndex*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*currentIndex*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(43:4) {#each options as opt, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let svg;
    	let path;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], get_default_slot_context);
    	let if_block = /*listboxVisible*/ ctx[2] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(path, "d", "M0.630249 1L6.36134 6.5L12.0924 1");
    			add_location(path, file$f, 36, 8, 1079);
    			attr_dev(svg, "class", "arrow svelte-82po7i");
    			attr_dev(svg, "viewBox", "0 0 13 8");
    			add_location(svg, file$f, 35, 4, 1032);
    			attr_dev(div0, "class", "selector-area svelte-82po7i");
    			add_location(div0, file$f, 29, 0, 858);
    			attr_dev(div1, "class", "madlib-selector svelte-82po7i");
    			add_location(div1, file$f, 28, 0, 828);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div0, t0);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(div1, t1);
    			if (if_block) if_block.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handleKeyDown*/ ctx[4], false, false, false),
    					listen_dev(div0, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(div0, "blur", /*blur_handler*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, options, currentIndex*/ 67)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (/*listboxVisible*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*listboxVisible*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, ['default']);
    	let { options } = $$props;
    	let { selected = options[0].value ? options[0].value : 0 } = $$props;
    	let currentIndex = 0;
    	let listboxVisible = false;

    	const chooseOption = index => {
    		$$invalidate(1, currentIndex = index);
    		$$invalidate(2, listboxVisible = false);
    	};

    	const handleKeyDown = e => {
    		if (listboxVisible) {
    			if (e.key === 'ArrowUp' && currentIndex > 0) {
    				$$invalidate(1, currentIndex--, currentIndex);
    				e.preventDefault();
    			} else if (e.key === 'ArrowDown' && currentIndex < options.length - 1) {
    				$$invalidate(1, currentIndex++, currentIndex);
    				e.preventDefault();
    			}
    		}
    	};

    	const writable_props = ['options', 'selected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(2, listboxVisible = !listboxVisible);
    	const blur_handler = () => $$invalidate(2, listboxVisible = false);
    	const focus_handler = i => chooseOption(i);

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(0, options = $$props.options);
    		if ('selected' in $$props) $$invalidate(5, selected = $$props.selected);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		scale,
    		options,
    		selected,
    		currentIndex,
    		listboxVisible,
    		chooseOption,
    		handleKeyDown
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(0, options = $$props.options);
    		if ('selected' in $$props) $$invalidate(5, selected = $$props.selected);
    		if ('currentIndex' in $$props) $$invalidate(1, currentIndex = $$props.currentIndex);
    		if ('listboxVisible' in $$props) $$invalidate(2, listboxVisible = $$props.listboxVisible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*options, currentIndex*/ 3) {
    			$$invalidate(5, selected = options[currentIndex].value
    			? options[currentIndex].value
    			: currentIndex);
    		}
    	};

    	return [
    		options,
    		currentIndex,
    		listboxVisible,
    		chooseOption,
    		handleKeyDown,
    		selected,
    		$$scope,
    		slots,
    		click_handler,
    		blur_handler,
    		focus_handler
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$h, create_fragment$h, safe_not_equal, { options: 0, selected: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[0] === undefined && !('options' in props)) {
    			console.warn("<Select> was created without expected prop 'options'");
    		}
    	}

    	get options() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/DiseaseDropdownView.svelte generated by Svelte v3.42.3 */
    const file$e = "src/components/DiseaseDropdownView.svelte";

    function create_fragment$g(ctx) {
    	let div1;
    	let div0;
    	let raw_value = svg.diseases[/*option*/ ctx[0].value] + "";
    	let t0;
    	let t1_value = /*option*/ ctx[0].label + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			t1 = text$1(t1_value);
    			attr_dev(div0, "class", "icon svelte-4kbvt7");
    			add_location(div0, file$e, 6, 2, 103);
    			attr_dev(div1, "class", "container svelte-4kbvt7");
    			add_location(div1, file$e, 5, 0, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			div0.innerHTML = raw_value;
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*option*/ 1 && raw_value !== (raw_value = svg.diseases[/*option*/ ctx[0].value] + "")) div0.innerHTML = raw_value;			if (dirty & /*option*/ 1 && t1_value !== (t1_value = /*option*/ ctx[0].label + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DiseaseDropdownView', slots, []);
    	
    	let { option } = $$props;
    	const writable_props = ['option'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DiseaseDropdownView> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('option' in $$props) $$invalidate(0, option = $$props.option);
    	};

    	$$self.$capture_state = () => ({ svg, option });

    	$$self.$inject_state = $$props => {
    		if ('option' in $$props) $$invalidate(0, option = $$props.option);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [option];
    }

    class DiseaseDropdownView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$g, create_fragment$g, safe_not_equal, { option: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DiseaseDropdownView",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*option*/ ctx[0] === undefined && !('option' in props)) {
    			console.warn("<DiseaseDropdownView> was created without expected prop 'option'");
    		}
    	}

    	get option() {
    		throw new Error("<DiseaseDropdownView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set option(value) {
    		throw new Error("<DiseaseDropdownView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Dropdown.svelte generated by Svelte v3.42.3 */

    // (14:0) <Select options={items} let:option={option} bind:selected={selectedElement}>
    function create_default_slot$3(ctx) {
    	let diseasesdropdownview;
    	let current;

    	diseasesdropdownview = new DiseaseDropdownView({
    			props: { option: /*option*/ ctx[4] },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(diseasesdropdownview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(diseasesdropdownview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const diseasesdropdownview_changes = {};
    			if (dirty & /*option*/ 16) diseasesdropdownview_changes.option = /*option*/ ctx[4];
    			diseasesdropdownview.$set(diseasesdropdownview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(diseasesdropdownview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(diseasesdropdownview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(diseasesdropdownview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(14:0) <Select options={items} let:option={option} bind:selected={selectedElement}>",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$f(ctx) {
    	let select;
    	let updating_selected;
    	let current;

    	function select_selected_binding(value) {
    		/*select_selected_binding*/ ctx[3](value);
    	}

    	let select_props = {
    		options: /*items*/ ctx[1],
    		$$slots: {
    			default: [
    				create_default_slot$3,
    				({ option }) => ({ 4: option }),
    				({ option }) => option ? 16 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*selectedElement*/ ctx[0] !== void 0) {
    		select_props.selected = /*selectedElement*/ ctx[0];
    	}

    	select = new Select({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, 'selected', select_selected_binding));

    	const block_1 = {
    		c: function create() {
    			create_component(select.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(select, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const select_changes = {};

    			if (dirty & /*$$scope, option*/ 48) {
    				select_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_selected && dirty & /*selectedElement*/ 1) {
    				updating_selected = true;
    				select_changes.selected = /*selectedElement*/ ctx[0];
    				add_flush_callback(() => updating_selected = false);
    			}

    			select.$set(select_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(select, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, []);
    	
    	let { block = undefined } = $$props;
    	let { selectedElement } = $$props;

    	let items = block === null || block === void 0
    	? void 0
    	: block.dropdown.map(item => ({ value: item.value, label: item.label }));

    	const writable_props = ['block', 'selectedElement'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropdown> was created with unknown prop '${key}'`);
    	});

    	function select_selected_binding(value) {
    		selectedElement = value;
    		($$invalidate(0, selectedElement), $$invalidate(1, items));
    	}

    	$$self.$$set = $$props => {
    		if ('block' in $$props) $$invalidate(2, block = $$props.block);
    		if ('selectedElement' in $$props) $$invalidate(0, selectedElement = $$props.selectedElement);
    	};

    	$$self.$capture_state = () => ({
    		svg,
    		alignment,
    		Select,
    		DiseasesDropdownView: DiseaseDropdownView,
    		block,
    		selectedElement,
    		items
    	});

    	$$self.$inject_state = $$props => {
    		if ('block' in $$props) $$invalidate(2, block = $$props.block);
    		if ('selectedElement' in $$props) $$invalidate(0, selectedElement = $$props.selectedElement);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, selectedElement = items[0]);
    	return [selectedElement, items, block, select_selected_binding];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$f, create_fragment$f, safe_not_equal, { block: 2, selectedElement: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selectedElement*/ ctx[0] === undefined && !('selectedElement' in props)) {
    			console.warn("<Dropdown> was created without expected prop 'selectedElement'");
    		}
    	}

    	get block() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedElement() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedElement(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Title.svelte generated by Svelte v3.42.3 */

    const { console: console_1$1 } = globals;

    function create_fragment$e(ctx) {
    	let html_tag;
    	let raw_value = /*block*/ ctx[0]?.title + "";
    	let html_anchor;

    	const block_1 = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty$1();
    			html_tag.a = html_anchor;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*block*/ 1 && raw_value !== (raw_value = /*block*/ ctx[0]?.title + "")) html_tag.p(raw_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	
    	let { block } = $$props;
    	console.log(block);
    	const writable_props = ['block'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('block' in $$props) $$invalidate(0, block = $$props.block);
    	};

    	$$self.$capture_state = () => ({ block });

    	$$self.$inject_state = $$props => {
    		if ('block' in $$props) $$invalidate(0, block = $$props.block);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [block];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$e, create_fragment$e, safe_not_equal, { block: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*block*/ ctx[0] === undefined && !('block' in props)) {
    			console_1$1.warn("<Title> was created without expected prop 'block'");
    		}
    	}

    	get block() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Head.svelte generated by Svelte v3.42.3 */

    const { console: console_1 } = globals;
    const file$d = "src/components/Head.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (45:2) {#each blocks as block}
    function create_each_block$9(ctx) {
    	let switch_instance;
    	let updating_selectedElement;
    	let switch_instance_anchor;
    	let current;

    	function switch_instance_selectedElement_binding(value) {
    		/*switch_instance_selectedElement_binding*/ ctx[6](value);
    	}

    	var switch_value = /*components*/ ctx[2][/*block*/ ctx[8].type];

    	function switch_props(ctx) {
    		let switch_instance_props = { block: /*block*/ ctx[8] };

    		if (/*selectedElement*/ ctx[0] !== void 0) {
    			switch_instance_props.selectedElement = /*selectedElement*/ ctx[0];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'selectedElement', switch_instance_selectedElement_binding));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*blocks*/ 2) switch_instance_changes.block = /*block*/ ctx[8];

    			if (!updating_selectedElement && dirty & /*selectedElement*/ 1) {
    				updating_selectedElement = true;
    				switch_instance_changes.selectedElement = /*selectedElement*/ ctx[0];
    				add_flush_callback(() => updating_selectedElement = false);
    			}

    			if (switch_value !== (switch_value = /*components*/ ctx[2][/*block*/ ctx[8].type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'selectedElement', switch_instance_selectedElement_binding));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(45:2) {#each blocks as block}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let h2;
    	let current;
    	let each_value = /*blocks*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h2 = element("h2");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "narrow align svelte-1bh7umy");
    			add_location(h2, file$d, 43, 0, 996);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(h2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*components, blocks, selectedElement*/ 7) {
    				each_value = /*blocks*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(h2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Head', slots, []);
    	
    	let { title } = $$props;
    	let { dropdown = [] } = $$props;
    	let { selectedElement } = $$props;
    	let { number = 0 } = $$props;
    	let blocks = [];
    	const components = { dropdown: Dropdown, title: Title };

    	const createBlocks = () => {
    		let ret = [];
    		if (title.includes("@number")) $$invalidate(3, title = title.replace("@number", number.toString()));

    		if (title.includes("@dropdown") && dropdown.length > 0) {
    			let titleBlocks = title.split("@dropdown");
    			ret.push({ type: "title", title: titleBlocks[0] });
    			ret.push({ type: "dropdown", dropdown });
    			ret.push({ type: "title", title: titleBlocks[1] });
    		} else {
    			ret.push({ type: "title", title });
    		}

    		console.log(ret);
    		return ret;
    	};

    	blocks = createBlocks();
    	const writable_props = ['title', 'dropdown', 'selectedElement', 'number'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Head> was created with unknown prop '${key}'`);
    	});

    	function switch_instance_selectedElement_binding(value) {
    		selectedElement = value;
    		$$invalidate(0, selectedElement);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('dropdown' in $$props) $$invalidate(4, dropdown = $$props.dropdown);
    		if ('selectedElement' in $$props) $$invalidate(0, selectedElement = $$props.selectedElement);
    		if ('number' in $$props) $$invalidate(5, number = $$props.number);
    	};

    	$$self.$capture_state = () => ({
    		Dropdown,
    		Title,
    		title,
    		dropdown,
    		selectedElement,
    		number,
    		blocks,
    		components,
    		createBlocks
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('dropdown' in $$props) $$invalidate(4, dropdown = $$props.dropdown);
    		if ('selectedElement' in $$props) $$invalidate(0, selectedElement = $$props.selectedElement);
    		if ('number' in $$props) $$invalidate(5, number = $$props.number);
    		if ('blocks' in $$props) $$invalidate(1, blocks = $$props.blocks);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selectedElement,
    		blocks,
    		components,
    		title,
    		dropdown,
    		number,
    		switch_instance_selectedElement_binding
    	];
    }

    class Head extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			title: 3,
    			dropdown: 4,
    			selectedElement: 0,
    			number: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Head",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[3] === undefined && !('title' in props)) {
    			console_1.warn("<Head> was created without expected prop 'title'");
    		}

    		if (/*selectedElement*/ ctx[0] === undefined && !('selectedElement' in props)) {
    			console_1.warn("<Head> was created without expected prop 'selectedElement'");
    		}
    	}

    	get title() {
    		throw new Error("<Head>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Head>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dropdown() {
    		throw new Error("<Head>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dropdown(value) {
    		throw new Error("<Head>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedElement() {
    		throw new Error("<Head>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedElement(value) {
    		throw new Error("<Head>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get number() {
    		throw new Error("<Head>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set number(value) {
    		throw new Error("<Head>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var diabetes = "Diabetes";
    var copd = "Chronic obstructive pulmonary disease";
    var ischemic = "Ischemic heart disease";
    var lri = "Lower respiratory infection";
    var lungcancer = "Trachea, bronchus and lung cancer";
    var stroke = "Stroke";
    var nd = "Neonatal disorders";
    var diseasesDictionary = {
    	diabetes: diabetes,
    	copd: copd,
    	ischemic: ischemic,
    	lri: lri,
    	lungcancer: lungcancer,
    	stroke: stroke,
    	nd: nd
    };

    /* src/components/CartoWorld.svelte generated by Svelte v3.42.3 */
    const file$c = "src/components/CartoWorld.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    // (367:2) {#if !isEmbed}
    function create_if_block_3(ctx) {
    	let sectiontitle;
    	let current;

    	sectiontitle = new SectionTitle({
    			props: { block: /*block*/ ctx[2] },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(sectiontitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectiontitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sectiontitle_changes = {};
    			if (dirty & /*block*/ 4) sectiontitle_changes.block = /*block*/ ctx[2];
    			sectiontitle.$set(sectiontitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectiontitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(367:2) {#if !isEmbed}",
    		ctx
    	});

    	return block_1;
    }

    // (385:2) {#if isEmbed && embed !== "policies"}
    function create_if_block_2$2(ctx) {
    	let div;
    	let p;
    	let t0;
    	let b;
    	let a;

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text$1("To explore more about the climate emergency and the effects on the\n        planet visit\n        ");
    			b = element("b");
    			a = element("a");
    			a.textContent = "unep.org";
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", "https://www.unep.org/");
    			add_location(a, file$c, 389, 11, 16402);
    			add_location(b, file$c, 389, 8, 16399);
    			add_location(p, file$c, 386, 6, 16291);
    			attr_dev(div, "class", "embed-additional-text-desktop svelte-8n8gc5");
    			toggle_class(div, "hide", /*cartogramAnnotation*/ ctx[13]);
    			add_location(div, file$c, 385, 4, 16208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, b);
    			append_dev(b, a);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cartogramAnnotation*/ 8192) {
    				toggle_class(div, "hide", /*cartogramAnnotation*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(385:2) {#if isEmbed && embed !== \\\"policies\\\"}",
    		ctx
    	});

    	return block_1;
    }

    // (396:4) <ScrollableX>
    function create_default_slot$2(ctx) {
    	let div;
    	let cartogram;
    	let updating_rerenderFn;
    	let updating_annotationShowing;
    	let current;
    	const cartogram_spread_levels = [/*datasetParams*/ ctx[14][/*data*/ ctx[0]], { slug: /*data*/ ctx[0] }];

    	function cartogram_rerenderFn_binding(value) {
    		/*cartogram_rerenderFn_binding*/ ctx[17](value);
    	}

    	function cartogram_annotationShowing_binding(value) {
    		/*cartogram_annotationShowing_binding*/ ctx[18](value);
    	}

    	let cartogram_props = {};

    	for (let i = 0; i < cartogram_spread_levels.length; i += 1) {
    		cartogram_props = assign(cartogram_props, cartogram_spread_levels[i]);
    	}

    	if (/*rerender*/ ctx[11] !== void 0) {
    		cartogram_props.rerenderFn = /*rerender*/ ctx[11];
    	}

    	if (/*cartogramAnnotation*/ ctx[13] !== void 0) {
    		cartogram_props.annotationShowing = /*cartogramAnnotation*/ ctx[13];
    	}

    	cartogram = new Cartogram({ props: cartogram_props, $$inline: true });
    	binding_callbacks.push(() => bind(cartogram, 'rerenderFn', cartogram_rerenderFn_binding));
    	binding_callbacks.push(() => bind(cartogram, 'annotationShowing', cartogram_annotationShowing_binding));

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			create_component(cartogram.$$.fragment);
    			set_style(div, "width", /*width*/ ctx[10] + "px");
    			set_style(div, "height", /*height*/ ctx[12] + "px");
    			attr_dev(div, "class", "cartogram-container svelte-8n8gc5");
    			add_location(div, file$c, 396, 6, 16578);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(cartogram, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cartogram_changes = (dirty & /*datasetParams, data*/ 16385)
    			? get_spread_update(cartogram_spread_levels, [
    					get_spread_object(/*datasetParams*/ ctx[14][/*data*/ ctx[0]]),
    					dirty & /*data*/ 1 && { slug: /*data*/ ctx[0] }
    				])
    			: {};

    			if (!updating_rerenderFn && dirty & /*rerender*/ 2048) {
    				updating_rerenderFn = true;
    				cartogram_changes.rerenderFn = /*rerender*/ ctx[11];
    				add_flush_callback(() => updating_rerenderFn = false);
    			}

    			if (!updating_annotationShowing && dirty & /*cartogramAnnotation*/ 8192) {
    				updating_annotationShowing = true;
    				cartogram_changes.annotationShowing = /*cartogramAnnotation*/ ctx[13];
    				add_flush_callback(() => updating_annotationShowing = false);
    			}

    			cartogram.$set(cartogram_changes);

    			if (!current || dirty & /*width*/ 1024) {
    				set_style(div, "width", /*width*/ ctx[10] + "px");
    			}

    			if (!current || dirty & /*height*/ 4096) {
    				set_style(div, "height", /*height*/ ctx[12] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cartogram.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cartogram.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(cartogram);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(396:4) <ScrollableX>",
    		ctx
    	});

    	return block_1;
    }

    // (411:2) {#if isEmbed && embed === "policies"}
    function create_if_block_1$5(ctx) {
    	let div;
    	let p;
    	let t0;
    	let b;
    	let a;

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text$1("To explore more about the climate emergency and the effects on the\n        planet visit\n        ");
    			b = element("b");
    			a = element("a");
    			a.textContent = "unep.org";
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", "https://www.unep.org/");
    			add_location(a, file$c, 418, 11, 17163);
    			add_location(b, file$c, 418, 8, 17160);
    			add_location(p, file$c, 415, 6, 17052);
    			attr_dev(div, "class", "embed-additional-text-desktop-policies svelte-8n8gc5");
    			toggle_class(div, "hide", /*cartogramAnnotation*/ ctx[13]);
    			add_location(div, file$c, 411, 4, 16943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, b);
    			append_dev(b, a);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cartogramAnnotation*/ 8192) {
    				toggle_class(div, "hide", /*cartogramAnnotation*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(411:2) {#if isEmbed && embed === \\\"policies\\\"}",
    		ctx
    	});

    	return block_1;
    }

    // (424:2) {#if !isEmbed}
    function create_if_block$6(ctx) {
    	let div;
    	let embedfooter;
    	let t;
    	let each_1_anchor;
    	let current;

    	embedfooter = new EmbedFooter({
    			props: { embed: /*embed*/ ctx[5] },
    			$$inline: true
    		});

    	let each_value = /*text*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			create_component(embedfooter.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    			attr_dev(div, "class", "footer svelte-8n8gc5");
    			add_location(div, file$c, 424, 4, 17280);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(embedfooter, div, null);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const embedfooter_changes = {};
    			if (dirty & /*embed*/ 32) embedfooter_changes.embed = /*embed*/ ctx[5];
    			embedfooter.$set(embedfooter_changes);

    			if (dirty & /*text*/ 16) {
    				each_value = /*text*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(embedfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(embedfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(embedfooter);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(424:2) {#if !isEmbed}",
    		ctx
    	});

    	return block_1;
    }

    // (429:4) {#each text as t}
    function create_each_block$8(ctx) {
    	let p;
    	let raw_value = /*t*/ ctx[27].p + "";

    	const block_1 = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "col-text");
    			add_location(p, file$c, 429, 6, 17371);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 16 && raw_value !== (raw_value = /*t*/ ctx[27].p + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(429:4) {#each text as t}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$c(ctx) {
    	let section;
    	let t0;
    	let head_1;
    	let updating_selectedElement;
    	let t1;
    	let div0;
    	let legend;
    	let updating_selected;
    	let t2;
    	let t3;
    	let div1;
    	let scrollablex;
    	let div1_resize_listener;
    	let t4;
    	let t5;
    	let current;
    	let if_block0 = !/*isEmbed*/ ctx[6] && create_if_block_3(ctx);

    	function head_1_selectedElement_binding(value) {
    		/*head_1_selectedElement_binding*/ ctx[15](value);
    	}

    	let head_1_props = {
    		title: /*head*/ ctx[3],
    		dropdown: /*block*/ ctx[2].dropdown
    	};

    	if (/*selectedDisease*/ ctx[7] !== void 0) {
    		head_1_props.selectedElement = /*selectedDisease*/ ctx[7];
    	}

    	head_1 = new Head({ props: head_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(head_1, 'selectedElement', head_1_selectedElement_binding));

    	function legend_selected_binding(value) {
    		/*legend_selected_binding*/ ctx[16](value);
    	}

    	let legend_props = {
    		title: /*datasetParams*/ ctx[14][/*data*/ ctx[0]].legendTitle,
    		colors: /*datasetParams*/ ctx[14][/*data*/ ctx[0]].color.range(),
    		labels: /*datasetParams*/ ctx[14][/*data*/ ctx[0]].legendDomain,
    		type: /*datasetParams*/ ctx[14][/*data*/ ctx[0]].legendType,
    		linearDomain: /*datasetParams*/ ctx[14][/*data*/ ctx[0]].linearDomain,
    		internalLabels: /*datasetParams*/ ctx[14][/*data*/ ctx[0]].internalLabels
    	};

    	if (/*legendElementSelectedIndex*/ ctx[8] !== void 0) {
    		legend_props.selected = /*legendElementSelectedIndex*/ ctx[8];
    	}

    	legend = new Legend({ props: legend_props, $$inline: true });
    	binding_callbacks.push(() => bind(legend, 'selected', legend_selected_binding));
    	let if_block1 = /*isEmbed*/ ctx[6] && /*embed*/ ctx[5] !== "policies" && create_if_block_2$2(ctx);

    	scrollablex = new ScrollableX({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block2 = /*isEmbed*/ ctx[6] && /*embed*/ ctx[5] === "policies" && create_if_block_1$5(ctx);
    	let if_block3 = !/*isEmbed*/ ctx[6] && create_if_block$6(ctx);

    	const block_1 = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(head_1.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			create_component(legend.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div1 = element("div");
    			create_component(scrollablex.$$.fragment);
    			t4 = space();
    			if (if_block2) if_block2.c();
    			t5 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(div0, "class", "right-narrow");
    			add_location(div0, file$c, 372, 2, 15760);
    			attr_dev(div1, "class", "margin-breakout-mobile");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[19].call(div1));
    			add_location(div1, file$c, 394, 2, 16500);
    			attr_dev(section, "id", /*id*/ ctx[1]);
    			attr_dev(section, "class", "viz wide");
    			add_location(section, file$c, 365, 0, 15582);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t0);
    			mount_component(head_1, section, null);
    			append_dev(section, t1);
    			append_dev(section, div0);
    			mount_component(legend, div0, null);
    			append_dev(section, t2);
    			if (if_block1) if_block1.m(section, null);
    			append_dev(section, t3);
    			append_dev(section, div1);
    			mount_component(scrollablex, div1, null);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[19].bind(div1));
    			append_dev(section, t4);
    			if (if_block2) if_block2.m(section, null);
    			append_dev(section, t5);
    			if (if_block3) if_block3.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*isEmbed*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*isEmbed*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const head_1_changes = {};
    			if (dirty & /*head*/ 8) head_1_changes.title = /*head*/ ctx[3];
    			if (dirty & /*block*/ 4) head_1_changes.dropdown = /*block*/ ctx[2].dropdown;

    			if (!updating_selectedElement && dirty & /*selectedDisease*/ 128) {
    				updating_selectedElement = true;
    				head_1_changes.selectedElement = /*selectedDisease*/ ctx[7];
    				add_flush_callback(() => updating_selectedElement = false);
    			}

    			head_1.$set(head_1_changes);
    			const legend_changes = {};
    			if (dirty & /*data*/ 1) legend_changes.title = /*datasetParams*/ ctx[14][/*data*/ ctx[0]].legendTitle;
    			if (dirty & /*data*/ 1) legend_changes.colors = /*datasetParams*/ ctx[14][/*data*/ ctx[0]].color.range();
    			if (dirty & /*data*/ 1) legend_changes.labels = /*datasetParams*/ ctx[14][/*data*/ ctx[0]].legendDomain;
    			if (dirty & /*data*/ 1) legend_changes.type = /*datasetParams*/ ctx[14][/*data*/ ctx[0]].legendType;
    			if (dirty & /*data*/ 1) legend_changes.linearDomain = /*datasetParams*/ ctx[14][/*data*/ ctx[0]].linearDomain;
    			if (dirty & /*data*/ 1) legend_changes.internalLabels = /*datasetParams*/ ctx[14][/*data*/ ctx[0]].internalLabels;

    			if (!updating_selected && dirty & /*legendElementSelectedIndex*/ 256) {
    				updating_selected = true;
    				legend_changes.selected = /*legendElementSelectedIndex*/ ctx[8];
    				add_flush_callback(() => updating_selected = false);
    			}

    			legend.$set(legend_changes);

    			if (/*isEmbed*/ ctx[6] && /*embed*/ ctx[5] !== "policies") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					if_block1.m(section, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const scrollablex_changes = {};

    			if (dirty & /*$$scope, width, height, data, rerender, cartogramAnnotation*/ 1073757185) {
    				scrollablex_changes.$$scope = { dirty, ctx };
    			}

    			scrollablex.$set(scrollablex_changes);

    			if (/*isEmbed*/ ctx[6] && /*embed*/ ctx[5] === "policies") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$5(ctx);
    					if_block2.c();
    					if_block2.m(section, t5);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!/*isEmbed*/ ctx[6]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*isEmbed*/ 64) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$6(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(section, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*id*/ 2) {
    				attr_dev(section, "id", /*id*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(head_1.$$.fragment, local);
    			transition_in(legend.$$.fragment, local);
    			transition_in(scrollablex.$$.fragment, local);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(head_1.$$.fragment, local);
    			transition_out(legend.$$.fragment, local);
    			transition_out(scrollablex.$$.fragment, local);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			destroy_component(head_1);
    			destroy_component(legend);
    			if (if_block1) if_block1.d();
    			destroy_component(scrollablex);
    			div1_resize_listener();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let legendIsHovered;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CartoWorld', slots, []);
    	
    	
    	let { data } = $$props;
    	let { id } = $$props;
    	let { block } = $$props;
    	let { head } = $$props;
    	let { text } = $$props;
    	let { embed } = $$props;
    	let { isEmbed = false } = $$props;
    	let selectedDisease;
    	var PoliciesStatus;

    	(function (PoliciesStatus) {
    		PoliciesStatus[PoliciesStatus["Yes"] = 1] = "Yes";
    		PoliciesStatus[PoliciesStatus["No"] = 2] = "No";
    		PoliciesStatus[PoliciesStatus["Almost"] = 3] = "Almost";
    		PoliciesStatus[PoliciesStatus["NoData"] = 4] = "NoData";
    	})(PoliciesStatus || (PoliciesStatus = {}));

    	const policiesLookup = createLookup(policies$1, d => d.id, d => d);
    	const diseasesLookup = createLookup(diseases, d => d.id, d => d);
    	const countryNameDictionaryLookup = createLookup(countryNameDictionary, d => d.id, d => d);
    	let legendElementSelectedIndex = null;
    	let clientWidth = 0;
    	let width;
    	let height;
    	let cartogramAnnotation;
    	let rerender;

    	const diseasesHoverText = data => {
    		return `In <b>${data.name}</b>, a <b>${(data[selectedDisease] * 100).toPrecision(2)}% of deaths</b> from <b>${diseasesDictionary[selectedDisease]}</b> are caused by pollution`;
    	};

    	const policiesHoverText = data => {
    		let hasMet = [];
    		let onTrack = [];
    		let noMet = [];
    		let hoverText = "";
    		if (data["ind-1"] === PoliciesStatus.Yes) hasMet.push(`Clean production incentives`); else if (data["ind-1"] === PoliciesStatus.Almost) onTrack.push(`Clean production incentives`); else if (data["ind-1"] === PoliciesStatus.No) noMet.push(`Clean production incentives`);
    		if (data["tra-1"] === PoliciesStatus.Yes) hasMet.push(`Vehicle emissions standards`); else if (data["tra-1"] === PoliciesStatus.Almost) onTrack.push(`Vehicle emissions standards`); else if (data["tra-1"] === PoliciesStatus.No) noMet.push(`Vehicle emissions standards`);
    		if (data["tra-2"] === PoliciesStatus.Yes) hasMet.push(`Fuel Sulphur content`); else if (data["tra-2"] === PoliciesStatus.Almost) onTrack.push(`Fuel Sulphur content`); else if (data["tra-2"] === PoliciesStatus.No) noMet.push(`Fuel Sulphur content`);
    		if (data["waste-1"] === PoliciesStatus.Yes) hasMet.push(`Solid Waste Burning`); else if (data["waste-1"] === PoliciesStatus.Almost) onTrack.push(`Solid Waste Burning`); else if (data["waste-1"] === PoliciesStatus.No) noMet.push(`Solid Waste Burning`);
    		if (data["res-1"] === PoliciesStatus.Yes) hasMet.push(`Incentives for residential cooking and heating`); else if (data["res-1"] === PoliciesStatus.Almost) onTrack.push(`Incentives for residential cooking and heating`); else if (data["res-1"] === PoliciesStatus.No) noMet.push(`Incentives for residential cooking and heating`);
    		if (data["aq-1"] === PoliciesStatus.Yes) hasMet.push(`Air quality standards`); else if (data["aq-1"] === PoliciesStatus.Almost) onTrack.push(`Air quality standards`); else if (data["aq-1"] === PoliciesStatus.No) noMet.push(`Air quality standards`);
    		if (data["agri-1"] === PoliciesStatus.Yes) hasMet.push(`Sustainable agricultural practices`); else if (data["agri-1"] === PoliciesStatus.Almost) onTrack.push(`Sustainable agricultural practices`); else if (data["agri-1"] === PoliciesStatus.No) noMet.push(`Sustainable agricultural practices`);
    		if (data["aqms-1"] === PoliciesStatus.Yes) hasMet.push(`Air quality management strategies`); else if (data["aqms-1"] === PoliciesStatus.Almost) onTrack.push(`Air quality management strategies`); else if (data["aqms-1"] === PoliciesStatus.No) noMet.push(`Air quality management strategies`);
    		if (data["aqm-1"] === PoliciesStatus.Yes) hasMet.push(`Air quality monitoring`); else if (data["aqm-1"] === PoliciesStatus.Almost) onTrack.push(`Air quality monitoring`); else if (data["aqm-1"] === PoliciesStatus.No) noMet.push(`Air quality monitoring`);

    		if (hasMet.length > 0) {
    			hoverText += `<strong>${data.name}</strong> has met <strong>
                    ${hasMet.length === 1 ? "this target" : "these targets"}</strong>: `;

    			hoverText += hasMet.join(", ");

    			if (onTrack.length > 0) {
    				hoverText += `<br>And it's on track to meet <strong>
                      ${onTrack.length === 1 ? "this" : "these"}</strong>: `;

    				hoverText += onTrack.join(", ");
    			}
    		} else if (onTrack.length > 0) {
    			hoverText += `<strong>${data.name}</strong> has on track to met <strong>
                    ${onTrack.length === 1 ? "this target" : "these targets"}</strong>: `;

    			hoverText += onTrack.join(", ");
    		} else if (noMet.length === 0) hoverText += `No data for <strong>${data.name}</strong>`; else {
    			if (noMet.length === 6) hoverText += `<strong>${data.name}</strong> hasn't met any targets`; else {
    				hoverText += `<strong>${data.name}</strong>
                      hasn't met any of the target for which we have data: `;

    				hoverText += noMet.join(", ");
    			}
    		}

    		return hoverText;
    	};

    	const datasetParams = {
    		pm25: {
    			data: pm25data.map(d => {
    				return {
    					name: countryNameDictionaryLookup[d.id].name,
    					short: countryNameDictionaryLookup[d.id].short,
    					code: d.id,
    					x: d.x,
    					y: d.y,
    					value: d.pm25,
    					color: colorPM25(d.pm25)
    				};
    			}),
    			nodeSize: 11,
    			helpText: {
    				code: "JPN",
    				text: () => `<strong>Each square is a country</strong>, sized
         by the annual mean levels of <strong>fine particular
         matter PM<sub>2.5</sub></strong>, measured in µg/m<sup>3</sup>.`
    			},
    			hoverTextFn: d => `In <strong>${d.name}</strong>, people are exposed to an average of
        <strong>${d.value} μg/m<sup>3</sup></strong> a year —
        <strong>${(d.value / 5).toFixed(1)}</strong> times the WHO guideline.`,
    			classesFn: d => {
    				if (!legendIsHovered) {
    					return [];
    				} else {
    					const isSelected = colorPM25.range().indexOf(d.color) === legendElementSelectedIndex;
    					return [isSelected ? "country--shadow" : "country--hide"];
    				}
    			},
    			color: colorPM25,
    			legendTitle: `As a multiple of the <strong>WHO's guideline</strong> (5 µg/m<sup>3</sup>)`,
    			legendDomain: ["x1", "2", "3", "5", "7"],
    			legendType: "sequential",
    			domain: [700, 400],
    			hoverText: d => `In <strong>${d.name}</strong>, people are exposed to an average of
        <strong>${d.value} μg/m<sup>3</sup></strong> a year —
        <strong>${(d.value / 10).toFixed(1)}</strong> times the WHO guideline.`,
    			linearDomain: [0, 9],
    			internalLabels: [
    				{
    					label: "AQG",
    					border: true,
    					icon: "check"
    				},
    				{ label: "IT4" },
    				{ label: "IT3" },
    				{ label: "IT2" },
    				{ label: "IT1" },
    				{ label: "" }
    			]
    		},
    		health: {
    			data: deaths_data.map(d => {
    				return {
    					name: countryNameDictionaryLookup[d.id].name,
    					short: countryNameDictionaryLookup[d.id].short,
    					code: d.id,
    					x: d.x,
    					y: d.y,
    					value: d.deaths,
    					rate: d.rate,
    					color: colorHealth(d.rate)
    				};
    			}),
    			nodeSize: 80,
    			helpText: {
    				code: "GEO",
    				text: () => `<strong>Each square is a country</strong>,
        sized by the total number of <strong>deaths
        caused by fine particle pollution</strong>.`
    			},
    			hoverTextFn: d => `In <strong>${d.name}</strong>, fine particle
      pollution caused <strong>${d.value.toLocaleString("en-US")} deaths</strong>
      in 2019 — or <strong>${d.rate} per 100,000 people</strong>.`,
    			classesFn: d => {
    				if (!legendIsHovered) {
    					return [];
    				} else {
    					const isSelected = colorHealth.range().indexOf(d.color) === legendElementSelectedIndex;
    					return [isSelected ? "country--shadow" : "country--hide"];
    				}
    			},
    			color: colorHealth,
    			legendTitle: `<strong>Deaths per 100,000 people</strong> caused by fine particle pollution`,
    			legendDomain: ["20", "40", "60", "80", "100"],
    			legendType: "sequential",
    			domain: [700, 400],
    			linearDomain: null,
    			internalLabels: null
    		},
    		policies: {
    			data: countries.filter(d => policiesLookup[d.code]).map(d => {
    				return {
    					name: countryNameDictionaryLookup[d.code].name,
    					short: countryNameDictionaryLookup[d.code].short,
    					code: d.code,
    					x: d.x,
    					y: d.y,
    					value: 5,
    					data: policiesLookup[d.code]
    				};
    			}),
    			nodeSize: 16,
    			helpText: {
    				code: "JPN",
    				text: () => `<strong>Each square is a country</strong>,
          colored by the <strong>number of air quality targets met</strong> or on track.`
    			},
    			hoverTextFn: d => policiesHoverText(d.data),
    			colorFn: d => {
    				let policiesData = d.data;
    				const colors = colorPolices.range();

    				const gradients = [
    					{
    						color: colors[0],
    						start: 0,
    						end: policiesData.pYes
    					},
    					{
    						color: colors[1],
    						start: policiesData.pYes,
    						end: policiesData.pAlmost
    					},
    					{
    						color: colors[2],
    						start: policiesData.pAlmost,
    						end: policiesData.pNo
    					},
    					{
    						color: colors[3],
    						start: policiesData.pNo,
    						end: 100
    					}
    				];

    				const gradientStrs = gradients.map((g, i) => {
    					const hide = legendIsHovered && legendElementSelectedIndex !== i;
    					return `${g.color}${hide ? "00" : "ff"} ${g.start}% ${g.end}%`;
    				});

    				return `linear-gradient(to bottom, ${gradientStrs.join(", ")})`;
    			},
    			classesFn: d => {
    				let policiesData = d.data;

    				let policiesCont = [
    					policiesData.pYes,
    					policiesData.pAlmost - policiesData.pYes,
    					policiesData.pNo - policiesData.pAlmost,
    					100 - policiesData.pNo
    				];

    				const hasValue = legendIsHovered && policiesCont[legendElementSelectedIndex] > 0;
    				return hasValue ? ["country--shadow"] : [];
    			},
    			color: colorPolices,
    			legendTitle: `<strong>Actions taken towards cleaner air</strong>`,
    			legendDomain: colorPolices.domain(),
    			legendType: "categorical",
    			domain: [1300, 1300 / (740 / 420)],
    			linearDomain: null,
    			internalLabels: null
    		},
    		diseases: {
    			data: countries.filter(d => diseasesLookup[d.code]).map(d => {
    				return {
    					name: countryNameDictionaryLookup[d.code].name,
    					short: countryNameDictionaryLookup[d.code].short,
    					code: d.code,
    					x: d.x,
    					y: d.y,
    					value: 5,
    					data: diseasesLookup[d.code]
    				};
    			}),
    			nodeSize: 16,
    			helpText: {
    				code: "JPN",
    				text: () => `<strong>Each square is a country</strong>, representing the <strong>percentage of deaths</strong> due the pollution from <b>${diseasesDictionary[selectedDisease]}</b>`
    			},
    			hoverTextFn: d => diseasesHoverText(d.data),
    			colorFn: d => {
    				let diseaseData = d.data;
    				const colors = colorDiseases.range();
    				let currentColor = null;
    				let i = 0;
    				const domain = colorDiseases.domain();

    				while (i < domain.length && currentColor === null) {
    					if (diseaseData[selectedDisease] * 100 <= domain[i] && !currentColor) {
    						currentColor = colors[i];
    					}

    					i++;
    				}

    				if (currentColor === null) currentColor = colors[colors.length - 1];

    				const gradients = [
    					{
    						color: currentColor,
    						start: 0,
    						end: diseaseData[selectedDisease] * 100 * 2
    					},
    					{
    						color: '#D9D9D9',
    						start: diseaseData[selectedDisease] * 100 * 2,
    						end: 100
    					}
    				];

    				const gradientStrs = gradients.map((g, i) => {
    					const hide = legendIsHovered && colorDiseases.range().indexOf(currentColor) !== legendElementSelectedIndex;
    					return `${g.color}${hide ? "50" : "ff"} ${g.start}% ${g.end}%`;
    				});

    				return `linear-gradient(to bottom, ${gradientStrs.join(", ")})`;
    			},
    			classesFn: d => {
    				if (!legendIsHovered) {
    					return [];
    				} else {
    					const diseaseData = d.data;
    					const domain = colorDiseases.domain();
    					let selectedRange = null;

    					if (legendElementSelectedIndex === 0) selectedRange = [0, domain[legendElementSelectedIndex]]; else if (legendElementSelectedIndex < domain.length) selectedRange = [
    						domain[legendElementSelectedIndex - 1],
    						domain[legendElementSelectedIndex]
    					]; else selectedRange = [domain[legendElementSelectedIndex - 1], 100];

    					const isSelected = diseaseData[selectedDisease] * 100 >= selectedRange[0] && diseaseData[selectedDisease] * 100 <= selectedRange[1];
    					return [isSelected ? "country--shadow" : ""];
    				}
    			},
    			color: colorDiseases,
    			legendTitle: `<strong>Percent of deaths</strong> from the disease that can be attributed to fine particles`,
    			legendDomain: colorDiseases.domain().map(e => e + '%'),
    			legendType: "sequential",
    			domain: [1300, 1300 / (740 / 420)],
    			linearDomain: null,
    			internalLabels: null
    		}
    	};

    	const writable_props = ['data', 'id', 'block', 'head', 'text', 'embed', 'isEmbed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CartoWorld> was created with unknown prop '${key}'`);
    	});

    	function head_1_selectedElement_binding(value) {
    		selectedDisease = value;
    		$$invalidate(7, selectedDisease);
    	}

    	function legend_selected_binding(value) {
    		legendElementSelectedIndex = value;
    		$$invalidate(8, legendElementSelectedIndex);
    	}

    	function cartogram_rerenderFn_binding(value) {
    		rerender = value;
    		$$invalidate(11, rerender);
    	}

    	function cartogram_annotationShowing_binding(value) {
    		cartogramAnnotation = value;
    		$$invalidate(13, cartogramAnnotation);
    	}

    	function div1_elementresize_handler() {
    		clientWidth = this.clientWidth;
    		$$invalidate(9, clientWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('block' in $$props) $$invalidate(2, block = $$props.block);
    		if ('head' in $$props) $$invalidate(3, head = $$props.head);
    		if ('text' in $$props) $$invalidate(4, text = $$props.text);
    		if ('embed' in $$props) $$invalidate(5, embed = $$props.embed);
    		if ('isEmbed' in $$props) $$invalidate(6, isEmbed = $$props.isEmbed);
    	};

    	$$self.$capture_state = () => ({
    		Cartogram,
    		pm25data,
    		countries,
    		policies: policies$1,
    		diseases,
    		countryNameDictionary,
    		deaths_data,
    		Legend,
    		colorPM25,
    		colorHealth,
    		colorPolices,
    		colorDiseases,
    		createLookup,
    		ScrollableX,
    		EmbedFooter,
    		SectionTitle,
    		Head,
    		diseasesDictionary,
    		data,
    		id,
    		block,
    		head,
    		text,
    		embed,
    		isEmbed,
    		selectedDisease,
    		PoliciesStatus,
    		policiesLookup,
    		diseasesLookup,
    		countryNameDictionaryLookup,
    		legendElementSelectedIndex,
    		clientWidth,
    		width,
    		height,
    		cartogramAnnotation,
    		rerender,
    		diseasesHoverText,
    		policiesHoverText,
    		datasetParams,
    		legendIsHovered
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('block' in $$props) $$invalidate(2, block = $$props.block);
    		if ('head' in $$props) $$invalidate(3, head = $$props.head);
    		if ('text' in $$props) $$invalidate(4, text = $$props.text);
    		if ('embed' in $$props) $$invalidate(5, embed = $$props.embed);
    		if ('isEmbed' in $$props) $$invalidate(6, isEmbed = $$props.isEmbed);
    		if ('selectedDisease' in $$props) $$invalidate(7, selectedDisease = $$props.selectedDisease);
    		if ('PoliciesStatus' in $$props) PoliciesStatus = $$props.PoliciesStatus;
    		if ('legendElementSelectedIndex' in $$props) $$invalidate(8, legendElementSelectedIndex = $$props.legendElementSelectedIndex);
    		if ('clientWidth' in $$props) $$invalidate(9, clientWidth = $$props.clientWidth);
    		if ('width' in $$props) $$invalidate(10, width = $$props.width);
    		if ('height' in $$props) $$invalidate(12, height = $$props.height);
    		if ('cartogramAnnotation' in $$props) $$invalidate(13, cartogramAnnotation = $$props.cartogramAnnotation);
    		if ('rerender' in $$props) $$invalidate(11, rerender = $$props.rerender);
    		if ('legendIsHovered' in $$props) legendIsHovered = $$props.legendIsHovered;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*legendElementSelectedIndex*/ 256) {
    			legendIsHovered = legendElementSelectedIndex !== null;
    		}

    		if ($$self.$$.dirty & /*legendElementSelectedIndex, selectedDisease, rerender*/ 2432) {
    			// re-render hack (as Cartogram component doesn't know when then result of our funcs change)
    			(legendElementSelectedIndex !== undefined || selectedDisease) && rerender && rerender();
    		}

    		if ($$self.$$.dirty & /*clientWidth*/ 512) {
    			{
    				$$invalidate(10, width = Math.max(clientWidth, 700));
    			}
    		}

    		if ($$self.$$.dirty & /*width, data*/ 1025) {
    			$$invalidate(12, height = width * (data === "pm25" ? 0.55 : 0.62));
    		}
    	};

    	return [
    		data,
    		id,
    		block,
    		head,
    		text,
    		embed,
    		isEmbed,
    		selectedDisease,
    		legendElementSelectedIndex,
    		clientWidth,
    		width,
    		rerender,
    		height,
    		cartogramAnnotation,
    		datasetParams,
    		head_1_selectedElement_binding,
    		legend_selected_binding,
    		cartogram_rerenderFn_binding,
    		cartogram_annotationShowing_binding,
    		div1_elementresize_handler
    	];
    }

    class CartoWorld extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			data: 0,
    			id: 1,
    			block: 2,
    			head: 3,
    			text: 4,
    			embed: 5,
    			isEmbed: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CartoWorld",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<CartoWorld> was created without expected prop 'data'");
    		}

    		if (/*id*/ ctx[1] === undefined && !('id' in props)) {
    			console.warn("<CartoWorld> was created without expected prop 'id'");
    		}

    		if (/*block*/ ctx[2] === undefined && !('block' in props)) {
    			console.warn("<CartoWorld> was created without expected prop 'block'");
    		}

    		if (/*head*/ ctx[3] === undefined && !('head' in props)) {
    			console.warn("<CartoWorld> was created without expected prop 'head'");
    		}

    		if (/*text*/ ctx[4] === undefined && !('text' in props)) {
    			console.warn("<CartoWorld> was created without expected prop 'text'");
    		}

    		if (/*embed*/ ctx[5] === undefined && !('embed' in props)) {
    			console.warn("<CartoWorld> was created without expected prop 'embed'");
    		}
    	}

    	get data() {
    		throw new Error("<CartoWorld>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<CartoWorld>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<CartoWorld>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<CartoWorld>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<CartoWorld>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<CartoWorld>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get head() {
    		throw new Error("<CartoWorld>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set head(value) {
    		throw new Error("<CartoWorld>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<CartoWorld>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<CartoWorld>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get embed() {
    		throw new Error("<CartoWorld>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set embed(value) {
    		throw new Error("<CartoWorld>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isEmbed() {
    		throw new Error("<CartoWorld>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEmbed(value) {
    		throw new Error("<CartoWorld>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/charts/TreemapSVG.svelte generated by Svelte v3.42.3 */
    const file$b = "src/components/charts/TreemapSVG.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    // (115:0) {:else}
    function create_else_block$3(ctx) {
    	let annotation;
    	let current;

    	annotation = new Annotation({
    			props: {
    				x: /*currentRegion*/ ctx[10].x + /*currentLeaf*/ ctx[11].x0 + (/*currentLeaf*/ ctx[11].x1 - /*currentLeaf*/ ctx[11].x0) / 2,
    				y: /*currentRegion*/ ctx[10].y + /*currentLeaf*/ ctx[11].y0 + (/*currentLeaf*/ ctx[11].y1 - /*currentLeaf*/ ctx[11].y0) / 2,
    				text: /*showConcreteType*/ ctx[9]
    				? /*showCurrentLeaf*/ ctx[16](/*currentLeaf*/ ctx[11].data.type, /*currentLeaf*/ ctx[11].data.value)
    				: /*showHoverText*/ ctx[15](),
    				radius: {
    					x: (/*currentLeaf*/ ctx[11].x1 - /*currentLeaf*/ ctx[11].x0) / 2,
    					y: (/*currentLeaf*/ ctx[11].y1 - /*currentLeaf*/ ctx[11].y0) / 2
    				},
    				topClamp: /*pxAboveScreenTop*/ ctx[13],
    				forceTopWherePossible: true,
    				canvasWidth: /*width*/ ctx[1],
    				canvasHeight: /*height*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(annotation.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(annotation, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const annotation_changes = {};
    			if (dirty[0] & /*currentRegion, currentLeaf*/ 3072) annotation_changes.x = /*currentRegion*/ ctx[10].x + /*currentLeaf*/ ctx[11].x0 + (/*currentLeaf*/ ctx[11].x1 - /*currentLeaf*/ ctx[11].x0) / 2;
    			if (dirty[0] & /*currentRegion, currentLeaf*/ 3072) annotation_changes.y = /*currentRegion*/ ctx[10].y + /*currentLeaf*/ ctx[11].y0 + (/*currentLeaf*/ ctx[11].y1 - /*currentLeaf*/ ctx[11].y0) / 2;

    			if (dirty[0] & /*showConcreteType, currentLeaf*/ 2560) annotation_changes.text = /*showConcreteType*/ ctx[9]
    			? /*showCurrentLeaf*/ ctx[16](/*currentLeaf*/ ctx[11].data.type, /*currentLeaf*/ ctx[11].data.value)
    			: /*showHoverText*/ ctx[15]();

    			if (dirty[0] & /*currentLeaf*/ 2048) annotation_changes.radius = {
    				x: (/*currentLeaf*/ ctx[11].x1 - /*currentLeaf*/ ctx[11].x0) / 2,
    				y: (/*currentLeaf*/ ctx[11].y1 - /*currentLeaf*/ ctx[11].y0) / 2
    			};

    			if (dirty[0] & /*pxAboveScreenTop*/ 8192) annotation_changes.topClamp = /*pxAboveScreenTop*/ ctx[13];
    			if (dirty[0] & /*width*/ 2) annotation_changes.canvasWidth = /*width*/ ctx[1];
    			if (dirty[0] & /*height*/ 4) annotation_changes.canvasHeight = /*height*/ ctx[2];
    			annotation.$set(annotation_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(annotation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(annotation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(annotation, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(115:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:0) {#if showInformation}
    function create_if_block_1$4(ctx) {
    	let annotation;
    	let current;

    	annotation = new Annotation({
    			props: {
    				x: /*referenceRegion*/ ctx[8].x,
    				y: /*referenceRegion*/ ctx[8].y,
    				text: /*source*/ ctx[3],
    				radius: 2,
    				forceTopWherePossible: true,
    				canvasWidth: /*width*/ ctx[1],
    				canvasHeight: /*height*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(annotation.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(annotation, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const annotation_changes = {};
    			if (dirty[0] & /*referenceRegion*/ 256) annotation_changes.x = /*referenceRegion*/ ctx[8].x;
    			if (dirty[0] & /*referenceRegion*/ 256) annotation_changes.y = /*referenceRegion*/ ctx[8].y;
    			if (dirty[0] & /*source*/ 8) annotation_changes.text = /*source*/ ctx[3];
    			if (dirty[0] & /*width*/ 2) annotation_changes.canvasWidth = /*width*/ ctx[1];
    			if (dirty[0] & /*height*/ 4) annotation_changes.canvasHeight = /*height*/ ctx[2];
    			annotation.$set(annotation_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(annotation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(annotation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(annotation, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(105:0) {#if showInformation}",
    		ctx
    	});

    	return block;
    }

    // (131:2) {#if showRegionName}
    function create_if_block$5(ctx) {
    	let div;
    	let current;
    	let each_value_2 = /*regions*/ ctx[6];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "text");
    			add_location(div, file$b, 132, 2, 4759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*regions, width, height*/ 70) {
    				each_value_2 = /*regions*/ ctx[6];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(131:2) {#if showRegionName}",
    		ctx
    	});

    	return block;
    }

    // (134:4) {#each regions as region}
    function create_each_block_2(ctx) {
    	let annotation;
    	let current;

    	annotation = new Annotation({
    			props: {
    				x: /*region*/ ctx[30].nameX,
    				y: /*region*/ ctx[30].nameY,
    				text: /*region*/ ctx[30].region.replace('+', 'and'),
    				radius: 2,
    				justText: true,
    				canvasWidth: /*width*/ ctx[1],
    				canvasHeight: /*height*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(annotation.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(annotation, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const annotation_changes = {};
    			if (dirty[0] & /*regions*/ 64) annotation_changes.x = /*region*/ ctx[30].nameX;
    			if (dirty[0] & /*regions*/ 64) annotation_changes.y = /*region*/ ctx[30].nameY;
    			if (dirty[0] & /*regions*/ 64) annotation_changes.text = /*region*/ ctx[30].region.replace('+', 'and');
    			if (dirty[0] & /*width*/ 2) annotation_changes.canvasWidth = /*width*/ ctx[1];
    			if (dirty[0] & /*height*/ 4) annotation_changes.canvasHeight = /*height*/ ctx[2];
    			annotation.$set(annotation_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(annotation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(annotation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(annotation, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(134:4) {#each regions as region}",
    		ctx
    	});

    	return block;
    }

    // (178:10) {#each region.leaves as leaf}
    function create_each_block_1$2(ctx) {
    	let rect;
    	let rect_class_value;
    	let rect_fill_value;
    	let rect_width_value;
    	let rect_height_value;
    	let rect_x_value;
    	let rect_y_value;
    	let mounted;
    	let dispose;

    	function mouseenter_handler_1() {
    		return /*mouseenter_handler_1*/ ctx[24](/*region*/ ctx[30], /*leaf*/ ctx[33]);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[25](/*region*/ ctx[30], /*leaf*/ ctx[33]);
    	}

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "class", rect_class_value = "tile leaf " + /*leaf*/ ctx[33].data.type + " svelte-ia43ea");

    			attr_dev(rect, "fill", rect_fill_value = /*data*/ ctx[0].type === "sectors"
    			? colorSectors(/*leaf*/ ctx[33].data.type)
    			: colorFuels(/*leaf*/ ctx[33].data.type));

    			attr_dev(rect, "width", rect_width_value = /*leaf*/ ctx[33].x1 - /*leaf*/ ctx[33].x0);
    			attr_dev(rect, "height", rect_height_value = /*leaf*/ ctx[33].y1 - /*leaf*/ ctx[33].y0);
    			attr_dev(rect, "x", rect_x_value = /*region*/ ctx[30].x + /*leaf*/ ctx[33].x0);
    			attr_dev(rect, "y", rect_y_value = /*region*/ ctx[30].y + /*leaf*/ ctx[33].y0);
    			attr_dev(rect, "rx", "2");
    			attr_dev(rect, "ry", "2");
    			toggle_class(rect, "leaf--shadow", /*legendElementSelected*/ ctx[5] === /*leaf*/ ctx[33].data.type);
    			toggle_class(rect, "leaf--hide", /*legendElementSelected*/ ctx[5] !== /*leaf*/ ctx[33].data.type && /*legendElementSelected*/ ctx[5] !== "null");
    			add_location(rect, file$b, 178, 10, 6478);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(rect, "mouseenter", mouseenter_handler_1, false, false, false),
    					listen_dev(rect, "focus", focus_handler, false, false, false),
    					listen_dev(rect, "mouseout", /*mouseout_handler_1*/ ctx[26], false, false, false),
    					listen_dev(rect, "blur", /*blur_handler_1*/ ctx[27], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*regions*/ 64 && rect_class_value !== (rect_class_value = "tile leaf " + /*leaf*/ ctx[33].data.type + " svelte-ia43ea")) {
    				attr_dev(rect, "class", rect_class_value);
    			}

    			if (dirty[0] & /*data, regions*/ 65 && rect_fill_value !== (rect_fill_value = /*data*/ ctx[0].type === "sectors"
    			? colorSectors(/*leaf*/ ctx[33].data.type)
    			: colorFuels(/*leaf*/ ctx[33].data.type))) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}

    			if (dirty[0] & /*regions*/ 64 && rect_width_value !== (rect_width_value = /*leaf*/ ctx[33].x1 - /*leaf*/ ctx[33].x0)) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty[0] & /*regions*/ 64 && rect_height_value !== (rect_height_value = /*leaf*/ ctx[33].y1 - /*leaf*/ ctx[33].y0)) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty[0] & /*regions*/ 64 && rect_x_value !== (rect_x_value = /*region*/ ctx[30].x + /*leaf*/ ctx[33].x0)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*regions*/ 64 && rect_y_value !== (rect_y_value = /*region*/ ctx[30].y + /*leaf*/ ctx[33].y0)) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty[0] & /*regions, legendElementSelected, regions*/ 96) {
    				toggle_class(rect, "leaf--shadow", /*legendElementSelected*/ ctx[5] === /*leaf*/ ctx[33].data.type);
    			}

    			if (dirty[0] & /*regions, legendElementSelected, regions*/ 96) {
    				toggle_class(rect, "leaf--hide", /*legendElementSelected*/ ctx[5] !== /*leaf*/ ctx[33].data.type && /*legendElementSelected*/ ctx[5] !== "null");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(178:10) {#each region.leaves as leaf}",
    		ctx
    	});

    	return block;
    }

    // (158:4) {#each regions as region}
    function create_each_block$7(ctx) {
    	let g1;
    	let rect;
    	let rect_id_value;
    	let rect_width_value;
    	let rect_height_value;
    	let rect_x_value;
    	let rect_y_value;
    	let g0;
    	let g0_id_value;
    	let g1_id_value;
    	let mounted;
    	let dispose;

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[21](/*region*/ ctx[30]);
    	}

    	let each_value_1 = /*region*/ ctx[30].leaves;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			g1 = svg_element("g");
    			rect = svg_element("rect");
    			g0 = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(rect, "id", rect_id_value = /*region*/ ctx[30].region.replace(/\s/g, '').replace('+', '-') + "-background");
    			attr_dev(rect, "class", "tile");
    			attr_dev(rect, "width", rect_width_value = /*region*/ ctx[30].width);
    			attr_dev(rect, "height", rect_height_value = /*region*/ ctx[30].height);
    			attr_dev(rect, "x", rect_x_value = /*region*/ ctx[30].x - /*region*/ ctx[30].background.borderRight);
    			attr_dev(rect, "y", rect_y_value = /*region*/ ctx[30].y - /*region*/ ctx[30].background.borderBottom);
    			attr_dev(rect, "rx", "2");
    			attr_dev(rect, "ry", "2");
    			attr_dev(rect, "filter", "none");
    			set_style(rect, "fill", /*region*/ ctx[30].background.color);
    			add_location(rect, file$b, 160, 8, 5722);
    			attr_dev(g0, "id", g0_id_value = /*region*/ ctx[30].region.replace(/\s/g, '').replace('+', '-') + "-elements");
    			add_location(g0, file$b, 176, 8, 6355);
    			attr_dev(g1, "id", g1_id_value = /*region*/ ctx[30].region.replace(/\s/g, '').replace('+', '-') + "-group");
    			attr_dev(g1, "class", "region svelte-ia43ea");
    			add_location(g1, file$b, 159, 6, 5629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g1, anchor);
    			append_dev(g1, rect);
    			append_dev(g1, g0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g0, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(rect, "mouseenter", mouseenter_handler, false, false, false),
    					listen_dev(rect, "mouseout", /*mouseout_handler*/ ctx[22], false, false, false),
    					listen_dev(rect, "blur", /*blur_handler*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*regions*/ 64 && rect_id_value !== (rect_id_value = /*region*/ ctx[30].region.replace(/\s/g, '').replace('+', '-') + "-background")) {
    				attr_dev(rect, "id", rect_id_value);
    			}

    			if (dirty[0] & /*regions*/ 64 && rect_width_value !== (rect_width_value = /*region*/ ctx[30].width)) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty[0] & /*regions*/ 64 && rect_height_value !== (rect_height_value = /*region*/ ctx[30].height)) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty[0] & /*regions*/ 64 && rect_x_value !== (rect_x_value = /*region*/ ctx[30].x - /*region*/ ctx[30].background.borderRight)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*regions*/ 64 && rect_y_value !== (rect_y_value = /*region*/ ctx[30].y - /*region*/ ctx[30].background.borderBottom)) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty[0] & /*regions*/ 64) {
    				set_style(rect, "fill", /*region*/ ctx[30].background.color);
    			}

    			if (dirty[0] & /*regions, data, legendElementSelected, updateInformation, showInformation, showConcreteType*/ 17121) {
    				each_value_1 = /*region*/ ctx[30].leaves;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty[0] & /*regions*/ 64 && g0_id_value !== (g0_id_value = /*region*/ ctx[30].region.replace(/\s/g, '').replace('+', '-') + "-elements")) {
    				attr_dev(g0, "id", g0_id_value);
    			}

    			if (dirty[0] & /*regions*/ 64 && g1_id_value !== (g1_id_value = /*region*/ ctx[30].region.replace(/\s/g, '').replace('+', '-') + "-group")) {
    				attr_dev(g1, "id", g1_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(158:4) {#each regions as region}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let t1;
    	let div1;
    	let svg;
    	let filter;
    	let feDropShadow;
    	let defs;
    	let pattern;
    	let rect0;
    	let rect1;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$4, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*showInformation*/ ctx[7]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*showRegionName*/ ctx[4] && create_if_block$5(ctx);
    	let each_value = /*regions*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			svg = svg_element("svg");
    			filter = svg_element("filter");
    			feDropShadow = svg_element("feDropShadow");
    			defs = svg_element("defs");
    			pattern = svg_element("pattern");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "text");
    			add_location(div0, file$b, 103, 0, 3950);
    			attr_dev(feDropShadow, "dx", "0");
    			attr_dev(feDropShadow, "dy", "0");
    			attr_dev(feDropShadow, "stdDeviation", "4");
    			attr_dev(feDropShadow, "flood-opacity", "0.4");
    			add_location(feDropShadow, file$b, 149, 6, 5167);
    			attr_dev(filter, "id", "shadow");
    			attr_dev(filter, "x", "-10%");
    			add_location(filter, file$b, 148, 4, 5131);
    			attr_dev(rect0, "width", "4");
    			attr_dev(rect0, "height", "4");
    			attr_dev(rect0, "transform", "translate(0,0)");
    			attr_dev(rect0, "fill", "#faba26");
    			add_location(rect0, file$b, 153, 8, 5399);
    			attr_dev(rect1, "width", "2.4");
    			attr_dev(rect1, "height", "4");
    			attr_dev(rect1, "transform", "translate(0,0)");
    			attr_dev(rect1, "fill", "#f9f9f9");
    			add_location(rect1, file$b, 154, 8, 5484);
    			attr_dev(pattern, "id", "hash--windblown");
    			attr_dev(pattern, "width", "4");
    			attr_dev(pattern, "height", "4");
    			attr_dev(pattern, "patternUnits", "userSpaceOnUse");
    			attr_dev(pattern, "patternTransform", "rotate(45)");
    			add_location(pattern, file$b, 152, 6, 5279);
    			add_location(defs, file$b, 151, 4, 5266);
    			attr_dev(svg, "id", "treemapCartogram");
    			attr_dev(svg, "width", /*width*/ ctx[1]);
    			attr_dev(svg, "height", /*height*/ ctx[2]);
    			add_location(svg, file$b, 147, 2, 5082);
    			attr_dev(div1, "class", "svg");
    			attr_dev(div1, "width", /*width*/ ctx[1]);
    			attr_dev(div1, "height", /*height*/ ctx[2]);
    			add_location(div1, file$b, 146, 0, 5045);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if_blocks[current_block_type_index].m(div0, null);
    			/*div0_binding*/ ctx[20](div0);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, svg);
    			append_dev(svg, filter);
    			append_dev(filter, feDropShadow);
    			append_dev(svg, defs);
    			append_dev(defs, pattern);
    			append_dev(pattern, rect0);
    			append_dev(pattern, rect1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "scroll", /*onWindowScroll*/ ctx[17], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			if (/*showRegionName*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*showRegionName*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*regions, data, legendElementSelected, updateInformation, showInformation, showConcreteType, currentRegion, currentLeaf*/ 20193) {
    				each_value = /*regions*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty[0] & /*width*/ 2) {
    				attr_dev(svg, "width", /*width*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*height*/ 4) {
    				attr_dev(svg, "height", /*height*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*width*/ 2) {
    				attr_dev(div1, "width", /*width*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*height*/ 4) {
    				attr_dev(div1, "height", /*height*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_blocks[current_block_type_index].d();
    			/*div0_binding*/ ctx[20](null);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }



    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TreemapSVG', slots, []);
    	
    	let { data } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { source } = $$props;
    	let { showRegionName = true } = $$props;
    	let { legendElementSelected = "" } = $$props;
    	let { annotationShowing = false } = $$props;
    	let { labels } = $$props;
    	let referenceRegion;
    	const mapPropotions = val => Math.sqrt(val) * width * 0.03;
    	let regions;
    	let showInformation = true;
    	let showConcreteType = false;
    	let currentRegion;
    	let currentLeaf;

    	let updateInformation = (cregion, leaf) => {
    		$$invalidate(10, currentRegion = cregion);
    		$$invalidate(9, showConcreteType = leaf.data.type !== cregion.mostPollutingType);
    		$$invalidate(11, currentLeaf = leaf);
    		$$invalidate(7, showInformation = false);
    	};

    	let showHoverText = () => {
    		return `The largest contributing sector in <strong>${currentRegion.region.replace('+', 'and')}</strong>
      is <strong>${labels[currentRegion.mostPollutingType]}</strong>
      — <strong>${currentRegion.mostPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>
      of the total <strong>${currentRegion.totalPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>.`;
    	};

    	let showHoverTextAfter = () => {
    		return `The largest contributing sector is <strong>${labels[currentRegion.mostPollutingType]}</strong>
      — <strong>${currentRegion.mostPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>
      of the total <strong>${currentRegion.totalPollutingValue.toFixed(2)}</strong> µg/m<sup>3</sup>.`;
    	};

    	let showCurrentLeaf = (currentType, currentValue) => {
    		return `<strong>${labels[currentType]}</strong> accounts for
       <strong>${currentValue.toFixed(2)}</strong>
       µg/m<sup>3</sup> in <strong>${currentRegion.region.replace('+', 'and')}</strong>. 
       ${showHoverTextAfter()}`;
    	};

    	let containerEl;
    	let pxAboveScreenTop = 0;

    	const onWindowScroll = () => {
    		const top = containerEl.getBoundingClientRect().top - 50;
    		$$invalidate(13, pxAboveScreenTop = top < 0 ? Math.abs(top) : 0);
    	};

    	const writable_props = [
    		'data',
    		'width',
    		'height',
    		'source',
    		'showRegionName',
    		'legendElementSelected',
    		'annotationShowing',
    		'labels'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TreemapSVG> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerEl = $$value;
    			$$invalidate(12, containerEl);
    		});
    	}

    	const mouseenter_handler = region => {
    		$$invalidate(7, showInformation = false);
    		$$invalidate(10, currentRegion = region);
    		$$invalidate(11, currentLeaf = region.leaves[0]);
    	};

    	const mouseout_handler = () => {
    		$$invalidate(7, showInformation = true);
    	};

    	const blur_handler = () => {
    		$$invalidate(7, showInformation = true);
    	};

    	const mouseenter_handler_1 = (region, leaf) => {
    		updateInformation(region, leaf);
    	};

    	const focus_handler = (region, leaf) => {
    		updateInformation(region, leaf);
    	};

    	const mouseout_handler_1 = () => {
    		$$invalidate(7, showInformation = true);
    		$$invalidate(9, showConcreteType = false);
    	};

    	const blur_handler_1 = () => {
    		$$invalidate(7, showInformation = true);
    		$$invalidate(9, showConcreteType = false);
    	};

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('source' in $$props) $$invalidate(3, source = $$props.source);
    		if ('showRegionName' in $$props) $$invalidate(4, showRegionName = $$props.showRegionName);
    		if ('legendElementSelected' in $$props) $$invalidate(5, legendElementSelected = $$props.legendElementSelected);
    		if ('annotationShowing' in $$props) $$invalidate(18, annotationShowing = $$props.annotationShowing);
    		if ('labels' in $$props) $$invalidate(19, labels = $$props.labels);
    	};

    	$$self.$capture_state = () => ({
    		Annotation,
    		d3,
    		colorSectors,
    		colorFuels,
    		data,
    		width,
    		height,
    		source,
    		showRegionName,
    		legendElementSelected,
    		annotationShowing,
    		labels,
    		referenceRegion,
    		mapPropotions,
    		regions,
    		showInformation,
    		showConcreteType,
    		currentRegion,
    		currentLeaf,
    		updateInformation,
    		showHoverText,
    		showHoverTextAfter,
    		showCurrentLeaf,
    		containerEl,
    		pxAboveScreenTop,
    		onWindowScroll
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('source' in $$props) $$invalidate(3, source = $$props.source);
    		if ('showRegionName' in $$props) $$invalidate(4, showRegionName = $$props.showRegionName);
    		if ('legendElementSelected' in $$props) $$invalidate(5, legendElementSelected = $$props.legendElementSelected);
    		if ('annotationShowing' in $$props) $$invalidate(18, annotationShowing = $$props.annotationShowing);
    		if ('labels' in $$props) $$invalidate(19, labels = $$props.labels);
    		if ('referenceRegion' in $$props) $$invalidate(8, referenceRegion = $$props.referenceRegion);
    		if ('regions' in $$props) $$invalidate(6, regions = $$props.regions);
    		if ('showInformation' in $$props) $$invalidate(7, showInformation = $$props.showInformation);
    		if ('showConcreteType' in $$props) $$invalidate(9, showConcreteType = $$props.showConcreteType);
    		if ('currentRegion' in $$props) $$invalidate(10, currentRegion = $$props.currentRegion);
    		if ('currentLeaf' in $$props) $$invalidate(11, currentLeaf = $$props.currentLeaf);
    		if ('updateInformation' in $$props) $$invalidate(14, updateInformation = $$props.updateInformation);
    		if ('showHoverText' in $$props) $$invalidate(15, showHoverText = $$props.showHoverText);
    		if ('showHoverTextAfter' in $$props) showHoverTextAfter = $$props.showHoverTextAfter;
    		if ('showCurrentLeaf' in $$props) $$invalidate(16, showCurrentLeaf = $$props.showCurrentLeaf);
    		if ('containerEl' in $$props) $$invalidate(12, containerEl = $$props.containerEl);
    		if ('pxAboveScreenTop' in $$props) $$invalidate(13, pxAboveScreenTop = $$props.pxAboveScreenTop);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data, width, height, regions*/ 71) {
    			{
    				$$invalidate(6, regions = data.regions.map(region => {
    					const convertX = val => width * val / data.scale_width;
    					const convertY = val => height * val / data.scale_height;
    					const hierarchy$1 = hierarchy(region, node => node.types).sum(node => node.value || 0).sort((a, b) => b.value - a.value);
    					const treemap = index().size([mapPropotions(region.totalValue), mapPropotions(region.totalValue)]).padding(2)(hierarchy$1);

    					const background = {
    						borderTop: 2,
    						borderBottom: 2,
    						borderLeft: 2,
    						borderRight: 2,
    						color: "#f9f9f9"
    					};

    					return {
    						leaves: treemap.leaves(),
    						background,
    						x: convertX(region.posX),
    						y: convertY(region.posY),
    						width: mapPropotions(treemap.value) + background.borderRight + background.borderLeft,
    						height: mapPropotions(treemap.value) + background.borderBottom + background.borderTop,
    						totalPollutingValue: treemap.value,
    						mostPollutingValue: treemap.children[0].data.value,
    						mostPollutingType: treemap.children[0].data.type,
    						numCountries: region.numCountries,
    						region: region.region,
    						nameX: convertX(region.posX),
    						nameY: region.region === "Latin America + Caribbean"
    						? convertX(region.posY) + mapPropotions(treemap.value) + background.borderRight + background.borderLeft + 5
    						: convertX(region.posY) - 25
    					};
    				}));

    				$$invalidate(8, referenceRegion = {
    					x: regions[5].x + regions[5].width / 2,
    					y: regions[5].y
    				});
    			}
    		}

    		if ($$self.$$.dirty[0] & /*showInformation*/ 128) {
    			$$invalidate(18, annotationShowing = !showInformation);
    		}
    	};

    	return [
    		data,
    		width,
    		height,
    		source,
    		showRegionName,
    		legendElementSelected,
    		regions,
    		showInformation,
    		referenceRegion,
    		showConcreteType,
    		currentRegion,
    		currentLeaf,
    		containerEl,
    		pxAboveScreenTop,
    		updateInformation,
    		showHoverText,
    		showCurrentLeaf,
    		onWindowScroll,
    		annotationShowing,
    		labels,
    		div0_binding,
    		mouseenter_handler,
    		mouseout_handler,
    		blur_handler,
    		mouseenter_handler_1,
    		focus_handler,
    		mouseout_handler_1,
    		blur_handler_1
    	];
    }

    class TreemapSVG extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(
    			this,
    			options,
    			instance$b,
    			create_fragment$b,
    			safe_not_equal,
    			{
    				data: 0,
    				width: 1,
    				height: 2,
    				source: 3,
    				showRegionName: 4,
    				legendElementSelected: 5,
    				annotationShowing: 18,
    				labels: 19
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TreemapSVG",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<TreemapSVG> was created without expected prop 'data'");
    		}

    		if (/*width*/ ctx[1] === undefined && !('width' in props)) {
    			console.warn("<TreemapSVG> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[2] === undefined && !('height' in props)) {
    			console.warn("<TreemapSVG> was created without expected prop 'height'");
    		}

    		if (/*source*/ ctx[3] === undefined && !('source' in props)) {
    			console.warn("<TreemapSVG> was created without expected prop 'source'");
    		}

    		if (/*labels*/ ctx[19] === undefined && !('labels' in props)) {
    			console.warn("<TreemapSVG> was created without expected prop 'labels'");
    		}
    	}

    	get data() {
    		throw new Error("<TreemapSVG>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<TreemapSVG>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<TreemapSVG>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<TreemapSVG>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<TreemapSVG>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<TreemapSVG>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get source() {
    		throw new Error("<TreemapSVG>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<TreemapSVG>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showRegionName() {
    		throw new Error("<TreemapSVG>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showRegionName(value) {
    		throw new Error("<TreemapSVG>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legendElementSelected() {
    		throw new Error("<TreemapSVG>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legendElementSelected(value) {
    		throw new Error("<TreemapSVG>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get annotationShowing() {
    		throw new Error("<TreemapSVG>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set annotationShowing(value) {
    		throw new Error("<TreemapSVG>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labels() {
    		throw new Error("<TreemapSVG>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labels(value) {
    		throw new Error("<TreemapSVG>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var regions$1 = [
    	{
    		region: "Africa",
    		types: [
    			{
    				type: "waste",
    				value: 0.8221828842337516
    			},
    			{
    				type: "windblowndust",
    				value: 22.572239162884863
    			},
    			{
    				type: "solvents",
    				value: -0.01160406525303405
    			},
    			{
    				type: "intlshipping",
    				value: 0.31691640974714613
    			},
    			{
    				type: "transport",
    				value: 1.5393824290751514
    			},
    			{
    				type: "residential",
    				value: 4.255109959983599
    			},
    			{
    				type: "othercombustion",
    				value: 0.15068766520591753
    			},
    			{
    				type: "commercial",
    				value: 0.29744620352928136
    			},
    			{
    				type: "remainingsources",
    				value: 2.436401582693824
    			},
    			{
    				type: "industry",
    				value: 1.2047195161977429
    			},
    			{
    				type: "otherfires",
    				value: 4.89714279792355
    			},
    			{
    				type: "agrwasteburning",
    				value: 0.36629525984529887
    			},
    			{
    				type: "energy",
    				value: 2.109493735679321
    			},
    			{
    				type: "agriculture",
    				value: 0.5458928833230813
    			},
    			{
    				type: "afciddust",
    				value: 1.7839199690948577
    			}
    		],
    		posX: 270,
    		posY: 195,
    		numCountries: 53,
    		totalValue: 43.28622639416436
    	},
    	{
    		region: "Asia + Pacific",
    		types: [
    			{
    				type: "waste",
    				value: 3.088611172669602
    			},
    			{
    				type: "windblowndust",
    				value: 3.6256331658007013
    			},
    			{
    				type: "solvents",
    				value: 0.14540022064599625
    			},
    			{
    				type: "intlshipping",
    				value: 0.3138418161824626
    			},
    			{
    				type: "transport",
    				value: 4.022000094742289
    			},
    			{
    				type: "residential",
    				value: 12.472950767668832
    			},
    			{
    				type: "othercombustion",
    				value: 1.1905120802811424
    			},
    			{
    				type: "commercial",
    				value: 0.9452948172366257
    			},
    			{
    				type: "remainingsources",
    				value: 2.2900422495385344
    			},
    			{
    				type: "industry",
    				value: 7.557306431102089
    			},
    			{
    				type: "otherfires",
    				value: 0.6334975824854222
    			},
    			{
    				type: "agrwasteburning",
    				value: 0.3921135988863285
    			},
    			{
    				type: "energy",
    				value: 6.000539251187018
    			},
    			{
    				type: "agriculture",
    				value: 5.24445375022842
    			},
    			{
    				type: "afciddust",
    				value: 6.047679446254451
    			}
    		],
    		posX: 600,
    		posY: 120,
    		numCountries: 45,
    		totalValue: 53.9698764449099
    	},
    	{
    		region: "Europe",
    		types: [
    			{
    				type: "waste",
    				value: 0.40287468158500933
    			},
    			{
    				type: "windblowndust",
    				value: 2.797729968800448
    			},
    			{
    				type: "solvents",
    				value: -0.001983927742963212
    			},
    			{
    				type: "intlshipping",
    				value: 0.30837026409438567
    			},
    			{
    				type: "transport",
    				value: 1.3354828963763656
    			},
    			{
    				type: "residential",
    				value: 1.840090870623911
    			},
    			{
    				type: "othercombustion",
    				value: 0.2530246330247691
    			},
    			{
    				type: "commercial",
    				value: 0.24145735364941384
    			},
    			{
    				type: "remainingsources",
    				value: 1.1663463472614592
    			},
    			{
    				type: "industry",
    				value: 1.1554969880046753
    			},
    			{
    				type: "otherfires",
    				value: 0.23638434125809862
    			},
    			{
    				type: "agrwasteburning",
    				value: 0.1259822704863241
    			},
    			{
    				type: "energy",
    				value: 2.072728018375011
    			},
    			{
    				type: "agriculture",
    				value: 2.4342080059654365
    			},
    			{
    				type: "afciddust",
    				value: 1.098426207525452
    			}
    		],
    		posX: 325,
    		posY: 90,
    		numCountries: 53,
    		totalValue: 15.466618919287797
    	},
    	{
    		region: "Latin America + Caribbean",
    		types: [
    			{
    				type: "waste",
    				value: 0.6807444400220481
    			},
    			{
    				type: "windblowndust",
    				value: 1.695813385188284
    			},
    			{
    				type: "solvents",
    				value: 0
    			},
    			{
    				type: "intlshipping",
    				value: 0.275634958701104
    			},
    			{
    				type: "transport",
    				value: 1.482489119171796
    			},
    			{
    				type: "residential",
    				value: 1.927182846082842
    			},
    			{
    				type: "othercombustion",
    				value: 0.2482828656009375
    			},
    			{
    				type: "commercial",
    				value: 0.06382352345563937
    			},
    			{
    				type: "remainingsources",
    				value: 3.2042638526783116
    			},
    			{
    				type: "industry",
    				value: 2.7346445238011947
    			},
    			{
    				type: "otherfires",
    				value: 1.7725813133652502
    			},
    			{
    				type: "agrwasteburning",
    				value: 0.1560089653843535
    			},
    			{
    				type: "energy",
    				value: 1.4284847756809782
    			},
    			{
    				type: "agriculture",
    				value: 0.9508498464634497
    			},
    			{
    				type: "afciddust",
    				value: 0.7710727088746037
    			}
    		],
    		posX: 20,
    		posY: 195,
    		numCountries: 36,
    		totalValue: 17.391877124470795
    	},
    	{
    		region: "North America",
    		types: [
    			{
    				type: "waste",
    				value: 0.18998080013785312
    			},
    			{
    				type: "windblowndust",
    				value: 0.18998080013785312
    			},
    			{
    				type: "solvents",
    				value: 0
    			},
    			{
    				type: "intlshipping",
    				value: 0.1100191998594034
    			},
    			{
    				type: "transport",
    				value: 1.1499040006508567
    			},
    			{
    				type: "residential",
    				value: 0.7400767994897401
    			},
    			{
    				type: "othercombustion",
    				value: 0.4799616002565018
    			},
    			{
    				type: "commercial",
    				value: 0.18998080013785312
    			},
    			{
    				type: "remainingsources",
    				value: 0.8799616002619889
    			},
    			{
    				type: "industry",
    				value: 0.8899808001405967
    			},
    			{
    				type: "otherfires",
    				value: 0.9400767994787662
    			},
    			{
    				type: "agrwasteburning",
    				value: 0.08998080012962263
    			},
    			{
    				type: "energy",
    				value: 0.8899808001405967
    			},
    			{
    				type: "agriculture",
    				value: 0.8100191998621469
    			},
    			{
    				type: "afciddust",
    				value: 0.19999999998902604
    			}
    		],
    		posX: 20,
    		posY: 117,
    		numCountries: 2,
    		totalValue: 7.749904000672805
    	},
    	{
    		region: "West Asia",
    		types: [
    			{
    				type: "waste",
    				value: 1.124381788564977
    			},
    			{
    				type: "windblowndust",
    				value: 26.782965773177672
    			},
    			{
    				type: "solvents",
    				value: -0.04492350987180868
    			},
    			{
    				type: "intlshipping",
    				value: 0.2685488390862237
    			},
    			{
    				type: "transport",
    				value: 2.882629623532052
    			},
    			{
    				type: "residential",
    				value: 0.6851725489658629
    			},
    			{
    				type: "othercombustion",
    				value: 0.08166358729551736
    			},
    			{
    				type: "commercial",
    				value: 0.1219575235274079
    			},
    			{
    				type: "remainingsources",
    				value: 0.7977164348662027
    			},
    			{
    				type: "industry",
    				value: 2.6277974687636463
    			},
    			{
    				type: "otherfires",
    				value: 0.07627280636409035
    			},
    			{
    				type: "agrwasteburning",
    				value: 0.07910242961762667
    			},
    			{
    				type: "energy",
    				value: 6.985487952884625
    			},
    			{
    				type: "agriculture",
    				value: 1.8846622592923128
    			},
    			{
    				type: "afciddust",
    				value: 1.332521056792976
    			}
    		],
    		posX: 430,
    		posY: 195,
    		numCountries: 12,
    		totalValue: 45.68595658285938
    	}
    ];
    var scale_width$1 = 800;
    var scale_height$1 = 400;
    var type$1 = "sectors";
    var sectoralBDData = {
    	regions: regions$1,
    	scale_width: scale_width$1,
    	scale_height: scale_height$1,
    	type: type$1
    };

    var regions = [
    	{
    		region: "Asia + Pacific",
    		types: [
    			{
    				type: "solidbio",
    				value: 195.79999999999995
    			},
    			{
    				type: "process",
    				value: 549.7
    			},
    			{
    				type: "coal",
    				value: 116.89999999999995
    			},
    			{
    				type: "liquid",
    				value: 124.49999999999997
    			}
    		],
    		posX: 640,
    		posY: 120,
    		numCountries: 45,
    		totalValue: 986.9000000000003
    	},
    	{
    		region: "Europe",
    		types: [
    			{
    				type: "solidbio",
    				value: 124.29999999999998
    			},
    			{
    				type: "process",
    				value: 477.6000000000002
    			},
    			{
    				type: "coal",
    				value: 101.2
    			},
    			{
    				type: "liquid",
    				value: 140.2
    			}
    		],
    		posX: 365,
    		posY: 90,
    		numCountries: 53,
    		totalValue: 843.3000000000002
    	},
    	{
    		region: "Africa",
    		types: [
    			{
    				type: "solidbio",
    				value: 173
    			},
    			{
    				type: "process",
    				value: 1702.7
    			},
    			{
    				type: "coal",
    				value: 52.800000000000004
    			},
    			{
    				type: "liquid",
    				value: 120.40000000000003
    			}
    		],
    		posX: 310,
    		posY: 195,
    		numCountries: 53,
    		totalValue: 2048.900000000001
    	},
    	{
    		region: "Latin America + Caribbean",
    		types: [
    			{
    				type: "solidbio",
    				value: 89.60000000000001
    			},
    			{
    				type: "process",
    				value: 441.2000000000001
    			},
    			{
    				type: "coal",
    				value: 9.899999999999997
    			},
    			{
    				type: "liquid",
    				value: 90.7
    			}
    		],
    		posX: 60,
    		posY: 205,
    		numCountries: 36,
    		totalValue: 631.4000000000001
    	},
    	{
    		region: "West Asia",
    		types: [
    			{
    				type: "solidbio",
    				value: 6.499999999999999
    			},
    			{
    				type: "process",
    				value: 395.59999999999997
    			},
    			{
    				type: "coal",
    				value: 23.2
    			},
    			{
    				type: "liquid",
    				value: 116.6
    			}
    		],
    		posX: 470,
    		posY: 195,
    		numCountries: 12,
    		totalValue: 541.9
    	},
    	{
    		region: "North America",
    		types: [
    			{
    				type: "solidbio",
    				value: 2.2
    			},
    			{
    				type: "process",
    				value: 7.8999999999999995
    			},
    			{
    				type: "coal",
    				value: 1
    			},
    			{
    				type: "liquid",
    				value: 3.6
    			}
    		],
    		posX: 60,
    		posY: 130,
    		numCountries: 2,
    		totalValue: 14.699999999999998
    	}
    ];
    var scale_width = 800;
    var scale_height = 400;
    var type = "fuel";
    var differentFuelsData = {
    	regions: regions,
    	scale_width: scale_width,
    	scale_height: scale_height,
    	type: type
    };

    const data = {
        sectoralBD: sectoralBDData,
        differentFuels: differentFuelsData
    };
    function getMockData(dataset) {
        return data[dataset];
    }
    const sectoralBD = getMockData('sectoralBD');
    const differentFuels = getMockData('differentFuels');

    /* src/components/CartoRegion.svelte generated by Svelte v3.42.3 */
    const file$a = "src/components/CartoRegion.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (93:2) {#if !isEmbed}
    function create_if_block_2$1(ctx) {
    	let sectiontitle;
    	let current;

    	sectiontitle = new SectionTitle({
    			props: { block: /*block*/ ctx[2] },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(sectiontitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectiontitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sectiontitle_changes = {};
    			if (dirty & /*block*/ 4) sectiontitle_changes.block = /*block*/ ctx[2];
    			sectiontitle.$set(sectiontitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectiontitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(93:2) {#if !isEmbed}",
    		ctx
    	});

    	return block_1;
    }

    // (109:2) {#if isEmbed}
    function create_if_block_1$3(ctx) {
    	let div;
    	let p;
    	let t0;
    	let b;
    	let a;

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text$1("To explore more about the climate emergency and\n        the effects on the planet visit\n        ");
    			b = element("b");
    			a = element("a");
    			a.textContent = "unep.org";
    			attr_dev(a, "href", "https://www.unep.org/");
    			add_location(a, file$a, 113, 11, 4047);
    			add_location(b, file$a, 113, 8, 4044);
    			add_location(p, file$a, 110, 6, 3936);
    			attr_dev(div, "class", "embed-additional-text-desktop");
    			add_location(div, file$a, 109, 4, 3886);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, b);
    			append_dev(b, a);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(109:2) {#if isEmbed}",
    		ctx
    	});

    	return block_1;
    }

    // (120:4) <ScrollableX>
    function create_default_slot$1(ctx) {
    	let div;
    	let treemapsvg;
    	let updating_annotationShowing;
    	let current;

    	function treemapsvg_annotationShowing_binding(value) {
    		/*treemapsvg_annotationShowing_binding*/ ctx[19](value);
    	}

    	let treemapsvg_props = {
    		data: /*currentData*/ ctx[17],
    		width: /*width*/ ctx[8],
    		height: /*height*/ ctx[13],
    		source: /*treemapParams*/ ctx[15][/*TreemapType*/ ctx[10][/*data*/ ctx[0]]].help.text,
    		legendElementSelected: /*legendElementSelected*/ ctx[14],
    		labels: /*pairLabels*/ ctx[12]
    	};

    	if (/*cartogramAnnotation*/ ctx[11] !== void 0) {
    		treemapsvg_props.annotationShowing = /*cartogramAnnotation*/ ctx[11];
    	}

    	treemapsvg = new TreemapSVG({ props: treemapsvg_props, $$inline: true });
    	binding_callbacks.push(() => bind(treemapsvg, 'annotationShowing', treemapsvg_annotationShowing_binding));

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			create_component(treemapsvg.$$.fragment);
    			attr_dev(div, "class", "treemap-container svelte-1bonvwx");
    			set_style(div, "width", /*width*/ ctx[8] + "px");
    			set_style(div, "height", /*height*/ ctx[13] + "px");
    			toggle_class(div, "background", /*cartogramAnnotation*/ ctx[11]);
    			add_location(div, file$a, 120, 6, 4238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(treemapsvg, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const treemapsvg_changes = {};
    			if (dirty & /*width*/ 256) treemapsvg_changes.width = /*width*/ ctx[8];
    			if (dirty & /*height*/ 8192) treemapsvg_changes.height = /*height*/ ctx[13];
    			if (dirty & /*TreemapType, data*/ 1025) treemapsvg_changes.source = /*treemapParams*/ ctx[15][/*TreemapType*/ ctx[10][/*data*/ ctx[0]]].help.text;
    			if (dirty & /*legendElementSelected*/ 16384) treemapsvg_changes.legendElementSelected = /*legendElementSelected*/ ctx[14];
    			if (dirty & /*pairLabels*/ 4096) treemapsvg_changes.labels = /*pairLabels*/ ctx[12];

    			if (!updating_annotationShowing && dirty & /*cartogramAnnotation*/ 2048) {
    				updating_annotationShowing = true;
    				treemapsvg_changes.annotationShowing = /*cartogramAnnotation*/ ctx[11];
    				add_flush_callback(() => updating_annotationShowing = false);
    			}

    			treemapsvg.$set(treemapsvg_changes);

    			if (!current || dirty & /*width*/ 256) {
    				set_style(div, "width", /*width*/ ctx[8] + "px");
    			}

    			if (!current || dirty & /*height*/ 8192) {
    				set_style(div, "height", /*height*/ ctx[13] + "px");
    			}

    			if (dirty & /*cartogramAnnotation*/ 2048) {
    				toggle_class(div, "background", /*cartogramAnnotation*/ ctx[11]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(treemapsvg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(treemapsvg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(treemapsvg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(120:4) <ScrollableX>",
    		ctx
    	});

    	return block_1;
    }

    // (135:2) {#if !isEmbed}
    function create_if_block$4(ctx) {
    	let div;
    	let embedfooter;
    	let t;
    	let each_1_anchor;
    	let current;

    	embedfooter = new EmbedFooter({
    			props: { embed: /*embed*/ ctx[5] },
    			$$inline: true
    		});

    	let each_value = /*text*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			create_component(embedfooter.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    			attr_dev(div, "class", "footer svelte-1bonvwx");
    			add_location(div, file$a, 135, 4, 4722);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(embedfooter, div, null);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const embedfooter_changes = {};
    			if (dirty & /*embed*/ 32) embedfooter_changes.embed = /*embed*/ ctx[5];
    			embedfooter.$set(embedfooter_changes);

    			if (dirty & /*text*/ 16) {
    				each_value = /*text*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(embedfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(embedfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(embedfooter);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(135:2) {#if !isEmbed}",
    		ctx
    	});

    	return block_1;
    }

    // (140:4) {#each text as t}
    function create_each_block$6(ctx) {
    	let p;
    	let raw_value = /*t*/ ctx[23].p + "";

    	const block_1 = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "col-text");
    			add_location(p, file$a, 140, 6, 4813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 16 && raw_value !== (raw_value = /*t*/ ctx[23].p + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(140:4) {#each text as t}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$a(ctx) {
    	let section;
    	let t0;
    	let h2;
    	let t1;
    	let div0;
    	let legend;
    	let updating_selected;
    	let t2;
    	let t3;
    	let div1;
    	let scrollablex;
    	let div1_resize_listener;
    	let t4;
    	let current;
    	let if_block0 = !/*isEmbed*/ ctx[6] && create_if_block_2$1(ctx);

    	function legend_selected_binding(value) {
    		/*legend_selected_binding*/ ctx[18](value);
    	}

    	let legend_props = {
    		title: /*legendOptions*/ ctx[16][/*data*/ ctx[0]].title,
    		colors: /*legendOptions*/ ctx[16][/*data*/ ctx[0]].colors,
    		labels: /*legendOptions*/ ctx[16][/*data*/ ctx[0]].labels,
    		type: 'categorical'
    	};

    	if (/*legendElementSelectedIndex*/ ctx[9] !== void 0) {
    		legend_props.selected = /*legendElementSelectedIndex*/ ctx[9];
    	}

    	legend = new Legend({ props: legend_props, $$inline: true });
    	binding_callbacks.push(() => bind(legend, 'selected', legend_selected_binding));
    	let if_block1 = /*isEmbed*/ ctx[6] && create_if_block_1$3(ctx);

    	scrollablex = new ScrollableX({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block2 = !/*isEmbed*/ ctx[6] && create_if_block$4(ctx);

    	const block_1 = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			h2 = element("h2");
    			t1 = space();
    			div0 = element("div");
    			create_component(legend.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div1 = element("div");
    			create_component(scrollablex.$$.fragment);
    			t4 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(h2, "class", "narrow");
    			add_location(h2, file$a, 96, 2, 3577);
    			attr_dev(div0, "class", "right-narrow");
    			add_location(div0, file$a, 98, 1, 3616);
    			attr_dev(div1, "class", "scroll-container margin-breakout-mobile");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[20].call(div1));
    			add_location(div1, file$a, 118, 2, 4129);
    			attr_dev(section, "class", "viz wide");
    			attr_dev(section, "id", /*id*/ ctx[1]);
    			add_location(section, file$a, 90, 0, 3487);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t0);
    			append_dev(section, h2);
    			h2.innerHTML = /*head*/ ctx[3];
    			append_dev(section, t1);
    			append_dev(section, div0);
    			mount_component(legend, div0, null);
    			append_dev(section, t2);
    			if (if_block1) if_block1.m(section, null);
    			append_dev(section, t3);
    			append_dev(section, div1);
    			mount_component(scrollablex, div1, null);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[20].bind(div1));
    			append_dev(section, t4);
    			if (if_block2) if_block2.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*isEmbed*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*isEmbed*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*head*/ 8) h2.innerHTML = /*head*/ ctx[3];			const legend_changes = {};
    			if (dirty & /*data*/ 1) legend_changes.title = /*legendOptions*/ ctx[16][/*data*/ ctx[0]].title;
    			if (dirty & /*data*/ 1) legend_changes.colors = /*legendOptions*/ ctx[16][/*data*/ ctx[0]].colors;
    			if (dirty & /*data*/ 1) legend_changes.labels = /*legendOptions*/ ctx[16][/*data*/ ctx[0]].labels;

    			if (!updating_selected && dirty & /*legendElementSelectedIndex*/ 512) {
    				updating_selected = true;
    				legend_changes.selected = /*legendElementSelectedIndex*/ ctx[9];
    				add_flush_callback(() => updating_selected = false);
    			}

    			legend.$set(legend_changes);

    			if (/*isEmbed*/ ctx[6]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_1$3(ctx);
    					if_block1.c();
    					if_block1.m(section, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const scrollablex_changes = {};

    			if (dirty & /*$$scope, width, height, cartogramAnnotation, TreemapType, data, legendElementSelected, pairLabels*/ 67140865) {
    				scrollablex_changes.$$scope = { dirty, ctx };
    			}

    			scrollablex.$set(scrollablex_changes);

    			if (!/*isEmbed*/ ctx[6]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*isEmbed*/ 64) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$4(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(section, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*id*/ 2) {
    				attr_dev(section, "id", /*id*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(legend.$$.fragment, local);
    			transition_in(scrollablex.$$.fragment, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(legend.$$.fragment, local);
    			transition_out(scrollablex.$$.fragment, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			destroy_component(legend);
    			if (if_block1) if_block1.d();
    			destroy_component(scrollablex);
    			div1_resize_listener();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CartoRegion', slots, []);
    	
    	var TreemapType;

    	(function (TreemapType) {
    		TreemapType[TreemapType["fuel"] = 0] = "fuel";
    		TreemapType[TreemapType["sectors"] = 1] = "sectors";
    	})(TreemapType || (TreemapType = {}));

    	let { data } = $$props;
    	let { id } = $$props;
    	let { block } = $$props;
    	let { head } = $$props;
    	let { text } = $$props;
    	let { embed } = $$props;
    	let { isEmbed = false } = $$props;
    	let cartogramAnnotation;

    	const treemapParams = {
    		[TreemapType.fuel]: {
    			help: {
    				text: `<strong>Each big square is a world region</strong>, sized
         by the annual mean levels of <strong>fine particular
         matter PM<sub>2.5</sub></strong>, measured in µg/m<sup>3</sup>.`
    			}
    		},
    		[TreemapType.sectors]: {
    			help: {
    				text: `<strong>Each big square is a world region</strong>, colored by
         contributing sector and sized by the annual mean levels of
         <strong>fine particular matter PM<sub>2.5</sub></strong>,
         measured in µg/m<sup>3</sup>.`
    			}
    		}
    	};

    	const legendOptions = {
    		sectors: {
    			title: "Contribution of each <b>sector</b> to fine particle pollution",
    			labels: [
    				'Residential',
    				'Transport',
    				'International shipping',
    				'Industry',
    				'Commercial',
    				'Anthropogenic fugitive, combustion and industrial dust',
    				'Other combustion',
    				'Remaining sources',
    				'Landscape fires',
    				'Agricultural waste burning',
    				'Agriculture',
    				'Waste',
    				'Solvents',
    				'Energy',
    				'Windblown dust'
    			],
    			selectionDictionary: [
    				'residential',
    				'transport',
    				'intlshipping',
    				'industry',
    				'commercial',
    				'afciddust',
    				'othercombustion',
    				'remainingsources',
    				'otherfires',
    				'agrwasteburning',
    				'agriculture',
    				'waste',
    				'solvents',
    				'energy',
    				'windblowndust'
    			],
    			colors: colorSectors.range()
    		},
    		fuel: {
    			title: "Contribution of each <b>type of fuel</b> to fine particle pollution",
    			labels: ['Process', 'Liquid', 'Solid bio', 'Coal'],
    			selectionDictionary: ['process', 'liquid', 'solidbio', 'coal'],
    			colors: colorFuels.range()
    		}
    	};

    	const pairLabels = {};
    	let cont = 0;

    	legendOptions[data].selectionDictionary.forEach(element => {
    		const key = element;
    		$$invalidate(12, pairLabels[key] = legendOptions[data].labels[cont], pairLabels);
    		cont++;
    	});

    	const currentData = data === "sectors"
    	? sectoralBD
    	: data === "fuel" ? differentFuels : null;

    	const scaleRate = currentData.scale_height / currentData.scale_width;
    	let clientWidth = 0;
    	let width;
    	let height;
    	let legendElementSelectedIndex = -1;
    	let legendElementSelected = "";
    	const writable_props = ['data', 'id', 'block', 'head', 'text', 'embed', 'isEmbed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CartoRegion> was created with unknown prop '${key}'`);
    	});

    	function legend_selected_binding(value) {
    		legendElementSelectedIndex = value;
    		$$invalidate(9, legendElementSelectedIndex);
    	}

    	function treemapsvg_annotationShowing_binding(value) {
    		cartogramAnnotation = value;
    		$$invalidate(11, cartogramAnnotation);
    	}

    	function div1_elementresize_handler() {
    		clientWidth = this.clientWidth;
    		$$invalidate(7, clientWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('block' in $$props) $$invalidate(2, block = $$props.block);
    		if ('head' in $$props) $$invalidate(3, head = $$props.head);
    		if ('text' in $$props) $$invalidate(4, text = $$props.text);
    		if ('embed' in $$props) $$invalidate(5, embed = $$props.embed);
    		if ('isEmbed' in $$props) $$invalidate(6, isEmbed = $$props.isEmbed);
    	};

    	$$self.$capture_state = () => ({
    		TreemapSvg: TreemapSVG,
    		sectoralBD,
    		differentFuels,
    		Legend,
    		colorFuels,
    		colorSectors,
    		ScrollableX,
    		EmbedFooter,
    		SectionTitle,
    		TreemapType,
    		data,
    		id,
    		block,
    		head,
    		text,
    		embed,
    		isEmbed,
    		cartogramAnnotation,
    		treemapParams,
    		legendOptions,
    		pairLabels,
    		cont,
    		currentData,
    		scaleRate,
    		clientWidth,
    		width,
    		height,
    		legendElementSelectedIndex,
    		legendElementSelected
    	});

    	$$self.$inject_state = $$props => {
    		if ('TreemapType' in $$props) $$invalidate(10, TreemapType = $$props.TreemapType);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('block' in $$props) $$invalidate(2, block = $$props.block);
    		if ('head' in $$props) $$invalidate(3, head = $$props.head);
    		if ('text' in $$props) $$invalidate(4, text = $$props.text);
    		if ('embed' in $$props) $$invalidate(5, embed = $$props.embed);
    		if ('isEmbed' in $$props) $$invalidate(6, isEmbed = $$props.isEmbed);
    		if ('cartogramAnnotation' in $$props) $$invalidate(11, cartogramAnnotation = $$props.cartogramAnnotation);
    		if ('cont' in $$props) cont = $$props.cont;
    		if ('clientWidth' in $$props) $$invalidate(7, clientWidth = $$props.clientWidth);
    		if ('width' in $$props) $$invalidate(8, width = $$props.width);
    		if ('height' in $$props) $$invalidate(13, height = $$props.height);
    		if ('legendElementSelectedIndex' in $$props) $$invalidate(9, legendElementSelectedIndex = $$props.legendElementSelectedIndex);
    		if ('legendElementSelected' in $$props) $$invalidate(14, legendElementSelected = $$props.legendElementSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*clientWidth*/ 128) {
    			$$invalidate(8, width = Math.max(clientWidth, 700));
    		}

    		if ($$self.$$.dirty & /*width*/ 256) {
    			$$invalidate(13, height = width * scaleRate);
    		}

    		if ($$self.$$.dirty & /*legendElementSelectedIndex, data*/ 513) {
    			{
    				if (legendElementSelectedIndex >= 0 && legendElementSelectedIndex < legendOptions[data].selectionDictionary.length && legendElementSelectedIndex !== null) $$invalidate(14, legendElementSelected = (legendOptions[data].selectionDictionary[legendElementSelectedIndex] + "").toLocaleLowerCase().replaceAll('.', '').replaceAll(' ', '')); else $$invalidate(14, legendElementSelected = "null");
    			}
    		}
    	};

    	return [
    		data,
    		id,
    		block,
    		head,
    		text,
    		embed,
    		isEmbed,
    		clientWidth,
    		width,
    		legendElementSelectedIndex,
    		TreemapType,
    		cartogramAnnotation,
    		pairLabels,
    		height,
    		legendElementSelected,
    		treemapParams,
    		legendOptions,
    		currentData,
    		legend_selected_binding,
    		treemapsvg_annotationShowing_binding,
    		div1_elementresize_handler
    	];
    }

    class CartoRegion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			data: 0,
    			id: 1,
    			block: 2,
    			head: 3,
    			text: 4,
    			embed: 5,
    			isEmbed: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CartoRegion",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<CartoRegion> was created without expected prop 'data'");
    		}

    		if (/*id*/ ctx[1] === undefined && !('id' in props)) {
    			console.warn("<CartoRegion> was created without expected prop 'id'");
    		}

    		if (/*block*/ ctx[2] === undefined && !('block' in props)) {
    			console.warn("<CartoRegion> was created without expected prop 'block'");
    		}

    		if (/*head*/ ctx[3] === undefined && !('head' in props)) {
    			console.warn("<CartoRegion> was created without expected prop 'head'");
    		}

    		if (/*text*/ ctx[4] === undefined && !('text' in props)) {
    			console.warn("<CartoRegion> was created without expected prop 'text'");
    		}

    		if (/*embed*/ ctx[5] === undefined && !('embed' in props)) {
    			console.warn("<CartoRegion> was created without expected prop 'embed'");
    		}
    	}

    	get data() {
    		throw new Error("<CartoRegion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<CartoRegion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<CartoRegion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<CartoRegion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<CartoRegion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<CartoRegion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get head() {
    		throw new Error("<CartoRegion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set head(value) {
    		throw new Error("<CartoRegion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<CartoRegion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<CartoRegion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get embed() {
    		throw new Error("<CartoRegion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set embed(value) {
    		throw new Error("<CartoRegion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isEmbed() {
    		throw new Error("<CartoRegion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEmbed(value) {
    		throw new Error("<CartoRegion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/text/Intro.svelte generated by Svelte v3.42.3 */

    const file$9 = "src/components/text/Intro.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (13:8) {:else}
    function create_else_block$2(ctx) {
    	let li;
    	let raw_value = /*b*/ ctx[6].label + "";

    	const block = {
    		c: function create() {
    			li = element("li");
    			attr_dev(li, "class", "svelte-thsghs");
    			add_location(li, file$9, 13, 8, 403);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			li.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*breadcrumbs*/ 4 && raw_value !== (raw_value = /*b*/ ctx[6].label + "")) li.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(13:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#if b.a}
    function create_if_block_2(ctx) {
    	let li;
    	let a;
    	let raw_value = /*b*/ ctx[6].label + "";
    	let a_href_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			attr_dev(a, "href", a_href_value = /*b*/ ctx[6].a);
    			attr_dev(a, "class", "svelte-thsghs");
    			add_location(a, file$9, 11, 12, 338);
    			attr_dev(li, "class", "svelte-thsghs");
    			add_location(li, file$9, 11, 8, 334);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			a.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*breadcrumbs*/ 4 && raw_value !== (raw_value = /*b*/ ctx[6].label + "")) a.innerHTML = raw_value;
    			if (dirty & /*breadcrumbs*/ 4 && a_href_value !== (a_href_value = /*b*/ ctx[6].a)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(11:8) {#if b.a}",
    		ctx
    	});

    	return block;
    }

    // (10:6) {#each breadcrumbs as b}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*b*/ ctx[6].a) return create_if_block_2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(10:6) {#each breadcrumbs as b}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#if head}
    function create_if_block_1$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			add_location(h1, file$9, 20, 4, 493);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			h1.innerHTML = /*head*/ ctx[1];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*head*/ 2) h1.innerHTML = /*head*/ ctx[1];		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(20:2) {#if head}",
    		ctx
    	});

    	return block;
    }

    // (24:2) {#if text}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*text*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 1) {
    				each_value = /*text*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(24:2) {#if text}",
    		ctx
    	});

    	return block;
    }

    // (25:2) {#each text as p}
    function create_each_block$5(ctx) {
    	let p;
    	let raw_value = /*p*/ ctx[3].p + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-thsghs");
    			add_location(p, file$9, 25, 6, 563);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 1 && raw_value !== (raw_value = /*p*/ ctx[3].p + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(25:2) {#each text as p}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let section;
    	let nav;
    	let h3;
    	let t1;
    	let ul;
    	let t2;
    	let t3;
    	let each_value_1 = /*breadcrumbs*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block0 = /*head*/ ctx[1] && create_if_block_1$2(ctx);
    	let if_block1 = /*text*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			nav = element("nav");
    			h3 = element("h3");
    			h3.textContent = "Breadcrumbs";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h3, "id", "breadcrumbs-label");
    			attr_dev(h3, "class", "hidden");
    			add_location(h3, file$9, 7, 4, 189);
    			attr_dev(ul, "class", "breadcrumbs svelte-thsghs");
    			add_location(ul, file$9, 8, 4, 252);
    			attr_dev(nav, "class", "inner-nav");
    			attr_dev(nav, "role", "navigation");
    			attr_dev(nav, "labelledby", "breadcrumbs-label");
    			add_location(nav, file$9, 6, 2, 112);
    			attr_dev(section, "class", "intro col-text svelte-thsghs");
    			add_location(section, file$9, 5, 0, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, nav);
    			append_dev(nav, h3);
    			append_dev(nav, t1);
    			append_dev(nav, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(section, t2);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t3);
    			if (if_block1) if_block1.m(section, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*breadcrumbs*/ 4) {
    				each_value_1 = /*breadcrumbs*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*head*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(section, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*text*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(section, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Intro', slots, []);
    	let { text } = $$props;
    	let { head } = $$props;
    	let { breadcrumbs } = $$props;
    	const writable_props = ['text', 'head', 'breadcrumbs'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Intro> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('head' in $$props) $$invalidate(1, head = $$props.head);
    		if ('breadcrumbs' in $$props) $$invalidate(2, breadcrumbs = $$props.breadcrumbs);
    	};

    	$$self.$capture_state = () => ({ text, head, breadcrumbs });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('head' in $$props) $$invalidate(1, head = $$props.head);
    		if ('breadcrumbs' in $$props) $$invalidate(2, breadcrumbs = $$props.breadcrumbs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, head, breadcrumbs];
    }

    class Intro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, { text: 0, head: 1, breadcrumbs: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intro",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Intro> was created without expected prop 'text'");
    		}

    		if (/*head*/ ctx[1] === undefined && !('head' in props)) {
    			console.warn("<Intro> was created without expected prop 'head'");
    		}

    		if (/*breadcrumbs*/ ctx[2] === undefined && !('breadcrumbs' in props)) {
    			console.warn("<Intro> was created without expected prop 'breadcrumbs'");
    		}
    	}

    	get text() {
    		throw new Error("<Intro>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Intro>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get head() {
    		throw new Error("<Intro>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set head(value) {
    		throw new Error("<Intro>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get breadcrumbs() {
    		throw new Error("<Intro>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breadcrumbs(value) {
    		throw new Error("<Intro>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/text/Text.svelte generated by Svelte v3.42.3 */

    const file$8 = "src/components/text/Text.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (6:2) {#if head}
    function create_if_block_1$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			add_location(h2, file$8, 6, 2, 95);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			h2.innerHTML = /*head*/ ctx[1];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*head*/ 2) h2.innerHTML = /*head*/ ctx[1];		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(6:2) {#if head}",
    		ctx
    	});

    	return block;
    }

    // (9:2) {#if text}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*text*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 1) {
    				each_value = /*text*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(9:2) {#if text}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#each text as p,i}
    function create_each_block$4(ctx) {
    	let p;
    	let raw_value = /*p*/ ctx[2].p + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			add_location(p, file$8, 10, 6, 166);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 1 && raw_value !== (raw_value = /*p*/ ctx[2].p + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(10:2) {#each text as p,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let section;
    	let t;
    	let if_block0 = /*head*/ ctx[1] && create_if_block_1$1(ctx);
    	let if_block1 = /*text*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(section, "class", "col-text");
    			add_location(section, file$8, 4, 0, 53);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t);
    			if (if_block1) if_block1.m(section, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*head*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(section, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*text*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(section, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text', slots, []);
    	let { text } = $$props;
    	let { head } = $$props;
    	const writable_props = ['text', 'head'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('head' in $$props) $$invalidate(1, head = $$props.head);
    	};

    	$$self.$capture_state = () => ({ text, head });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('head' in $$props) $$invalidate(1, head = $$props.head);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, head];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, { text: 0, head: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Text> was created without expected prop 'text'");
    		}

    		if (/*head*/ ctx[1] === undefined && !('head' in props)) {
    			console.warn("<Text> was created without expected prop 'head'");
    		}
    	}

    	get text() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get head() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set head(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var img$1 = "data:image/svg+xml,%3csvg version='1.1' id='unep-logo--blue' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 226.77 164.94' style='enable-background:new 0 0 226.77 164.94%3b' xml:space='preserve'%3e%3cstyle type='text/css'%3e .unep_0 %7b fill: %23009EE2%3b %7d %3c/style%3e%3cg%3e%3cg%3e%3cg%3e%3cg%3e%3cg%3e%3cg%3e%3cpath class='unep_0' d='M178.88%2c57.2c-8.97-2.71-15.5-11.04-15.5-20.89c0-1.78%2c0.21-3.51%2c0.61-5.16l14.17%2c1.82 c0%2c0%2c5.44%2c0.24%2c5.24%2c9.87C183.21%2c52.18%2c178.88%2c57.2%2c178.88%2c57.2z'%3e%3c/path%3e%3cpath class='unep_0' d='M191.55%2c57.2c8.97-2.71%2c15.5-11.04%2c15.5-20.89c0-1.78-0.21-3.51-0.61-5.16l-14.17%2c1.82 c0%2c0-5.44%2c0.24-5.24%2c9.87C187.22%2c52.18%2c191.55%2c57.2%2c191.55%2c57.2z'%3e%3c/path%3e%3cpath class='unep_0' d='M185.21%2c20.69c1.82%2c0%2c3.3%2c1.48%2c3.3%2c3.3c0%2c1.42-0.98%2c2.48-2.16%2c3.11c-0.14%2c0.08-0.28%2c0.14-0.25%2c0.37 c0.03%2c0.23%2c0.71%2c0.36%2c1%2c0.43l19.05%2c2.21c-2.67-9.03-11.03-15.62-20.93-15.62h-0.03c-9.9%2c0-18.25%2c6.59-20.93%2c15.62l19.05-2.21 c0.29-0.07%2c0.97-0.19%2c1-0.43c0.03-0.22-0.11-0.29-0.25-0.37c-1.18-0.63-2.16-1.69-2.16-3.11 C181.91%2c22.17%2c183.39%2c20.69%2c185.21%2c20.69L185.21%2c20.69z'%3e%3c/path%3e%3c/g%3e%3cg%3e%3cpath class='unep_0' d='M193.92%2c72.65l1.29-0.81c0%2c0-6.12-8.3-19.82-8.3c-7.01%2c0-10.64%2c2.82-15.55%2c2.82c0%2c0-2.01%2c0.24-3.95-0.97 c0%2c0%2c2.34%2c3.38%2c10.8%2c3.38c6.2%2c0%2c10.64-3.63%2c14.99-3.63C187.63%2c65.15%2c192.06%2c70.47%2c193.92%2c72.65z'%3e%3c/path%3e%3c/g%3e%3cg%3e%3cpath class='unep_0' d='M174.9%2c72.65l-1.29-0.81c0%2c0%2c6.12-8.3%2c19.82-8.3c7.01%2c0%2c10.64%2c2.82%2c15.55%2c2.82c0%2c0%2c2.01%2c0.24%2c3.95-0.97 c0%2c0-2.34%2c3.38-10.8%2c3.38c-6.2%2c0-10.64-3.63-14.99-3.63C181.19%2c65.15%2c176.75%2c70.47%2c174.9%2c72.65z'%3e%3c/path%3e%3c/g%3e%3cpath class='unep_0' d='M168.37%2c62.82c-0.24%2c0.64-2.86-0.12-4.63%2c0.4c-1.98%2c0.59-12.45%2c1.85-17.04-9.02c0%2c0%2c4.35%2c4.67%2c7.74%2c5 c3.38%2c0.32%2c7.09%2c1.13%2c10.23%2c2.9l0.73%2c0.16c0%2c0-0.1-0.32-0.4-0.48c-0.41-0.22-3.67-1.28-5.24-6.45 c-0.81-2.66-0.64-4.59-0.97-5.96c0%2c0%2c3.55%2c3.95%2c5%2c6.45C165.23%2c58.31%2c165.39%2c61.13%2c168.37%2c62.82z'%3e%3c/path%3e%3cpath class='unep_0' d='M157.7%2c57.34c-0.26%2c0.26-0.93-0.16-1.17-0.28c-0.24-0.12-1.98-0.92-4.96-1.97 c-2.94-1.05-8.42-5.68-7.9-13.62c0%2c0%2c0.77%2c2.98%2c3.02%2c4.96c2.26%2c1.97%2c3.06%2c2.22%2c4.43%2c3.83c1.37%2c1.61%2c4.47%2c5.28%2c4.59%2c5.24 c0.12-0.04%2c0.16-0.24-0.08-0.44c-0.24-0.2-1.05-2.22-1.57-2.9c-0.52-0.68-2.09-5.4%2c0.2-11.2c0%2c0%2c2.46%2c4.23%2c2.3%2c8.5 c-0.16%2c4.27-0.36%2c3.26%2c0.68%2c6.81C157.25%2c56.25%2c157.82%2c57.22%2c157.7%2c57.34z'%3e%3c/path%3e%3cpath class='unep_0' d='M150.85%2c46.99c-0.15%2c0.15-0.77-0.77-1.25-1.61c-0.48-0.85-3.87-4.47-4.31-5.2 c-0.44-0.73-4.23-5.32-1.37-12.13c0%2c0%2c0.28-0.08%2c0.28%2c1.53s1.49%2c5.2%2c2.7%2c6.73c1.21%2c1.53%2c2.3%2c3.99%2c2.54%2c6.61 c0%2c0%2c0.16%2c0.48%2c0.36%2c0.52s0.2-0.48%2c0.2-0.48s-0.16-2.42-0.16-4.07c0-1.65%2c0.73-4.47%2c2.3-6.08c0%2c0%2c0.73-0.81%2c1.17-1.77 c0%2c0%2c0.28-0.64%2c0.68-0.97c0%2c0%2c0.32%2c4.63-1.25%2c8.94c-1.57%2c4.31-2.09%2c5.04-1.85%2c7.37C150.89%2c46.38%2c150.93%2c46.9%2c150.85%2c46.99z'%3e%3c/path%3e%3cpath class='unep_0' d='M148.19%2c34.25c-0.16%2c0-0.28-0.56-0.36-1.01c-0.08-0.44-0.56-3.02-0.89-3.59 c-0.32-0.56-1.53-3.14-1.57-6.16c-0.04-3.02%2c1.33-7.13%2c4.39-10.39c0%2c0-0.12%2c0.97-0.93%2c3.1c-0.81%2c2.14-0.32%2c4.15-0.24%2c4.51 c0.08%2c0.36%2c0.36%2c2.86%2c0.36%2c4.03c0%2c0.93-0.24%2c4.11-0.44%2c4.75c0%2c0-0.08%2c0.44%2c0.08%2c0.44c0.16%2c0%2c0.32-0.36%2c0.32-0.36 s0.16-2.5%2c2.01-4.75c1.85-2.26%2c5.2-3.63%2c5.72-4.63c0%2c0-0.24%2c3.55-4.15%2c7.69c-3.48%2c3.7-2.46%2c1.81-3.59%2c4.83 c0%2c0-0.48%2c1.13-0.48%2c1.37C148.43%2c34.34%2c148.19%2c34.25%2c148.19%2c34.25z'%3e%3c/path%3e%3cpath class='unep_0' d='M150.33%2c22.33c0%2c0-0.08-0.48%2c0.52-1.57c0.6-1.09-0.04-3.02%2c0.77-5.84s2.3-7.65%2c7.98-10.55 c0%2c0-0.56%2c0.52-0.85%2c0.93c-0.28%2c0.4-1.81%2c3.3-2.26%2c5.32c-0.44%2c2.01-2.38%2c5.4-3.1%2c6.16c-0.73%2c0.77-0.4%2c0.85-0.4%2c0.85 s0.36-0.08%2c0.73-0.64c0.36-0.56%2c2.22-2.66%2c4.27-3.14c2.05-0.48%2c5.32-1.45%2c5.52-1.65c0%2c0-3.55%2c3.63-6.81%2c5.48 s-3.63%2c1.29-5.56%2c3.79C151.13%2c21.44%2c150.49%2c22.33%2c150.33%2c22.33z'%3e%3c/path%3e%3cpath class='unep_0' d='M158.14%2c11.57c0%2c0%2c0-0.32%2c0.6-0.89c0.6-0.56%2c1.21-2.26%2c2.26-3.83c1.05-1.57%2c3.42-5.68%2c9.59-6.65 c0%2c0-1.85%2c1.37-2.14%2c1.81c-0.28%2c0.44-2.09%2c2.82-2.9%2c3.63s-3.1%2c2.5-3.87%2c2.86c0%2c0-0.4%2c0.32-0.32%2c0.44 c0.08%2c0.12%2c0.48-0.12%2c0.48-0.12s2.14-1.65%2c4.71-1.73c2.58-0.08%2c5.28%2c0.04%2c5.68%2c0.08c0%2c0-2.42%2c1.65-8.18%2c2.7 c-5.76%2c1.05-4.67%2c1.09-5.56%2c1.65C158.5%2c11.53%2c158.3%2c11.69%2c158.14%2c11.57z'%3e%3c/path%3e%3cpath class='unep_0' d='M168.41%2c4.89c0%2c0%2c0.12-0.32%2c1.05-0.6c0.93-0.28%2c0.85-1.17%2c3.67-2.66c2.82-1.49%2c5.76-2.18%2c8.74-0.93 c0%2c0-1.25%2c0.16-1.45%2c0.24s-2.34%2c0.64-2.94%2c0.97c-0.6%2c0.32-3.71%2c1.69-4.96%2c1.93c-1.25%2c0.24-0.64%2c0.32-0.64%2c0.32 s0.28%2c0.12%2c0.52%2c0.12c0.24%2c0%2c3.02-0.28%2c4.83%2c0.36c1.81%2c0.64%2c1.77%2c0.89%2c2.5%2c1.13c0.73%2c0.24%2c1.57%2c0.4%2c1.69%2c0.68 c0%2c0-1.81%2c0.16-2.9%2c0.16c-1.09%2c0-3.95-0.28-5.32-0.93c-1.37-0.64-2.94-0.93-3.46-0.81C169.22%2c5.01%2c168.58%2c5.01%2c168.41%2c4.89z'%3e%3c/path%3e%3cpath class='unep_0' d='M179.86%2c3.48c0%2c0%2c0.12-0.16%2c0.93-0.32c0.81-0.16%2c1.01-0.64%2c2.9-1.05s4.83-0.77%2c7.53%2c1.09 c0%2c0-1.65-0.04-2.01-0.04s-3.5%2c0.56-4.23%2c0.56c-0.73%2c0-2.18-0.32-2.38-0.08c-0.2%2c0.24%2c1.33%2c0.56%2c1.57%2c0.64 c0.24%2c0.08%2c1.33%2c0.16%2c2.7%2c1.49c1.37%2c1.33%2c2.34%2c2.05%2c2.5%2c2.14c0%2c0-4.03-0.93-5.04-1.49s-2.74-2.3-3.02-2.42 C181.02%2c3.88%2c179.86%2c3.48%2c179.86%2c3.48z'%3e%3c/path%3e%3cpath class='unep_0' d='M189.16%2c5.13c0%2c0%2c2.54-0.08%2c4.39%2c1.09s3.34%2c2.7%2c3.5%2c3.63c0%2c0-1.05-0.89-1.73-1.09 c-0.69-0.2-2.62-1.29-3.02-1.53S189.56%2c5.49%2c189.16%2c5.13z'%3e%3c/path%3e%3cpath class='unep_0' d='M201.09%2c63.26c0%2c0%2c0.36-0.36%2c1.57-1.41c1.21-1.05%2c1.53-2.58%2c2.86-4.96c1.33-2.38%2c2.46-4.03%2c5.16-6.45 c0%2c0-0.48%2c1.81-0.52%2c2.38c-0.04%2c0.56-0.48%2c3.71-2.01%2c5.52c-1.53%2c1.81-1.61%2c2.22-3.38%2c3.3c0%2c0-0.69%2c0.48-0.64%2c0.64 c0.04%2c0.16%2c1.21-0.04%2c1.21-0.04s1.29-0.48%2c1.69-0.73c0.4-0.24%2c2.22-1.17%2c2.94-1.45c0.73-0.28%2c1.33-0.56%2c2.94-1.05 c1.61-0.48%2c7.45-1.97%2c9.75-5.68c0%2c0-0.68%2c2.18-1.53%2c3.18c-0.85%2c1.01-5.64%2c7.33-12.29%2c7.21c0%2c0-2.62-0.2-3.99-0.44 c-1.37-0.24-1.85-0.24-2.05-0.2C202.58%2c63.14%2c201.29%2c63.38%2c201.09%2c63.26z'%3e%3c/path%3e%3cpath class='unep_0' d='M215.95%2c40.66c0%2c0-2.5%2c3.91-3.06%2c9.55c-0.56%2c5.64%2c0.4%2c3.95-0.52%2c6.45c0%2c0-0.32%2c0.64-0.2%2c0.68 c0.12%2c0.04%2c0.6-0.24%2c2.38-1.33c1.77-1.09%2c3.51-0.77%2c7.29-4.39c3.79-3.63%2c4.55-10.84%2c4.63-11.44c0%2c0-0.56%2c0.56-0.85%2c1.53 c-0.28%2c0.97-0.89%2c1.73-1.01%2c1.85c-0.12%2c0.12-4.23%2c4.63-4.71%2c5.04c-0.48%2c0.4-2.9%2c3.34-3.42%2c4.19c-0.52%2c0.85-2.05%2c2.38-2.34%2c2.26 c0%2c0%2c0.04-0.36%2c0.16-0.64c0.12-0.28%2c1.25-1.81%2c1.73-3.59c0.48-1.77%2c0.6-2.86%2c0.64-3.99C216.72%2c45.7%2c215.99%2c41.55%2c215.95%2c40.66z '%3e%3c/path%3e%3cpath class='unep_0' d='M219.34%2c46.1c0%2c0-0.25-0.59-0.04-1.01c0.12-0.24%2c0.24-2.18-0.48-3.75c-0.72-1.57-2.3-5.92-2.18-8.82 c0.12-2.9%2c0.44-3.3%2c0.44-3.3s0.81%2c2.38%2c1.05%2c2.78c0.24%2c0.4%2c2.66%2c4.67%2c2.46%2c7.01c-0.2%2c2.34-0.32%2c3.06-0.2%2c3.1 c0.12%2c0.04%2c0.4-0.28%2c0.44-0.56c0.04-0.28%2c0.44-1.89%2c1.21-3.79c0.77-1.89%2c3.87-6.08%2c4.55-8.86c0%2c0%2c1.01%2c4.83-1.69%2c9.35 c-2.7%2c4.51-2.98%2c3.5-4.11%2c5.56C219.66%2c45.86%2c219.5%2c46.1%2c219.34%2c46.1z'%3e%3c/path%3e%3cpath class='unep_0' d='M221.79%2c33.33c-0.2-0.04-0.08-1.89-0.56-2.5c-0.48-0.6-4.63-5.52-5.52-10.43c0%2c0%2c2.62%2c2.66%2c3.06%2c2.94 c0.44%2c0.28%2c2.22%2c2.05%2c2.74%2c3.59c0.52%2c1.53%2c0.4%2c2.82%2c0.6%2c2.86c0.2%2c0.04%2c0.2-1.69%2c0.2-1.69s0.04-3.38%2c0.32-5 c0.28-1.61%2c1.01-4.31%2c0.69-5.68c0%2c0%2c1.57%2c2.5%2c1.49%2c6.04c-0.08%2c3.55-1.57%2c6.37-1.77%2c6.77c-0.2%2c0.4-0.77%2c2.14-0.77%2c2.5 C222.28%2c33.09%2c221.79%2c33.33%2c221.79%2c33.33z'%3e%3c/path%3e%3cpath class='unep_0' d='M216.88%2c8.11c0%2c0%2c5.44%2c3.22%2c4.59%2c14.02c0%2c0%2c0%2c0.48-0.32-0.04c-0.32-0.52-1.49-2.01-2.01-2.34 c-0.52-0.32-5.36-3.26-7.41-7.78c0%2c0%2c0.32-0.08%2c0.81%2c0.36c0.48%2c0.44%2c1.97%2c1.21%2c2.22%2c1.33c0.24%2c0.12%2c1.93%2c0.56%2c3.18%2c1.93 c1.25%2c1.37%2c1.69%2c2.38%2c2.05%2c3.18c0%2c0%2c0.36%2c0.28%2c0.12-0.52c-0.24-0.81-0.28-1.33-0.93-2.34c-0.64-1.01-1.21-2.82-1.29-4.07 C217.81%2c10.61%2c217.44%2c8.75%2c216.88%2c8.11z'%3e%3c/path%3e%3cpath class='unep_0' d='M215.95%2c11.9c0%2c0%2c0.12-0.73-0.4-1.73c-0.52-1.01-0.11-2.13-1.77-4.79c-0.93-1.49-4.15-2.66-4.15-2.66 s0.93%2c1.29%2c1.53%2c2.01c0.6%2c0.73%2c0.81%2c1.25%2c1.01%2c1.61s1.32%2c1.44%2c1.73%2c2.05c0.08%2c0.12%2c0.24%2c0.44%2c0.24%2c0.64s-0.44-0.12-0.56-0.24 c-0.12-0.12-2.09-1.61-3.34-1.85c-1.25-0.24-3.63-0.48-4.27-0.81c0%2c0%2c2.82%2c2.54%2c5.88%2c3.3C214.9%2c10.2%2c215.95%2c11.9%2c215.95%2c11.9z'%3e%3c/path%3e%3cpath class='unep_0' d='M209.59%2c5.25c0%2c0-2.82-3.83-7.86-3.75c0%2c0%2c0.28%2c0.28%2c0.85%2c0.4c0.56%2c0.12%2c1.57%2c1.13%2c2.09%2c1.45 C205.2%2c3.68%2c206.28%2c4.48%2c209.59%2c5.25z'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cpath class='unep_0' d='M54.96%2c0v47.33c0%2c4.14-0.69%2c7.79-2.07%2c10.96c-1.38%2c3.17-3.28%2c5.82-5.71%2c7.95c-2.43%2c2.13-5.33%2c3.74-8.69%2c4.83 c-3.37%2c1.08-7.03%2c1.63-11.01%2c1.63c-4.01%2c0-7.69-0.54-11.06-1.63c-3.37-1.08-6.26-2.69-8.69-4.83c-2.43-2.13-4.33-4.79-5.69-7.95 C0.68%2c55.12%2c0%2c51.47%2c0%2c47.33V0h14.78v47.33c0%2c4.7%2c1.12%2c8.12%2c3.37%2c10.27c2.25%2c2.15%2c5.36%2c3.23%2c9.33%2c3.23c4.01%2c0%2c7.12-1.07%2c9.33-3.23 c2.22-2.15%2c3.32-5.57%2c3.32-10.27V0H54.96z'%3e%3c/path%3e%3cpath class='unep_0' d='M125.39%2c71.71h-14.77L81.86%2c24.53v47.18H67.08V0h14.77l28.81%2c47.28V0h14.73V71.71z'%3e%3c/path%3e%3cg%3e%3cpath class='unep_0' d='M10.66%2c118.03c-3.1%2c0-5.63-0.97-7.58-2.91s-2.92-4.53-2.92-7.76v-0.56c0-2.17%2c0.41-4.1%2c1.23-5.81 c0.82-1.71%2c1.98-3.03%2c3.49-3.95c1.5-0.92%2c3.22-1.39%2c5.15-1.39c2.89%2c0%2c5.17%2c0.93%2c6.83%2c2.79c1.66%2c1.86%2c2.49%2c4.5%2c2.49%2c7.92v2.35H5.89 c0.18%2c1.41%2c0.73%2c2.54%2c1.65%2c3.39c0.92%2c0.85%2c2.08%2c1.28%2c3.49%2c1.28c2.18%2c0%2c3.88-0.8%2c5.1-2.41l2.77%2c3.17 c-0.85%2c1.22-1.99%2c2.18-3.44%2c2.86C14.02%2c117.69%2c12.42%2c118.03%2c10.66%2c118.03z M10.02%2c100.3c-1.12%2c0-2.03%2c0.39-2.73%2c1.16 c-0.7%2c0.78-1.14%2c1.88-1.34%2c3.33h7.86v-0.46c-0.03-1.28-0.37-2.27-1.02-2.97C12.14%2c100.65%2c11.22%2c100.3%2c10.02%2c100.3z'%3e%3c/path%3e%3cpath class='unep_0' d='M28.01%2c96.06l0.18%2c2.49c1.51-1.93%2c3.54-2.89%2c6.08-2.89c2.24%2c0%2c3.91%2c0.67%2c5%2c2.01s1.66%2c3.35%2c1.68%2c6.02v13.94 H35.3v-13.8c0-1.22-0.26-2.11-0.78-2.66c-0.52-0.55-1.39-0.83-2.6-0.83c-1.59%2c0-2.78%2c0.69-3.58%2c2.07v15.22h-5.65V96.06H28.01z'%3e%3c/path%3e%3cpath class='unep_0' d='M53.39%2c110.59l3.93-14.54h5.9l-7.14%2c21.58h-5.39l-7.14-21.58h5.9L53.39%2c110.59z'%3e%3c/path%3e%3cpath class='unep_0' d='M65.91%2c90.47c0-0.86%2c0.28-1.58%2c0.85-2.14c0.57-0.56%2c1.34-0.84%2c2.32-0.84c0.96%2c0%2c1.73%2c0.28%2c2.31%2c0.84 c0.57%2c0.56%2c0.86%2c1.27%2c0.86%2c2.14c0%2c0.88-0.29%2c1.59-0.87%2c2.15c-0.58%2c0.56-1.35%2c0.84-2.3%2c0.84c-0.95%2c0-1.72-0.28-2.3-0.84 C66.2%2c92.07%2c65.91%2c91.35%2c65.91%2c90.47z M71.91%2c117.63h-5.67V96.06h5.67V117.63z'%3e%3c/path%3e%3cpath class='unep_0' d='M88.69%2c101.46c-0.77-0.11-1.45-0.16-2.03-0.16c-2.14%2c0-3.54%2c0.74-4.2%2c2.21v14.12h-5.65V96.06h5.34l0.16%2c2.57 c1.13-1.98%2c2.7-2.97%2c4.71-2.97c0.63%2c0%2c1.21%2c0.09%2c1.76%2c0.26L88.69%2c101.46z'%3e%3c/path%3e%3cpath class='unep_0' d='M90.07%2c106.65c0-2.14%2c0.4-4.05%2c1.21-5.72c0.81-1.68%2c1.97-2.97%2c3.49-3.89c1.52-0.92%2c3.28-1.38%2c5.29-1.38 c2.85%2c0%2c5.18%2c0.89%2c6.99%2c2.67c1.81%2c1.78%2c2.81%2c4.2%2c3.02%2c7.26l0.04%2c1.48c0%2c3.31-0.91%2c5.97-2.72%2c7.97c-1.81%2c2-4.24%2c3-7.29%2c3 c-3.05%2c0-5.48-1-7.3-2.99c-1.82-1.99-2.73-4.71-2.73-8.14V106.65z M95.72%2c107.05c0%2c2.05%2c0.38%2c3.62%2c1.13%2c4.7 c0.76%2c1.09%2c1.84%2c1.63%2c3.25%2c1.63c1.37%2c0%2c2.44-0.54%2c3.21-1.61c0.77-1.07%2c1.15-2.79%2c1.15-5.14c0-2.01-0.38-3.57-1.15-4.67 c-0.77-1.1-1.85-1.66-3.25-1.66c-1.38%2c0-2.45%2c0.55-3.21%2c1.65C96.1%2c103.05%2c95.72%2c104.75%2c95.72%2c107.05z'%3e%3c/path%3e%3cpath class='unep_0' d='M119.03%2c96.06l0.18%2c2.49c1.51-1.93%2c3.54-2.89%2c6.08-2.89c2.24%2c0%2c3.91%2c0.67%2c5%2c2.01s1.66%2c3.35%2c1.68%2c6.02v13.94 h-5.65v-13.8c0-1.22-0.26-2.11-0.78-2.66c-0.52-0.55-1.39-0.83-2.6-0.83c-1.59%2c0-2.78%2c0.69-3.58%2c2.07v15.22h-5.65V96.06H119.03z'%3e%3c/path%3e%3cpath class='unep_0' d='M141.79%2c96.06l0.18%2c2.41c1.5-1.88%2c3.53-2.81%2c6.08-2.81c2.72%2c0%2c4.59%2c1.1%2c5.61%2c3.29 c1.48-2.19%2c3.6-3.29%2c6.35-3.29c2.29%2c0%2c4%2c0.68%2c5.12%2c2.04c1.12%2c1.36%2c1.68%2c3.41%2c1.68%2c6.15v13.78h-5.67v-13.76 c0-1.22-0.23-2.12-0.7-2.68c-0.47-0.57-1.3-0.85-2.48-0.85c-1.69%2c0-2.87%2c0.82-3.52%2c2.47l0.02%2c14.82h-5.65v-13.74 c0-1.25-0.24-2.15-0.72-2.71c-0.48-0.56-1.3-0.84-2.46-0.84c-1.6%2c0-2.76%2c0.68-3.48%2c2.03v15.26h-5.65V96.06H141.79z'%3e%3c/path%3e%3cpath class='unep_0' d='M181.13%2c118.03c-3.1%2c0-5.63-0.97-7.58-2.91c-1.95-1.94-2.92-4.53-2.92-7.76v-0.56c0-2.17%2c0.41-4.1%2c1.23-5.81 c0.82-1.71%2c1.98-3.03%2c3.49-3.95c1.5-0.92%2c3.22-1.39%2c5.15-1.39c2.89%2c0%2c5.17%2c0.93%2c6.83%2c2.79c1.66%2c1.86%2c2.49%2c4.5%2c2.49%2c7.92v2.35 h-13.47c0.18%2c1.41%2c0.73%2c2.54%2c1.65%2c3.39c0.92%2c0.85%2c2.08%2c1.28%2c3.49%2c1.28c2.18%2c0%2c3.88-0.8%2c5.1-2.41l2.77%2c3.17 c-0.85%2c1.22-1.99%2c2.18-3.44%2c2.86C184.5%2c117.69%2c182.89%2c118.03%2c181.13%2c118.03z M180.49%2c100.3c-1.12%2c0-2.03%2c0.39-2.73%2c1.16 c-0.7%2c0.78-1.14%2c1.88-1.34%2c3.33h7.86v-0.46c-0.03-1.28-0.37-2.27-1.02-2.97C182.61%2c100.65%2c181.69%2c100.3%2c180.49%2c100.3z'%3e%3c/path%3e%3cpath class='unep_0' d='M198.48%2c96.06l0.18%2c2.49c1.51-1.93%2c3.54-2.89%2c6.08-2.89c2.24%2c0%2c3.91%2c0.67%2c5%2c2.01s1.66%2c3.35%2c1.68%2c6.02v13.94 h-5.65v-13.8c0-1.22-0.26-2.11-0.78-2.66c-0.52-0.55-1.39-0.83-2.6-0.83c-1.59%2c0-2.78%2c0.69-3.58%2c2.07v15.22h-5.65V96.06H198.48z'%3e%3c/path%3e%3cpath class='unep_0' d='M222.71%2c90.75v5.31h3.62v4.23h-3.62v10.77c0%2c0.8%2c0.15%2c1.37%2c0.45%2c1.71c0.3%2c0.35%2c0.87%2c0.52%2c1.72%2c0.52 c0.62%2c0%2c1.18-0.05%2c1.66-0.14v4.37c-1.11%2c0.35-2.25%2c0.52-3.42%2c0.52c-3.96%2c0-5.98-2.04-6.06-6.12v-11.63h-3.09v-4.23h3.09v-5.31 H222.71z'%3e%3c/path%3e%3c/g%3e%3cg%3e%3cpath class='unep_0' d='M19.97%2c145.86c0%2c3.32-0.74%2c5.99-2.22%2c7.99c-1.48%2c2-3.48%2c3-5.99%2c3c-2.14%2c0-3.87-0.76-5.18-2.27v10.17H0.93 v-29.87h5.24l0.2%2c2.11c1.37-1.68%2c3.15-2.51%2c5.36-2.51c2.61%2c0%2c4.63%2c0.99%2c6.08%2c2.95c1.45%2c1.97%2c2.17%2c4.68%2c2.17%2c8.14V145.86z M14.32%2c145.44c0-2.01-0.35-3.56-1.05-4.65c-0.7-1.09-1.71-1.64-3.04-1.64c-1.77%2c0-2.99%2c0.69-3.66%2c2.07v8.84 c0.69%2c1.42%2c1.92%2c2.13%2c3.69%2c2.13C12.97%2c152.2%2c14.32%2c149.94%2c14.32%2c145.44z'%3e%3c/path%3e%3cpath class='unep_0' d='M35.6%2c140.27c-0.77-0.11-1.45-0.16-2.03-0.16c-2.14%2c0-3.54%2c0.74-4.2%2c2.21v14.12h-5.65v-21.58h5.34l0.16%2c2.57 c1.13-1.98%2c2.7-2.97%2c4.71-2.97c0.63%2c0%2c1.21%2c0.09%2c1.76%2c0.26L35.6%2c140.27z'%3e%3c/path%3e%3cpath class='unep_0' d='M36.97%2c145.46c0-2.14%2c0.4-4.05%2c1.21-5.72c0.81-1.68%2c1.97-2.97%2c3.49-3.89c1.52-0.92%2c3.28-1.38%2c5.29-1.38 c2.85%2c0%2c5.18%2c0.89%2c6.99%2c2.67c1.81%2c1.78%2c2.81%2c4.2%2c3.02%2c7.26l0.04%2c1.48c0%2c3.31-0.91%2c5.97-2.72%2c7.97c-1.81%2c2-4.24%2c3-7.29%2c3 s-5.48-1-7.3-2.99c-1.82-1.99-2.73-4.71-2.73-8.14V145.46z M42.62%2c145.87c0%2c2.05%2c0.38%2c3.62%2c1.13%2c4.7 c0.76%2c1.09%2c1.84%2c1.63%2c3.25%2c1.63c1.37%2c0%2c2.44-0.54%2c3.21-1.61c0.77-1.07%2c1.15-2.79%2c1.15-5.14c0-2.01-0.38-3.57-1.15-4.67 c-0.77-1.1-1.85-1.66-3.25-1.66c-1.38%2c0-2.45%2c0.55-3.21%2c1.65C43%2c141.86%2c42.62%2c143.56%2c42.62%2c145.87z'%3e%3c/path%3e%3cpath class='unep_0' d='M59.91%2c145.5c0-3.31%2c0.77-5.98%2c2.31-8c1.55-2.02%2c3.63-3.03%2c6.25-3.03c2.32%2c0%2c4.12%2c0.81%2c5.42%2c2.43l0.23-2.03 h5.12v20.86c0%2c1.89-0.42%2c3.53-1.26%2c4.93c-0.84%2c1.4-2.02%2c2.46-3.55%2c3.19s-3.31%2c1.1-5.36%2c1.1c-1.55%2c0-3.06-0.32-4.54-0.95 c-1.47-0.63-2.59-1.45-3.34-2.44l2.5-3.51c1.41%2c1.61%2c3.11%2c2.41%2c5.12%2c2.41c1.5%2c0%2c2.67-0.41%2c3.5-1.23c0.83-0.82%2c1.25-1.98%2c1.25-3.48 v-1.16c-1.3%2c1.5-3.02%2c2.25-5.14%2c2.25c-2.54%2c0-4.6-1.01-6.17-3.04c-1.57-2.03-2.36-4.72-2.36-8.07V145.5z M65.56%2c145.93 c0%2c1.96%2c0.38%2c3.49%2c1.15%2c4.6c0.77%2c1.11%2c1.82%2c1.67%2c3.17%2c1.67c1.72%2c0%2c2.95-0.66%2c3.69-1.98v-9.09c-0.76-1.32-1.97-1.98-3.66-1.98 c-1.35%2c0-2.42%2c0.57-3.2%2c1.7C65.95%2c141.98%2c65.56%2c143.68%2c65.56%2c145.93z'%3e%3c/path%3e%3cpath class='unep_0' d='M95.71%2c140.27c-0.77-0.11-1.45-0.16-2.03-0.16c-2.14%2c0-3.54%2c0.74-4.2%2c2.21v14.12h-5.65v-21.58h5.34l0.16%2c2.57 c1.13-1.98%2c2.7-2.97%2c4.71-2.97c0.63%2c0%2c1.21%2c0.09%2c1.76%2c0.26L95.71%2c140.27z'%3e%3c/path%3e%3cpath class='unep_0' d='M110.34%2c156.45c-0.26-0.52-0.45-1.16-0.57-1.93c-1.37%2c1.56-3.15%2c2.33-5.34%2c2.33c-2.07%2c0-3.79-0.61-5.15-1.83 c-1.36-1.22-2.04-2.77-2.04-4.63c0-2.29%2c0.83-4.04%2c2.49-5.26c1.66-1.22%2c4.06-1.84%2c7.2-1.86h2.6v-1.24c0-1-0.25-1.8-0.75-2.39 c-0.5-0.6-1.29-0.9-2.38-0.9c-0.95%2c0-1.7%2c0.23-2.24%2c0.7c-0.54%2c0.46-0.81%2c1.1-0.81%2c1.91h-5.65c0-1.25%2c0.38-2.41%2c1.13-3.47 c0.76-1.07%2c1.83-1.9%2c3.21-2.5c1.38-0.61%2c2.93-0.91%2c4.65-0.91c2.61%2c0%2c4.68%2c0.67%2c6.21%2c2.01c1.53%2c1.34%2c2.3%2c3.21%2c2.3%2c5.63v9.35 c0.01%2c2.05%2c0.29%2c3.6%2c0.84%2c4.65v0.34H110.34z M105.67%2c152.44c0.83%2c0%2c1.6-0.19%2c2.31-0.57c0.7-0.38%2c1.22-0.89%2c1.56-1.53v-3.71h-2.11 c-2.83%2c0-4.33%2c1-4.52%2c2.99l-0.02%2c0.34c0%2c0.72%2c0.25%2c1.31%2c0.74%2c1.77C104.13%2c152.21%2c104.81%2c152.44%2c105.67%2c152.44z'%3e%3c/path%3e%3cpath class='unep_0' d='M125.09%2c134.87l0.18%2c2.41c1.5-1.88%2c3.53-2.81%2c6.08-2.81c2.72%2c0%2c4.59%2c1.1%2c5.61%2c3.29 c1.48-2.19%2c3.6-3.29%2c6.35-3.29c2.29%2c0%2c4%2c0.68%2c5.12%2c2.04c1.12%2c1.36%2c1.68%2c3.41%2c1.68%2c6.15v13.78h-5.67v-13.76 c0-1.22-0.23-2.12-0.7-2.68c-0.47-0.57-1.3-0.85-2.48-0.85c-1.69%2c0-2.87%2c0.82-3.52%2c2.47l0.02%2c14.82h-5.65v-13.74 c0-1.25-0.24-2.15-0.72-2.71c-0.48-0.56-1.3-0.84-2.46-0.84c-1.6%2c0-2.76%2c0.68-3.48%2c2.03v15.26h-5.65v-21.58H125.09z'%3e%3c/path%3e%3cpath class='unep_0' d='M159.99%2c134.87l0.18%2c2.41c1.5-1.88%2c3.53-2.81%2c6.08-2.81c2.72%2c0%2c4.59%2c1.1%2c5.61%2c3.29 c1.48-2.19%2c3.6-3.29%2c6.35-3.29c2.29%2c0%2c4%2c0.68%2c5.12%2c2.04c1.12%2c1.36%2c1.68%2c3.41%2c1.68%2c6.15v13.78h-5.67v-13.76 c0-1.22-0.23-2.12-0.7-2.68c-0.47-0.57-1.3-0.85-2.48-0.85c-1.69%2c0-2.87%2c0.82-3.52%2c2.47l0.02%2c14.82h-5.65v-13.74 c0-1.25-0.24-2.15-0.72-2.71c-0.48-0.56-1.3-0.84-2.46-0.84c-1.6%2c0-2.76%2c0.68-3.48%2c2.03v15.26h-5.65v-21.58H159.99z'%3e%3c/path%3e%3cpath class='unep_0' d='M199.33%2c156.84c-3.1%2c0-5.63-0.97-7.58-2.91c-1.95-1.94-2.92-4.53-2.92-7.76v-0.56c0-2.17%2c0.41-4.1%2c1.23-5.81 c0.82-1.71%2c1.98-3.03%2c3.49-3.95c1.5-0.92%2c3.22-1.39%2c5.15-1.39c2.89%2c0%2c5.17%2c0.93%2c6.83%2c2.79s2.49%2c4.5%2c2.49%2c7.92v2.35h-13.47 c0.18%2c1.41%2c0.73%2c2.54%2c1.65%2c3.39c0.92%2c0.85%2c2.08%2c1.28%2c3.49%2c1.28c2.18%2c0%2c3.88-0.8%2c5.1-2.41l2.77%2c3.17 c-0.85%2c1.22-1.99%2c2.18-3.44%2c2.86C202.7%2c156.5%2c201.09%2c156.84%2c199.33%2c156.84z M198.69%2c139.12c-1.12%2c0-2.03%2c0.39-2.73%2c1.16 c-0.7%2c0.78-1.14%2c1.88-1.34%2c3.33h7.86v-0.46c-0.03-1.28-0.37-2.27-1.02-2.97C200.81%2c139.47%2c199.89%2c139.12%2c198.69%2c139.12z'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

    var img = "data:image/svg+xml,%3csvg version='1.1' id='unep-logo--white' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 226.77 164.94' style='enable-background:new 0 0 226.77 164.94%3b' xml:space='preserve'%3e%3cstyle type='text/css'%3e .unep_0 %7b fill: white%3b %7d %3c/style%3e%3cg%3e%3cg%3e%3cg%3e%3cg%3e%3cg%3e%3cg%3e%3cpath class='unep_0' d='M178.88%2c57.2c-8.97-2.71-15.5-11.04-15.5-20.89c0-1.78%2c0.21-3.51%2c0.61-5.16l14.17%2c1.82 c0%2c0%2c5.44%2c0.24%2c5.24%2c9.87C183.21%2c52.18%2c178.88%2c57.2%2c178.88%2c57.2z'%3e%3c/path%3e%3cpath class='unep_0' d='M191.55%2c57.2c8.97-2.71%2c15.5-11.04%2c15.5-20.89c0-1.78-0.21-3.51-0.61-5.16l-14.17%2c1.82 c0%2c0-5.44%2c0.24-5.24%2c9.87C187.22%2c52.18%2c191.55%2c57.2%2c191.55%2c57.2z'%3e%3c/path%3e%3cpath class='unep_0' d='M185.21%2c20.69c1.82%2c0%2c3.3%2c1.48%2c3.3%2c3.3c0%2c1.42-0.98%2c2.48-2.16%2c3.11c-0.14%2c0.08-0.28%2c0.14-0.25%2c0.37 c0.03%2c0.23%2c0.71%2c0.36%2c1%2c0.43l19.05%2c2.21c-2.67-9.03-11.03-15.62-20.93-15.62h-0.03c-9.9%2c0-18.25%2c6.59-20.93%2c15.62l19.05-2.21 c0.29-0.07%2c0.97-0.19%2c1-0.43c0.03-0.22-0.11-0.29-0.25-0.37c-1.18-0.63-2.16-1.69-2.16-3.11 C181.91%2c22.17%2c183.39%2c20.69%2c185.21%2c20.69L185.21%2c20.69z'%3e%3c/path%3e%3c/g%3e%3cg%3e%3cpath class='unep_0' d='M193.92%2c72.65l1.29-0.81c0%2c0-6.12-8.3-19.82-8.3c-7.01%2c0-10.64%2c2.82-15.55%2c2.82c0%2c0-2.01%2c0.24-3.95-0.97 c0%2c0%2c2.34%2c3.38%2c10.8%2c3.38c6.2%2c0%2c10.64-3.63%2c14.99-3.63C187.63%2c65.15%2c192.06%2c70.47%2c193.92%2c72.65z'%3e%3c/path%3e%3c/g%3e%3cg%3e%3cpath class='unep_0' d='M174.9%2c72.65l-1.29-0.81c0%2c0%2c6.12-8.3%2c19.82-8.3c7.01%2c0%2c10.64%2c2.82%2c15.55%2c2.82c0%2c0%2c2.01%2c0.24%2c3.95-0.97 c0%2c0-2.34%2c3.38-10.8%2c3.38c-6.2%2c0-10.64-3.63-14.99-3.63C181.19%2c65.15%2c176.75%2c70.47%2c174.9%2c72.65z'%3e%3c/path%3e%3c/g%3e%3cpath class='unep_0' d='M168.37%2c62.82c-0.24%2c0.64-2.86-0.12-4.63%2c0.4c-1.98%2c0.59-12.45%2c1.85-17.04-9.02c0%2c0%2c4.35%2c4.67%2c7.74%2c5 c3.38%2c0.32%2c7.09%2c1.13%2c10.23%2c2.9l0.73%2c0.16c0%2c0-0.1-0.32-0.4-0.48c-0.41-0.22-3.67-1.28-5.24-6.45 c-0.81-2.66-0.64-4.59-0.97-5.96c0%2c0%2c3.55%2c3.95%2c5%2c6.45C165.23%2c58.31%2c165.39%2c61.13%2c168.37%2c62.82z'%3e%3c/path%3e%3cpath class='unep_0' d='M157.7%2c57.34c-0.26%2c0.26-0.93-0.16-1.17-0.28c-0.24-0.12-1.98-0.92-4.96-1.97 c-2.94-1.05-8.42-5.68-7.9-13.62c0%2c0%2c0.77%2c2.98%2c3.02%2c4.96c2.26%2c1.97%2c3.06%2c2.22%2c4.43%2c3.83c1.37%2c1.61%2c4.47%2c5.28%2c4.59%2c5.24 c0.12-0.04%2c0.16-0.24-0.08-0.44c-0.24-0.2-1.05-2.22-1.57-2.9c-0.52-0.68-2.09-5.4%2c0.2-11.2c0%2c0%2c2.46%2c4.23%2c2.3%2c8.5 c-0.16%2c4.27-0.36%2c3.26%2c0.68%2c6.81C157.25%2c56.25%2c157.82%2c57.22%2c157.7%2c57.34z'%3e%3c/path%3e%3cpath class='unep_0' d='M150.85%2c46.99c-0.15%2c0.15-0.77-0.77-1.25-1.61c-0.48-0.85-3.87-4.47-4.31-5.2 c-0.44-0.73-4.23-5.32-1.37-12.13c0%2c0%2c0.28-0.08%2c0.28%2c1.53s1.49%2c5.2%2c2.7%2c6.73c1.21%2c1.53%2c2.3%2c3.99%2c2.54%2c6.61 c0%2c0%2c0.16%2c0.48%2c0.36%2c0.52s0.2-0.48%2c0.2-0.48s-0.16-2.42-0.16-4.07c0-1.65%2c0.73-4.47%2c2.3-6.08c0%2c0%2c0.73-0.81%2c1.17-1.77 c0%2c0%2c0.28-0.64%2c0.68-0.97c0%2c0%2c0.32%2c4.63-1.25%2c8.94c-1.57%2c4.31-2.09%2c5.04-1.85%2c7.37C150.89%2c46.38%2c150.93%2c46.9%2c150.85%2c46.99z'%3e%3c/path%3e%3cpath class='unep_0' d='M148.19%2c34.25c-0.16%2c0-0.28-0.56-0.36-1.01c-0.08-0.44-0.56-3.02-0.89-3.59 c-0.32-0.56-1.53-3.14-1.57-6.16c-0.04-3.02%2c1.33-7.13%2c4.39-10.39c0%2c0-0.12%2c0.97-0.93%2c3.1c-0.81%2c2.14-0.32%2c4.15-0.24%2c4.51 c0.08%2c0.36%2c0.36%2c2.86%2c0.36%2c4.03c0%2c0.93-0.24%2c4.11-0.44%2c4.75c0%2c0-0.08%2c0.44%2c0.08%2c0.44c0.16%2c0%2c0.32-0.36%2c0.32-0.36 s0.16-2.5%2c2.01-4.75c1.85-2.26%2c5.2-3.63%2c5.72-4.63c0%2c0-0.24%2c3.55-4.15%2c7.69c-3.48%2c3.7-2.46%2c1.81-3.59%2c4.83 c0%2c0-0.48%2c1.13-0.48%2c1.37C148.43%2c34.34%2c148.19%2c34.25%2c148.19%2c34.25z'%3e%3c/path%3e%3cpath class='unep_0' d='M150.33%2c22.33c0%2c0-0.08-0.48%2c0.52-1.57c0.6-1.09-0.04-3.02%2c0.77-5.84s2.3-7.65%2c7.98-10.55 c0%2c0-0.56%2c0.52-0.85%2c0.93c-0.28%2c0.4-1.81%2c3.3-2.26%2c5.32c-0.44%2c2.01-2.38%2c5.4-3.1%2c6.16c-0.73%2c0.77-0.4%2c0.85-0.4%2c0.85 s0.36-0.08%2c0.73-0.64c0.36-0.56%2c2.22-2.66%2c4.27-3.14c2.05-0.48%2c5.32-1.45%2c5.52-1.65c0%2c0-3.55%2c3.63-6.81%2c5.48 s-3.63%2c1.29-5.56%2c3.79C151.13%2c21.44%2c150.49%2c22.33%2c150.33%2c22.33z'%3e%3c/path%3e%3cpath class='unep_0' d='M158.14%2c11.57c0%2c0%2c0-0.32%2c0.6-0.89c0.6-0.56%2c1.21-2.26%2c2.26-3.83c1.05-1.57%2c3.42-5.68%2c9.59-6.65 c0%2c0-1.85%2c1.37-2.14%2c1.81c-0.28%2c0.44-2.09%2c2.82-2.9%2c3.63s-3.1%2c2.5-3.87%2c2.86c0%2c0-0.4%2c0.32-0.32%2c0.44 c0.08%2c0.12%2c0.48-0.12%2c0.48-0.12s2.14-1.65%2c4.71-1.73c2.58-0.08%2c5.28%2c0.04%2c5.68%2c0.08c0%2c0-2.42%2c1.65-8.18%2c2.7 c-5.76%2c1.05-4.67%2c1.09-5.56%2c1.65C158.5%2c11.53%2c158.3%2c11.69%2c158.14%2c11.57z'%3e%3c/path%3e%3cpath class='unep_0' d='M168.41%2c4.89c0%2c0%2c0.12-0.32%2c1.05-0.6c0.93-0.28%2c0.85-1.17%2c3.67-2.66c2.82-1.49%2c5.76-2.18%2c8.74-0.93 c0%2c0-1.25%2c0.16-1.45%2c0.24s-2.34%2c0.64-2.94%2c0.97c-0.6%2c0.32-3.71%2c1.69-4.96%2c1.93c-1.25%2c0.24-0.64%2c0.32-0.64%2c0.32 s0.28%2c0.12%2c0.52%2c0.12c0.24%2c0%2c3.02-0.28%2c4.83%2c0.36c1.81%2c0.64%2c1.77%2c0.89%2c2.5%2c1.13c0.73%2c0.24%2c1.57%2c0.4%2c1.69%2c0.68 c0%2c0-1.81%2c0.16-2.9%2c0.16c-1.09%2c0-3.95-0.28-5.32-0.93c-1.37-0.64-2.94-0.93-3.46-0.81C169.22%2c5.01%2c168.58%2c5.01%2c168.41%2c4.89z'%3e%3c/path%3e%3cpath class='unep_0' d='M179.86%2c3.48c0%2c0%2c0.12-0.16%2c0.93-0.32c0.81-0.16%2c1.01-0.64%2c2.9-1.05s4.83-0.77%2c7.53%2c1.09 c0%2c0-1.65-0.04-2.01-0.04s-3.5%2c0.56-4.23%2c0.56c-0.73%2c0-2.18-0.32-2.38-0.08c-0.2%2c0.24%2c1.33%2c0.56%2c1.57%2c0.64 c0.24%2c0.08%2c1.33%2c0.16%2c2.7%2c1.49c1.37%2c1.33%2c2.34%2c2.05%2c2.5%2c2.14c0%2c0-4.03-0.93-5.04-1.49s-2.74-2.3-3.02-2.42 C181.02%2c3.88%2c179.86%2c3.48%2c179.86%2c3.48z'%3e%3c/path%3e%3cpath class='unep_0' d='M189.16%2c5.13c0%2c0%2c2.54-0.08%2c4.39%2c1.09s3.34%2c2.7%2c3.5%2c3.63c0%2c0-1.05-0.89-1.73-1.09 c-0.69-0.2-2.62-1.29-3.02-1.53S189.56%2c5.49%2c189.16%2c5.13z'%3e%3c/path%3e%3cpath class='unep_0' d='M201.09%2c63.26c0%2c0%2c0.36-0.36%2c1.57-1.41c1.21-1.05%2c1.53-2.58%2c2.86-4.96c1.33-2.38%2c2.46-4.03%2c5.16-6.45 c0%2c0-0.48%2c1.81-0.52%2c2.38c-0.04%2c0.56-0.48%2c3.71-2.01%2c5.52c-1.53%2c1.81-1.61%2c2.22-3.38%2c3.3c0%2c0-0.69%2c0.48-0.64%2c0.64 c0.04%2c0.16%2c1.21-0.04%2c1.21-0.04s1.29-0.48%2c1.69-0.73c0.4-0.24%2c2.22-1.17%2c2.94-1.45c0.73-0.28%2c1.33-0.56%2c2.94-1.05 c1.61-0.48%2c7.45-1.97%2c9.75-5.68c0%2c0-0.68%2c2.18-1.53%2c3.18c-0.85%2c1.01-5.64%2c7.33-12.29%2c7.21c0%2c0-2.62-0.2-3.99-0.44 c-1.37-0.24-1.85-0.24-2.05-0.2C202.58%2c63.14%2c201.29%2c63.38%2c201.09%2c63.26z'%3e%3c/path%3e%3cpath class='unep_0' d='M215.95%2c40.66c0%2c0-2.5%2c3.91-3.06%2c9.55c-0.56%2c5.64%2c0.4%2c3.95-0.52%2c6.45c0%2c0-0.32%2c0.64-0.2%2c0.68 c0.12%2c0.04%2c0.6-0.24%2c2.38-1.33c1.77-1.09%2c3.51-0.77%2c7.29-4.39c3.79-3.63%2c4.55-10.84%2c4.63-11.44c0%2c0-0.56%2c0.56-0.85%2c1.53 c-0.28%2c0.97-0.89%2c1.73-1.01%2c1.85c-0.12%2c0.12-4.23%2c4.63-4.71%2c5.04c-0.48%2c0.4-2.9%2c3.34-3.42%2c4.19c-0.52%2c0.85-2.05%2c2.38-2.34%2c2.26 c0%2c0%2c0.04-0.36%2c0.16-0.64c0.12-0.28%2c1.25-1.81%2c1.73-3.59c0.48-1.77%2c0.6-2.86%2c0.64-3.99C216.72%2c45.7%2c215.99%2c41.55%2c215.95%2c40.66z '%3e%3c/path%3e%3cpath class='unep_0' d='M219.34%2c46.1c0%2c0-0.25-0.59-0.04-1.01c0.12-0.24%2c0.24-2.18-0.48-3.75c-0.72-1.57-2.3-5.92-2.18-8.82 c0.12-2.9%2c0.44-3.3%2c0.44-3.3s0.81%2c2.38%2c1.05%2c2.78c0.24%2c0.4%2c2.66%2c4.67%2c2.46%2c7.01c-0.2%2c2.34-0.32%2c3.06-0.2%2c3.1 c0.12%2c0.04%2c0.4-0.28%2c0.44-0.56c0.04-0.28%2c0.44-1.89%2c1.21-3.79c0.77-1.89%2c3.87-6.08%2c4.55-8.86c0%2c0%2c1.01%2c4.83-1.69%2c9.35 c-2.7%2c4.51-2.98%2c3.5-4.11%2c5.56C219.66%2c45.86%2c219.5%2c46.1%2c219.34%2c46.1z'%3e%3c/path%3e%3cpath class='unep_0' d='M221.79%2c33.33c-0.2-0.04-0.08-1.89-0.56-2.5c-0.48-0.6-4.63-5.52-5.52-10.43c0%2c0%2c2.62%2c2.66%2c3.06%2c2.94 c0.44%2c0.28%2c2.22%2c2.05%2c2.74%2c3.59c0.52%2c1.53%2c0.4%2c2.82%2c0.6%2c2.86c0.2%2c0.04%2c0.2-1.69%2c0.2-1.69s0.04-3.38%2c0.32-5 c0.28-1.61%2c1.01-4.31%2c0.69-5.68c0%2c0%2c1.57%2c2.5%2c1.49%2c6.04c-0.08%2c3.55-1.57%2c6.37-1.77%2c6.77c-0.2%2c0.4-0.77%2c2.14-0.77%2c2.5 C222.28%2c33.09%2c221.79%2c33.33%2c221.79%2c33.33z'%3e%3c/path%3e%3cpath class='unep_0' d='M216.88%2c8.11c0%2c0%2c5.44%2c3.22%2c4.59%2c14.02c0%2c0%2c0%2c0.48-0.32-0.04c-0.32-0.52-1.49-2.01-2.01-2.34 c-0.52-0.32-5.36-3.26-7.41-7.78c0%2c0%2c0.32-0.08%2c0.81%2c0.36c0.48%2c0.44%2c1.97%2c1.21%2c2.22%2c1.33c0.24%2c0.12%2c1.93%2c0.56%2c3.18%2c1.93 c1.25%2c1.37%2c1.69%2c2.38%2c2.05%2c3.18c0%2c0%2c0.36%2c0.28%2c0.12-0.52c-0.24-0.81-0.28-1.33-0.93-2.34c-0.64-1.01-1.21-2.82-1.29-4.07 C217.81%2c10.61%2c217.44%2c8.75%2c216.88%2c8.11z'%3e%3c/path%3e%3cpath class='unep_0' d='M215.95%2c11.9c0%2c0%2c0.12-0.73-0.4-1.73c-0.52-1.01-0.11-2.13-1.77-4.79c-0.93-1.49-4.15-2.66-4.15-2.66 s0.93%2c1.29%2c1.53%2c2.01c0.6%2c0.73%2c0.81%2c1.25%2c1.01%2c1.61s1.32%2c1.44%2c1.73%2c2.05c0.08%2c0.12%2c0.24%2c0.44%2c0.24%2c0.64s-0.44-0.12-0.56-0.24 c-0.12-0.12-2.09-1.61-3.34-1.85c-1.25-0.24-3.63-0.48-4.27-0.81c0%2c0%2c2.82%2c2.54%2c5.88%2c3.3C214.9%2c10.2%2c215.95%2c11.9%2c215.95%2c11.9z'%3e%3c/path%3e%3cpath class='unep_0' d='M209.59%2c5.25c0%2c0-2.82-3.83-7.86-3.75c0%2c0%2c0.28%2c0.28%2c0.85%2c0.4c0.56%2c0.12%2c1.57%2c1.13%2c2.09%2c1.45 C205.2%2c3.68%2c206.28%2c4.48%2c209.59%2c5.25z'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cpath class='unep_0' d='M54.96%2c0v47.33c0%2c4.14-0.69%2c7.79-2.07%2c10.96c-1.38%2c3.17-3.28%2c5.82-5.71%2c7.95c-2.43%2c2.13-5.33%2c3.74-8.69%2c4.83 c-3.37%2c1.08-7.03%2c1.63-11.01%2c1.63c-4.01%2c0-7.69-0.54-11.06-1.63c-3.37-1.08-6.26-2.69-8.69-4.83c-2.43-2.13-4.33-4.79-5.69-7.95 C0.68%2c55.12%2c0%2c51.47%2c0%2c47.33V0h14.78v47.33c0%2c4.7%2c1.12%2c8.12%2c3.37%2c10.27c2.25%2c2.15%2c5.36%2c3.23%2c9.33%2c3.23c4.01%2c0%2c7.12-1.07%2c9.33-3.23 c2.22-2.15%2c3.32-5.57%2c3.32-10.27V0H54.96z'%3e%3c/path%3e%3cpath class='unep_0' d='M125.39%2c71.71h-14.77L81.86%2c24.53v47.18H67.08V0h14.77l28.81%2c47.28V0h14.73V71.71z'%3e%3c/path%3e%3cg%3e%3cpath class='unep_0' d='M10.66%2c118.03c-3.1%2c0-5.63-0.97-7.58-2.91s-2.92-4.53-2.92-7.76v-0.56c0-2.17%2c0.41-4.1%2c1.23-5.81 c0.82-1.71%2c1.98-3.03%2c3.49-3.95c1.5-0.92%2c3.22-1.39%2c5.15-1.39c2.89%2c0%2c5.17%2c0.93%2c6.83%2c2.79c1.66%2c1.86%2c2.49%2c4.5%2c2.49%2c7.92v2.35H5.89 c0.18%2c1.41%2c0.73%2c2.54%2c1.65%2c3.39c0.92%2c0.85%2c2.08%2c1.28%2c3.49%2c1.28c2.18%2c0%2c3.88-0.8%2c5.1-2.41l2.77%2c3.17 c-0.85%2c1.22-1.99%2c2.18-3.44%2c2.86C14.02%2c117.69%2c12.42%2c118.03%2c10.66%2c118.03z M10.02%2c100.3c-1.12%2c0-2.03%2c0.39-2.73%2c1.16 c-0.7%2c0.78-1.14%2c1.88-1.34%2c3.33h7.86v-0.46c-0.03-1.28-0.37-2.27-1.02-2.97C12.14%2c100.65%2c11.22%2c100.3%2c10.02%2c100.3z'%3e%3c/path%3e%3cpath class='unep_0' d='M28.01%2c96.06l0.18%2c2.49c1.51-1.93%2c3.54-2.89%2c6.08-2.89c2.24%2c0%2c3.91%2c0.67%2c5%2c2.01s1.66%2c3.35%2c1.68%2c6.02v13.94 H35.3v-13.8c0-1.22-0.26-2.11-0.78-2.66c-0.52-0.55-1.39-0.83-2.6-0.83c-1.59%2c0-2.78%2c0.69-3.58%2c2.07v15.22h-5.65V96.06H28.01z'%3e%3c/path%3e%3cpath class='unep_0' d='M53.39%2c110.59l3.93-14.54h5.9l-7.14%2c21.58h-5.39l-7.14-21.58h5.9L53.39%2c110.59z'%3e%3c/path%3e%3cpath class='unep_0' d='M65.91%2c90.47c0-0.86%2c0.28-1.58%2c0.85-2.14c0.57-0.56%2c1.34-0.84%2c2.32-0.84c0.96%2c0%2c1.73%2c0.28%2c2.31%2c0.84 c0.57%2c0.56%2c0.86%2c1.27%2c0.86%2c2.14c0%2c0.88-0.29%2c1.59-0.87%2c2.15c-0.58%2c0.56-1.35%2c0.84-2.3%2c0.84c-0.95%2c0-1.72-0.28-2.3-0.84 C66.2%2c92.07%2c65.91%2c91.35%2c65.91%2c90.47z M71.91%2c117.63h-5.67V96.06h5.67V117.63z'%3e%3c/path%3e%3cpath class='unep_0' d='M88.69%2c101.46c-0.77-0.11-1.45-0.16-2.03-0.16c-2.14%2c0-3.54%2c0.74-4.2%2c2.21v14.12h-5.65V96.06h5.34l0.16%2c2.57 c1.13-1.98%2c2.7-2.97%2c4.71-2.97c0.63%2c0%2c1.21%2c0.09%2c1.76%2c0.26L88.69%2c101.46z'%3e%3c/path%3e%3cpath class='unep_0' d='M90.07%2c106.65c0-2.14%2c0.4-4.05%2c1.21-5.72c0.81-1.68%2c1.97-2.97%2c3.49-3.89c1.52-0.92%2c3.28-1.38%2c5.29-1.38 c2.85%2c0%2c5.18%2c0.89%2c6.99%2c2.67c1.81%2c1.78%2c2.81%2c4.2%2c3.02%2c7.26l0.04%2c1.48c0%2c3.31-0.91%2c5.97-2.72%2c7.97c-1.81%2c2-4.24%2c3-7.29%2c3 c-3.05%2c0-5.48-1-7.3-2.99c-1.82-1.99-2.73-4.71-2.73-8.14V106.65z M95.72%2c107.05c0%2c2.05%2c0.38%2c3.62%2c1.13%2c4.7 c0.76%2c1.09%2c1.84%2c1.63%2c3.25%2c1.63c1.37%2c0%2c2.44-0.54%2c3.21-1.61c0.77-1.07%2c1.15-2.79%2c1.15-5.14c0-2.01-0.38-3.57-1.15-4.67 c-0.77-1.1-1.85-1.66-3.25-1.66c-1.38%2c0-2.45%2c0.55-3.21%2c1.65C96.1%2c103.05%2c95.72%2c104.75%2c95.72%2c107.05z'%3e%3c/path%3e%3cpath class='unep_0' d='M119.03%2c96.06l0.18%2c2.49c1.51-1.93%2c3.54-2.89%2c6.08-2.89c2.24%2c0%2c3.91%2c0.67%2c5%2c2.01s1.66%2c3.35%2c1.68%2c6.02v13.94 h-5.65v-13.8c0-1.22-0.26-2.11-0.78-2.66c-0.52-0.55-1.39-0.83-2.6-0.83c-1.59%2c0-2.78%2c0.69-3.58%2c2.07v15.22h-5.65V96.06H119.03z'%3e%3c/path%3e%3cpath class='unep_0' d='M141.79%2c96.06l0.18%2c2.41c1.5-1.88%2c3.53-2.81%2c6.08-2.81c2.72%2c0%2c4.59%2c1.1%2c5.61%2c3.29 c1.48-2.19%2c3.6-3.29%2c6.35-3.29c2.29%2c0%2c4%2c0.68%2c5.12%2c2.04c1.12%2c1.36%2c1.68%2c3.41%2c1.68%2c6.15v13.78h-5.67v-13.76 c0-1.22-0.23-2.12-0.7-2.68c-0.47-0.57-1.3-0.85-2.48-0.85c-1.69%2c0-2.87%2c0.82-3.52%2c2.47l0.02%2c14.82h-5.65v-13.74 c0-1.25-0.24-2.15-0.72-2.71c-0.48-0.56-1.3-0.84-2.46-0.84c-1.6%2c0-2.76%2c0.68-3.48%2c2.03v15.26h-5.65V96.06H141.79z'%3e%3c/path%3e%3cpath class='unep_0' d='M181.13%2c118.03c-3.1%2c0-5.63-0.97-7.58-2.91c-1.95-1.94-2.92-4.53-2.92-7.76v-0.56c0-2.17%2c0.41-4.1%2c1.23-5.81 c0.82-1.71%2c1.98-3.03%2c3.49-3.95c1.5-0.92%2c3.22-1.39%2c5.15-1.39c2.89%2c0%2c5.17%2c0.93%2c6.83%2c2.79c1.66%2c1.86%2c2.49%2c4.5%2c2.49%2c7.92v2.35 h-13.47c0.18%2c1.41%2c0.73%2c2.54%2c1.65%2c3.39c0.92%2c0.85%2c2.08%2c1.28%2c3.49%2c1.28c2.18%2c0%2c3.88-0.8%2c5.1-2.41l2.77%2c3.17 c-0.85%2c1.22-1.99%2c2.18-3.44%2c2.86C184.5%2c117.69%2c182.89%2c118.03%2c181.13%2c118.03z M180.49%2c100.3c-1.12%2c0-2.03%2c0.39-2.73%2c1.16 c-0.7%2c0.78-1.14%2c1.88-1.34%2c3.33h7.86v-0.46c-0.03-1.28-0.37-2.27-1.02-2.97C182.61%2c100.65%2c181.69%2c100.3%2c180.49%2c100.3z'%3e%3c/path%3e%3cpath class='unep_0' d='M198.48%2c96.06l0.18%2c2.49c1.51-1.93%2c3.54-2.89%2c6.08-2.89c2.24%2c0%2c3.91%2c0.67%2c5%2c2.01s1.66%2c3.35%2c1.68%2c6.02v13.94 h-5.65v-13.8c0-1.22-0.26-2.11-0.78-2.66c-0.52-0.55-1.39-0.83-2.6-0.83c-1.59%2c0-2.78%2c0.69-3.58%2c2.07v15.22h-5.65V96.06H198.48z'%3e%3c/path%3e%3cpath class='unep_0' d='M222.71%2c90.75v5.31h3.62v4.23h-3.62v10.77c0%2c0.8%2c0.15%2c1.37%2c0.45%2c1.71c0.3%2c0.35%2c0.87%2c0.52%2c1.72%2c0.52 c0.62%2c0%2c1.18-0.05%2c1.66-0.14v4.37c-1.11%2c0.35-2.25%2c0.52-3.42%2c0.52c-3.96%2c0-5.98-2.04-6.06-6.12v-11.63h-3.09v-4.23h3.09v-5.31 H222.71z'%3e%3c/path%3e%3c/g%3e%3cg%3e%3cpath class='unep_0' d='M19.97%2c145.86c0%2c3.32-0.74%2c5.99-2.22%2c7.99c-1.48%2c2-3.48%2c3-5.99%2c3c-2.14%2c0-3.87-0.76-5.18-2.27v10.17H0.93 v-29.87h5.24l0.2%2c2.11c1.37-1.68%2c3.15-2.51%2c5.36-2.51c2.61%2c0%2c4.63%2c0.99%2c6.08%2c2.95c1.45%2c1.97%2c2.17%2c4.68%2c2.17%2c8.14V145.86z M14.32%2c145.44c0-2.01-0.35-3.56-1.05-4.65c-0.7-1.09-1.71-1.64-3.04-1.64c-1.77%2c0-2.99%2c0.69-3.66%2c2.07v8.84 c0.69%2c1.42%2c1.92%2c2.13%2c3.69%2c2.13C12.97%2c152.2%2c14.32%2c149.94%2c14.32%2c145.44z'%3e%3c/path%3e%3cpath class='unep_0' d='M35.6%2c140.27c-0.77-0.11-1.45-0.16-2.03-0.16c-2.14%2c0-3.54%2c0.74-4.2%2c2.21v14.12h-5.65v-21.58h5.34l0.16%2c2.57 c1.13-1.98%2c2.7-2.97%2c4.71-2.97c0.63%2c0%2c1.21%2c0.09%2c1.76%2c0.26L35.6%2c140.27z'%3e%3c/path%3e%3cpath class='unep_0' d='M36.97%2c145.46c0-2.14%2c0.4-4.05%2c1.21-5.72c0.81-1.68%2c1.97-2.97%2c3.49-3.89c1.52-0.92%2c3.28-1.38%2c5.29-1.38 c2.85%2c0%2c5.18%2c0.89%2c6.99%2c2.67c1.81%2c1.78%2c2.81%2c4.2%2c3.02%2c7.26l0.04%2c1.48c0%2c3.31-0.91%2c5.97-2.72%2c7.97c-1.81%2c2-4.24%2c3-7.29%2c3 s-5.48-1-7.3-2.99c-1.82-1.99-2.73-4.71-2.73-8.14V145.46z M42.62%2c145.87c0%2c2.05%2c0.38%2c3.62%2c1.13%2c4.7 c0.76%2c1.09%2c1.84%2c1.63%2c3.25%2c1.63c1.37%2c0%2c2.44-0.54%2c3.21-1.61c0.77-1.07%2c1.15-2.79%2c1.15-5.14c0-2.01-0.38-3.57-1.15-4.67 c-0.77-1.1-1.85-1.66-3.25-1.66c-1.38%2c0-2.45%2c0.55-3.21%2c1.65C43%2c141.86%2c42.62%2c143.56%2c42.62%2c145.87z'%3e%3c/path%3e%3cpath class='unep_0' d='M59.91%2c145.5c0-3.31%2c0.77-5.98%2c2.31-8c1.55-2.02%2c3.63-3.03%2c6.25-3.03c2.32%2c0%2c4.12%2c0.81%2c5.42%2c2.43l0.23-2.03 h5.12v20.86c0%2c1.89-0.42%2c3.53-1.26%2c4.93c-0.84%2c1.4-2.02%2c2.46-3.55%2c3.19s-3.31%2c1.1-5.36%2c1.1c-1.55%2c0-3.06-0.32-4.54-0.95 c-1.47-0.63-2.59-1.45-3.34-2.44l2.5-3.51c1.41%2c1.61%2c3.11%2c2.41%2c5.12%2c2.41c1.5%2c0%2c2.67-0.41%2c3.5-1.23c0.83-0.82%2c1.25-1.98%2c1.25-3.48 v-1.16c-1.3%2c1.5-3.02%2c2.25-5.14%2c2.25c-2.54%2c0-4.6-1.01-6.17-3.04c-1.57-2.03-2.36-4.72-2.36-8.07V145.5z M65.56%2c145.93 c0%2c1.96%2c0.38%2c3.49%2c1.15%2c4.6c0.77%2c1.11%2c1.82%2c1.67%2c3.17%2c1.67c1.72%2c0%2c2.95-0.66%2c3.69-1.98v-9.09c-0.76-1.32-1.97-1.98-3.66-1.98 c-1.35%2c0-2.42%2c0.57-3.2%2c1.7C65.95%2c141.98%2c65.56%2c143.68%2c65.56%2c145.93z'%3e%3c/path%3e%3cpath class='unep_0' d='M95.71%2c140.27c-0.77-0.11-1.45-0.16-2.03-0.16c-2.14%2c0-3.54%2c0.74-4.2%2c2.21v14.12h-5.65v-21.58h5.34l0.16%2c2.57 c1.13-1.98%2c2.7-2.97%2c4.71-2.97c0.63%2c0%2c1.21%2c0.09%2c1.76%2c0.26L95.71%2c140.27z'%3e%3c/path%3e%3cpath class='unep_0' d='M110.34%2c156.45c-0.26-0.52-0.45-1.16-0.57-1.93c-1.37%2c1.56-3.15%2c2.33-5.34%2c2.33c-2.07%2c0-3.79-0.61-5.15-1.83 c-1.36-1.22-2.04-2.77-2.04-4.63c0-2.29%2c0.83-4.04%2c2.49-5.26c1.66-1.22%2c4.06-1.84%2c7.2-1.86h2.6v-1.24c0-1-0.25-1.8-0.75-2.39 c-0.5-0.6-1.29-0.9-2.38-0.9c-0.95%2c0-1.7%2c0.23-2.24%2c0.7c-0.54%2c0.46-0.81%2c1.1-0.81%2c1.91h-5.65c0-1.25%2c0.38-2.41%2c1.13-3.47 c0.76-1.07%2c1.83-1.9%2c3.21-2.5c1.38-0.61%2c2.93-0.91%2c4.65-0.91c2.61%2c0%2c4.68%2c0.67%2c6.21%2c2.01c1.53%2c1.34%2c2.3%2c3.21%2c2.3%2c5.63v9.35 c0.01%2c2.05%2c0.29%2c3.6%2c0.84%2c4.65v0.34H110.34z M105.67%2c152.44c0.83%2c0%2c1.6-0.19%2c2.31-0.57c0.7-0.38%2c1.22-0.89%2c1.56-1.53v-3.71h-2.11 c-2.83%2c0-4.33%2c1-4.52%2c2.99l-0.02%2c0.34c0%2c0.72%2c0.25%2c1.31%2c0.74%2c1.77C104.13%2c152.21%2c104.81%2c152.44%2c105.67%2c152.44z'%3e%3c/path%3e%3cpath class='unep_0' d='M125.09%2c134.87l0.18%2c2.41c1.5-1.88%2c3.53-2.81%2c6.08-2.81c2.72%2c0%2c4.59%2c1.1%2c5.61%2c3.29 c1.48-2.19%2c3.6-3.29%2c6.35-3.29c2.29%2c0%2c4%2c0.68%2c5.12%2c2.04c1.12%2c1.36%2c1.68%2c3.41%2c1.68%2c6.15v13.78h-5.67v-13.76 c0-1.22-0.23-2.12-0.7-2.68c-0.47-0.57-1.3-0.85-2.48-0.85c-1.69%2c0-2.87%2c0.82-3.52%2c2.47l0.02%2c14.82h-5.65v-13.74 c0-1.25-0.24-2.15-0.72-2.71c-0.48-0.56-1.3-0.84-2.46-0.84c-1.6%2c0-2.76%2c0.68-3.48%2c2.03v15.26h-5.65v-21.58H125.09z'%3e%3c/path%3e%3cpath class='unep_0' d='M159.99%2c134.87l0.18%2c2.41c1.5-1.88%2c3.53-2.81%2c6.08-2.81c2.72%2c0%2c4.59%2c1.1%2c5.61%2c3.29 c1.48-2.19%2c3.6-3.29%2c6.35-3.29c2.29%2c0%2c4%2c0.68%2c5.12%2c2.04c1.12%2c1.36%2c1.68%2c3.41%2c1.68%2c6.15v13.78h-5.67v-13.76 c0-1.22-0.23-2.12-0.7-2.68c-0.47-0.57-1.3-0.85-2.48-0.85c-1.69%2c0-2.87%2c0.82-3.52%2c2.47l0.02%2c14.82h-5.65v-13.74 c0-1.25-0.24-2.15-0.72-2.71c-0.48-0.56-1.3-0.84-2.46-0.84c-1.6%2c0-2.76%2c0.68-3.48%2c2.03v15.26h-5.65v-21.58H159.99z'%3e%3c/path%3e%3cpath class='unep_0' d='M199.33%2c156.84c-3.1%2c0-5.63-0.97-7.58-2.91c-1.95-1.94-2.92-4.53-2.92-7.76v-0.56c0-2.17%2c0.41-4.1%2c1.23-5.81 c0.82-1.71%2c1.98-3.03%2c3.49-3.95c1.5-0.92%2c3.22-1.39%2c5.15-1.39c2.89%2c0%2c5.17%2c0.93%2c6.83%2c2.79s2.49%2c4.5%2c2.49%2c7.92v2.35h-13.47 c0.18%2c1.41%2c0.73%2c2.54%2c1.65%2c3.39c0.92%2c0.85%2c2.08%2c1.28%2c3.49%2c1.28c2.18%2c0%2c3.88-0.8%2c5.1-2.41l2.77%2c3.17 c-0.85%2c1.22-1.99%2c2.18-3.44%2c2.86C202.7%2c156.5%2c201.09%2c156.84%2c199.33%2c156.84z M198.69%2c139.12c-1.12%2c0-2.03%2c0.39-2.73%2c1.16 c-0.7%2c0.78-1.14%2c1.88-1.34%2c3.33h7.86v-0.46c-0.03-1.28-0.37-2.27-1.02-2.97C200.81%2c139.47%2c199.89%2c139.12%2c198.69%2c139.12z'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

    /* src/components/nav/Logo.svelte generated by Svelte v3.42.3 */
    const file$7 = "src/components/nav/Logo.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let img$2;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img$2 = element("img");

    			if (!src_url_equal(img$2.src, img_src_value = !/*color*/ ctx[0] || /*color*/ ctx[0] === 'blue'
    			? img$1
    			: img)) attr_dev(img$2, "src", img_src_value);

    			attr_dev(img$2, "alt", "Logo of the United Nations Environment Programme | 50 year anniversary");
    			add_location(img$2, file$7, 8, 2, 180);
    			attr_dev(div, "class", "logo");
    			add_location(div, file$7, 7, 0, 159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img$2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1 && !src_url_equal(img$2.src, img_src_value = !/*color*/ ctx[0] || /*color*/ ctx[0] === 'blue'
    			? img$1
    			: img)) {
    				attr_dev(img$2, "src", img_src_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	let { color = undefined } = $$props;
    	const writable_props = ['color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ UNEPLogoBlue: img$1, UNEPLogoWhite: img, color });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, { color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get color() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/nav/TopNav.svelte generated by Svelte v3.42.3 */
    const file$6 = "src/components/nav/TopNav.svelte";

    function create_fragment$6(ctx) {
    	let nav;
    	let a;
    	let logo;
    	let current;
    	logo = new Logo({ props: { color: "blue" }, $$inline: true });

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			a = element("a");
    			create_component(logo.$$.fragment);
    			attr_dev(a, "href", "https://www.unep.org");
    			add_location(a, file$6, 3, 4, 114);
    			attr_dev(nav, "class", "top page-header");
    			attr_dev(nav, "role", "navigation");
    			add_location(nav, file$6, 2, 0, 62);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, a);
    			mount_component(logo, a, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(logo);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopNav', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopNav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Logo });
    	return [];
    }

    class TopNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopNav",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/nav/Footer.svelte generated by Svelte v3.42.3 */
    const file$5 = "src/components/nav/Footer.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (28:12) {:else}
    function create_else_block$1(ctx) {
    	let li;
    	let raw_value = /*b*/ ctx[2].label + "";

    	const block = {
    		c: function create() {
    			li = element("li");
    			attr_dev(li, "class", "svelte-79ecng");
    			add_location(li, file$5, 28, 12, 1228);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			li.innerHTML = raw_value;
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(28:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:12) {#if b.a}
    function create_if_block$1(ctx) {
    	let li;
    	let a;
    	let raw_value = /*b*/ ctx[2].label + "";

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			attr_dev(a, "href", /*b*/ ctx[2].a);
    			attr_dev(a, "class", "svelte-79ecng");
    			add_location(a, file$5, 26, 16, 1155);
    			attr_dev(li, "class", "svelte-79ecng");
    			add_location(li, file$5, 26, 12, 1151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			a.innerHTML = raw_value;
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(26:12) {#if b.a}",
    		ctx
    	});

    	return block;
    }

    // (25:12) {#each footerMenu as b}
    function create_each_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*b*/ ctx[2].a) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(25:12) {#each footerMenu as b}",
    		ctx
    	});

    	return block;
    }

    // (34:12) {#each socialMenu as b}
    function create_each_block$3(ctx) {
    	let li;
    	let a;
    	let i;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			i = element("i");
    			attr_dev(i, "class", "fa fa-" + /*b*/ ctx[2].label + " fa-lg" + " svelte-79ecng");
    			add_location(i, file$5, 34, 82, 1456);
    			attr_dev(a, "href", /*b*/ ctx[2].a);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener");
    			attr_dev(a, "aria-label", /*b*/ ctx[2].a);
    			attr_dev(a, "class", "svelte-79ecng");
    			add_location(a, file$5, 34, 16, 1390);
    			attr_dev(li, "class", "svelte-79ecng");
    			add_location(li, file$5, 34, 12, 1386);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, i);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(34:12) {#each socialMenu as b}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let footer;
    	let nav;
    	let logo;
    	let t0;
    	let h3;
    	let t2;
    	let ul0;
    	let t3;
    	let ul1;
    	let current;

    	logo = new Logo({
    			props: { color: "white" },
    			$$inline: true
    		});

    	let each_value_1 = /*footerMenu*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*socialMenu*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			nav = element("nav");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			h3 = element("h3");
    			h3.textContent = "Footer menu";
    			t2 = space();
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h3, "id", "footer-label");
    			attr_dev(h3, "class", "hidden");
    			add_location(h3, file$5, 22, 8, 996);
    			attr_dev(ul0, "class", "menu info svelte-79ecng");
    			add_location(ul0, file$5, 23, 8, 1058);
    			attr_dev(ul1, "class", "menu social svelte-79ecng");
    			add_location(ul1, file$5, 32, 8, 1313);
    			attr_dev(nav, "class", "footer-content");
    			attr_dev(nav, "role", "navigation");
    			attr_dev(nav, "labelledby", "footer-label");
    			add_location(nav, file$5, 20, 4, 884);
    			attr_dev(footer, "class", "fs footer svelte-79ecng");
    			add_location(footer, file$5, 19, 0, 853);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, nav);
    			mount_component(logo, nav, null);
    			append_dev(nav, t0);
    			append_dev(nav, h3);
    			append_dev(nav, t2);
    			append_dev(nav, ul0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul0, null);
    			}

    			append_dev(nav, t3);
    			append_dev(nav, ul1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*footerMenu*/ 1) {
    				each_value_1 = /*footerMenu*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*socialMenu*/ 2) {
    				each_value = /*socialMenu*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(logo);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);

    	const footerMenu = [
    		{ label: '© UNEP' },
    		{
    			label: 'Terms of Use',
    			a: 'https://www.unep.org/node/18424/'
    		},
    		{
    			label: 'Privacy',
    			a: 'https://www.unep.org/node/28178/'
    		},
    		{
    			label: 'Report a project concern',
    			a: 'https://www.unep.org/about-un-environment/why-does-un-environment-matter/un-environment-project-concern'
    		}
    	];

    	const socialMenu = [
    		{
    			label: 'facebook-official',
    			a: 'https://www.facebook.com/unep'
    		},
    		{
    			label: 'twitter',
    			a: 'https://twitter.com/UNEP'
    		},
    		{
    			label: 'linkedin',
    			a: 'https://www.linkedin.com/company/unep/'
    		},
    		{
    			label: 'instagram',
    			a: 'https://www.instagram.com/unep/'
    		},
    		{
    			label: 'youtube',
    			a: 'https://www.youtube.com/unenvironmentprogramme'
    		},
    		{
    			label: 'weibo',
    			a: 'https://www.weibo.com/unepandyou?is_hot=1'
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Logo, footerMenu, socialMenu });
    	return [footerMenu, socialMenu];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    var article = [
    	{
    		type: "intro",
    		breadcrumbs: [
    			{
    				a: "https://www.unep.org/",
    				label: "Home"
    			},
    			{
    				a: "https://www.unep.org/explore-topics",
    				label: "Explore Topics"
    			},
    			{
    				a: "https://www.unep.org/explore-topics/air",
    				label: "Air"
    			},
    			{
    				a: "",
    				label: "Pollution Action Note"
    			}
    		],
    		head: "Pollution Action Note – Data you need to know",
    		text: [
    			{
    				p: "Air pollution is the greatest environmental threat to public health globally and accounts for an estimated 7 million premature deaths[a] every year. Air pollution and climate change are closely linked as all major pollutants have an impact on the climate and most share common sources with greenhouse gases. Improving our air quality will bring health, development, and environmental benefits."
    			},
    			{
    				p: "The UNEP Pollution Dashboard displays the global state of air pollution, major sources, the impact on human health, and national efforts to tackle this critical issue."
    			}
    		]
    	},
    	{
    		type: "menu"
    	},
    	{
    		type: "carto-world",
    		menu: "Current state",
    		icon: "pm25",
    		data: "pm25",
    		embed: "pm25",
    		head: "In 2019, <strong>99% of the world population</strong> was living in places where the WHO’s strictest air quality guideline levels were not met.",
    		text: [
    			{
    				p: "With every breath we take, we suck in tiny particles that can damage our lungs, hearts, and brains and cause a host of other health problems. The most dangerous of these particles, which can include anything from soot to sulfates, are <strong>fine particles 2.5 microns</strong> or less in diameter —shortened as <strong>PM<sub>2.5</sub></strong>."
    			},
    			{
    				p: "Even though air pollution is a global problem, it disproportionately affects those living in developing nations and particularly the most vulnerable, such as women and children."
    			}
    		]
    	},
    	{
    		type: "carto-region",
    		menu: "Sources per sector",
    		icon: "sectors",
    		data: "sectors",
    		embed: "sectors",
    		head: "<strong>Residential</strong> pollution, mostly from cooking, heating and generating electricity for our homes, is the main <strong>human-made source</strong> of fine particles globally while <strong>windblown dust</strong> is a major source in much of Africa and West Asia.",
    		text: [
    			{
    				p: "The fine particles that pollute our air mostly come from human activities such as burning fossil fuels to generate electricity, transportation, waste burning, agriculture — a major source of methane and ammonia -- and the chemical and mining industries. Natural sources include volcanic eruptions, sea spray, soil dust, and lightning."
    			},
    			{
    				p: "In developing countries, reliance on wood and other solid fuels, like raw coal for cooking and heating, and the use of kerosene for lighting, increases air pollution in homes."
    			}
    		]
    	},
    	{
    		type: "carto-world",
    		anchor: "health",
    		menu: "Impact",
    		icon: "deaths",
    		data: "health",
    		embed: "health",
    		head: "Around <strong>four million people died in 2019</strong> from exposure to fine particulate outdoor air pollution, with the highest death rates occurring in East Asia and Central Europe.",
    		text: [
    			{
    				p: "Air pollution is a major global health epidemic and causes one in nine deaths worldwide. Exposure to PM<sub>2.5</sub> reduced average global life expectancy by approximately one year in 2019."
    			},
    			{
    				p: "The deadliest illnesses linked to PM<sub>2.5</sub> air pollution are stroke, heart disease, lung disease and cancer. High levels of fine particles also contribute to other illnesses, like diabetes, can hinder cognitive development in children and also cause mental health problems."
    			}
    		]
    	},
    	{
    		type: "carto-world",
    		anchor: "diseases",
    		menu: "Diseases",
    		icon: "policies",
    		data: "diseases",
    		embed: "diseases",
    		head: "@number of people died in 2019 from @dropdown attributable to fine particle outdoor air pollution.",
    		dropdown: [
    			{
    				label: "Ischemic heart disease",
    				value: "ischemic"
    			},
    			{
    				label: "Stroke",
    				value: "stroke"
    			},
    			{
    				label: "Lower respiratory infections",
    				value: "lri"
    			},
    			{
    				label: "Trachea, bronchus, and lung cancer",
    				value: "lungcancer"
    			},
    			{
    				label: "Type 2 diabetes",
    				value: "diabetes"
    			},
    			{
    				label: "Neonatal disorders",
    				value: "nd"
    			},
    			{
    				label: "Chronic obstructive pulmonary disease",
    				value: "copd"
    			}
    		],
    		text: [
    			{
    				p: ""
    			}
    		]
    	},
    	{
    		type: "carto-world",
    		anchor: "policies",
    		menu: "Policy actions",
    		icon: "policies",
    		data: "policies",
    		embed: "policies",
    		head: "<strong>Government actions</strong> on air quality are <strong>steadily growing</strong>, but <strong>implementation and capacity gaps</strong> hinder progress towards clean air.",
    		text: [
    			{
    				p: "<a href=”https://www.unep.org/resources/report/actions-air-quality-global-summary-policies-and-programmes-reduce-air-pollution”>UNEP’s <strong>Actions on Air Quality</strong> report</a> provides a review of policy actions being undertaken by governments around the world to improve air quality. The report provides an assessment of actions in key sectors that contribute to air pollution including industrial emissions (incentives for cleaner production), transportation (vehicle emission and fuel quality standards), solid waste management (regulation of open burning of waste), household air pollution (incentives for clean energy use in residential cooking and heating) and agriculture (sustainable agricultural practices)."
    			},
    			{
    				p: "These sectoral measures are supported by enabling policy frameworks (including air quality standards) and air quality management capacities. The report, therefore, includes in its analysis: air quality management strategies, and air quality monitoring."
    			}
    		]
    	},
    	{
    		type: "methodology",
    		anchor: "methodology",
    		menu: "Data",
    		icon: "data",
    		head: "About the data",
    		text: [
    			{
    				p: "The boundaries and names shown, and the designations used on this map, do not imply official endorsement or acceptance by the United Nations."
    			},
    			{
    				p: "Data for PM<sub>2.5</sub> estimates, sectors and fuel sources, and attributable deaths comes from McDuffie, E.E., Martin, R.V., Spadaro, J.V. et al. Source sector and fuel contributions to ambient PM<sub>2.5</sub> and attributable mortality across multiple spatial scales. <em>Nat Commun<em> <strong>12</strong>, 3594 (2021)"
    			},
    			{
    				p: "The data for the sector and fuel sections was reaggregated from country data into UNEP regions, which are different to the ones used in the study.[b]"
    			}
    		]
    	}
    ];
    var footer = [
    	{
    		a: "",
    		label: ""
    	}
    ];
    var meta = {
    	title: "",
    	url: "",
    	description: ""
    };
    var a = [
    ];
    var b = [
    ];
    var text = {
    	article: article,
    	footer: footer,
    	meta: meta,
    	a: a,
    	b: b
    };

    class MenuSpy {
        constructor(element, options) {
            if (!element) {
                return;
            }
            const defaults = {
                menuItemSelector: 'a[href^="#"]',
                activeClass: 'active',
                threshold: 15,
                enableLocationHash: true,
                hashTimeout: 600,
                callback: null,
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
                }
                else {
                    const st = utils.scrollTop();
                    window.location.hash = hash;
                    window.scrollTo(0, st);
                }
            }, this.options.hashTimeout);
            this.cacheItems();
            this.scrollFn();
        }
        assignValues() {
            this.currScrollTop = 0;
            this.lastInViewElm = null;
            this.menuHeight = this.element.offsetHeight + this.options.threshold;
            this.menuItems = [].slice.call(this.element.querySelectorAll(this.options.menuItemSelector));
            this.raf = null;
        }
        cacheItems() {
            this.scrollItems = this.menuItems.map((elm) => {
                const target = elm.dataset.target ?
                    document.querySelector(elm.dataset.target) :
                    document.getElementById(elm.getAttribute('href').slice(1));
                if (target) {
                    const offset = Math.floor(utils.getOffset(target).top);
                    return { elm, target, offset };
                }
            });
            this.scrollItems = this.scrollItems.filter(Boolean).sort((a, b) => a.offset - b.offset);
        }
        tick() {
            if (this.enable) {
                this.cacheItems();
                this.scrollItems = this.scrollItems.filter(Boolean).sort((a, b) => a.offset - b.offset);
                const fromTop = this.currScrollTop + this.menuHeight;
                const inViewElms = this.scrollItems.filter((item) => item.offset < fromTop);
                if (inViewElms.length > 0)
                    this.activateItem(inViewElms.pop());
                else
                    this.activateItem(this.scrollItems[0]);
            }
        }
        activateItem(inViewElm) {
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
        scrollFn() {
            const st = utils.scrollTop();
            if (this.currScrollTop !== st) {
                this.currScrollTop = st;
                this.tick();
            }
            this.raf = window.requestAnimationFrame(this.scrollFn.bind(this));
        }
        destroy() {
            if (this.raf) {
                window.cancelAnimationFrame(this.raf);
            }
            window.removeEventListener('resize', this.debouncedAssignValuesFn);
        }
        dissableUpdate() {
            this.enable = false;
        }
        enableUpdate() {
            this.enable = true;
        }
    }
    const utils = {
        debounce(fn, delay) {
            let timeout = null;
            return () => {
                // eslint-disable-next-line prefer-rest-params
                const args = arguments;
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
        removeClass(el, className) {
            if (el.classList) {
                el.classList.remove(className);
            }
            else {
                el.className =
                    el.className
                        .replace(new RegExp(`(^|\\b)${className
                    .split(' ')
                    .join('|')}(\\b|$)`, 'gi'), ' ');
            }
        },
        addClass(el, className) {
            if (el.classList) {
                el.classList.add(className);
            }
            else {
                const classes = el.className.split(' ');
                const existingIndex = classes.indexOf(className);
                if (existingIndex === -1) {
                    classes.push(className);
                }
                el.className = classes.join(' ');
            }
        },
        scrollTop() {
            if (window.pageYOffset)
                return window.pageYOffset;
            else
                return document.documentElement.scrollTop;
        },
        extend(a, b) {
            for (const key in b) {
                if (Object.prototype.hasOwnProperty.call(b, key)) {
                    a[key] = b[key];
                }
            }
            return a;
        },
        getOffset(el) {
            const rect = el.getBoundingClientRect();
            return ({
                top: rect.top + window.pageYOffset,
                left: rect.left + window.pageXOffset
            });
        }
    };

    var _ = {
      $(selector) {
        if (typeof selector === "string") {
          return document.querySelector(selector);
        }
        return selector;
      },
      extend(...args) {
        return Object.assign(...args);
      },
      cumulativeOffset(element) {
        let top = 0;
        let left = 0;

        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);

        return {
          top: top,
          left: left
        };
      },
      directScroll(element) {
        return element && element !== document && element !== document.body;
      },
      scrollTop(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollTop = value) : element.scrollTop;
        } else {
          return inSetter
            ? (document.documentElement.scrollTop = document.body.scrollTop = value)
            : window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
        }
      },
      scrollLeft(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollLeft = value) : element.scrollLeft;
        } else {
          return inSetter
            ? (document.documentElement.scrollLeft = document.body.scrollLeft = value)
            : window.pageXOffset ||
                document.documentElement.scrollLeft ||
                document.body.scrollLeft ||
                0;
        }
      }
    };

    const defaultOptions = {
      container: "body",
      duration: 500,
      delay: 0,
      offset: 0,
      easing: cubicInOut,
      onStart: noop$1,
      onDone: noop$1,
      onAborting: noop$1,
      scrollX: false,
      scrollY: true
    };

    const _scrollTo = options => {
      let {
        offset,
        duration,
        delay,
        easing,
        x=0,
        y=0,
        scrollX,
        scrollY,
        onStart,
        onDone,
        container,
        onAborting,
        element
      } = options;

      if (typeof offset === "function") {
        offset = offset();
      }

      var cumulativeOffsetContainer = _.cumulativeOffset(container);
      var cumulativeOffsetTarget = element
        ? _.cumulativeOffset(element)
        : { top: y, left: x };

      var initialX = _.scrollLeft(container);
      var initialY = _.scrollTop(container);

      var targetX =
        cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
      var targetY =
        cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;

      var diffX = targetX - initialX;
    	var diffY = targetY - initialY;

      let scrolling = true;
      let started = false;
      let start_time = now$1() + delay;
      let end_time = start_time + duration;

      function scrollToTopLeft(element, top, left) {
        if (scrollX) _.scrollLeft(element, left);
        if (scrollY) _.scrollTop(element, top);
      }

      function start(delayStart) {
        if (!delayStart) {
          started = true;
          onStart(element, {x, y});
        }
      }

      function tick(progress) {
        scrollToTopLeft(
          container,
          initialY + diffY * progress,
          initialX + diffX * progress
        );
      }

      function stop() {
        scrolling = false;
      }

      loop(now => {
        if (!started && now >= start_time) {
          start(false);
        }

        if (started && now >= end_time) {
          tick(1);
          stop();
          onDone(element, {x, y});
        }

        if (!scrolling) {
          onAborting(element, {x, y});
          return false;
        }
        if (started) {
          const p = now - start_time;
          const t = 0 + 1 * easing(p / duration);
          tick(t);
        }

        return true;
      });

      start(delay);

      tick(0);

      return stop;
    };

    const proceedOptions = options => {
    	let opts = _.extend({}, defaultOptions, options);
      opts.container = _.$(opts.container);
      opts.element = _.$(opts.element);
      return opts;
    };

    const scrollContainerHeight = containerElement => {
      if (
        containerElement &&
        containerElement !== document &&
        containerElement !== document.body
      ) {
        return containerElement.scrollHeight - containerElement.offsetHeight;
      } else {
        let body = document.body;
        let html = document.documentElement;

        return Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
      }
    };

    const setGlobalOptions = options => {
    	_.extend(defaultOptions, options || {});
    };

    const scrollTo = options => {
      return _scrollTo(proceedOptions(options));
    };

    const scrollToBottom = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: scrollContainerHeight(options.container)
        })
      );
    };

    const scrollToTop = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: 0
        })
      );
    };

    const makeScrollToAction = scrollToFunc => {
      return (node, options) => {
        let current = options;
        const handle = e => {
          e.preventDefault();
          scrollToFunc(
            typeof current === "string" ? { element: current } : current
          );
        };
        node.addEventListener("click", handle);
        node.addEventListener("touchstart", handle);
        return {
          update(options) {
            current = options;
          },
          destroy() {
            node.removeEventListener("click", handle);
            node.removeEventListener("touchstart", handle);
          }
        };
      };
    };

    const scrollto = makeScrollToAction(scrollTo);
    const scrolltotop = makeScrollToAction(scrollToTop);
    const scrolltobottom = makeScrollToAction(scrollToBottom);

    var animateScroll = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setGlobalOptions: setGlobalOptions,
        scrollTo: scrollTo,
        scrollToBottom: scrollToBottom,
        scrollToTop: scrollToTop,
        makeScrollToAction: makeScrollToAction,
        scrollto: scrollto,
        scrolltotop: scrolltotop,
        scrolltobottom: scrolltobottom
    });

    /* src/components/nav/Menu.svelte generated by Svelte v3.42.3 */
    const file$4 = "src/components/nav/Menu.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (40:2) {#each options as option, i}
    function create_each_block$2(ctx) {
    	let button;
    	let div3;
    	let div0;
    	let raw_value = svg.menu[/*option*/ ctx[11].icon] + "";
    	let t0;
    	let div2;
    	let div1;
    	let t1_value = /*option*/ ctx[11].title + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*i*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t1 = text$1(t1_value);
    			t2 = space();
    			attr_dev(div0, "class", "icon svelte-drj2ih");
    			attr_dev(div0, "style", alignment[/*option*/ ctx[11].icon] || '');
    			add_location(div0, file$4, 57, 8, 1462);
    			attr_dev(div1, "class", "text svelte-drj2ih");
    			add_location(div1, file$4, 59, 10, 1600);
    			attr_dev(div2, "class", "text-container svelte-drj2ih");
    			add_location(div2, file$4, 58, 8, 1561);
    			attr_dev(div3, "class", "buttoncontent svelte-drj2ih");
    			attr_dev(div3, "href", "#" + /*option*/ ctx[11].id);
    			attr_dev(div3, "id", "" + (/*option*/ ctx[11].id + "div"));
    			add_location(div3, file$4, 56, 6, 1386);
    			attr_dev(button, "class", "" + (null_to_empty(/*i*/ ctx[13] === 0 ? "active" : "") + " svelte-drj2ih"));
    			attr_dev(button, "aria-label", /*option*/ ctx[11].title);
    			add_location(button, file$4, 40, 4, 963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div3);
    			append_dev(div3, div0);
    			div0.innerHTML = raw_value;
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(scrollTo({
    							element: `#${/*option*/ ctx[11].id}`,
    							offset: /*smallScreen*/ ctx[2] ? -24 : 24,
    							onStart: click_handler,
    							onDone: /*click_handler_1*/ ctx[8]
    						}))) scrollTo({
    							element: `#${/*option*/ ctx[11].id}`,
    							offset: /*smallScreen*/ ctx[2] ? -24 : 24,
    							onStart: click_handler,
    							onDone: /*click_handler_1*/ ctx[8]
    						}).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(40:2) {#each options as option, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let nav;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[6]);
    	let each_value = /*options*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(nav, "class", "mainnavbuttons margin-breakout-mobile svelte-drj2ih");
    			attr_dev(nav, "id", "main-menu");
    			add_location(nav, file$4, 38, 0, 861);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "resize", /*getScreen*/ ctx[4], false, false, false),
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[6])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options, animateScroll, smallScreen, ms, alignment, svg*/ 13) {
    				each_value = /*options*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(nav, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	
    	
    	let { content } = $$props;

    	const options = content.filter(c => c.menu).map(c => ({
    		title: c.menu,
    		id: strToId(c.menu),
    		icon: c.icon
    	}));

    	var elm;
    	var ms;

    	var msParams = {
    		menuItemSelector: 'div[href^="#"]',
    		activeClass: 'active',
    		threshold: 600,
    		enableLocationHash: false,
    		hashTimeout: 0,
    		callback: null
    	};

    	let width;
    	let smallScreen;

    	onMount(() => {
    		elm = document.querySelector('#main-menu');
    		$$invalidate(0, ms = new MenuSpy(elm, msParams));
    		getScreen();
    	});

    	function getScreen() {
    		$$invalidate(2, smallScreen = width < 1200);
    	}

    	const writable_props = ['content'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, width = window.innerWidth);
    	}

    	const click_handler = i => {
    		ms.activateItem(ms.scrollItems[i]);
    		ms.dissableUpdate();
    	};

    	const click_handler_1 = () => {
    		ms.enableUpdate();
    		ms.tick();
    	};

    	$$self.$$set = $$props => {
    		if ('content' in $$props) $$invalidate(5, content = $$props.content);
    	};

    	$$self.$capture_state = () => ({
    		svg,
    		alignment,
    		MenuSpy,
    		onMount,
    		animateScroll,
    		strToId,
    		content,
    		options,
    		elm,
    		ms,
    		msParams,
    		width,
    		smallScreen,
    		getScreen
    	});

    	$$self.$inject_state = $$props => {
    		if ('content' in $$props) $$invalidate(5, content = $$props.content);
    		if ('elm' in $$props) elm = $$props.elm;
    		if ('ms' in $$props) $$invalidate(0, ms = $$props.ms);
    		if ('msParams' in $$props) msParams = $$props.msParams;
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('smallScreen' in $$props) $$invalidate(2, smallScreen = $$props.smallScreen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ms,
    		width,
    		smallScreen,
    		options,
    		getScreen,
    		content,
    		onwindowresize,
    		click_handler,
    		click_handler_1
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { content: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*content*/ ctx[5] === undefined && !('content' in props)) {
    			console.warn("<Menu> was created without expected prop 'content'");
    		}
    	}

    	get content() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/IframeResizingContainer.svelte generated by Svelte v3.42.3 */
    const file$3 = "src/components/IframeResizingContainer.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let div_resize_listener;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "iframe-resizer");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[5].call(div));
    			add_location(div, file$3, 33, 0, 745);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[4](div);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[5].bind(div));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[4](null);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IframeResizingContainer', slots, ['default']);
    	var el;
    	var clientHeight;

    	const inIframe = (function () {
    		try {
    			return window.self !== window.top;
    		} catch(e) {
    			return true;
    		}
    	})();

    	var previousHeight;

    	function resizeIframe() {
    		if (!el) return;
    		const currentHeight = el.clientHeight;

    		if (inIframe) {
    			if (currentHeight !== previousHeight) {
    				previousHeight = currentHeight;

    				window.parent.postMessage(
    					{
    						type: 'fndvit-embed:resize',
    						value: currentHeight
    					},
    					'*'
    				);
    			}
    		}
    	}

    	afterUpdate(() => {
    		if (inIframe) window.setTimeout(resizeIframe, 0);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IframeResizingContainer> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(1, el);
    		});
    	}

    	function div_elementresize_handler() {
    		clientHeight = this.clientHeight;
    		$$invalidate(0, clientHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		el,
    		clientHeight,
    		inIframe,
    		previousHeight,
    		resizeIframe
    	});

    	$$self.$inject_state = $$props => {
    		if ('el' in $$props) $$invalidate(1, el = $$props.el);
    		if ('clientHeight' in $$props) $$invalidate(0, clientHeight = $$props.clientHeight);
    		if ('previousHeight' in $$props) previousHeight = $$props.previousHeight;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*clientHeight*/ 1) {
    			clientHeight && resizeIframe();
    		}
    	};

    	return [clientHeight, el, $$scope, slots, div_binding, div_elementresize_handler];
    }

    class IframeResizingContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IframeResizingContainer",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/BaseEmbed.svelte generated by Svelte v3.42.3 */
    const file$2 = "src/components/BaseEmbed.svelte";
    const get_viz_slot_changes = dirty => ({});
    const get_viz_slot_context = ctx => ({});
    const get_legend_slot_changes = dirty => ({});
    const get_legend_slot_context = ctx => ({});

    // (5:0) <IframeResizingContainer>
    function create_default_slot(ctx) {
    	let div5;
    	let div4;
    	let t0;
    	let div0;
    	let t1;
    	let div3;
    	let div1;
    	let a;
    	let logo;
    	let t2;
    	let div2;
    	let p;
    	let current;
    	const legend_slot_template = /*#slots*/ ctx[0].legend;
    	const legend_slot = create_slot(legend_slot_template, ctx, /*$$scope*/ ctx[1], get_legend_slot_context);
    	const viz_slot_template = /*#slots*/ ctx[0].viz;
    	const viz_slot = create_slot(viz_slot_template, ctx, /*$$scope*/ ctx[1], get_viz_slot_context);
    	logo = new Logo({ $$inline: true });

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			if (legend_slot) legend_slot.c();
    			t0 = space();
    			div0 = element("div");
    			if (viz_slot) viz_slot.c();
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			a = element("a");
    			create_component(logo.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			p = element("p");
    			p.textContent = "The boundaries and names shown, and the designations used on\n            this map do not imply official endorsement or acceptance by the United Nations.";
    			attr_dev(div0, "class", "viz-pane svelte-16j8h7f");
    			add_location(div0, file$2, 10, 6, 267);
    			set_style(a, "border-bottom", "none");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", "https://www.unep.org/");
    			add_location(a, file$2, 16, 10, 408);
    			attr_dev(div1, "class", "logo svelte-16j8h7f");
    			add_location(div1, file$2, 15, 8, 378);
    			attr_dev(p, "class", "svelte-16j8h7f");
    			add_location(p, file$2, 21, 10, 574);
    			attr_dev(div2, "class", "text-unep-endorsement svelte-16j8h7f");
    			add_location(div2, file$2, 20, 8, 528);
    			attr_dev(div3, "class", "footer-embed wide svelte-16j8h7f");
    			add_location(div3, file$2, 14, 6, 338);
    			attr_dev(div4, "class", "content svelte-16j8h7f");
    			add_location(div4, file$2, 6, 4, 208);
    			attr_dev(div5, "class", "container svelte-16j8h7f");
    			add_location(div5, file$2, 5, 2, 180);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);

    			if (legend_slot) {
    				legend_slot.m(div4, null);
    			}

    			append_dev(div4, t0);
    			append_dev(div4, div0);

    			if (viz_slot) {
    				viz_slot.m(div0, null);
    			}

    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, a);
    			mount_component(logo, a, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, p);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (legend_slot) {
    				if (legend_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						legend_slot,
    						legend_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(legend_slot_template, /*$$scope*/ ctx[1], dirty, get_legend_slot_changes),
    						get_legend_slot_context
    					);
    				}
    			}

    			if (viz_slot) {
    				if (viz_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						viz_slot,
    						viz_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(viz_slot_template, /*$$scope*/ ctx[1], dirty, get_viz_slot_changes),
    						get_viz_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(legend_slot, local);
    			transition_in(viz_slot, local);
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(legend_slot, local);
    			transition_out(viz_slot, local);
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (legend_slot) legend_slot.d(detaching);
    			if (viz_slot) viz_slot.d(detaching);
    			destroy_component(logo);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(5:0) <IframeResizingContainer>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let iframeresizingcontainer;
    	let current;

    	iframeresizingcontainer = new IframeResizingContainer({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(iframeresizingcontainer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iframeresizingcontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iframeresizingcontainer_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				iframeresizingcontainer_changes.$$scope = { dirty, ctx };
    			}

    			iframeresizingcontainer.$set(iframeresizingcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iframeresizingcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iframeresizingcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iframeresizingcontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BaseEmbed', slots, ['legend','viz']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BaseEmbed> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ IframeResizingContainer, Logo });
    	return [slots, $$scope];
    }

    class BaseEmbed extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BaseEmbed",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/MethodologySourcesText.svelte generated by Svelte v3.42.3 */
    const file$1 = "src/components/MethodologySourcesText.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (10:2) {#each text as t}
    function create_each_block$1(ctx) {
    	let p;
    	let raw_value = /*t*/ ctx[3].p + "";

    	const block_1 = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "info-text svelte-1v5i01a");
    			add_location(p, file$1, 10, 4, 252);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 2 && raw_value !== (raw_value = /*t*/ ctx[3].p + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(10:2) {#each text as t}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$1(ctx) {
    	let section;
    	let sectiontitle;
    	let t;
    	let current;

    	sectiontitle = new SectionTitle({
    			props: { block: /*block*/ ctx[2] },
    			$$inline: true
    		});

    	let each_value = /*text*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block_1 = {
    		c: function create() {
    			section = element("section");
    			create_component(sectiontitle.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "class", "infoSquare margin-breakout-mobile svelte-1v5i01a");
    			attr_dev(section, "id", /*id*/ ctx[0]);
    			add_location(section, file$1, 7, 0, 144);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(sectiontitle, section, null);
    			append_dev(section, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sectiontitle_changes = {};
    			if (dirty & /*block*/ 4) sectiontitle_changes.block = /*block*/ ctx[2];
    			sectiontitle.$set(sectiontitle_changes);

    			if (dirty & /*text*/ 2) {
    				each_value = /*text*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*id*/ 1) {
    				attr_dev(section, "id", /*id*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(sectiontitle);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MethodologySourcesText', slots, []);
    	
    	let { id } = $$props;
    	let { text } = $$props;
    	let { block } = $$props;
    	const writable_props = ['id', 'text', 'block'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MethodologySourcesText> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('block' in $$props) $$invalidate(2, block = $$props.block);
    	};

    	$$self.$capture_state = () => ({ SectionTitle, id, text, block });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('block' in $$props) $$invalidate(2, block = $$props.block);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, text, block];
    }

    class MethodologySourcesText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, { id: 0, text: 1, block: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MethodologySourcesText",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<MethodologySourcesText> was created without expected prop 'id'");
    		}

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<MethodologySourcesText> was created without expected prop 'text'");
    		}

    		if (/*block*/ ctx[2] === undefined && !('block' in props)) {
    			console.warn("<MethodologySourcesText> was created without expected prop 'block'");
    		}
    	}

    	get id() {
    		throw new Error("<MethodologySourcesText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<MethodologySourcesText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<MethodologySourcesText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<MethodologySourcesText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<MethodologySourcesText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<MethodologySourcesText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.3 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (37:0) {:else}
    function create_else_block(ctx) {
    	let topnav;
    	let t0;
    	let main;
    	let article;
    	let t1;
    	let footer;
    	let current;
    	topnav = new TopNav({ $$inline: true });
    	let each_value = /*content*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(topnav.$$.fragment);
    			t0 = space();
    			main = element("main");
    			article = element("article");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(footer.$$.fragment);
    			add_location(article, file, 39, 4, 1230);
    			add_location(main, file, 38, 2, 1219);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topnav, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, article);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(article, null);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*components, content, strToId*/ 5) {
    				each_value = /*content*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(article, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnav.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnav.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topnav, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(37:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:0) {#if embedBlock}
    function create_if_block(ctx) {
    	let baseembed;
    	let current;

    	baseembed = new BaseEmbed({
    			props: {
    				$$slots: { viz: [create_viz_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(baseembed.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(baseembed, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const baseembed_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				baseembed_changes.$$scope = { dirty, ctx };
    			}

    			baseembed.$set(baseembed_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(baseembed.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(baseembed.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(baseembed, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(25:0) {#if embedBlock}",
    		ctx
    	});

    	return block;
    }

    // (50:8) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*block*/ ctx[4].type + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text$1("Missing component for '");
    			t1 = text$1(t1_value);
    			t2 = text$1("'");
    			add_location(div, file, 50, 10, 1553);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(50:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#if components[block.type]}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		/*block*/ ctx[4],
    		{ block: /*block*/ ctx[4] },
    		{
    			id: /*block*/ ctx[4].menu
    			? strToId(/*block*/ ctx[4].menu)
    			: null
    		},
    		{ content: /*content*/ ctx[0] }
    	];

    	var switch_value = /*components*/ ctx[2][/*block*/ ctx[4].type];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*content, strToId*/ 1)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*content*/ 1 && get_spread_object(/*block*/ ctx[4]),
    					dirty & /*content*/ 1 && { block: /*block*/ ctx[4] },
    					{
    						id: /*block*/ ctx[4].menu
    						? strToId(/*block*/ ctx[4].menu)
    						: null
    					},
    					dirty & /*content*/ 1 && { content: /*content*/ ctx[0] }
    				])
    			: {};

    			if (switch_value !== (switch_value = /*components*/ ctx[2][/*block*/ ctx[4].type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(42:8) {#if components[block.type]}",
    		ctx
    	});

    	return block;
    }

    // (41:6) {#each content as block}
    function create_each_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*components*/ ctx[2][/*block*/ ctx[4].type]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(41:6) {#each content as block}",
    		ctx
    	});

    	return block;
    }

    // (27:4) 
    function create_viz_slot(ctx) {
    	let div;
    	let switch_instance;
    	let current;

    	const switch_instance_spread_levels = [
    		/*embedBlock*/ ctx[1],
    		{ content: /*content*/ ctx[0] },
    		{ block: /*embedBlock*/ ctx[1] },
    		{ isEmbed: true }
    	];

    	var switch_value = /*components*/ ctx[2][/*embedBlock*/ ctx[1].type];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "slot", "viz");
    			attr_dev(div, "class", "cartogram-pane");
    			add_location(div, file, 26, 4, 954);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*embedBlock, content*/ 3)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*embedBlock*/ 2 && get_spread_object(/*embedBlock*/ ctx[1]),
    					dirty & /*content*/ 1 && { content: /*content*/ ctx[0] },
    					dirty & /*embedBlock*/ 2 && { block: /*embedBlock*/ ctx[1] },
    					switch_instance_spread_levels[3]
    				])
    			: {};

    			if (switch_value !== (switch_value = /*components*/ ctx[2][/*embedBlock*/ ctx[1].type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_viz_slot.name,
    		type: "slot",
    		source: "(27:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*embedBlock*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	
    	const content = text.article;
    	let { embed } = $$props;
    	const embedBlock = embed && content.find(b => b.embed === embed);

    	const components = {
    		'carto-world': CartoWorld,
    		'carto-region': CartoRegion,
    		'intro': Intro,
    		'text': Text,
    		"menu": Menu,
    		'methodology': MethodologySourcesText
    	};

    	const writable_props = ['embed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('embed' in $$props) $$invalidate(3, embed = $$props.embed);
    	};

    	$$self.$capture_state = () => ({
    		CartoWorld,
    		CartoRegion,
    		Intro,
    		Text,
    		TopNav,
    		Footer,
    		text,
    		Menu,
    		BaseEmbed,
    		MethodologySourcesText,
    		strToId,
    		content,
    		embed,
    		embedBlock,
    		components
    	});

    	$$self.$inject_state = $$props => {
    		if ('embed' in $$props) $$invalidate(3, embed = $$props.embed);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [content, embedBlock, components, embed];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance, create_fragment, safe_not_equal, { embed: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*embed*/ ctx[3] === undefined && !('embed' in props)) {
    			console.warn("<App> was created without expected prop 'embed'");
    		}
    	}

    	get embed() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set embed(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const urlParams = new URLSearchParams(window.location.search);
    const app = new App({
        target: document.body,
        props: {
            embed: urlParams.get('embed')
        }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
