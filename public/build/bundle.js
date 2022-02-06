
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
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
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
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
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
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
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
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
                const nodes = children(options.target);
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
            this.$destroy = noop;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
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

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const claims = writable(null);

    /**
     * Stores
     */
    const isLoading = writable(true);
    const isAuthenticated = writable(false);
    const authToken = writable('');
    const idToken = writable('');
    const userInfo = writable({});
    const authError = writable(null);

    /**
     * Context Keys
     *
     * using an object literal means the keys are guaranteed not to conflict in any circumstance (since an object only has
     * referential equality to itself, i.e. {} !== {} whereas "x" === "x"), even when you have multiple different contexts
     * operating across many component layers.
     */
    const AUTH0_CONTEXT_CLIENT_PROMISE = {};
    const AUTH0_CONTEXT_CALLBACK_URL = {};
    const AUTH0_CONTEXT_LOGOUT_URL = {};

    /**
     * Refresh the authToken store.
     * 
     * @param {Promise<Auth0Client>} - auth0Promise
     */
    async function refreshToken(auth0Promise) {
        const auth0 = await auth0Promise;
        const token = await auth0.getTokenSilently();
        authToken.set(token);
    }

    /**
     * Initiate Register/Login flow.
     *
     * @param {Promise<Auth0Client>} - auth0Promise
     * @param {boolean} preserveRoute - store current location so callback handler will navigate back to it.
     * @param {string} callback_url - explicit path to use for the callback.
     */
    async function login(auth0Promise, preserveRoute = true, callback_url) {
        console.log('login', { preserveRoute, callback_url });
        const auth0 = await auth0Promise;
        const redirect_uri =  callback_url || window.location.href;

        // try to keep the user on the same page from which they triggered login. If set to false should typically
        // cause redirect to /.
        const appState = (preserveRoute) ? { pathname: window.location.pathname, search: window.location.search } : {};
        await auth0.loginWithRedirect({ redirect_uri, appState });
    }

    /**
     * Log out the current user.
     *
     * @param {Promise<Auth0Client>} - auth0Promise
     * @param {string} logout_url - specify the url to return to after login.
     */
    async function logout(auth0Promise, logout_url) {
        console.log('logout', {logout_url});
        const auth0 = await auth0Promise;
        const returnTo = logout_url || window.location.href;
        authToken.set('');
        auth0.logout({ returnTo });
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var auth0SpaJs_production = createCommonjsModule(function (module, exports) {
    !function(e,t){module.exports=t();}(commonjsGlobal,function(){var e=function(t,n){return (e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);})(t,n)};var t=function(){return (t=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function n(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);}return n}function r(e,t,n,r){return new(n||(n=Promise))(function(o,i){function a(e){try{u(r.next(e));}catch(e){i(e);}}function c(e){try{u(r.throw(e));}catch(e){i(e);}}function u(e){e.done?o(e.value):new n(function(t){t(e.value);}).then(a,c);}u((r=r.apply(e,t||[])).next());})}function o(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a);}catch(e){i=[6,e],r=0;}finally{n=o=0;}if(5&i[0])throw i[1];return {value:i[0]?i[1]:void 0,done:!0}}([i,c])}}}var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:{};function a(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function c(e,t){return e(t={exports:{}},t.exports),t.exports}var u,s,f,l="object",d=function(e){return e&&e.Math==Math&&e},p=d(typeof globalThis==l&&globalThis)||d(typeof window==l&&window)||d(typeof self==l&&self)||d(typeof i==l&&i)||Function("return this")(),h=function(e){try{return !!e()}catch(e){return !0}},v=!h(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}),y={}.propertyIsEnumerable,m=Object.getOwnPropertyDescriptor,w={f:m&&!y.call({1:2},1)?function(e){var t=m(this,e);return !!t&&t.enumerable}:y},g=function(e,t){return {enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},b={}.toString,_=function(e){return b.call(e).slice(8,-1)},k="".split,S=h(function(){return !Object("z").propertyIsEnumerable(0)})?function(e){return "String"==_(e)?k.call(e,""):Object(e)}:Object,T=function(e){if(null==e)throw TypeError("Can't call method on "+e);return e},O=function(e){return S(T(e))},E=function(e){return "object"==typeof e?null!==e:"function"==typeof e},A=function(e,t){if(!E(e))return e;var n,r;if(t&&"function"==typeof(n=e.toString)&&!E(r=n.call(e)))return r;if("function"==typeof(n=e.valueOf)&&!E(r=n.call(e)))return r;if(!t&&"function"==typeof(n=e.toString)&&!E(r=n.call(e)))return r;throw TypeError("Can't convert object to primitive value")},x={}.hasOwnProperty,I=function(e,t){return x.call(e,t)},j=p.document,P=E(j)&&E(j.createElement),C=function(e){return P?j.createElement(e):{}},U=!v&&!h(function(){return 7!=Object.defineProperty(C("div"),"a",{get:function(){return 7}}).a}),D=Object.getOwnPropertyDescriptor,L={f:v?D:function(e,t){if(e=O(e),t=A(t,!0),U)try{return D(e,t)}catch(e){}if(I(e,t))return g(!w.f.call(e,t),e[t])}},F=function(e){if(!E(e))throw TypeError(String(e)+" is not an object");return e},R=Object.defineProperty,M={f:v?R:function(e,t,n){if(F(e),t=A(t,!0),F(n),U)try{return R(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported");return "value"in n&&(e[t]=n.value),e}},W=v?function(e,t,n){return M.f(e,t,g(1,n))}:function(e,t,n){return e[t]=n,e},q=function(e,t){try{W(p,e,t);}catch(n){p[e]=t;}return t},N=c(function(e){var t=p["__core-js_shared__"]||q("__core-js_shared__",{});(e.exports=function(e,n){return t[e]||(t[e]=void 0!==n?n:{})})("versions",[]).push({version:"3.2.1",mode:"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"});}),z=N("native-function-to-string",Function.toString),J=p.WeakMap,B="function"==typeof J&&/native code/.test(z.call(J)),G=0,H=Math.random(),Y=function(e){return "Symbol("+String(void 0===e?"":e)+")_"+(++G+H).toString(36)},V=N("keys"),K=function(e){return V[e]||(V[e]=Y(e))},Q={},X=p.WeakMap;if(B){var Z=new X,$=Z.get,ee=Z.has,te=Z.set;u=function(e,t){return te.call(Z,e,t),t},s=function(e){return $.call(Z,e)||{}},f=function(e){return ee.call(Z,e)};}else {var ne=K("state");Q[ne]=!0,u=function(e,t){return W(e,ne,t),t},s=function(e){return I(e,ne)?e[ne]:{}},f=function(e){return I(e,ne)};}var re={set:u,get:s,has:f,enforce:function(e){return f(e)?s(e):u(e,{})},getterFor:function(e){return function(t){var n;if(!E(t)||(n=s(t)).type!==e)throw TypeError("Incompatible receiver, "+e+" required");return n}}},oe=c(function(e){var t=re.get,n=re.enforce,r=String(z).split("toString");N("inspectSource",function(e){return z.call(e)}),(e.exports=function(e,t,o,i){var a=!!i&&!!i.unsafe,c=!!i&&!!i.enumerable,u=!!i&&!!i.noTargetGet;"function"==typeof o&&("string"!=typeof t||I(o,"name")||W(o,"name",t),n(o).source=r.join("string"==typeof t?t:"")),e!==p?(a?!u&&e[t]&&(c=!0):delete e[t],c?e[t]=o:W(e,t,o)):c?e[t]=o:q(t,o);})(Function.prototype,"toString",function(){return "function"==typeof this&&t(this).source||z.call(this)});}),ie=p,ae=function(e){return "function"==typeof e?e:void 0},ce=function(e,t){return arguments.length<2?ae(ie[e])||ae(p[e]):ie[e]&&ie[e][t]||p[e]&&p[e][t]},ue=Math.ceil,se=Math.floor,fe=function(e){return isNaN(e=+e)?0:(e>0?se:ue)(e)},le=Math.min,de=function(e){return e>0?le(fe(e),9007199254740991):0},pe=Math.max,he=Math.min,ve=function(e){return function(t,n,r){var o,i=O(t),a=de(i.length),c=function(e,t){var n=fe(e);return n<0?pe(n+t,0):he(n,t)}(r,a);if(e&&n!=n){for(;a>c;)if((o=i[c++])!=o)return !0}else for(;a>c;c++)if((e||c in i)&&i[c]===n)return e||c||0;return !e&&-1}},ye={includes:ve(!0),indexOf:ve(!1)},me=ye.indexOf,we=function(e,t){var n,r=O(e),o=0,i=[];for(n in r)!I(Q,n)&&I(r,n)&&i.push(n);for(;t.length>o;)I(r,n=t[o++])&&(~me(i,n)||i.push(n));return i},ge=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],be=ge.concat("length","prototype"),_e={f:Object.getOwnPropertyNames||function(e){return we(e,be)}},ke={f:Object.getOwnPropertySymbols},Se=ce("Reflect","ownKeys")||function(e){var t=_e.f(F(e)),n=ke.f;return n?t.concat(n(e)):t},Te=function(e,t){for(var n=Se(t),r=M.f,o=L.f,i=0;i<n.length;i++){var a=n[i];I(e,a)||r(e,a,o(t,a));}},Oe=/#|\.prototype\./,Ee=function(e,t){var n=xe[Ae(e)];return n==je||n!=Ie&&("function"==typeof t?h(t):!!t)},Ae=Ee.normalize=function(e){return String(e).replace(Oe,".").toLowerCase()},xe=Ee.data={},Ie=Ee.NATIVE="N",je=Ee.POLYFILL="P",Pe=Ee,Ce=L.f,Ue=function(e,t){var n,r,o,i,a,c=e.target,u=e.global,s=e.stat;if(n=u?p:s?p[c]||q(c,{}):(p[c]||{}).prototype)for(r in t){if(i=t[r],o=e.noTargetGet?(a=Ce(n,r))&&a.value:n[r],!Pe(u?r:c+(s?".":"#")+r,e.forced)&&void 0!==o){if(typeof i==typeof o)continue;Te(i,o);}(e.sham||o&&o.sham)&&W(i,"sham",!0),oe(n,r,i,e);}},De=!!Object.getOwnPropertySymbols&&!h(function(){return !String(Symbol())}),Le=p.Symbol,Fe=N("wks"),Re=function(e){return Fe[e]||(Fe[e]=De&&Le[e]||(De?Le:Y)("Symbol."+e))},Me=Re("match"),We=function(e){if(function(e){var t;return E(e)&&(void 0!==(t=e[Me])?!!t:"RegExp"==_(e))}(e))throw TypeError("The method doesn't accept regular expressions");return e},qe=Re("match"),Ne=function(e){var t=/./;try{"/./"[e](t);}catch(n){try{return t[qe]=!1,"/./"[e](t)}catch(e){}}return !1},ze="".startsWith,Je=Math.min;Ue({target:"String",proto:!0,forced:!Ne("startsWith")},{startsWith:function(e){var t=String(T(this));We(e);var n=de(Je(arguments.length>1?arguments[1]:void 0,t.length)),r=String(e);return ze?ze.call(t,r,n):t.slice(n,n+r.length)===r}});var Be,Ge,He,Ye=function(e){if("function"!=typeof e)throw TypeError(String(e)+" is not a function");return e},Ve=function(e,t,n){if(Ye(e),void 0===t)return e;switch(n){case 0:return function(){return e.call(t)};case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,o){return e.call(t,n,r,o)}}return function(){return e.apply(t,arguments)}},Ke=Function.call,Qe=function(e,t,n){return Ve(Ke,p[e].prototype[t],n)},Xe=(Qe("String","startsWith"),function(e){return function(t,n){var r,o,i=String(T(t)),a=fe(n),c=i.length;return a<0||a>=c?e?"":void 0:(r=i.charCodeAt(a))<55296||r>56319||a+1===c||(o=i.charCodeAt(a+1))<56320||o>57343?e?i.charAt(a):r:e?i.slice(a,a+2):o-56320+(r-55296<<10)+65536}}),Ze={codeAt:Xe(!1),charAt:Xe(!0)},$e=function(e){return Object(T(e))},et=!h(function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype}),tt=K("IE_PROTO"),nt=Object.prototype,rt=et?Object.getPrototypeOf:function(e){return e=$e(e),I(e,tt)?e[tt]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?nt:null},ot=Re("iterator"),it=!1;[].keys&&("next"in(He=[].keys())?(Ge=rt(rt(He)))!==Object.prototype&&(Be=Ge):it=!0),null==Be&&(Be={}),I(Be,ot)||W(Be,ot,function(){return this});var at={IteratorPrototype:Be,BUGGY_SAFARI_ITERATORS:it},ct=Object.keys||function(e){return we(e,ge)},ut=v?Object.defineProperties:function(e,t){F(e);for(var n,r=ct(t),o=r.length,i=0;o>i;)M.f(e,n=r[i++],t[n]);return e},st=ce("document","documentElement"),ft=K("IE_PROTO"),lt=function(){},dt=function(){var e,t=C("iframe"),n=ge.length;for(t.style.display="none",st.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write("<script>document.F=Object<\/script>"),e.close(),dt=e.F;n--;)delete dt.prototype[ge[n]];return dt()},pt=Object.create||function(e,t){var n;return null!==e?(lt.prototype=F(e),n=new lt,lt.prototype=null,n[ft]=e):n=dt(),void 0===t?n:ut(n,t)};Q[ft]=!0;var ht=M.f,vt=Re("toStringTag"),yt=function(e,t,n){e&&!I(e=n?e:e.prototype,vt)&&ht(e,vt,{configurable:!0,value:t});},mt={},wt=at.IteratorPrototype,gt=function(){return this},bt=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,n={};try{(e=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(n,[]),t=n instanceof Array;}catch(e){}return function(n,r){return F(n),function(e){if(!E(e)&&null!==e)throw TypeError("Can't set "+String(e)+" as a prototype")}(r),t?e.call(n,r):n.__proto__=r,n}}():void 0),_t=at.IteratorPrototype,kt=at.BUGGY_SAFARI_ITERATORS,St=Re("iterator"),Tt=function(){return this},Ot=Ze.charAt,Et=re.set,At=re.getterFor("String Iterator");!function(e,t,n,r,o,i,a){!function(e,t,n){var r=t+" Iterator";e.prototype=pt(wt,{next:g(1,n)}),yt(e,r,!1),mt[r]=gt;}(n,t,r);var c,u,s,f=function(e){if(e===o&&v)return v;if(!kt&&e in p)return p[e];switch(e){case"keys":case"values":case"entries":return function(){return new n(this,e)}}return function(){return new n(this)}},l=t+" Iterator",d=!1,p=e.prototype,h=p[St]||p["@@iterator"]||o&&p[o],v=!kt&&h||f(o),y="Array"==t&&p.entries||h;if(y&&(c=rt(y.call(new e)),_t!==Object.prototype&&c.next&&(rt(c)!==_t&&(bt?bt(c,_t):"function"!=typeof c[St]&&W(c,St,Tt)),yt(c,l,!0))),"values"==o&&h&&"values"!==h.name&&(d=!0,v=function(){return h.call(this)}),p[St]!==v&&W(p,St,v),mt[t]=v,o)if(u={values:f("values"),keys:i?v:f("keys"),entries:f("entries")},a)for(s in u)!kt&&!d&&s in p||oe(p,s,u[s]);else Ue({target:t,proto:!0,forced:kt||d},u);}(String,"String",function(e){Et(this,{type:"String Iterator",string:String(e),index:0});},function(){var e,t=At(this),n=t.string,r=t.index;return r>=n.length?{value:void 0,done:!0}:(e=Ot(n,r),t.index+=e.length,{value:e,done:!1})});var xt=function(e,t,n,r){try{return r?t(F(n)[0],n[1]):t(n)}catch(t){var o=e.return;throw void 0!==o&&F(o.call(e)),t}},It=Re("iterator"),jt=Array.prototype,Pt=function(e){return void 0!==e&&(mt.Array===e||jt[It]===e)},Ct=function(e,t,n){var r=A(t);r in e?M.f(e,r,g(0,n)):e[r]=n;},Ut=Re("toStringTag"),Dt="Arguments"==_(function(){return arguments}()),Lt=function(e){var t,n,r;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=function(e,t){try{return e[t]}catch(e){}}(t=Object(e),Ut))?n:Dt?_(t):"Object"==(r=_(t))&&"function"==typeof t.callee?"Arguments":r},Ft=Re("iterator"),Rt=function(e){if(null!=e)return e[Ft]||e["@@iterator"]||mt[Lt(e)]},Mt=Re("iterator"),Wt=!1;try{var qt=0,Nt={next:function(){return {done:!!qt++}},return:function(){Wt=!0;}};Nt[Mt]=function(){return this},Array.from(Nt,function(){throw 2});}catch(e){}var zt=!function(e,t){if(!t&&!Wt)return !1;var n=!1;try{var r={};r[Mt]=function(){return {next:function(){return {done:n=!0}}}},e(r);}catch(e){}return n}(function(e){Array.from(e);});Ue({target:"Array",stat:!0,forced:zt},{from:function(e){var t,n,r,o,i=$e(e),a="function"==typeof this?this:Array,c=arguments.length,u=c>1?arguments[1]:void 0,s=void 0!==u,f=0,l=Rt(i);if(s&&(u=Ve(u,c>2?arguments[2]:void 0,2)),null==l||a==Array&&Pt(l))for(n=new a(t=de(i.length));t>f;f++)Ct(n,f,s?u(i[f],f):i[f]);else for(o=l.call(i),n=new a;!(r=o.next()).done;f++)Ct(n,f,s?xt(o,u,[r.value,f],!0):r.value);return n.length=f,n}});ie.Array.from;var Jt,Bt=M.f,Gt=p.DataView,Ht=Gt&&Gt.prototype,Yt=p.Int8Array,Vt=Yt&&Yt.prototype,Kt=p.Uint8ClampedArray,Qt=Kt&&Kt.prototype,Xt=Yt&&rt(Yt),Zt=Vt&&rt(Vt),$t=Object.prototype,en=$t.isPrototypeOf,tn=Re("toStringTag"),nn=Y("TYPED_ARRAY_TAG"),rn=!(!p.ArrayBuffer||!Gt),on=rn&&!!bt&&"Opera"!==Lt(p.opera),an={Int8Array:1,Uint8Array:1,Uint8ClampedArray:1,Int16Array:2,Uint16Array:2,Int32Array:4,Uint32Array:4,Float32Array:4,Float64Array:8},cn=function(e){return E(e)&&I(an,Lt(e))};for(Jt in an)p[Jt]||(on=!1);if((!on||"function"!=typeof Xt||Xt===Function.prototype)&&(Xt=function(){throw TypeError("Incorrect invocation")},on))for(Jt in an)p[Jt]&&bt(p[Jt],Xt);if((!on||!Zt||Zt===$t)&&(Zt=Xt.prototype,on))for(Jt in an)p[Jt]&&bt(p[Jt].prototype,Zt);if(on&&rt(Qt)!==Zt&&bt(Qt,Zt),v&&!I(Zt,tn))for(Jt in Bt(Zt,tn,{get:function(){return E(this)?this[nn]:void 0}}),an)p[Jt]&&W(p[Jt],nn,Jt);rn&&bt&&rt(Ht)!==$t&&bt(Ht,$t);var un=function(e){if(cn(e))return e;throw TypeError("Target is not a typed array")},sn=function(e){if(bt){if(en.call(Xt,e))return e}else for(var t in an)if(I(an,Jt)){var n=p[t];if(n&&(e===n||en.call(n,e)))return e}throw TypeError("Target is not a typed array constructor")},fn=function(e,t,n){if(v){if(n)for(var r in an){var o=p[r];o&&I(o.prototype,e)&&delete o.prototype[e];}Zt[e]&&!n||oe(Zt,e,n?t:on&&Vt[e]||t);}},ln=Re("species"),dn=un,pn=sn,hn=[].slice;fn("slice",function(e,t){for(var n=hn.call(dn(this),e,t),r=function(e,t){var n,r=F(e).constructor;return void 0===r||null==(n=F(r)[ln])?t:Ye(n)}(this,this.constructor),o=0,i=n.length,a=new(pn(r))(i);i>o;)a[o]=n[o++];return a},h(function(){new Int8Array(1).slice();}));var vn=Re("unscopables"),yn=Array.prototype;null==yn[vn]&&W(yn,vn,pt(null));var mn,wn=ye.includes;Ue({target:"Array",proto:!0},{includes:function(e){return wn(this,e,arguments.length>1?arguments[1]:void 0)}}),mn="includes",yn[vn][mn]=!0;Qe("Array","includes");Ue({target:"String",proto:!0,forced:!Ne("includes")},{includes:function(e){return !!~String(T(this)).indexOf(We(e),arguments.length>1?arguments[1]:void 0)}});Qe("String","includes");function gn(e){var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n})},function(n){return t.resolve(e()).then(function(){return t.reject(n)})})}var bn=setTimeout;function _n(e){return Boolean(e&&void 0!==e.length)}function kn(){}function Sn(e){if(!(this instanceof Sn))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],In(e,this);}function Tn(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,Sn._immediateFn(function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var r;try{r=n(e._value);}catch(e){return void En(t.promise,e)}On(t.promise,r);}else (1===e._state?On:En)(t.promise,e._value);})):e._deferreds.push(t);}function On(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof Sn)return e._state=3,e._value=t,void An(e);if("function"==typeof n)return void In((r=n,o=t,function(){r.apply(o,arguments);}),e)}e._state=1,e._value=t,An(e);}catch(t){En(e,t);}var r,o;}function En(e,t){e._state=2,e._value=t,An(e);}function An(e){2===e._state&&0===e._deferreds.length&&Sn._immediateFn(function(){e._handled||Sn._unhandledRejectionFn(e._value);});for(var t=0,n=e._deferreds.length;t<n;t++)Tn(e,e._deferreds[t]);e._deferreds=null;}function xn(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n;}function In(e,t){var n=!1;try{e(function(e){n||(n=!0,On(t,e));},function(e){n||(n=!0,En(t,e));});}catch(e){if(n)return;n=!0,En(t,e);}}Sn.prototype.catch=function(e){return this.then(null,e)},Sn.prototype.then=function(e,t){var n=new this.constructor(kn);return Tn(this,new xn(e,t,n)),n},Sn.prototype.finally=gn,Sn.all=function(e){return new Sn(function(t,n){if(!_n(e))return n(new TypeError("Promise.all accepts an array"));var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);var o=r.length;function i(e,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var c=a.then;if("function"==typeof c)return void c.call(a,function(t){i(e,t);},n)}r[e]=a,0==--o&&t(r);}catch(e){n(e);}}for(var a=0;a<r.length;a++)i(a,r[a]);})},Sn.resolve=function(e){return e&&"object"==typeof e&&e.constructor===Sn?e:new Sn(function(t){t(e);})},Sn.reject=function(e){return new Sn(function(t,n){n(e);})},Sn.race=function(e){return new Sn(function(t,n){if(!_n(e))return n(new TypeError("Promise.race accepts an array"));for(var r=0,o=e.length;r<o;r++)Sn.resolve(e[r]).then(t,n);})},Sn._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e);}||function(e){bn(e,0);},Sn._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e);};var jn=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof commonjsGlobal)return commonjsGlobal;throw new Error("unable to locate global object")}();"Promise"in jn?jn.Promise.prototype.finally||(jn.Promise.prototype.finally=gn):jn.Promise=Sn,function(e){function t(e){if("utf-8"!==(e=void 0===e?"utf-8":e))throw new RangeError("Failed to construct 'TextEncoder': The encoding label provided ('"+e+"') is invalid.")}function n(e,t){if(t=void 0===t?{fatal:!1}:t,"utf-8"!==(e=void 0===e?"utf-8":e))throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('"+e+"') is invalid.");if(t.fatal)throw Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.")}if(e.TextEncoder&&e.TextDecoder)return !1;Object.defineProperty(t.prototype,"encoding",{value:"utf-8"}),t.prototype.encode=function(e,t){if((t=void 0===t?{stream:!1}:t).stream)throw Error("Failed to encode: the 'stream' option is unsupported.");t=0;for(var n=e.length,r=0,o=Math.max(32,n+(n>>1)+7),i=new Uint8Array(o>>3<<3);t<n;){var a=e.charCodeAt(t++);if(55296<=a&&56319>=a){if(t<n){var c=e.charCodeAt(t);56320==(64512&c)&&(++t,a=((1023&a)<<10)+(1023&c)+65536);}if(55296<=a&&56319>=a)continue}if(r+4>i.length&&(o+=8,o=(o*=1+t/e.length*2)>>3<<3,(c=new Uint8Array(o)).set(i),i=c),0==(4294967168&a))i[r++]=a;else {if(0==(4294965248&a))i[r++]=a>>6&31|192;else if(0==(4294901760&a))i[r++]=a>>12&15|224,i[r++]=a>>6&63|128;else {if(0!=(4292870144&a))continue;i[r++]=a>>18&7|240,i[r++]=a>>12&63|128,i[r++]=a>>6&63|128;}i[r++]=63&a|128;}}return i.slice(0,r)},Object.defineProperty(n.prototype,"encoding",{value:"utf-8"}),Object.defineProperty(n.prototype,"fatal",{value:!1}),Object.defineProperty(n.prototype,"ignoreBOM",{value:!1}),n.prototype.decode=function(e,t){if((t=void 0===t?{stream:!1}:t).stream)throw Error("Failed to decode: the 'stream' option is unsupported.");t=0;for(var n=(e=new Uint8Array(e)).length,r=[];t<n;){var o=e[t++];if(0===o)break;if(0==(128&o))r.push(o);else if(192==(224&o)){var i=63&e[t++];r.push((31&o)<<6|i);}else if(224==(240&o)){i=63&e[t++];var a=63&e[t++];r.push((31&o)<<12|i<<6|a);}else if(240==(248&o)){65535<(o=(7&o)<<18|(i=63&e[t++])<<12|(a=63&e[t++])<<6|63&e[t++])&&(o-=65536,r.push(o>>>10&1023|55296),o=56320|1023&o),r.push(o);}}return String.fromCharCode.apply(null,r)},e.TextEncoder=t,e.TextDecoder=n;}("undefined"!=typeof window?window:i);var Pn=c(function(e,t){Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){var e=this;this.locked=new Map,this.addToLocked=function(t,n){var r=e.locked.get(t);void 0===r?void 0===n?e.locked.set(t,[]):e.locked.set(t,[n]):void 0!==n&&(r.unshift(n),e.locked.set(t,r));},this.isLocked=function(t){return e.locked.has(t)},this.lock=function(t){return new Promise(function(n,r){e.isLocked(t)?e.addToLocked(t,n):(e.addToLocked(t),n());})},this.unlock=function(t){var n=e.locked.get(t);if(void 0!==n&&0!==n.length){var r=n.pop();e.locked.set(t,n),void 0!==r&&setTimeout(r,0);}else e.locked.delete(t);};}return e.getInstance=function(){return void 0===e.instance&&(e.instance=new e),e.instance},e}();t.default=function(){return n.getInstance()};});a(Pn);var Cn=a(c(function(e,t){var n=i&&i.__awaiter||function(e,t,n,r){return new(n||(n=Promise))(function(o,i){function a(e){try{u(r.next(e));}catch(e){i(e);}}function c(e){try{u(r.throw(e));}catch(e){i(e);}}function u(e){e.done?o(e.value):new n(function(t){t(e.value);}).then(a,c);}u((r=r.apply(e,t||[])).next());})},r=i&&i.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a);}catch(e){i=[6,e],r=0;}finally{n=o=0;}if(5&i[0])throw i[1];return {value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};Object.defineProperty(t,"__esModule",{value:!0});var o="browser-tabs-lock-key";function a(e){return new Promise(function(t){return setTimeout(t,e)})}function c(e){for(var t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",n="",r=0;r<e;r++){n+=t[Math.floor(Math.random()*t.length)];}return n}var u=function(){function e(){this.acquiredIatSet=new Set,this.id=Date.now().toString()+c(15),this.acquireLock=this.acquireLock.bind(this),this.releaseLock=this.releaseLock.bind(this),this.releaseLock__private__=this.releaseLock__private__.bind(this),this.waitForSomethingToChange=this.waitForSomethingToChange.bind(this),this.refreshLockWhileAcquired=this.refreshLockWhileAcquired.bind(this),void 0===e.waiters&&(e.waiters=[]);}return e.prototype.acquireLock=function(e,t){return void 0===t&&(t=5e3),n(this,void 0,void 0,function(){var n,i,u,f,l,d;return r(this,function(r){switch(r.label){case 0:n=Date.now()+c(4),i=Date.now()+t,u=o+"-"+e,f=window.localStorage,r.label=1;case 1:return Date.now()<i?null!==f.getItem(u)?[3,4]:(l=this.id+"-"+e+"-"+n,[4,a(Math.floor(25*Math.random()))]):[3,7];case 2:return r.sent(),f.setItem(u,JSON.stringify({id:this.id,iat:n,timeoutKey:l,timeAcquired:Date.now(),timeRefreshed:Date.now()})),[4,a(30)];case 3:return r.sent(),null!==(d=f.getItem(u))&&(d=JSON.parse(d)).id===this.id&&d.iat===n?(this.acquiredIatSet.add(n),this.refreshLockWhileAcquired(u,n),[2,!0]):[3,6];case 4:return s(),[4,this.waitForSomethingToChange(i)];case 5:r.sent(),r.label=6;case 6:return n=Date.now()+c(4),[3,1];case 7:return [2,!1]}})})},e.prototype.refreshLockWhileAcquired=function(e,t){return n(this,void 0,void 0,function(){var o=this;return r(this,function(i){return setTimeout(function(){return n(o,void 0,void 0,function(){var n,o;return r(this,function(r){switch(r.label){case 0:return [4,Pn.default().lock(t)];case 1:return r.sent(),this.acquiredIatSet.has(t)?(n=window.localStorage,null===(o=n.getItem(e))?(Pn.default().unlock(t),[2]):((o=JSON.parse(o)).timeRefreshed=Date.now(),n.setItem(e,JSON.stringify(o)),Pn.default().unlock(t),this.refreshLockWhileAcquired(e,t),[2])):(Pn.default().unlock(t),[2])}})})},1e3),[2]})})},e.prototype.waitForSomethingToChange=function(t){return n(this,void 0,void 0,function(){return r(this,function(n){switch(n.label){case 0:return [4,new Promise(function(n){var r=!1,o=Date.now(),i=50,a=!1;function c(){if(a||(window.removeEventListener("storage",c),e.removeFromWaiting(c),clearTimeout(u),a=!0),!r){r=!0;var t=i-(Date.now()-o);t>0?setTimeout(n,t):n();}}window.addEventListener("storage",c),e.addToWaiting(c);var u=setTimeout(c,Math.max(0,t-Date.now()));})];case 1:return n.sent(),[2]}})})},e.addToWaiting=function(t){this.removeFromWaiting(t),void 0!==e.waiters&&e.waiters.push(t);},e.removeFromWaiting=function(t){void 0!==e.waiters&&(e.waiters=e.waiters.filter(function(e){return e!==t}));},e.notifyWaiters=function(){void 0!==e.waiters&&e.waiters.slice().forEach(function(e){return e()});},e.prototype.releaseLock=function(e){return n(this,void 0,void 0,function(){return r(this,function(t){switch(t.label){case 0:return [4,this.releaseLock__private__(e)];case 1:return [2,t.sent()]}})})},e.prototype.releaseLock__private__=function(t){return n(this,void 0,void 0,function(){var n,i,a;return r(this,function(r){switch(r.label){case 0:return n=window.localStorage,i=o+"-"+t,null===(a=n.getItem(i))?[2]:(a=JSON.parse(a)).id!==this.id?[3,2]:[4,Pn.default().lock(a.iat)];case 1:r.sent(),this.acquiredIatSet.delete(a.iat),n.removeItem(i),Pn.default().unlock(a.iat),e.notifyWaiters(),r.label=2;case 2:return [2]}})})},e.waiters=void 0,e}();function s(){for(var e=Date.now()-5e3,t=window.localStorage,n=Object.keys(t),r=!1,i=0;i<n.length;i++){var a=n[i];if(a.includes(o)){var c=t.getItem(a);null!==c&&(void 0===(c=JSON.parse(c)).timeRefreshed&&c.timeAcquired<e||void 0!==c.timeRefreshed&&c.timeRefreshed<e)&&(t.removeItem(a),r=!0);}}r&&u.notifyWaiters();}t.default=u;}));function Un(e,t){return t=t||{},new Promise(function(n,r){var o=new XMLHttpRequest,i=[],a=[],c={},u=function(){return {ok:2==(o.status/100|0),statusText:o.statusText,status:o.status,url:o.responseURL,text:function(){return Promise.resolve(o.responseText)},json:function(){return Promise.resolve(JSON.parse(o.responseText))},blob:function(){return Promise.resolve(new Blob([o.response]))},clone:u,headers:{keys:function(){return i},entries:function(){return a},get:function(e){return c[e.toLowerCase()]},has:function(e){return e.toLowerCase()in c}}}};for(var s in o.open(t.method||"get",e,!0),o.onload=function(){o.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(e,t,n){i.push(t=t.toLowerCase()),a.push([t,n]),c[t]=c[t]?c[t]+","+n:n;}),n(u());},o.onerror=r,o.withCredentials="include"==t.credentials,t.headers)o.setRequestHeader(s,t.headers[s]);o.send(t.body||null);})}var Dn={timeoutInSeconds:60},Ln=function(e){return e.filter(function(t,n){return e.indexOf(t)===n})},Fn={error:"timeout",error_description:"Timeout"},Rn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var n=e.filter(Boolean).join();return Ln(n.replace(/\s/g,",").split(",")).join(" ").trim()},Mn=function(){var e=window.open("","auth0:authorize:popup","left=100,top=100,width=400,height=600,resizable,scrollbars=yes,status=1");if(!e)throw new Error("Could not open popup");return e},Wn=function(e,n,r){return e.location.href=n,new Promise(function(n,o){var i=setTimeout(function(){o(t(t({},Fn),{popup:e}));},1e3*(r.timeoutInSeconds||60));window.addEventListener("message",function(t){if(t.data&&"authorization_response"===t.data.type){if(clearTimeout(i),e.close(),t.data.response.error)return o(t.data.response);n(t.data.response);}});})},qn=function(){var e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.",t="";return Array.from(Vn().getRandomValues(new Uint8Array(43))).forEach(function(n){return t+=e[n%e.length]}),t},Nn=function(e){return btoa(e)},zn=function(e){return Object.keys(e).filter(function(t){return void 0!==e[t]}).map(function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])}).join("&")},Jn=function(e){return r(void 0,void 0,void 0,function(){var t;return o(this,function(n){switch(n.label){case 0:return t=Kn().digest({name:"SHA-256"},(new TextEncoder).encode(e)),window.msCrypto?[2,new Promise(function(e,n){t.oncomplete=function(t){e(t.target.result);},t.onerror=function(e){n(e.error);},t.onabort=function(){n("The digest operation was aborted");};})]:[4,t];case 1:return [2,n.sent()]}})})},Bn=function(e){return function(e){return decodeURIComponent(atob(e).split("").map(function(e){return "%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)}).join(""))}(e.replace(/_/g,"/").replace(/-/g,"+"))},Gn=function(e){var t=new Uint8Array(e);return function(e){var t={"+":"-","/":"_","=":""};return e.replace(/[\+\/=]/g,function(e){return t[e]})}(window.btoa(String.fromCharCode.apply(String,Array.from(t))))},Hn=function(e,t){return r(void 0,void 0,void 0,function(){var r,i,a,c,u,s,f;return o(this,function(o){switch(o.label){case 0:return [4,Un(e,t)];case 1:return [4,(r=o.sent()).json()];case 2:if(i=o.sent(),a=i.error,c=i.error_description,u=n(i,["error","error_description"]),!r.ok)throw s=c||"HTTP error. Unable to fetch "+e,(f=new Error(s)).error=a||"request_error",f.error_description=s,f;return [2,u]}})})},Yn=function(e){return r(void 0,void 0,void 0,function(){var r=e.baseUrl,i=n(e,["baseUrl"]);return o(this,function(e){switch(e.label){case 0:return [4,Hn(r+"/oauth/token",{method:"POST",body:JSON.stringify(t({grant_type:"authorization_code",redirect_uri:window.location.origin},i)),headers:{"Content-type":"application/json"}})];case 1:return [2,e.sent()]}})})},Vn=function(){return window.crypto||window.msCrypto},Kn=function(){var e=Vn();return e.subtle||e.webkitSubtle},Qn=function(){if(!Vn())throw new Error("For security reasons, `window.crypto` is required to run `auth0-spa-js`.");if(void 0===Kn())throw new Error("\n      auth0-spa-js must run on a secure origin.\n      See https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin \n      for more information.\n    ")},Xn=function(e){return e.audience+"::"+e.scope},Zn=function(){function e(){this.cache={};}return e.prototype.save=function(e){var t=this,n=Xn(e);this.cache[n]=e;var r,o,i,a=(r=e.expires_in,o=e.decodedToken.claims.exp,i=(new Date(1e3*o).getTime()-(new Date).getTime())/1e3,1e3*Math.min(r,i)*.8);setTimeout(function(){delete t.cache[n];},a);},e.prototype.get=function(e){return this.cache[Xn(e)]},e}(),$n=c(function(e,t){var n=i&&i.__assign||Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e};function r(e,t){if(!t)return "";var n="; "+e;return !0===t?n:n+"="+t}function o(e,t,n){return encodeURIComponent(e).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/\(/g,"%28").replace(/\)/g,"%29")+"="+encodeURIComponent(t).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent)+function(e){if("number"==typeof e.expires){var t=new Date;t.setMilliseconds(t.getMilliseconds()+864e5*e.expires),e.expires=t;}return r("Expires",e.expires?e.expires.toUTCString():"")+r("Domain",e.domain)+r("Path",e.path)+r("Secure",e.secure)+r("SameSite",e.sameSite)}(n)}function a(e){for(var t={},n=e?e.split("; "):[],r=/(%[0-9A-Z]{2})+/g,o=0;o<n.length;o++){var i=n[o].split("="),a=i.slice(1).join("=");'"'===a.charAt(0)&&(a=a.slice(1,-1));try{t[i[0].replace(r,decodeURIComponent)]=a.replace(r,decodeURIComponent);}catch(e){}}return t}function c(){return a(document.cookie)}function u(e,t,r){document.cookie=o(e,t,n({path:"/"},r));}t.__esModule=!0,t.encode=o,t.parse=a,t.getAll=c,t.get=function(e){return c()[e]},t.set=u,t.remove=function(e,t){u(e,"",n({},t,{expires:-1}));};});a($n);$n.encode,$n.parse;var er=$n.getAll,tr=$n.get,nr=$n.set,rr=$n.remove,or=function(){return Object.keys(er()||{})},ir=function(e){var t=tr(e);if(void 0!==t)return JSON.parse(t)},ar=function(e,t,n){nr(e,JSON.stringify(t),{expires:n.daysUntilExpire});},cr=function(e){rr(e);},ur="a0.spajs.txs.",sr=function(e){return ""+ur+e},fr=function(){function e(){var e=this;this.transactions={},or().filter(function(e){return e.startsWith(ur)}).forEach(function(t){var n=t.replace(ur,"");e.transactions[n]=ir(t);});}return e.prototype.create=function(e,t){this.transactions[e]=t,ar(sr(e),t,{daysUntilExpire:1});},e.prototype.get=function(e){return this.transactions[e]},e.prototype.remove=function(e){delete this.transactions[e],cr(sr(e));},e}(),lr=function(e){return "number"==typeof e},dr=["iss","aud","exp","nbf","iat","jti","azp","nonce","auth_time","at_hash","c_hash","acr","amr","sub_jwk","cnf","sip_from_tag","sip_date","sip_callid","sip_cseq_num","sip_via_branch","orig","dest","mky","events","toe","txn","rph","sid","vot","vtm"],pr=function(e){if(!e.id_token)throw new Error("ID token is required but missing");var t=function(e){var t=e.split("."),n=t[0],r=t[1],o=t[2];if(3!==t.length||!n||!r||!o)throw new Error("ID token could not be decoded");var i=JSON.parse(Bn(r)),a={__raw:e},c={};return Object.keys(i).forEach(function(e){a[e]=i[e],dr.includes(e)||(c[e]=i[e]);}),{encoded:{header:n,payload:r,signature:o},header:JSON.parse(Bn(n)),claims:a,user:c}}(e.id_token);if(!t.claims.iss)throw new Error("Issuer (iss) claim must be a string present in the ID token");if(t.claims.iss!==e.iss)throw new Error('Issuer (iss) claim mismatch in the ID token; expected "'+e.iss+'", found "'+t.claims.iss+'"');if(!t.user.sub)throw new Error("Subject (sub) claim must be a string present in the ID token");if("RS256"!==t.header.alg)throw new Error('Signature algorithm of "'+t.header.alg+'" is not supported. Expected the ID token to be signed with "RS256".');if(!t.claims.aud||"string"!=typeof t.claims.aud&&!Array.isArray(t.claims.aud))throw new Error("Audience (aud) claim must be a string or array of strings present in the ID token");if(Array.isArray(t.claims.aud)){if(!t.claims.aud.includes(e.aud))throw new Error('Audience (aud) claim mismatch in the ID token; expected "'+e.aud+'" but was not one of "'+t.claims.aud.join(", ")+'"');if(t.claims.aud.length>1){if(!t.claims.azp)throw new Error("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values");if(t.claims.azp!==e.aud)throw new Error('Authorized Party (azp) claim mismatch in the ID token; expected "'+e.aud+'", found "'+t.claims.azp+'"')}}else if(t.claims.aud!==e.aud)throw new Error('Audience (aud) claim mismatch in the ID token; expected "'+e.aud+'" but found "'+t.claims.aud+'"');if(e.nonce){if(!t.claims.nonce)throw new Error("Nonce (nonce) claim must be a string present in the ID token");if(t.claims.nonce!==e.nonce)throw new Error('Nonce (nonce) claim mismatch in the ID token; expected "'+e.nonce+'", found "'+t.claims.nonce+'"')}if(e.max_age&&!lr(t.claims.auth_time))throw new Error("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified");if(!lr(t.claims.exp))throw new Error("Expiration Time (exp) claim must be a number present in the ID token");if(!lr(t.claims.iat))throw new Error("Issued At (iat) claim must be a number present in the ID token");var n=e.leeway||60,r=new Date,o=new Date(0),i=new Date(0),a=new Date(0);if(a.setUTCSeconds((parseInt(t.claims.auth_time)+e.max_age)/1e3+n),o.setUTCSeconds(t.claims.exp+n),i.setUTCSeconds(t.claims.nbf-n),r>o)throw new Error("Expiration Time (exp) claim error in the ID token; current time ("+r+") is after expiration time ("+o+")");if(lr(t.claims.nbf)&&r<i)throw new Error("Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Currrent time ("+r+") is before "+i);if(lr(t.claims.auth_time)&&r>a)throw new Error("Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Currrent time ("+r+") is after last auth at "+a);return t},hr=function(t){function n(e,r,o){var i=t.call(this,r)||this;return i.error=e,i.error_description=r,i.state=o,Object.setPrototypeOf(i,n.prototype),i}return function(t,n){function r(){this.constructor=t;}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}(n,t),n}(Error),vr=new Cn,yr=function(){function e(e){this.options=e,this.DEFAULT_SCOPE="openid profile email",this.cache=new Zn,this.transactionManager=new fr,this.domainUrl="https://"+this.options.domain,this.tokenIssuer=this.options.issuer?"https://"+this.options.issuer+"/":this.domainUrl+"/";}return e.prototype._url=function(e){var t=encodeURIComponent(btoa(JSON.stringify({name:"auth0-spa-js",version:"1.6.2"})));return ""+this.domainUrl+e+"&auth0Client="+t},e.prototype._getParams=function(e,r,o,i,a){var c=this.options,u=(c.domain,c.leeway,n(c,["domain","leeway"]));return t(t(t({},u),e),{scope:Rn(this.DEFAULT_SCOPE,this.options.scope,e.scope),response_type:"code",response_mode:"query",state:r,nonce:o,redirect_uri:a||this.options.redirect_uri,code_challenge:i,code_challenge_method:"S256"})},e.prototype._authorizeUrl=function(e){return this._url("/authorize?"+zn(e))},e.prototype._verifyIdToken=function(e,t){return pr({iss:this.tokenIssuer,aud:this.options.client_id,id_token:e,nonce:t,leeway:this.options.leeway,max_age:this._parseNumber(this.options.max_age)})},e.prototype._parseNumber=function(e){return "string"!=typeof e?e:parseInt(e,10)||void 0},e.prototype.buildAuthorizeUrl=function(e){return void 0===e&&(e={}),r(this,void 0,void 0,function(){var t,r,i,a,c,u,s,f,l,d,p;return o(this,function(o){switch(o.label){case 0:return t=e.redirect_uri,r=e.appState,i=n(e,["redirect_uri","appState"]),a=Nn(qn()),c=qn(),u=qn(),[4,Jn(u)];case 1:return s=o.sent(),f=Gn(s),l=e.fragment?"#"+e.fragment:"",d=this._getParams(i,a,c,f,t),p=this._authorizeUrl(d),this.transactionManager.create(a,{nonce:c,code_verifier:u,appState:r,scope:d.scope,audience:d.audience||"default"}),[2,p+l]}})})},e.prototype.loginWithPopup=function(e,i){return void 0===e&&(e={}),void 0===i&&(i=Dn),r(this,void 0,void 0,function(){var r,a,c,u,s,f,l,d,p,h,v,y,m;return o(this,function(o){switch(o.label){case 0:return [4,Mn()];case 1:return r=o.sent(),a=n(e,[]),c=Nn(qn()),u=qn(),s=qn(),[4,Jn(s)];case 2:return f=o.sent(),l=Gn(f),d=this._getParams(a,c,u,l,this.options.redirect_uri||window.location.origin),p=this._authorizeUrl(t(t({},d),{response_mode:"web_message"})),[4,Wn(r,p,i)];case 3:if(h=o.sent(),c!==h.state)throw new Error("Invalid state");return [4,Yn({baseUrl:this.domainUrl,audience:e.audience||this.options.audience,client_id:this.options.client_id,code_verifier:s,code:h.code})];case 4:return v=o.sent(),y=this._verifyIdToken(v.id_token,u),m=t(t({},v),{decodedToken:y,scope:d.scope,audience:d.audience||"default"}),this.cache.save(m),ar("auth0.is.authenticated",!0,{daysUntilExpire:1}),[2]}})})},e.prototype.getUser=function(e){return void 0===e&&(e={audience:this.options.audience||"default",scope:this.options.scope||this.DEFAULT_SCOPE}),r(this,void 0,void 0,function(){var t;return o(this,function(n){return e.scope=Rn(this.DEFAULT_SCOPE,e.scope),[2,(t=this.cache.get(e))&&t.decodedToken.user]})})},e.prototype.getIdTokenClaims=function(e){return void 0===e&&(e={audience:this.options.audience||"default",scope:this.options.scope||this.DEFAULT_SCOPE}),r(this,void 0,void 0,function(){var t;return o(this,function(n){return e.scope=Rn(this.DEFAULT_SCOPE,e.scope),[2,(t=this.cache.get(e))&&t.decodedToken.claims]})})},e.prototype.loginWithRedirect=function(e){return void 0===e&&(e={}),r(this,void 0,void 0,function(){var t;return o(this,function(n){switch(n.label){case 0:return [4,this.buildAuthorizeUrl(e)];case 1:return t=n.sent(),window.location.assign(t),[2]}})})},e.prototype.handleRedirectCallback=function(e){return void 0===e&&(e=window.location.href),r(this,void 0,void 0,function(){var n,r,i,a,c,u,s,f,l,d;return o(this,function(o){switch(o.label){case 0:if(0===(n=e.split("?").slice(1)).length)throw new Error("There are no query params available for parsing.");if(r=function(e){e.indexOf("#")>-1&&(e=e.substr(0,e.indexOf("#")));var n=e.split("&"),r={};return n.forEach(function(e){var t=e.split("="),n=t[0],o=t[1];r[n]=decodeURIComponent(o);}),t(t({},r),{expires_in:parseInt(r.expires_in)})}(n.join("")),i=r.state,a=r.code,c=r.error,u=r.error_description,c)throw this.transactionManager.remove(i),new hr(c,u,i);if(!(s=this.transactionManager.get(i)))throw new Error("Invalid state");return this.transactionManager.remove(i),[4,Yn({baseUrl:this.domainUrl,audience:this.options.audience,client_id:this.options.client_id,code_verifier:s.code_verifier,code:a})];case 1:return f=o.sent(),l=this._verifyIdToken(f.id_token,s.nonce),d=t(t({},f),{decodedToken:l,audience:s.audience,scope:s.scope}),this.cache.save(d),ar("auth0.is.authenticated",!0,{daysUntilExpire:1}),[2,{appState:s.appState}]}})})},e.prototype.getTokenSilently=function(e){return void 0===e&&(e={audience:this.options.audience,scope:this.options.scope||this.DEFAULT_SCOPE,ignoreCache:!1}),r(this,void 0,void 0,function(){var n,r,i,a,c,u,s,f,l,d,p,h,v;return o(this,function(o){switch(o.label){case 0:e.scope=Rn(this.DEFAULT_SCOPE,e.scope),o.label=1;case 1:return o.trys.push([1,8,9,11]),[4,vr.acquireLock("auth0.lock.getTokenSilently",5e3)];case 2:return o.sent(),e.ignoreCache?[3,4]:(n=this.cache.get({scope:e.scope,audience:e.audience||"default"}))?[4,vr.releaseLock("auth0.lock.getTokenSilently")]:[3,4];case 3:return o.sent(),[2,n.access_token];case 4:return r=Nn(qn()),i=qn(),a=qn(),[4,Jn(a)];case 5:return c=o.sent(),u=Gn(c),s={audience:e.audience,scope:e.scope},f=this._getParams(s,r,i,u,this.options.redirect_uri||window.location.origin),l=this._authorizeUrl(t(t({},f),{prompt:"none",response_mode:"web_message"})),[4,(y=l,m=this.domainUrl,new Promise(function(e,t){var n=window.document.createElement("iframe");n.setAttribute("width","0"),n.setAttribute("height","0"),n.style.display="none";var r=setTimeout(function(){t(Fn),window.document.body.removeChild(n);},6e4),o=function(i){i.origin==m&&i.data&&"authorization_response"===i.data.type&&(i.source.close(),i.data.response.error?t(i.data.response):e(i.data.response),clearTimeout(r),window.removeEventListener("message",o,!1),window.document.body.removeChild(n));};window.addEventListener("message",o,!1),window.document.body.appendChild(n),n.setAttribute("src",y);}))];case 6:if(d=o.sent(),r!==d.state)throw new Error("Invalid state");return [4,Yn({baseUrl:this.domainUrl,audience:e.audience||this.options.audience,client_id:this.options.client_id,code_verifier:a,code:d.code})];case 7:return p=o.sent(),h=this._verifyIdToken(p.id_token,i),v=t(t({},p),{decodedToken:h,scope:f.scope,audience:f.audience||"default"}),this.cache.save(v),ar("auth0.is.authenticated",!0,{daysUntilExpire:1}),[2,p.access_token];case 8:throw o.sent();case 9:return [4,vr.releaseLock("auth0.lock.getTokenSilently")];case 10:return o.sent(),[7];case 11:return [2]}var y,m;})})},e.prototype.getTokenWithPopup=function(e,t){return void 0===e&&(e={audience:this.options.audience,scope:this.options.scope||this.DEFAULT_SCOPE}),void 0===t&&(t=Dn),r(this,void 0,void 0,function(){return o(this,function(n){switch(n.label){case 0:return e.scope=Rn(this.DEFAULT_SCOPE,this.options.scope,e.scope),[4,this.loginWithPopup(e,t)];case 1:return n.sent(),[2,this.cache.get({scope:e.scope,audience:e.audience||"default"}).access_token]}})})},e.prototype.isAuthenticated=function(){return r(this,void 0,void 0,function(){return o(this,function(e){switch(e.label){case 0:return [4,this.getUser()];case 1:return [2,!!e.sent()]}})})},e.prototype.logout=function(e){void 0===e&&(e={}),null!==e.client_id?e.client_id=e.client_id||this.options.client_id:delete e.client_id,cr("auth0.is.authenticated");var t=e.federated,r=n(e,["federated"]),o=t?"&federated":"",i=this._url("/v2/logout?"+zn(r));window.location.assign(""+i+o);},e}();return function(e){return r(this,void 0,void 0,function(){var t;return o(this,function(n){switch(n.label){case 0:if(Qn(),t=new yr(e),!ir("auth0.is.authenticated"))return [2,t];n.label=1;case 1:return n.trys.push([1,3,,4]),[4,t.getTokenSilently({audience:e.audience,scope:e.scope,ignoreCache:!0})];case 2:case 3:return n.sent(),[3,4];case 4:return [2,t]}})})}});
    //# sourceMappingURL=auth0-spa-js.production.js.map
    });

    var createAuth0Client = unwrapExports(auth0SpaJs_production);

    /* node_modules/@dopry/svelte-auth0/src/components/Auth0Context.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1 } = globals;

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
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
    			if (default_slot) default_slot.d(detaching);
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
    	validate_slots('Auth0Context', slots, ['default']);
    	let { domain } = $$props;
    	let { client_id } = $$props;
    	let { audience } = $$props;
    	let { callback_url } = $$props;
    	let { logout_url } = $$props;
    	setContext(AUTH0_CONTEXT_CALLBACK_URL, callback_url);
    	setContext(AUTH0_CONTEXT_LOGOUT_URL, logout_url);

    	// constants
    	// TODO: parse JWT token and get token's actual expiration time.
    	const refreshRate = 10 * 60 * 60 * 1000;

    	// locals
    	let tokenRefreshIntervalId;

    	// getContext doesn't seem to return a value in OnMount, so we'll pass the auth0Promise around by reference.
    	let auth0Promise = createAuth0Client({ domain, client_id, audience });

    	setContext(AUTH0_CONTEXT_CLIENT_PROMISE, auth0Promise);

    	async function handleOnMount() {
    		// on run onMount after auth0
    		const auth0 = await auth0Promise;

    		// Not all browsers support this, please program defensively!
    		const params = new URLSearchParams(window.location.search);

    		// Check if something went wrong during login redirect
    		// and extract the error message
    		if (params.has('error')) {
    			authError.set(new Error(params.get('error_description')));
    		}

    		// if code then login success
    		if (params.has('code')) {
    			// Let the Auth0 SDK do it's stuff - save some state, etc.
    			const { appState } = await auth0.handleRedirectCallback();

    			// Can be smart here and redirect to original path instead of root
    			const url = appState.pathname || appState.search
    			? `${appState.pathname}${appState.search}`
    			: '';

    			// redirect to the last page we were on when login was configured if it was passed.
    			history.replaceState({}, "", url);

    			// location.href = url;
    			// clear errors on login.
    			authError.set(null);
    		}

    		const _isAuthenticated = await auth0.isAuthenticated();
    		isAuthenticated.set(_isAuthenticated);

    		if (_isAuthenticated) {
    			// fetch the user info
    			const user = await auth0.getUser();

    			userInfo.set(user);

    			// fetch the token claims
    			const idTokenClaims = await auth0.getIdTokenClaims();

    			idToken.set(idTokenClaims.__raw);

    			// automatically keep a curent token.
    			refreshToken(auth0Promise);

    			tokenRefreshIntervalId = setInterval(refreshToken, refreshRate);
    		}

    		isLoading.set(false);
    	}

    	// clear token refresh on Destroy so we're not leaking intervals.
    	async function handleOnDestroy() {
    		clearInterval(tokenRefreshIntervalId);
    	}

    	onMount(handleOnMount);
    	onDestroy(handleOnDestroy);
    	const writable_props = ['domain', 'client_id', 'audience', 'callback_url', 'logout_url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Auth0Context> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('domain' in $$props) $$invalidate(0, domain = $$props.domain);
    		if ('client_id' in $$props) $$invalidate(1, client_id = $$props.client_id);
    		if ('audience' in $$props) $$invalidate(2, audience = $$props.audience);
    		if ('callback_url' in $$props) $$invalidate(3, callback_url = $$props.callback_url);
    		if ('logout_url' in $$props) $$invalidate(4, logout_url = $$props.logout_url);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createAuth0Client,
    		onMount,
    		onDestroy,
    		setContext,
    		getContext,
    		AUTH0_CONTEXT_CALLBACK_URL,
    		AUTH0_CONTEXT_CLIENT_PROMISE,
    		AUTH0_CONTEXT_LOGOUT_URL,
    		refreshToken,
    		isAuthenticated,
    		isLoading,
    		authError,
    		userInfo,
    		idToken,
    		domain,
    		client_id,
    		audience,
    		callback_url,
    		logout_url,
    		refreshRate,
    		tokenRefreshIntervalId,
    		auth0Promise,
    		handleOnMount,
    		handleOnDestroy
    	});

    	$$self.$inject_state = $$props => {
    		if ('domain' in $$props) $$invalidate(0, domain = $$props.domain);
    		if ('client_id' in $$props) $$invalidate(1, client_id = $$props.client_id);
    		if ('audience' in $$props) $$invalidate(2, audience = $$props.audience);
    		if ('callback_url' in $$props) $$invalidate(3, callback_url = $$props.callback_url);
    		if ('logout_url' in $$props) $$invalidate(4, logout_url = $$props.logout_url);
    		if ('tokenRefreshIntervalId' in $$props) tokenRefreshIntervalId = $$props.tokenRefreshIntervalId;
    		if ('auth0Promise' in $$props) auth0Promise = $$props.auth0Promise;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [domain, client_id, audience, callback_url, logout_url, $$scope, slots];
    }

    class Auth0Context extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			domain: 0,
    			client_id: 1,
    			audience: 2,
    			callback_url: 3,
    			logout_url: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Auth0Context",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*domain*/ ctx[0] === undefined && !('domain' in props)) {
    			console.warn("<Auth0Context> was created without expected prop 'domain'");
    		}

    		if (/*client_id*/ ctx[1] === undefined && !('client_id' in props)) {
    			console.warn("<Auth0Context> was created without expected prop 'client_id'");
    		}

    		if (/*audience*/ ctx[2] === undefined && !('audience' in props)) {
    			console.warn("<Auth0Context> was created without expected prop 'audience'");
    		}

    		if (/*callback_url*/ ctx[3] === undefined && !('callback_url' in props)) {
    			console.warn("<Auth0Context> was created without expected prop 'callback_url'");
    		}

    		if (/*logout_url*/ ctx[4] === undefined && !('logout_url' in props)) {
    			console.warn("<Auth0Context> was created without expected prop 'logout_url'");
    		}
    	}

    	get domain() {
    		throw new Error_1("<Auth0Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set domain(value) {
    		throw new Error_1("<Auth0Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get client_id() {
    		throw new Error_1("<Auth0Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set client_id(value) {
    		throw new Error_1("<Auth0Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get audience() {
    		throw new Error_1("<Auth0Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set audience(value) {
    		throw new Error_1("<Auth0Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get callback_url() {
    		throw new Error_1("<Auth0Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set callback_url(value) {
    		throw new Error_1("<Auth0Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get logout_url() {
    		throw new Error_1("<Auth0Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logout_url(value) {
    		throw new Error_1("<Auth0Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@dopry/svelte-auth0/src/components/Auth0LoginButton.svelte generated by Svelte v3.46.4 */

    const file = "node_modules/@dopry/svelte-auth0/src/components/Auth0LoginButton.svelte";

    function create_fragment$1(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", /*clazz*/ ctx[2]);
    			attr_dev(button, "id", "loginButton");
    			add_location(button, file, 16, 0, 408);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler*/ ctx[6]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*clazz*/ 4) {
    				attr_dev(button, "class", /*clazz*/ ctx[2]);
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
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Auth0LoginButton', slots, ['default']);
    	const auth0Promise = getContext(AUTH0_CONTEXT_CLIENT_PROMISE);
    	let { callback_url = getContext(AUTH0_CONTEXT_CALLBACK_URL) } = $$props;
    	let { preserveRoute } = $$props;
    	let { class: clazz } = $$props;
    	const writable_props = ['callback_url', 'preserveRoute', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Auth0LoginButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => login(auth0Promise, preserveRoute, callback_url);

    	$$self.$$set = $$props => {
    		if ('callback_url' in $$props) $$invalidate(0, callback_url = $$props.callback_url);
    		if ('preserveRoute' in $$props) $$invalidate(1, preserveRoute = $$props.preserveRoute);
    		if ('class' in $$props) $$invalidate(2, clazz = $$props.class);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		AUTH0_CONTEXT_CALLBACK_URL,
    		AUTH0_CONTEXT_CLIENT_PROMISE,
    		login,
    		auth0Promise,
    		callback_url,
    		preserveRoute,
    		clazz
    	});

    	$$self.$inject_state = $$props => {
    		if ('callback_url' in $$props) $$invalidate(0, callback_url = $$props.callback_url);
    		if ('preserveRoute' in $$props) $$invalidate(1, preserveRoute = $$props.preserveRoute);
    		if ('clazz' in $$props) $$invalidate(2, clazz = $$props.clazz);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		callback_url,
    		preserveRoute,
    		clazz,
    		auth0Promise,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Auth0LoginButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			callback_url: 0,
    			preserveRoute: 1,
    			class: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Auth0LoginButton",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*preserveRoute*/ ctx[1] === undefined && !('preserveRoute' in props)) {
    			console.warn("<Auth0LoginButton> was created without expected prop 'preserveRoute'");
    		}

    		if (/*clazz*/ ctx[2] === undefined && !('class' in props)) {
    			console.warn("<Auth0LoginButton> was created without expected prop 'class'");
    		}
    	}

    	get callback_url() {
    		throw new Error("<Auth0LoginButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set callback_url(value) {
    		throw new Error("<Auth0LoginButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preserveRoute() {
    		throw new Error("<Auth0LoginButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preserveRoute(value) {
    		throw new Error("<Auth0LoginButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Auth0LoginButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Auth0LoginButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var e=function(t,n){return (e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);})(t,n)};function t(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function r(){this.constructor=t;}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}var n=function(){return (n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function r(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);}return n}function o(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e));}catch(e){i(e);}}function c(e){try{s(r.throw(e));}catch(e){i(e);}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t);}))).then(a,c);}s((r=r.apply(e,t||[])).next());}))}function i$1(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a);}catch(e){i=[6,e],r=0;}finally{n=o=0;}if(5&i[0])throw i[1];return {value:i[0]?i[1]:void 0,done:!0}}([i,c])}}}function a(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,i=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=i.next()).done;)a.push(r.value);}catch(e){o={error:e};}finally{try{r&&!r.done&&(n=i.return)&&n.call(i);}finally{if(o)throw o.error}}return a}function c(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))}var s="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function u(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function l(e,t){return e(t={exports:{}},t.exports),t.exports}var f,d,h=function(e){return e&&e.Math==Math&&e},p=h("object"==typeof globalThis&&globalThis)||h("object"==typeof window&&window)||h("object"==typeof self&&self)||h("object"==typeof s&&s)||function(){return this}()||Function("return this")(),y=function(e){try{return !!e()}catch(e){return !0}},v=!y((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),m=Function.prototype.call,g=m.bind?m.bind(m):function(){return m.apply(m,arguments)},b={}.propertyIsEnumerable,w=Object.getOwnPropertyDescriptor,S={f:w&&!b.call({1:2},1)?function(e){var t=w(this,e);return !!t&&t.enumerable}:b},_=function(e,t){return {enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},k=Function.prototype,I=k.bind,T=k.call,O=I&&I.bind(T),E=I?function(e){return e&&O(T,e)}:function(e){return e&&function(){return T.apply(e,arguments)}},x=E({}.toString),C=E("".slice),R=function(e){return C(x(e),8,-1)},F=p.Object,A=E("".split),j=y((function(){return !F("z").propertyIsEnumerable(0)}))?function(e){return "String"==R(e)?A(e,""):F(e)}:F,U=p.TypeError,K=function(e){if(null==e)throw U("Can't call method on "+e);return e},P=function(e){return j(K(e))},L=function(e){return "function"==typeof e},W=function(e){return "object"==typeof e?null!==e:L(e)},Z=function(e){return L(e)?e:void 0},V=function(e,t){return arguments.length<2?Z(p[e]):p[e]&&p[e][t]},N=E({}.isPrototypeOf),X=V("navigator","userAgent")||"",D=p.process,z=p.Deno,Y=D&&D.versions||z&&z.version,J=Y&&Y.v8;J&&(d=(f=J.split("."))[0]>0&&f[0]<4?1:+(f[0]+f[1])),!d&&X&&(!(f=X.match(/Edge\/(\d+)/))||f[1]>=74)&&(f=X.match(/Chrome\/(\d+)/))&&(d=+f[1]);var B=d,G=!!Object.getOwnPropertySymbols&&!y((function(){var e=Symbol();return !String(e)||!(Object(e)instanceof Symbol)||!Symbol.sham&&B&&B<41})),M=G&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,H=p.Object,q=M?function(e){return "symbol"==typeof e}:function(e){var t=V("Symbol");return L(t)&&N(t.prototype,H(e))},Q=p.String,$=function(e){try{return Q(e)}catch(e){return "Object"}},ee=p.TypeError,te=function(e){if(L(e))return e;throw ee($(e)+" is not a function")},ne=function(e,t){var n=e[t];return null==n?void 0:te(n)},re=p.TypeError,oe=Object.defineProperty,ie=function(e,t){try{oe(p,e,{value:t,configurable:!0,writable:!0});}catch(n){p[e]=t;}return t},ae=p["__core-js_shared__"]||ie("__core-js_shared__",{}),ce=l((function(e){(e.exports=function(e,t){return ae[e]||(ae[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.20.0",mode:"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"});})),se=p.Object,ue=function(e){return se(K(e))},le=E({}.hasOwnProperty),fe=Object.hasOwn||function(e,t){return le(ue(e),t)},de=0,he=Math.random(),pe=E(1..toString),ye=function(e){return "Symbol("+(void 0===e?"":e)+")_"+pe(++de+he,36)},ve=ce("wks"),me=p.Symbol,ge=me&&me.for,be=M?me:me&&me.withoutSetter||ye,we=function(e){if(!fe(ve,e)||!G&&"string"!=typeof ve[e]){var t="Symbol."+e;G&&fe(me,e)?ve[e]=me[e]:ve[e]=M&&ge?ge(t):be(t);}return ve[e]},Se=p.TypeError,_e=we("toPrimitive"),ke=function(e,t){if(!W(e)||q(e))return e;var n,r=ne(e,_e);if(r){if(void 0===t&&(t="default"),n=g(r,e,t),!W(n)||q(n))return n;throw Se("Can't convert object to primitive value")}return void 0===t&&(t="number"),function(e,t){var n,r;if("string"===t&&L(n=e.toString)&&!W(r=g(n,e)))return r;if(L(n=e.valueOf)&&!W(r=g(n,e)))return r;if("string"!==t&&L(n=e.toString)&&!W(r=g(n,e)))return r;throw re("Can't convert object to primitive value")}(e,t)},Ie=function(e){var t=ke(e,"string");return q(t)?t:t+""},Te=p.document,Oe=W(Te)&&W(Te.createElement),Ee=function(e){return Oe?Te.createElement(e):{}},xe=!v&&!y((function(){return 7!=Object.defineProperty(Ee("div"),"a",{get:function(){return 7}}).a})),Ce=Object.getOwnPropertyDescriptor,Re={f:v?Ce:function(e,t){if(e=P(e),t=Ie(t),xe)try{return Ce(e,t)}catch(e){}if(fe(e,t))return _(!g(S.f,e,t),e[t])}},Fe=p.String,Ae=p.TypeError,je=function(e){if(W(e))return e;throw Ae(Fe(e)+" is not an object")},Ue=p.TypeError,Ke=Object.defineProperty,Pe={f:v?Ke:function(e,t,n){if(je(e),t=Ie(t),je(n),xe)try{return Ke(e,t,n)}catch(e){}if("get"in n||"set"in n)throw Ue("Accessors not supported");return "value"in n&&(e[t]=n.value),e}},Le=v?function(e,t,n){return Pe.f(e,t,_(1,n))}:function(e,t,n){return e[t]=n,e},We=E(Function.toString);L(ae.inspectSource)||(ae.inspectSource=function(e){return We(e)});var Ze,Ve,Ne,Xe=ae.inspectSource,De=p.WeakMap,ze=L(De)&&/native code/.test(Xe(De)),Ye=ce("keys"),Je=function(e){return Ye[e]||(Ye[e]=ye(e))},Be={},Ge=p.TypeError,Me=p.WeakMap;if(ze||ae.state){var He=ae.state||(ae.state=new Me),qe=E(He.get),Qe=E(He.has),$e=E(He.set);Ze=function(e,t){if(Qe(He,e))throw new Ge("Object already initialized");return t.facade=e,$e(He,e,t),t},Ve=function(e){return qe(He,e)||{}},Ne=function(e){return Qe(He,e)};}else {var et=Je("state");Be[et]=!0,Ze=function(e,t){if(fe(e,et))throw new Ge("Object already initialized");return t.facade=e,Le(e,et,t),t},Ve=function(e){return fe(e,et)?e[et]:{}},Ne=function(e){return fe(e,et)};}var tt={set:Ze,get:Ve,has:Ne,enforce:function(e){return Ne(e)?Ve(e):Ze(e,{})},getterFor:function(e){return function(t){var n;if(!W(t)||(n=Ve(t)).type!==e)throw Ge("Incompatible receiver, "+e+" required");return n}}},nt=Function.prototype,rt=v&&Object.getOwnPropertyDescriptor,ot=fe(nt,"name"),it={EXISTS:ot,PROPER:ot&&"something"===function(){}.name,CONFIGURABLE:ot&&(!v||v&&rt(nt,"name").configurable)},at=l((function(e){var t=it.CONFIGURABLE,n=tt.get,r=tt.enforce,o=String(String).split("String");(e.exports=function(e,n,i,a){var c,s=!!a&&!!a.unsafe,u=!!a&&!!a.enumerable,l=!!a&&!!a.noTargetGet,f=a&&void 0!==a.name?a.name:n;L(i)&&("Symbol("===String(f).slice(0,7)&&(f="["+String(f).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),(!fe(i,"name")||t&&i.name!==f)&&Le(i,"name",f),(c=r(i)).source||(c.source=o.join("string"==typeof f?f:""))),e!==p?(s?!l&&e[n]&&(u=!0):delete e[n],u?e[n]=i:Le(e,n,i)):u?e[n]=i:ie(n,i);})(Function.prototype,"toString",(function(){return L(this)&&n(this).source||Xe(this)}));})),ct=Math.ceil,st=Math.floor,ut=function(e){var t=+e;return t!=t||0===t?0:(t>0?st:ct)(t)},lt=Math.max,ft=Math.min,dt=function(e,t){var n=ut(e);return n<0?lt(n+t,0):ft(n,t)},ht=Math.min,pt=function(e){return e>0?ht(ut(e),9007199254740991):0},yt=function(e){return pt(e.length)},vt=function(e){return function(t,n,r){var o,i=P(t),a=yt(i),c=dt(r,a);if(e&&n!=n){for(;a>c;)if((o=i[c++])!=o)return !0}else for(;a>c;c++)if((e||c in i)&&i[c]===n)return e||c||0;return !e&&-1}},mt={includes:vt(!0),indexOf:vt(!1)},gt=mt.indexOf,bt=E([].push),wt=function(e,t){var n,r=P(e),o=0,i=[];for(n in r)!fe(Be,n)&&fe(r,n)&&bt(i,n);for(;t.length>o;)fe(r,n=t[o++])&&(~gt(i,n)||bt(i,n));return i},St=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],_t=St.concat("length","prototype"),kt={f:Object.getOwnPropertyNames||function(e){return wt(e,_t)}},It={f:Object.getOwnPropertySymbols},Tt=E([].concat),Ot=V("Reflect","ownKeys")||function(e){var t=kt.f(je(e)),n=It.f;return n?Tt(t,n(e)):t},Et=function(e,t,n){for(var r=Ot(t),o=Pe.f,i=Re.f,a=0;a<r.length;a++){var c=r[a];fe(e,c)||n&&fe(n,c)||o(e,c,i(t,c));}},xt=/#|\.prototype\./,Ct=function(e,t){var n=Ft[Rt(e)];return n==jt||n!=At&&(L(t)?y(t):!!t)},Rt=Ct.normalize=function(e){return String(e).replace(xt,".").toLowerCase()},Ft=Ct.data={},At=Ct.NATIVE="N",jt=Ct.POLYFILL="P",Ut=Ct,Kt=Re.f,Pt=function(e,t){var n,r,o,i,a,c=e.target,s=e.global,u=e.stat;if(n=s?p:u?p[c]||ie(c,{}):(p[c]||{}).prototype)for(r in t){if(i=t[r],o=e.noTargetGet?(a=Kt(n,r))&&a.value:n[r],!Ut(s?r:c+(u?".":"#")+r,e.forced)&&void 0!==o){if(typeof i==typeof o)continue;Et(i,o);}(e.sham||o&&o.sham)&&Le(i,"sham",!0),at(n,r,i,e);}},Lt={};Lt[we("toStringTag")]="z";var Wt,Zt="[object z]"===String(Lt),Vt=we("toStringTag"),Nt=p.Object,Xt="Arguments"==R(function(){return arguments}()),Dt=Zt?R:function(e){var t,n,r;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=function(e,t){try{return e[t]}catch(e){}}(t=Nt(e),Vt))?n:Xt?R(t):"Object"==(r=R(t))&&L(t.callee)?"Arguments":r},zt=p.String,Yt=function(e){if("Symbol"===Dt(e))throw TypeError("Cannot convert a Symbol value to a string");return zt(e)},Jt=we("match"),Bt=p.TypeError,Gt=function(e){if(function(e){var t;return W(e)&&(void 0!==(t=e[Jt])?!!t:"RegExp"==R(e))}(e))throw Bt("The method doesn't accept regular expressions");return e},Mt=we("match"),Ht=function(e){var t=/./;try{"/./"[e](t);}catch(n){try{return t[Mt]=!1,"/./"[e](t)}catch(e){}}return !1},qt=Re.f,Qt=E("".startsWith),$t=E("".slice),en=Math.min,tn=Ht("startsWith"),nn=!(tn||(Wt=qt(String.prototype,"startsWith"),!Wt||Wt.writable));Pt({target:"String",proto:!0,forced:!nn&&!tn},{startsWith:function(e){var t=Yt(K(this));Gt(e);var n=pt(en(arguments.length>1?arguments[1]:void 0,t.length)),r=Yt(e);return Qt?Qt(t,r,n):$t(t,n,n+r.length)===r}});var rn=function(e,t){return E(p[e].prototype[t])};rn("String","startsWith");var on=Array.isArray||function(e){return "Array"==R(e)},an=function(e,t,n){var r=Ie(t);r in e?Pe.f(e,r,_(0,n)):e[r]=n;},cn=function(){},sn=[],un=V("Reflect","construct"),ln=/^\s*(?:class|function)\b/,fn=E(ln.exec),dn=!ln.exec(cn),hn=function(e){if(!L(e))return !1;try{return un(cn,sn,e),!0}catch(e){return !1}},pn=function(e){if(!L(e))return !1;switch(Dt(e)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return !1}try{return dn||!!fn(ln,Xe(e))}catch(e){return !0}};pn.sham=!0;var yn,vn=!un||y((function(){var e;return hn(hn.call)||!hn(Object)||!hn((function(){e=!0;}))||e}))?pn:hn,mn=we("species"),gn=p.Array,bn=function(e,t){return new(function(e){var t;return on(e)&&(t=e.constructor,(vn(t)&&(t===gn||on(t.prototype))||W(t)&&null===(t=t[mn]))&&(t=void 0)),void 0===t?gn:t}(e))(0===t?0:t)},wn=we("species"),Sn=we("isConcatSpreadable"),_n=p.TypeError,kn=B>=51||!y((function(){var e=[];return e[Sn]=!1,e.concat()[0]!==e})),In=(yn="concat",B>=51||!y((function(){var e=[];return (e.constructor={})[wn]=function(){return {foo:1}},1!==e[yn](Boolean).foo}))),Tn=function(e){if(!W(e))return !1;var t=e[Sn];return void 0!==t?!!t:on(e)};Pt({target:"Array",proto:!0,forced:!kn||!In},{concat:function(e){var t,n,r,o,i,a=ue(this),c=bn(a,0),s=0;for(t=-1,r=arguments.length;t<r;t++)if(Tn(i=-1===t?a:arguments[t])){if(s+(o=yt(i))>9007199254740991)throw _n("Maximum allowed index exceeded");for(n=0;n<o;n++,s++)n in i&&an(c,s,i[n]);}else {if(s>=9007199254740991)throw _n("Maximum allowed index exceeded");an(c,s++,i);}return c.length=s,c}});var On=Zt?{}.toString:function(){return "[object "+Dt(this)+"]"};Zt||at(Object.prototype,"toString",On,{unsafe:!0});var En,xn=Function.prototype,Cn=xn.apply,Rn=xn.bind,Fn=xn.call,An="object"==typeof Reflect&&Reflect.apply||(Rn?Fn.bind(Cn):function(){return Fn.apply(Cn,arguments)}),jn=Object.keys||function(e){return wt(e,St)},Un=v?Object.defineProperties:function(e,t){je(e);for(var n,r=P(t),o=jn(t),i=o.length,a=0;i>a;)Pe.f(e,n=o[a++],r[n]);return e},Kn=V("document","documentElement"),Pn=Je("IE_PROTO"),Ln=function(){},Wn=function(e){return "<script>"+e+"<\/script>"},Zn=function(e){e.write(Wn("")),e.close();var t=e.parentWindow.Object;return e=null,t},Vn=function(){try{En=new ActiveXObject("htmlfile");}catch(e){}var e,t;Vn="undefined"!=typeof document?document.domain&&En?Zn(En):((t=Ee("iframe")).style.display="none",Kn.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(Wn("document.F=Object")),e.close(),e.F):Zn(En);for(var n=St.length;n--;)delete Vn.prototype[St[n]];return Vn()};Be[Pn]=!0;var Nn=Object.create||function(e,t){var n;return null!==e?(Ln.prototype=je(e),n=new Ln,Ln.prototype=null,n[Pn]=e):n=Vn(),void 0===t?n:Un(n,t)},Xn=p.Array,Dn=Math.max,zn=kt.f,Yn="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],Jn=function(e){try{return zn(e)}catch(e){return function(e,t,n){for(var r=yt(e),o=dt(t,r),i=dt(void 0===n?r:n,r),a=Xn(Dn(i-o,0)),c=0;o<i;o++,c++)an(a,c,e[o]);return a.length=c,a}(Yn)}},Bn={f:function(e){return Yn&&"Window"==R(e)?Jn(e):zn(P(e))}},Gn=E([].slice),Mn={f:we},Hn=p,qn=Pe.f,Qn=function(e){var t=Hn.Symbol||(Hn.Symbol={});fe(t,e)||qn(t,e,{value:Mn.f(e)});},$n=Pe.f,er=we("toStringTag"),tr=function(e,t,n){e&&!n&&(e=e.prototype),e&&!fe(e,er)&&$n(e,er,{configurable:!0,value:t});},nr=E(E.bind),rr=function(e,t){return te(e),void 0===t?e:nr?nr(e,t):function(){return e.apply(t,arguments)}},or=E([].push),ir=function(e){var t=1==e,n=2==e,r=3==e,o=4==e,i=6==e,a=7==e,c=5==e||i;return function(s,u,l,f){for(var d,h,p=ue(s),y=j(p),v=rr(u,l),m=yt(y),g=0,b=f||bn,w=t?b(s,m):n||a?b(s,0):void 0;m>g;g++)if((c||g in y)&&(h=v(d=y[g],g,p),e))if(t)w[g]=h;else if(h)switch(e){case 3:return !0;case 5:return d;case 6:return g;case 2:or(w,d);}else switch(e){case 4:return !1;case 7:or(w,d);}return i?-1:r||o?o:w}},ar={forEach:ir(0),map:ir(1),filter:ir(2),some:ir(3),every:ir(4),find:ir(5),findIndex:ir(6),filterReject:ir(7)}.forEach,cr=Je("hidden"),sr=we("toPrimitive"),ur=tt.set,lr=tt.getterFor("Symbol"),fr=Object.prototype,dr=p.Symbol,hr=dr&&dr.prototype,pr=p.TypeError,yr=p.QObject,vr=V("JSON","stringify"),mr=Re.f,gr=Pe.f,br=Bn.f,wr=S.f,Sr=E([].push),_r=ce("symbols"),kr=ce("op-symbols"),Ir=ce("string-to-symbol-registry"),Tr=ce("symbol-to-string-registry"),Or=ce("wks"),Er=!yr||!yr.prototype||!yr.prototype.findChild,xr=v&&y((function(){return 7!=Nn(gr({},"a",{get:function(){return gr(this,"a",{value:7}).a}})).a}))?function(e,t,n){var r=mr(fr,t);r&&delete fr[t],gr(e,t,n),r&&e!==fr&&gr(fr,t,r);}:gr,Cr=function(e,t){var n=_r[e]=Nn(hr);return ur(n,{type:"Symbol",tag:e,description:t}),v||(n.description=t),n},Rr=function(e,t,n){e===fr&&Rr(kr,t,n),je(e);var r=Ie(t);return je(n),fe(_r,r)?(n.enumerable?(fe(e,cr)&&e[cr][r]&&(e[cr][r]=!1),n=Nn(n,{enumerable:_(0,!1)})):(fe(e,cr)||gr(e,cr,_(1,{})),e[cr][r]=!0),xr(e,r,n)):gr(e,r,n)},Fr=function(e,t){je(e);var n=P(t),r=jn(n).concat(Kr(n));return ar(r,(function(t){v&&!g(Ar,n,t)||Rr(e,t,n[t]);})),e},Ar=function(e){var t=Ie(e),n=g(wr,this,t);return !(this===fr&&fe(_r,t)&&!fe(kr,t))&&(!(n||!fe(this,t)||!fe(_r,t)||fe(this,cr)&&this[cr][t])||n)},jr=function(e,t){var n=P(e),r=Ie(t);if(n!==fr||!fe(_r,r)||fe(kr,r)){var o=mr(n,r);return !o||!fe(_r,r)||fe(n,cr)&&n[cr][r]||(o.enumerable=!0),o}},Ur=function(e){var t=br(P(e)),n=[];return ar(t,(function(e){fe(_r,e)||fe(Be,e)||Sr(n,e);})),n},Kr=function(e){var t=e===fr,n=br(t?kr:P(e)),r=[];return ar(n,(function(e){!fe(_r,e)||t&&!fe(fr,e)||Sr(r,_r[e]);})),r};if(G||(hr=(dr=function(){if(N(hr,this))throw pr("Symbol is not a constructor");var e=arguments.length&&void 0!==arguments[0]?Yt(arguments[0]):void 0,t=ye(e),n=function(e){this===fr&&g(n,kr,e),fe(this,cr)&&fe(this[cr],t)&&(this[cr][t]=!1),xr(this,t,_(1,e));};return v&&Er&&xr(fr,t,{configurable:!0,set:n}),Cr(t,e)}).prototype,at(hr,"toString",(function(){return lr(this).tag})),at(dr,"withoutSetter",(function(e){return Cr(ye(e),e)})),S.f=Ar,Pe.f=Rr,Re.f=jr,kt.f=Bn.f=Ur,It.f=Kr,Mn.f=function(e){return Cr(we(e),e)},v&&(gr(hr,"description",{configurable:!0,get:function(){return lr(this).description}}),at(fr,"propertyIsEnumerable",Ar,{unsafe:!0}))),Pt({global:!0,wrap:!0,forced:!G,sham:!G},{Symbol:dr}),ar(jn(Or),(function(e){Qn(e);})),Pt({target:"Symbol",stat:!0,forced:!G},{for:function(e){var t=Yt(e);if(fe(Ir,t))return Ir[t];var n=dr(t);return Ir[t]=n,Tr[n]=t,n},keyFor:function(e){if(!q(e))throw pr(e+" is not a symbol");if(fe(Tr,e))return Tr[e]},useSetter:function(){Er=!0;},useSimple:function(){Er=!1;}}),Pt({target:"Object",stat:!0,forced:!G,sham:!v},{create:function(e,t){return void 0===t?Nn(e):Fr(Nn(e),t)},defineProperty:Rr,defineProperties:Fr,getOwnPropertyDescriptor:jr}),Pt({target:"Object",stat:!0,forced:!G},{getOwnPropertyNames:Ur,getOwnPropertySymbols:Kr}),Pt({target:"Object",stat:!0,forced:y((function(){It.f(1);}))},{getOwnPropertySymbols:function(e){return It.f(ue(e))}}),vr){var Pr=!G||y((function(){var e=dr();return "[null]"!=vr([e])||"{}"!=vr({a:e})||"{}"!=vr(Object(e))}));Pt({target:"JSON",stat:!0,forced:Pr},{stringify:function(e,t,n){var r=Gn(arguments),o=t;if((W(t)||void 0!==e)&&!q(e))return on(t)||(t=function(e,t){if(L(o)&&(t=g(o,this,e,t)),!q(t))return t}),r[1]=t,An(vr,null,r)}});}if(!hr[sr]){var Lr=hr.valueOf;at(hr,sr,(function(e){return g(Lr,this)}));}tr(dr,"Symbol"),Be[cr]=!0,Qn("asyncIterator");var Wr=Pe.f,Zr=p.Symbol,Vr=Zr&&Zr.prototype;if(v&&L(Zr)&&(!("description"in Vr)||void 0!==Zr().description)){var Nr={},Xr=function(){var e=arguments.length<1||void 0===arguments[0]?void 0:Yt(arguments[0]),t=N(Vr,this)?new Zr(e):void 0===e?Zr():Zr(e);return ""===e&&(Nr[t]=!0),t};Et(Xr,Zr),Xr.prototype=Vr,Vr.constructor=Xr;var Dr="Symbol(test)"==String(Zr("test")),zr=E(Vr.toString),Yr=E(Vr.valueOf),Jr=/^Symbol\((.*)\)[^)]+$/,Br=E("".replace),Gr=E("".slice);Wr(Vr,"description",{configurable:!0,get:function(){var e=Yr(this),t=zr(e);if(fe(Nr,e))return "";var n=Dr?Gr(t,7,-1):Br(t,Jr,"$1");return ""===n?void 0:n}}),Pt({global:!0,forced:!0},{Symbol:Xr});}Qn("hasInstance"),Qn("isConcatSpreadable"),Qn("iterator"),Qn("match"),Qn("matchAll"),Qn("replace"),Qn("search"),Qn("species"),Qn("split"),Qn("toPrimitive"),Qn("toStringTag"),Qn("unscopables"),tr(p.JSON,"JSON",!0),tr(Math,"Math",!0),Pt({global:!0},{Reflect:{}}),tr(p.Reflect,"Reflect",!0),Hn.Symbol;var Mr,Hr,qr,Qr=E("".charAt),$r=E("".charCodeAt),eo=E("".slice),to=function(e){return function(t,n){var r,o,i=Yt(K(t)),a=ut(n),c=i.length;return a<0||a>=c?e?"":void 0:(r=$r(i,a))<55296||r>56319||a+1===c||(o=$r(i,a+1))<56320||o>57343?e?Qr(i,a):r:e?eo(i,a,a+2):o-56320+(r-55296<<10)+65536}},no={codeAt:to(!1),charAt:to(!0)},ro=!y((function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype})),oo=Je("IE_PROTO"),io=p.Object,ao=io.prototype,co=ro?io.getPrototypeOf:function(e){var t=ue(e);if(fe(t,oo))return t[oo];var n=t.constructor;return L(n)&&t instanceof n?n.prototype:t instanceof io?ao:null},so=we("iterator"),uo=!1;[].keys&&("next"in(qr=[].keys())?(Hr=co(co(qr)))!==Object.prototype&&(Mr=Hr):uo=!0),(null==Mr||y((function(){var e={};return Mr[so].call(e)!==e})))&&(Mr={}),L(Mr[so])||at(Mr,so,(function(){return this}));var lo={IteratorPrototype:Mr,BUGGY_SAFARI_ITERATORS:uo},fo={},ho=lo.IteratorPrototype,po=function(){return this},yo=p.String,vo=p.TypeError,mo=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,n={};try{(e=E(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set))(n,[]),t=n instanceof Array;}catch(e){}return function(n,r){return je(n),function(e){if("object"==typeof e||L(e))return e;throw vo("Can't set "+yo(e)+" as a prototype")}(r),t?e(n,r):n.__proto__=r,n}}():void 0),go=it.PROPER,bo=it.CONFIGURABLE,wo=lo.IteratorPrototype,So=lo.BUGGY_SAFARI_ITERATORS,_o=we("iterator"),ko=function(){return this},Io=function(e,t,n,r,o,i,a){!function(e,t,n,r){var o=t+" Iterator";e.prototype=Nn(ho,{next:_(+!r,n)}),tr(e,o,!1),fo[o]=po;}(n,t,r);var c,s,u,l=function(e){if(e===o&&y)return y;if(!So&&e in h)return h[e];switch(e){case"keys":case"values":case"entries":return function(){return new n(this,e)}}return function(){return new n(this)}},f=t+" Iterator",d=!1,h=e.prototype,p=h[_o]||h["@@iterator"]||o&&h[o],y=!So&&p||l(o),v="Array"==t&&h.entries||p;if(v&&(c=co(v.call(new e)))!==Object.prototype&&c.next&&(co(c)!==wo&&(mo?mo(c,wo):L(c[_o])||at(c,_o,ko)),tr(c,f,!0)),go&&"values"==o&&p&&"values"!==p.name&&(bo?Le(h,"name","values"):(d=!0,y=function(){return g(p,this)})),o)if(s={values:l("values"),keys:i?y:l("keys"),entries:l("entries")},a)for(u in s)(So||d||!(u in h))&&at(h,u,s[u]);else Pt({target:t,proto:!0,forced:So||d},s);return h[_o]!==y&&at(h,_o,y,{name:o}),fo[t]=y,s},To=no.charAt,Oo=tt.set,Eo=tt.getterFor("String Iterator");Io(String,"String",(function(e){Oo(this,{type:"String Iterator",string:Yt(e),index:0});}),(function(){var e,t=Eo(this),n=t.string,r=t.index;return r>=n.length?{value:void 0,done:!0}:(e=To(n,r),t.index+=e.length,{value:e,done:!1})}));var xo=function(e,t,n){var r,o;je(e);try{if(!(r=ne(e,"return"))){if("throw"===t)throw n;return n}r=g(r,e);}catch(e){o=!0,r=e;}if("throw"===t)throw n;if(o)throw r;return je(r),n},Co=function(e,t,n,r){try{return r?t(je(n)[0],n[1]):t(n)}catch(t){xo(e,"throw",t);}},Ro=we("iterator"),Fo=Array.prototype,Ao=function(e){return void 0!==e&&(fo.Array===e||Fo[Ro]===e)},jo=we("iterator"),Uo=function(e){if(null!=e)return ne(e,jo)||ne(e,"@@iterator")||fo[Dt(e)]},Ko=p.TypeError,Po=function(e,t){var n=arguments.length<2?Uo(e):t;if(te(n))return je(g(n,e));throw Ko($(e)+" is not iterable")},Lo=p.Array,Wo=we("iterator"),Zo=!1;try{var Vo=0,No={next:function(){return {done:!!Vo++}},return:function(){Zo=!0;}};No[Wo]=function(){return this},Array.from(No,(function(){throw 2}));}catch(e){}var Xo=function(e,t){if(!t&&!Zo)return !1;var n=!1;try{var r={};r[Wo]=function(){return {next:function(){return {done:n=!0}}}},e(r);}catch(e){}return n},Do=!Xo((function(e){Array.from(e);}));Pt({target:"Array",stat:!0,forced:Do},{from:function(e){var t=ue(e),n=vn(this),r=arguments.length,o=r>1?arguments[1]:void 0,i=void 0!==o;i&&(o=rr(o,r>2?arguments[2]:void 0));var a,c,s,u,l,f,d=Uo(t),h=0;if(!d||this==Lo&&Ao(d))for(a=yt(t),c=n?new this(a):Lo(a);a>h;h++)f=i?o(t[h],h):t[h],an(c,h,f);else for(l=(u=Po(t,d)).next,c=n?new this:[];!(s=g(l,u)).done;h++)f=i?Co(u,o,[s.value,h],!0):s.value,an(c,h,f);return c.length=h,c}}),Hn.Array.from;var zo,Yo,Jo,Bo="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof DataView,Go=Pe.f,Mo=p.Int8Array,Ho=Mo&&Mo.prototype,qo=p.Uint8ClampedArray,Qo=qo&&qo.prototype,$o=Mo&&co(Mo),ei=Ho&&co(Ho),ti=Object.prototype,ni=p.TypeError,ri=we("toStringTag"),oi=ye("TYPED_ARRAY_TAG"),ii=ye("TYPED_ARRAY_CONSTRUCTOR"),ai=Bo&&!!mo&&"Opera"!==Dt(p.opera),ci=!1,si={Int8Array:1,Uint8Array:1,Uint8ClampedArray:1,Int16Array:2,Uint16Array:2,Int32Array:4,Uint32Array:4,Float32Array:4,Float64Array:8},ui={BigInt64Array:8,BigUint64Array:8},li=function(e){if(!W(e))return !1;var t=Dt(e);return fe(si,t)||fe(ui,t)};for(zo in si)(Jo=(Yo=p[zo])&&Yo.prototype)?Le(Jo,ii,Yo):ai=!1;for(zo in ui)(Jo=(Yo=p[zo])&&Yo.prototype)&&Le(Jo,ii,Yo);if((!ai||!L($o)||$o===Function.prototype)&&($o=function(){throw ni("Incorrect invocation")},ai))for(zo in si)p[zo]&&mo(p[zo],$o);if((!ai||!ei||ei===ti)&&(ei=$o.prototype,ai))for(zo in si)p[zo]&&mo(p[zo].prototype,ei);if(ai&&co(Qo)!==ei&&mo(Qo,ei),v&&!fe(ei,ri))for(zo in ci=!0,Go(ei,ri,{get:function(){return W(this)?this[oi]:void 0}}),si)p[zo]&&Le(p[zo],oi,zo);var fi={NATIVE_ARRAY_BUFFER_VIEWS:ai,TYPED_ARRAY_CONSTRUCTOR:ii,TYPED_ARRAY_TAG:ci&&oi,aTypedArray:function(e){if(li(e))return e;throw ni("Target is not a typed array")},aTypedArrayConstructor:function(e){if(L(e)&&(!mo||N($o,e)))return e;throw ni($(e)+" is not a typed array constructor")},exportTypedArrayMethod:function(e,t,n,r){if(v){if(n)for(var o in si){var i=p[o];if(i&&fe(i.prototype,e))try{delete i.prototype[e];}catch(e){}}ei[e]&&!n||at(ei,e,n?t:ai&&Ho[e]||t,r);}},exportTypedArrayStaticMethod:function(e,t,n){var r,o;if(v){if(mo){if(n)for(r in si)if((o=p[r])&&fe(o,e))try{delete o[e];}catch(e){}if($o[e]&&!n)return;try{return at($o,e,n?t:ai&&$o[e]||t)}catch(e){}}for(r in si)!(o=p[r])||o[e]&&!n||at(o,e,t);}},isView:function(e){if(!W(e))return !1;var t=Dt(e);return "DataView"===t||fe(si,t)||fe(ui,t)},isTypedArray:li,TypedArray:$o,TypedArrayPrototype:ei},di=p.TypeError,hi=we("species"),pi=function(e,t){var n,r=je(e).constructor;return void 0===r||null==(n=je(r)[hi])?t:function(e){if(vn(e))return e;throw di($(e)+" is not a constructor")}(n)},yi=fi.TYPED_ARRAY_CONSTRUCTOR,vi=fi.aTypedArrayConstructor,mi=fi.aTypedArray;(0, fi.exportTypedArrayMethod)("slice",(function(e,t){for(var n,r=Gn(mi(this),e,t),o=vi(pi(n=this,n[yi])),i=0,a=r.length,c=new o(a);a>i;)c[i]=r[i++];return c}),y((function(){new Int8Array(1).slice();})));var gi=we("unscopables"),bi=Array.prototype;null==bi[gi]&&Pe.f(bi,gi,{configurable:!0,value:Nn(null)});var wi=function(e){bi[gi][e]=!0;},Si=mt.includes;Pt({target:"Array",proto:!0},{includes:function(e){return Si(this,e,arguments.length>1?arguments[1]:void 0)}}),wi("includes"),rn("Array","includes");var _i=E("".indexOf);Pt({target:"String",proto:!0,forced:!Ht("includes")},{includes:function(e){return !!~_i(Yt(K(this)),Yt(Gt(e)),arguments.length>1?arguments[1]:void 0)}}),rn("String","includes");var ki=Pe.f,Ii=tt.set,Ti=tt.getterFor("Array Iterator");Io(Array,"Array",(function(e,t){Ii(this,{type:"Array Iterator",target:P(e),index:0,kind:t});}),(function(){var e=Ti(this),t=e.target,n=e.kind,r=e.index++;return !t||r>=t.length?(e.target=void 0,{value:void 0,done:!0}):"keys"==n?{value:r,done:!1}:"values"==n?{value:t[r],done:!1}:{value:[r,t[r]],done:!1}}),"values");var Oi=fo.Arguments=fo.Array;if(wi("keys"),wi("values"),wi("entries"),v&&"values"!==Oi.name)try{ki(Oi,"name",{value:"values"});}catch(e){}var Ei=y((function(){if("function"==typeof ArrayBuffer){var e=new ArrayBuffer(8);Object.isExtensible(e)&&Object.defineProperty(e,"a",{value:8});}})),xi=Object.isExtensible,Ci=y((function(){xi(1);}))||Ei?function(e){return !!W(e)&&((!Ei||"ArrayBuffer"!=R(e))&&(!xi||xi(e)))}:xi,Ri=!y((function(){return Object.isExtensible(Object.preventExtensions({}))})),Fi=l((function(e){var t=Pe.f,n=!1,r=ye("meta"),o=0,i=function(e){t(e,r,{value:{objectID:"O"+o++,weakData:{}}});},a=e.exports={enable:function(){a.enable=function(){},n=!0;var e=kt.f,t=E([].splice),o={};o[r]=1,e(o).length&&(kt.f=function(n){for(var o=e(n),i=0,a=o.length;i<a;i++)if(o[i]===r){t(o,i,1);break}return o},Pt({target:"Object",stat:!0,forced:!0},{getOwnPropertyNames:Bn.f}));},fastKey:function(e,t){if(!W(e))return "symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!fe(e,r)){if(!Ci(e))return "F";if(!t)return "E";i(e);}return e[r].objectID},getWeakData:function(e,t){if(!fe(e,r)){if(!Ci(e))return !0;if(!t)return !1;i(e);}return e[r].weakData},onFreeze:function(e){return Ri&&n&&Ci(e)&&!fe(e,r)&&i(e),e}};Be[r]=!0;}));Fi.enable,Fi.fastKey,Fi.getWeakData,Fi.onFreeze;var Ai=p.TypeError,ji=function(e,t){this.stopped=e,this.result=t;},Ui=ji.prototype,Ki=function(e,t,n){var r,o,i,a,c,s,u,l=n&&n.that,f=!(!n||!n.AS_ENTRIES),d=!(!n||!n.IS_ITERATOR),h=!(!n||!n.INTERRUPTED),p=rr(t,l),y=function(e){return r&&xo(r,"normal",e),new ji(!0,e)},v=function(e){return f?(je(e),h?p(e[0],e[1],y):p(e[0],e[1])):h?p(e,y):p(e)};if(d)r=e;else {if(!(o=Uo(e)))throw Ai($(e)+" is not iterable");if(Ao(o)){for(i=0,a=yt(e);a>i;i++)if((c=v(e[i]))&&N(Ui,c))return c;return new ji(!1)}r=Po(e,o);}for(s=r.next;!(u=g(s,r)).done;){try{c=v(u.value);}catch(e){xo(r,"throw",e);}if("object"==typeof c&&c&&N(Ui,c))return c}return new ji(!1)},Pi=p.TypeError,Li=function(e,t){if(N(t,e))return e;throw Pi("Incorrect invocation")},Wi=function(e,t,n){for(var r in t)at(e,r,t[r],n);return e},Zi=we("species"),Vi=Pe.f,Ni=Fi.fastKey,Xi=tt.set,Di=tt.getterFor,zi={getConstructor:function(e,t,n,r){var o=e((function(e,o){Li(e,i),Xi(e,{type:t,index:Nn(null),first:void 0,last:void 0,size:0}),v||(e.size=0),null!=o&&Ki(o,e[r],{that:e,AS_ENTRIES:n});})),i=o.prototype,a=Di(t),c=function(e,t,n){var r,o,i=a(e),c=s(e,t);return c?c.value=n:(i.last=c={index:o=Ni(t,!0),key:t,value:n,previous:r=i.last,next:void 0,removed:!1},i.first||(i.first=c),r&&(r.next=c),v?i.size++:e.size++,"F"!==o&&(i.index[o]=c)),e},s=function(e,t){var n,r=a(e),o=Ni(t);if("F"!==o)return r.index[o];for(n=r.first;n;n=n.next)if(n.key==t)return n};return Wi(i,{clear:function(){for(var e=a(this),t=e.index,n=e.first;n;)n.removed=!0,n.previous&&(n.previous=n.previous.next=void 0),delete t[n.index],n=n.next;e.first=e.last=void 0,v?e.size=0:this.size=0;},delete:function(e){var t=this,n=a(t),r=s(t,e);if(r){var o=r.next,i=r.previous;delete n.index[r.index],r.removed=!0,i&&(i.next=o),o&&(o.previous=i),n.first==r&&(n.first=o),n.last==r&&(n.last=i),v?n.size--:t.size--;}return !!r},forEach:function(e){for(var t,n=a(this),r=rr(e,arguments.length>1?arguments[1]:void 0);t=t?t.next:n.first;)for(r(t.value,t.key,this);t&&t.removed;)t=t.previous;},has:function(e){return !!s(this,e)}}),Wi(i,n?{get:function(e){var t=s(this,e);return t&&t.value},set:function(e,t){return c(this,0===e?0:e,t)}}:{add:function(e){return c(this,e=0===e?0:e,e)}}),v&&Vi(i,"size",{get:function(){return a(this).size}}),o},setStrong:function(e,t,n){var r=t+" Iterator",o=Di(t),i=Di(r);Io(e,t,(function(e,t){Xi(this,{type:r,target:e,state:o(e),kind:t,last:void 0});}),(function(){for(var e=i(this),t=e.kind,n=e.last;n&&n.removed;)n=n.previous;return e.target&&(e.last=n=n?n.next:e.state.first)?"keys"==t?{value:n.key,done:!1}:"values"==t?{value:n.value,done:!1}:{value:[n.key,n.value],done:!1}:(e.target=void 0,{value:void 0,done:!0})}),n?"entries":"values",!n,!0),function(e){var t=V(e),n=Pe.f;v&&t&&!t[Zi]&&n(t,Zi,{configurable:!0,get:function(){return this}});}(t);}};function Yi(e){var t=this.constructor;return this.then((function(n){return t.resolve(e()).then((function(){return n}))}),(function(n){return t.resolve(e()).then((function(){return t.reject(n)}))}))}function Ji(e){return new this((function(t,n){if(!e||void 0===e.length)return n(new TypeError(typeof e+" "+e+" is not iterable(cannot read property Symbol(Symbol.iterator))"));var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);var o=r.length;function i(e,n){if(n&&("object"==typeof n||"function"==typeof n)){var a=n.then;if("function"==typeof a)return void a.call(n,(function(t){i(e,t);}),(function(n){r[e]={status:"rejected",reason:n},0==--o&&t(r);}))}r[e]={status:"fulfilled",value:n},0==--o&&t(r);}for(var a=0;a<r.length;a++)i(a,r[a]);}))}!function(e,t,n){var r=-1!==e.indexOf("Map"),o=-1!==e.indexOf("Weak"),i=r?"set":"add",a=p[e],c=a&&a.prototype,s=a,u={},l=function(e){var t=E(c[e]);at(c,e,"add"==e?function(e){return t(this,0===e?0:e),this}:"delete"==e?function(e){return !(o&&!W(e))&&t(this,0===e?0:e)}:"get"==e?function(e){return o&&!W(e)?void 0:t(this,0===e?0:e)}:"has"==e?function(e){return !(o&&!W(e))&&t(this,0===e?0:e)}:function(e,n){return t(this,0===e?0:e,n),this});};if(Ut(e,!L(a)||!(o||c.forEach&&!y((function(){(new a).entries().next();})))))s=n.getConstructor(t,e,r,i),Fi.enable();else if(Ut(e,!0)){var f=new s,d=f[i](o?{}:-0,1)!=f,h=y((function(){f.has(1);})),v=Xo((function(e){new a(e);})),m=!o&&y((function(){for(var e=new a,t=5;t--;)e[i](t,t);return !e.has(-0)}));v||((s=t((function(e,t){Li(e,c);var n=function(e,t,n){var r,o;return mo&&L(r=t.constructor)&&r!==n&&W(o=r.prototype)&&o!==n.prototype&&mo(e,o),e}(new a,e,s);return null!=t&&Ki(t,n[i],{that:n,AS_ENTRIES:r}),n}))).prototype=c,c.constructor=s),(h||m)&&(l("delete"),l("has"),r&&l("get")),(m||d)&&l(i),o&&c.clear&&delete c.clear;}u[e]=s,Pt({global:!0,forced:s!=a},u),tr(s,e),o||n.setStrong(s,e,r);}("Set",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),zi),Hn.Set;var Bi=setTimeout,Gi="undefined"!=typeof setImmediate?setImmediate:null;function Mi(e){return Boolean(e&&void 0!==e.length)}function Hi(){}function qi(e){if(!(this instanceof qi))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],ra(e,this);}function Qi(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,qi._immediateFn((function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var r;try{r=n(e._value);}catch(e){return void ea(t.promise,e)}$i(t.promise,r);}else (1===e._state?$i:ea)(t.promise,e._value);}))):e._deferreds.push(t);}function $i(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof qi)return e._state=3,e._value=t,void ta(e);if("function"==typeof n)return void ra((r=n,o=t,function(){r.apply(o,arguments);}),e)}e._state=1,e._value=t,ta(e);}catch(t){ea(e,t);}var r,o;}function ea(e,t){e._state=2,e._value=t,ta(e);}function ta(e){2===e._state&&0===e._deferreds.length&&qi._immediateFn((function(){e._handled||qi._unhandledRejectionFn(e._value);}));for(var t=0,n=e._deferreds.length;t<n;t++)Qi(e,e._deferreds[t]);e._deferreds=null;}function na(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n;}function ra(e,t){var n=!1;try{e((function(e){n||(n=!0,$i(t,e));}),(function(e){n||(n=!0,ea(t,e));}));}catch(e){if(n)return;n=!0,ea(t,e);}}qi.prototype.catch=function(e){return this.then(null,e)},qi.prototype.then=function(e,t){var n=new this.constructor(Hi);return Qi(this,new na(e,t,n)),n},qi.prototype.finally=Yi,qi.all=function(e){return new qi((function(t,n){if(!Mi(e))return n(new TypeError("Promise.all accepts an array"));var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);var o=r.length;function i(e,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var c=a.then;if("function"==typeof c)return void c.call(a,(function(t){i(e,t);}),n)}r[e]=a,0==--o&&t(r);}catch(e){n(e);}}for(var a=0;a<r.length;a++)i(a,r[a]);}))},qi.allSettled=Ji,qi.resolve=function(e){return e&&"object"==typeof e&&e.constructor===qi?e:new qi((function(t){t(e);}))},qi.reject=function(e){return new qi((function(t,n){n(e);}))},qi.race=function(e){return new qi((function(t,n){if(!Mi(e))return n(new TypeError("Promise.race accepts an array"));for(var r=0,o=e.length;r<o;r++)qi.resolve(e[r]).then(t,n);}))},qi._immediateFn="function"==typeof Gi&&function(e){Gi(e);}||function(e){Bi(e,0);},qi._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e);};var oa=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("unable to locate global object")}();"function"!=typeof oa.Promise?oa.Promise=qi:(oa.Promise.prototype.finally||(oa.Promise.prototype.finally=Yi),oa.Promise.allSettled||(oa.Promise.allSettled=Ji)),function(e){function t(){}function n(e,t){if(e=void 0===e?"utf-8":e,t=void 0===t?{fatal:!1}:t,-1===o.indexOf(e.toLowerCase()))throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('"+e+"') is invalid.");if(t.fatal)throw Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.")}function r(e){for(var t=0,n=Math.min(65536,e.length+1),r=new Uint16Array(n),o=[],i=0;;){var a=t<e.length;if(!a||i>=n-1){if(o.push(String.fromCharCode.apply(null,r.subarray(0,i))),!a)return o.join("");e=e.subarray(t),i=t=0;}if(0==(128&(a=e[t++])))r[i++]=a;else if(192==(224&a)){var c=63&e[t++];r[i++]=(31&a)<<6|c;}else if(224==(240&a)){c=63&e[t++];var s=63&e[t++];r[i++]=(31&a)<<12|c<<6|s;}else if(240==(248&a)){65535<(a=(7&a)<<18|(c=63&e[t++])<<12|(s=63&e[t++])<<6|63&e[t++])&&(a-=65536,r[i++]=a>>>10&1023|55296,a=56320|1023&a),r[i++]=a;}}}if(e.TextEncoder&&e.TextDecoder)return !1;var o=["utf-8","utf8","unicode-1-1-utf-8"];Object.defineProperty(t.prototype,"encoding",{value:"utf-8"}),t.prototype.encode=function(e,t){if((t=void 0===t?{stream:!1}:t).stream)throw Error("Failed to encode: the 'stream' option is unsupported.");t=0;for(var n=e.length,r=0,o=Math.max(32,n+(n>>>1)+7),i=new Uint8Array(o>>>3<<3);t<n;){var a=e.charCodeAt(t++);if(55296<=a&&56319>=a){if(t<n){var c=e.charCodeAt(t);56320==(64512&c)&&(++t,a=((1023&a)<<10)+(1023&c)+65536);}if(55296<=a&&56319>=a)continue}if(r+4>i.length&&(o+=8,o=(o*=1+t/e.length*2)>>>3<<3,(c=new Uint8Array(o)).set(i),i=c),0==(4294967168&a))i[r++]=a;else {if(0==(4294965248&a))i[r++]=a>>>6&31|192;else if(0==(4294901760&a))i[r++]=a>>>12&15|224,i[r++]=a>>>6&63|128;else {if(0!=(4292870144&a))continue;i[r++]=a>>>18&7|240,i[r++]=a>>>12&63|128,i[r++]=a>>>6&63|128;}i[r++]=63&a|128;}}return i.slice?i.slice(0,r):i.subarray(0,r)},Object.defineProperty(n.prototype,"encoding",{value:"utf-8"}),Object.defineProperty(n.prototype,"fatal",{value:!1}),Object.defineProperty(n.prototype,"ignoreBOM",{value:!1});var i=r;"function"==typeof Buffer&&Buffer.from?i=function(e){return Buffer.from(e.buffer,e.byteOffset,e.byteLength).toString("utf-8")}:"function"==typeof Blob&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&(i=function(e){var t=URL.createObjectURL(new Blob([e],{type:"text/plain;charset=UTF-8"}));try{var n=new XMLHttpRequest;return n.open("GET",t,!1),n.send(),n.responseText}catch(t){return r(e)}finally{URL.revokeObjectURL(t);}}),n.prototype.decode=function(e,t){if((t=void 0===t?{stream:!1}:t).stream)throw Error("Failed to decode: the 'stream' option is unsupported.");return e=e instanceof Uint8Array?e:e.buffer instanceof ArrayBuffer?new Uint8Array(e.buffer):new Uint8Array(e),i(e)},e.TextEncoder=t,e.TextDecoder=n;}("undefined"!=typeof window?window:s),function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&i(e,t);}function o(e){return (o=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function i(e,t){return (i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function a(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return !1}}function c(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function u(e,t){return !t||"object"!=typeof t&&"function"!=typeof t?c(e):t}function l(e){var t=a();return function(){var n,r=o(e);if(t){var i=o(this).constructor;n=Reflect.construct(r,arguments,i);}else n=r.apply(this,arguments);return u(this,n)}}function f(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=o(e)););return e}function d(e,t,n){return (d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,n){var r=f(e,t);if(r){var o=Object.getOwnPropertyDescriptor(r,t);return o.get?o.get.call(n):o.value}})(e,t,n||e)}var h=function(){function t(){e(this,t),Object.defineProperty(this,"listeners",{value:{},writable:!0,configurable:!0});}return n(t,[{key:"addEventListener",value:function(e,t,n){e in this.listeners||(this.listeners[e]=[]),this.listeners[e].push({callback:t,options:n});}},{key:"removeEventListener",value:function(e,t){if(e in this.listeners)for(var n=this.listeners[e],r=0,o=n.length;r<o;r++)if(n[r].callback===t)return void n.splice(r,1)}},{key:"dispatchEvent",value:function(e){if(e.type in this.listeners){for(var t=this.listeners[e.type].slice(),n=0,r=t.length;n<r;n++){var o=t[n];try{o.callback.call(this,e);}catch(e){Promise.resolve().then((function(){throw e}));}o.options&&o.options.once&&this.removeEventListener(e.type,o.callback);}return !e.defaultPrevented}}}]),t}(),p=function(t){r(a,t);var i=l(a);function a(){var t;return e(this,a),(t=i.call(this)).listeners||h.call(c(t)),Object.defineProperty(c(t),"aborted",{value:!1,writable:!0,configurable:!0}),Object.defineProperty(c(t),"onabort",{value:null,writable:!0,configurable:!0}),t}return n(a,[{key:"toString",value:function(){return "[object AbortSignal]"}},{key:"dispatchEvent",value:function(e){"abort"===e.type&&(this.aborted=!0,"function"==typeof this.onabort&&this.onabort.call(this,e)),d(o(a.prototype),"dispatchEvent",this).call(this,e);}}]),a}(h),y=function(){function t(){e(this,t),Object.defineProperty(this,"signal",{value:new p,writable:!0,configurable:!0});}return n(t,[{key:"abort",value:function(){var e;try{e=new Event("abort");}catch(t){"undefined"!=typeof document?document.createEvent?(e=document.createEvent("Event")).initEvent("abort",!1,!1):(e=document.createEventObject()).type="abort":e={type:"abort",bubbles:!1,cancelable:!1};}this.signal.dispatchEvent(e);}},{key:"toString",value:function(){return "[object AbortController]"}}]),t}();function v(e){return e.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL?(console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill"),!0):"function"==typeof e.Request&&!e.Request.prototype.hasOwnProperty("signal")||!e.AbortController}"undefined"!=typeof Symbol&&Symbol.toStringTag&&(y.prototype[Symbol.toStringTag]="AbortController",p.prototype[Symbol.toStringTag]="AbortSignal"),function(e){v(e)&&(e.AbortController=y,e.AbortSignal=p);}("undefined"!=typeof self?self:s);}();var ia=l((function(e,t){Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){var e=this;this.locked=new Map,this.addToLocked=function(t,n){var r=e.locked.get(t);void 0===r?void 0===n?e.locked.set(t,[]):e.locked.set(t,[n]):void 0!==n&&(r.unshift(n),e.locked.set(t,r));},this.isLocked=function(t){return e.locked.has(t)},this.lock=function(t){return new Promise((function(n,r){e.isLocked(t)?e.addToLocked(t,n):(e.addToLocked(t),n());}))},this.unlock=function(t){var n=e.locked.get(t);if(void 0!==n&&0!==n.length){var r=n.pop();e.locked.set(t,n),void 0!==r&&setTimeout(r,0);}else e.locked.delete(t);};}return e.getInstance=function(){return void 0===e.instance&&(e.instance=new e),e.instance},e}();t.default=function(){return n.getInstance()};}));u(ia);var aa=u(l((function(e,t){var n=s&&s.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e));}catch(e){i(e);}}function c(e){try{s(r.throw(e));}catch(e){i(e);}}function s(e){e.done?o(e.value):new n((function(t){t(e.value);})).then(a,c);}s((r=r.apply(e,t||[])).next());}))},r=s&&s.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a);}catch(e){i=[6,e],r=0;}finally{n=o=0;}if(5&i[0])throw i[1];return {value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};Object.defineProperty(t,"__esModule",{value:!0});var o="browser-tabs-lock-key";function i(e){return new Promise((function(t){return setTimeout(t,e)}))}function a(e){for(var t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",n="",r=0;r<e;r++){n+=t[Math.floor(Math.random()*t.length)];}return n}var c=function(){function e(){this.acquiredIatSet=new Set,this.id=Date.now().toString()+a(15),this.acquireLock=this.acquireLock.bind(this),this.releaseLock=this.releaseLock.bind(this),this.releaseLock__private__=this.releaseLock__private__.bind(this),this.waitForSomethingToChange=this.waitForSomethingToChange.bind(this),this.refreshLockWhileAcquired=this.refreshLockWhileAcquired.bind(this),void 0===e.waiters&&(e.waiters=[]);}return e.prototype.acquireLock=function(t,c){return void 0===c&&(c=5e3),n(this,void 0,void 0,(function(){var n,s,u,l,f,d;return r(this,(function(r){switch(r.label){case 0:n=Date.now()+a(4),s=Date.now()+c,u=o+"-"+t,l=window.localStorage,r.label=1;case 1:return Date.now()<s?[4,i(30)]:[3,8];case 2:return r.sent(),null!==l.getItem(u)?[3,5]:(f=this.id+"-"+t+"-"+n,[4,i(Math.floor(25*Math.random()))]);case 3:return r.sent(),l.setItem(u,JSON.stringify({id:this.id,iat:n,timeoutKey:f,timeAcquired:Date.now(),timeRefreshed:Date.now()})),[4,i(30)];case 4:return r.sent(),null!==(d=l.getItem(u))&&(d=JSON.parse(d)).id===this.id&&d.iat===n?(this.acquiredIatSet.add(n),this.refreshLockWhileAcquired(u,n),[2,!0]):[3,7];case 5:return e.lockCorrector(),[4,this.waitForSomethingToChange(s)];case 6:r.sent(),r.label=7;case 7:return n=Date.now()+a(4),[3,1];case 8:return [2,!1]}}))}))},e.prototype.refreshLockWhileAcquired=function(e,t){return n(this,void 0,void 0,(function(){var o=this;return r(this,(function(i){return setTimeout((function(){return n(o,void 0,void 0,(function(){var n,o;return r(this,(function(r){switch(r.label){case 0:return [4,ia.default().lock(t)];case 1:return r.sent(),this.acquiredIatSet.has(t)?(n=window.localStorage,null===(o=n.getItem(e))?(ia.default().unlock(t),[2]):((o=JSON.parse(o)).timeRefreshed=Date.now(),n.setItem(e,JSON.stringify(o)),ia.default().unlock(t),this.refreshLockWhileAcquired(e,t),[2])):(ia.default().unlock(t),[2])}}))}))}),1e3),[2]}))}))},e.prototype.waitForSomethingToChange=function(t){return n(this,void 0,void 0,(function(){return r(this,(function(n){switch(n.label){case 0:return [4,new Promise((function(n){var r=!1,o=Date.now(),i=!1;function a(){if(i||(window.removeEventListener("storage",a),e.removeFromWaiting(a),clearTimeout(c),i=!0),!r){r=!0;var t=50-(Date.now()-o);t>0?setTimeout(n,t):n();}}window.addEventListener("storage",a),e.addToWaiting(a);var c=setTimeout(a,Math.max(0,t-Date.now()));}))];case 1:return n.sent(),[2]}}))}))},e.addToWaiting=function(t){this.removeFromWaiting(t),void 0!==e.waiters&&e.waiters.push(t);},e.removeFromWaiting=function(t){void 0!==e.waiters&&(e.waiters=e.waiters.filter((function(e){return e!==t})));},e.notifyWaiters=function(){void 0!==e.waiters&&e.waiters.slice().forEach((function(e){return e()}));},e.prototype.releaseLock=function(e){return n(this,void 0,void 0,(function(){return r(this,(function(t){switch(t.label){case 0:return [4,this.releaseLock__private__(e)];case 1:return [2,t.sent()]}}))}))},e.prototype.releaseLock__private__=function(t){return n(this,void 0,void 0,(function(){var n,i,a;return r(this,(function(r){switch(r.label){case 0:return n=window.localStorage,i=o+"-"+t,null===(a=n.getItem(i))?[2]:(a=JSON.parse(a)).id!==this.id?[3,2]:[4,ia.default().lock(a.iat)];case 1:r.sent(),this.acquiredIatSet.delete(a.iat),n.removeItem(i),ia.default().unlock(a.iat),e.notifyWaiters(),r.label=2;case 2:return [2]}}))}))},e.lockCorrector=function(){for(var t=Date.now()-5e3,n=window.localStorage,r=Object.keys(n),i=!1,a=0;a<r.length;a++){var c=r[a];if(c.includes(o)){var s=n.getItem(c);null!==s&&(void 0===(s=JSON.parse(s)).timeRefreshed&&s.timeAcquired<t||void 0!==s.timeRefreshed&&s.timeRefreshed<t)&&(n.removeItem(c),i=!0);}}i&&e.notifyWaiters();},e.waiters=void 0,e}();t.default=c;}))),ca={timeoutInSeconds:60},sa=["login_required","consent_required","interaction_required","account_selection_required","access_denied"],ua={name:"auth0-spa-js",version:"1.19.4"},la=function(){return Date.now()},fa=function(e){function n(t,r){var o=e.call(this,r)||this;return o.error=t,o.error_description=r,Object.setPrototypeOf(o,n.prototype),o}return t(n,e),n.fromPayload=function(e){return new n(e.error,e.error_description)},n}(Error),da=function(e){function n(t,r,o,i){void 0===i&&(i=null);var a=e.call(this,t,r)||this;return a.state=o,a.appState=i,Object.setPrototypeOf(a,n.prototype),a}return t(n,e),n}(fa),ha=function(e){function n(){var t=e.call(this,"timeout","Timeout")||this;return Object.setPrototypeOf(t,n.prototype),t}return t(n,e),n}(fa),pa=function(e){function n(t){var r=e.call(this)||this;return r.popup=t,Object.setPrototypeOf(r,n.prototype),r}return t(n,e),n}(ha),ya=function(e){function n(t){var r=e.call(this,"cancelled","Popup closed")||this;return r.popup=t,Object.setPrototypeOf(r,n.prototype),r}return t(n,e),n}(fa),va=function(e){function n(t,r,o){var i=e.call(this,t,r)||this;return i.mfa_token=o,Object.setPrototypeOf(i,n.prototype),i}return t(n,e),n}(fa),ma=function(e){return new Promise((function(t,n){var r,o=setInterval((function(){e.popup&&e.popup.closed&&(clearInterval(o),clearTimeout(i),window.removeEventListener("message",r,!1),n(new ya(e.popup)));}),1e3),i=setTimeout((function(){clearInterval(o),n(new pa(e.popup)),window.removeEventListener("message",r,!1);}),1e3*(e.timeoutInSeconds||60));r=function(a){if(a.data&&"authorization_response"===a.data.type){if(clearTimeout(i),clearInterval(o),window.removeEventListener("message",r,!1),e.popup.close(),a.data.response.error)return n(fa.fromPayload(a.data.response));t(a.data.response);}},window.addEventListener("message",r);}))},ga=function(){return window.crypto||window.msCrypto},ba=function(){var e=ga();return e.subtle||e.webkitSubtle},wa=function(){var e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.",t="";return Array.from(ga().getRandomValues(new Uint8Array(43))).forEach((function(n){return t+=e[n%e.length]})),t},Sa=function(e){return btoa(e)},_a=function(e){return Object.keys(e).filter((function(t){return void 0!==e[t]})).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&")},ka=function(e){return o(void 0,void 0,void 0,(function(){var t;return i$1(this,(function(n){switch(n.label){case 0:return t=ba().digest({name:"SHA-256"},(new TextEncoder).encode(e)),window.msCrypto?[2,new Promise((function(e,n){t.oncomplete=function(t){e(t.target.result);},t.onerror=function(e){n(e.error);},t.onabort=function(){n("The digest operation was aborted");};}))]:[4,t];case 1:return [2,n.sent()]}}))}))},Ia=function(e){return function(e){return decodeURIComponent(atob(e).split("").map((function(e){return "%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)})).join(""))}(e.replace(/_/g,"/").replace(/-/g,"+"))},Ta=function(e){var t=new Uint8Array(e);return function(e){var t={"+":"-","/":"_","=":""};return e.replace(/[+/=]/g,(function(e){return t[e]}))}(window.btoa(String.fromCharCode.apply(String,c([],a(Array.from(t)),!1))))};var Oa=function(e,t){return o(void 0,void 0,void 0,(function(){var n,r;return i$1(this,(function(o){switch(o.label){case 0:return [4,(i=e,a=t,a=a||{},new Promise((function(e,t){var n=new XMLHttpRequest,r=[],o=[],c={},s=function(){return {ok:2==(n.status/100|0),statusText:n.statusText,status:n.status,url:n.responseURL,text:function(){return Promise.resolve(n.responseText)},json:function(){return Promise.resolve(n.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([n.response]))},clone:s,headers:{keys:function(){return r},entries:function(){return o},get:function(e){return c[e.toLowerCase()]},has:function(e){return e.toLowerCase()in c}}}};for(var u in n.open(a.method||"get",i,!0),n.onload=function(){n.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,(function(e,t,n){r.push(t=t.toLowerCase()),o.push([t,n]),c[t]=c[t]?c[t]+","+n:n;})),e(s());},n.onerror=t,n.withCredentials="include"==a.credentials,a.headers)n.setRequestHeader(u,a.headers[u]);n.send(a.body||null);})))];case 1:return n=o.sent(),r={ok:n.ok},[4,n.json()];case 2:return [2,(r.json=o.sent(),r)]}var i,a;}))}))},Ea=function(e,t,n){return o(void 0,void 0,void 0,(function(){var r,o;return i$1(this,(function(i){return r=new AbortController,t.signal=r.signal,[2,Promise.race([Oa(e,t),new Promise((function(e,t){o=setTimeout((function(){r.abort(),t(new Error("Timeout when executing 'fetch'"));}),n);}))]).finally((function(){clearTimeout(o);}))]}))}))},xa=function(e,t,n,r,a,c,s){return o(void 0,void 0,void 0,(function(){return i$1(this,(function(o){return [2,(i={auth:{audience:t,scope:n},timeout:a,fetchUrl:e,fetchOptions:r,useFormData:s},u=c,new Promise((function(e,t){var n=new MessageChannel;n.port1.onmessage=function(n){n.data.error?t(new Error(n.data.error)):e(n.data);},u.postMessage(i,[n.port2]);})))];var i,u;}))}))},Ca=function(e,t,n,r,a,c,s){return void 0===s&&(s=1e4),o(void 0,void 0,void 0,(function(){return i$1(this,(function(o){return a?[2,xa(e,t,n,r,s,a,c)]:[2,Ea(e,r,s)]}))}))};function Ra(e,t,n,a,c,s,u){return o(this,void 0,void 0,(function(){var o,l,f,d,h,p,y,v,m;return i$1(this,(function(i){switch(i.label){case 0:o=null,f=0,i.label=1;case 1:if(!(f<3))return [3,6];i.label=2;case 2:return i.trys.push([2,4,,5]),[4,Ca(e,n,a,c,s,u,t)];case 3:return l=i.sent(),o=null,[3,6];case 4:return d=i.sent(),o=d,[3,5];case 5:return f++,[3,1];case 6:if(o)throw o.message=o.message||"Failed to fetch",o;if(h=l.json,p=h.error,y=h.error_description,v=r(h,["error","error_description"]),!l.ok){if(m=y||"HTTP error. Unable to fetch "+e,"mfa_required"===p)throw new va(p,m,v.mfa_token);throw new fa(p||"request_error",m)}return [2,v]}}))}))}function Fa(e,t){var n=e.baseUrl,a=e.timeout,c=e.audience,s=e.scope,u=e.auth0Client,l=e.useFormData,f=r(e,["baseUrl","timeout","audience","scope","auth0Client","useFormData"]);return o(this,void 0,void 0,(function(){var e;return i$1(this,(function(r){switch(r.label){case 0:return e=l?_a(f):JSON.stringify(f),[4,Ra(n+"/oauth/token",a,c||"default",s,{method:"POST",body:e,headers:{"Content-Type":l?"application/x-www-form-urlencoded":"application/json","Auth0-Client":btoa(JSON.stringify(u||ua))}},t,l)];case 1:return [2,r.sent()]}}))}))}var Aa=function(e){return Array.from(new Set(e))},ja=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return Aa(e.join(" ").trim().split(/\s+/)).join(" ")},Ua=function(){function e(e,t){void 0===t&&(t="@@auth0spajs@@"),this.prefix=t,this.client_id=e.client_id,this.scope=e.scope,this.audience=e.audience;}return e.prototype.toKey=function(){return this.prefix+"::"+this.client_id+"::"+this.audience+"::"+this.scope},e.fromKey=function(t){var n=a(t.split("::"),4),r=n[0],o=n[1],i=n[2];return new e({client_id:o,scope:n[3],audience:i},r)},e.fromCacheEntry=function(t){return new e({scope:t.scope,audience:t.audience,client_id:t.client_id})},e}(),Ka=function(){function e(){}return e.prototype.set=function(e,t){localStorage.setItem(e,JSON.stringify(t));},e.prototype.get=function(e){var t=window.localStorage.getItem(e);if(t)try{return JSON.parse(t)}catch(e){return}},e.prototype.remove=function(e){localStorage.removeItem(e);},e.prototype.allKeys=function(){return Object.keys(window.localStorage).filter((function(e){return e.startsWith("@@auth0spajs@@")}))},e}(),Pa=function(){var e;this.enclosedCache=(e={},{set:function(t,n){e[t]=n;},get:function(t){var n=e[t];if(n)return n},remove:function(t){delete e[t];},allKeys:function(){return Object.keys(e)}});},La=function(){function e(e,t,n){this.cache=e,this.keyManifest=t,this.nowProvider=n,this.nowProvider=this.nowProvider||la;}return e.prototype.get=function(e,t){var n;return void 0===t&&(t=0),o(this,void 0,void 0,(function(){var r,o,a,c,s;return i$1(this,(function(i){switch(i.label){case 0:return [4,this.cache.get(e.toKey())];case 1:return (r=i.sent())?[3,4]:[4,this.getCacheKeys()];case 2:return (o=i.sent())?(a=this.matchExistingCacheKey(e,o),[4,this.cache.get(a)]):[2];case 3:r=i.sent(),i.label=4;case 4:return r?[4,this.nowProvider()]:[2];case 5:return c=i.sent(),s=Math.floor(c/1e3),r.expiresAt-t<s?r.body.refresh_token?(r.body={refresh_token:r.body.refresh_token},[4,this.cache.set(e.toKey(),r)]):[3,7]:[3,10];case 6:return i.sent(),[2,r.body];case 7:return [4,this.cache.remove(e.toKey())];case 8:return i.sent(),[4,null===(n=this.keyManifest)||void 0===n?void 0:n.remove(e.toKey())];case 9:return i.sent(),[2];case 10:return [2,r.body]}}))}))},e.prototype.set=function(e){var t;return o(this,void 0,void 0,(function(){var n,r;return i$1(this,(function(o){switch(o.label){case 0:return n=new Ua({client_id:e.client_id,scope:e.scope,audience:e.audience}),[4,this.wrapCacheEntry(e)];case 1:return r=o.sent(),[4,this.cache.set(n.toKey(),r)];case 2:return o.sent(),[4,null===(t=this.keyManifest)||void 0===t?void 0:t.add(n.toKey())];case 3:return o.sent(),[2]}}))}))},e.prototype.clear=function(e){var t;return o(this,void 0,void 0,(function(){var n,r=this;return i$1(this,(function(a){switch(a.label){case 0:return [4,this.getCacheKeys()];case 1:return (n=a.sent())?[4,n.filter((function(t){return !e||t.includes(e)})).reduce((function(e,t){return o(r,void 0,void 0,(function(){return i$1(this,(function(n){switch(n.label){case 0:return [4,e];case 1:return n.sent(),[4,this.cache.remove(t)];case 2:return n.sent(),[2]}}))}))}),Promise.resolve())]:[2];case 2:return a.sent(),[4,null===(t=this.keyManifest)||void 0===t?void 0:t.clear()];case 3:return a.sent(),[2]}}))}))},e.prototype.clearSync=function(e){var t=this,n=this.cache.allKeys();n&&n.filter((function(t){return !e||t.includes(e)})).forEach((function(e){t.cache.remove(e);}));},e.prototype.wrapCacheEntry=function(e){return o(this,void 0,void 0,(function(){var t,n,r;return i$1(this,(function(o){switch(o.label){case 0:return [4,this.nowProvider()];case 1:return t=o.sent(),n=Math.floor(t/1e3)+e.expires_in,r=Math.min(n,e.decodedToken.claims.exp),[2,{body:e,expiresAt:r}]}}))}))},e.prototype.getCacheKeys=function(){var e;return o(this,void 0,void 0,(function(){var t;return i$1(this,(function(n){switch(n.label){case 0:return this.keyManifest?[4,this.keyManifest.get()]:[3,2];case 1:return t=null===(e=n.sent())||void 0===e?void 0:e.keys,[3,4];case 2:return [4,this.cache.allKeys()];case 3:t=n.sent(),n.label=4;case 4:return [2,t]}}))}))},e.prototype.matchExistingCacheKey=function(e,t){return t.filter((function(t){var n=Ua.fromKey(t),r=new Set(n.scope&&n.scope.split(" ")),o=e.scope.split(" "),i=n.scope&&o.reduce((function(e,t){return e&&r.has(t)}),!0);return "@@auth0spajs@@"===n.prefix&&n.client_id===e.client_id&&n.audience===e.audience&&i}))[0]},e}(),Wa=function(){function e(e,t){this.storage=e,this.clientId=t,this.storageKey="a0.spajs.txs."+this.clientId,this.transaction=this.storage.get(this.storageKey);}return e.prototype.create=function(e){this.transaction=e,this.storage.save(this.storageKey,e,{daysUntilExpire:1});},e.prototype.get=function(){return this.transaction},e.prototype.remove=function(){delete this.transaction,this.storage.remove(this.storageKey);},e}(),Za=function(e){return "number"==typeof e},Va=["iss","aud","exp","nbf","iat","jti","azp","nonce","auth_time","at_hash","c_hash","acr","amr","sub_jwk","cnf","sip_from_tag","sip_date","sip_callid","sip_cseq_num","sip_via_branch","orig","dest","mky","events","toe","txn","rph","sid","vot","vtm"],Na=function(e){if(!e.id_token)throw new Error("ID token is required but missing");var t=function(e){var t=e.split("."),n=a(t,3),r=n[0],o=n[1],i=n[2];if(3!==t.length||!r||!o||!i)throw new Error("ID token could not be decoded");var c=JSON.parse(Ia(o)),s={__raw:e},u={};return Object.keys(c).forEach((function(e){s[e]=c[e],Va.includes(e)||(u[e]=c[e]);})),{encoded:{header:r,payload:o,signature:i},header:JSON.parse(Ia(r)),claims:s,user:u}}(e.id_token);if(!t.claims.iss)throw new Error("Issuer (iss) claim must be a string present in the ID token");if(t.claims.iss!==e.iss)throw new Error('Issuer (iss) claim mismatch in the ID token; expected "'+e.iss+'", found "'+t.claims.iss+'"');if(!t.user.sub)throw new Error("Subject (sub) claim must be a string present in the ID token");if("RS256"!==t.header.alg)throw new Error('Signature algorithm of "'+t.header.alg+'" is not supported. Expected the ID token to be signed with "RS256".');if(!t.claims.aud||"string"!=typeof t.claims.aud&&!Array.isArray(t.claims.aud))throw new Error("Audience (aud) claim must be a string or array of strings present in the ID token");if(Array.isArray(t.claims.aud)){if(!t.claims.aud.includes(e.aud))throw new Error('Audience (aud) claim mismatch in the ID token; expected "'+e.aud+'" but was not one of "'+t.claims.aud.join(", ")+'"');if(t.claims.aud.length>1){if(!t.claims.azp)throw new Error("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values");if(t.claims.azp!==e.aud)throw new Error('Authorized Party (azp) claim mismatch in the ID token; expected "'+e.aud+'", found "'+t.claims.azp+'"')}}else if(t.claims.aud!==e.aud)throw new Error('Audience (aud) claim mismatch in the ID token; expected "'+e.aud+'" but found "'+t.claims.aud+'"');if(e.nonce){if(!t.claims.nonce)throw new Error("Nonce (nonce) claim must be a string present in the ID token");if(t.claims.nonce!==e.nonce)throw new Error('Nonce (nonce) claim mismatch in the ID token; expected "'+e.nonce+'", found "'+t.claims.nonce+'"')}if(e.max_age&&!Za(t.claims.auth_time))throw new Error("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified");if(!Za(t.claims.exp))throw new Error("Expiration Time (exp) claim must be a number present in the ID token");if(!Za(t.claims.iat))throw new Error("Issued At (iat) claim must be a number present in the ID token");var n=e.leeway||60,r=new Date(e.now||Date.now()),o=new Date(0),i=new Date(0),c=new Date(0);if(c.setUTCSeconds(parseInt(t.claims.auth_time)+e.max_age+n),o.setUTCSeconds(t.claims.exp+n),i.setUTCSeconds(t.claims.nbf-n),r>o)throw new Error("Expiration Time (exp) claim error in the ID token; current time ("+r+") is after expiration time ("+o+")");if(Za(t.claims.nbf)&&r<i)throw new Error("Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Currrent time ("+r+") is before "+i);if(Za(t.claims.auth_time)&&r>c)throw new Error("Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Currrent time ("+r+") is after last auth at "+c);if(e.organizationId){if(!t.claims.org_id)throw new Error("Organization ID (org_id) claim must be a string present in the ID token");if(e.organizationId!==t.claims.org_id)throw new Error('Organization ID (org_id) claim mismatch in the ID token; expected "'+e.organizationId+'", found "'+t.claims.org_id+'"')}return t},Xa=l((function(e,t){var n=s&&s.__assign||function(){return (n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function r(e,t){if(!t)return "";var n="; "+e;return !0===t?n:n+"="+t}function o(e,t,n){return encodeURIComponent(e).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/\(/g,"%28").replace(/\)/g,"%29")+"="+encodeURIComponent(t).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent)+function(e){if("number"==typeof e.expires){var t=new Date;t.setMilliseconds(t.getMilliseconds()+864e5*e.expires),e.expires=t;}return r("Expires",e.expires?e.expires.toUTCString():"")+r("Domain",e.domain)+r("Path",e.path)+r("Secure",e.secure)+r("SameSite",e.sameSite)}(n)}function i(e){for(var t={},n=e?e.split("; "):[],r=/(%[\dA-F]{2})+/gi,o=0;o<n.length;o++){var i=n[o].split("="),a=i.slice(1).join("=");'"'===a.charAt(0)&&(a=a.slice(1,-1));try{t[i[0].replace(r,decodeURIComponent)]=a.replace(r,decodeURIComponent);}catch(e){}}return t}function a(){return i(document.cookie)}function c(e,t,r){document.cookie=o(e,t,n({path:"/"},r));}t.__esModule=!0,t.encode=o,t.parse=i,t.getAll=a,t.get=function(e){return a()[e]},t.set=c,t.remove=function(e,t){c(e,"",n(n({},t),{expires:-1}));};}));u(Xa),Xa.encode,Xa.parse,Xa.getAll;var Da=Xa.get,za=Xa.set,Ya=Xa.remove,Ja={get:function(e){var t=Da(e);if(void 0!==t)return JSON.parse(t)},save:function(e,t,n){var r={};"https:"===window.location.protocol&&(r={secure:!0,sameSite:"none"}),(null==n?void 0:n.daysUntilExpire)&&(r.expires=n.daysUntilExpire),za(e,JSON.stringify(t),r);},remove:function(e){Ya(e);}},Ba={get:function(e){var t=Ja.get(e);return t||Ja.get("_legacy_"+e)},save:function(e,t,n){var r={};"https:"===window.location.protocol&&(r={secure:!0}),(null==n?void 0:n.daysUntilExpire)&&(r.expires=n.daysUntilExpire),za("_legacy_"+e,JSON.stringify(t),r),Ja.save(e,t,n);},remove:function(e){Ja.remove(e),Ja.remove("_legacy_"+e);}},Ga={get:function(e){if("undefined"!=typeof sessionStorage){var t=sessionStorage.getItem(e);if(void 0!==t)return JSON.parse(t)}},save:function(e,t){sessionStorage.setItem(e,JSON.stringify(t));},remove:function(e){sessionStorage.removeItem(e);}};function Ma(e,t,n){var r=void 0===t?null:t,o=function(e,t){var n=atob(e);if(t){for(var r=new Uint8Array(n.length),o=0,i=n.length;o<i;++o)r[o]=n.charCodeAt(o);return String.fromCharCode.apply(null,new Uint16Array(r.buffer))}return n}(e,void 0!==n&&n),i=o.indexOf("\n",10)+1,a=o.substring(i)+(r?"//# sourceMappingURL="+r:""),c=new Blob([a],{type:"application/javascript"});return URL.createObjectURL(c)}var Ha,qa,Qa,$a,ec=(Ha="Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwohZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7Ci8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKgogICAgQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uCgogICAgUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55CiAgICBwdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuCgogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICJBUyBJUyIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEgKICAgIFJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWQogICAgQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULAogICAgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NCiAgICBMT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUgogICAgT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUgogICAgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS4KICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovdmFyIGU9ZnVuY3Rpb24oKXtyZXR1cm4oZT1PYmplY3QuYXNzaWdufHxmdW5jdGlvbihlKXtmb3IodmFyIHIsdD0xLG49YXJndW1lbnRzLmxlbmd0aDt0PG47dCsrKWZvcih2YXIgbyBpbiByPWFyZ3VtZW50c1t0XSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocixvKSYmKGVbb109cltvXSk7cmV0dXJuIGV9KS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2Z1bmN0aW9uIHIoZSxyLHQsbil7cmV0dXJuIG5ldyh0fHwodD1Qcm9taXNlKSkoKGZ1bmN0aW9uKG8sYSl7ZnVuY3Rpb24gcyhlKXt0cnl7dShuLm5leHQoZSkpfWNhdGNoKGUpe2EoZSl9fWZ1bmN0aW9uIGkoZSl7dHJ5e3Uobi50aHJvdyhlKSl9Y2F0Y2goZSl7YShlKX19ZnVuY3Rpb24gdShlKXt2YXIgcjtlLmRvbmU/byhlLnZhbHVlKToocj1lLnZhbHVlLHIgaW5zdGFuY2VvZiB0P3I6bmV3IHQoKGZ1bmN0aW9uKGUpe2Uocil9KSkpLnRoZW4ocyxpKX11KChuPW4uYXBwbHkoZSxyfHxbXSkpLm5leHQoKSl9KSl9ZnVuY3Rpb24gdChlLHIpe3ZhciB0LG4sbyxhLHM9e2xhYmVsOjAsc2VudDpmdW5jdGlvbigpe2lmKDEmb1swXSl0aHJvdyBvWzFdO3JldHVybiBvWzFdfSx0cnlzOltdLG9wczpbXX07cmV0dXJuIGE9e25leHQ6aSgwKSx0aHJvdzppKDEpLHJldHVybjppKDIpfSwiZnVuY3Rpb24iPT10eXBlb2YgU3ltYm9sJiYoYVtTeW1ib2wuaXRlcmF0b3JdPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KSxhO2Z1bmN0aW9uIGkoYSl7cmV0dXJuIGZ1bmN0aW9uKGkpe3JldHVybiBmdW5jdGlvbihhKXtpZih0KXRocm93IG5ldyBUeXBlRXJyb3IoIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy4iKTtmb3IoO3M7KXRyeXtpZih0PTEsbiYmKG89MiZhWzBdP24ucmV0dXJuOmFbMF0/bi50aHJvd3x8KChvPW4ucmV0dXJuKSYmby5jYWxsKG4pLDApOm4ubmV4dCkmJiEobz1vLmNhbGwobixhWzFdKSkuZG9uZSlyZXR1cm4gbztzd2l0Y2gobj0wLG8mJihhPVsyJmFbMF0sby52YWx1ZV0pLGFbMF0pe2Nhc2UgMDpjYXNlIDE6bz1hO2JyZWFrO2Nhc2UgNDpyZXR1cm4gcy5sYWJlbCsrLHt2YWx1ZTphWzFdLGRvbmU6ITF9O2Nhc2UgNTpzLmxhYmVsKyssbj1hWzFdLGE9WzBdO2NvbnRpbnVlO2Nhc2UgNzphPXMub3BzLnBvcCgpLHMudHJ5cy5wb3AoKTtjb250aW51ZTtkZWZhdWx0OmlmKCEobz1zLnRyeXMsKG89by5sZW5ndGg+MCYmb1tvLmxlbmd0aC0xXSl8fDYhPT1hWzBdJiYyIT09YVswXSkpe3M9MDtjb250aW51ZX1pZigzPT09YVswXSYmKCFvfHxhWzFdPm9bMF0mJmFbMV08b1szXSkpe3MubGFiZWw9YVsxXTticmVha31pZig2PT09YVswXSYmcy5sYWJlbDxvWzFdKXtzLmxhYmVsPW9bMV0sbz1hO2JyZWFrfWlmKG8mJnMubGFiZWw8b1syXSl7cy5sYWJlbD1vWzJdLHMub3BzLnB1c2goYSk7YnJlYWt9b1syXSYmcy5vcHMucG9wKCkscy50cnlzLnBvcCgpO2NvbnRpbnVlfWE9ci5jYWxsKGUscyl9Y2F0Y2goZSl7YT1bNixlXSxuPTB9ZmluYWxseXt0PW89MH1pZig1JmFbMF0pdGhyb3cgYVsxXTtyZXR1cm57dmFsdWU6YVswXT9hWzFdOnZvaWQgMCxkb25lOiEwfX0oW2EsaV0pfX19dmFyIG49e30sbz1mdW5jdGlvbihlLHIpe3JldHVybiBlKyJ8IityfTthZGRFdmVudExpc3RlbmVyKCJtZXNzYWdlIiwoZnVuY3Rpb24oYSl7dmFyIHM9YS5kYXRhLGk9cy50aW1lb3V0LHU9cy5hdXRoLGM9cy5mZXRjaFVybCxmPXMuZmV0Y2hPcHRpb25zLGw9cy51c2VGb3JtRGF0YSxoPWZ1bmN0aW9uKGUscil7dmFyIHQ9ImZ1bmN0aW9uIj09dHlwZW9mIFN5bWJvbCYmZVtTeW1ib2wuaXRlcmF0b3JdO2lmKCF0KXJldHVybiBlO3ZhciBuLG8sYT10LmNhbGwoZSkscz1bXTt0cnl7Zm9yKDsodm9pZCAwPT09cnx8ci0tID4wKSYmIShuPWEubmV4dCgpKS5kb25lOylzLnB1c2gobi52YWx1ZSl9Y2F0Y2goZSl7bz17ZXJyb3I6ZX19ZmluYWxseXt0cnl7biYmIW4uZG9uZSYmKHQ9YS5yZXR1cm4pJiZ0LmNhbGwoYSl9ZmluYWxseXtpZihvKXRocm93IG8uZXJyb3J9fXJldHVybiBzfShhLnBvcnRzLDEpWzBdO3JldHVybiByKHZvaWQgMCx2b2lkIDAsdm9pZCAwLChmdW5jdGlvbigpe3ZhciByLGEscyxwLHksYixkLHYsdyxnO3JldHVybiB0KHRoaXMsKGZ1bmN0aW9uKHQpe3N3aXRjaCh0LmxhYmVsKXtjYXNlIDA6cz0oYT11fHx7fSkuYXVkaWVuY2UscD1hLnNjb3BlLHQubGFiZWw9MTtjYXNlIDE6aWYodC50cnlzLnB1c2goWzEsNywsOF0pLCEoeT1sPyhrPWYuYm9keSxTPW5ldyBVUkxTZWFyY2hQYXJhbXMoayksXz17fSxTLmZvckVhY2goKGZ1bmN0aW9uKGUscil7X1tyXT1lfSkpLF8pOkpTT04ucGFyc2UoZi5ib2R5KSkucmVmcmVzaF90b2tlbiYmInJlZnJlc2hfdG9rZW4iPT09eS5ncmFudF90eXBlKXtpZighKGI9ZnVuY3Rpb24oZSxyKXtyZXR1cm4gbltvKGUscildfShzLHApKSl0aHJvdyBuZXcgRXJyb3IoIlRoZSB3ZWIgd29ya2VyIGlzIG1pc3NpbmcgdGhlIHJlZnJlc2ggdG9rZW4iKTtmLmJvZHk9bD9uZXcgVVJMU2VhcmNoUGFyYW1zKGUoZSh7fSx5KSx7cmVmcmVzaF90b2tlbjpifSkpLnRvU3RyaW5nKCk6SlNPTi5zdHJpbmdpZnkoZShlKHt9LHkpLHtyZWZyZXNoX3Rva2VuOmJ9KSl9ZD12b2lkIDAsImZ1bmN0aW9uIj09dHlwZW9mIEFib3J0Q29udHJvbGxlciYmKGQ9bmV3IEFib3J0Q29udHJvbGxlcixmLnNpZ25hbD1kLnNpZ25hbCksdj12b2lkIDAsdC5sYWJlbD0yO2Nhc2UgMjpyZXR1cm4gdC50cnlzLnB1c2goWzIsNCwsNV0pLFs0LFByb21pc2UucmFjZShbKG09aSxuZXcgUHJvbWlzZSgoZnVuY3Rpb24oZSl7cmV0dXJuIHNldFRpbWVvdXQoZSxtKX0pKSksZmV0Y2goYyxlKHt9LGYpKV0pXTtjYXNlIDM6cmV0dXJuIHY9dC5zZW50KCksWzMsNV07Y2FzZSA0OnJldHVybiB3PXQuc2VudCgpLGgucG9zdE1lc3NhZ2Uoe2Vycm9yOncubWVzc2FnZX0pLFsyXTtjYXNlIDU6cmV0dXJuIHY/WzQsdi5qc29uKCldOihkJiZkLmFib3J0KCksaC5wb3N0TWVzc2FnZSh7ZXJyb3I6IlRpbWVvdXQgd2hlbiBleGVjdXRpbmcgJ2ZldGNoJyJ9KSxbMl0pO2Nhc2UgNjpyZXR1cm4ocj10LnNlbnQoKSkucmVmcmVzaF90b2tlbj8oZnVuY3Rpb24oZSxyLHQpe25bbyhyLHQpXT1lfShyLnJlZnJlc2hfdG9rZW4scyxwKSxkZWxldGUgci5yZWZyZXNoX3Rva2VuKTpmdW5jdGlvbihlLHIpe2RlbGV0ZSBuW28oZSxyKV19KHMscCksaC5wb3N0TWVzc2FnZSh7b2s6di5vayxqc29uOnJ9KSxbMyw4XTtjYXNlIDc6cmV0dXJuIGc9dC5zZW50KCksaC5wb3N0TWVzc2FnZSh7b2s6ITEsanNvbjp7ZXJyb3JfZGVzY3JpcHRpb246Zy5tZXNzYWdlfX0pLFszLDhdO2Nhc2UgODpyZXR1cm5bMl19dmFyIG0sayxTLF99KSl9KSl9KSl9KCk7Cgo=",qa=null,Qa=!1,function(e){return $a=$a||Ma(Ha,qa,Qa),new Worker($a,e)}),tc={},nc=function(){function e(e,t){this.cache=e,this.clientId=t,this.manifestKey=this.createManifestKeyFrom(this.clientId);}return e.prototype.add=function(e){var t;return o(this,void 0,void 0,(function(){var n,r;return i$1(this,(function(o){switch(o.label){case 0:return r=Set.bind,[4,this.cache.get(this.manifestKey)];case 1:return (n=new(r.apply(Set,[void 0,(null===(t=o.sent())||void 0===t?void 0:t.keys)||[]]))).add(e),[4,this.cache.set(this.manifestKey,{keys:c([],a(n),!1)})];case 2:return o.sent(),[2]}}))}))},e.prototype.remove=function(e){return o(this,void 0,void 0,(function(){var t,n;return i$1(this,(function(r){switch(r.label){case 0:return [4,this.cache.get(this.manifestKey)];case 1:return (t=r.sent())?((n=new Set(t.keys)).delete(e),n.size>0?[4,this.cache.set(this.manifestKey,{keys:c([],a(n),!1)})]:[3,3]):[3,5];case 2:return [2,r.sent()];case 3:return [4,this.cache.remove(this.manifestKey)];case 4:return [2,r.sent()];case 5:return [2]}}))}))},e.prototype.get=function(){return this.cache.get(this.manifestKey)},e.prototype.clear=function(){return this.cache.remove(this.manifestKey)},e.prototype.createManifestKeyFrom=function(e){return "@@auth0spajs@@::"+e},e}(),rc=new aa,oc={memory:function(){return (new Pa).enclosedCache},localstorage:function(){return new Ka}},ic=function(e){return oc[e]},ac=function(){return !/Trident.*rv:11\.0/.test(navigator.userAgent)},cc=function(){function e(e){var t,n,o;if(this.options=e,"undefined"!=typeof window&&function(){if(!ga())throw new Error("For security reasons, `window.crypto` is required to run `auth0-spa-js`.");if(void 0===ba())throw new Error("\n      auth0-spa-js must run on a secure origin. See https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin for more information.\n    ")}(),e.cache&&e.cacheLocation&&console.warn("Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`."),e.cache)o=e.cache;else {if(this.cacheLocation=e.cacheLocation||"memory",!ic(this.cacheLocation))throw new Error('Invalid cache location "'+this.cacheLocation+'"');o=ic(this.cacheLocation)();}this.cookieStorage=!1===e.legacySameSiteCookie?Ja:Ba,this.orgHintCookieName="auth0."+this.options.client_id+".organization_hint",this.isAuthenticatedCookieName=function(e){return "auth0."+e+".is.authenticated"}(this.options.client_id),this.sessionCheckExpiryDays=e.sessionCheckExpiryDays||1;var i,a=e.useCookiesForTransactions?this.cookieStorage:Ga;this.scope=this.options.scope,this.transactionManager=new Wa(a,this.options.client_id),this.nowProvider=this.options.nowProvider||la,this.cacheManager=new La(o,o.allKeys?null:new nc(o,this.options.client_id),this.nowProvider),this.domainUrl=(i=this.options.domain,/^https?:\/\//.test(i)?i:"https://"+i),this.tokenIssuer=function(e,t){return e?e.startsWith("https://")?e:"https://"+e+"/":t+"/"}(this.options.issuer,this.domainUrl),this.defaultScope=ja("openid",void 0!==(null===(n=null===(t=this.options)||void 0===t?void 0:t.advancedOptions)||void 0===n?void 0:n.defaultScope)?this.options.advancedOptions.defaultScope:"openid profile email"),this.options.useRefreshTokens&&(this.scope=ja(this.scope,"offline_access")),"undefined"!=typeof window&&window.Worker&&this.options.useRefreshTokens&&"memory"===this.cacheLocation&&ac()&&(this.worker=new ec),this.customOptions=function(e){return e.advancedOptions,e.audience,e.auth0Client,e.authorizeTimeoutInSeconds,e.cacheLocation,e.client_id,e.domain,e.issuer,e.leeway,e.max_age,e.redirect_uri,e.scope,e.useRefreshTokens,e.useCookiesForTransactions,e.useFormData,r(e,["advancedOptions","audience","auth0Client","authorizeTimeoutInSeconds","cacheLocation","client_id","domain","issuer","leeway","max_age","redirect_uri","scope","useRefreshTokens","useCookiesForTransactions","useFormData"])}(e);}return e.prototype._url=function(e){var t=encodeURIComponent(btoa(JSON.stringify(this.options.auth0Client||ua)));return ""+this.domainUrl+e+"&auth0Client="+t},e.prototype._getParams=function(e,t,o,i,a){var c=this.options;c.useRefreshTokens,c.useCookiesForTransactions,c.useFormData,c.auth0Client,c.cacheLocation,c.advancedOptions,c.detailedResponse,c.nowProvider,c.authorizeTimeoutInSeconds,c.legacySameSiteCookie,c.sessionCheckExpiryDays,c.domain,c.leeway;var s=r(c,["useRefreshTokens","useCookiesForTransactions","useFormData","auth0Client","cacheLocation","advancedOptions","detailedResponse","nowProvider","authorizeTimeoutInSeconds","legacySameSiteCookie","sessionCheckExpiryDays","domain","leeway"]);return n(n(n({},s),e),{scope:ja(this.defaultScope,this.scope,e.scope),response_type:"code",response_mode:"query",state:t,nonce:o,redirect_uri:a||this.options.redirect_uri,code_challenge:i,code_challenge_method:"S256"})},e.prototype._authorizeUrl=function(e){return this._url("/authorize?"+_a(e))},e.prototype._verifyIdToken=function(e,t,n){return o(this,void 0,void 0,(function(){var r;return i$1(this,(function(o){switch(o.label){case 0:return [4,this.nowProvider()];case 1:return r=o.sent(),[2,Na({iss:this.tokenIssuer,aud:this.options.client_id,id_token:e,nonce:t,organizationId:n,leeway:this.options.leeway,max_age:this._parseNumber(this.options.max_age),now:r})]}}))}))},e.prototype._parseNumber=function(e){return "string"!=typeof e?e:parseInt(e,10)||void 0},e.prototype._processOrgIdHint=function(e){e?this.cookieStorage.save(this.orgHintCookieName,e,{daysUntilExpire:this.sessionCheckExpiryDays}):this.cookieStorage.remove(this.orgHintCookieName);},e.prototype.buildAuthorizeUrl=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,o,a,c,s,u,l,f,d,h,p,y;return i$1(this,(function(i){switch(i.label){case 0:return t=e.redirect_uri,o=e.appState,a=r(e,["redirect_uri","appState"]),c=Sa(wa()),s=Sa(wa()),u=wa(),[4,ka(u)];case 1:return l=i.sent(),f=Ta(l),d=e.fragment?"#"+e.fragment:"",h=this._getParams(a,c,s,f,t),p=this._authorizeUrl(h),y=e.organization||this.options.organization,this.transactionManager.create(n({nonce:s,code_verifier:u,appState:o,scope:h.scope,audience:h.audience||"default",redirect_uri:h.redirect_uri,state:c},y&&{organizationId:y})),[2,p+d]}}))}))},e.prototype.loginWithPopup=function(e,t){return o(this,void 0,void 0,(function(){var o,a,c,s,u,l,f,d,h,p,y,v,m;return i$1(this,(function(i){switch(i.label){case 0:return e=e||{},(t=t||{}).popup||(t.popup=function(e){var t=window.screenX+(window.innerWidth-400)/2,n=window.screenY+(window.innerHeight-600)/2;return window.open(e,"auth0:authorize:popup","left="+t+",top="+n+",width=400,height=600,resizable,scrollbars=yes,status=1")}("")),o=r(e,[]),a=Sa(wa()),c=Sa(wa()),s=wa(),[4,ka(s)];case 1:return u=i.sent(),l=Ta(u),f=this._getParams(o,a,c,l,this.options.redirect_uri||window.location.origin),d=this._authorizeUrl(n(n({},f),{response_mode:"web_message"})),t.popup.location.href=d,[4,ma(n(n({},t),{timeoutInSeconds:t.timeoutInSeconds||this.options.authorizeTimeoutInSeconds||60}))];case 2:if(h=i.sent(),a!==h.state)throw new Error("Invalid state");return [4,Fa({audience:f.audience,scope:f.scope,baseUrl:this.domainUrl,client_id:this.options.client_id,code_verifier:s,code:h.code,grant_type:"authorization_code",redirect_uri:f.redirect_uri,auth0Client:this.options.auth0Client,useFormData:this.options.useFormData},this.worker)];case 3:return p=i.sent(),y=e.organization||this.options.organization,[4,this._verifyIdToken(p.id_token,c,y)];case 4:return v=i.sent(),m=n(n({},p),{decodedToken:v,scope:f.scope,audience:f.audience||"default",client_id:this.options.client_id}),[4,this.cacheManager.set(m)];case 5:return i.sent(),this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays}),this._processOrgIdHint(v.claims.org_id),[2]}}))}))},e.prototype.getUser=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,n,r;return i$1(this,(function(o){switch(o.label){case 0:return t=e.audience||this.options.audience||"default",n=ja(this.defaultScope,this.scope,e.scope),[4,this.cacheManager.get(new Ua({client_id:this.options.client_id,audience:t,scope:n}))];case 1:return [2,(r=o.sent())&&r.decodedToken&&r.decodedToken.user]}}))}))},e.prototype.getIdTokenClaims=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,n,r;return i$1(this,(function(o){switch(o.label){case 0:return t=e.audience||this.options.audience||"default",n=ja(this.defaultScope,this.scope,e.scope),[4,this.cacheManager.get(new Ua({client_id:this.options.client_id,audience:t,scope:n}))];case 1:return [2,(r=o.sent())&&r.decodedToken&&r.decodedToken.claims]}}))}))},e.prototype.loginWithRedirect=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,n,o;return i$1(this,(function(i){switch(i.label){case 0:return t=e.redirectMethod,n=r(e,["redirectMethod"]),[4,this.buildAuthorizeUrl(n)];case 1:return o=i.sent(),window.location[t||"assign"](o),[2]}}))}))},e.prototype.handleRedirectCallback=function(e){return void 0===e&&(e=window.location.href),o(this,void 0,void 0,(function(){var t,r,o,c,s,u,l,f,d,h;return i$1(this,(function(i){switch(i.label){case 0:if(0===(t=e.split("?").slice(1)).length)throw new Error("There are no query params available for parsing.");if(r=function(e){e.indexOf("#")>-1&&(e=e.substr(0,e.indexOf("#")));var t=e.split("&"),n={};return t.forEach((function(e){var t=a(e.split("="),2),r=t[0],o=t[1];n[r]=decodeURIComponent(o);})),n.expires_in&&(n.expires_in=parseInt(n.expires_in)),n}(t.join("")),o=r.state,c=r.code,s=r.error,u=r.error_description,!(l=this.transactionManager.get()))throw new Error("Invalid state");if(this.transactionManager.remove(),s)throw new da(s,u,o,l.appState);if(!l.code_verifier||l.state&&l.state!==o)throw new Error("Invalid state");return f={audience:l.audience,scope:l.scope,baseUrl:this.domainUrl,client_id:this.options.client_id,code_verifier:l.code_verifier,grant_type:"authorization_code",code:c,auth0Client:this.options.auth0Client,useFormData:this.options.useFormData},void 0!==l.redirect_uri&&(f.redirect_uri=l.redirect_uri),[4,Fa(f,this.worker)];case 1:return d=i.sent(),[4,this._verifyIdToken(d.id_token,l.nonce,l.organizationId)];case 2:return h=i.sent(),[4,this.cacheManager.set(n(n(n(n({},d),{decodedToken:h,audience:l.audience,scope:l.scope}),d.scope?{oauthTokenScope:d.scope}:null),{client_id:this.options.client_id}))];case 3:return i.sent(),this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays}),this._processOrgIdHint(h.claims.org_id),[2,{appState:l.appState}]}}))}))},e.prototype.checkSession=function(e){return o(this,void 0,void 0,(function(){var t;return i$1(this,(function(n){switch(n.label){case 0:if(!this.cookieStorage.get(this.isAuthenticatedCookieName)){if(!this.cookieStorage.get("auth0.is.authenticated"))return [2];this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays}),this.cookieStorage.remove("auth0.is.authenticated");}n.label=1;case 1:return n.trys.push([1,3,,4]),[4,this.getTokenSilently(e)];case 2:return n.sent(),[3,4];case 3:if(t=n.sent(),!sa.includes(t.error))throw t;return [3,4];case 4:return [2]}}))}))},e.prototype.getTokenSilently=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,o,a,c=this;return i$1(this,(function(i){return t=n(n({audience:this.options.audience,ignoreCache:!1},e),{scope:ja(this.defaultScope,this.scope,e.scope)}),o=t.ignoreCache,a=r(t,["ignoreCache"]),[2,(s=function(){return c._getTokenSilently(n({ignoreCache:o},a))},u=this.options.client_id+"::"+a.audience+"::"+a.scope,l=tc[u],l||(l=s().finally((function(){delete tc[u],l=null;})),tc[u]=l),l)];var s,u,l;}))}))},e.prototype._getTokenSilently=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,a,c,s,u,l,f,d,h;return i$1(this,(function(p){switch(p.label){case 0:return t=e.ignoreCache,a=r(e,["ignoreCache"]),t?[3,2]:[4,this._getEntryFromCache({scope:a.scope,audience:a.audience||"default",client_id:this.options.client_id,getDetailedEntry:e.detailedResponse})];case 1:if(c=p.sent())return [2,c];p.label=2;case 2:return [4,(y=function(){return rc.acquireLock("auth0.lock.getTokenSilently",5e3)},v=10,void 0===v&&(v=3),o(void 0,void 0,void 0,(function(){var e;return i$1(this,(function(t){switch(t.label){case 0:e=0,t.label=1;case 1:return e<v?[4,y()]:[3,4];case 2:if(t.sent())return [2,!0];t.label=3;case 3:return e++,[3,1];case 4:return [2,!1]}}))})))];case 3:if(!p.sent())return [3,15];p.label=4;case 4:return p.trys.push([4,,12,14]),t?[3,6]:[4,this._getEntryFromCache({scope:a.scope,audience:a.audience||"default",client_id:this.options.client_id,getDetailedEntry:e.detailedResponse})];case 5:if(c=p.sent())return [2,c];p.label=6;case 6:return this.options.useRefreshTokens?[4,this._getTokenUsingRefreshToken(a)]:[3,8];case 7:return u=p.sent(),[3,10];case 8:return [4,this._getTokenFromIFrame(a)];case 9:u=p.sent(),p.label=10;case 10:return s=u,[4,this.cacheManager.set(n({client_id:this.options.client_id},s))];case 11:return p.sent(),this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays}),e.detailedResponse?(l=s.id_token,f=s.access_token,d=s.oauthTokenScope,h=s.expires_in,[2,n(n({id_token:l,access_token:f},d?{scope:d}:null),{expires_in:h})]):[2,s.access_token];case 12:return [4,rc.releaseLock("auth0.lock.getTokenSilently")];case 13:return p.sent(),[7];case 14:return [3,16];case 15:throw new ha;case 16:return [2]}var y,v;}))}))},e.prototype.getTokenWithPopup=function(e,t){return void 0===e&&(e={}),void 0===t&&(t={}),o(this,void 0,void 0,(function(){return i$1(this,(function(r){switch(r.label){case 0:return e.audience=e.audience||this.options.audience,e.scope=ja(this.defaultScope,this.scope,e.scope),t=n(n({},ca),t),[4,this.loginWithPopup(e,t)];case 1:return r.sent(),[4,this.cacheManager.get(new Ua({scope:e.scope,audience:e.audience||"default",client_id:this.options.client_id}))];case 2:return [2,r.sent().access_token]}}))}))},e.prototype.isAuthenticated=function(){return o(this,void 0,void 0,(function(){return i$1(this,(function(e){switch(e.label){case 0:return [4,this.getUser()];case 1:return [2,!!e.sent()]}}))}))},e.prototype.buildLogoutUrl=function(e){void 0===e&&(e={}),null!==e.client_id?e.client_id=e.client_id||this.options.client_id:delete e.client_id;var t=e.federated,n=r(e,["federated"]),o=t?"&federated":"";return this._url("/v2/logout?"+_a(n))+o},e.prototype.logout=function(e){var t=this;void 0===e&&(e={});var n=e.localOnly,o=r(e,["localOnly"]);if(n&&o.federated)throw new Error("It is invalid to set both the `federated` and `localOnly` options to `true`");var i=function(){if(t.cookieStorage.remove(t.orgHintCookieName),t.cookieStorage.remove(t.isAuthenticatedCookieName),!n){var e=t.buildLogoutUrl(o);window.location.assign(e);}};if(this.options.cache)return this.cacheManager.clear().then((function(){return i()}));this.cacheManager.clearSync(),i();},e.prototype._getTokenFromIFrame=function(e){return o(this,void 0,void 0,(function(){var t,o,a,c,s,u,l,f,d,h,p,y,v,m,g,b,w;return i$1(this,(function(i){switch(i.label){case 0:return t=Sa(wa()),o=Sa(wa()),a=wa(),[4,ka(a)];case 1:c=i.sent(),s=Ta(c),u=r(e,["detailedResponse"]),l=this._getParams(u,t,o,s,e.redirect_uri||this.options.redirect_uri||window.location.origin),(f=this.cookieStorage.get(this.orgHintCookieName))&&!l.organization&&(l.organization=f),d=this._authorizeUrl(n(n({},l),{prompt:"none",response_mode:"web_message"})),h=e.timeoutInSeconds||this.options.authorizeTimeoutInSeconds,i.label=2;case 2:if(i.trys.push([2,6,,7]),window.crossOriginIsolated)throw new fa("login_required","The application is running in a Cross-Origin Isolated context, silently retrieving a token without refresh token is not possible.");return [4,(S=d,_=this.domainUrl,k=h,void 0===k&&(k=60),new Promise((function(e,t){var n=window.document.createElement("iframe");n.setAttribute("width","0"),n.setAttribute("height","0"),n.style.display="none";var r,o=function(){window.document.body.contains(n)&&(window.document.body.removeChild(n),window.removeEventListener("message",r,!1));},i=setTimeout((function(){t(new ha),o();}),1e3*k);r=function(n){if(n.origin==_&&n.data&&"authorization_response"===n.data.type){var a=n.source;a&&a.close(),n.data.response.error?t(fa.fromPayload(n.data.response)):e(n.data.response),clearTimeout(i),window.removeEventListener("message",r,!1),setTimeout(o,2e3);}},window.addEventListener("message",r,!1),window.document.body.appendChild(n),n.setAttribute("src",S);})))];case 3:if(p=i.sent(),t!==p.state)throw new Error("Invalid state");return y=e.scope,v=e.audience,m=r(e,["scope","audience","redirect_uri","ignoreCache","timeoutInSeconds","detailedResponse"]),[4,Fa(n(n(n({},this.customOptions),m),{scope:y,audience:v,baseUrl:this.domainUrl,client_id:this.options.client_id,code_verifier:a,code:p.code,grant_type:"authorization_code",redirect_uri:l.redirect_uri,auth0Client:this.options.auth0Client,useFormData:this.options.useFormData}),this.worker)];case 4:return g=i.sent(),[4,this._verifyIdToken(g.id_token,o)];case 5:return b=i.sent(),this._processOrgIdHint(b.claims.org_id),[2,n(n({},g),{decodedToken:b,scope:l.scope,oauthTokenScope:g.scope,audience:l.audience||"default"})];case 6:throw "login_required"===(w=i.sent()).error&&this.logout({localOnly:!0}),w;case 7:return [2]}var S,_,k;}))}))},e.prototype._getTokenUsingRefreshToken=function(e){return o(this,void 0,void 0,(function(){var t,o,a,c,s,u,l,f,d;return i$1(this,(function(i){switch(i.label){case 0:return e.scope=ja(this.defaultScope,this.options.scope,e.scope),[4,this.cacheManager.get(new Ua({scope:e.scope,audience:e.audience||"default",client_id:this.options.client_id}))];case 1:return (t=i.sent())&&t.refresh_token||this.worker?[3,3]:[4,this._getTokenFromIFrame(e)];case 2:return [2,i.sent()];case 3:o=e.redirect_uri||this.options.redirect_uri||window.location.origin,c=e.scope,s=e.audience,u=r(e,["scope","audience","ignoreCache","timeoutInSeconds","detailedResponse"]),l="number"==typeof e.timeoutInSeconds?1e3*e.timeoutInSeconds:null,i.label=4;case 4:return i.trys.push([4,6,,9]),[4,Fa(n(n(n(n(n({},this.customOptions),u),{audience:s,scope:c,baseUrl:this.domainUrl,client_id:this.options.client_id,grant_type:"refresh_token",refresh_token:t&&t.refresh_token,redirect_uri:o}),l&&{timeout:l}),{auth0Client:this.options.auth0Client,useFormData:this.options.useFormData}),this.worker)];case 5:return a=i.sent(),[3,9];case 6:return "The web worker is missing the refresh token"===(f=i.sent()).message||f.message&&f.message.indexOf("invalid refresh token")>-1?[4,this._getTokenFromIFrame(e)]:[3,8];case 7:return [2,i.sent()];case 8:throw f;case 9:return [4,this._verifyIdToken(a.id_token)];case 10:return d=i.sent(),[2,n(n({},a),{decodedToken:d,scope:e.scope,oauthTokenScope:a.scope,audience:e.audience||"default"})]}}))}))},e.prototype._getEntryFromCache=function(e){var t=e.scope,r=e.audience,a=e.client_id,c=e.getDetailedEntry,s=void 0!==c&&c;return o(this,void 0,void 0,(function(){var e,o,c,u,l;return i$1(this,(function(i){switch(i.label){case 0:return [4,this.cacheManager.get(new Ua({scope:t,audience:r,client_id:a}),60)];case 1:return (e=i.sent())&&e.access_token?s?(o=e.id_token,c=e.access_token,u=e.oauthTokenScope,l=e.expires_in,[2,n(n({id_token:o,access_token:c},u?{scope:u}:null),{expires_in:l})]):[2,e.access_token]:[2]}}))}))},e}();function uc(e){return o(this,void 0,void 0,(function(){var t;return i$1(this,(function(n){switch(n.label){case 0:return [4,(t=new cc(e)).checkSession()];case 1:return n.sent(),[2,t]}}))}))}//# sourceMappingURL=auth0-spa-js.production.esm.js.map

    function addToGroceryList(ingredient, claims) {
        fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
            method: 'POST',
            headers: { 
              Accept: 'application/json',
              'Content-Type': 'application/json',
               Authorization: `Bearer ${claims} `
             },
            body: JSON.stringify({ query: `mutation {
            insert_grocerylist_one(object:{
                GroceryListID: 1,
                Item: "${ingredient}",
                Done: "No"                
            }) {
              Item
            }
          }`
            })
          })
            .then(res => res.json())
            .then(res => {
                console.log(res.data);
                return res.data;

          });       
      }

      function markDone(ingredient, html_element, claims) {
        html_element.className = 'table-success';
        fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
            method: 'POST',
            headers: { 
              Accept: 'application/json',
              'Content-Type': 'application/json' ,
              Authorization: `Bearer ${claims}`
            },
            body: JSON.stringify({ query: `mutation {
            update_grocerylist(where: {Item: { _eq: "${ingredient}"}},
            _set: {
              Done: "Yes"
            }
          ) {
            affected_rows
            returning {
              Item
              Done
            }
          }
        }`
            })
          })
            .then(res => res.json())
            .then(res => {
                console.log(res.data);
                return "success";
          });       
      }

      function addAllItemsToGroceryList(items, disabled) {
        disabled = "disabled";
        console.log(items);
        for (var i = 0; i < items.length; i++) {
          fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: `mutation {
              insert_grocerylist_one(object:{
                GroceryListID: 2,
                Item: "${items[i].ingredients_recipe.Ingredient}",
                Done: "No"
              }) {
                Item
              }
            }`
              })
            })
              .then(res => res.json())
              .then(res => {
                  console.log(res.data);
                  console.log(disabled);
                  return disabled;
            });   
        }
      }

      // async function refreshGroceryList(items) {
      //   items = fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({ query: `{
      //           grocerylist(where: {Done: {_eq: "No"}}) {
      //             id
      //             Item
      //           }
      //         }`
      //     })
      //   })
      //     .then(res => res.json())
      //     .then(res => {
      //       console.log(res.data);
      //       items = res.data.grocerylist;
      //       console.log(items);
      //       return items;
      //     })          
      // }

      async function executeGraphql(query, claims) {
          const resp = await fetch("https://graphql-jeffrecipes.herokuapp.com/v1/graphql", {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${claims} `,
                // "x-hasura-admin-secret": 'bicycling',
                "Content-Type": "application/json"
              },
              method: "POST",
              body: JSON.stringify({ query: query })
            });
            return await resp.json();
      }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1$1, Object: Object_1, console: console_1 } = globals;

    // (219:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
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
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(219:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (217:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
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
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
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
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[5]);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(217:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
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
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function wrap(route, userData, ...conditions) {
    	// Check if we don't have userData
    	if (userData && typeof userData == 'function') {
    		conditions = conditions && conditions.length ? conditions : [];
    		conditions.unshift(userData);
    		userData = undefined;
    	}

    	// Parameter route and each item of conditions must be functions
    	if (!route || typeof route != 'function') {
    		throw Error('Invalid parameter route');
    	}

    	if (conditions && conditions.length) {
    		for (let i = 0; i < conditions.length; i++) {
    			if (!conditions[i] || typeof conditions[i] != 'function') {
    				throw Error('Invalid parameter conditions[' + i + ']');
    			}
    		}
    	}

    	// Returns an object that contains all the functions to execute too
    	const obj = { route, userData };

    	if (conditions && conditions.length) {
    		obj.conditions = conditions;
    	}

    	// The _sveltesparouter flag is to confirm the object was created by this router
    	Object.defineProperty(obj, '_sveltesparouter', { value: true });

    	return obj;
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location$1 = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    	});
    }

    function pop() {
    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		window.history.back();
    	});
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    		try {
    			window.history.replaceState(undefined, undefined, dest);
    		} catch(e) {
    			// eslint-disable-next-line no-console
    			console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    		}

    		// The method above doesn't trigger the hashchange event, so let's do that manually
    		window.dispatchEvent(new Event('hashchange'));
    	});
    }

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, hrefVar || node.getAttribute('href'));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != '/') {
    		throw Error('Invalid value for "href" attribute');
    	}

    	// Add # to the href attribute
    	node.setAttribute('href', '#' + href);
    }

    function nextTickPromise(cb) {
    	// eslint-disable-next-line no-console
    	console.warn('nextTickPromise from \'svelte-spa-router\' is deprecated and will be removed in version 3; use the \'tick\' method from the Svelte runtime instead');

    	return tick().then(cb);
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, 'loc');
    	component_subscribe($$self, loc, $$value => $$invalidate(4, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent} component - Svelte component for the route
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument');
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, remove it before we run the matching
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || '/';
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {SvelteComponent} component - Svelte component
     * @property {string} name - Name of the Svelte component
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {Object} [userData] - Custom data passed by the user
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	const dispatchNextTick = (name, detail) => {
    		// Execute this code when the current call stack is complete
    		tick().then(() => {
    			dispatch(name, detail);
    		});
    	};

    	const writable_props = ['routes', 'prefix'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(2, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		tick,
    		wrap,
    		getLocation,
    		loc,
    		location: location$1,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		nextTickPromise,
    		createEventDispatcher,
    		regexparam,
    		routes,
    		prefix,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		dispatch,
    		dispatchNextTick,
    		$loc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(2, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 17) {
    			// Handle hash change events
    			// Listen to changes in the $loc store and update the page
    			 {
    				// Find a route matching the location
    				$$invalidate(0, component = null);

    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						// Check if the route can be loaded - if all conditions succeed
    						if (!routesList[i].checkConditions(detail)) {
    							// Trigger an event to notify the user
    							dispatchNextTick('conditionsFailed', detail);

    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);

    						// Set componentParams onloy if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    						// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    						if (match && typeof match == 'object' && Object.keys(match).length) {
    							$$invalidate(1, componentParams = match);
    						} else {
    							$$invalidate(1, componentParams = null);
    						}

    						dispatchNextTick('routeLoaded', detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [
    		component,
    		componentParams,
    		routes,
    		prefix,
    		$loc,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get routes() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/simple-svelte-autocomplete/src/SimpleAutocomplete.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1$1, console: console_1$1 } = globals;
    const file$1 = "node_modules/simple-svelte-autocomplete/src/SimpleAutocomplete.svelte";

    const get_no_results_slot_changes = dirty => ({
    	noResultsText: dirty[0] & /*noResultsText*/ 2
    });

    const get_no_results_slot_context = ctx => ({ noResultsText: /*noResultsText*/ ctx[1] });

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[79] = list[i];
    	child_ctx[81] = i;
    	return child_ctx;
    }

    const get_item_slot_changes = dirty => ({
    	item: dirty[0] & /*filteredListItems*/ 131072,
    	label: dirty[0] & /*filteredListItems*/ 131072
    });

    const get_item_slot_context = ctx => ({
    	item: /*listItem*/ ctx[79].item,
    	label: /*listItem*/ ctx[79].highlighted
    	? /*listItem*/ ctx[79].highlighted.label
    	: /*listItem*/ ctx[79].label
    });

    // (775:2) {#if showClear}
    function create_if_block_6(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "✖";
    			attr_dev(span, "class", "autocomplete-clear-button svelte-77usy");
    			add_location(span, file$1, 775, 4, 17914);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*clear*/ ctx[27], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(775:2) {#if showClear}",
    		ctx
    	});

    	return block;
    }

    // (812:28) 
    function create_if_block_5(ctx) {
    	let div;
    	let current;
    	const no_results_slot_template = /*#slots*/ ctx[50]["no-results"];
    	const no_results_slot = create_slot(no_results_slot_template, ctx, /*$$scope*/ ctx[49], get_no_results_slot_context);
    	const no_results_slot_or_fallback = no_results_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (no_results_slot_or_fallback) no_results_slot_or_fallback.c();
    			attr_dev(div, "class", "autocomplete-list-item-no-results svelte-77usy");
    			add_location(div, file$1, 812, 6, 19343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (no_results_slot_or_fallback) {
    				no_results_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (no_results_slot) {
    				if (no_results_slot.p && (!current || dirty[0] & /*noResultsText*/ 2 | dirty[1] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						no_results_slot,
    						no_results_slot_template,
    						ctx,
    						/*$$scope*/ ctx[49],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[49])
    						: get_slot_changes(no_results_slot_template, /*$$scope*/ ctx[49], dirty, get_no_results_slot_changes),
    						get_no_results_slot_context
    					);
    				}
    			} else {
    				if (no_results_slot_or_fallback && no_results_slot_or_fallback.p && (!current || dirty[0] & /*noResultsText*/ 2)) {
    					no_results_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(no_results_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(no_results_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (no_results_slot_or_fallback) no_results_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(812:28) ",
    		ctx
    	});

    	return block;
    }

    // (782:4) {#if filteredListItems && filteredListItems.length > 0}
    function create_if_block$1(ctx) {
    	let t;
    	let if_block_anchor;
    	let current;
    	let each_value = /*filteredListItems*/ ctx[17];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*maxItemsToShowInList*/ ctx[0] > 0 && /*filteredListItems*/ ctx[17].length > /*maxItemsToShowInList*/ ctx[0] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*highlightIndex, onListItemClick, filteredListItems, maxItemsToShowInList*/ 1212417 | dirty[1] & /*$$scope*/ 262144) {
    				each_value = /*filteredListItems*/ ctx[17];
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
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*maxItemsToShowInList*/ ctx[0] > 0 && /*filteredListItems*/ ctx[17].length > /*maxItemsToShowInList*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(782:4) {#if filteredListItems && filteredListItems.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (814:48) {noResultsText}
    function fallback_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*noResultsText*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*noResultsText*/ 2) set_data_dev(t, /*noResultsText*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(814:48) {noResultsText}",
    		ctx
    	});

    	return block;
    }

    // (784:8) {#if listItem && (maxItemsToShowInList <= 0 || i < maxItemsToShowInList)}
    function create_if_block_2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*listItem*/ ctx[79] && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*listItem*/ ctx[79]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*filteredListItems*/ 131072) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(784:8) {#if listItem && (maxItemsToShowInList <= 0 || i < maxItemsToShowInList)}",
    		ctx
    	});

    	return block;
    }

    // (785:10) {#if listItem}
    function create_if_block_3(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const item_slot_template = /*#slots*/ ctx[50].item;
    	const item_slot = create_slot(item_slot_template, ctx, /*$$scope*/ ctx[49], get_item_slot_context);
    	const item_slot_or_fallback = item_slot || fallback_block(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[53](/*listItem*/ ctx[79]);
    	}

    	function pointerenter_handler() {
    		return /*pointerenter_handler*/ ctx[54](/*i*/ ctx[81]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (item_slot_or_fallback) item_slot_or_fallback.c();

    			attr_dev(div, "class", div_class_value = "autocomplete-list-item " + (/*i*/ ctx[81] === /*highlightIndex*/ ctx[15]
    			? 'selected'
    			: '') + " svelte-77usy");

    			add_location(div, file$1, 785, 12, 18369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (item_slot_or_fallback) {
    				item_slot_or_fallback.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", click_handler, false, false, false),
    					listen_dev(div, "pointerenter", pointerenter_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (item_slot) {
    				if (item_slot.p && (!current || dirty[0] & /*filteredListItems*/ 131072 | dirty[1] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						item_slot,
    						item_slot_template,
    						ctx,
    						/*$$scope*/ ctx[49],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[49])
    						: get_slot_changes(item_slot_template, /*$$scope*/ ctx[49], dirty, get_item_slot_changes),
    						get_item_slot_context
    					);
    				}
    			} else {
    				if (item_slot_or_fallback && item_slot_or_fallback.p && (!current || dirty[0] & /*filteredListItems*/ 131072)) {
    					item_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*highlightIndex*/ 32768 && div_class_value !== (div_class_value = "autocomplete-list-item " + (/*i*/ ctx[81] === /*highlightIndex*/ ctx[15]
    			? 'selected'
    			: '') + " svelte-77usy")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(785:10) {#if listItem}",
    		ctx
    	});

    	return block;
    }

    // (798:16) {:else}
    function create_else_block$1(ctx) {
    	let html_tag;
    	let raw_value = /*listItem*/ ctx[79].label + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filteredListItems*/ 131072 && raw_value !== (raw_value = /*listItem*/ ctx[79].label + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(798:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (796:16) {#if listItem.highlighted}
    function create_if_block_4(ctx) {
    	let html_tag;
    	let raw_value = /*listItem*/ ctx[79].highlighted.label + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filteredListItems*/ 131072 && raw_value !== (raw_value = /*listItem*/ ctx[79].highlighted.label + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(796:16) {#if listItem.highlighted}",
    		ctx
    	});

    	return block;
    }

    // (795:91)                  
    function fallback_block(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*listItem*/ ctx[79].highlighted) return create_if_block_4;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
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
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(795:91)                  ",
    		ctx
    	});

    	return block;
    }

    // (783:6) {#each filteredListItems as listItem, i}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*listItem*/ ctx[79] && (/*maxItemsToShowInList*/ ctx[0] <= 0 || /*i*/ ctx[81] < /*maxItemsToShowInList*/ ctx[0]) && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*listItem*/ ctx[79] && (/*maxItemsToShowInList*/ ctx[0] <= 0 || /*i*/ ctx[81] < /*maxItemsToShowInList*/ ctx[0])) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*filteredListItems, maxItemsToShowInList*/ 131073) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(783:6) {#each filteredListItems as listItem, i}",
    		ctx
    	});

    	return block;
    }

    // (807:6) {#if maxItemsToShowInList > 0 && filteredListItems.length > maxItemsToShowInList}
    function create_if_block_1(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*filteredListItems*/ ctx[17].length - /*maxItemsToShowInList*/ ctx[0] + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("...");
    			t1 = text(t1_value);
    			t2 = text(" results not shown");
    			attr_dev(div, "class", "autocomplete-list-item-no-results svelte-77usy");
    			add_location(div, file$1, 807, 8, 19152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filteredListItems, maxItemsToShowInList*/ 131073 && t1_value !== (t1_value = /*filteredListItems*/ ctx[17].length - /*maxItemsToShowInList*/ ctx[0] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(807:6) {#if maxItemsToShowInList > 0 && filteredListItems.length > maxItemsToShowInList}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let input_1;
    	let input_1_class_value;
    	let input_1_id_value;
    	let input_1_autocomplete_value;
    	let t0;
    	let t1;
    	let div0;
    	let current_block_type_index;
    	let if_block1;
    	let div0_class_value;
    	let div1_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*showClear*/ ctx[11] && create_if_block_6(ctx);
    	const if_block_creators = [create_if_block$1, create_if_block_5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*filteredListItems*/ ctx[17] && /*filteredListItems*/ ctx[17].length > 0) return 0;
    		if (/*noResultsText*/ ctx[1]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			input_1 = element("input");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			attr_dev(input_1, "type", "text");

    			attr_dev(input_1, "class", input_1_class_value = "" + ((/*inputClassName*/ ctx[4]
    			? /*inputClassName*/ ctx[4]
    			: '') + " input autocomplete-input" + " svelte-77usy"));

    			attr_dev(input_1, "id", input_1_id_value = /*inputId*/ ctx[5] ? /*inputId*/ ctx[5] : '');
    			attr_dev(input_1, "autocomplete", input_1_autocomplete_value = /*html5autocomplete*/ ctx[8] ? 'on' : 'off');
    			attr_dev(input_1, "placeholder", /*placeholder*/ ctx[2]);
    			attr_dev(input_1, "name", /*name*/ ctx[6]);
    			input_1.disabled = /*disabled*/ ctx[12];
    			attr_dev(input_1, "title", /*title*/ ctx[7]);
    			add_location(input_1, file$1, 758, 2, 17476);

    			attr_dev(div0, "class", div0_class_value = "" + ((/*dropdownClassName*/ ctx[9]
    			? /*dropdownClassName*/ ctx[9]
    			: '') + " autocomplete-list " + (/*showList*/ ctx[18] ? '' : 'hidden') + " is-fullwidth" + " svelte-77usy"));

    			add_location(div0, file$1, 777, 2, 17997);
    			attr_dev(div1, "class", div1_class_value = "" + ((/*className*/ ctx[3] ? /*className*/ ctx[3] : '') + " " + (/*hideArrow*/ ctx[10] ? 'hide-arrow is-multiple' : '') + " " + (/*showClear*/ ctx[11] ? 'show-clear' : '') + " autocomplete select is-fullwidth " + /*uniqueId*/ ctx[19] + " svelte-77usy"));
    			add_location(div1, file$1, 754, 0, 17305);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input_1);
    			/*input_1_binding*/ ctx[51](input_1);
    			set_input_value(input_1, /*text*/ ctx[16]);
    			append_dev(div1, t0);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			/*div0_binding*/ ctx[55](div0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*onDocumentClick*/ ctx[21], false, false, false),
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[52]),
    					listen_dev(input_1, "input", /*onInput*/ ctx[24], false, false, false),
    					listen_dev(input_1, "focus", /*onFocus*/ ctx[26], false, false, false),
    					listen_dev(input_1, "keydown", /*onKeyDown*/ ctx[22], false, false, false),
    					listen_dev(input_1, "click", /*onInputClick*/ ctx[25], false, false, false),
    					listen_dev(input_1, "keypress", /*onKeyPress*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*inputClassName*/ 16 && input_1_class_value !== (input_1_class_value = "" + ((/*inputClassName*/ ctx[4]
    			? /*inputClassName*/ ctx[4]
    			: '') + " input autocomplete-input" + " svelte-77usy"))) {
    				attr_dev(input_1, "class", input_1_class_value);
    			}

    			if (!current || dirty[0] & /*inputId*/ 32 && input_1_id_value !== (input_1_id_value = /*inputId*/ ctx[5] ? /*inputId*/ ctx[5] : '')) {
    				attr_dev(input_1, "id", input_1_id_value);
    			}

    			if (!current || dirty[0] & /*html5autocomplete*/ 256 && input_1_autocomplete_value !== (input_1_autocomplete_value = /*html5autocomplete*/ ctx[8] ? 'on' : 'off')) {
    				attr_dev(input_1, "autocomplete", input_1_autocomplete_value);
    			}

    			if (!current || dirty[0] & /*placeholder*/ 4) {
    				attr_dev(input_1, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*name*/ 64) {
    				attr_dev(input_1, "name", /*name*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 4096) {
    				prop_dev(input_1, "disabled", /*disabled*/ ctx[12]);
    			}

    			if (!current || dirty[0] & /*title*/ 128) {
    				attr_dev(input_1, "title", /*title*/ ctx[7]);
    			}

    			if (dirty[0] & /*text*/ 65536 && input_1.value !== /*text*/ ctx[16]) {
    				set_input_value(input_1, /*text*/ ctx[16]);
    			}

    			if (/*showClear*/ ctx[11]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_6(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];

    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					} else {
    						if_block1.p(ctx, dirty);
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(div0, null);
    				} else {
    					if_block1 = null;
    				}
    			}

    			if (!current || dirty[0] & /*dropdownClassName, showList*/ 262656 && div0_class_value !== (div0_class_value = "" + ((/*dropdownClassName*/ ctx[9]
    			? /*dropdownClassName*/ ctx[9]
    			: '') + " autocomplete-list " + (/*showList*/ ctx[18] ? '' : 'hidden') + " is-fullwidth" + " svelte-77usy"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*className, hideArrow, showClear*/ 3080 && div1_class_value !== (div1_class_value = "" + ((/*className*/ ctx[3] ? /*className*/ ctx[3] : '') + " " + (/*hideArrow*/ ctx[10] ? 'hide-arrow is-multiple' : '') + " " + (/*showClear*/ ctx[11] ? 'show-clear' : '') + " autocomplete select is-fullwidth " + /*uniqueId*/ ctx[19] + " svelte-77usy"))) {
    				attr_dev(div1, "class", div1_class_value);
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
    			if (detaching) detach_dev(div1);
    			/*input_1_binding*/ ctx[51](null);
    			if (if_block0) if_block0.d();

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			/*div0_binding*/ ctx[55](null);
    			mounted = false;
    			run_all(dispose);
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

    function safeStringFunction(theFunction, argument) {
    	if (typeof theFunction !== "function") {
    		console.error("Not a function: " + theFunction + ", argument: " + argument);
    	}

    	let originalResult;

    	try {
    		originalResult = theFunction(argument);
    	} catch(error) {
    		console.warn("Error executing Autocomplete function on value: " + argument + " function: " + theFunction);
    	}

    	let result = originalResult;

    	if (result === undefined || result === null) {
    		result = "";
    	}

    	if (typeof result !== "string") {
    		result = result.toString();
    	}

    	return result;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let showList;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SimpleAutocomplete', slots, ['item','no-results']);
    	let { items = [] } = $$props;
    	let { searchFunction = false } = $$props;
    	let { labelFieldName = undefined } = $$props;
    	let { keywordsFieldName = labelFieldName } = $$props;
    	let { valueFieldName = undefined } = $$props;

    	let { labelFunction = function (item) {
    		if (item === undefined || item === null) {
    			return "";
    		}

    		return labelFieldName ? item[labelFieldName] : item;
    	} } = $$props;

    	let { keywordsFunction = function (item) {
    		if (item === undefined || item === null) {
    			return "";
    		}

    		return keywordsFieldName
    		? item[keywordsFieldName]
    		: labelFunction(item);
    	} } = $$props;

    	let { valueFunction = function (item) {
    		if (item === undefined || item === null) {
    			return item;
    		}

    		return valueFieldName ? item[valueFieldName] : item;
    	} } = $$props;

    	let { keywordsCleanFunction = function (keywords) {
    		return keywords;
    	} } = $$props;

    	let { textCleanFunction = function (userEnteredText) {
    		return userEnteredText;
    	} } = $$props;

    	let { beforeChange = function (oldSelectedItem, newSelectedItem) {
    		return true;
    	} } = $$props;

    	let { onChange = function (newSelectedItem) {
    		
    	} } = $$props;

    	let { selectFirstIfEmpty = false } = $$props;
    	let { minCharactersToSearch = 1 } = $$props;
    	let { maxItemsToShowInList = 0 } = $$props;
    	let { delay = 0 } = $$props;
    	let { localFiltering = true } = $$props;
    	let { noResultsText = "No results found" } = $$props;
    	let { placeholder = undefined } = $$props;
    	let { className = undefined } = $$props;
    	let { inputClassName = undefined } = $$props;
    	let { inputId = undefined } = $$props;
    	let { name = undefined } = $$props;
    	let { title = undefined } = $$props;
    	let { html5autocomplete = undefined } = $$props;
    	let { dropdownClassName = undefined } = $$props;
    	let { hideArrow = false } = $$props;
    	let { showClear = false } = $$props;
    	let { disabled = false } = $$props;
    	let { debug = false } = $$props;
    	let { selectedItem = undefined } = $$props;
    	let { value = undefined } = $$props;

    	// --- Internal State ----
    	const uniqueId = "sautocomplete-" + Math.floor(Math.random() * 1000);

    	// HTML elements
    	let input;

    	let list;

    	// UI state
    	let opened = false;

    	let highlightIndex = -1;
    	let text;
    	let filteredTextLength = 0;

    	// view model
    	let filteredListItems;

    	let listItems = [];

    	// other state
    	let inputDelayTimeout;

    	// -- Reactivity --
    	function onSelectedItemChanged() {
    		$$invalidate(30, value = valueFunction(selectedItem));
    		$$invalidate(16, text = safeLabelFunction(selectedItem));
    		onChange(selectedItem);
    	}

    	function safeLabelFunction(item) {
    		// console.log("labelFunction: " + labelFunction);
    		// console.log("safeLabelFunction, item: " + item);
    		return safeStringFunction(labelFunction, item);
    	}

    	function safeKeywordsFunction(item) {
    		// console.log("safeKeywordsFunction");
    		const keywords = safeStringFunction(keywordsFunction, item);

    		let result = safeStringFunction(keywordsCleanFunction, keywords);
    		result = result.toLowerCase().trim();

    		if (debug) {
    			console.log("Extracted keywords: '" + result + "' from item: " + JSON.stringify(item));
    		}

    		return result;
    	}

    	function prepareListItems() {
    		let tStart;

    		if (debug) {
    			tStart = performance.now();
    			console.log("prepare items to search");
    			console.log("items: " + JSON.stringify(items));
    		}

    		if (!Array.isArray(items)) {
    			console.warn("Autocomplete items / search function did not return array but", items);
    			$$invalidate(28, items = []);
    		}

    		const length = items ? items.length : 0;
    		listItems = new Array(length);

    		if (length > 0) {
    			items.forEach((item, i) => {
    				const listItem = getListItem(item);

    				if (listItem == undefined) {
    					console.log("Undefined item for: ", item);
    				}

    				listItems[i] = listItem;
    			});
    		}

    		if (debug) {
    			const tEnd = performance.now();
    			console.log(listItems.length + " items to search prepared in " + (tEnd - tStart) + " milliseconds");
    		}
    	}

    	function getListItem(item) {
    		return {
    			// keywords representation of the item
    			keywords: safeKeywordsFunction(item),
    			// item label
    			label: safeLabelFunction(item),
    			// store reference to the origial item
    			item
    		};
    	}

    	function prepareUserEnteredText(userEnteredText) {
    		if (userEnteredText === undefined || userEnteredText === null) {
    			return "";
    		}

    		const textFiltered = userEnteredText.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, " ").trim();
    		$$invalidate(48, filteredTextLength = textFiltered.length);

    		if (minCharactersToSearch > 1) {
    			if (filteredTextLength < minCharactersToSearch) {
    				return "";
    			}
    		}

    		const cleanUserEnteredText = textCleanFunction(textFiltered);
    		const textFilteredLowerCase = cleanUserEnteredText.toLowerCase().trim();

    		if (debug) {
    			console.log("Change user entered text '" + userEnteredText + "' into '" + textFilteredLowerCase + "'");
    		}

    		return textFilteredLowerCase;
    	}

    	async function search() {
    		let tStart;

    		if (debug) {
    			tStart = performance.now();
    			console.log("Searching user entered text: '" + text + "'");
    		}

    		const textFiltered = prepareUserEnteredText(text);

    		if (textFiltered === "") {
    			$$invalidate(17, filteredListItems = listItems);
    			closeIfMinCharsToSearchReached();

    			if (debug) {
    				console.log("User entered text is empty set the list of items to all items");
    			}

    			return;
    		}

    		// external search which provides items
    		if (searchFunction) {
    			$$invalidate(28, items = await searchFunction(textFiltered));
    			prepareListItems();
    		}

    		// local search
    		let tempfilteredListItems;

    		if (localFiltering) {
    			const searchWords = textFiltered.split(" ");

    			tempfilteredListItems = listItems.filter(listItem => {
    				if (!listItem) {
    					return false;
    				}

    				const itemKeywords = listItem.keywords;
    				let matches = 0;

    				searchWords.forEach(searchWord => {
    					if (itemKeywords.includes(searchWord)) {
    						matches++;
    					}
    				});

    				return matches >= searchWords.length;
    			});
    		} else {
    			tempfilteredListItems = listItems;
    		}

    		const hlfilter = highlightFilter(textFiltered, ["label"]);
    		const filteredListItemsHighlighted = tempfilteredListItems.map(hlfilter);
    		$$invalidate(17, filteredListItems = filteredListItemsHighlighted);
    		closeIfMinCharsToSearchReached();

    		if (debug) {
    			const tEnd = performance.now();
    			console.log("Search took " + (tEnd - tStart) + " milliseconds, found " + filteredListItems.length + " items");
    		}
    	}

    	// $: text, search();
    	function selectListItem(listItem) {
    		if (debug) {
    			console.log("selectListItem");
    		}

    		if ("undefined" === typeof listItem) {
    			if (debug) {
    				console.log(`listItem ${i} is undefined. Can not select.`);
    			}

    			return false;
    		}

    		const newSelectedItem = listItem.item;

    		if (beforeChange(selectedItem, newSelectedItem)) {
    			$$invalidate(29, selectedItem = newSelectedItem);
    		}

    		return true;
    	}

    	function selectItem() {
    		if (debug) {
    			console.log("selectItem");
    		}

    		const listItem = filteredListItems[highlightIndex];

    		if (selectListItem(listItem)) {
    			close();
    		}
    	}

    	function up() {
    		if (debug) {
    			console.log("up");
    		}

    		open();
    		if (highlightIndex > 0) $$invalidate(15, highlightIndex--, highlightIndex);
    		highlight();
    	}

    	function down() {
    		if (debug) {
    			console.log("down");
    		}

    		open();
    		if (highlightIndex < filteredListItems.length - 1) $$invalidate(15, highlightIndex++, highlightIndex);
    		highlight();
    	}

    	function highlight() {
    		if (debug) {
    			console.log("highlight");
    		}

    		const query = ".selected";

    		if (debug) {
    			console.log("Seaching DOM element: " + query + " in " + list);
    		}

    		const el = list && list.querySelector(query);

    		if (el) {
    			if (typeof el.scrollIntoViewIfNeeded === "function") {
    				if (debug) {
    					console.log("Scrolling selected item into view");
    				}

    				el.scrollIntoViewIfNeeded();
    			} else {
    				if (debug) {
    					console.warn("Could not scroll selected item into view, scrollIntoViewIfNeeded not supported");
    				}
    			}
    		} else {
    			if (debug) {
    				console.warn("Selected item not found to scroll into view");
    			}
    		}
    	}

    	function onListItemClick(listItem) {
    		if (debug) {
    			console.log("onListItemClick");
    		}

    		if (selectListItem(listItem)) {
    			close();
    		}
    	}

    	function onDocumentClick(e) {
    		if (debug) {
    			console.log("onDocumentClick: " + JSON.stringify(e.target));
    		}

    		if (e.target.closest("." + uniqueId)) {
    			if (debug) {
    				console.log("onDocumentClick inside");
    			}

    			// resetListToAllItemsAndOpen();
    			highlight();
    		} else {
    			if (debug) {
    				console.log("onDocumentClick outside");
    			}

    			close();
    		}
    	}

    	function onKeyDown(e) {
    		if (debug) {
    			console.log("onKeyDown");
    		}

    		let key = e.key;
    		if (key === "Tab" && e.shiftKey) key = "ShiftTab";

    		const fnmap = {
    			Tab: opened ? down.bind(this) : null,
    			ShiftTab: opened ? up.bind(this) : null,
    			ArrowDown: down.bind(this),
    			ArrowUp: up.bind(this),
    			Escape: onEsc.bind(this)
    		};

    		const fn = fnmap[key];

    		if (typeof fn === "function") {
    			e.preventDefault();
    			fn(e);
    		}
    	}

    	function onKeyPress(e) {
    		if (debug) {
    			console.log("onKeyPress");
    		}

    		if (e.key === "Enter") {
    			e.preventDefault();
    			selectItem();
    		}
    	}

    	function onInput(e) {
    		if (debug) {
    			console.log("onInput");
    		}

    		$$invalidate(16, text = e.target.value);

    		if (inputDelayTimeout) {
    			clearTimeout(inputDelayTimeout);
    		}

    		if (delay) {
    			inputDelayTimeout = setTimeout(processInput, delay);
    		} else {
    			processInput();
    		}
    	}

    	function processInput() {
    		search();
    		$$invalidate(15, highlightIndex = 0);
    		open();
    	}

    	function onInputClick() {
    		if (debug) {
    			console.log("onInputClick");
    		}

    		resetListToAllItemsAndOpen();
    	}

    	function onEsc(e) {
    		if (debug) {
    			console.log("onEsc");
    		}

    		//if (text) return clear();
    		e.stopPropagation();

    		if (opened) {
    			input.focus();
    			close();
    		}
    	}

    	function onFocus() {
    		if (debug) {
    			console.log("onFocus");
    		}

    		resetListToAllItemsAndOpen();
    	}

    	function resetListToAllItemsAndOpen() {
    		if (debug) {
    			console.log("resetListToAllItemsAndOpen");
    		}

    		$$invalidate(17, filteredListItems = listItems);
    		open();

    		// find selected item
    		if (selectedItem) {
    			if (debug) {
    				console.log("Searching currently selected item: " + JSON.stringify(selectedItem));
    			}

    			for (let i = 0; i < listItems.length; i++) {
    				const listItem = listItems[i];

    				if ("undefined" === typeof listItem) {
    					if (debug) {
    						console.log(`listItem ${i} is undefined. Skipping.`);
    					}

    					continue;
    				}

    				if (debug) {
    					console.log("Item " + i + ": " + JSON.stringify(listItem));
    				}

    				if (selectedItem == listItem.item) {
    					$$invalidate(15, highlightIndex = i);

    					if (debug) {
    						console.log("Found selected item: " + i + ": " + JSON.stringify(listItem));
    					}

    					highlight();
    					break;
    				}
    			}
    		}
    	}

    	function open() {
    		if (debug) {
    			console.log("open");
    		}

    		// check if the search text has more than the min chars required
    		if (isMinCharsToSearchReached()) {
    			return;
    		}

    		$$invalidate(47, opened = true);
    	}

    	function close() {
    		if (debug) {
    			console.log("close");
    		}

    		$$invalidate(47, opened = false);

    		if (!text && selectFirstIfEmpty) {
    			highlightFilter = 0;
    			selectItem();
    		}
    	}

    	function isMinCharsToSearchReached() {
    		return minCharactersToSearch > 1 && filteredTextLength < minCharactersToSearch;
    	}

    	function closeIfMinCharsToSearchReached() {
    		if (isMinCharsToSearchReached()) {
    			close();
    		}
    	}

    	function clear() {
    		if (debug) {
    			console.log("clear");
    		}

    		$$invalidate(16, text = "");
    		$$invalidate(29, selectedItem = undefined);

    		setTimeout(() => {
    			input.focus();
    			close();
    		});
    	}

    	function onBlur() {
    		if (debug) {
    			console.log("onBlur");
    		}

    		close();
    	}

    	// 'item number one'.replace(/(it)(.*)(nu)(.*)(one)/ig, '<b>$1</b>$2 <b>$3</b>$4 <b>$5</b>')
    	function highlightFilter(q, fields) {
    		const qs = "(" + q.trim().replace(/\s/g, ")(.*)(") + ")";
    		const reg = new RegExp(qs, "ig");
    		let n = 1;
    		const len = qs.split(")(").length + 1;
    		let repl = "";
    		for (; n < len; n++) repl += n % 2 ? `<b>$${n}</b>` : `$${n}`;

    		return i => {
    			const newI = Object.assign({ highlighted: {} }, i);

    			if (fields) {
    				fields.forEach(f => {
    					if (!newI[f]) return;
    					newI.highlighted[f] = newI[f].replace(reg, repl);
    				});
    			}

    			return newI;
    		};
    	}

    	const writable_props = [
    		'items',
    		'searchFunction',
    		'labelFieldName',
    		'keywordsFieldName',
    		'valueFieldName',
    		'labelFunction',
    		'keywordsFunction',
    		'valueFunction',
    		'keywordsCleanFunction',
    		'textCleanFunction',
    		'beforeChange',
    		'onChange',
    		'selectFirstIfEmpty',
    		'minCharactersToSearch',
    		'maxItemsToShowInList',
    		'delay',
    		'localFiltering',
    		'noResultsText',
    		'placeholder',
    		'className',
    		'inputClassName',
    		'inputId',
    		'name',
    		'title',
    		'html5autocomplete',
    		'dropdownClassName',
    		'hideArrow',
    		'showClear',
    		'disabled',
    		'debug',
    		'selectedItem',
    		'value'
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<SimpleAutocomplete> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(13, input);
    		});
    	}

    	function input_1_input_handler() {
    		text = this.value;
    		$$invalidate(16, text);
    	}

    	const click_handler = listItem => onListItemClick(listItem);

    	const pointerenter_handler = i => {
    		$$invalidate(15, highlightIndex = i);
    	};

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			list = $$value;
    			$$invalidate(14, list);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(28, items = $$props.items);
    		if ('searchFunction' in $$props) $$invalidate(31, searchFunction = $$props.searchFunction);
    		if ('labelFieldName' in $$props) $$invalidate(32, labelFieldName = $$props.labelFieldName);
    		if ('keywordsFieldName' in $$props) $$invalidate(33, keywordsFieldName = $$props.keywordsFieldName);
    		if ('valueFieldName' in $$props) $$invalidate(34, valueFieldName = $$props.valueFieldName);
    		if ('labelFunction' in $$props) $$invalidate(35, labelFunction = $$props.labelFunction);
    		if ('keywordsFunction' in $$props) $$invalidate(36, keywordsFunction = $$props.keywordsFunction);
    		if ('valueFunction' in $$props) $$invalidate(37, valueFunction = $$props.valueFunction);
    		if ('keywordsCleanFunction' in $$props) $$invalidate(38, keywordsCleanFunction = $$props.keywordsCleanFunction);
    		if ('textCleanFunction' in $$props) $$invalidate(39, textCleanFunction = $$props.textCleanFunction);
    		if ('beforeChange' in $$props) $$invalidate(40, beforeChange = $$props.beforeChange);
    		if ('onChange' in $$props) $$invalidate(41, onChange = $$props.onChange);
    		if ('selectFirstIfEmpty' in $$props) $$invalidate(42, selectFirstIfEmpty = $$props.selectFirstIfEmpty);
    		if ('minCharactersToSearch' in $$props) $$invalidate(43, minCharactersToSearch = $$props.minCharactersToSearch);
    		if ('maxItemsToShowInList' in $$props) $$invalidate(0, maxItemsToShowInList = $$props.maxItemsToShowInList);
    		if ('delay' in $$props) $$invalidate(44, delay = $$props.delay);
    		if ('localFiltering' in $$props) $$invalidate(45, localFiltering = $$props.localFiltering);
    		if ('noResultsText' in $$props) $$invalidate(1, noResultsText = $$props.noResultsText);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('className' in $$props) $$invalidate(3, className = $$props.className);
    		if ('inputClassName' in $$props) $$invalidate(4, inputClassName = $$props.inputClassName);
    		if ('inputId' in $$props) $$invalidate(5, inputId = $$props.inputId);
    		if ('name' in $$props) $$invalidate(6, name = $$props.name);
    		if ('title' in $$props) $$invalidate(7, title = $$props.title);
    		if ('html5autocomplete' in $$props) $$invalidate(8, html5autocomplete = $$props.html5autocomplete);
    		if ('dropdownClassName' in $$props) $$invalidate(9, dropdownClassName = $$props.dropdownClassName);
    		if ('hideArrow' in $$props) $$invalidate(10, hideArrow = $$props.hideArrow);
    		if ('showClear' in $$props) $$invalidate(11, showClear = $$props.showClear);
    		if ('disabled' in $$props) $$invalidate(12, disabled = $$props.disabled);
    		if ('debug' in $$props) $$invalidate(46, debug = $$props.debug);
    		if ('selectedItem' in $$props) $$invalidate(29, selectedItem = $$props.selectedItem);
    		if ('value' in $$props) $$invalidate(30, value = $$props.value);
    		if ('$$scope' in $$props) $$invalidate(49, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		items,
    		searchFunction,
    		labelFieldName,
    		keywordsFieldName,
    		valueFieldName,
    		labelFunction,
    		keywordsFunction,
    		valueFunction,
    		keywordsCleanFunction,
    		textCleanFunction,
    		beforeChange,
    		onChange,
    		selectFirstIfEmpty,
    		minCharactersToSearch,
    		maxItemsToShowInList,
    		delay,
    		localFiltering,
    		noResultsText,
    		placeholder,
    		className,
    		inputClassName,
    		inputId,
    		name,
    		title,
    		html5autocomplete,
    		dropdownClassName,
    		hideArrow,
    		showClear,
    		disabled,
    		debug,
    		selectedItem,
    		value,
    		uniqueId,
    		input,
    		list,
    		opened,
    		highlightIndex,
    		text,
    		filteredTextLength,
    		filteredListItems,
    		listItems,
    		inputDelayTimeout,
    		onSelectedItemChanged,
    		safeStringFunction,
    		safeLabelFunction,
    		safeKeywordsFunction,
    		prepareListItems,
    		getListItem,
    		prepareUserEnteredText,
    		search,
    		selectListItem,
    		selectItem,
    		up,
    		down,
    		highlight,
    		onListItemClick,
    		onDocumentClick,
    		onKeyDown,
    		onKeyPress,
    		onInput,
    		processInput,
    		onInputClick,
    		onEsc,
    		onFocus,
    		resetListToAllItemsAndOpen,
    		open,
    		close,
    		isMinCharsToSearchReached,
    		closeIfMinCharsToSearchReached,
    		clear,
    		onBlur,
    		highlightFilter,
    		showList
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(28, items = $$props.items);
    		if ('searchFunction' in $$props) $$invalidate(31, searchFunction = $$props.searchFunction);
    		if ('labelFieldName' in $$props) $$invalidate(32, labelFieldName = $$props.labelFieldName);
    		if ('keywordsFieldName' in $$props) $$invalidate(33, keywordsFieldName = $$props.keywordsFieldName);
    		if ('valueFieldName' in $$props) $$invalidate(34, valueFieldName = $$props.valueFieldName);
    		if ('labelFunction' in $$props) $$invalidate(35, labelFunction = $$props.labelFunction);
    		if ('keywordsFunction' in $$props) $$invalidate(36, keywordsFunction = $$props.keywordsFunction);
    		if ('valueFunction' in $$props) $$invalidate(37, valueFunction = $$props.valueFunction);
    		if ('keywordsCleanFunction' in $$props) $$invalidate(38, keywordsCleanFunction = $$props.keywordsCleanFunction);
    		if ('textCleanFunction' in $$props) $$invalidate(39, textCleanFunction = $$props.textCleanFunction);
    		if ('beforeChange' in $$props) $$invalidate(40, beforeChange = $$props.beforeChange);
    		if ('onChange' in $$props) $$invalidate(41, onChange = $$props.onChange);
    		if ('selectFirstIfEmpty' in $$props) $$invalidate(42, selectFirstIfEmpty = $$props.selectFirstIfEmpty);
    		if ('minCharactersToSearch' in $$props) $$invalidate(43, minCharactersToSearch = $$props.minCharactersToSearch);
    		if ('maxItemsToShowInList' in $$props) $$invalidate(0, maxItemsToShowInList = $$props.maxItemsToShowInList);
    		if ('delay' in $$props) $$invalidate(44, delay = $$props.delay);
    		if ('localFiltering' in $$props) $$invalidate(45, localFiltering = $$props.localFiltering);
    		if ('noResultsText' in $$props) $$invalidate(1, noResultsText = $$props.noResultsText);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('className' in $$props) $$invalidate(3, className = $$props.className);
    		if ('inputClassName' in $$props) $$invalidate(4, inputClassName = $$props.inputClassName);
    		if ('inputId' in $$props) $$invalidate(5, inputId = $$props.inputId);
    		if ('name' in $$props) $$invalidate(6, name = $$props.name);
    		if ('title' in $$props) $$invalidate(7, title = $$props.title);
    		if ('html5autocomplete' in $$props) $$invalidate(8, html5autocomplete = $$props.html5autocomplete);
    		if ('dropdownClassName' in $$props) $$invalidate(9, dropdownClassName = $$props.dropdownClassName);
    		if ('hideArrow' in $$props) $$invalidate(10, hideArrow = $$props.hideArrow);
    		if ('showClear' in $$props) $$invalidate(11, showClear = $$props.showClear);
    		if ('disabled' in $$props) $$invalidate(12, disabled = $$props.disabled);
    		if ('debug' in $$props) $$invalidate(46, debug = $$props.debug);
    		if ('selectedItem' in $$props) $$invalidate(29, selectedItem = $$props.selectedItem);
    		if ('value' in $$props) $$invalidate(30, value = $$props.value);
    		if ('input' in $$props) $$invalidate(13, input = $$props.input);
    		if ('list' in $$props) $$invalidate(14, list = $$props.list);
    		if ('opened' in $$props) $$invalidate(47, opened = $$props.opened);
    		if ('highlightIndex' in $$props) $$invalidate(15, highlightIndex = $$props.highlightIndex);
    		if ('text' in $$props) $$invalidate(16, text = $$props.text);
    		if ('filteredTextLength' in $$props) $$invalidate(48, filteredTextLength = $$props.filteredTextLength);
    		if ('filteredListItems' in $$props) $$invalidate(17, filteredListItems = $$props.filteredListItems);
    		if ('listItems' in $$props) listItems = $$props.listItems;
    		if ('inputDelayTimeout' in $$props) inputDelayTimeout = $$props.inputDelayTimeout;
    		if ('showList' in $$props) $$invalidate(18, showList = $$props.showList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*selectedItem*/ 536870912) {
    			 (onSelectedItemChanged());
    		}

    		if ($$self.$$.dirty[0] & /*items*/ 268435456 | $$self.$$.dirty[1] & /*opened, filteredTextLength*/ 196608) {
    			 $$invalidate(18, showList = opened && (items && items.length > 0 || filteredTextLength > 0));
    		}

    		if ($$self.$$.dirty[0] & /*items*/ 268435456) {
    			 (prepareListItems());
    		}
    	};

    	return [
    		maxItemsToShowInList,
    		noResultsText,
    		placeholder,
    		className,
    		inputClassName,
    		inputId,
    		name,
    		title,
    		html5autocomplete,
    		dropdownClassName,
    		hideArrow,
    		showClear,
    		disabled,
    		input,
    		list,
    		highlightIndex,
    		text,
    		filteredListItems,
    		showList,
    		uniqueId,
    		onListItemClick,
    		onDocumentClick,
    		onKeyDown,
    		onKeyPress,
    		onInput,
    		onInputClick,
    		onFocus,
    		clear,
    		items,
    		selectedItem,
    		value,
    		searchFunction,
    		labelFieldName,
    		keywordsFieldName,
    		valueFieldName,
    		labelFunction,
    		keywordsFunction,
    		valueFunction,
    		keywordsCleanFunction,
    		textCleanFunction,
    		beforeChange,
    		onChange,
    		selectFirstIfEmpty,
    		minCharactersToSearch,
    		delay,
    		localFiltering,
    		debug,
    		opened,
    		filteredTextLength,
    		$$scope,
    		slots,
    		input_1_binding,
    		input_1_input_handler,
    		click_handler,
    		pointerenter_handler,
    		div0_binding
    	];
    }

    class SimpleAutocomplete extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$3,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				items: 28,
    				searchFunction: 31,
    				labelFieldName: 32,
    				keywordsFieldName: 33,
    				valueFieldName: 34,
    				labelFunction: 35,
    				keywordsFunction: 36,
    				valueFunction: 37,
    				keywordsCleanFunction: 38,
    				textCleanFunction: 39,
    				beforeChange: 40,
    				onChange: 41,
    				selectFirstIfEmpty: 42,
    				minCharactersToSearch: 43,
    				maxItemsToShowInList: 0,
    				delay: 44,
    				localFiltering: 45,
    				noResultsText: 1,
    				placeholder: 2,
    				className: 3,
    				inputClassName: 4,
    				inputId: 5,
    				name: 6,
    				title: 7,
    				html5autocomplete: 8,
    				dropdownClassName: 9,
    				hideArrow: 10,
    				showClear: 11,
    				disabled: 12,
    				debug: 46,
    				selectedItem: 29,
    				value: 30
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SimpleAutocomplete",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get items() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFieldName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFieldName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keywordsFieldName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keywordsFieldName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueFieldName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueFieldName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keywordsFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keywordsFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keywordsCleanFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keywordsCleanFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textCleanFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textCleanFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get beforeChange() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set beforeChange(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onChange() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onChange(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectFirstIfEmpty() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectFirstIfEmpty(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minCharactersToSearch() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minCharactersToSearch(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxItemsToShowInList() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxItemsToShowInList(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get delay() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set delay(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get localFiltering() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set localFiltering(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noResultsText() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noResultsText(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputClassName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputClassName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputId() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputId(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get html5autocomplete() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set html5autocomplete(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dropdownClassName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dropdownClassName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideArrow() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideArrow(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showClear() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showClear(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get debug() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set debug(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedItem() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedItem(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/HomeComponent.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1$2, console: console_1$2 } = globals;

    const file$2 = "src/components/HomeComponent.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[73] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[76] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[79] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[82] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[85] = list[i];
    	return child_ctx;
    }

    // (513:0) {:else}
    function create_else_block$2(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*$userInfo*/ ctx[15]["nickname"] && create_if_block_7(ctx);
    	let if_block1 = /*viewingRecipes*/ ctx[7] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*$userInfo*/ ctx[15]["nickname"]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*viewingRecipes*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(513:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (511:0) {#if loading}
    function create_if_block$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Loading...";
    			add_location(h1, file$2, 511, 0, 17263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(511:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (530:0) {#if $userInfo["nickname"]}
    function create_if_block_7(ctx) {
    	let ul;
    	let li0;
    	let a0;
    	let link_action;
    	let t1;
    	let li1;
    	let a1;
    	let link_action_1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Cook Food";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Open Grocery List";
    			attr_dev(a0, "href", "/food");
    			attr_dev(a0, "class", "btn btn-lg btn-outline-success");
    			add_location(a0, file$2, 532, 4, 17805);
    			attr_dev(li0, "class", "nav-item col-md-6");
    			add_location(li0, file$2, 531, 2, 17770);
    			attr_dev(a1, "href", "/grocerylist");
    			attr_dev(a1, "class", "btn btn-lg btn-light");
    			add_location(a1, file$2, 535, 4, 17928);
    			attr_dev(li1, "class", "nav-item col-sm-6");
    			add_location(li1, file$2, 534, 2, 17893);
    			attr_dev(ul, "class", "nav nav-pills nav-fill");
    			add_location(ul, file$2, 530, 0, 17732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link_action = link.call(null, a0)),
    					action_destroyer(link_action_1 = link.call(null, a1))
    				];

    				mounted = true;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(530:0) {#if $userInfo[\\\"nickname\\\"]}",
    		ctx
    	});

    	return block;
    }

    // (558:0) {#if viewingRecipes}
    function create_if_block_1$1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let hr;
    	let if_block0 = /*viewingCommunityRecipes*/ ctx[10] && create_if_block_5$1(ctx);
    	let if_block1 = /*viewingCommunityRecipe*/ ctx[9] && create_if_block_4$1(ctx);
    	let if_block2 = /*enteringInventory*/ ctx[13] && create_if_block_3$1(ctx);
    	let if_block3 = /*viewingIngredients*/ ctx[12] && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			hr = element("hr");
    			add_location(hr, file$2, 673, 0, 23126);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, hr, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*viewingCommunityRecipes*/ ctx[10]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*viewingCommunityRecipe*/ ctx[9]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4$1(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*enteringInventory*/ ctx[13]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$1(ctx);
    					if_block2.c();
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*viewingIngredients*/ ctx[12]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2$1(ctx);
    					if_block3.c();
    					if_block3.m(t3.parentNode, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(558:0) {#if viewingRecipes}",
    		ctx
    	});

    	return block;
    }

    // (587:0) {#if viewingCommunityRecipes}
    function create_if_block_5$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (!/*viewingFilteredCommunityRecipes*/ ctx[11]) return create_if_block_6$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
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
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(587:0) {#if viewingCommunityRecipes}",
    		ctx
    	});

    	return block;
    }

    // (590:0) {:else}
    function create_else_block_1(ctx) {
    	let ul;
    	let t0;
    	let button;
    	let img;
    	let img_src_value;
    	let t1;
    	let mounted;
    	let dispose;
    	let each_value_4 = Object.keys(/*filteredCommunityRecipes*/ ctx[6]);
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			button = element("button");
    			img = element("img");
    			t1 = text(" Back");
    			attr_dev(ul, "class", "list-group");
    			add_location(ul, file$2, 590, 0, 19866);
    			attr_dev(img, "class", "icon");
    			attr_dev(img, "alt", "back");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/chevron-left.svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$2, 598, 81, 20466);
    			attr_dev(button, "class", "btn btn-md btn-secondary");
    			add_location(button, file$2, 598, 0, 20385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[51], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterCommunityRecipes, filteredCommunityRecipes*/ 131136) {
    				each_value_4 = Object.keys(/*filteredCommunityRecipes*/ ctx[6]);
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(590:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (588:0) {#if !viewingFilteredCommunityRecipes}
    function create_if_block_6$1(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(588:0) {#if !viewingFilteredCommunityRecipes}",
    		ctx
    	});

    	return block;
    }

    // (592:2) {#each Object.keys(filteredCommunityRecipes) as fcr}
    function create_each_block_4(ctx) {
    	let li;
    	let t0_value = Object.keys(/*filteredCommunityRecipes*/ ctx[6][/*fcr*/ ctx[85]])[0] + "";
    	let t0;
    	let t1;
    	let span;
    	let t2_value = /*filteredCommunityRecipes*/ ctx[6][/*fcr*/ ctx[85]][Object.keys(/*filteredCommunityRecipes*/ ctx[6][/*fcr*/ ctx[85]])[0]]["count"] + "";
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[50](/*fcr*/ ctx[85]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(span, "class", "badge badge-primary badge-pill");
    			add_location(span, file$2, 594, 6, 20219);
    			attr_dev(li, "class", "list-group-item d-flex justify-content-between align-items-center");
    			add_location(li, file$2, 592, 4, 19949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, span);
    			append_dev(span, t2);
    			append_dev(li, t3);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*filteredCommunityRecipes*/ 64 && t0_value !== (t0_value = Object.keys(/*filteredCommunityRecipes*/ ctx[6][/*fcr*/ ctx[85]])[0] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*filteredCommunityRecipes*/ 64 && t2_value !== (t2_value = /*filteredCommunityRecipes*/ ctx[6][/*fcr*/ ctx[85]][Object.keys(/*filteredCommunityRecipes*/ ctx[6][/*fcr*/ ctx[85]])[0]]["count"] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(592:2) {#each Object.keys(filteredCommunityRecipes) as fcr}",
    		ctx
    	});

    	return block;
    }

    // (603:0) {#if viewingCommunityRecipe}
    function create_if_block_4$1(ctx) {
    	let h2;
    	let t0_value = /*communityRecipe*/ ctx[8].Recipe + "";
    	let t0;
    	let t1;
    	let ul;
    	let t2;
    	let button;
    	let img;
    	let img_src_value;
    	let t3;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*communityRecipe*/ ctx[8].Directions.split(".");
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			button = element("button");
    			img = element("img");
    			t3 = text(" Back");
    			add_location(h2, file$2, 604, 2, 20602);
    			attr_dev(ul, "class", "list-group");
    			add_location(ul, file$2, 605, 2, 20638);
    			attr_dev(img, "class", "icon");
    			attr_dev(img, "alt", "back");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/chevron-left.svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$2, 610, 81, 20859);
    			attr_dev(button, "class", "btn btn-md btn-secondary");
    			add_location(button, file$2, 610, 0, 20778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[52], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*communityRecipe*/ 256 && t0_value !== (t0_value = /*communityRecipe*/ ctx[8].Recipe + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*communityRecipe*/ 256) {
    				each_value_3 = /*communityRecipe*/ ctx[8].Directions.split(".");
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(603:0) {#if viewingCommunityRecipe}",
    		ctx
    	});

    	return block;
    }

    // (607:2) {#each communityRecipe.Directions.split(".") as dir}
    function create_each_block_3(ctx) {
    	let li;
    	let t_value = /*dir*/ ctx[82] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-group-item");
    			add_location(li, file$2, 607, 4, 20721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*communityRecipe*/ 256 && t_value !== (t_value = /*dir*/ ctx[82] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(607:2) {#each communityRecipe.Directions.split(\\\".\\\") as dir}",
    		ctx
    	});

    	return block;
    }

    // (615:0) {#if enteringInventory}
    function create_if_block_3$1(ctx) {
    	let p;
    	let button0;
    	let span;
    	let t2;
    	let t3;
    	let form;
    	let table;
    	let legend;
    	let t5;
    	let tr;
    	let td0;
    	let select0;
    	let t6;
    	let td1;
    	let t7;
    	let select1;
    	let select1_onchange_value;
    	let t8;
    	let td2;
    	let t9;
    	let input;
    	let t10;
    	let td3;
    	let t11;
    	let strong;
    	let t12;
    	let t13;
    	let t14;
    	let td4;
    	let button1;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*locations*/ ctx[14];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*possible_ingredients*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			button0 = element("button");
    			button0.textContent = "Input Your Inventory";
    			span = element("span");
    			span.textContent = "Missing";
    			t2 = text(" You must enter your current food inventory to get started.");
    			t3 = space();
    			form = element("form");
    			table = element("table");
    			legend = element("legend");
    			legend.textContent = "Update Your Inventory";
    			t5 = space();
    			tr = element("tr");
    			td0 = element("td");
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t6 = space();
    			td1 = element("td");
    			t7 = text("Ingredient: \n                ");
    			select1 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			td2 = element("td");
    			t9 = text("Quantity: ");
    			input = element("input");
    			t10 = space();
    			td3 = element("td");
    			t11 = text("(");
    			strong = element("strong");
    			t12 = text(/*quantity_measurement*/ ctx[4]);
    			t13 = text(")");
    			t14 = space();
    			td4 = element("td");
    			button1 = element("button");
    			button1.textContent = "Add";
    			attr_dev(button0, "class", "btn btn-md btn-primary");
    			add_location(button0, file$2, 615, 4, 20986);
    			attr_dev(span, "class", "badge badge-danger");
    			add_location(span, file$2, 615, 108, 21090);
    			add_location(p, file$2, 615, 0, 20982);
    			add_location(legend, file$2, 619, 4, 21272);
    			if (/*selected*/ ctx[2] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[54].call(select0));
    			add_location(select0, file$2, 622, 16, 21353);
    			add_location(td0, file$2, 621, 12, 21332);
    			attr_dev(select1, "id", "Ingredient");
    			attr_dev(select1, "onchange", select1_onchange_value = /*updateQM*/ ctx[21](/*ingredient*/ ctx[1]));
    			if (/*ingredient*/ ctx[1] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[55].call(select1));
    			add_location(select1, file$2, 630, 16, 21689);
    			add_location(td1, file$2, 629, 12, 21656);
    			attr_dev(input, "id", "Quantity");
    			attr_dev(input, "type", "text");
    			add_location(input, file$2, 636, 26, 22014);
    			add_location(td2, file$2, 636, 12, 22000);
    			add_location(strong, file$2, 637, 17, 22094);
    			add_location(td3, file$2, 637, 12, 22089);
    			attr_dev(button1, "class", "btn btn-lg btn-primary");
    			add_location(button1, file$2, 638, 16, 22156);
    			add_location(td4, file$2, 638, 12, 22152);
    			add_location(tr, file$2, 620, 4, 21315);
    			attr_dev(table, "class", "table-responsive");
    			add_location(table, file$2, 618, 0, 21235);
    			add_location(form, file$2, 617, 0, 21202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, button0);
    			append_dev(p, span);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, table);
    			append_dev(table, legend);
    			append_dev(table, t5);
    			append_dev(table, tr);
    			append_dev(tr, td0);
    			append_dev(td0, select0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*selected*/ ctx[2]);
    			append_dev(tr, t6);
    			append_dev(tr, td1);
    			append_dev(td1, t7);
    			append_dev(td1, select1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*ingredient*/ ctx[1]);
    			append_dev(tr, t8);
    			append_dev(tr, td2);
    			append_dev(td2, t9);
    			append_dev(td2, input);
    			set_input_value(input, /*quantity*/ ctx[3]);
    			append_dev(tr, t10);
    			append_dev(tr, td3);
    			append_dev(td3, t11);
    			append_dev(td3, strong);
    			append_dev(strong, t12);
    			append_dev(td3, t13);
    			append_dev(tr, t14);
    			append_dev(tr, td4);
    			append_dev(td4, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_3*/ ctx[53], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[54]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[55]),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[56]),
    					listen_dev(button1, "click", /*click_handler_4*/ ctx[57], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[49]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*locations*/ 16384) {
    				each_value_2 = /*locations*/ ctx[14];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty[0] & /*selected, locations*/ 16388) {
    				select_option(select0, /*selected*/ ctx[2]);
    			}

    			if (dirty[0] & /*possible_ingredients*/ 32) {
    				each_value_1 = /*possible_ingredients*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty[0] & /*ingredient, possible_ingredients*/ 34 && select1_onchange_value !== (select1_onchange_value = /*updateQM*/ ctx[21](/*ingredient*/ ctx[1]))) {
    				attr_dev(select1, "onchange", select1_onchange_value);
    			}

    			if (dirty[0] & /*ingredient, possible_ingredients*/ 34) {
    				select_option(select1, /*ingredient*/ ctx[1]);
    			}

    			if (dirty[0] & /*quantity*/ 8 && input.value !== /*quantity*/ ctx[3]) {
    				set_input_value(input, /*quantity*/ ctx[3]);
    			}

    			if (dirty[0] & /*quantity_measurement*/ 16) set_data_dev(t12, /*quantity_measurement*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(form);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(615:0) {#if enteringInventory}",
    		ctx
    	});

    	return block;
    }

    // (624:20) {#each locations as loc}
    function create_each_block_2(ctx) {
    	let option;
    	let t_value = /*loc*/ ctx[79] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*loc*/ ctx[79];
    			option.value = option.__value;
    			add_location(option, file$2, 624, 24, 21453);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*locations*/ 16384 && t_value !== (t_value = /*loc*/ ctx[79] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*locations*/ 16384 && option_value_value !== (option_value_value = /*loc*/ ctx[79])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(624:20) {#each locations as loc}",
    		ctx
    	});

    	return block;
    }

    // (632:20) {#each possible_ingredients as ing}
    function create_each_block_1(ctx) {
    	let option;
    	let t0_value = /*ing*/ ctx[76].Ingredient + "";
    	let t0;
    	let t1;
    	let t2_value = /*ing*/ ctx[76].Brand + "";
    	let t2;
    	let t3;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = text(" (");
    			t2 = text(t2_value);
    			t3 = text(")");
    			option.__value = option_value_value = /*ing*/ ctx[76].id;
    			option.value = option.__value;
    			add_location(option, file$2, 632, 24, 21850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    			append_dev(option, t2);
    			append_dev(option, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*possible_ingredients*/ 32 && t0_value !== (t0_value = /*ing*/ ctx[76].Ingredient + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*possible_ingredients*/ 32 && t2_value !== (t2_value = /*ing*/ ctx[76].Brand + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*possible_ingredients*/ 32 && option_value_value !== (option_value_value = /*ing*/ ctx[76].id)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(632:20) {#each possible_ingredients as ing}",
    		ctx
    	});

    	return block;
    }

    // (646:0) {#if viewingIngredients }
    function create_if_block_2$1(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let table;
    	let thead;
    	let th;
    	let t3;
    	let tbody;
    	let t4;
    	let p;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*possible_ingredients*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "My Ingredients";
    			t1 = space();
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			th = element("th");
    			th.textContent = "Ingredient";
    			t3 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			p = element("p");
    			button = element("button");
    			button.textContent = "Add ingredients";
    			add_location(h1, file$2, 647, 0, 22371);
    			attr_dev(th, "scope", "col");
    			add_location(th, file$2, 652, 6, 22485);
    			attr_dev(thead, "class", "thead-light");
    			add_location(thead, file$2, 651, 4, 22451);
    			add_location(tbody, file$2, 654, 4, 22534);
    			attr_dev(table, "class", "table");
    			add_location(table, file$2, 650, 2, 22425);
    			attr_dev(div, "id", "ingredientsList");
    			add_location(div, file$2, 649, 0, 22396);
    			attr_dev(button, "class", "btn btn-md btn-secondary");
    			add_location(button, file$2, 670, 3, 23016);
    			add_location(p, file$2, 670, 0, 23013);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, th);
    			append_dev(table, t3);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t4, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_5*/ ctx[58], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*possible_ingredients*/ 32) {
    				each_value = /*possible_ingredients*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(646:0) {#if viewingIngredients }",
    		ctx
    	});

    	return block;
    }

    // (656:6) {#each possible_ingredients as pos}
    function create_each_block$1(ctx) {
    	let tr;
    	let td;
    	let t0_value = /*pos*/ ctx[73].Ingredient + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(td, file$2, 657, 10, 22607);
    			add_location(tr, file$2, 656, 8, 22592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, t0);
    			append_dev(tr, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*possible_ingredients*/ 32 && t0_value !== (t0_value = /*pos*/ ctx[73].Ingredient + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(656:6) {#each possible_ingredients as pos}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[0]) return create_if_block$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let $claims;
    	let $userInfo;
    	validate_store(claims, 'claims');
    	component_subscribe($$self, claims, $$value => $$invalidate(59, $claims = $$value));
    	validate_store(userInfo, 'userInfo');
    	component_subscribe($$self, userInfo, $$value => $$invalidate(15, $userInfo = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HomeComponent', slots, []);
    	let { loading } = $$props;
    	let { hasura_userID } = $$props;
    	let { ingredient, selected, quantity } = $$props;
    	let { quantity_measurement = "Quantity Measurement" } = $$props;
    	let { ingredients } = $$props;
    	let { recipes = [] } = $$props;
    	let { possible_ingredients = [], recipes_count, ingredients_count } = $$props;
    	let { categories = [] } = $$props;
    	let { category } = $$props;
    	let { filteredCommunityRecipes = {} } = $$props;
    	let { viewingRecipes, viewingMyRecipes, communityRecipe, viewingCommunityRecipe, viewingCommunityRecipes, viewingFilteredCommunityRecipes, viewingInventory, viewingIngredients, enteringInventory, enteringRecipe, enteringIngredient } = $$props;
    	let { communityRecipeIngredients, new_recipe_name, new_ingredient_name, new_ingredient_brand, new_recipe_ingredients = [], new_recipe_ingredients_final = [], new_recipe_ingredient_quantity, new_ingredient_measurement, new_recipe_directions_1, new_recipe_ingredient_shareable } = $$props;
    	let { existing_ingredient, enteringRecipeIngredient2, enteringRecipeIngredient3 } = $$props;
    	let { enteringRecipeIngredient = true } = $$props;
    	let { user_level, user_code } = $$props;

    	claims.subscribe(v => {
    		if ($claims) {
    			console.log("claims should be ready!");
    			const c = checkUser();

    			// const res = getCategories();
    			const res2 = getPossibleIngredients();

    			const res3 = getPossibleRecipes();
    			$$invalidate(0, loading = false);
    		}
    	});

    	async function checkUser() {
    		$$invalidate(22, hasura_userID = $userInfo['https://hasura.io/jwt/claims']['x-hasura-user-id']);

    		let q = `
          {
            users(where: {x_hasura_user_id: {_eq: "` + hasura_userID + `"}}) {
              id
              Onboarding_Level
              Onboarding_Code
            }
          }
      `;

    		let temp = await executeGraphql(q, $claims);
    		console.log(temp.data);

    		if (temp.data.users.length == 0) {
    			console.log("new user detected!");

    			q = `
            mutation {
              insert_users_one(object: {x_hasura_user_id: "` + hasura_userID + `", Onboarding_Level: 1, Onboarding_Code: "Apprentice"}) {
                id
              }
            }
            `;

    			temp = await executeGraphql(q, $claims);
    			console.log("new level 1 user created in database!");
    			$$invalidate(38, user_level = 1);
    			$$invalidate(39, user_code = "Apprentice");

    			q = `
            {
              ingredients(where: {Base_Ingredient: {_eq: true}}) {
                id
                Quantity_Measurement
              }
            }
            `;

    			temp = await executeGraphql(q, $claims);
    			let base_ingredients = temp.data.ingredients;

    			for (var i = 0; i < base_ingredients.length; i++) {
    				q = `
              mutation {
                insert_users_ingredients_one(object: {IngredientID: ` + base_ingredients[i].id + `, Quantity_Measurement: "` + base_ingredients[i].Quantity_Measurement + `"}) {
                  id
                }
              }
              `;

    				temp = await executeGraphql(q, $claims);
    			}

    			getPossibleIngredients();
    		} else {
    			$$invalidate(38, user_level = temp.data.users[0].Onboarding_Level);
    			$$invalidate(39, user_code = temp.data.users[0].Onboarding_Code);
    		}
    	}

    	async function viewRecipes() {
    		$$invalidate(7, viewingRecipes = true);
    		$$invalidate(26, viewingInventory = false);
    		$$invalidate(12, viewingIngredients = false);
    	}

    	async function viewMyRecipes() {
    		$$invalidate(25, viewingMyRecipes = true);
    		$$invalidate(27, enteringRecipe = false);
    	}

    	async function viewCommunityRecipes() {
    		$$invalidate(10, viewingCommunityRecipes = true);
    		$$invalidate(11, viewingFilteredCommunityRecipes = false);
    		$$invalidate(25, viewingMyRecipes = false);
    		$$invalidate(27, enteringRecipe = false);
    		$$invalidate(9, viewingCommunityRecipe = false);
    	}

    	async function filterCommunityRecipes(parent_category) {
    		$$invalidate(11, viewingFilteredCommunityRecipes = true);

    		if (["Lunch or Dinner", "Breakfast", "Snacks", "Drinks"].includes(parent_category)) {
    			console.log("he wants to pick a sub category from the main categories");

    			let category_subcategory = {
    				"Lunch or Dinner": [
    					{
    						"American": { "category": "LD_American", "count": 1 }
    					},
    					{
    						"Italian": { "category": "LD_Italian", "count": 1 }
    					},
    					{
    						"Mexican": { "category": "LD_Mexican", "count": 1 }
    					}
    				],
    				"Breakfast": [
    					{
    						"Mexican": { "category": "B_Mexican", "count": 1 }
    					}
    				],
    				"Snacks": [
    					{
    						"American": { "category": "S_American", "count": 1 }
    					},
    					{
    						"Chinese": { "category": "S_Chinese", "count": 1 }
    					}
    				],
    				"Drinks": [
    					{
    						"Smoothies": { "category": "D_Smoothies", "count": 1 }
    					}
    				]
    			};

    			$$invalidate(6, filteredCommunityRecipes = category_subcategory[parent_category]);
    			console.log(filteredCommunityRecipes);

    			for (var i = 0; i < filteredCommunityRecipes.length; i++) {
    				console.log(filteredCommunityRecipes[i]);
    			}
    		} else if ([
    			"LD_American",
    			"LD_Italian",
    			"LD_Mexican",
    			"B_Mexican",
    			"S_American",
    			"S_Chinese",
    			"D_Smoothies"
    		].includes(parent_category)) {
    			console.log("he wants to view a specific community recipe");

    			let subcategory_subcategory = {
    				"LD_American": [
    					{
    						"Fried Fish": { "category": 6, "count": 1 }
    					}
    				],
    				"LD_Italian": [{ "Pizza": { "category": 6, "count": 1 } }],
    				"LD_Mexican": [{ "Burrito": { "category": 4, "count": 1 } }],
    				"B_Mexican": [
    					{
    						"Frittata": { "category": 2, "count": 1 }
    					}
    				],
    				"S_American": [
    					{
    						"French Fries": { "category": 5, "count": 1 }
    					}
    				],
    				"S_Chinese": [
    					{
    						"Green Onion Pancake": { "category": 1, "count": 1 }
    					}
    				],
    				"D_Smoothies": [
    					{
    						"Vegetable Smoothie": { "category": 3, "count": 1 }
    					}
    				]
    			};

    			$$invalidate(6, filteredCommunityRecipes = subcategory_subcategory[parent_category]);
    		} else {
    			console.log("users wants to view a community recipe!");
    			console.log(parent_category);

    			let q = `
                {
                  users_recipes_by_pk(id: ` + parent_category + `) {
                    recipes {
                      Directions
                      Recipe
                    }
                  }
                }
                `;

    			let temp = await executeGraphql(q, $claims);
    			$$invalidate(11, viewingFilteredCommunityRecipes = false);
    			$$invalidate(9, viewingCommunityRecipe = true);
    			$$invalidate(10, viewingCommunityRecipes = false);
    			$$invalidate(8, communityRecipe = temp.data.users_recipes_by_pk.recipes);

    			q = `
            {
              ingredients_recipes(where: {UserRecipeID: {_eq: ` + parent_category + `}}) {
                Quantity
                Quantity_Measurement
                user_ingredients {
                  ingredients {
                    Ingredient
                  }
                }
              }
            }
        `;

    			temp = await executeGraphql(q, $claims);
    			$$invalidate(29, communityRecipeIngredients = temp.data.ingredients_recipes);
    			console.log(communityRecipeIngredients);
    		}

    		console.log("filtered!");
    	}

    	async function viewIngredients() {
    		$$invalidate(12, viewingIngredients = true);
    		$$invalidate(7, viewingRecipes = false);
    		$$invalidate(26, viewingInventory = false);
    	}

    	async function getPossibleIngredients() {
    		let q = `
                {
                  ingredients(order_by: {Ingredient: asc}) {
                    id
                    Brand
                    Ingredient
                    Quantity_Measurement
                  }
                }
                `;

    		let temp_ingredients = await executeGraphql(q, $claims);
    		temp_ingredients = temp_ingredients.data.ingredients;
    		$$invalidate(5, possible_ingredients = []);

    		for (var i = 0; i < temp_ingredients.length; i++) {
    			possible_ingredients.push({
    				"value": "",
    				"id": temp_ingredients[i].id,
    				"Ingredient": temp_ingredients[i].Ingredient,
    				"Brand": temp_ingredients[i].Brand,
    				"Quantity_Measurement": temp_ingredients[i].Quantity_Measurement
    			});
    		}

    		$$invalidate(5, possible_ingredients);
    	} // q  = `
    	//       {

    	//         users_ingredients_aggregate {
    	//           aggregate {
    	//             count
    	//           }
    	//         }
    	//       }
    	//   `;
    	// let temp_ingredients_count = await executeGraphql(q, c); 
    	// ingredients_count = temp_ingredients_count.data.users_ingredients_aggregate.aggregate.count;
    	// console.log("set the ingredients count");
    	// console.log(ingredients_count);
    	async function getPossibleRecipes() {
    		// let q = `
    		// {
    		//   recipes_aggregate {
    		//     aggregate {
    		//       count
    		//     }
    		//   }
    		// }
    		// `
    		let c = $claims;

    		// let temp_recipes = await executeGraphql(q, c); 
    		// recipes_count = temp_recipes.data.recipes_aggregate.aggregate.count;
    		let q = `
      {
        users_recipes {
          recipes {
            Recipe
            id
          }
        }
      }

      `;

    		let temp = await executeGraphql(q, c);
    		$$invalidate(23, recipes = temp.data.users_recipes);
    		console.log(recipes);
    	}

    	async function addNewRecipeIngredients(n_r_i) {
    		console.log(n_r_i);
    		console.log(new_recipe_ingredients);
    	}

    	async function findNewRecipeIngredient() {
    		console.log("STARTING finding the new recipe ingredient!");
    		$$invalidate(33, new_recipe_ingredients_final = []);

    		for (var i = 0; i < new_recipe_ingredients.length; i++) {
    			let q = `
                {
                  users_ingredients(where: {IngredientID: {_eq: ` + new_recipe_ingredients[i] + `}}) {
                    Quantity_Measurement
                    ingredients {
                      Ingredient
                    }
                  }
                }
              `;

    			let temp = await executeGraphql(q, $claims);
    			new_recipe_ingredients_final.push(temp.data.users_ingredients);
    		}

    		console.log(new_recipe_ingredients_final);
    	}

    	async function addNewRecipe(name) {
    		let q = `
        mutation {
          insert_recipes_one(object: {Recipe: " ` + name + `", Directions: "` + new_recipe_directions_1 + `"}) {
            id
            }
        }
       `;

    		let temp = await executeGraphql(q, $claims);
    		let new_recipeID = temp.data.insert_recipes_one.id;
    		console.log(new_recipeID);

    		q = `
          mutation {
            insert_users_recipes(objects: {RecipeID: ` + new_recipeID + `}) {
              returning {
                id
                recipes {
                  Recipe
                }
              }
            }
          }
       `;

    		temp = await executeGraphql(q, $claims);
    		let new_users_recipe_id = temp.data.insert_users_recipes.returning[0].id;
    		console.log(new_users_recipe_id);
    		console.log("STARTING INGREDIENTS_RECIPES INSERT");

    		for (var i = 0; i < new_recipe_ingredients.length; i++) {
    			console.log(new_recipe_ingredients[i].value);
    			let user_quantity = new_recipe_ingredients[i].value;
    			let temp_user_ingredient_id = new_recipe_ingredients[i].id;

    			q = `
            mutation {
              insert_ingredients_recipes_one(object: {Quantity: ` + user_quantity + `, Quantity_Measurement: "` + new_recipe_ingredients[i].Quantity_Measurement + `", UserIngredientID: ` + temp_user_ingredient_id + `, UserRecipeID: ` + new_users_recipe_id + `}) {
                ingredients {
                  Ingredient
                }
                user_recipes {
                  recipes {
                    Recipe
                  }
                }
              }
            }
            `;

    			temp = await executeGraphql(q, $claims);
    			let result = temp.data;
    			console.log(result);
    		}

    		$$invalidate(32, new_recipe_ingredients = []);
    		name = "";
    		$$invalidate(34, new_recipe_directions_1 = "");
    		$$invalidate(35, new_recipe_ingredient_shareable = null);
    		userLevelUp();
    		console.log("new recipe added!");
    		getPossibleRecipes();
    	}

    	async function getCategories() {
    		let q = `{
                    inventory(where: {Quantity: {_gt: 0.1}}) {
                        ingredient_inventory_2 {
                            category {
                                category
                                iconURL
                            }
                        }
                    }
                }
                `;

    		let c = $claims;
    		let temp_categories = await executeGraphql(q, c);
    		temp_categories = temp_categories.data.inventory;
    		let unique_categories = [];

    		for (var i = 0; i < temp_categories.length; i++) {
    			if (!unique_categories.some(e => e.category == temp_categories[i].ingredient_inventory_2.category.category)) {
    				unique_categories.push({
    					"category": temp_categories[i].ingredient_inventory_2.category.category,
    					"iconURL": temp_categories[i].ingredient_inventory_2.category.iconURL
    				});
    			}
    		}

    		$$invalidate(24, categories = unique_categories);
    		console.log(categories);
    	}

    	async function addInventoryIngredient(ingredientID, l, qua, q_m) {
    		let q = `mutation {
        insert_inventory_one(object: 
            {IngredientID: ` + ingredientID + `
            , Location: "` + l + `"
            , Quantity: ` + qua + `
            , Quantity_Measurement: "` + q_m + `"
            }) {
            Location
        }
        }    
        `;

    		let success = await executeGraphql(q, $claims);
    		$$invalidate(1, ingredient = null);
    		$$invalidate(1, ingredient);
    		$$invalidate(2, selected = null);
    		$$invalidate(3, quantity = null);
    		$$invalidate(4, quantity_measurement = "Not determined");
    		document.getElementById("Ingredient").removeChild;
    		document.getElementById("Quantity").removeChild;
    		document.getElementById("Quantity_Measurement").removeChild;
    	}

    	async function addNewIngredient(new_ing_name, brand, q_m) {
    		let q = `
            mutation {
              insert_ingredients_one(object: {Brand: "` + brand + `", Ingredient: "` + new_ing_name + `", Quantity_Measurement: "` + q_m + `"}) {
                id
              }
            }
            `;

    		let temp = await executeGraphql(q, $claims);
    		let newIngredientID = temp.data.insert_ingredients_one.id;
    		userLevelUp();
    		$$invalidate(30, new_ingredient_name = null);
    		document.getElementById("Ingredient").removeChild;
    		document.getElementById("Brand").removeChild;
    		$$invalidate(31, new_ingredient_brand = null);
    		document.getElementById("Quantity_Measurement").removeChild;
    		getPossibleIngredients();
    		document.getElementByClass("menu").focus();
    	}

    	// async function selectCategory(cat) {
    	//     if (cat == null) {
    	//       //   categories = [];
    	//           category = null;
    	//         getCategories();
    	//     }
    	//     let q = ` query
    	//       {
    	//         inventory(where: {ingredient_inventory_2: {Category: {_eq: "` + cat + `"}}}) {
    	//           ingredient_inventory_2 {
    	//             Category
    	//             Ingredient
    	//           }
    	//           IngredientID
    	//           Quantity
    	//           Quantity_Measurement
    	//         }
    	//       }
    	//     `; 
    	//   console.log($claims);
    	//   let temp = await executeGraphql(q, $claims)
    	//   // let temp = await executeGraphql(q, $claims).data.inventory[0].ingredient_inventory_2.Cstegory;
    	//   ingredients = temp.data.inventory;
    	//   if (ingredients.length > 0) {
    	//       category = temp.data.inventory[0].ingredient_inventory_2.Category;
    	//   }
    	// }
    	async function enterInventory() {
    		$$invalidate(13, enteringInventory = true);
    	}

    	async function enterRecipe() {
    		$$invalidate(25, viewingMyRecipes = false);
    		$$invalidate(27, enteringRecipe = true);
    	}

    	async function enterIngredient() {
    		$$invalidate(28, enteringIngredient = true);
    	}

    	async function enterRecipeIngredient2() {
    		$$invalidate(37, enteringRecipeIngredient = false);
    		$$invalidate(36, enteringRecipeIngredient2 = true);
    	}

    	async function updateQM(ingredientID, new_ingredient_number) {
    		console.log("updating QM!");
    		console.log(ingredientID);

    		let q = ` {
              users_ingredients(where: {IngredientID: {_eq: ` + ingredientID + `}}) {
                Quantity_Measurement
              }
            }
            `;

    		let temp = await executeGraphql(q, $claims);
    		console.log(temp.data);

    		if (new_ingredient_number == 1) {
    			new_recipe_ingredrient_quantity_measurement_1 = temp.data.users_ingredients[0].Quantity_Measurement;
    		} else if (new_ingredient_number == 2) {
    			new_recipe_ingredrient_quantity_measurement_2 = temp.data.users_ingredients[0].Quantity_Measurement;
    		}

    		console.log(new_recipe_ingredrient_quantity_measurement_1);
    	}

    	let { locations = ["Pantry", "Fridge", "Freezer", "Spice Cabinet"] } = $$props;

    	const writable_props = [
    		'loading',
    		'hasura_userID',
    		'ingredient',
    		'selected',
    		'quantity',
    		'quantity_measurement',
    		'ingredients',
    		'recipes',
    		'possible_ingredients',
    		'recipes_count',
    		'ingredients_count',
    		'categories',
    		'category',
    		'filteredCommunityRecipes',
    		'viewingRecipes',
    		'viewingMyRecipes',
    		'communityRecipe',
    		'viewingCommunityRecipe',
    		'viewingCommunityRecipes',
    		'viewingFilteredCommunityRecipes',
    		'viewingInventory',
    		'viewingIngredients',
    		'enteringInventory',
    		'enteringRecipe',
    		'enteringIngredient',
    		'communityRecipeIngredients',
    		'new_recipe_name',
    		'new_ingredient_name',
    		'new_ingredient_brand',
    		'new_recipe_ingredients',
    		'new_recipe_ingredients_final',
    		'new_recipe_ingredient_quantity',
    		'new_ingredient_measurement',
    		'new_recipe_directions_1',
    		'new_recipe_ingredient_shareable',
    		'existing_ingredient',
    		'enteringRecipeIngredient2',
    		'enteringRecipeIngredient3',
    		'enteringRecipeIngredient',
    		'user_level',
    		'user_code',
    		'locations'
    	];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<HomeComponent> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = fcr => filterCommunityRecipes(filteredCommunityRecipes[fcr][Object.keys(filteredCommunityRecipes[fcr])[0]]["category"]);
    	const click_handler_1 = () => viewCommunityRecipes();
    	const click_handler_2 = () => viewCommunityRecipes();
    	const click_handler_3 = () => enterInventory();

    	function select0_change_handler() {
    		selected = select_value(this);
    		$$invalidate(2, selected);
    		$$invalidate(14, locations);
    	}

    	function select1_change_handler() {
    		ingredient = select_value(this);
    		$$invalidate(1, ingredient);
    		$$invalidate(5, possible_ingredients);
    	}

    	function input_input_handler() {
    		quantity = this.value;
    		$$invalidate(3, quantity);
    	}

    	const click_handler_4 = () => addInventoryIngredient(ingredient, selected, quantity, quantity_measurement);
    	const click_handler_5 = () => enterIngredient();

    	$$self.$$set = $$props => {
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    		if ('hasura_userID' in $$props) $$invalidate(22, hasura_userID = $$props.hasura_userID);
    		if ('ingredient' in $$props) $$invalidate(1, ingredient = $$props.ingredient);
    		if ('selected' in $$props) $$invalidate(2, selected = $$props.selected);
    		if ('quantity' in $$props) $$invalidate(3, quantity = $$props.quantity);
    		if ('quantity_measurement' in $$props) $$invalidate(4, quantity_measurement = $$props.quantity_measurement);
    		if ('ingredients' in $$props) $$invalidate(40, ingredients = $$props.ingredients);
    		if ('recipes' in $$props) $$invalidate(23, recipes = $$props.recipes);
    		if ('possible_ingredients' in $$props) $$invalidate(5, possible_ingredients = $$props.possible_ingredients);
    		if ('recipes_count' in $$props) $$invalidate(41, recipes_count = $$props.recipes_count);
    		if ('ingredients_count' in $$props) $$invalidate(42, ingredients_count = $$props.ingredients_count);
    		if ('categories' in $$props) $$invalidate(24, categories = $$props.categories);
    		if ('category' in $$props) $$invalidate(43, category = $$props.category);
    		if ('filteredCommunityRecipes' in $$props) $$invalidate(6, filteredCommunityRecipes = $$props.filteredCommunityRecipes);
    		if ('viewingRecipes' in $$props) $$invalidate(7, viewingRecipes = $$props.viewingRecipes);
    		if ('viewingMyRecipes' in $$props) $$invalidate(25, viewingMyRecipes = $$props.viewingMyRecipes);
    		if ('communityRecipe' in $$props) $$invalidate(8, communityRecipe = $$props.communityRecipe);
    		if ('viewingCommunityRecipe' in $$props) $$invalidate(9, viewingCommunityRecipe = $$props.viewingCommunityRecipe);
    		if ('viewingCommunityRecipes' in $$props) $$invalidate(10, viewingCommunityRecipes = $$props.viewingCommunityRecipes);
    		if ('viewingFilteredCommunityRecipes' in $$props) $$invalidate(11, viewingFilteredCommunityRecipes = $$props.viewingFilteredCommunityRecipes);
    		if ('viewingInventory' in $$props) $$invalidate(26, viewingInventory = $$props.viewingInventory);
    		if ('viewingIngredients' in $$props) $$invalidate(12, viewingIngredients = $$props.viewingIngredients);
    		if ('enteringInventory' in $$props) $$invalidate(13, enteringInventory = $$props.enteringInventory);
    		if ('enteringRecipe' in $$props) $$invalidate(27, enteringRecipe = $$props.enteringRecipe);
    		if ('enteringIngredient' in $$props) $$invalidate(28, enteringIngredient = $$props.enteringIngredient);
    		if ('communityRecipeIngredients' in $$props) $$invalidate(29, communityRecipeIngredients = $$props.communityRecipeIngredients);
    		if ('new_recipe_name' in $$props) $$invalidate(44, new_recipe_name = $$props.new_recipe_name);
    		if ('new_ingredient_name' in $$props) $$invalidate(30, new_ingredient_name = $$props.new_ingredient_name);
    		if ('new_ingredient_brand' in $$props) $$invalidate(31, new_ingredient_brand = $$props.new_ingredient_brand);
    		if ('new_recipe_ingredients' in $$props) $$invalidate(32, new_recipe_ingredients = $$props.new_recipe_ingredients);
    		if ('new_recipe_ingredients_final' in $$props) $$invalidate(33, new_recipe_ingredients_final = $$props.new_recipe_ingredients_final);
    		if ('new_recipe_ingredient_quantity' in $$props) $$invalidate(45, new_recipe_ingredient_quantity = $$props.new_recipe_ingredient_quantity);
    		if ('new_ingredient_measurement' in $$props) $$invalidate(46, new_ingredient_measurement = $$props.new_ingredient_measurement);
    		if ('new_recipe_directions_1' in $$props) $$invalidate(34, new_recipe_directions_1 = $$props.new_recipe_directions_1);
    		if ('new_recipe_ingredient_shareable' in $$props) $$invalidate(35, new_recipe_ingredient_shareable = $$props.new_recipe_ingredient_shareable);
    		if ('existing_ingredient' in $$props) $$invalidate(47, existing_ingredient = $$props.existing_ingredient);
    		if ('enteringRecipeIngredient2' in $$props) $$invalidate(36, enteringRecipeIngredient2 = $$props.enteringRecipeIngredient2);
    		if ('enteringRecipeIngredient3' in $$props) $$invalidate(48, enteringRecipeIngredient3 = $$props.enteringRecipeIngredient3);
    		if ('enteringRecipeIngredient' in $$props) $$invalidate(37, enteringRecipeIngredient = $$props.enteringRecipeIngredient);
    		if ('user_level' in $$props) $$invalidate(38, user_level = $$props.user_level);
    		if ('user_code' in $$props) $$invalidate(39, user_code = $$props.user_code);
    		if ('locations' in $$props) $$invalidate(14, locations = $$props.locations);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		setContext,
    		createAuth0Client: uc,
    		executeGraphql,
    		location: location$1,
    		querystring,
    		link,
    		AutoComplete: SimpleAutocomplete,
    		claims,
    		Auth0Context,
    		authError,
    		authToken,
    		isAuthenticated,
    		isLoading,
    		login,
    		logout,
    		userInfo,
    		loading,
    		hasura_userID,
    		ingredient,
    		selected,
    		quantity,
    		quantity_measurement,
    		ingredients,
    		recipes,
    		possible_ingredients,
    		recipes_count,
    		ingredients_count,
    		categories,
    		category,
    		filteredCommunityRecipes,
    		viewingRecipes,
    		viewingMyRecipes,
    		communityRecipe,
    		viewingCommunityRecipe,
    		viewingCommunityRecipes,
    		viewingFilteredCommunityRecipes,
    		viewingInventory,
    		viewingIngredients,
    		enteringInventory,
    		enteringRecipe,
    		enteringIngredient,
    		communityRecipeIngredients,
    		new_recipe_name,
    		new_ingredient_name,
    		new_ingredient_brand,
    		new_recipe_ingredients,
    		new_recipe_ingredients_final,
    		new_recipe_ingredient_quantity,
    		new_ingredient_measurement,
    		new_recipe_directions_1,
    		new_recipe_ingredient_shareable,
    		existing_ingredient,
    		enteringRecipeIngredient2,
    		enteringRecipeIngredient3,
    		enteringRecipeIngredient,
    		user_level,
    		user_code,
    		checkUser,
    		viewRecipes,
    		viewMyRecipes,
    		viewCommunityRecipes,
    		filterCommunityRecipes,
    		viewIngredients,
    		getPossibleIngredients,
    		getPossibleRecipes,
    		addNewRecipeIngredients,
    		findNewRecipeIngredient,
    		addNewRecipe,
    		getCategories,
    		addInventoryIngredient,
    		addNewIngredient,
    		enterInventory,
    		enterRecipe,
    		enterIngredient,
    		enterRecipeIngredient2,
    		updateQM,
    		locations,
    		$claims,
    		$userInfo
    	});

    	$$self.$inject_state = $$props => {
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    		if ('hasura_userID' in $$props) $$invalidate(22, hasura_userID = $$props.hasura_userID);
    		if ('ingredient' in $$props) $$invalidate(1, ingredient = $$props.ingredient);
    		if ('selected' in $$props) $$invalidate(2, selected = $$props.selected);
    		if ('quantity' in $$props) $$invalidate(3, quantity = $$props.quantity);
    		if ('quantity_measurement' in $$props) $$invalidate(4, quantity_measurement = $$props.quantity_measurement);
    		if ('ingredients' in $$props) $$invalidate(40, ingredients = $$props.ingredients);
    		if ('recipes' in $$props) $$invalidate(23, recipes = $$props.recipes);
    		if ('possible_ingredients' in $$props) $$invalidate(5, possible_ingredients = $$props.possible_ingredients);
    		if ('recipes_count' in $$props) $$invalidate(41, recipes_count = $$props.recipes_count);
    		if ('ingredients_count' in $$props) $$invalidate(42, ingredients_count = $$props.ingredients_count);
    		if ('categories' in $$props) $$invalidate(24, categories = $$props.categories);
    		if ('category' in $$props) $$invalidate(43, category = $$props.category);
    		if ('filteredCommunityRecipes' in $$props) $$invalidate(6, filteredCommunityRecipes = $$props.filteredCommunityRecipes);
    		if ('viewingRecipes' in $$props) $$invalidate(7, viewingRecipes = $$props.viewingRecipes);
    		if ('viewingMyRecipes' in $$props) $$invalidate(25, viewingMyRecipes = $$props.viewingMyRecipes);
    		if ('communityRecipe' in $$props) $$invalidate(8, communityRecipe = $$props.communityRecipe);
    		if ('viewingCommunityRecipe' in $$props) $$invalidate(9, viewingCommunityRecipe = $$props.viewingCommunityRecipe);
    		if ('viewingCommunityRecipes' in $$props) $$invalidate(10, viewingCommunityRecipes = $$props.viewingCommunityRecipes);
    		if ('viewingFilteredCommunityRecipes' in $$props) $$invalidate(11, viewingFilteredCommunityRecipes = $$props.viewingFilteredCommunityRecipes);
    		if ('viewingInventory' in $$props) $$invalidate(26, viewingInventory = $$props.viewingInventory);
    		if ('viewingIngredients' in $$props) $$invalidate(12, viewingIngredients = $$props.viewingIngredients);
    		if ('enteringInventory' in $$props) $$invalidate(13, enteringInventory = $$props.enteringInventory);
    		if ('enteringRecipe' in $$props) $$invalidate(27, enteringRecipe = $$props.enteringRecipe);
    		if ('enteringIngredient' in $$props) $$invalidate(28, enteringIngredient = $$props.enteringIngredient);
    		if ('communityRecipeIngredients' in $$props) $$invalidate(29, communityRecipeIngredients = $$props.communityRecipeIngredients);
    		if ('new_recipe_name' in $$props) $$invalidate(44, new_recipe_name = $$props.new_recipe_name);
    		if ('new_ingredient_name' in $$props) $$invalidate(30, new_ingredient_name = $$props.new_ingredient_name);
    		if ('new_ingredient_brand' in $$props) $$invalidate(31, new_ingredient_brand = $$props.new_ingredient_brand);
    		if ('new_recipe_ingredients' in $$props) $$invalidate(32, new_recipe_ingredients = $$props.new_recipe_ingredients);
    		if ('new_recipe_ingredients_final' in $$props) $$invalidate(33, new_recipe_ingredients_final = $$props.new_recipe_ingredients_final);
    		if ('new_recipe_ingredient_quantity' in $$props) $$invalidate(45, new_recipe_ingredient_quantity = $$props.new_recipe_ingredient_quantity);
    		if ('new_ingredient_measurement' in $$props) $$invalidate(46, new_ingredient_measurement = $$props.new_ingredient_measurement);
    		if ('new_recipe_directions_1' in $$props) $$invalidate(34, new_recipe_directions_1 = $$props.new_recipe_directions_1);
    		if ('new_recipe_ingredient_shareable' in $$props) $$invalidate(35, new_recipe_ingredient_shareable = $$props.new_recipe_ingredient_shareable);
    		if ('existing_ingredient' in $$props) $$invalidate(47, existing_ingredient = $$props.existing_ingredient);
    		if ('enteringRecipeIngredient2' in $$props) $$invalidate(36, enteringRecipeIngredient2 = $$props.enteringRecipeIngredient2);
    		if ('enteringRecipeIngredient3' in $$props) $$invalidate(48, enteringRecipeIngredient3 = $$props.enteringRecipeIngredient3);
    		if ('enteringRecipeIngredient' in $$props) $$invalidate(37, enteringRecipeIngredient = $$props.enteringRecipeIngredient);
    		if ('user_level' in $$props) $$invalidate(38, user_level = $$props.user_level);
    		if ('user_code' in $$props) $$invalidate(39, user_code = $$props.user_code);
    		if ('locations' in $$props) $$invalidate(14, locations = $$props.locations);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		loading,
    		ingredient,
    		selected,
    		quantity,
    		quantity_measurement,
    		possible_ingredients,
    		filteredCommunityRecipes,
    		viewingRecipes,
    		communityRecipe,
    		viewingCommunityRecipe,
    		viewingCommunityRecipes,
    		viewingFilteredCommunityRecipes,
    		viewingIngredients,
    		enteringInventory,
    		locations,
    		$userInfo,
    		viewCommunityRecipes,
    		filterCommunityRecipes,
    		addInventoryIngredient,
    		enterInventory,
    		enterIngredient,
    		updateQM,
    		hasura_userID,
    		recipes,
    		categories,
    		viewingMyRecipes,
    		viewingInventory,
    		enteringRecipe,
    		enteringIngredient,
    		communityRecipeIngredients,
    		new_ingredient_name,
    		new_ingredient_brand,
    		new_recipe_ingredients,
    		new_recipe_ingredients_final,
    		new_recipe_directions_1,
    		new_recipe_ingredient_shareable,
    		enteringRecipeIngredient2,
    		enteringRecipeIngredient,
    		user_level,
    		user_code,
    		ingredients,
    		recipes_count,
    		ingredients_count,
    		category,
    		new_recipe_name,
    		new_recipe_ingredient_quantity,
    		new_ingredient_measurement,
    		existing_ingredient,
    		enteringRecipeIngredient3,
    		submit_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		select0_change_handler,
    		select1_change_handler,
    		input_input_handler,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class HomeComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				loading: 0,
    				hasura_userID: 22,
    				ingredient: 1,
    				selected: 2,
    				quantity: 3,
    				quantity_measurement: 4,
    				ingredients: 40,
    				recipes: 23,
    				possible_ingredients: 5,
    				recipes_count: 41,
    				ingredients_count: 42,
    				categories: 24,
    				category: 43,
    				filteredCommunityRecipes: 6,
    				viewingRecipes: 7,
    				viewingMyRecipes: 25,
    				communityRecipe: 8,
    				viewingCommunityRecipe: 9,
    				viewingCommunityRecipes: 10,
    				viewingFilteredCommunityRecipes: 11,
    				viewingInventory: 26,
    				viewingIngredients: 12,
    				enteringInventory: 13,
    				enteringRecipe: 27,
    				enteringIngredient: 28,
    				communityRecipeIngredients: 29,
    				new_recipe_name: 44,
    				new_ingredient_name: 30,
    				new_ingredient_brand: 31,
    				new_recipe_ingredients: 32,
    				new_recipe_ingredients_final: 33,
    				new_recipe_ingredient_quantity: 45,
    				new_ingredient_measurement: 46,
    				new_recipe_directions_1: 34,
    				new_recipe_ingredient_shareable: 35,
    				existing_ingredient: 47,
    				enteringRecipeIngredient2: 36,
    				enteringRecipeIngredient3: 48,
    				enteringRecipeIngredient: 37,
    				user_level: 38,
    				user_code: 39,
    				locations: 14
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeComponent",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*loading*/ ctx[0] === undefined && !('loading' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'loading'");
    		}

    		if (/*hasura_userID*/ ctx[22] === undefined && !('hasura_userID' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'hasura_userID'");
    		}

    		if (/*ingredient*/ ctx[1] === undefined && !('ingredient' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'ingredient'");
    		}

    		if (/*selected*/ ctx[2] === undefined && !('selected' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'selected'");
    		}

    		if (/*quantity*/ ctx[3] === undefined && !('quantity' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'quantity'");
    		}

    		if (/*ingredients*/ ctx[40] === undefined && !('ingredients' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'ingredients'");
    		}

    		if (/*recipes_count*/ ctx[41] === undefined && !('recipes_count' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'recipes_count'");
    		}

    		if (/*ingredients_count*/ ctx[42] === undefined && !('ingredients_count' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'ingredients_count'");
    		}

    		if (/*category*/ ctx[43] === undefined && !('category' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'category'");
    		}

    		if (/*viewingRecipes*/ ctx[7] === undefined && !('viewingRecipes' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'viewingRecipes'");
    		}

    		if (/*viewingMyRecipes*/ ctx[25] === undefined && !('viewingMyRecipes' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'viewingMyRecipes'");
    		}

    		if (/*communityRecipe*/ ctx[8] === undefined && !('communityRecipe' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'communityRecipe'");
    		}

    		if (/*viewingCommunityRecipe*/ ctx[9] === undefined && !('viewingCommunityRecipe' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'viewingCommunityRecipe'");
    		}

    		if (/*viewingCommunityRecipes*/ ctx[10] === undefined && !('viewingCommunityRecipes' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'viewingCommunityRecipes'");
    		}

    		if (/*viewingFilteredCommunityRecipes*/ ctx[11] === undefined && !('viewingFilteredCommunityRecipes' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'viewingFilteredCommunityRecipes'");
    		}

    		if (/*viewingInventory*/ ctx[26] === undefined && !('viewingInventory' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'viewingInventory'");
    		}

    		if (/*viewingIngredients*/ ctx[12] === undefined && !('viewingIngredients' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'viewingIngredients'");
    		}

    		if (/*enteringInventory*/ ctx[13] === undefined && !('enteringInventory' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'enteringInventory'");
    		}

    		if (/*enteringRecipe*/ ctx[27] === undefined && !('enteringRecipe' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'enteringRecipe'");
    		}

    		if (/*enteringIngredient*/ ctx[28] === undefined && !('enteringIngredient' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'enteringIngredient'");
    		}

    		if (/*communityRecipeIngredients*/ ctx[29] === undefined && !('communityRecipeIngredients' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'communityRecipeIngredients'");
    		}

    		if (/*new_recipe_name*/ ctx[44] === undefined && !('new_recipe_name' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'new_recipe_name'");
    		}

    		if (/*new_ingredient_name*/ ctx[30] === undefined && !('new_ingredient_name' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'new_ingredient_name'");
    		}

    		if (/*new_ingredient_brand*/ ctx[31] === undefined && !('new_ingredient_brand' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'new_ingredient_brand'");
    		}

    		if (/*new_recipe_ingredient_quantity*/ ctx[45] === undefined && !('new_recipe_ingredient_quantity' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'new_recipe_ingredient_quantity'");
    		}

    		if (/*new_ingredient_measurement*/ ctx[46] === undefined && !('new_ingredient_measurement' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'new_ingredient_measurement'");
    		}

    		if (/*new_recipe_directions_1*/ ctx[34] === undefined && !('new_recipe_directions_1' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'new_recipe_directions_1'");
    		}

    		if (/*new_recipe_ingredient_shareable*/ ctx[35] === undefined && !('new_recipe_ingredient_shareable' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'new_recipe_ingredient_shareable'");
    		}

    		if (/*existing_ingredient*/ ctx[47] === undefined && !('existing_ingredient' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'existing_ingredient'");
    		}

    		if (/*enteringRecipeIngredient2*/ ctx[36] === undefined && !('enteringRecipeIngredient2' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'enteringRecipeIngredient2'");
    		}

    		if (/*enteringRecipeIngredient3*/ ctx[48] === undefined && !('enteringRecipeIngredient3' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'enteringRecipeIngredient3'");
    		}

    		if (/*user_level*/ ctx[38] === undefined && !('user_level' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'user_level'");
    		}

    		if (/*user_code*/ ctx[39] === undefined && !('user_code' in props)) {
    			console_1$2.warn("<HomeComponent> was created without expected prop 'user_code'");
    		}
    	}

    	get loading() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasura_userID() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasura_userID(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ingredient() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ingredient(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get quantity() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quantity(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get quantity_measurement() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quantity_measurement(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ingredients() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ingredients(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get recipes() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipes(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get possible_ingredients() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set possible_ingredients(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get recipes_count() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipes_count(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ingredients_count() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ingredients_count(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filteredCommunityRecipes() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filteredCommunityRecipes(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingRecipes() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingRecipes(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingMyRecipes() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingMyRecipes(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get communityRecipe() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set communityRecipe(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingCommunityRecipe() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingCommunityRecipe(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingCommunityRecipes() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingCommunityRecipes(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingFilteredCommunityRecipes() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingFilteredCommunityRecipes(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingInventory() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingInventory(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingIngredients() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingIngredients(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enteringInventory() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enteringInventory(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enteringRecipe() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enteringRecipe(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enteringIngredient() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enteringIngredient(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get communityRecipeIngredients() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set communityRecipeIngredients(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_name() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_name(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_ingredient_name() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_ingredient_name(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_ingredient_brand() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_ingredient_brand(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_ingredients() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_ingredients(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_ingredients_final() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_ingredients_final(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_ingredient_quantity() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_ingredient_quantity(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_ingredient_measurement() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_ingredient_measurement(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_directions_1() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_directions_1(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_ingredient_shareable() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_ingredient_shareable(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get existing_ingredient() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set existing_ingredient(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enteringRecipeIngredient2() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enteringRecipeIngredient2(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enteringRecipeIngredient3() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enteringRecipeIngredient3(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enteringRecipeIngredient() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enteringRecipeIngredient(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get user_level() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user_level(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get user_code() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user_code(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get locations() {
    		throw new Error("<HomeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set locations(value) {
    		throw new Error("<HomeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Food.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1$3, console: console_1$3 } = globals;
    const file$3 = "src/components/Food.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	return child_ctx;
    }

    // (348:0) {#if viewingMyRecipes}
    function create_if_block_11(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*unique_meal_types_counts*/ ctx[9].length > 0) return create_if_block_12;
    		if (/*loadingRecipes*/ ctx[0]) return create_if_block_13;
    		return create_else_block_5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
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
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(348:0) {#if viewingMyRecipes}",
    		ctx
    	});

    	return block;
    }

    // (361:8) {:else}
    function create_else_block_5(ctx) {
    	let p0;
    	let t1;
    	let p1;
    	let a;
    	let link_action;
    	let t3;
    	let p2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Welcome to your first time using Grimp!";
    			t1 = space();
    			p1 = element("p");
    			a = element("a");
    			a.textContent = "Create a new recipe";
    			t3 = space();
    			p2 = element("p");
    			button = element("button");
    			button.textContent = "View the Community Recipes";
    			add_location(p0, file$3, 361, 12, 13765);
    			attr_dev(a, "href", "/food/recipes/new");
    			attr_dev(a, "class", "btn btn-lg btn-outline-success");
    			add_location(a, file$3, 362, 15, 13827);
    			add_location(p1, file$3, 362, 12, 13824);
    			attr_dev(button, "class", "btn btn-lg btn-outline-info");
    			add_location(button, file$3, 363, 15, 13946);
    			add_location(p2, file$3, 363, 12, 13943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, a);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, button);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link_action = link.call(null, a)),
    					listen_dev(button, "click", /*click_handler_3*/ ctx[35], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_5.name,
    		type: "else",
    		source: "(361:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (359:8) {#if loadingRecipes}
    function create_if_block_13(ctx) {
    	let p;
    	let t;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("Loading... ");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/clock.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svg");
    			attr_dev(img, "alt", "loading");
    			add_location(img, file$3, 359, 42, 13661);
    			attr_dev(p, "class", "loading");
    			add_location(p, file$3, 359, 12, 13631);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			append_dev(p, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(359:8) {#if loadingRecipes}",
    		ctx
    	});

    	return block;
    }

    // (349:4) {#if unique_meal_types_counts.length > 0}
    function create_if_block_12(ctx) {
    	let ul;
    	let each_value_5 = /*unique_meal_types_counts*/ ctx[9];
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "list-group");
    			add_location(ul, file$3, 349, 4, 13136);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterMyRecipes, unique_meal_types_counts*/ 4608) {
    				each_value_5 = /*unique_meal_types_counts*/ ctx[9];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(349:4) {#if unique_meal_types_counts.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (351:8) {#each unique_meal_types_counts as umt}
    function create_each_block_5(ctx) {
    	let li;
    	let label;
    	let t0_value = Object.keys(/*umt*/ ctx[52])[0] + "";
    	let t0;
    	let t1;
    	let span;
    	let t2_value = /*umt*/ ctx[52][Object.keys(/*umt*/ ctx[52])[0]] + "";
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[34](/*umt*/ ctx[52]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(label, "class", "recipesNav");
    			add_location(label, file$3, 352, 16, 13381);
    			attr_dev(span, "class", "badge badge-primary badge-pill");
    			add_location(span, file$3, 353, 16, 13453);
    			attr_dev(li, "class", "list-group-item d-flex justify-content-between align-items-center");
    			add_location(li, file$3, 351, 12, 13220);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, label);
    			append_dev(label, t0);
    			append_dev(li, t1);
    			append_dev(li, span);
    			append_dev(span, t2);
    			append_dev(li, t3);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*unique_meal_types_counts*/ 512 && t0_value !== (t0_value = Object.keys(/*umt*/ ctx[52])[0] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*unique_meal_types_counts*/ 512 && t2_value !== (t2_value = /*umt*/ ctx[52][Object.keys(/*umt*/ ctx[52])[0]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(351:8) {#each unique_meal_types_counts as umt}",
    		ctx
    	});

    	return block;
    }

    // (369:0) {#if viewingMyFilteredRecipes}
    function create_if_block_9(ctx) {
    	let t0;
    	let p;
    	let button;
    	let img;
    	let img_src_value;
    	let t1;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*unique_category_counts*/ ctx[10].length > 0) return create_if_block_10;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t0 = space();
    			p = element("p");
    			button = element("button");
    			img = element("img");
    			t1 = text(" Back");
    			attr_dev(img, "class", "icon");
    			attr_dev(img, "alt", "back");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/chevron-left.svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$3, 382, 78, 14778);
    			attr_dev(button, "class", "btn btn-md btn-secondary");
    			add_location(button, file$3, 382, 4, 14704);
    			add_location(p, file$3, 381, 0, 14696);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, button);
    			append_dev(button, img);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_5*/ ctx[37], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(369:0) {#if viewingMyFilteredRecipes}",
    		ctx
    	});

    	return block;
    }

    // (379:0) {:else}
    function create_else_block_4(ctx) {
    	let p;
    	let t;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("Loading... ");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/clock.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svg");
    			attr_dev(img, "alt", "loading");
    			add_location(img, file$3, 379, 34, 14614);
    			attr_dev(p, "class", "loading");
    			add_location(p, file$3, 379, 4, 14584);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			append_dev(p, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(379:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (370:0) {#if unique_category_counts.length > 0}
    function create_if_block_10(ctx) {
    	let ul;
    	let each_value_4 = /*unique_category_counts*/ ctx[10];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "list-group");
    			add_location(ul, file$3, 370, 0, 14172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterMyRecipes, current_meal_type, unique_category_counts*/ 5376) {
    				each_value_4 = /*unique_category_counts*/ ctx[10];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$1(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(370:0) {#if unique_category_counts.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (372:2) {#each unique_category_counts as ucc}
    function create_each_block_4$1(ctx) {
    	let li;
    	let label;
    	let t0_value = Object.keys(/*ucc*/ ctx[49])[0] + "";
    	let t0;
    	let t1;
    	let span;
    	let t2_value = /*ucc*/ ctx[49][Object.keys(/*ucc*/ ctx[49])[0]] + "";
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[36](/*ucc*/ ctx[49]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(label, "class", "recipesNav");
    			add_location(label, file$3, 373, 6, 14405);
    			attr_dev(span, "class", "badge badge-primary badge-pill");
    			add_location(span, file$3, 374, 6, 14467);
    			attr_dev(li, "class", "list-group-item d-flex justify-content-between align-items-center");
    			add_location(li, file$3, 372, 4, 14240);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, label);
    			append_dev(label, t0);
    			append_dev(li, t1);
    			append_dev(li, span);
    			append_dev(span, t2);
    			append_dev(li, t3);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_4, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*unique_category_counts*/ 1024 && t0_value !== (t0_value = Object.keys(/*ucc*/ ctx[49])[0] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*unique_category_counts*/ 1024 && t2_value !== (t2_value = /*ucc*/ ctx[49][Object.keys(/*ucc*/ ctx[49])[0]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$1.name,
    		type: "each",
    		source: "(372:2) {#each unique_category_counts as ucc}",
    		ctx
    	});

    	return block;
    }

    // (387:0) {#if viewingMyCategoryFilteredRecipes}
    function create_if_block_7$1(ctx) {
    	let t0;
    	let p;
    	let button;
    	let img;
    	let img_src_value;
    	let t1;
    	let mounted;
    	let dispose;

    	function select_block_type_2(ctx, dirty) {
    		if (/*recipes_ids*/ ctx[1].length > 0) return create_if_block_8;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t0 = space();
    			p = element("p");
    			button = element("button");
    			img = element("img");
    			t1 = text(" Back");
    			attr_dev(img, "class", "icon");
    			attr_dev(img, "alt", "back");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/chevron-left.svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$3, 399, 109, 15473);
    			attr_dev(button, "class", "btn btn-md btn-secondary");
    			add_location(button, file$3, 399, 4, 15368);
    			add_location(p, file$3, 398, 0, 15360);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, button);
    			append_dev(button, img);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[38], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(387:0) {#if viewingMyCategoryFilteredRecipes}",
    		ctx
    	});

    	return block;
    }

    // (396:0) {:else}
    function create_else_block_3(ctx) {
    	let p;
    	let t;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("Loading... ");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/clock.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svg");
    			attr_dev(img, "alt", "loading");
    			add_location(img, file$3, 396, 34, 15278);
    			attr_dev(p, "class", "loading");
    			add_location(p, file$3, 396, 4, 15248);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			append_dev(p, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(396:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (388:0) {#if recipes_ids.length > 0}
    function create_if_block_8(ctx) {
    	let ul;
    	let each_value_3 = /*recipes_ids*/ ctx[1];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "list-group");
    			add_location(ul, file$3, 388, 0, 14949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*recipes_ids*/ 2) {
    				each_value_3 = /*recipes_ids*/ ctx[1];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(388:0) {#if recipes_ids.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (390:2) {#each recipes_ids as rn}
    function create_each_block_3$1(ctx) {
    	let li;
    	let a;
    	let label;
    	let t0_value = Object.keys(/*rn*/ ctx[46])[0] + "";
    	let t0;
    	let a_href_value;
    	let link_action;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(label, "class", "recipesNav");
    			add_location(label, file$3, 391, 67, 15151);
    			attr_dev(a, "href", a_href_value = "/food/recipes/" + /*rn*/ ctx[46][Object.keys(/*rn*/ ctx[46])[0]]);
    			add_location(a, file$3, 391, 6, 15090);
    			attr_dev(li, "class", "list-group-item d-flex justify-content-between align-items-center");
    			add_location(li, file$3, 390, 4, 15005);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, label);
    			append_dev(label, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*recipes_ids*/ 2 && t0_value !== (t0_value = Object.keys(/*rn*/ ctx[46])[0] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*recipes_ids*/ 2 && a_href_value !== (a_href_value = "/food/recipes/" + /*rn*/ ctx[46][Object.keys(/*rn*/ ctx[46])[0]])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(390:2) {#each recipes_ids as rn}",
    		ctx
    	});

    	return block;
    }

    // (406:0) {#if viewingCommunityRecipes}
    function create_if_block_4$2(ctx) {
    	let if_block_anchor;
    	let if_block = !/*viewingMyRecipes*/ ctx[4] && create_if_block_5$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*viewingMyRecipes*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5$2(ctx);
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
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(406:0) {#if viewingCommunityRecipes}",
    		ctx
    	});

    	return block;
    }

    // (407:0) {#if !viewingMyRecipes}
    function create_if_block_5$2(ctx) {
    	let if_block_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (/*unique_meal_types_counts*/ ctx[9].length > 0) return create_if_block_6$2;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
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
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(407:0) {#if !viewingMyRecipes}",
    		ctx
    	});

    	return block;
    }

    // (417:4) {:else}
    function create_else_block_2(ctx) {
    	let p;
    	let t;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("Loading... ");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/clock.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svg");
    			attr_dev(img, "alt", "loading");
    			add_location(img, file$3, 417, 38, 16181);
    			attr_dev(p, "class", "loading");
    			add_location(p, file$3, 417, 8, 16151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			append_dev(p, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(417:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (408:4) {#if unique_meal_types_counts.length > 0}
    function create_if_block_6$2(ctx) {
    	let ul;
    	let each_value_2 = /*unique_meal_types_counts*/ ctx[9];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "list-group");
    			add_location(ul, file$3, 408, 4, 15682);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterCommunityRecipes, unique_meal_types_counts*/ 16896) {
    				each_value_2 = /*unique_meal_types_counts*/ ctx[9];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(408:4) {#if unique_meal_types_counts.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (410:8) {#each unique_meal_types_counts as umt}
    function create_each_block_2$1(ctx) {
    	let li;
    	let label;
    	let t0_value = Object.keys(/*umt*/ ctx[52])[0] + "";
    	let t0;
    	let t1;
    	let span;
    	let t2_value = /*umt*/ ctx[52][Object.keys(/*umt*/ ctx[52])[0]] + "";
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler_7() {
    		return /*click_handler_7*/ ctx[39](/*umt*/ ctx[52]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(label, "class", "recipesNav");
    			add_location(label, file$3, 411, 16, 15934);
    			attr_dev(span, "class", "badge badge-primary badge-pill");
    			add_location(span, file$3, 412, 16, 16006);
    			attr_dev(li, "class", "list-group-item d-flex justify-content-between align-items-center");
    			add_location(li, file$3, 410, 12, 15766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, label);
    			append_dev(label, t0);
    			append_dev(li, t1);
    			append_dev(li, span);
    			append_dev(span, t2);
    			append_dev(li, t3);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_7, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*unique_meal_types_counts*/ 512 && t0_value !== (t0_value = Object.keys(/*umt*/ ctx[52])[0] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*unique_meal_types_counts*/ 512 && t2_value !== (t2_value = /*umt*/ ctx[52][Object.keys(/*umt*/ ctx[52])[0]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(410:8) {#each unique_meal_types_counts as umt}",
    		ctx
    	});

    	return block;
    }

    // (423:0) {#if viewingFilteredCommunityRecipes}
    function create_if_block_2$2(ctx) {
    	let t0;
    	let p;
    	let button;
    	let img;
    	let img_src_value;
    	let t1;
    	let mounted;
    	let dispose;

    	function select_block_type_4(ctx, dirty) {
    		if (/*unique_category_counts*/ ctx[10].length > 0) return create_if_block_3$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type_4(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t0 = space();
    			p = element("p");
    			button = element("button");
    			img = element("img");
    			t1 = text(" Back");
    			attr_dev(img, "class", "icon");
    			attr_dev(img, "alt", "back");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/chevron-left.svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$3, 436, 89, 17026);
    			attr_dev(button, "class", "btn btn-md btn-secondary");
    			add_location(button, file$3, 436, 8, 16945);
    			add_location(p, file$3, 435, 4, 16933);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, button);
    			append_dev(button, img);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_9*/ ctx[41], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(423:0) {#if viewingFilteredCommunityRecipes}",
    		ctx
    	});

    	return block;
    }

    // (433:4) {:else}
    function create_else_block_1$1(ctx) {
    	let p;
    	let t;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("Loading... ");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/clock.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svg");
    			attr_dev(img, "alt", "loading");
    			add_location(img, file$3, 433, 38, 16843);
    			attr_dev(p, "class", "loading");
    			add_location(p, file$3, 433, 8, 16813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			append_dev(p, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(433:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (424:4) {#if unique_category_counts.length > 0}
    function create_if_block_3$2(ctx) {
    	let ul;
    	let each_value_1 = /*unique_category_counts*/ ctx[10];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "list-group");
    			add_location(ul, file$3, 424, 4, 16366);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterCommunityRecipes, current_meal_type, unique_category_counts*/ 17664) {
    				each_value_1 = /*unique_category_counts*/ ctx[10];
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
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(424:4) {#if unique_category_counts.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (426:4) {#each unique_category_counts as ucc}
    function create_each_block_1$1(ctx) {
    	let li;
    	let label;
    	let t0_value = Object.keys(/*ucc*/ ctx[49])[0] + "";
    	let t0;
    	let t1;
    	let span;
    	let t2_value = /*ucc*/ ctx[49][Object.keys(/*ucc*/ ctx[49])[0]] + "";
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler_8() {
    		return /*click_handler_8*/ ctx[40](/*ucc*/ ctx[49]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(label, "class", "recipesNav");
    			add_location(label, file$3, 427, 8, 16614);
    			attr_dev(span, "class", "badge badge-primary badge-pill");
    			add_location(span, file$3, 428, 8, 16678);
    			attr_dev(li, "class", "list-group-item d-flex justify-content-between align-items-center");
    			add_location(li, file$3, 426, 8, 16440);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, label);
    			append_dev(label, t0);
    			append_dev(li, t1);
    			append_dev(li, span);
    			append_dev(span, t2);
    			append_dev(li, t3);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_8, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*unique_category_counts*/ 1024 && t0_value !== (t0_value = Object.keys(/*ucc*/ ctx[49])[0] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*unique_category_counts*/ 1024 && t2_value !== (t2_value = /*ucc*/ ctx[49][Object.keys(/*ucc*/ ctx[49])[0]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(426:4) {#each unique_category_counts as ucc}",
    		ctx
    	});

    	return block;
    }

    // (441:0) {#if viewingCommunityCategoryFilteredRecipes}
    function create_if_block$3(ctx) {
    	let t0;
    	let p;
    	let button;
    	let img;
    	let img_src_value;
    	let t1;
    	let mounted;
    	let dispose;

    	function select_block_type_5(ctx, dirty) {
    		if (/*recipes_ids*/ ctx[1].length > 0) return create_if_block_1$2;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type_5(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t0 = space();
    			p = element("p");
    			button = element("button");
    			img = element("img");
    			t1 = text(" Back");
    			attr_dev(img, "class", "icon");
    			attr_dev(img, "alt", "back");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/chevron-left.svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$3, 453, 116, 17740);
    			attr_dev(button, "class", "btn btn-md btn-secondary");
    			add_location(button, file$3, 453, 4, 17628);
    			add_location(p, file$3, 452, 0, 17620);
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, button);
    			append_dev(button, img);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_10*/ ctx[42], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_5(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(441:0) {#if viewingCommunityCategoryFilteredRecipes}",
    		ctx
    	});

    	return block;
    }

    // (450:0) {:else}
    function create_else_block$3(ctx) {
    	let p;
    	let t;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("Loading... ");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/clock.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svg");
    			attr_dev(img, "alt", "loading");
    			add_location(img, file$3, 450, 34, 17538);
    			attr_dev(p, "class", "loading");
    			add_location(p, file$3, 450, 4, 17508);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			append_dev(p, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(450:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (442:0) {#if recipes_ids.length > 0}
    function create_if_block_1$2(ctx) {
    	let ul;
    	let each_value = /*recipes_ids*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "list-group");
    			add_location(ul, file$3, 442, 0, 17209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*recipes_ids*/ 2) {
    				each_value = /*recipes_ids*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(442:0) {#if recipes_ids.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (444:2) {#each recipes_ids as rn}
    function create_each_block$2(ctx) {
    	let li;
    	let a;
    	let label;
    	let t0_value = Object.keys(/*rn*/ ctx[46])[0] + "";
    	let t0;
    	let a_href_value;
    	let link_action;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(label, "class", "recipesNav");
    			add_location(label, file$3, 445, 67, 17411);
    			attr_dev(a, "href", a_href_value = "/food/recipes/" + /*rn*/ ctx[46][Object.keys(/*rn*/ ctx[46])[0]]);
    			add_location(a, file$3, 445, 6, 17350);
    			attr_dev(li, "class", "list-group-item d-flex justify-content-between align-items-center");
    			add_location(li, file$3, 444, 4, 17265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, label);
    			append_dev(label, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*recipes_ids*/ 2 && t0_value !== (t0_value = Object.keys(/*rn*/ ctx[46])[0] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*recipes_ids*/ 2 && a_href_value !== (a_href_value = "/food/recipes/" + /*rn*/ ctx[46][Object.keys(/*rn*/ ctx[46])[0]])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(444:2) {#each recipes_ids as rn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div3;
    	let div0;
    	let button0;
    	let t1;
    	let div1;
    	let t3;
    	let div2;
    	let button1;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let if_block5_anchor;
    	let mounted;
    	let dispose;
    	let if_block0 = /*viewingMyRecipes*/ ctx[4] && create_if_block_11(ctx);
    	let if_block1 = /*viewingMyFilteredRecipes*/ ctx[2] && create_if_block_9(ctx);
    	let if_block2 = /*viewingMyCategoryFilteredRecipes*/ ctx[3] && create_if_block_7$1(ctx);
    	let if_block3 = /*viewingCommunityRecipes*/ ctx[5] && create_if_block_4$2(ctx);
    	let if_block4 = /*viewingFilteredCommunityRecipes*/ ctx[6] && create_if_block_2$2(ctx);
    	let if_block5 = /*viewingCommunityCategoryFilteredRecipes*/ ctx[7] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "View My Recipes";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = " ";
    			t3 = space();
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = "Learn a Community Recipe";
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			if (if_block2) if_block2.c();
    			t8 = space();
    			if (if_block3) if_block3.c();
    			t9 = space();
    			if (if_block4) if_block4.c();
    			t10 = space();
    			if (if_block5) if_block5.c();
    			if_block5_anchor = empty();
    			attr_dev(button0, "class", "btn btn-md btn-outline-success");
    			add_location(button0, file$3, 336, 4, 12745);
    			attr_dev(div0, "class", "col-md-5");
    			add_location(div0, file$3, 335, 2, 12718);
    			attr_dev(div1, "class", "col-md-1");
    			add_location(div1, file$3, 339, 2, 12862);
    			attr_dev(button1, "class", "btn btn-md btn-outline-info");
    			add_location(button1, file$3, 342, 4, 12927);
    			attr_dev(div2, "class", "col-sm-5");
    			add_location(div2, file$3, 341, 2, 12900);
    			attr_dev(div3, "class", "row text-center");
    			add_location(div3, file$3, 334, 0, 12686);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, button0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, button1);
    			insert_dev(target, t5, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t6, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t7, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t8, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t9, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, t10, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, if_block5_anchor, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[32], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[33], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*viewingMyRecipes*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_11(ctx);
    					if_block0.c();
    					if_block0.m(t6.parentNode, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*viewingMyFilteredRecipes*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					if_block1.m(t7.parentNode, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*viewingMyCategoryFilteredRecipes*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_7$1(ctx);
    					if_block2.c();
    					if_block2.m(t8.parentNode, t8);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*viewingCommunityRecipes*/ ctx[5]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_4$2(ctx);
    					if_block3.c();
    					if_block3.m(t9.parentNode, t9);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*viewingFilteredCommunityRecipes*/ ctx[6]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_2$2(ctx);
    					if_block4.c();
    					if_block4.m(t10.parentNode, t10);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*viewingCommunityCategoryFilteredRecipes*/ ctx[7]) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block$3(ctx);
    					if_block5.c();
    					if_block5.m(if_block5_anchor.parentNode, if_block5_anchor);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t5);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t6);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t7);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t8);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t9);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(t10);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(if_block5_anchor);
    			mounted = false;
    			run_all(dispose);
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
    	let $claims;
    	validate_store(claims, 'claims');
    	component_subscribe($$self, claims, $$value => $$invalidate(43, $claims = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Food', slots, []);
    	let { hasura_userID } = $$props;
    	let { loadingRecipes = false } = $$props;
    	let { recipes = [] } = $$props;
    	let { possible_ingredients = [] } = $$props;
    	let { filteredCommunityRecipes = {} } = $$props;
    	let { filteredMyRecipes = [] } = $$props;
    	let { recipeNames = [] } = $$props;
    	let { recipes_ids = [] } = $$props;
    	let { viewingMyFilteredRecipes } = $$props;
    	let { viewingMyCategoryFilteredRecipes } = $$props;
    	let { viewingRecipes, viewingMyRecipes, communityRecipe, viewingCommunityRecipe, viewingCommunityRecipes, viewingFilteredCommunityRecipes, viewingCommunityCategoryFilteredRecipes, viewingInventory, viewingIngredients, enteringRecipe, enteringIngredient } = $$props;
    	let { communityRecipeIngredients } = $$props;
    	let { current_meal_type } = $$props;
    	let { current_category } = $$props;
    	let { unique_meal_types = [] } = $$props;
    	let { unique_meal_types_counts = [] } = $$props;
    	let { unique_categories = [] } = $$props;
    	let { unique_category_counts = [] } = $$props;

    	claims.subscribe(v => {
    		if ($claims) {
    			getPossibleRecipes();
    		}
    	});

    	async function viewMyRecipes() {
    		$$invalidate(0, loadingRecipes = true);
    		$$invalidate(4, viewingMyRecipes = true);
    		console.log("SET VIEWING MY RECIPES TO TRUE");
    		$$invalidate(2, viewingMyFilteredRecipes = false);
    		$$invalidate(3, viewingMyCategoryFilteredRecipes = false);
    		$$invalidate(5, viewingCommunityRecipes = false);
    		$$invalidate(6, viewingFilteredCommunityRecipes = false);
    		$$invalidate(7, viewingCommunityCategoryFilteredRecipes = false);
    		$$invalidate(23, unique_categories = []);
    		$$invalidate(10, unique_category_counts = []);
    		$$invalidate(22, unique_meal_types = []);
    		$$invalidate(9, unique_meal_types_counts = []);
    		getPossibleRecipes();
    	}

    	async function filterMyRecipes(parent_meal, parent_category, recipe_name) {
    		$$invalidate(4, viewingMyRecipes = false);
    		let q = ``;
    		$$invalidate(10, unique_category_counts = []);
    		$$invalidate(23, unique_categories = []);
    		$$invalidate(23, unique_categories);
    		$$invalidate(10, unique_category_counts);

    		if (parent_meal != null && parent_category != null && recipe_name == null) {
    			console.log("second level filter!");
    			$$invalidate(3, viewingMyCategoryFilteredRecipes = true);
    			$$invalidate(2, viewingMyFilteredRecipes = false);
    			$$invalidate(17, recipeNames = []);
    			$$invalidate(17, recipeNames);
    			$$invalidate(1, recipes_ids = []);
    			$$invalidate(1, recipes_ids);

    			q = `
                {
                    users_recipes(where: {recipes: {Meal_Type: {_eq: "` + parent_meal + `"}, Category: {_eq: "` + parent_category + `"}}}) {
                        recipes {
                        Meal_Type
                        Category
                        Recipe
                        id
                        }
                    }
                }
                `;

    			$$invalidate(21, current_category = parent_category);
    		} else if (parent_category == null && recipe_name == null) {
    			console.log("top level filter!");
    			$$invalidate(2, viewingMyFilteredRecipes = true);
    			$$invalidate(3, viewingMyCategoryFilteredRecipes = false);

    			q = `
                {
                    users_recipes(where: {recipes: {Meal_Type: {_eq: "` + parent_meal + `"}}}) {
                        recipes {
                        Meal_Type
                        Category
                        Recipe
                        }
                        id
                    }
                }
                `;

    			$$invalidate(8, current_meal_type = parent_meal);
    		} else {
    			console.log("third level filter! show him the recipe names.");

    			q = `

            `;
    		}

    		let temp = await executeGraphql(q, $claims);
    		console.log(temp.data.users_recipes);
    		$$invalidate(16, filteredMyRecipes = temp.data.users_recipes);

    		for (var i = 0; i < filteredMyRecipes.length; i++) {
    			recipeNames.push('"' + filteredMyRecipes[i]["recipes"]["Recipe"] + '"');
    			let recipe_id_mapping = {};
    			recipe_id_mapping[filteredMyRecipes[i]["recipes"]["Recipe"]] = filteredMyRecipes[i]["recipes"]["id"];
    			recipes_ids.push(recipe_id_mapping);

    			if (!unique_categories.includes(filteredMyRecipes[i]["recipes"]["Category"])) {
    				unique_categories.push(filteredMyRecipes[i]["recipes"]["Category"]);
    			}
    		}

    		console.log(recipeNames);
    		$$invalidate(17, recipeNames);
    		$$invalidate(1, recipes_ids);

    		for (var i = 0; i < unique_categories.length; i++) {
    			q = `
                {
                    recipes_aggregate(where: {Category: {_eq: "` + unique_categories[i] + `"}, Meal_Type: {_eq: "` + parent_meal + `"} Recipe: {_in: [` + recipeNames + `]}}) {
                        aggregate {
                        count
                        }
                    }
                }
                `;

    			temp = await executeGraphql(q, $claims);
    			let category_count_mapping = {};
    			category_count_mapping[unique_categories[i]] = temp.data.recipes_aggregate.aggregate.count;
    			unique_category_counts.push(category_count_mapping);
    		}

    		$$invalidate(10, unique_category_counts);
    	}

    	async function viewCommunityRecipes() {
    		$$invalidate(5, viewingCommunityRecipes = true);
    		$$invalidate(6, viewingFilteredCommunityRecipes = false);
    		$$invalidate(4, viewingMyRecipes = false);
    		$$invalidate(2, viewingMyFilteredRecipes = false);
    		$$invalidate(3, viewingMyCategoryFilteredRecipes = false);
    		$$invalidate(7, viewingCommunityCategoryFilteredRecipes = false);
    		$$invalidate(10, unique_category_counts = []);
    		$$invalidate(23, unique_categories = []);
    		$$invalidate(22, unique_meal_types = []);
    		$$invalidate(9, unique_meal_types_counts = []);
    		$$invalidate(1, recipes_ids = []);
    		$$invalidate(1, recipes_ids);
    		$$invalidate(23, unique_categories);
    		$$invalidate(22, unique_meal_types);
    		$$invalidate(10, unique_category_counts);
    		$$invalidate(9, unique_meal_types_counts);
    		console.log($claims);

    		let q = `
                {
                recipes(where: {Shareable: {_eq: true}}, order_by: {Meal_Type: asc}) {
                    Recipe
                    Meal_Type
                    Category
                    id
                }
                }
                `;

    		let temp = await executeGraphql(q, $claims);
    		let communityRecipes = temp.data.recipes;

    		for (var i = 0; i < communityRecipes.length; i++) {
    			recipeNames.push('"' + communityRecipes[i]["Recipe"] + '"');
    			let recipe_id_mapping = {};
    			recipe_id_mapping[communityRecipes[i]["Recipe"]] = communityRecipes[i]["id"];
    			recipes_ids.push(recipe_id_mapping);

    			if (!unique_meal_types.includes(communityRecipes[i]["Meal_Type"])) {
    				unique_meal_types.push(communityRecipes[i]["Meal_Type"]);
    			}
    		}

    		console.log(unique_meal_types);

    		for (var i = 0; i < unique_meal_types.length; i++) {
    			q = `
                {
                    recipes_aggregate(where: {Meal_Type: {_eq: "` + unique_meal_types[i] + `"}}) {
                        aggregate {
                        count
                        }
                    }
                }
                `;

    			temp = await executeGraphql(q, $claims);
    			let category_count_mapping = {};
    			category_count_mapping[unique_meal_types[i]] = temp.data.recipes_aggregate.aggregate.count;
    			unique_meal_types_counts.push(category_count_mapping);
    		}

    		$$invalidate(9, unique_meal_types_counts);
    		$$invalidate(1, recipes_ids);
    		console.log(recipes_ids);
    		console.log(unique_meal_types_counts);
    	}

    	async function filterCommunityRecipes(parent_meal_type, parent_category, recipe_name) {
    		$$invalidate(1, recipes_ids = []);
    		$$invalidate(1, recipes_ids);
    		$$invalidate(5, viewingCommunityRecipes = false);
    		let q = ``;
    		let temp;
    		console.log(parent_meal_type);

    		if (parent_meal_type != null && parent_category == null && recipe_name == null) {
    			console.log("top level filter!");
    			$$invalidate(23, unique_categories = []);
    			$$invalidate(10, unique_category_counts = []);
    			$$invalidate(22, unique_meal_types = []);
    			$$invalidate(9, unique_meal_types_counts = []);
    			$$invalidate(23, unique_categories);
    			$$invalidate(10, unique_category_counts);
    			$$invalidate(22, unique_meal_types);
    			$$invalidate(9, unique_meal_types_counts);
    			$$invalidate(6, viewingFilteredCommunityRecipes = true);
    			$$invalidate(7, viewingCommunityCategoryFilteredRecipes = false);

    			q = `
                {
                recipes(where: {Shareable: {_eq: true}, Meal_Type: {_eq: "` + parent_meal_type + `"}}, order_by: {Category: asc}) {
                    Recipe
                    Meal_Type
                    Category
                    id
                }
                }
              `;
    		} else if (parent_meal_type != null && parent_category != null && recipe_name == null) {
    			console.log("second level filter!");
    			$$invalidate(7, viewingCommunityCategoryFilteredRecipes = true);
    			$$invalidate(6, viewingFilteredCommunityRecipes = false);

    			q = `
                {
                recipes(where: {Shareable: {_eq: true}, Meal_Type: {_eq: "` + parent_meal_type + `"}, Category: {_eq: "` + parent_category + `"}}, order_by: {Category: asc}) {
                    Recipe
                    Meal_Type
                    Category
                    id
                }
                }
            `;
    		}

    		temp = await executeGraphql(q, $claims);
    		temp = temp.data.recipes;

    		for (var i = 0; i < temp.length; i++) {
    			let recipe_id_mapping = {};
    			recipe_id_mapping[temp[i]["Recipe"]] = temp[i]["id"];
    			recipes_ids.push(recipe_id_mapping);

    			if (!unique_categories.includes(temp[i]["Category"])) {
    				unique_categories.push(temp[i]["Category"]);
    			}
    		}

    		$$invalidate(23, unique_categories);
    		$$invalidate(1, recipes_ids);

    		for (var i = 0; i < unique_categories.length; i++) {
    			q = `
                {
                    recipes_aggregate(where: {Category: {_eq: "` + unique_categories[i] + `"}, Meal_Type: {_eq: "` + parent_meal_type + `"}}) {
                        aggregate {
                        count
                        }
                    }
                }
                `;

    			temp = await executeGraphql(q, $claims);
    			let category_count_mapping = {};
    			category_count_mapping[unique_categories[i]] = temp.data.recipes_aggregate.aggregate.count;
    			unique_category_counts.push(category_count_mapping);
    		}

    		$$invalidate(8, current_meal_type = parent_meal_type);
    		$$invalidate(10, unique_category_counts);
    	}

    	async function viewIngredients() {
    		$$invalidate(20, viewingIngredients = true);
    		$$invalidate(18, viewingRecipes = false);
    		$$invalidate(19, viewingInventory = false);
    	}

    	async function getPossibleRecipes() {
    		let q = `
      {
        users_recipes(order_by: {recipes: {Meal_Type: asc}}) {
          recipes {
            Recipe
            id
            Meal_Type
            Category
            Subcategory
          }
        }
      }

      `;

    		let temp = await executeGraphql(q, $claims);
    		$$invalidate(15, recipes = temp.data.users_recipes);
    		let recipeNames = [];

    		for (var i = 0; i < recipes.length; i++) {
    			if (!unique_meal_types.includes(recipes[i]["recipes"]["Meal_Type"])) {
    				unique_meal_types.push(recipes[i]["recipes"]["Meal_Type"]);
    			}

    			recipeNames.push('"' + recipes[i]["recipes"]["Recipe"] + '"');
    		}

    		for (var i = 0; i < unique_meal_types.length; i++) {
    			q = `
            {
                recipes_aggregate(where: {Meal_Type: {_eq: "` + unique_meal_types[i] + `"}, Recipe: {_in: [` + recipeNames + `]}}) {
                    aggregate {
                    count
                    }
                }
            }
            `;

    			temp = await executeGraphql(q, $claims);
    			let meal_type_count_mapping = {};
    			meal_type_count_mapping[unique_meal_types[i]] = temp.data.recipes_aggregate.aggregate.count;
    			unique_meal_types_counts.push(meal_type_count_mapping);
    		}

    		$$invalidate(22, unique_meal_types);
    		$$invalidate(9, unique_meal_types_counts);
    		$$invalidate(0, loadingRecipes = false);
    		console.log(unique_meal_types_counts);
    	}

    	onMount(async () => {
    		
    	});

    	const writable_props = [
    		'hasura_userID',
    		'loadingRecipes',
    		'recipes',
    		'possible_ingredients',
    		'filteredCommunityRecipes',
    		'filteredMyRecipes',
    		'recipeNames',
    		'recipes_ids',
    		'viewingMyFilteredRecipes',
    		'viewingMyCategoryFilteredRecipes',
    		'viewingRecipes',
    		'viewingMyRecipes',
    		'communityRecipe',
    		'viewingCommunityRecipe',
    		'viewingCommunityRecipes',
    		'viewingFilteredCommunityRecipes',
    		'viewingCommunityCategoryFilteredRecipes',
    		'viewingInventory',
    		'viewingIngredients',
    		'enteringRecipe',
    		'enteringIngredient',
    		'communityRecipeIngredients',
    		'current_meal_type',
    		'current_category',
    		'unique_meal_types',
    		'unique_meal_types_counts',
    		'unique_categories',
    		'unique_category_counts'
    	];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Food> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => viewMyRecipes();
    	const click_handler_1 = () => viewCommunityRecipes();
    	const click_handler_2 = umt => filterMyRecipes(Object.keys(umt)[0], null, null);
    	const click_handler_3 = () => viewCommunityRecipes();
    	const click_handler_4 = ucc => filterMyRecipes(current_meal_type, Object.keys(ucc)[0], null);
    	const click_handler_5 = () => viewMyRecipes();
    	const click_handler_6 = () => filterMyRecipes(current_meal_type, null, null);
    	const click_handler_7 = umt => filterCommunityRecipes(Object.keys(umt)[0], null, null);
    	const click_handler_8 = ucc => filterCommunityRecipes(current_meal_type, Object.keys(ucc)[0], null);
    	const click_handler_9 = () => viewCommunityRecipes();
    	const click_handler_10 = () => filterCommunityRecipes(current_meal_type, null, null);

    	$$self.$$set = $$props => {
    		if ('hasura_userID' in $$props) $$invalidate(24, hasura_userID = $$props.hasura_userID);
    		if ('loadingRecipes' in $$props) $$invalidate(0, loadingRecipes = $$props.loadingRecipes);
    		if ('recipes' in $$props) $$invalidate(15, recipes = $$props.recipes);
    		if ('possible_ingredients' in $$props) $$invalidate(25, possible_ingredients = $$props.possible_ingredients);
    		if ('filteredCommunityRecipes' in $$props) $$invalidate(26, filteredCommunityRecipes = $$props.filteredCommunityRecipes);
    		if ('filteredMyRecipes' in $$props) $$invalidate(16, filteredMyRecipes = $$props.filteredMyRecipes);
    		if ('recipeNames' in $$props) $$invalidate(17, recipeNames = $$props.recipeNames);
    		if ('recipes_ids' in $$props) $$invalidate(1, recipes_ids = $$props.recipes_ids);
    		if ('viewingMyFilteredRecipes' in $$props) $$invalidate(2, viewingMyFilteredRecipes = $$props.viewingMyFilteredRecipes);
    		if ('viewingMyCategoryFilteredRecipes' in $$props) $$invalidate(3, viewingMyCategoryFilteredRecipes = $$props.viewingMyCategoryFilteredRecipes);
    		if ('viewingRecipes' in $$props) $$invalidate(18, viewingRecipes = $$props.viewingRecipes);
    		if ('viewingMyRecipes' in $$props) $$invalidate(4, viewingMyRecipes = $$props.viewingMyRecipes);
    		if ('communityRecipe' in $$props) $$invalidate(27, communityRecipe = $$props.communityRecipe);
    		if ('viewingCommunityRecipe' in $$props) $$invalidate(28, viewingCommunityRecipe = $$props.viewingCommunityRecipe);
    		if ('viewingCommunityRecipes' in $$props) $$invalidate(5, viewingCommunityRecipes = $$props.viewingCommunityRecipes);
    		if ('viewingFilteredCommunityRecipes' in $$props) $$invalidate(6, viewingFilteredCommunityRecipes = $$props.viewingFilteredCommunityRecipes);
    		if ('viewingCommunityCategoryFilteredRecipes' in $$props) $$invalidate(7, viewingCommunityCategoryFilteredRecipes = $$props.viewingCommunityCategoryFilteredRecipes);
    		if ('viewingInventory' in $$props) $$invalidate(19, viewingInventory = $$props.viewingInventory);
    		if ('viewingIngredients' in $$props) $$invalidate(20, viewingIngredients = $$props.viewingIngredients);
    		if ('enteringRecipe' in $$props) $$invalidate(29, enteringRecipe = $$props.enteringRecipe);
    		if ('enteringIngredient' in $$props) $$invalidate(30, enteringIngredient = $$props.enteringIngredient);
    		if ('communityRecipeIngredients' in $$props) $$invalidate(31, communityRecipeIngredients = $$props.communityRecipeIngredients);
    		if ('current_meal_type' in $$props) $$invalidate(8, current_meal_type = $$props.current_meal_type);
    		if ('current_category' in $$props) $$invalidate(21, current_category = $$props.current_category);
    		if ('unique_meal_types' in $$props) $$invalidate(22, unique_meal_types = $$props.unique_meal_types);
    		if ('unique_meal_types_counts' in $$props) $$invalidate(9, unique_meal_types_counts = $$props.unique_meal_types_counts);
    		if ('unique_categories' in $$props) $$invalidate(23, unique_categories = $$props.unique_categories);
    		if ('unique_category_counts' in $$props) $$invalidate(10, unique_category_counts = $$props.unique_category_counts);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		markDone,
    		link,
    		executeGraphql,
    		claims,
    		authToken,
    		hasura_userID,
    		loadingRecipes,
    		recipes,
    		possible_ingredients,
    		filteredCommunityRecipes,
    		filteredMyRecipes,
    		recipeNames,
    		recipes_ids,
    		viewingMyFilteredRecipes,
    		viewingMyCategoryFilteredRecipes,
    		viewingRecipes,
    		viewingMyRecipes,
    		communityRecipe,
    		viewingCommunityRecipe,
    		viewingCommunityRecipes,
    		viewingFilteredCommunityRecipes,
    		viewingCommunityCategoryFilteredRecipes,
    		viewingInventory,
    		viewingIngredients,
    		enteringRecipe,
    		enteringIngredient,
    		communityRecipeIngredients,
    		current_meal_type,
    		current_category,
    		unique_meal_types,
    		unique_meal_types_counts,
    		unique_categories,
    		unique_category_counts,
    		viewMyRecipes,
    		filterMyRecipes,
    		viewCommunityRecipes,
    		filterCommunityRecipes,
    		viewIngredients,
    		getPossibleRecipes,
    		$claims
    	});

    	$$self.$inject_state = $$props => {
    		if ('hasura_userID' in $$props) $$invalidate(24, hasura_userID = $$props.hasura_userID);
    		if ('loadingRecipes' in $$props) $$invalidate(0, loadingRecipes = $$props.loadingRecipes);
    		if ('recipes' in $$props) $$invalidate(15, recipes = $$props.recipes);
    		if ('possible_ingredients' in $$props) $$invalidate(25, possible_ingredients = $$props.possible_ingredients);
    		if ('filteredCommunityRecipes' in $$props) $$invalidate(26, filteredCommunityRecipes = $$props.filteredCommunityRecipes);
    		if ('filteredMyRecipes' in $$props) $$invalidate(16, filteredMyRecipes = $$props.filteredMyRecipes);
    		if ('recipeNames' in $$props) $$invalidate(17, recipeNames = $$props.recipeNames);
    		if ('recipes_ids' in $$props) $$invalidate(1, recipes_ids = $$props.recipes_ids);
    		if ('viewingMyFilteredRecipes' in $$props) $$invalidate(2, viewingMyFilteredRecipes = $$props.viewingMyFilteredRecipes);
    		if ('viewingMyCategoryFilteredRecipes' in $$props) $$invalidate(3, viewingMyCategoryFilteredRecipes = $$props.viewingMyCategoryFilteredRecipes);
    		if ('viewingRecipes' in $$props) $$invalidate(18, viewingRecipes = $$props.viewingRecipes);
    		if ('viewingMyRecipes' in $$props) $$invalidate(4, viewingMyRecipes = $$props.viewingMyRecipes);
    		if ('communityRecipe' in $$props) $$invalidate(27, communityRecipe = $$props.communityRecipe);
    		if ('viewingCommunityRecipe' in $$props) $$invalidate(28, viewingCommunityRecipe = $$props.viewingCommunityRecipe);
    		if ('viewingCommunityRecipes' in $$props) $$invalidate(5, viewingCommunityRecipes = $$props.viewingCommunityRecipes);
    		if ('viewingFilteredCommunityRecipes' in $$props) $$invalidate(6, viewingFilteredCommunityRecipes = $$props.viewingFilteredCommunityRecipes);
    		if ('viewingCommunityCategoryFilteredRecipes' in $$props) $$invalidate(7, viewingCommunityCategoryFilteredRecipes = $$props.viewingCommunityCategoryFilteredRecipes);
    		if ('viewingInventory' in $$props) $$invalidate(19, viewingInventory = $$props.viewingInventory);
    		if ('viewingIngredients' in $$props) $$invalidate(20, viewingIngredients = $$props.viewingIngredients);
    		if ('enteringRecipe' in $$props) $$invalidate(29, enteringRecipe = $$props.enteringRecipe);
    		if ('enteringIngredient' in $$props) $$invalidate(30, enteringIngredient = $$props.enteringIngredient);
    		if ('communityRecipeIngredients' in $$props) $$invalidate(31, communityRecipeIngredients = $$props.communityRecipeIngredients);
    		if ('current_meal_type' in $$props) $$invalidate(8, current_meal_type = $$props.current_meal_type);
    		if ('current_category' in $$props) $$invalidate(21, current_category = $$props.current_category);
    		if ('unique_meal_types' in $$props) $$invalidate(22, unique_meal_types = $$props.unique_meal_types);
    		if ('unique_meal_types_counts' in $$props) $$invalidate(9, unique_meal_types_counts = $$props.unique_meal_types_counts);
    		if ('unique_categories' in $$props) $$invalidate(23, unique_categories = $$props.unique_categories);
    		if ('unique_category_counts' in $$props) $$invalidate(10, unique_category_counts = $$props.unique_category_counts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		loadingRecipes,
    		recipes_ids,
    		viewingMyFilteredRecipes,
    		viewingMyCategoryFilteredRecipes,
    		viewingMyRecipes,
    		viewingCommunityRecipes,
    		viewingFilteredCommunityRecipes,
    		viewingCommunityCategoryFilteredRecipes,
    		current_meal_type,
    		unique_meal_types_counts,
    		unique_category_counts,
    		viewMyRecipes,
    		filterMyRecipes,
    		viewCommunityRecipes,
    		filterCommunityRecipes,
    		recipes,
    		filteredMyRecipes,
    		recipeNames,
    		viewingRecipes,
    		viewingInventory,
    		viewingIngredients,
    		current_category,
    		unique_meal_types,
    		unique_categories,
    		hasura_userID,
    		possible_ingredients,
    		filteredCommunityRecipes,
    		communityRecipe,
    		viewingCommunityRecipe,
    		enteringRecipe,
    		enteringIngredient,
    		communityRecipeIngredients,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10
    	];
    }

    class Food extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$5,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				hasura_userID: 24,
    				loadingRecipes: 0,
    				recipes: 15,
    				possible_ingredients: 25,
    				filteredCommunityRecipes: 26,
    				filteredMyRecipes: 16,
    				recipeNames: 17,
    				recipes_ids: 1,
    				viewingMyFilteredRecipes: 2,
    				viewingMyCategoryFilteredRecipes: 3,
    				viewingRecipes: 18,
    				viewingMyRecipes: 4,
    				communityRecipe: 27,
    				viewingCommunityRecipe: 28,
    				viewingCommunityRecipes: 5,
    				viewingFilteredCommunityRecipes: 6,
    				viewingCommunityCategoryFilteredRecipes: 7,
    				viewingInventory: 19,
    				viewingIngredients: 20,
    				enteringRecipe: 29,
    				enteringIngredient: 30,
    				communityRecipeIngredients: 31,
    				current_meal_type: 8,
    				current_category: 21,
    				unique_meal_types: 22,
    				unique_meal_types_counts: 9,
    				unique_categories: 23,
    				unique_category_counts: 10
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Food",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hasura_userID*/ ctx[24] === undefined && !('hasura_userID' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'hasura_userID'");
    		}

    		if (/*viewingMyFilteredRecipes*/ ctx[2] === undefined && !('viewingMyFilteredRecipes' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'viewingMyFilteredRecipes'");
    		}

    		if (/*viewingMyCategoryFilteredRecipes*/ ctx[3] === undefined && !('viewingMyCategoryFilteredRecipes' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'viewingMyCategoryFilteredRecipes'");
    		}

    		if (/*viewingRecipes*/ ctx[18] === undefined && !('viewingRecipes' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'viewingRecipes'");
    		}

    		if (/*viewingMyRecipes*/ ctx[4] === undefined && !('viewingMyRecipes' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'viewingMyRecipes'");
    		}

    		if (/*communityRecipe*/ ctx[27] === undefined && !('communityRecipe' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'communityRecipe'");
    		}

    		if (/*viewingCommunityRecipe*/ ctx[28] === undefined && !('viewingCommunityRecipe' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'viewingCommunityRecipe'");
    		}

    		if (/*viewingCommunityRecipes*/ ctx[5] === undefined && !('viewingCommunityRecipes' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'viewingCommunityRecipes'");
    		}

    		if (/*viewingFilteredCommunityRecipes*/ ctx[6] === undefined && !('viewingFilteredCommunityRecipes' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'viewingFilteredCommunityRecipes'");
    		}

    		if (/*viewingCommunityCategoryFilteredRecipes*/ ctx[7] === undefined && !('viewingCommunityCategoryFilteredRecipes' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'viewingCommunityCategoryFilteredRecipes'");
    		}

    		if (/*viewingInventory*/ ctx[19] === undefined && !('viewingInventory' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'viewingInventory'");
    		}

    		if (/*viewingIngredients*/ ctx[20] === undefined && !('viewingIngredients' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'viewingIngredients'");
    		}

    		if (/*enteringRecipe*/ ctx[29] === undefined && !('enteringRecipe' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'enteringRecipe'");
    		}

    		if (/*enteringIngredient*/ ctx[30] === undefined && !('enteringIngredient' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'enteringIngredient'");
    		}

    		if (/*communityRecipeIngredients*/ ctx[31] === undefined && !('communityRecipeIngredients' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'communityRecipeIngredients'");
    		}

    		if (/*current_meal_type*/ ctx[8] === undefined && !('current_meal_type' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'current_meal_type'");
    		}

    		if (/*current_category*/ ctx[21] === undefined && !('current_category' in props)) {
    			console_1$3.warn("<Food> was created without expected prop 'current_category'");
    		}
    	}

    	get hasura_userID() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasura_userID(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loadingRecipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadingRecipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get recipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get possible_ingredients() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set possible_ingredients(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filteredCommunityRecipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filteredCommunityRecipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filteredMyRecipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filteredMyRecipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get recipeNames() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipeNames(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get recipes_ids() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipes_ids(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingMyFilteredRecipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingMyFilteredRecipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingMyCategoryFilteredRecipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingMyCategoryFilteredRecipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingRecipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingRecipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingMyRecipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingMyRecipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get communityRecipe() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set communityRecipe(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingCommunityRecipe() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingCommunityRecipe(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingCommunityRecipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingCommunityRecipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingFilteredCommunityRecipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingFilteredCommunityRecipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingCommunityCategoryFilteredRecipes() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingCommunityCategoryFilteredRecipes(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingInventory() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingInventory(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewingIngredients() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewingIngredients(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enteringRecipe() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enteringRecipe(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enteringIngredient() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enteringIngredient(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get communityRecipeIngredients() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set communityRecipeIngredients(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get current_meal_type() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_meal_type(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get current_category() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_category(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unique_meal_types() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unique_meal_types(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unique_meal_types_counts() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unique_meal_types_counts(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unique_categories() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unique_categories(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unique_category_counts() {
    		throw new Error("<Food>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unique_category_counts(value) {
    		throw new Error("<Food>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/RecipeNew.svelte generated by Svelte v3.46.4 */

    const { console: console_1$4 } = globals;
    const file$4 = "src/components/RecipeNew.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[40] = list;
    	child_ctx[41] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	return child_ctx;
    }

    // (171:8) {#each possible_ingredients as pos}
    function create_each_block_1$2(ctx) {
    	let input;
    	let input_value_value;
    	let input_id_value;
    	let t0;
    	let label;
    	let t1_value = /*pos*/ ctx[42].Ingredient + "";
    	let t1;
    	let t2;
    	let label_for_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "class", "form-check-input");
    			attr_dev(input, "type", "checkbox");
    			input.__value = input_value_value = /*pos*/ ctx[42];
    			input.value = input.__value;
    			attr_dev(input, "id", input_id_value = "checkbox_" + /*pos*/ ctx[42].id);
    			/*$$binding_groups*/ ctx[16][0].push(input);
    			add_location(input, file$4, 171, 10, 5739);
    			attr_dev(label, "class", "form-check-label");
    			attr_dev(label, "for", label_for_value = "checkbox_" + /*pos*/ ctx[42].id);
    			add_location(label, file$4, 172, 12, 5873);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = ~/*new_recipe_ingredients*/ ctx[2].indexOf(input.__value);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);
    			append_dev(label, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[15]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*possible_ingredients*/ 2 && input_value_value !== (input_value_value = /*pos*/ ctx[42])) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty[0] & /*possible_ingredients*/ 2 && input_id_value !== (input_id_value = "checkbox_" + /*pos*/ ctx[42].id)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty[0] & /*new_recipe_ingredients*/ 4) {
    				input.checked = ~/*new_recipe_ingredients*/ ctx[2].indexOf(input.__value);
    			}

    			if (dirty[0] & /*possible_ingredients*/ 2 && t1_value !== (t1_value = /*pos*/ ctx[42].Ingredient + "")) set_data_dev(t1, t1_value);

    			if (dirty[0] & /*possible_ingredients*/ 2 && label_for_value !== (label_for_value = "checkbox_" + /*pos*/ ctx[42].id)) {
    				attr_dev(label, "for", label_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*$$binding_groups*/ ctx[16][0].splice(/*$$binding_groups*/ ctx[16][0].indexOf(input), 1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(171:8) {#each possible_ingredients as pos}",
    		ctx
    	});

    	return block;
    }

    // (223:4) {#each new_recipe_ingredients as nri, i}
    function create_each_block$3(ctx) {
    	let label;
    	let t0_value = /*nri*/ ctx[39].Ingredient + "";
    	let t0;
    	let t1;
    	let t2_value = /*nri*/ ctx[39].Brand + "";
    	let t2;
    	let t3;
    	let label_for_value;
    	let t4;
    	let div;
    	let input;
    	let input_id_value;
    	let t5;
    	let strong;
    	let t6_value = /*nri*/ ctx[39].Quantity_Measurement + "";
    	let t6;
    	let t7;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[21].call(input, /*each_value*/ ctx[40], /*i*/ ctx[41]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(" (");
    			t2 = text(t2_value);
    			t3 = text(")");
    			t4 = space();
    			div = element("div");
    			input = element("input");
    			t5 = space();
    			strong = element("strong");
    			t6 = text(t6_value);
    			t7 = space();
    			attr_dev(label, "for", label_for_value = /*nri*/ ctx[39].id);
    			attr_dev(label, "class", "col-sm-2 col-form-label");
    			add_location(label, file$4, 223, 5, 8256);
    			attr_dev(input, "id", input_id_value = /*nri*/ ctx[39].id);
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "type", "text");
    			add_location(input, file$4, 225, 6, 8382);
    			add_location(strong, file$4, 225, 84, 8460);
    			attr_dev(div, "class", "col-sm-10");
    			add_location(div, file$4, 224, 5, 8352);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, t2);
    			append_dev(label, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*nri*/ ctx[39].value);
    			append_dev(div, t5);
    			append_dev(div, strong);
    			append_dev(strong, t6);
    			append_dev(div, t7);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*new_recipe_ingredients*/ 4 && t0_value !== (t0_value = /*nri*/ ctx[39].Ingredient + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*new_recipe_ingredients*/ 4 && t2_value !== (t2_value = /*nri*/ ctx[39].Brand + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*new_recipe_ingredients*/ 4 && label_for_value !== (label_for_value = /*nri*/ ctx[39].id)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*new_recipe_ingredients*/ 4 && input_id_value !== (input_id_value = /*nri*/ ctx[39].id)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty[0] & /*new_recipe_ingredients*/ 4 && input.value !== /*nri*/ ctx[39].value) {
    				set_input_value(input, /*nri*/ ctx[39].value);
    			}

    			if (dirty[0] & /*new_recipe_ingredients*/ 4 && t6_value !== (t6_value = /*nri*/ ctx[39].Quantity_Measurement + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(223:4) {#each new_recipe_ingredients as nri, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let h30;
    	let t1;
    	let form1;
    	let div1;
    	let label0;
    	let t3;
    	let div0;
    	let input0;
    	let t4;
    	let h31;
    	let t6;
    	let div3;
    	let div2;
    	let t7;
    	let p0;
    	let button0;
    	let t9;
    	let div12;
    	let div11;
    	let form0;
    	let div5;
    	let label1;
    	let t11;
    	let div4;
    	let input1;
    	let t12;
    	let div7;
    	let label2;
    	let t14;
    	let div6;
    	let input2;
    	let t15;
    	let div9;
    	let label3;
    	let t17;
    	let div8;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let t26;
    	let div10;
    	let button1;
    	let t28;
    	let h32;
    	let t30;
    	let div13;
    	let t31;
    	let h33;
    	let t33;
    	let div14;
    	let label4;
    	let t35;
    	let textarea;
    	let t36;
    	let h34;
    	let t38;
    	let div28;
    	let div22;
    	let div15;
    	let input3;
    	let t39;
    	let label5;
    	let t41;
    	let div16;
    	let input4;
    	let t42;
    	let label6;
    	let t44;
    	let div17;
    	let input5;
    	let t45;
    	let label7;
    	let t47;
    	let div18;
    	let input6;
    	let t48;
    	let label8;
    	let t50;
    	let div19;
    	let input7;
    	let t51;
    	let label9;
    	let t53;
    	let div20;
    	let input8;
    	let t54;
    	let label10;
    	let t56;
    	let div21;
    	let input9;
    	let t57;
    	let label11;
    	let t59;
    	let div27;
    	let div23;
    	let input10;
    	let t60;
    	let label12;
    	let t62;
    	let div24;
    	let input11;
    	let t63;
    	let label13;
    	let t65;
    	let div25;
    	let input12;
    	let t66;
    	let label14;
    	let t68;
    	let div26;
    	let input13;
    	let t69;
    	let label15;
    	let t71;
    	let p1;
    	let t73;
    	let div29;
    	let input14;
    	let t74;
    	let label16;
    	let t76;
    	let br;
    	let t77;
    	let div30;
    	let button2;
    	let t79;
    	let p2;
    	let t81;
    	let a;
    	let img;
    	let img_src_value;
    	let t82;
    	let link_action;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*possible_ingredients*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*new_recipe_ingredients*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h30 = element("h3");
    			h30.textContent = "Add one of your favorite recipes.";
    			t1 = space();
    			form1 = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Recipe Name";
    			t3 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t4 = space();
    			h31 = element("h3");
    			h31.textContent = "Ingredients";
    			t6 = space();
    			div3 = element("div");
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t7 = space();
    			p0 = element("p");
    			button0 = element("button");
    			button0.textContent = "Add missing ingredient";
    			t9 = space();
    			div12 = element("div");
    			div11 = element("div");
    			form0 = element("form");
    			div5 = element("div");
    			label1 = element("label");
    			label1.textContent = "Ingredient";
    			t11 = space();
    			div4 = element("div");
    			input1 = element("input");
    			t12 = space();
    			div7 = element("div");
    			label2 = element("label");
    			label2.textContent = "Brand (Optional)";
    			t14 = space();
    			div6 = element("div");
    			input2 = element("input");
    			t15 = space();
    			div9 = element("div");
    			label3 = element("label");
    			label3.textContent = "How Do You Measure the Quantity?";
    			t17 = space();
    			div8 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Each";
    			option1 = element("option");
    			option1.textContent = "Oz";
    			option2 = element("option");
    			option2.textContent = "Lb";
    			option3 = element("option");
    			option3.textContent = "Grams";
    			option4 = element("option");
    			option4.textContent = "Slices";
    			option5 = element("option");
    			option5.textContent = "Cups";
    			option6 = element("option");
    			option6.textContent = "Tablespoons";
    			option7 = element("option");
    			option7.textContent = "Teaspoons";
    			t26 = space();
    			div10 = element("div");
    			button1 = element("button");
    			button1.textContent = "Add New Ingredient";
    			t28 = space();
    			h32 = element("h3");
    			h32.textContent = "Measurements";
    			t30 = space();
    			div13 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t31 = space();
    			h33 = element("h3");
    			h33.textContent = "Directions";
    			t33 = space();
    			div14 = element("div");
    			label4 = element("label");
    			label4.textContent = "Use periods to differentiate steps.";
    			t35 = space();
    			textarea = element("textarea");
    			t36 = space();
    			h34 = element("h3");
    			h34.textContent = "Category";
    			t38 = space();
    			div28 = element("div");
    			div22 = element("div");
    			div15 = element("div");
    			input3 = element("input");
    			t39 = space();
    			label5 = element("label");
    			label5.textContent = "American";
    			t41 = space();
    			div16 = element("div");
    			input4 = element("input");
    			t42 = space();
    			label6 = element("label");
    			label6.textContent = "Italian";
    			t44 = space();
    			div17 = element("div");
    			input5 = element("input");
    			t45 = space();
    			label7 = element("label");
    			label7.textContent = "French";
    			t47 = space();
    			div18 = element("div");
    			input6 = element("input");
    			t48 = space();
    			label8 = element("label");
    			label8.textContent = "Mexican";
    			t50 = space();
    			div19 = element("div");
    			input7 = element("input");
    			t51 = space();
    			label9 = element("label");
    			label9.textContent = "Chinese";
    			t53 = space();
    			div20 = element("div");
    			input8 = element("input");
    			t54 = space();
    			label10 = element("label");
    			label10.textContent = "Japanese";
    			t56 = space();
    			div21 = element("div");
    			input9 = element("input");
    			t57 = space();
    			label11 = element("label");
    			label11.textContent = "Thai";
    			t59 = space();
    			div27 = element("div");
    			div23 = element("div");
    			input10 = element("input");
    			t60 = space();
    			label12 = element("label");
    			label12.textContent = "Lunch or Dinner";
    			t62 = space();
    			div24 = element("div");
    			input11 = element("input");
    			t63 = space();
    			label13 = element("label");
    			label13.textContent = "Breakfast";
    			t65 = space();
    			div25 = element("div");
    			input12 = element("input");
    			t66 = space();
    			label14 = element("label");
    			label14.textContent = "Snack";
    			t68 = space();
    			div26 = element("div");
    			input13 = element("input");
    			t69 = space();
    			label15 = element("label");
    			label15.textContent = "Drink";
    			t71 = space();
    			p1 = element("p");
    			p1.textContent = " ";
    			t73 = space();
    			div29 = element("div");
    			input14 = element("input");
    			t74 = space();
    			label16 = element("label");
    			label16.textContent = "Share with Community?";
    			t76 = space();
    			br = element("br");
    			t77 = space();
    			div30 = element("div");
    			button2 = element("button");
    			button2.textContent = "Add Recipe to Recipe Book";
    			t79 = space();
    			p2 = element("p");
    			p2.textContent = " ";
    			t81 = space();
    			a = element("a");
    			img = element("img");
    			t82 = text(" Back");
    			attr_dev(h30, "class", "text-center");
    			add_location(h30, file$4, 157, 0, 5190);
    			attr_dev(label0, "for", "new_recipe_name");
    			attr_dev(label0, "class", "col-sm-2 col-form-label");
    			add_location(label0, file$4, 160, 6, 5325);
    			attr_dev(input0, "id", "new_recipe_name");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$4, 162, 8, 5444);
    			attr_dev(div0, "class", "col-sm-10");
    			add_location(div0, file$4, 161, 6, 5412);
    			attr_dev(div1, "class", "form-group row");
    			add_location(div1, file$4, 159, 4, 5290);
    			add_location(h31, file$4, 165, 2, 5581);
    			attr_dev(div2, "class", "form-check");
    			add_location(div2, file$4, 168, 6, 5659);
    			attr_dev(div3, "class", "form-group newRecipeIngredients");
    			add_location(div3, file$4, 167, 4, 5607);
    			attr_dev(button0, "class", "btn btn-md btn-outline-info");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-toggle", "collapse");
    			attr_dev(button0, "data-target", "#collapseExample");
    			attr_dev(button0, "aria-expanded", "false");
    			attr_dev(button0, "aria-controls", "collapseExample");
    			add_location(button0, file$4, 180, 4, 6033);
    			add_location(p0, file$4, 179, 4, 6025);
    			attr_dev(label1, "for", "staticEmail");
    			attr_dev(label1, "class", "col-sm-2 col-form-label");
    			add_location(label1, file$4, 188, 16, 6433);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "new_ingredient");
    			add_location(input1, file$4, 190, 16, 6565);
    			attr_dev(div4, "class", "col-sm-10");
    			add_location(div4, file$4, 189, 16, 6525);
    			attr_dev(div5, "class", "form-group row");
    			add_location(div5, file$4, 187, 12, 6388);
    			attr_dev(label2, "for", "inputPassword");
    			attr_dev(label2, "class", "col-sm-2 col-form-label");
    			add_location(label2, file$4, 194, 16, 6758);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "blah");
    			attr_dev(input2, "placeholder", "Dave's Famous Bread");
    			add_location(input2, file$4, 196, 16, 6898);
    			attr_dev(div6, "class", "col-sm-10");
    			add_location(div6, file$4, 195, 16, 6858);
    			attr_dev(div7, "class", "form-group row");
    			add_location(div7, file$4, 193, 12, 6713);
    			attr_dev(label3, "class", "col-sm-2 col-form-label");
    			add_location(label3, file$4, 200, 20, 7120);
    			option0.__value = "Each";
    			option0.value = option0.__value;
    			add_location(option0, file$4, 203, 28, 7371);
    			option1.__value = "Oz";
    			option1.value = option1.__value;
    			add_location(option1, file$4, 204, 28, 7421);
    			option2.__value = "Lb";
    			option2.value = option2.__value;
    			add_location(option2, file$4, 205, 28, 7469);
    			option3.__value = "Grams";
    			option3.value = option3.__value;
    			add_location(option3, file$4, 206, 28, 7517);
    			option4.__value = "Slices";
    			option4.value = option4.__value;
    			add_location(option4, file$4, 207, 28, 7568);
    			option5.__value = "Cups";
    			option5.value = option5.__value;
    			add_location(option5, file$4, 208, 28, 7620);
    			option6.__value = "Tablespoons";
    			option6.value = option6.__value;
    			add_location(option6, file$4, 209, 28, 7670);
    			option7.__value = "Teaspoons";
    			option7.value = option7.__value;
    			add_location(option7, file$4, 210, 28, 7727);
    			attr_dev(select, "id", "Quantity_Measurement");
    			if (/*new_ingredient_measurement*/ ctx[7] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[19].call(select));
    			add_location(select, file$4, 202, 24, 7268);
    			attr_dev(div8, "class", "col-sm-10");
    			add_location(div8, file$4, 201, 20, 7220);
    			attr_dev(div9, "class", "form-group row");
    			add_location(div9, file$4, 199, 12, 7071);
    			attr_dev(button1, "class", "btn btn-lg btn-primary");
    			add_location(button1, file$4, 215, 16, 7920);
    			attr_dev(div10, "class", "text-center");
    			add_location(div10, file$4, 214, 12, 7878);
    			add_location(form0, file$4, 186, 8, 6343);
    			attr_dev(div11, "class", "card card-body");
    			add_location(div11, file$4, 185, 4, 6306);
    			attr_dev(div12, "class", "collapse");
    			attr_dev(div12, "id", "collapseExample");
    			add_location(div12, file$4, 184, 4, 6258);
    			add_location(h32, file$4, 220, 2, 8151);
    			attr_dev(div13, "class", "form-group row");
    			add_location(div13, file$4, 221, 4, 8177);
    			add_location(h33, file$4, 230, 2, 8543);
    			attr_dev(label4, "for", "new_recipe_directions_1");
    			add_location(label4, file$4, 232, 12, 8608);
    			attr_dev(textarea, "id", "new_recipe_directions_1");
    			attr_dev(textarea, "class", "form-control");
    			add_location(textarea, file$4, 233, 6, 8695);
    			attr_dev(div14, "class", "form-group row");
    			add_location(div14, file$4, 231, 4, 8567);
    			add_location(h34, file$4, 236, 4, 8815);
    			attr_dev(input3, "class", "form-check-input");
    			attr_dev(input3, "type", "radio");
    			input3.__value = "American";
    			input3.value = input3.__value;
    			attr_dev(input3, "id", "exampleRadios1");
    			/*$$binding_groups*/ ctx[16][1].push(input3);
    			add_location(input3, file$4, 240, 16, 8939);
    			attr_dev(label5, "class", "form-check-label");
    			attr_dev(label5, "for", "exampleRadios1");
    			add_location(label5, file$4, 241, 16, 9071);
    			attr_dev(div15, "class", "form-check");
    			add_location(div15, file$4, 239, 12, 8898);
    			attr_dev(input4, "class", "form-check-input");
    			attr_dev(input4, "type", "radio");
    			input4.__value = "Italian";
    			input4.value = input4.__value;
    			attr_dev(input4, "id", "exampleRadios2");
    			/*$$binding_groups*/ ctx[16][1].push(input4);
    			add_location(input4, file$4, 246, 16, 9251);
    			attr_dev(label6, "class", "form-check-label");
    			attr_dev(label6, "for", "exampleRadios2");
    			add_location(label6, file$4, 247, 16, 9382);
    			attr_dev(div16, "class", "form-check");
    			add_location(div16, file$4, 245, 12, 9210);
    			attr_dev(input5, "class", "form-check-input");
    			attr_dev(input5, "type", "radio");
    			input5.__value = "French";
    			input5.value = input5.__value;
    			attr_dev(input5, "id", "exampleRadios3");
    			/*$$binding_groups*/ ctx[16][1].push(input5);
    			add_location(input5, file$4, 252, 16, 9561);
    			attr_dev(label7, "class", "form-check-label");
    			attr_dev(label7, "for", "exampleRadios3");
    			add_location(label7, file$4, 253, 16, 9691);
    			attr_dev(div17, "class", "form-check");
    			add_location(div17, file$4, 251, 12, 9520);
    			attr_dev(input6, "class", "form-check-input");
    			attr_dev(input6, "type", "radio");
    			input6.__value = "Mexican";
    			input6.value = input6.__value;
    			attr_dev(input6, "id", "exampleRadios4");
    			/*$$binding_groups*/ ctx[16][1].push(input6);
    			add_location(input6, file$4, 258, 16, 9877);
    			attr_dev(label8, "class", "form-check-label");
    			attr_dev(label8, "for", "exampleRadios4");
    			add_location(label8, file$4, 259, 16, 10008);
    			attr_dev(div18, "class", "form-check");
    			add_location(div18, file$4, 257, 12, 9836);
    			attr_dev(input7, "class", "form-check-input");
    			attr_dev(input7, "type", "radio");
    			input7.__value = "Chinese";
    			input7.value = input7.__value;
    			attr_dev(input7, "id", "exampleRadios5");
    			/*$$binding_groups*/ ctx[16][1].push(input7);
    			add_location(input7, file$4, 264, 16, 10187);
    			attr_dev(label9, "class", "form-check-label");
    			attr_dev(label9, "for", "exampleRadios5");
    			add_location(label9, file$4, 265, 16, 10318);
    			attr_dev(div19, "class", "form-check");
    			add_location(div19, file$4, 263, 12, 10146);
    			attr_dev(input8, "class", "form-check-input");
    			attr_dev(input8, "type", "radio");
    			input8.__value = "Japanese";
    			input8.value = input8.__value;
    			attr_dev(input8, "id", "exampleRadios6");
    			/*$$binding_groups*/ ctx[16][1].push(input8);
    			add_location(input8, file$4, 270, 16, 10501);
    			attr_dev(label10, "class", "form-check-label");
    			attr_dev(label10, "for", "exampleRadios6");
    			add_location(label10, file$4, 271, 16, 10633);
    			attr_dev(div20, "class", "form-check");
    			add_location(div20, file$4, 269, 12, 10460);
    			attr_dev(input9, "class", "form-check-input");
    			attr_dev(input9, "type", "radio");
    			input9.__value = "Thai";
    			input9.value = input9.__value;
    			attr_dev(input9, "id", "exampleRadios7");
    			/*$$binding_groups*/ ctx[16][1].push(input9);
    			add_location(input9, file$4, 276, 16, 10817);
    			attr_dev(label11, "class", "form-check-label");
    			attr_dev(label11, "for", "exampleRadios7");
    			add_location(label11, file$4, 277, 16, 10945);
    			attr_dev(div21, "class", "form-check");
    			add_location(div21, file$4, 275, 12, 10776);
    			attr_dev(div22, "class", "col-sm-2");
    			add_location(div22, file$4, 238, 8, 8863);
    			attr_dev(input10, "class", "form-check-input");
    			attr_dev(input10, "type", "radio");
    			input10.__value = "Lunch or Dinner";
    			input10.value = input10.__value;
    			attr_dev(input10, "id", "xampleRadios1");
    			/*$$binding_groups*/ ctx[16][2].push(input10);
    			add_location(input10, file$4, 284, 16, 11188);
    			attr_dev(label12, "class", "form-check-label");
    			attr_dev(label12, "for", "xampleRadios1");
    			add_location(label12, file$4, 285, 16, 11327);
    			attr_dev(div23, "class", "form-check");
    			add_location(div23, file$4, 283, 12, 11147);
    			attr_dev(input11, "class", "form-check-input");
    			attr_dev(input11, "type", "radio");
    			input11.__value = "Breakfast";
    			input11.value = input11.__value;
    			attr_dev(input11, "id", "xampleRadios2");
    			/*$$binding_groups*/ ctx[16][2].push(input11);
    			add_location(input11, file$4, 290, 16, 11513);
    			attr_dev(label13, "class", "form-check-label");
    			attr_dev(label13, "for", "xampleRadios2");
    			add_location(label13, file$4, 291, 16, 11646);
    			attr_dev(div24, "class", "form-check");
    			add_location(div24, file$4, 289, 12, 11472);
    			attr_dev(input12, "class", "form-check-input");
    			attr_dev(input12, "type", "radio");
    			input12.__value = "Snacks";
    			input12.value = input12.__value;
    			attr_dev(input12, "id", "xampleRadios3");
    			/*$$binding_groups*/ ctx[16][2].push(input12);
    			add_location(input12, file$4, 296, 16, 11826);
    			attr_dev(label14, "class", "form-check-label");
    			attr_dev(label14, "for", "xampleRadios3");
    			add_location(label14, file$4, 297, 16, 11956);
    			attr_dev(div25, "class", "form-check");
    			add_location(div25, file$4, 295, 12, 11785);
    			attr_dev(input13, "class", "form-check-input");
    			attr_dev(input13, "type", "radio");
    			input13.__value = "Drinks";
    			input13.value = input13.__value;
    			attr_dev(input13, "id", "xampleRadios4");
    			/*$$binding_groups*/ ctx[16][2].push(input13);
    			add_location(input13, file$4, 302, 16, 12132);
    			attr_dev(label15, "class", "form-check-label");
    			attr_dev(label15, "for", "xampleRadios4");
    			add_location(label15, file$4, 303, 16, 12262);
    			attr_dev(div26, "class", "form-check");
    			add_location(div26, file$4, 301, 12, 12091);
    			attr_dev(div27, "class", "col-sm-2");
    			add_location(div27, file$4, 282, 8, 11112);
    			attr_dev(div28, "class", "row");
    			add_location(div28, file$4, 237, 4, 8837);
    			add_location(p1, file$4, 310, 4, 12429);
    			attr_dev(input14, "id", "share");
    			attr_dev(input14, "class", "form-check-input");
    			input14.checked = true;
    			attr_dev(input14, "type", "checkbox");
    			add_location(input14, file$4, 313, 6, 12483);
    			attr_dev(label16, "class", "form-check-label");
    			attr_dev(label16, "for", "share");
    			add_location(label16, file$4, 313, 119, 12596);
    			attr_dev(div29, "class", "form-check row");
    			add_location(div29, file$4, 312, 4, 12448);
    			add_location(br, file$4, 315, 4, 12685);
    			attr_dev(button2, "class", "btn btn-lg btn-success");
    			add_location(button2, file$4, 317, 8, 12730);
    			attr_dev(div30, "class", "text-center");
    			add_location(div30, file$4, 316, 4, 12696);
    			add_location(form1, file$4, 158, 0, 5253);
    			add_location(p2, file$4, 322, 0, 12880);
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/chevron-left.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "icon");
    			attr_dev(img, "alt", "back");
    			add_location(img, file$4, 323, 65, 12959);
    			attr_dev(a, "href", "/food");
    			attr_dev(a, "class", "btn btn-md btn-outline-dark");
    			add_location(a, file$4, 323, 4, 12898);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h30, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form1, anchor);
    			append_dev(form1, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*new_recipe_name*/ ctx[0]);
    			append_dev(form1, t4);
    			append_dev(form1, h31);
    			append_dev(form1, t6);
    			append_dev(form1, div3);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			append_dev(form1, t7);
    			append_dev(form1, p0);
    			append_dev(p0, button0);
    			append_dev(form1, t9);
    			append_dev(form1, div12);
    			append_dev(div12, div11);
    			append_dev(div11, form0);
    			append_dev(form0, div5);
    			append_dev(div5, label1);
    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div4, input1);
    			set_input_value(input1, /*new_ingredient_name*/ ctx[5]);
    			append_dev(form0, t12);
    			append_dev(form0, div7);
    			append_dev(div7, label2);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div6, input2);
    			set_input_value(input2, /*new_ingredient_brand*/ ctx[6]);
    			append_dev(form0, t15);
    			append_dev(form0, div9);
    			append_dev(div9, label3);
    			append_dev(div9, t17);
    			append_dev(div9, div8);
    			append_dev(div8, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			append_dev(select, option6);
    			append_dev(select, option7);
    			select_option(select, /*new_ingredient_measurement*/ ctx[7]);
    			append_dev(form0, t26);
    			append_dev(form0, div10);
    			append_dev(div10, button1);
    			append_dev(form1, t28);
    			append_dev(form1, h32);
    			append_dev(form1, t30);
    			append_dev(form1, div13);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div13, null);
    			}

    			append_dev(form1, t31);
    			append_dev(form1, h33);
    			append_dev(form1, t33);
    			append_dev(form1, div14);
    			append_dev(div14, label4);
    			append_dev(div14, t35);
    			append_dev(div14, textarea);
    			set_input_value(textarea, /*new_recipe_directions_1*/ ctx[3]);
    			append_dev(form1, t36);
    			append_dev(form1, h34);
    			append_dev(form1, t38);
    			append_dev(form1, div28);
    			append_dev(div28, div22);
    			append_dev(div22, div15);
    			append_dev(div15, input3);
    			input3.checked = input3.__value === /*new_recipe_category*/ ctx[9];
    			append_dev(div15, t39);
    			append_dev(div15, label5);
    			append_dev(div22, t41);
    			append_dev(div22, div16);
    			append_dev(div16, input4);
    			input4.checked = input4.__value === /*new_recipe_category*/ ctx[9];
    			append_dev(div16, t42);
    			append_dev(div16, label6);
    			append_dev(div22, t44);
    			append_dev(div22, div17);
    			append_dev(div17, input5);
    			input5.checked = input5.__value === /*new_recipe_category*/ ctx[9];
    			append_dev(div17, t45);
    			append_dev(div17, label7);
    			append_dev(div22, t47);
    			append_dev(div22, div18);
    			append_dev(div18, input6);
    			input6.checked = input6.__value === /*new_recipe_category*/ ctx[9];
    			append_dev(div18, t48);
    			append_dev(div18, label8);
    			append_dev(div22, t50);
    			append_dev(div22, div19);
    			append_dev(div19, input7);
    			input7.checked = input7.__value === /*new_recipe_category*/ ctx[9];
    			append_dev(div19, t51);
    			append_dev(div19, label9);
    			append_dev(div22, t53);
    			append_dev(div22, div20);
    			append_dev(div20, input8);
    			input8.checked = input8.__value === /*new_recipe_category*/ ctx[9];
    			append_dev(div20, t54);
    			append_dev(div20, label10);
    			append_dev(div22, t56);
    			append_dev(div22, div21);
    			append_dev(div21, input9);
    			input9.checked = input9.__value === /*new_recipe_category*/ ctx[9];
    			append_dev(div21, t57);
    			append_dev(div21, label11);
    			append_dev(div28, t59);
    			append_dev(div28, div27);
    			append_dev(div27, div23);
    			append_dev(div23, input10);
    			input10.checked = input10.__value === /*new_recipe_meal_type*/ ctx[8];
    			append_dev(div23, t60);
    			append_dev(div23, label12);
    			append_dev(div27, t62);
    			append_dev(div27, div24);
    			append_dev(div24, input11);
    			input11.checked = input11.__value === /*new_recipe_meal_type*/ ctx[8];
    			append_dev(div24, t63);
    			append_dev(div24, label13);
    			append_dev(div27, t65);
    			append_dev(div27, div25);
    			append_dev(div25, input12);
    			input12.checked = input12.__value === /*new_recipe_meal_type*/ ctx[8];
    			append_dev(div25, t66);
    			append_dev(div25, label14);
    			append_dev(div27, t68);
    			append_dev(div27, div26);
    			append_dev(div26, input13);
    			input13.checked = input13.__value === /*new_recipe_meal_type*/ ctx[8];
    			append_dev(div26, t69);
    			append_dev(div26, label15);
    			append_dev(form1, t71);
    			append_dev(form1, p1);
    			append_dev(form1, t73);
    			append_dev(form1, div29);
    			append_dev(div29, input14);
    			set_input_value(input14, /*new_recipe_ingredient_shareable*/ ctx[4]);
    			append_dev(div29, t74);
    			append_dev(div29, label16);
    			append_dev(form1, t76);
    			append_dev(form1, br);
    			append_dev(form1, t77);
    			append_dev(form1, div30);
    			append_dev(div30, button2);
    			insert_dev(target, t79, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t81, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    			append_dev(a, t82);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[17]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[18]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[19]),
    					listen_dev(button1, "click", /*click_handler*/ ctx[20], false, false, false),
    					listen_dev(form0, "submit", prevent_default(/*submit_handler_1*/ ctx[13]), false, true, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[22]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[23]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[24]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[25]),
    					listen_dev(input6, "change", /*input6_change_handler*/ ctx[26]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[27]),
    					listen_dev(input8, "change", /*input8_change_handler*/ ctx[28]),
    					listen_dev(input9, "change", /*input9_change_handler*/ ctx[29]),
    					listen_dev(input10, "change", /*input10_change_handler*/ ctx[30]),
    					listen_dev(input11, "change", /*input11_change_handler*/ ctx[31]),
    					listen_dev(input12, "change", /*input12_change_handler*/ ctx[32]),
    					listen_dev(input13, "change", /*input13_change_handler*/ ctx[33]),
    					listen_dev(input14, "change", /*input14_change_handler*/ ctx[34]),
    					listen_dev(button2, "click", /*click_handler_1*/ ctx[35], false, false, false),
    					listen_dev(form1, "submit", prevent_default(/*submit_handler*/ ctx[12]), false, true, false),
    					action_destroyer(link_action = link.call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*new_recipe_name*/ 1 && input0.value !== /*new_recipe_name*/ ctx[0]) {
    				set_input_value(input0, /*new_recipe_name*/ ctx[0]);
    			}

    			if (dirty[0] & /*possible_ingredients, new_recipe_ingredients*/ 6) {
    				each_value_1 = /*possible_ingredients*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*new_ingredient_name*/ 32 && input1.value !== /*new_ingredient_name*/ ctx[5]) {
    				set_input_value(input1, /*new_ingredient_name*/ ctx[5]);
    			}

    			if (dirty[0] & /*new_ingredient_brand*/ 64 && input2.value !== /*new_ingredient_brand*/ ctx[6]) {
    				set_input_value(input2, /*new_ingredient_brand*/ ctx[6]);
    			}

    			if (dirty[0] & /*new_ingredient_measurement*/ 128) {
    				select_option(select, /*new_ingredient_measurement*/ ctx[7]);
    			}

    			if (dirty[0] & /*new_recipe_ingredients*/ 4) {
    				each_value = /*new_recipe_ingredients*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div13, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*new_recipe_directions_1*/ 8) {
    				set_input_value(textarea, /*new_recipe_directions_1*/ ctx[3]);
    			}

    			if (dirty[0] & /*new_recipe_category*/ 512) {
    				input3.checked = input3.__value === /*new_recipe_category*/ ctx[9];
    			}

    			if (dirty[0] & /*new_recipe_category*/ 512) {
    				input4.checked = input4.__value === /*new_recipe_category*/ ctx[9];
    			}

    			if (dirty[0] & /*new_recipe_category*/ 512) {
    				input5.checked = input5.__value === /*new_recipe_category*/ ctx[9];
    			}

    			if (dirty[0] & /*new_recipe_category*/ 512) {
    				input6.checked = input6.__value === /*new_recipe_category*/ ctx[9];
    			}

    			if (dirty[0] & /*new_recipe_category*/ 512) {
    				input7.checked = input7.__value === /*new_recipe_category*/ ctx[9];
    			}

    			if (dirty[0] & /*new_recipe_category*/ 512) {
    				input8.checked = input8.__value === /*new_recipe_category*/ ctx[9];
    			}

    			if (dirty[0] & /*new_recipe_category*/ 512) {
    				input9.checked = input9.__value === /*new_recipe_category*/ ctx[9];
    			}

    			if (dirty[0] & /*new_recipe_meal_type*/ 256) {
    				input10.checked = input10.__value === /*new_recipe_meal_type*/ ctx[8];
    			}

    			if (dirty[0] & /*new_recipe_meal_type*/ 256) {
    				input11.checked = input11.__value === /*new_recipe_meal_type*/ ctx[8];
    			}

    			if (dirty[0] & /*new_recipe_meal_type*/ 256) {
    				input12.checked = input12.__value === /*new_recipe_meal_type*/ ctx[8];
    			}

    			if (dirty[0] & /*new_recipe_meal_type*/ 256) {
    				input13.checked = input13.__value === /*new_recipe_meal_type*/ ctx[8];
    			}

    			if (dirty[0] & /*new_recipe_ingredient_shareable*/ 16) {
    				set_input_value(input14, /*new_recipe_ingredient_shareable*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h30);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form1);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			/*$$binding_groups*/ ctx[16][1].splice(/*$$binding_groups*/ ctx[16][1].indexOf(input3), 1);
    			/*$$binding_groups*/ ctx[16][1].splice(/*$$binding_groups*/ ctx[16][1].indexOf(input4), 1);
    			/*$$binding_groups*/ ctx[16][1].splice(/*$$binding_groups*/ ctx[16][1].indexOf(input5), 1);
    			/*$$binding_groups*/ ctx[16][1].splice(/*$$binding_groups*/ ctx[16][1].indexOf(input6), 1);
    			/*$$binding_groups*/ ctx[16][1].splice(/*$$binding_groups*/ ctx[16][1].indexOf(input7), 1);
    			/*$$binding_groups*/ ctx[16][1].splice(/*$$binding_groups*/ ctx[16][1].indexOf(input8), 1);
    			/*$$binding_groups*/ ctx[16][1].splice(/*$$binding_groups*/ ctx[16][1].indexOf(input9), 1);
    			/*$$binding_groups*/ ctx[16][2].splice(/*$$binding_groups*/ ctx[16][2].indexOf(input10), 1);
    			/*$$binding_groups*/ ctx[16][2].splice(/*$$binding_groups*/ ctx[16][2].indexOf(input11), 1);
    			/*$$binding_groups*/ ctx[16][2].splice(/*$$binding_groups*/ ctx[16][2].indexOf(input12), 1);
    			/*$$binding_groups*/ ctx[16][2].splice(/*$$binding_groups*/ ctx[16][2].indexOf(input13), 1);
    			if (detaching) detach_dev(t79);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t81);
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
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
    	let $claims;
    	validate_store(claims, 'claims');
    	component_subscribe($$self, claims, $$value => $$invalidate(36, $claims = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RecipeNew', slots, []);
    	let { new_recipe_name } = $$props;
    	let { possible_ingredients = [] } = $$props;
    	let { new_recipe_ingredients = [] } = $$props;
    	let { new_recipe_directions_1 } = $$props;
    	let { new_recipe_ingredient_shareable } = $$props;
    	let { new_ingredient_name, new_ingredient_brand, new_ingredient_measurement } = $$props;
    	let { new_recipe_meal_type } = $$props;
    	let { new_recipe_category } = $$props;

    	claims.subscribe(v => {
    		if ($claims) {
    			getPossibleIngredients();
    		}
    	});

    	async function userLevelUp() {
    		let levels_codes = {
    			1: "Apprentice",
    			2: "Prep Cook",
    			3: "Sous Chef",
    			4: "Executive Chef"
    		};

    		if (user_level < 4) {
    			let new_user_level = user_level + 1;

    			let q = `
          mutation {
            update_users(_set: {Onboarding_Level: ` + new_user_level + `, Onboarding_Code: "` + levels_codes[new_user_level] + `"}, where: {x_hasura_user_id: {_eq: "` + hasura_userID + `"}}) {
              returning {
                Onboarding_Code
                Onboarding_Level
              }
            }
          }
          `;

    			let temp = await executeGraphql(q, $claims);
    		}
    	}

    	async function getPossibleIngredients() {
    		let q = `
                {
                  ingredients(order_by: {Ingredient: asc}) {
                    id
                    Brand
                    Ingredient
                    Quantity_Measurement
                  }
                }
                `;

    		let temp_ingredients = await executeGraphql(q, $claims);
    		temp_ingredients = temp_ingredients.data.ingredients;
    		$$invalidate(1, possible_ingredients = []);

    		for (var i = 0; i < temp_ingredients.length; i++) {
    			possible_ingredients.push({
    				"value": "",
    				"id": temp_ingredients[i].id,
    				"Ingredient": temp_ingredients[i].Ingredient,
    				"Brand": temp_ingredients[i].Brand,
    				"Quantity_Measurement": temp_ingredients[i].Quantity_Measurement
    			});
    		}

    		$$invalidate(1, possible_ingredients);
    	}

    	async function addNewRecipe(name) {
    		let q = `
        mutation {
          insert_recipes_one(object: {Recipe: " ` + name + `", Directions: "` + new_recipe_directions_1 + `", Meal_Type: "` + new_recipe_meal_type + `", Category: "` + new_recipe_category + `"}) {
            id
            }
        }
       `;

    		let temp = await executeGraphql(q, $claims);
    		let new_recipeID = temp.data.insert_recipes_one.id;
    		console.log(new_recipeID);

    		q = `
          mutation {
            insert_users_recipes(objects: {RecipeID: ` + new_recipeID + `}) {
              returning {
                id
                recipes {
                  Recipe
                }
              }
            }
          }
       `;

    		temp = await executeGraphql(q, $claims);
    		let new_users_recipe_id = temp.data.insert_users_recipes.returning[0].id;
    		console.log("STARTING INGREDIENTS_RECIPES INSERT");

    		for (var i = 0; i < new_recipe_ingredients.length; i++) {
    			console.log(new_recipe_ingredients[i].value);
    			let user_quantity = new_recipe_ingredients[i].value;
    			let temp_user_ingredient_id = new_recipe_ingredients[i].id;

    			q = `
            mutation {
              insert_ingredients_recipes_one(object: {Quantity: ` + user_quantity + `, Quantity_Measurement: "` + new_recipe_ingredients[i].Quantity_Measurement + `", UserIngredientID: ` + temp_user_ingredient_id + `, UserRecipeID: ` + new_recipeID + `}) {
                ingredients {
                  Ingredient
                }
                user_recipes {
                  Recipe
                }
              }
            }
            `;

    			temp = await executeGraphql(q, $claims);
    			let result = temp.data;
    			console.log(result);
    		}

    		$$invalidate(2, new_recipe_ingredients = []);
    		name = "";
    		$$invalidate(3, new_recipe_directions_1 = "");
    		$$invalidate(4, new_recipe_ingredient_shareable = null);
    		console.log("new recipe added!....");

    		q = `
            mutation {
                insert_users_notifications_one(object: {NotificationID: 1}) {
                    id
                }
            }
          `;

    		temp = await executeGraphql(q, $claims);
    		userLevelUp();
    		window.location.assign("/#/food");
    	}

    	async function addNewIngredient(new_ing_name, brand, q_m) {
    		let q = `
            mutation {
              insert_ingredients_one(object: {Brand: "` + brand + `", Ingredient: "` + new_ing_name + `", Quantity_Measurement: "` + q_m + `"}) {
                id
              }
            }
            `;

    		let temp = await executeGraphql(q, $claims);
    		let newIngredientID = temp.data.insert_ingredients_one.id;
    		userLevelUp();
    		$$invalidate(5, new_ingredient_name = null);
    		document.getElementById("Ingredient").removeChild;
    		document.getElementById("Brand").removeChild;
    		$$invalidate(6, new_ingredient_brand = null);
    		document.getElementById("Quantity_Measurement").removeChild;
    		getPossibleIngredients();
    		document.getElementById("new_ingredient").focus();
    	}

    	const writable_props = [
    		'new_recipe_name',
    		'possible_ingredients',
    		'new_recipe_ingredients',
    		'new_recipe_directions_1',
    		'new_recipe_ingredient_shareable',
    		'new_ingredient_name',
    		'new_ingredient_brand',
    		'new_ingredient_measurement',
    		'new_recipe_meal_type',
    		'new_recipe_category'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<RecipeNew> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[], [], []];

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function submit_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input0_input_handler() {
    		new_recipe_name = this.value;
    		$$invalidate(0, new_recipe_name);
    	}

    	function input_change_handler() {
    		new_recipe_ingredients = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(2, new_recipe_ingredients);
    	}

    	function input1_input_handler() {
    		new_ingredient_name = this.value;
    		$$invalidate(5, new_ingredient_name);
    	}

    	function input2_input_handler() {
    		new_ingredient_brand = this.value;
    		$$invalidate(6, new_ingredient_brand);
    	}

    	function select_change_handler() {
    		new_ingredient_measurement = select_value(this);
    		$$invalidate(7, new_ingredient_measurement);
    	}

    	const click_handler = () => addNewIngredient(new_ingredient_name, new_ingredient_brand, new_ingredient_measurement);

    	function input_input_handler(each_value, i) {
    		each_value[i].value = this.value;
    		$$invalidate(2, new_recipe_ingredients);
    	}

    	function textarea_input_handler() {
    		new_recipe_directions_1 = this.value;
    		$$invalidate(3, new_recipe_directions_1);
    	}

    	function input3_change_handler() {
    		new_recipe_category = this.__value;
    		$$invalidate(9, new_recipe_category);
    	}

    	function input4_change_handler() {
    		new_recipe_category = this.__value;
    		$$invalidate(9, new_recipe_category);
    	}

    	function input5_change_handler() {
    		new_recipe_category = this.__value;
    		$$invalidate(9, new_recipe_category);
    	}

    	function input6_change_handler() {
    		new_recipe_category = this.__value;
    		$$invalidate(9, new_recipe_category);
    	}

    	function input7_change_handler() {
    		new_recipe_category = this.__value;
    		$$invalidate(9, new_recipe_category);
    	}

    	function input8_change_handler() {
    		new_recipe_category = this.__value;
    		$$invalidate(9, new_recipe_category);
    	}

    	function input9_change_handler() {
    		new_recipe_category = this.__value;
    		$$invalidate(9, new_recipe_category);
    	}

    	function input10_change_handler() {
    		new_recipe_meal_type = this.__value;
    		$$invalidate(8, new_recipe_meal_type);
    	}

    	function input11_change_handler() {
    		new_recipe_meal_type = this.__value;
    		$$invalidate(8, new_recipe_meal_type);
    	}

    	function input12_change_handler() {
    		new_recipe_meal_type = this.__value;
    		$$invalidate(8, new_recipe_meal_type);
    	}

    	function input13_change_handler() {
    		new_recipe_meal_type = this.__value;
    		$$invalidate(8, new_recipe_meal_type);
    	}

    	function input14_change_handler() {
    		new_recipe_ingredient_shareable = this.value;
    		$$invalidate(4, new_recipe_ingredient_shareable);
    	}

    	const click_handler_1 = () => addNewRecipe(new_recipe_name);

    	$$self.$$set = $$props => {
    		if ('new_recipe_name' in $$props) $$invalidate(0, new_recipe_name = $$props.new_recipe_name);
    		if ('possible_ingredients' in $$props) $$invalidate(1, possible_ingredients = $$props.possible_ingredients);
    		if ('new_recipe_ingredients' in $$props) $$invalidate(2, new_recipe_ingredients = $$props.new_recipe_ingredients);
    		if ('new_recipe_directions_1' in $$props) $$invalidate(3, new_recipe_directions_1 = $$props.new_recipe_directions_1);
    		if ('new_recipe_ingredient_shareable' in $$props) $$invalidate(4, new_recipe_ingredient_shareable = $$props.new_recipe_ingredient_shareable);
    		if ('new_ingredient_name' in $$props) $$invalidate(5, new_ingredient_name = $$props.new_ingredient_name);
    		if ('new_ingredient_brand' in $$props) $$invalidate(6, new_ingredient_brand = $$props.new_ingredient_brand);
    		if ('new_ingredient_measurement' in $$props) $$invalidate(7, new_ingredient_measurement = $$props.new_ingredient_measurement);
    		if ('new_recipe_meal_type' in $$props) $$invalidate(8, new_recipe_meal_type = $$props.new_recipe_meal_type);
    		if ('new_recipe_category' in $$props) $$invalidate(9, new_recipe_category = $$props.new_recipe_category);
    	};

    	$$self.$capture_state = () => ({
    		new_recipe_name,
    		possible_ingredients,
    		new_recipe_ingredients,
    		new_recipe_directions_1,
    		new_recipe_ingredient_shareable,
    		new_ingredient_name,
    		new_ingredient_brand,
    		new_ingredient_measurement,
    		new_recipe_meal_type,
    		new_recipe_category,
    		link,
    		executeGraphql,
    		claims,
    		userLevelUp,
    		getPossibleIngredients,
    		addNewRecipe,
    		addNewIngredient,
    		$claims
    	});

    	$$self.$inject_state = $$props => {
    		if ('new_recipe_name' in $$props) $$invalidate(0, new_recipe_name = $$props.new_recipe_name);
    		if ('possible_ingredients' in $$props) $$invalidate(1, possible_ingredients = $$props.possible_ingredients);
    		if ('new_recipe_ingredients' in $$props) $$invalidate(2, new_recipe_ingredients = $$props.new_recipe_ingredients);
    		if ('new_recipe_directions_1' in $$props) $$invalidate(3, new_recipe_directions_1 = $$props.new_recipe_directions_1);
    		if ('new_recipe_ingredient_shareable' in $$props) $$invalidate(4, new_recipe_ingredient_shareable = $$props.new_recipe_ingredient_shareable);
    		if ('new_ingredient_name' in $$props) $$invalidate(5, new_ingredient_name = $$props.new_ingredient_name);
    		if ('new_ingredient_brand' in $$props) $$invalidate(6, new_ingredient_brand = $$props.new_ingredient_brand);
    		if ('new_ingredient_measurement' in $$props) $$invalidate(7, new_ingredient_measurement = $$props.new_ingredient_measurement);
    		if ('new_recipe_meal_type' in $$props) $$invalidate(8, new_recipe_meal_type = $$props.new_recipe_meal_type);
    		if ('new_recipe_category' in $$props) $$invalidate(9, new_recipe_category = $$props.new_recipe_category);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		new_recipe_name,
    		possible_ingredients,
    		new_recipe_ingredients,
    		new_recipe_directions_1,
    		new_recipe_ingredient_shareable,
    		new_ingredient_name,
    		new_ingredient_brand,
    		new_ingredient_measurement,
    		new_recipe_meal_type,
    		new_recipe_category,
    		addNewRecipe,
    		addNewIngredient,
    		submit_handler,
    		submit_handler_1,
    		input0_input_handler,
    		input_change_handler,
    		$$binding_groups,
    		input1_input_handler,
    		input2_input_handler,
    		select_change_handler,
    		click_handler,
    		input_input_handler,
    		textarea_input_handler,
    		input3_change_handler,
    		input4_change_handler,
    		input5_change_handler,
    		input6_change_handler,
    		input7_change_handler,
    		input8_change_handler,
    		input9_change_handler,
    		input10_change_handler,
    		input11_change_handler,
    		input12_change_handler,
    		input13_change_handler,
    		input14_change_handler,
    		click_handler_1
    	];
    }

    class RecipeNew extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$6,
    			create_fragment$6,
    			safe_not_equal,
    			{
    				new_recipe_name: 0,
    				possible_ingredients: 1,
    				new_recipe_ingredients: 2,
    				new_recipe_directions_1: 3,
    				new_recipe_ingredient_shareable: 4,
    				new_ingredient_name: 5,
    				new_ingredient_brand: 6,
    				new_ingredient_measurement: 7,
    				new_recipe_meal_type: 8,
    				new_recipe_category: 9
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RecipeNew",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*new_recipe_name*/ ctx[0] === undefined && !('new_recipe_name' in props)) {
    			console_1$4.warn("<RecipeNew> was created without expected prop 'new_recipe_name'");
    		}

    		if (/*new_recipe_directions_1*/ ctx[3] === undefined && !('new_recipe_directions_1' in props)) {
    			console_1$4.warn("<RecipeNew> was created without expected prop 'new_recipe_directions_1'");
    		}

    		if (/*new_recipe_ingredient_shareable*/ ctx[4] === undefined && !('new_recipe_ingredient_shareable' in props)) {
    			console_1$4.warn("<RecipeNew> was created without expected prop 'new_recipe_ingredient_shareable'");
    		}

    		if (/*new_ingredient_name*/ ctx[5] === undefined && !('new_ingredient_name' in props)) {
    			console_1$4.warn("<RecipeNew> was created without expected prop 'new_ingredient_name'");
    		}

    		if (/*new_ingredient_brand*/ ctx[6] === undefined && !('new_ingredient_brand' in props)) {
    			console_1$4.warn("<RecipeNew> was created without expected prop 'new_ingredient_brand'");
    		}

    		if (/*new_ingredient_measurement*/ ctx[7] === undefined && !('new_ingredient_measurement' in props)) {
    			console_1$4.warn("<RecipeNew> was created without expected prop 'new_ingredient_measurement'");
    		}

    		if (/*new_recipe_meal_type*/ ctx[8] === undefined && !('new_recipe_meal_type' in props)) {
    			console_1$4.warn("<RecipeNew> was created without expected prop 'new_recipe_meal_type'");
    		}

    		if (/*new_recipe_category*/ ctx[9] === undefined && !('new_recipe_category' in props)) {
    			console_1$4.warn("<RecipeNew> was created without expected prop 'new_recipe_category'");
    		}
    	}

    	get new_recipe_name() {
    		throw new Error("<RecipeNew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_name(value) {
    		throw new Error("<RecipeNew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get possible_ingredients() {
    		throw new Error("<RecipeNew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set possible_ingredients(value) {
    		throw new Error("<RecipeNew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_ingredients() {
    		throw new Error("<RecipeNew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_ingredients(value) {
    		throw new Error("<RecipeNew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_directions_1() {
    		throw new Error("<RecipeNew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_directions_1(value) {
    		throw new Error("<RecipeNew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_ingredient_shareable() {
    		throw new Error("<RecipeNew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_ingredient_shareable(value) {
    		throw new Error("<RecipeNew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_ingredient_name() {
    		throw new Error("<RecipeNew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_ingredient_name(value) {
    		throw new Error("<RecipeNew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_ingredient_brand() {
    		throw new Error("<RecipeNew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_ingredient_brand(value) {
    		throw new Error("<RecipeNew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_ingredient_measurement() {
    		throw new Error("<RecipeNew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_ingredient_measurement(value) {
    		throw new Error("<RecipeNew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_meal_type() {
    		throw new Error("<RecipeNew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_meal_type(value) {
    		throw new Error("<RecipeNew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get new_recipe_category() {
    		throw new Error("<RecipeNew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set new_recipe_category(value) {
    		throw new Error("<RecipeNew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Inventory.svelte generated by Svelte v3.46.4 */

    const { console: console_1$5 } = globals;
    const file$5 = "src/components/Inventory.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (68:0) {#if !category }
    function create_if_block$4(ctx) {
    	let h1;
    	let t1;
    	let br;
    	let t2;
    	let t3;
    	let if_block_anchor;
    	let each_value_1 = /*categories*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let if_block = /*category*/ ctx[2] && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Current Inventory";
    			t1 = space();
    			br = element("br");
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$5, 69, 0, 1485);
    			add_location(br, file$5, 70, 0, 1532);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectCategory, categories*/ 10) {
    				each_value_1 = /*categories*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t3.parentNode, t3);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*category*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(68:0) {#if !category }",
    		ctx
    	});

    	return block;
    }

    // (73:0) {#each categories as cat}
    function create_each_block_1$3(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div0;
    	let h5;
    	let button;
    	let t1_value = /*cat*/ ctx[10].category + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*cat*/ ctx[10]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[5](/*cat*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			h5 = element("h5");
    			button = element("button");
    			t1 = text(t1_value);
    			attr_dev(img, "class", "card-img-top");
    			if (!src_url_equal(img.src, img_src_value = /*cat*/ ctx[10].iconURL)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*cat*/ ctx[10].category);
    			add_location(img, file$5, 76, 6, 1647);
    			attr_dev(button, "class", "btn btn-primary btn-lg");
    			add_location(button, file$5, 79, 8, 1848);
    			attr_dev(h5, "class", "card-title");
    			add_location(h5, file$5, 78, 8, 1816);
    			attr_dev(div0, "class", "card-body text-center");
    			add_location(div0, file$5, 77, 6, 1771);
    			attr_dev(div1, "class", "card");
    			add_location(div1, file$5, 75, 4, 1622);
    			attr_dev(div2, "class", "col-sm-6 category");
    			add_location(div2, file$5, 74, 2, 1586);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$5, 73, 0, 1566);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h5);
    			append_dev(h5, button);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "click", click_handler, false, false, false),
    					listen_dev(button, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*categories*/ 2 && !src_url_equal(img.src, img_src_value = /*cat*/ ctx[10].iconURL)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*categories*/ 2 && img_alt_value !== (img_alt_value = /*cat*/ ctx[10].category)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*categories*/ 2 && t1_value !== (t1_value = /*cat*/ ctx[10].category + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(73:0) {#each categories as cat}",
    		ctx
    	});

    	return block;
    }

    // (89:0) {#if category}
    function create_if_block_1$3(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let h5;
    	let button;
    	let t1;
    	let h3;
    	let t2;
    	let strong;
    	let t3;
    	let t4;
    	let em;
    	let t6;
    	let t7;
    	let table;
    	let thead;
    	let th0;
    	let t9;
    	let th1;
    	let t11;
    	let tbody;
    	let mounted;
    	let dispose;
    	let each_value = /*ingredients*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h5 = element("h5");
    			button = element("button");
    			button.textContent = "← Back";
    			t1 = space();
    			h3 = element("h3");
    			t2 = text("Your ");
    			strong = element("strong");
    			t3 = text(/*category*/ ctx[2]);
    			t4 = text(" is ");
    			em = element("em");
    			em.textContent = "89";
    			t6 = text("% stocked.");
    			t7 = space();
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Ingredient";
    			t9 = space();
    			th1 = element("th");
    			th1.textContent = "Quantity";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button, "class", "btn btn-primary btn-lg category");
    			add_location(button, file$5, 94, 8, 2337);
    			attr_dev(h5, "class", "card-title");
    			add_location(h5, file$5, 93, 8, 2305);
    			attr_dev(div0, "class", "card-body text-center");
    			add_location(div0, file$5, 92, 6, 2260);
    			attr_dev(div1, "class", "card");
    			set_style(div1, "width", "18rem");
    			add_location(div1, file$5, 90, 4, 2067);
    			attr_dev(div2, "class", "col-md-4");
    			add_location(div2, file$5, 89, 2, 2040);
    			add_location(strong, file$5, 100, 11, 2505);
    			add_location(em, file$5, 100, 42, 2536);
    			add_location(h3, file$5, 100, 2, 2496);
    			add_location(th0, file$5, 104, 4, 2629);
    			add_location(th1, file$5, 105, 4, 2653);
    			add_location(thead, file$5, 103, 2, 2617);
    			add_location(tbody, file$5, 108, 2, 2685);
    			attr_dev(table, "class", "table table-responsive table-light");
    			add_location(table, file$5, 102, 0, 2564);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h5);
    			append_dev(h5, button);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t2);
    			append_dev(h3, strong);
    			append_dev(strong, t3);
    			append_dev(h3, t4);
    			append_dev(h3, em);
    			append_dev(h3, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t9);
    			append_dev(thead, th1);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*category*/ 4) set_data_dev(t3, /*category*/ ctx[2]);

    			if (dirty & /*ingredients*/ 1) {
    				each_value = /*ingredients*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(89:0) {#if category}",
    		ctx
    	});

    	return block;
    }

    // (116:6) {:else }
    function create_else_block$4(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*ing*/ ctx[7].ingredient_inventory_2.Ingredient + "";
    	let t0;
    	let a_href_value;
    	let link_action;
    	let t1;
    	let td1;
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "Out of Stock!";
    			t3 = space();
    			attr_dev(a, "href", a_href_value = "/ingredients/" + /*ing*/ ctx[7].IngredientID);
    			attr_dev(a, "class", "btn btn-lg btn-secondary");
    			add_location(a, file$5, 117, 14, 3085);
    			add_location(td0, file$5, 117, 10, 3081);
    			add_location(td1, file$5, 118, 10, 3228);
    			attr_dev(tr, "class", "table-danger");
    			add_location(tr, file$5, 116, 8, 3040);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(tr, t3);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ingredients*/ 1 && t0_value !== (t0_value = /*ing*/ ctx[7].ingredient_inventory_2.Ingredient + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*ingredients*/ 1 && a_href_value !== (a_href_value = "/ingredients/" + /*ing*/ ctx[7].IngredientID)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(116:6) {:else }",
    		ctx
    	});

    	return block;
    }

    // (111:6) {#if ing.Quantity > 0 }
    function create_if_block_2$3(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*ing*/ ctx[7].ingredient_inventory_2.Ingredient + "";
    	let t0;
    	let a_href_value;
    	let link_action;
    	let t1;
    	let td1;
    	let t2_value = /*ing*/ ctx[7].Quantity + "";
    	let t2;
    	let t3;
    	let t4_value = /*ing*/ ctx[7].Quantity_Measurement + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(a, "href", a_href_value = "/ingredients/" + /*ing*/ ctx[7].IngredientID);
    			attr_dev(a, "class", "btn btn-lg btn-secondary");
    			add_location(a, file$5, 112, 14, 2809);
    			add_location(td0, file$5, 112, 10, 2805);
    			add_location(td1, file$5, 113, 10, 2952);
    			attr_dev(tr, "class", "table-success");
    			add_location(tr, file$5, 111, 8, 2763);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(td1, t3);
    			append_dev(td1, t4);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ingredients*/ 1 && t0_value !== (t0_value = /*ing*/ ctx[7].ingredient_inventory_2.Ingredient + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*ingredients*/ 1 && a_href_value !== (a_href_value = "/ingredients/" + /*ing*/ ctx[7].IngredientID)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*ingredients*/ 1 && t2_value !== (t2_value = /*ing*/ ctx[7].Quantity + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*ingredients*/ 1 && t4_value !== (t4_value = /*ing*/ ctx[7].Quantity_Measurement + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(111:6) {#if ing.Quantity > 0 }",
    		ctx
    	});

    	return block;
    }

    // (110:4) {#each ingredients as ing }
    function create_each_block$4(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*ing*/ ctx[7].Quantity > 0) return create_if_block_2$3;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(110:4) {#each ingredients as ing }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let h1;
    	let t1;
    	let button;
    	let t3;
    	let br;
    	let t4;
    	let if_block_anchor;
    	let if_block = !/*category*/ ctx[2] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Welcome to your kitchen's inventory!";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Add New Grocery Items";
    			t3 = space();
    			br = element("br");
    			t4 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$5, 62, 0, 1320);
    			attr_dev(button, "class", "btn btn-lg btn-secondary");
    			add_location(button, file$5, 64, 0, 1387);
    			add_location(br, file$5, 65, 0, 1459);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*category*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t4);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	validate_slots('Inventory', slots, []);
    	let { ingredients = [] } = $$props;
    	let { categories } = $$props;
    	let { category } = $$props;

    	onMount(async () => {
    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `
        {
  categories(where: {scope: {_eq: "Inventory"}}) {
    category
    iconURL
  }
}
      `
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(1, categories = res.data.categories);
    			console.log(res.data);
    		});
    	});

    	function selectCategory(cat) {
    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `
        {
  ingredients(where: {category: {scope: {_eq: "` + cat + `"}}}) {
    category {
      category
    }
    Ingredient
    Quantity
    Quantity_Measurement
    Location
    Brand
  }
}
      `
    			})
    		}).then(res => res.json()).then(res => {
    			console.log(cat);
    			$$invalidate(0, ingredients = res.data.inventory);
    			$$invalidate(2, category = cat);
    			console.log(res.data);
    		});
    	}

    	const writable_props = ['ingredients', 'categories', 'category'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Inventory> was created with unknown prop '${key}'`);
    	});

    	const click_handler = cat => selectCategory(cat.category);
    	const click_handler_1 = cat => selectCategory(cat.category);
    	const click_handler_2 = () => selectCategory(null);

    	$$self.$$set = $$props => {
    		if ('ingredients' in $$props) $$invalidate(0, ingredients = $$props.ingredients);
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    		if ('category' in $$props) $$invalidate(2, category = $$props.category);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		link,
    		ingredients,
    		categories,
    		category,
    		selectCategory
    	});

    	$$self.$inject_state = $$props => {
    		if ('ingredients' in $$props) $$invalidate(0, ingredients = $$props.ingredients);
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    		if ('category' in $$props) $$invalidate(2, category = $$props.category);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ingredients,
    		categories,
    		category,
    		selectCategory,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Inventory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			ingredients: 0,
    			categories: 1,
    			category: 2,
    			selectCategory: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Inventory",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*categories*/ ctx[1] === undefined && !('categories' in props)) {
    			console_1$5.warn("<Inventory> was created without expected prop 'categories'");
    		}

    		if (/*category*/ ctx[2] === undefined && !('category' in props)) {
    			console_1$5.warn("<Inventory> was created without expected prop 'category'");
    		}
    	}

    	get ingredients() {
    		throw new Error("<Inventory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ingredients(value) {
    		throw new Error("<Inventory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<Inventory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<Inventory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<Inventory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Inventory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectCategory() {
    		return this.$$.ctx[3];
    	}

    	set selectCategory(value) {
    		throw new Error("<Inventory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/RecipeDetailComponent.svelte generated by Svelte v3.46.4 */
    const file$6 = "src/components/RecipeDetailComponent.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (48:0) {#if recipe}
    function create_if_block$5(ctx) {
    	let div1;
    	let h1;
    	let t0_value = /*recipe*/ ctx[0].Recipe + "";
    	let t0;
    	let t1;
    	let br0;
    	let t2;
    	let t3;
    	let br1;
    	let t4;
    	let h2;
    	let t6;
    	let t7;
    	let p0;
    	let t9;
    	let div0;
    	let button;
    	let t10;
    	let img0;
    	let img0_src_value;
    	let t11;
    	let p1;
    	let t13;
    	let a;
    	let img1;
    	let img1_src_value;
    	let t14;
    	let link_action;
    	let mounted;
    	let dispose;
    	let if_block0 = /*ingredients*/ ctx[1] && create_if_block_2$4(ctx);
    	let if_block1 = /*recipe*/ ctx[0] && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			br1 = element("br");
    			t4 = space();
    			h2 = element("h2");
    			h2.textContent = "Directions";
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			p0 = element("p");
    			p0.textContent = " ";
    			t9 = space();
    			div0 = element("div");
    			button = element("button");
    			t10 = text("I Cooked This  ");
    			img0 = element("img");
    			t11 = space();
    			p1 = element("p");
    			p1.textContent = " ";
    			t13 = space();
    			a = element("a");
    			img1 = element("img");
    			t14 = text(" Back");
    			attr_dev(h1, "class", "text-center");
    			attr_dev(h1, "id", "recipeTitle");
    			add_location(h1, file$6, 50, 2, 1213);
    			add_location(br0, file$6, 51, 2, 1277);
    			add_location(br1, file$6, 71, 2, 2258);
    			attr_dev(h2, "class", "text-center");
    			attr_dev(h2, "id", "directionsTitle");
    			add_location(h2, file$6, 72, 2, 2267);
    			add_location(p0, file$6, 82, 2, 2567);
    			attr_dev(img0, "class", "svg");
    			if (!src_url_equal(img0.src, img0_src_value = "/open-iconic-master/svg/task.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "task");
    			add_location(img0, file$6, 85, 97, 2707);
    			set_style(button, "margin-top", "1.5%");
    			attr_dev(button, "class", "btn btn-lg btn-outline-success");
    			add_location(button, file$6, 85, 4, 2614);
    			attr_dev(div0, "class", "text-center");
    			add_location(div0, file$6, 84, 2, 2584);
    			attr_dev(div1, "id", "recipeBackground");
    			add_location(div1, file$6, 49, 0, 1183);
    			add_location(p1, file$6, 89, 2, 2803);
    			if (!src_url_equal(img1.src, img1_src_value = "/open-iconic-master/svg/chevron-left.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "icon");
    			attr_dev(img1, "alt", "back");
    			add_location(img1, file$6, 90, 63, 2880);
    			attr_dev(a, "href", "/food");
    			attr_dev(a, "class", "btn btn-lg btn-outline-dark");
    			add_location(a, file$6, 90, 2, 2819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(h1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, br0);
    			append_dev(div1, t2);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, br1);
    			append_dev(div1, t4);
    			append_dev(div1, h2);
    			append_dev(div1, t6);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t7);
    			append_dev(div1, p0);
    			append_dev(div1, t9);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, t10);
    			append_dev(button, img0);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, img1);
    			append_dev(a, t14);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*recipe*/ 1 && t0_value !== (t0_value = /*recipe*/ ctx[0].Recipe + "")) set_data_dev(t0, t0_value);

    			if (/*ingredients*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$4(ctx);
    					if_block0.c();
    					if_block0.m(div1, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*recipe*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$4(ctx);
    					if_block1.c();
    					if_block1.m(div1, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(48:0) {#if recipe}",
    		ctx
    	});

    	return block;
    }

    // (54:2) {#if ingredients}
    function create_if_block_2$4(ctx) {
    	let div1;
    	let div0;
    	let button;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let ul;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*ingredients*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			button = element("button");
    			img = element("img");
    			t0 = text("  Add All Ingredients to Grocery List");
    			t1 = space();
    			p = element("p");
    			t2 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(img, "class", "svg");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/cart.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "cart");
    			add_location(img, file$6, 56, 156, 1516);
    			attr_dev(button, "class", "btn btn-md btn-outline-secondary");
    			button.disabled = /*disabled*/ ctx[2];
    			add_location(button, file$6, 56, 10, 1370);
    			attr_dev(div0, "class", "ml-auto mr-3");
    			add_location(div0, file$6, 55, 6, 1333);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$6, 54, 4, 1309);
    			add_location(p, file$6, 59, 4, 1663);
    			attr_dev(ul, "class", "list-group");
    			add_location(ul, file$6, 60, 4, 1675);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, img);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*disabled*/ 4) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[2]);
    			}

    			if (dirty & /*addToGroceryList, ingredients, $claims*/ 10) {
    				each_value_1 = /*ingredients*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$4(child_ctx);
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
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(54:2) {#if ingredients}",
    		ctx
    	});

    	return block;
    }

    // (62:6) {#each ingredients as ing }
    function create_each_block_1$4(ctx) {
    	let li;
    	let span0;
    	let a;
    	let t0_value = /*ing*/ ctx[11].ingredients.Ingredient + "";
    	let t0;
    	let a_href_value;
    	let link_action;
    	let t1;
    	let t2_value = /*ing*/ ctx[11].Quantity + "";
    	let t2;
    	let t3;
    	let t4_value = /*ing*/ ctx[11].Quantity_Measurement + "";
    	let t4;
    	let t5;
    	let t6;
    	let span1;
    	let button;
    	let img;
    	let img_src_value;
    	let t7;
    	let t8;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*ing*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			span0 = element("span");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = text(" (");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = text(")");
    			t6 = space();
    			span1 = element("span");
    			button = element("button");
    			img = element("img");
    			t7 = text("  Add to Grocery List");
    			t8 = space();
    			attr_dev(a, "href", a_href_value = "/ingredients/" + /*ing*/ ctx[11].ingredients.id);
    			attr_dev(a, "class", "ingredientsBtn");
    			add_location(a, file$6, 63, 14, 1799);
    			add_location(span0, file$6, 63, 8, 1793);
    			attr_dev(img, "class", "svg");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/cart.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "cart");
    			add_location(img, file$6, 64, 141, 2100);
    			attr_dev(button, "class", "btn btn-sm btn-success addToGroceryList");
    			add_location(button, file$6, 64, 14, 1973);
    			add_location(span1, file$6, 64, 8, 1967);
    			attr_dev(li, "class", "list-group-item text-center");
    			add_location(li, file$6, 62, 6, 1739);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span0);
    			append_dev(span0, a);
    			append_dev(a, t0);
    			append_dev(span0, t1);
    			append_dev(span0, t2);
    			append_dev(span0, t3);
    			append_dev(span0, t4);
    			append_dev(span0, t5);
    			append_dev(li, t6);
    			append_dev(li, span1);
    			append_dev(span1, button);
    			append_dev(button, img);
    			append_dev(button, t7);
    			append_dev(li, t8);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link_action = link.call(null, a)),
    					listen_dev(button, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*ingredients*/ 2 && t0_value !== (t0_value = /*ing*/ ctx[11].ingredients.Ingredient + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*ingredients*/ 2 && a_href_value !== (a_href_value = "/ingredients/" + /*ing*/ ctx[11].ingredients.id)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*ingredients*/ 2 && t2_value !== (t2_value = /*ing*/ ctx[11].Quantity + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*ingredients*/ 2 && t4_value !== (t4_value = /*ing*/ ctx[11].Quantity_Measurement + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(62:6) {#each ingredients as ing }",
    		ctx
    	});

    	return block;
    }

    // (75:2) {#if recipe}
    function create_if_block_1$4(ctx) {
    	let ul;
    	let each_value = /*recipe*/ ctx[0].Directions.split(".");
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "list-group");
    			add_location(ul, file$6, 75, 2, 2346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*recipe*/ 1) {
    				each_value = /*recipe*/ ctx[0].Directions.split(".");
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(75:2) {#if recipe}",
    		ctx
    	});

    	return block;
    }

    // (77:6) {#each recipe.Directions.split(".") as dir }
    function create_each_block$5(ctx) {
    	let li;
    	let t_value = /*dir*/ ctx[8] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-group-item list-group-item-action list-group-item-dark");
    			attr_dev(li, "id", "recipeDirections");
    			add_location(li, file$6, 77, 8, 2429);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*recipe*/ 1 && t_value !== (t_value = /*dir*/ ctx[8] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(77:6) {#each recipe.Directions.split(\\\".\\\") as dir }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let if_block = /*recipe*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*recipe*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let $claims;
    	validate_store(claims, 'claims');
    	component_subscribe($$self, claims, $$value => $$invalidate(3, $claims = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RecipeDetailComponent', slots, []);
    	let { params } = $$props;
    	let { recipe } = $$props;
    	let { ingredients } = $$props;
    	let { disabled = false } = $$props;

    	async function findRecipe() {
    		let q = `
            {   
              recipes_by_pk(id:` + params.id + `) { 
                id 
                Recipe 
                Directions 
              } 
            }
            `;

    		let temp = await executeGraphql(q, $claims);
    		$$invalidate(0, recipe = temp.data.recipes_by_pk);

    		q = `
        {
            ingredients_recipes(where: {UserRecipeID: {_eq: ` + params.id + `}}) {
                ingredients {
                    id
                    Ingredient
                }
                Quantity_Measurement
                Quantity
            }
        }
        `;

    		let temp2 = await executeGraphql(q, $claims);
    		$$invalidate(1, ingredients = temp2.data.ingredients_recipes);
    	}

    	claims.subscribe(v => {
    		if ($claims) {
    			findRecipe();
    		}
    	});

    	const writable_props = ['params', 'recipe', 'ingredients', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RecipeDetailComponent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(2, disabled = addAllItemsToGroceryList(ingredients, disabled));
    	const click_handler_1 = ing => addToGroceryList(ing.ingredients.Ingredient, $claims);

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(4, params = $$props.params);
    		if ('recipe' in $$props) $$invalidate(0, recipe = $$props.recipe);
    		if ('ingredients' in $$props) $$invalidate(1, ingredients = $$props.ingredients);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		claims,
    		link,
    		executeGraphql,
    		addToGroceryList,
    		addAllItemsToGroceryList,
    		params,
    		recipe,
    		ingredients,
    		disabled,
    		findRecipe,
    		$claims
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(4, params = $$props.params);
    		if ('recipe' in $$props) $$invalidate(0, recipe = $$props.recipe);
    		if ('ingredients' in $$props) $$invalidate(1, ingredients = $$props.ingredients);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [recipe, ingredients, disabled, $claims, params, click_handler, click_handler_1];
    }

    class RecipeDetailComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			params: 4,
    			recipe: 0,
    			ingredients: 1,
    			disabled: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RecipeDetailComponent",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[4] === undefined && !('params' in props)) {
    			console.warn("<RecipeDetailComponent> was created without expected prop 'params'");
    		}

    		if (/*recipe*/ ctx[0] === undefined && !('recipe' in props)) {
    			console.warn("<RecipeDetailComponent> was created without expected prop 'recipe'");
    		}

    		if (/*ingredients*/ ctx[1] === undefined && !('ingredients' in props)) {
    			console.warn("<RecipeDetailComponent> was created without expected prop 'ingredients'");
    		}
    	}

    	get params() {
    		throw new Error("<RecipeDetailComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<RecipeDetailComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get recipe() {
    		throw new Error("<RecipeDetailComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipe(value) {
    		throw new Error("<RecipeDetailComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ingredients() {
    		throw new Error("<RecipeDetailComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ingredients(value) {
    		throw new Error("<RecipeDetailComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<RecipeDetailComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<RecipeDetailComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/RecipeComponent.svelte generated by Svelte v3.46.4 */

    const { console: console_1$6 } = globals;
    const file$7 = "src/components/RecipeComponent.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (32:4) {#each recipes as rec }
    function create_each_block$6(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*rec*/ ctx[1].Recipe + "";
    	let t0;
    	let a_href_value;
    	let link_action;
    	let t1;
    	let td1;
    	let t2_value = /*rec*/ ctx[1].Meal + "";
    	let t2;
    	let t3;
    	let tr_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(a, "href", a_href_value = "/recipes/" + /*rec*/ ctx[1].id);
    			add_location(a, file$7, 33, 10, 713);
    			add_location(td0, file$7, 33, 6, 709);
    			add_location(td1, file$7, 34, 6, 778);
    			attr_dev(tr, "class", tr_class_value = /*rec*/ ctx[1].BootstrapClass);
    			add_location(tr, file$7, 32, 4, 664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*recipes*/ 1 && t0_value !== (t0_value = /*rec*/ ctx[1].Recipe + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*recipes*/ 1 && a_href_value !== (a_href_value = "/recipes/" + /*rec*/ ctx[1].id)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*recipes*/ 1 && t2_value !== (t2_value = /*rec*/ ctx[1].Meal + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*recipes*/ 1 && tr_class_value !== (tr_class_value = /*rec*/ ctx[1].BootstrapClass)) {
    				attr_dev(tr, "class", tr_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(32:4) {#each recipes as rec }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let table;
    	let thead;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let tbody;
    	let each_value = /*recipes*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Recipe";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Meal";
    			t3 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$7, 26, 4, 576);
    			add_location(th1, file$7, 27, 4, 596);
    			add_location(thead, file$7, 25, 2, 564);
    			add_location(tbody, file$7, 30, 2, 624);
    			attr_dev(table, "class", "table table-responsive table-light");
    			add_location(table, file$7, 24, 0, 511);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t1);
    			append_dev(thead, th1);
    			append_dev(table, t3);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*recipes*/ 1) {
    				each_value = /*recipes*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots('RecipeComponent', slots, []);
    	let { recipes = [] } = $$props;

    	onMount(async () => {
    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: '{ recipes { id Recipe Meal BootstrapClass } }'
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(0, recipes = res.data.recipes);
    			console.log(res.data);
    		});
    	});

    	const writable_props = ['recipes'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<RecipeComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('recipes' in $$props) $$invalidate(0, recipes = $$props.recipes);
    	};

    	$$self.$capture_state = () => ({ onMount, link, recipes });

    	$$self.$inject_state = $$props => {
    		if ('recipes' in $$props) $$invalidate(0, recipes = $$props.recipes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [recipes];
    }

    class RecipeComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { recipes: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RecipeComponent",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get recipes() {
    		throw new Error("<RecipeComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipes(value) {
    		throw new Error("<RecipeComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/GroceryListComponent.svelte generated by Svelte v3.46.4 */
    const file$8 = "src/components/GroceryListComponent.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (37:4) {#each items as ite }
    function create_each_block$7(ctx) {
    	let tr;
    	let td;
    	let t0_value = /*ite*/ ctx[4].Item + "";
    	let t0;
    	let t1;
    	let button;
    	let t2;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			t2 = text("  ");
    			img0 = element("img");
    			t3 = space();
    			img1 = element("img");
    			t4 = space();
    			attr_dev(img0, "class", "svg");
    			if (!src_url_equal(img0.src, img0_src_value = "/open-iconic-master/svg/cart.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "cart");
    			add_location(img0, file$8, 42, 134, 1047);
    			attr_dev(img1, "class", "svg");
    			if (!src_url_equal(img1.src, img1_src_value = "/open-iconic-master/svg/circle-check.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "circle-check");
    			attr_dev(img1, "id", "markDone");
    			add_location(img1, file$8, 42, 202, 1115);
    			attr_dev(button, "class", "btn btn-lg btn-light markDone");
    			add_location(button, file$8, 42, 8, 921);
    			attr_dev(td, "class", "groceryListItem");
    			add_location(td, file$8, 38, 6, 728);
    			attr_dev(tr, "class", "row-danger");
    			add_location(tr, file$8, 37, 4, 693);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, t0);
    			append_dev(td, t1);
    			append_dev(td, button);
    			append_dev(button, t2);
    			append_dev(button, img0);
    			append_dev(button, t3);
    			append_dev(button, img1);
    			append_dev(tr, t4);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(markDone(/*ite*/ ctx[4].Item, this.parentElement.parentElement, /*$claims*/ ctx[1]))) markDone(/*ite*/ ctx[4].Item, this.parentElement.parentElement, /*$claims*/ ctx[1]).apply(this, arguments);
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
    			if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*ite*/ ctx[4].Item + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(37:4) {#each items as ite }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let table;
    	let legend;
    	let t1;
    	let thead;
    	let t2;
    	let tbody;
    	let t3;
    	let br;
    	let t4;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			legend = element("legend");
    			legend.textContent = "Grocery List";
    			t1 = space();
    			thead = element("thead");
    			t2 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			br = element("br");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Refresh";
    			add_location(legend, file$8, 30, 2, 566);
    			add_location(thead, file$8, 31, 2, 598);
    			add_location(tbody, file$8, 35, 2, 655);
    			attr_dev(table, "class", "table table-responsive table-light");
    			attr_dev(table, "id", "groceryList");
    			add_location(table, file$8, 29, 0, 496);
    			attr_dev(div, "class", "container-fluid");
    			add_location(div, file$8, 28, 0, 466);
    			add_location(br, file$8, 56, 0, 1463);
    			attr_dev(button, "class", "btn btn-lg btn-primary float-right");
    			add_location(button, file$8, 58, 0, 1471);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, legend);
    			append_dev(table, t1);
    			append_dev(table, thead);
    			append_dev(table, t2);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t3, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*markDone, items, $claims*/ 3) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $claims;
    	validate_store(claims, 'claims');
    	component_subscribe($$self, claims, $$value => $$invalidate(1, $claims = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GroceryListComponent', slots, []);
    	let { items = [] } = $$props;
    	let { remainingItems = [] } = $$props;

    	onMount(async () => {
    		let q = `
  {
    grocerylist(where: {Done: {_eq: "No"}}) {
        Item
    }
  }
  `;

    		let temp = await executeGraphql(q, $claims);
    		$$invalidate(0, items = temp.data.grocerylist);
    	});

    	const writable_props = ['items', 'remainingItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GroceryListComponent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => location.reload();

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('remainingItems' in $$props) $$invalidate(2, remainingItems = $$props.remainingItems);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		markDone,
    		executeGraphql,
    		link,
    		claims,
    		items,
    		remainingItems,
    		$claims
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('remainingItems' in $$props) $$invalidate(2, remainingItems = $$props.remainingItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [items, $claims, remainingItems, click_handler];
    }

    class GroceryListComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { items: 0, remainingItems: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GroceryListComponent",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get items() {
    		throw new Error("<GroceryListComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<GroceryListComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get remainingItems() {
    		throw new Error("<GroceryListComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set remainingItems(value) {
    		throw new Error("<GroceryListComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MealsComponent.svelte generated by Svelte v3.46.4 */

    const { console: console_1$7 } = globals;
    const file$9 = "src/components/MealsComponent.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    // (54:0) {#if !category}
    function create_if_block_1$5(ctx) {
    	let div18;
    	let div2;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let h50;
    	let button0;
    	let t2;
    	let div5;
    	let div4;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let div3;
    	let h51;
    	let button1;
    	let t5;
    	let div8;
    	let div7;
    	let img2;
    	let img2_src_value;
    	let t6;
    	let div6;
    	let h52;
    	let button2;
    	let t8;
    	let div11;
    	let div10;
    	let img3;
    	let img3_src_value;
    	let t9;
    	let div9;
    	let h53;
    	let button3;
    	let t11;
    	let div14;
    	let div13;
    	let img4;
    	let img4_src_value;
    	let t12;
    	let div12;
    	let h54;
    	let button4;
    	let t14;
    	let div17;
    	let div16;
    	let img5;
    	let img5_src_value;
    	let t15;
    	let div15;
    	let h55;
    	let button5;
    	let t17;
    	let br0;
    	let t18;
    	let br1;
    	let t19;
    	let br2;
    	let t20;
    	let hr0;
    	let t21;
    	let hr1;
    	let t22;
    	let hr2;
    	let t23;
    	let br3;
    	let t24;
    	let br4;
    	let t25;
    	let br5;
    	let t26;
    	let div31;
    	let div21;
    	let div20;
    	let img6;
    	let img6_src_value;
    	let t27;
    	let div19;
    	let h56;
    	let button6;
    	let t29;
    	let div24;
    	let div23;
    	let img7;
    	let img7_src_value;
    	let t30;
    	let div22;
    	let h57;
    	let button7;
    	let t32;
    	let div27;
    	let div26;
    	let img8;
    	let img8_src_value;
    	let t33;
    	let div25;
    	let h58;
    	let button8;
    	let t35;
    	let div30;
    	let div29;
    	let img9;
    	let img9_src_value;
    	let t36;
    	let div28;
    	let h59;
    	let button9;
    	let t38;
    	let div44;
    	let div34;
    	let div33;
    	let img10;
    	let img10_src_value;
    	let t39;
    	let div32;
    	let h510;
    	let button10;
    	let t41;
    	let div37;
    	let div36;
    	let img11;
    	let img11_src_value;
    	let t42;
    	let div35;
    	let h511;
    	let button11;
    	let t44;
    	let div40;
    	let div39;
    	let img12;
    	let img12_src_value;
    	let t45;
    	let div38;
    	let h512;
    	let button12;
    	let t47;
    	let div43;
    	let div42;
    	let img13;
    	let img13_src_value;
    	let t48;
    	let div41;
    	let h513;
    	let button13;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div18 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			h50 = element("h5");
    			button0 = element("button");
    			button0.textContent = "Breakfast";
    			t2 = space();
    			div5 = element("div");
    			div4 = element("div");
    			img1 = element("img");
    			t3 = space();
    			div3 = element("div");
    			h51 = element("h5");
    			button1 = element("button");
    			button1.textContent = "Lunch/Dinner";
    			t5 = space();
    			div8 = element("div");
    			div7 = element("div");
    			img2 = element("img");
    			t6 = space();
    			div6 = element("div");
    			h52 = element("h5");
    			button2 = element("button");
    			button2.textContent = "Salad";
    			t8 = space();
    			div11 = element("div");
    			div10 = element("div");
    			img3 = element("img");
    			t9 = space();
    			div9 = element("div");
    			h53 = element("h5");
    			button3 = element("button");
    			button3.textContent = "Snack";
    			t11 = space();
    			div14 = element("div");
    			div13 = element("div");
    			img4 = element("img");
    			t12 = space();
    			div12 = element("div");
    			h54 = element("h5");
    			button4 = element("button");
    			button4.textContent = "Smoothie";
    			t14 = space();
    			div17 = element("div");
    			div16 = element("div");
    			img5 = element("img");
    			t15 = space();
    			div15 = element("div");
    			h55 = element("h5");
    			button5 = element("button");
    			button5.textContent = "Dessert";
    			t17 = space();
    			br0 = element("br");
    			t18 = space();
    			br1 = element("br");
    			t19 = space();
    			br2 = element("br");
    			t20 = space();
    			hr0 = element("hr");
    			t21 = space();
    			hr1 = element("hr");
    			t22 = space();
    			hr2 = element("hr");
    			t23 = space();
    			br3 = element("br");
    			t24 = space();
    			br4 = element("br");
    			t25 = space();
    			br5 = element("br");
    			t26 = space();
    			div31 = element("div");
    			div21 = element("div");
    			div20 = element("div");
    			img6 = element("img");
    			t27 = space();
    			div19 = element("div");
    			h56 = element("h5");
    			button6 = element("button");
    			button6.textContent = "Barfood";
    			t29 = space();
    			div24 = element("div");
    			div23 = element("div");
    			img7 = element("img");
    			t30 = space();
    			div22 = element("div");
    			h57 = element("h5");
    			button7 = element("button");
    			button7.textContent = "Asian";
    			t32 = space();
    			div27 = element("div");
    			div26 = element("div");
    			img8 = element("img");
    			t33 = space();
    			div25 = element("div");
    			h58 = element("h5");
    			button8 = element("button");
    			button8.textContent = "Italian";
    			t35 = space();
    			div30 = element("div");
    			div29 = element("div");
    			img9 = element("img");
    			t36 = space();
    			div28 = element("div");
    			h59 = element("h5");
    			button9 = element("button");
    			button9.textContent = "Meat Lovers";
    			t38 = space();
    			div44 = element("div");
    			div34 = element("div");
    			div33 = element("div");
    			img10 = element("img");
    			t39 = space();
    			div32 = element("div");
    			h510 = element("h5");
    			button10 = element("button");
    			button10.textContent = "Low Sugar";
    			t41 = space();
    			div37 = element("div");
    			div36 = element("div");
    			img11 = element("img");
    			t42 = space();
    			div35 = element("div");
    			h511 = element("h5");
    			button11 = element("button");
    			button11.textContent = "Low Carb";
    			t44 = space();
    			div40 = element("div");
    			div39 = element("div");
    			img12 = element("img");
    			t45 = space();
    			div38 = element("div");
    			h512 = element("h5");
    			button12 = element("button");
    			button12.textContent = "Veggie Lovers";
    			t47 = space();
    			div43 = element("div");
    			div42 = element("div");
    			img13 = element("img");
    			t48 = space();
    			div41 = element("div");
    			h513 = element("h5");
    			button13 = element("button");
    			button13.textContent = "High Protein";
    			attr_dev(img0, "class", "card-img-top");
    			if (!src_url_equal(img0.src, img0_src_value = "/icons/breakfast_category.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "produce");
    			add_location(img0, file$9, 57, 6, 1549);
    			attr_dev(button0, "class", "btn btn-primary btn-lg");
    			add_location(button0, file$9, 60, 8, 1758);
    			attr_dev(h50, "class", "card-title");
    			add_location(h50, file$9, 59, 8, 1726);
    			attr_dev(div0, "class", "card-body text-center");
    			add_location(div0, file$9, 58, 6, 1681);
    			attr_dev(div1, "class", "card");
    			add_location(div1, file$9, 56, 4, 1524);
    			attr_dev(div2, "class", "col-sm-6 category");
    			add_location(div2, file$9, 55, 2, 1488);
    			attr_dev(img1, "class", "card-img-top");
    			if (!src_url_equal(img1.src, img1_src_value = "/icons/lunch_category.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "fruit");
    			add_location(img1, file$9, 67, 6, 1973);
    			attr_dev(button1, "class", "btn btn-primary btn-lg");
    			add_location(button1, file$9, 70, 8, 2180);
    			attr_dev(h51, "class", "card-title text-center");
    			add_location(h51, file$9, 69, 8, 2136);
    			attr_dev(div3, "class", "card-body");
    			add_location(div3, file$9, 68, 6, 2103);
    			attr_dev(div4, "class", "card");
    			add_location(div4, file$9, 66, 4, 1948);
    			attr_dev(div5, "class", "col-sm-6 category");
    			add_location(div5, file$9, 65, 2, 1912);
    			attr_dev(img2, "class", "card-img-top");
    			if (!src_url_equal(img2.src, img2_src_value = "/icons/salad_category.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "dairy");
    			add_location(img2, file$9, 77, 6, 2402);
    			attr_dev(button2, "class", "btn btn-primary btn-lg");
    			add_location(button2, file$9, 80, 8, 2601);
    			attr_dev(h52, "class", "card-title");
    			add_location(h52, file$9, 79, 8, 2569);
    			attr_dev(div6, "class", "card-body text-center");
    			add_location(div6, file$9, 78, 6, 2524);
    			attr_dev(div7, "class", "card");
    			add_location(div7, file$9, 76, 4, 2377);
    			attr_dev(div8, "class", "col-sm-6 category");
    			add_location(div8, file$9, 75, 2, 2341);
    			attr_dev(img3, "class", "card-img-top");
    			if (!src_url_equal(img3.src, img3_src_value = "/icons/snacks_category.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "produce");
    			add_location(img3, file$9, 90, 6, 2852);
    			attr_dev(button3, "class", "btn btn-primary btn-lg");
    			add_location(button3, file$9, 93, 8, 3054);
    			attr_dev(h53, "class", "card-title");
    			add_location(h53, file$9, 92, 8, 3022);
    			attr_dev(div9, "class", "card-body text-center");
    			add_location(div9, file$9, 91, 6, 2977);
    			attr_dev(div10, "class", "card");
    			add_location(div10, file$9, 89, 4, 2827);
    			attr_dev(div11, "class", "col-sm-6 category");
    			add_location(div11, file$9, 88, 2, 2791);
    			attr_dev(img4, "class", "card-img-top");
    			if (!src_url_equal(img4.src, img4_src_value = "/icons/smoothie_category.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "fruit");
    			add_location(img4, file$9, 100, 6, 3261);
    			attr_dev(button4, "class", "btn btn-primary btn-lg");
    			add_location(button4, file$9, 103, 8, 3466);
    			attr_dev(h54, "class", "card-title text-center");
    			add_location(h54, file$9, 102, 8, 3422);
    			attr_dev(div12, "class", "card-body");
    			add_location(div12, file$9, 101, 6, 3389);
    			attr_dev(div13, "class", "card");
    			add_location(div13, file$9, 99, 4, 3236);
    			attr_dev(div14, "class", "col-sm-6 category");
    			add_location(div14, file$9, 98, 2, 3200);
    			attr_dev(img5, "class", "card-img-top");
    			if (!src_url_equal(img5.src, img5_src_value = "/icons/dessert_category.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "dairy");
    			add_location(img5, file$9, 110, 6, 3679);
    			attr_dev(button5, "class", "btn btn-primary btn-lg");
    			add_location(button5, file$9, 113, 8, 3882);
    			attr_dev(h55, "class", "card-title");
    			add_location(h55, file$9, 112, 8, 3850);
    			attr_dev(div15, "class", "card-body text-center");
    			add_location(div15, file$9, 111, 6, 3805);
    			attr_dev(div16, "class", "card");
    			add_location(div16, file$9, 109, 4, 3654);
    			attr_dev(div17, "class", "col-sm-6 category");
    			add_location(div17, file$9, 108, 2, 3618);
    			attr_dev(div18, "class", "row");
    			add_location(div18, file$9, 54, 0, 1468);
    			add_location(br0, file$9, 121, 0, 4039);
    			add_location(br1, file$9, 122, 0, 4046);
    			add_location(br2, file$9, 123, 0, 4053);
    			add_location(hr0, file$9, 125, 0, 4061);
    			add_location(hr1, file$9, 126, 0, 4068);
    			add_location(hr2, file$9, 127, 0, 4075);
    			add_location(br3, file$9, 129, 0, 4083);
    			add_location(br4, file$9, 130, 0, 4090);
    			add_location(br5, file$9, 131, 0, 4097);
    			attr_dev(img6, "class", "card-img-top");
    			if (!src_url_equal(img6.src, img6_src_value = "/open-iconic-master/svg/lock-locked.svg")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "produce");
    			add_location(img6, file$9, 136, 6, 4199);
    			attr_dev(button6, "class", "btn btn-primary btn-lg category");
    			add_location(button6, file$9, 140, 8, 4553);
    			attr_dev(h56, "class", "card-title");
    			add_location(h56, file$9, 139, 8, 4521);
    			attr_dev(div19, "class", "card-body text-center");
    			add_location(div19, file$9, 138, 6, 4476);
    			attr_dev(div20, "class", "card");
    			set_style(div20, "width", "18rem");
    			add_location(div20, file$9, 135, 4, 4152);
    			attr_dev(div21, "class", "col-md-2");
    			add_location(div21, file$9, 134, 2, 4125);
    			attr_dev(img7, "class", "card-img-top");
    			if (!src_url_equal(img7.src, img7_src_value = "/open-iconic-master/svg/lock-locked.svg")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "produce");
    			add_location(img7, file$9, 147, 6, 4786);
    			attr_dev(button7, "class", "btn btn-primary btn-lg category");
    			add_location(button7, file$9, 151, 8, 5134);
    			attr_dev(h57, "class", "card-title text-center");
    			add_location(h57, file$9, 150, 8, 5090);
    			attr_dev(div22, "class", "card-body");
    			add_location(div22, file$9, 149, 6, 5057);
    			attr_dev(div23, "class", "card");
    			set_style(div23, "width", "18rem");
    			add_location(div23, file$9, 146, 4, 4739);
    			attr_dev(div24, "class", "col-md-2");
    			add_location(div24, file$9, 145, 2, 4712);
    			attr_dev(img8, "class", "card-img-top");
    			if (!src_url_equal(img8.src, img8_src_value = "/open-iconic-master/svg/lock-locked.svg")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "produce");
    			add_location(img8, file$9, 158, 6, 5363);
    			attr_dev(button8, "class", "btn btn-primary btn-lg category");
    			add_location(button8, file$9, 162, 8, 5715);
    			attr_dev(h58, "class", "card-title");
    			add_location(h58, file$9, 161, 8, 5683);
    			attr_dev(div25, "class", "card-body text-center");
    			add_location(div25, file$9, 160, 6, 5638);
    			attr_dev(div26, "class", "card");
    			set_style(div26, "width", "18rem");
    			add_location(div26, file$9, 157, 4, 5316);
    			attr_dev(div27, "class", "col-md-2");
    			add_location(div27, file$9, 156, 2, 5289);
    			attr_dev(img9, "class", "card-img-top");
    			if (!src_url_equal(img9.src, img9_src_value = "/open-iconic-master/svg/lock-locked.svg")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "produce");
    			add_location(img9, file$9, 169, 6, 5948);
    			attr_dev(button9, "class", "btn btn-primary btn-lg category");
    			add_location(button9, file$9, 173, 8, 6307);
    			attr_dev(h59, "class", "card-title");
    			add_location(h59, file$9, 172, 8, 6275);
    			attr_dev(div28, "class", "card-body text-center");
    			add_location(div28, file$9, 171, 6, 6230);
    			attr_dev(div29, "class", "card");
    			set_style(div29, "width", "18rem");
    			add_location(div29, file$9, 168, 4, 5901);
    			attr_dev(div30, "class", "col-md-2");
    			add_location(div30, file$9, 167, 2, 5874);
    			attr_dev(div31, "class", "row");
    			add_location(div31, file$9, 133, 0, 4105);
    			attr_dev(img10, "class", "card-img-top");
    			if (!src_url_equal(img10.src, img10_src_value = "/open-iconic-master/svg/lock-locked.svg")) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "alt", "produce");
    			add_location(img10, file$9, 183, 6, 6576);
    			attr_dev(button10, "class", "btn btn-primary btn-lg category");
    			add_location(button10, file$9, 187, 8, 6933);
    			attr_dev(h510, "class", "card-title");
    			add_location(h510, file$9, 186, 8, 6901);
    			attr_dev(div32, "class", "card-body text-center");
    			add_location(div32, file$9, 185, 6, 6856);
    			attr_dev(div33, "class", "card");
    			set_style(div33, "width", "18rem");
    			add_location(div33, file$9, 182, 4, 6529);
    			attr_dev(div34, "class", "col-md-3");
    			add_location(div34, file$9, 181, 2, 6502);
    			attr_dev(img11, "class", "card-img-top");
    			if (!src_url_equal(img11.src, img11_src_value = "/open-iconic-master/svg/lock-locked.svg")) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "alt", "produce");
    			add_location(img11, file$9, 194, 6, 7170);
    			attr_dev(button11, "class", "btn btn-primary btn-lg category");
    			add_location(button11, file$9, 198, 8, 7523);
    			attr_dev(h511, "class", "card-title text-center");
    			add_location(h511, file$9, 197, 8, 7479);
    			attr_dev(div35, "class", "card-body");
    			add_location(div35, file$9, 196, 6, 7446);
    			attr_dev(div36, "class", "card");
    			set_style(div36, "width", "18rem");
    			add_location(div36, file$9, 193, 4, 7123);
    			attr_dev(div37, "class", "col-md-3");
    			add_location(div37, file$9, 192, 2, 7096);
    			attr_dev(img12, "class", "card-img-top");
    			if (!src_url_equal(img12.src, img12_src_value = "/open-iconic-master/svg/lock-locked.svg")) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "alt", "produce");
    			add_location(img12, file$9, 205, 6, 7758);
    			attr_dev(button12, "class", "btn btn-primary btn-lg category");
    			add_location(button12, file$9, 209, 8, 8121);
    			attr_dev(h512, "class", "card-title");
    			add_location(h512, file$9, 208, 8, 8089);
    			attr_dev(div38, "class", "card-body text-center");
    			add_location(div38, file$9, 207, 6, 8044);
    			attr_dev(div39, "class", "card");
    			set_style(div39, "width", "18rem");
    			add_location(div39, file$9, 204, 4, 7711);
    			attr_dev(div40, "class", "col-md-3");
    			add_location(div40, file$9, 203, 2, 7684);
    			attr_dev(img13, "class", "card-img-top");
    			if (!src_url_equal(img13.src, img13_src_value = "/open-iconic-master/svg/lock-locked.svg")) attr_dev(img13, "src", img13_src_value);
    			attr_dev(img13, "alt", "produce");
    			add_location(img13, file$9, 216, 6, 8366);
    			attr_dev(button13, "class", "btn btn-primary btn-lg category");
    			add_location(button13, file$9, 220, 8, 8727);
    			attr_dev(h513, "class", "card-title");
    			add_location(h513, file$9, 219, 8, 8695);
    			attr_dev(div41, "class", "card-body text-center");
    			add_location(div41, file$9, 218, 6, 8650);
    			attr_dev(div42, "class", "card");
    			set_style(div42, "width", "18rem");
    			add_location(div42, file$9, 215, 4, 8319);
    			attr_dev(div43, "class", "col-md-3");
    			add_location(div43, file$9, 214, 2, 8292);
    			attr_dev(div44, "class", "row");
    			add_location(div44, file$9, 180, 0, 6482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div18, anchor);
    			append_dev(div18, div2);
    			append_dev(div2, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h50);
    			append_dev(h50, button0);
    			append_dev(div18, t2);
    			append_dev(div18, div5);
    			append_dev(div5, div4);
    			append_dev(div4, img1);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, h51);
    			append_dev(h51, button1);
    			append_dev(div18, t5);
    			append_dev(div18, div8);
    			append_dev(div8, div7);
    			append_dev(div7, img2);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div6, h52);
    			append_dev(h52, button2);
    			append_dev(div18, t8);
    			append_dev(div18, div11);
    			append_dev(div11, div10);
    			append_dev(div10, img3);
    			append_dev(div10, t9);
    			append_dev(div10, div9);
    			append_dev(div9, h53);
    			append_dev(h53, button3);
    			append_dev(div18, t11);
    			append_dev(div18, div14);
    			append_dev(div14, div13);
    			append_dev(div13, img4);
    			append_dev(div13, t12);
    			append_dev(div13, div12);
    			append_dev(div12, h54);
    			append_dev(h54, button4);
    			append_dev(div18, t14);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, img5);
    			append_dev(div16, t15);
    			append_dev(div16, div15);
    			append_dev(div15, h55);
    			append_dev(h55, button5);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, hr0, anchor);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, hr1, anchor);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, hr2, anchor);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, br4, anchor);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, br5, anchor);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, div31, anchor);
    			append_dev(div31, div21);
    			append_dev(div21, div20);
    			append_dev(div20, img6);
    			append_dev(div20, t27);
    			append_dev(div20, div19);
    			append_dev(div19, h56);
    			append_dev(h56, button6);
    			append_dev(div31, t29);
    			append_dev(div31, div24);
    			append_dev(div24, div23);
    			append_dev(div23, img7);
    			append_dev(div23, t30);
    			append_dev(div23, div22);
    			append_dev(div22, h57);
    			append_dev(h57, button7);
    			append_dev(div31, t32);
    			append_dev(div31, div27);
    			append_dev(div27, div26);
    			append_dev(div26, img8);
    			append_dev(div26, t33);
    			append_dev(div26, div25);
    			append_dev(div25, h58);
    			append_dev(h58, button8);
    			append_dev(div31, t35);
    			append_dev(div31, div30);
    			append_dev(div30, div29);
    			append_dev(div29, img9);
    			append_dev(div29, t36);
    			append_dev(div29, div28);
    			append_dev(div28, h59);
    			append_dev(h59, button9);
    			insert_dev(target, t38, anchor);
    			insert_dev(target, div44, anchor);
    			append_dev(div44, div34);
    			append_dev(div34, div33);
    			append_dev(div33, img10);
    			append_dev(div33, t39);
    			append_dev(div33, div32);
    			append_dev(div32, h510);
    			append_dev(h510, button10);
    			append_dev(div44, t41);
    			append_dev(div44, div37);
    			append_dev(div37, div36);
    			append_dev(div36, img11);
    			append_dev(div36, t42);
    			append_dev(div36, div35);
    			append_dev(div35, h511);
    			append_dev(h511, button11);
    			append_dev(div44, t44);
    			append_dev(div44, div40);
    			append_dev(div40, div39);
    			append_dev(div39, img12);
    			append_dev(div39, t45);
    			append_dev(div39, div38);
    			append_dev(div38, h512);
    			append_dev(h512, button12);
    			append_dev(div44, t47);
    			append_dev(div44, div43);
    			append_dev(div43, div42);
    			append_dev(div42, img13);
    			append_dev(div42, t48);
    			append_dev(div42, div41);
    			append_dev(div41, h513);
    			append_dev(h513, button13);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(img1, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[6], false, false, false),
    					listen_dev(img2, "click", /*click_handler_4*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", /*click_handler_5*/ ctx[8], false, false, false),
    					listen_dev(img3, "click", /*click_handler_6*/ ctx[9], false, false, false),
    					listen_dev(button3, "click", /*click_handler_7*/ ctx[10], false, false, false),
    					listen_dev(img4, "click", /*click_handler_8*/ ctx[11], false, false, false),
    					listen_dev(button4, "click", /*click_handler_9*/ ctx[12], false, false, false),
    					listen_dev(img5, "click", /*click_handler_10*/ ctx[13], false, false, false),
    					listen_dev(button5, "click", /*click_handler_11*/ ctx[14], false, false, false),
    					listen_dev(img6, "click", /*click_handler_12*/ ctx[15], false, false, false),
    					listen_dev(button6, "click", /*click_handler_13*/ ctx[16], false, false, false),
    					listen_dev(img7, "click", /*click_handler_14*/ ctx[17], false, false, false),
    					listen_dev(button7, "click", /*click_handler_15*/ ctx[18], false, false, false),
    					listen_dev(img8, "click", /*click_handler_16*/ ctx[19], false, false, false),
    					listen_dev(button8, "click", /*click_handler_17*/ ctx[20], false, false, false),
    					listen_dev(img9, "click", /*click_handler_18*/ ctx[21], false, false, false),
    					listen_dev(button9, "click", /*click_handler_19*/ ctx[22], false, false, false),
    					listen_dev(img10, "click", /*click_handler_20*/ ctx[23], false, false, false),
    					listen_dev(button10, "click", /*click_handler_21*/ ctx[24], false, false, false),
    					listen_dev(img11, "click", /*click_handler_22*/ ctx[25], false, false, false),
    					listen_dev(button11, "click", /*click_handler_23*/ ctx[26], false, false, false),
    					listen_dev(img12, "click", /*click_handler_24*/ ctx[27], false, false, false),
    					listen_dev(button12, "click", /*click_handler_25*/ ctx[28], false, false, false),
    					listen_dev(img13, "click", /*click_handler_26*/ ctx[29], false, false, false),
    					listen_dev(button13, "click", /*click_handler_27*/ ctx[30], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div18);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(hr0);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(hr1);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(hr2);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(br4);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(br5);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(div31);
    			if (detaching) detach_dev(t38);
    			if (detaching) detach_dev(div44);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(54:0) {#if !category}",
    		ctx
    	});

    	return block;
    }

    // (230:0) {#if category}
    function create_if_block$6(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let h5;
    	let button;
    	let t1;
    	let table;
    	let legend;
    	let t2;
    	let t3;
    	let thead;
    	let t4;
    	let tbody;
    	let mounted;
    	let dispose;
    	let each_value = /*recipes*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h5 = element("h5");
    			button = element("button");
    			button.textContent = "← Back";
    			t1 = space();
    			table = element("table");
    			legend = element("legend");
    			t2 = text(/*category*/ ctx[1]);
    			t3 = space();
    			thead = element("thead");
    			t4 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button, "class", "btn btn-primary btn-lg category");
    			add_location(button, file$9, 236, 8, 9236);
    			attr_dev(h5, "class", "card-title");
    			add_location(h5, file$9, 235, 8, 9204);
    			attr_dev(div0, "class", "card-body text-center");
    			add_location(div0, file$9, 234, 6, 9159);
    			attr_dev(div1, "class", "card category");
    			set_style(div1, "width", "18rem");
    			add_location(div1, file$9, 232, 4, 8957);
    			attr_dev(div2, "class", "col-md-4");
    			add_location(div2, file$9, 231, 2, 8930);
    			add_location(legend, file$9, 243, 4, 9444);
    			add_location(thead, file$9, 244, 4, 9476);
    			add_location(tbody, file$9, 247, 4, 9502);
    			attr_dev(table, "class", "table-responsive table-light");
    			add_location(table, file$9, 242, 2, 9395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h5);
    			append_dev(h5, button);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, legend);
    			append_dev(legend, t2);
    			append_dev(table, t3);
    			append_dev(table, thead);
    			append_dev(table, t4);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_28*/ ctx[31], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*category*/ 2) set_data_dev(t2, /*category*/ ctx[1]);

    			if (dirty[0] & /*recipes*/ 1) {
    				each_value = /*recipes*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(230:0) {#if category}",
    		ctx
    	});

    	return block;
    }

    // (249:6) {#each recipes as rec }
    function create_each_block$8(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*rec*/ ctx[32].Recipe + "";
    	let t0;
    	let t1;
    	let td1;
    	let a0;
    	let button;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let a0_href_value;
    	let link_action;
    	let t3;
    	let td2;
    	let a1;
    	let t4;
    	let img1;
    	let img1_src_value;
    	let a1_href_value;
    	let link_action_1;
    	let tr_class_value;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			a0 = element("a");
    			button = element("button");
    			img0 = element("img");
    			t2 = text("  Recipe");
    			t3 = space();
    			td2 = element("td");
    			a1 = element("a");
    			t4 = text("I Cooked This  ");
    			img1 = element("img");
    			t5 = space();
    			attr_dev(td0, "class", "recipe");
    			add_location(td0, file$9, 251, 10, 9645);
    			attr_dev(img0, "class", "svg");
    			if (!src_url_equal(img0.src, img0_src_value = "/open-iconic-master/svg/book.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "book");
    			add_location(img0, file$9, 252, 122, 9804);
    			attr_dev(button, "class", "btn btn-lg btn-light recipeBtn");
    			add_location(button, file$9, 252, 75, 9757);
    			attr_dev(a0, "href", a0_href_value = "/recipes/" + /*rec*/ ctx[32].id);
    			add_location(a0, file$9, 252, 38, 9720);
    			attr_dev(td1, "class", "recipeBtnColumn");
    			add_location(td1, file$9, 252, 10, 9692);
    			attr_dev(img1, "class", "svg");
    			if (!src_url_equal(img1.src, img1_src_value = "/open-iconic-master/svg/task.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "task");
    			add_location(img1, file$9, 253, 154, 10052);
    			attr_dev(a1, "class", "btn btn-lg btn-success iCookedThisBtn");
    			attr_dev(a1, "href", a1_href_value = "/recipes/" + /*rec*/ ctx[32].id + "/cooking");
    			add_location(a1, file$9, 253, 43, 9941);
    			attr_dev(td2, "class", "iCookedThisBtnColumn");
    			add_location(td2, file$9, 253, 10, 9908);
    			attr_dev(tr, "class", tr_class_value = /*rec*/ ctx[32].BootstrapClass);
    			add_location(tr, file$9, 250, 10, 9596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, a0);
    			append_dev(a0, button);
    			append_dev(button, img0);
    			append_dev(button, t2);
    			append_dev(td1, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a1);
    			append_dev(a1, t4);
    			append_dev(a1, img1);
    			insert_dev(target, t5, anchor);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link_action = link.call(null, a0)),
    					action_destroyer(link_action_1 = link.call(null, a1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*recipes*/ 1 && t0_value !== (t0_value = /*rec*/ ctx[32].Recipe + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*recipes*/ 1 && a0_href_value !== (a0_href_value = "/recipes/" + /*rec*/ ctx[32].id)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty[0] & /*recipes*/ 1 && a1_href_value !== (a1_href_value = "/recipes/" + /*rec*/ ctx[32].id + "/cooking")) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			if (dirty[0] & /*recipes*/ 1 && tr_class_value !== (tr_class_value = /*rec*/ ctx[32].BootstrapClass)) {
    				attr_dev(tr, "class", tr_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (detaching) detach_dev(t5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(249:6) {#each recipes as rec }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let a;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let link_action;
    	let t1;
    	let h1;
    	let t3;
    	let t4;
    	let if_block1_anchor;
    	let mounted;
    	let dispose;
    	let if_block0 = !/*category*/ ctx[1] && create_if_block_1$5(ctx);
    	let if_block1 = /*category*/ ctx[1] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			img0 = element("img");
    			t0 = text("  See Meal History ");
    			img1 = element("img");
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "Cook a Meal";
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(img0, "class", "svg");
    			if (!src_url_equal(img0.src, img0_src_value = "/open-iconic-master/svg/project.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "mealhistory");
    			add_location(img0, file$9, 48, 92, 1220);
    			attr_dev(img1, "class", "svg");
    			if (!src_url_equal(img1.src, img1_src_value = "/open-iconic-master/svg/pie-chart.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "piechart");
    			add_location(img1, file$9, 48, 193, 1321);
    			attr_dev(a, "href", "/meals/history");
    			attr_dev(a, "class", "btn btn-lg btn-warning float-right mealsHistory");
    			add_location(a, file$9, 48, 2, 1130);
    			attr_dev(div, "class", "row");
    			add_location(div, file$9, 47, 0, 1110);
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$9, 51, 0, 1410);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, img0);
    			append_dev(a, t0);
    			append_dev(a, img1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!/*category*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					if_block0.m(t4.parentNode, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*category*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t3);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
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
    	validate_slots('MealsComponent', slots, []);
    	let { recipes = [] } = $$props;
    	let { category } = $$props;

    	onMount(async () => {
    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: '{ recipes { id Recipe Meal BootstrapClass } }'
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(0, recipes = res.data.recipes);
    			console.log(res.data);
    		});
    	});

    	function selectCategory(cat) {
    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `
        {
        recipes(where: {Meal: {_eq: "` + cat + `"}}) {
          Recipe
          id
          BootstrapClass
        }
      }
      `
    			})
    		}).then(res => res.json()).then(res => {
    			console.log(cat);
    			$$invalidate(0, recipes = res.data.recipes);
    			$$invalidate(1, category = cat);
    			console.log(res.data);
    		});
    	}

    	const writable_props = ['recipes', 'category'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<MealsComponent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => selectCategory('Breakfast');
    	const click_handler_1 = () => selectCategory('Breakfast');
    	const click_handler_2 = () => selectCategory('Lunch, Dinner');
    	const click_handler_3 = () => selectCategory('Lunch, Dinner');
    	const click_handler_4 = () => selectCategory('Salad');
    	const click_handler_5 = () => selectCategory('Salad');
    	const click_handler_6 = () => selectCategory('Snack');
    	const click_handler_7 = () => selectCategory('Snack');
    	const click_handler_8 = () => selectCategory('Smoothie');
    	const click_handler_9 = () => selectCategory('Smoothie');
    	const click_handler_10 = () => selectCategory('Dessert');
    	const click_handler_11 = () => selectCategory('Dessert');
    	const click_handler_12 = () => selectCategory('Barfood');
    	const click_handler_13 = () => selectCategory('Barfood');
    	const click_handler_14 = () => selectCategory('Barfood');
    	const click_handler_15 = () => selectCategory('Asian');
    	const click_handler_16 = () => selectCategory('Barfood');
    	const click_handler_17 = () => selectCategory('Italian');
    	const click_handler_18 = () => selectCategory('Barfood');
    	const click_handler_19 = () => selectCategory('Meat Lovers');
    	const click_handler_20 = () => selectCategory('Barfood');
    	const click_handler_21 = () => selectCategory('Low Sugar');
    	const click_handler_22 = () => selectCategory('Barfood');
    	const click_handler_23 = () => selectCategory('Low Carb');
    	const click_handler_24 = () => selectCategory('Barfood');
    	const click_handler_25 = () => selectCategory('Veggie Lovers');
    	const click_handler_26 = () => selectCategory('Barfood');
    	const click_handler_27 = () => selectCategory('High Protein');
    	const click_handler_28 = () => selectCategory(null);

    	$$self.$$set = $$props => {
    		if ('recipes' in $$props) $$invalidate(0, recipes = $$props.recipes);
    		if ('category' in $$props) $$invalidate(1, category = $$props.category);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		link,
    		recipes,
    		category,
    		selectCategory
    	});

    	$$self.$inject_state = $$props => {
    		if ('recipes' in $$props) $$invalidate(0, recipes = $$props.recipes);
    		if ('category' in $$props) $$invalidate(1, category = $$props.category);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		recipes,
    		category,
    		selectCategory,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16,
    		click_handler_17,
    		click_handler_18,
    		click_handler_19,
    		click_handler_20,
    		click_handler_21,
    		click_handler_22,
    		click_handler_23,
    		click_handler_24,
    		click_handler_25,
    		click_handler_26,
    		click_handler_27,
    		click_handler_28
    	];
    }

    class MealsComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$b,
    			create_fragment$b,
    			safe_not_equal,
    			{
    				recipes: 0,
    				category: 1,
    				selectCategory: 2
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MealsComponent",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*category*/ ctx[1] === undefined && !('category' in props)) {
    			console_1$7.warn("<MealsComponent> was created without expected prop 'category'");
    		}
    	}

    	get recipes() {
    		throw new Error("<MealsComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipes(value) {
    		throw new Error("<MealsComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<MealsComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<MealsComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectCategory() {
    		return this.$$.ctx[2];
    	}

    	set selectCategory(value) {
    		throw new Error("<MealsComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MealsCookingComponent.svelte generated by Svelte v3.46.4 */

    const { console: console_1$8 } = globals;
    const file$a = "src/components/MealsCookingComponent.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[6] = list;
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (58:0) {#if recipe}
    function create_if_block_1$6(ctx) {
    	let h3;
    	let t_value = /*recipe*/ ctx[1].Recipe + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			add_location(h3, file$a, 58, 0, 1564);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*recipe*/ 2 && t_value !== (t_value = /*recipe*/ ctx[1].Recipe + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(58:0) {#if recipe}",
    		ctx
    	});

    	return block;
    }

    // (62:0) {#if ingredients }
    function create_if_block$7(ctx) {
    	let form;
    	let table;
    	let tbody;
    	let t0;
    	let a;
    	let link_action;
    	let mounted;
    	let dispose;
    	let each_value = /*ingredients*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			form = element("form");
    			table = element("table");
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			a = element("a");
    			a.textContent = "Submit";
    			add_location(tbody, file$a, 64, 8, 1686);
    			attr_dev(table, "class", "table table-striped");
    			add_location(table, file$a, 63, 4, 1642);
    			attr_dev(a, "href", "/meals/submit");
    			attr_dev(a, "class", "btn btn-lg btn-success");
    			add_location(a, file$a, 77, 4, 2138);
    			attr_dev(form, "class", "content");
    			add_location(form, file$a, 62, 0, 1615);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, table);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(form, t0);
    			append_dev(form, a);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ingredients*/ 1) {
    				each_value = /*ingredients*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(62:0) {#if ingredients }",
    		ctx
    	});

    	return block;
    }

    // (66:8) {#each ingredients as ing }
    function create_each_block$9(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*ing*/ ctx[5].ingredients_recipe.Ingredient + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2;
    	let input0;
    	let t3;
    	let td2;
    	let t4;
    	let input1;
    	let t5;
    	let mounted;
    	let dispose;

    	function input0_input_handler() {
    		/*input0_input_handler*/ ctx[3].call(input0, /*each_value*/ ctx[6], /*ing_index*/ ctx[7]);
    	}

    	function input1_input_handler() {
    		/*input1_input_handler*/ ctx[4].call(input1, /*each_value*/ ctx[6], /*ing_index*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text("Quantity\n                    ");
    			input0 = element("input");
    			t3 = space();
    			td2 = element("td");
    			t4 = text("Measurement\n                    ");
    			input1 = element("input");
    			t5 = space();
    			add_location(td0, file$a, 67, 16, 1763);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$a, 69, 20, 1857);
    			add_location(td1, file$a, 68, 16, 1824);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$a, 71, 20, 1984);
    			add_location(td2, file$a, 70, 16, 1948);
    			add_location(tr, file$a, 66, 12, 1742);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(td1, input0);
    			set_input_value(input0, /*ing*/ ctx[5].Quantity);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(td2, input1);
    			set_input_value(input1, /*ing*/ ctx[5].Quantity_Measurement);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", input0_input_handler),
    					listen_dev(input1, "input", input1_input_handler)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*ingredients*/ 1 && t0_value !== (t0_value = /*ing*/ ctx[5].ingredients_recipe.Ingredient + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*ingredients*/ 1 && to_number(input0.value) !== /*ing*/ ctx[5].Quantity) {
    				set_input_value(input0, /*ing*/ ctx[5].Quantity);
    			}

    			if (dirty & /*ingredients*/ 1 && input1.value !== /*ing*/ ctx[5].Quantity_Measurement) {
    				set_input_value(input1, /*ing*/ ctx[5].Quantity_Measurement);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(66:8) {#each ingredients as ing }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let h1;
    	let t1;
    	let t2;
    	let if_block1_anchor;
    	let if_block0 = /*recipe*/ ctx[1] && create_if_block_1$6(ctx);
    	let if_block1 = /*ingredients*/ ctx[0] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Cook a New Meal";
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$a, 55, 0, 1505);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*recipe*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					if_block0.m(t2.parentNode, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*ingredients*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MealsCookingComponent', slots, []);
    	let { params } = $$props;
    	let { ingredients } = $$props;
    	let { recipe } = $$props;

    	onMount(async () => {
    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `{
                ingredients_recipes(where: {RecipeID: {_eq: ` + params.id + `}}) {
                    ingredients_recipe {
                    Ingredient
                    }
                    Quantity
                    Quantity_Measurement
                    ingredients_recipe_2 {
                    Recipe
                    }
                }
            }`
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(0, ingredients = res.data.ingredients_recipes);
    			console.log(res.data);
    		});

    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `{
                recipes_by_pk(id: ` + params.id + `) {
                    Recipe
                }
            }`
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(1, recipe = res.data.recipes_by_pk);
    			console.log(res.data);
    		});
    	});

    	const writable_props = ['params', 'ingredients', 'recipe'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<MealsCookingComponent> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler(each_value, ing_index) {
    		each_value[ing_index].Quantity = to_number(this.value);
    		$$invalidate(0, ingredients);
    	}

    	function input1_input_handler(each_value, ing_index) {
    		each_value[ing_index].Quantity_Measurement = this.value;
    		$$invalidate(0, ingredients);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(2, params = $$props.params);
    		if ('ingredients' in $$props) $$invalidate(0, ingredients = $$props.ingredients);
    		if ('recipe' in $$props) $$invalidate(1, recipe = $$props.recipe);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		link,
    		params,
    		ingredients,
    		recipe
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(2, params = $$props.params);
    		if ('ingredients' in $$props) $$invalidate(0, ingredients = $$props.ingredients);
    		if ('recipe' in $$props) $$invalidate(1, recipe = $$props.recipe);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ingredients, recipe, params, input0_input_handler, input1_input_handler];
    }

    class MealsCookingComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { params: 2, ingredients: 0, recipe: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MealsCookingComponent",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[2] === undefined && !('params' in props)) {
    			console_1$8.warn("<MealsCookingComponent> was created without expected prop 'params'");
    		}

    		if (/*ingredients*/ ctx[0] === undefined && !('ingredients' in props)) {
    			console_1$8.warn("<MealsCookingComponent> was created without expected prop 'ingredients'");
    		}

    		if (/*recipe*/ ctx[1] === undefined && !('recipe' in props)) {
    			console_1$8.warn("<MealsCookingComponent> was created without expected prop 'recipe'");
    		}
    	}

    	get params() {
    		throw new Error("<MealsCookingComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<MealsCookingComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ingredients() {
    		throw new Error("<MealsCookingComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ingredients(value) {
    		throw new Error("<MealsCookingComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get recipe() {
    		throw new Error("<MealsCookingComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipe(value) {
    		throw new Error("<MealsCookingComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MealsHistoryComponent.svelte generated by Svelte v3.46.4 */

    const { console: console_1$9 } = globals;
    const file$b = "src/components/MealsHistoryComponent.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (41:0) {#if meals }
    function create_if_block$8(ctx) {
    	let table;
    	let thead;
    	let t;
    	let tbody;
    	let each_value = /*meals*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			t = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(thead, file$b, 42, 4, 1088);
    			add_location(tbody, file$b, 44, 4, 1113);
    			attr_dev(table, "class", "table");
    			add_location(table, file$b, 41, 0, 1062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(table, t);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*meals*/ 1) {
    				each_value = /*meals*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(41:0) {#if meals }",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#each meals as mea }
    function create_each_block$a(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*mea*/ ctx[2].Quantity + "";
    	let t0;
    	let t1;
    	let t2_value = /*mea*/ ctx[2].Quantity_Measurement + "";
    	let t2;
    	let t3;
    	let td1;
    	let a;
    	let t4_value = /*mea*/ ctx[2].ingredients_meals_2.meals_recipes.Recipe + "";
    	let t4;
    	let a_href_value;
    	let link_action;
    	let t5;
    	let td2;
    	let t6_value = /*mea*/ ctx[2].ingredients_meals_2.Date + "";
    	let t6;
    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			td1 = element("td");
    			a = element("a");
    			t4 = text(t4_value);
    			t5 = space();
    			td2 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			add_location(td0, file$b, 47, 12, 1172);
    			attr_dev(a, "href", a_href_value = "/meals/" + /*mea*/ ctx[2].MealID);
    			attr_dev(a, "class", "btn btn-lg btn-dark");
    			add_location(a, file$b, 48, 16, 1247);
    			add_location(td1, file$b, 48, 12, 1243);
    			add_location(td2, file$b, 49, 12, 1390);
    			add_location(tr, file$b, 46, 8, 1155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			append_dev(td0, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td1);
    			append_dev(td1, a);
    			append_dev(a, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td2);
    			append_dev(td2, t6);
    			append_dev(tr, t7);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*meals*/ 1 && t0_value !== (t0_value = /*mea*/ ctx[2].Quantity + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*meals*/ 1 && t2_value !== (t2_value = /*mea*/ ctx[2].Quantity_Measurement + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*meals*/ 1 && t4_value !== (t4_value = /*mea*/ ctx[2].ingredients_meals_2.meals_recipes.Recipe + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*meals*/ 1 && a_href_value !== (a_href_value = "/meals/" + /*mea*/ ctx[2].MealID)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*meals*/ 1 && t6_value !== (t6_value = /*mea*/ ctx[2].ingredients_meals_2.Date + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(46:4) {#each meals as mea }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let h1;
    	let t1;
    	let if_block_anchor;
    	let if_block = /*meals*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Meal History";
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$b, 38, 0, 1006);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*meals*/ ctx[0]) {
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	validate_slots('MealsHistoryComponent', slots, []);
    	let { params } = $$props;
    	let { meals } = $$props;

    	onMount(async () => {
    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `{
                ingredients_meals(where: {ingredients_meals: {id: {_eq: 70}}}) {
                    ingredients_meals_2 {
                    Date
                    meals_recipes {
                        Recipe
                    }
                }
                    Quantity
                    Quantity_Measurement
                    MealID
                }
            }`
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(0, meals = res.data.ingredients_meals);
    			console.log(res.data);
    		});
    	});

    	const writable_props = ['params', 'meals'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<MealsHistoryComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('meals' in $$props) $$invalidate(0, meals = $$props.meals);
    	};

    	$$self.$capture_state = () => ({ onMount, link, params, meals });

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('meals' in $$props) $$invalidate(0, meals = $$props.meals);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [meals, params];
    }

    class MealsHistoryComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { params: 1, meals: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MealsHistoryComponent",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[1] === undefined && !('params' in props)) {
    			console_1$9.warn("<MealsHistoryComponent> was created without expected prop 'params'");
    		}

    		if (/*meals*/ ctx[0] === undefined && !('meals' in props)) {
    			console_1$9.warn("<MealsHistoryComponent> was created without expected prop 'meals'");
    		}
    	}

    	get params() {
    		throw new Error("<MealsHistoryComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<MealsHistoryComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meals() {
    		throw new Error("<MealsHistoryComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meals(value) {
    		throw new Error("<MealsHistoryComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MealsDetailComponent.svelte generated by Svelte v3.46.4 */

    const { console: console_1$a } = globals;
    const file$c = "src/components/MealsDetailComponent.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (61:0) {#if meal}
    function create_if_block_1$7(ctx) {
    	let h1;
    	let t0_value = /*meal*/ ctx[1].meals_recipes.Recipe + "";
    	let t0;
    	let t1;
    	let h2;
    	let t2_value = /*meal*/ ctx[1].Date + "";
    	let t2;
    	let t3;
    	let h40;
    	let t4;
    	let t5_value = /*meal*/ ctx[1].Cost + "";
    	let t5;
    	let t6;
    	let h41;
    	let em;
    	let t7_value = /*meal*/ ctx[1].Notes + "";
    	let t7;
    	let t8;
    	let br;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(t2_value);
    			t3 = space();
    			h40 = element("h4");
    			t4 = text("$");
    			t5 = text(t5_value);
    			t6 = space();
    			h41 = element("h4");
    			em = element("em");
    			t7 = text(t7_value);
    			t8 = space();
    			br = element("br");
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$c, 61, 0, 1573);
    			attr_dev(h2, "class", "text-center");
    			add_location(h2, file$c, 62, 0, 1630);
    			attr_dev(h40, "class", "text-center");
    			add_location(h40, file$c, 63, 0, 1671);
    			add_location(em, file$c, 64, 24, 1737);
    			attr_dev(h41, "class", "text-center");
    			add_location(h41, file$c, 64, 0, 1713);
    			add_location(br, file$c, 65, 0, 1764);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h40, anchor);
    			append_dev(h40, t4);
    			append_dev(h40, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, h41, anchor);
    			append_dev(h41, em);
    			append_dev(em, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*meal*/ 2 && t0_value !== (t0_value = /*meal*/ ctx[1].meals_recipes.Recipe + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*meal*/ 2 && t2_value !== (t2_value = /*meal*/ ctx[1].Date + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*meal*/ 2 && t5_value !== (t5_value = /*meal*/ ctx[1].Cost + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*meal*/ 2 && t7_value !== (t7_value = /*meal*/ ctx[1].Notes + "")) set_data_dev(t7, t7_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h40);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(h41);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(61:0) {#if meal}",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#if ingredients}
    function create_if_block$9(ctx) {
    	let table;
    	let thead;
    	let t;
    	let tbody;
    	let each_value = /*ingredients*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			t = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(thead, file$c, 72, 1, 1841);
    			add_location(tbody, file$c, 74, 1, 1860);
    			attr_dev(table, "class", "table");
    			add_location(table, file$c, 71, 0, 1818);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(table, t);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ingredients*/ 1) {
    				each_value = /*ingredients*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(71:0) {#if ingredients}",
    		ctx
    	});

    	return block;
    }

    // (76:4) {#each ingredients as ing }
    function create_each_block$b(ctx) {
    	let tr;
    	let td0;
    	let strong;
    	let t0_value = /*ing*/ ctx[3].Quantity + "";
    	let t0;
    	let t1;
    	let t2_value = /*ing*/ ctx[3].Quantity_Measurement + "";
    	let t2;
    	let t3;
    	let td1;
    	let a;
    	let t4_value = /*ing*/ ctx[3].ingredients_meals.Brand + "";
    	let t4;
    	let t5;
    	let t6_value = /*ing*/ ctx[3].ingredients_meals.Ingredient + "";
    	let t6;
    	let a_href_value;
    	let link_action;
    	let t7;
    	let td2;
    	let em;
    	let t9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			td1 = element("td");
    			a = element("a");
    			t4 = text(t4_value);
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = space();
    			td2 = element("td");
    			em = element("em");
    			em.textContent = "$0.53";
    			t9 = space();
    			add_location(strong, file$c, 77, 27, 1934);
    			attr_dev(td0, "class", "text-center");
    			add_location(td0, file$c, 77, 3, 1910);
    			attr_dev(a, "href", a_href_value = "/ingredients/" + /*ing*/ ctx[3].ingredients_meals.id);
    			attr_dev(a, "class", "btn btn-lg btn-secondary");
    			add_location(a, file$c, 78, 27, 2026);
    			attr_dev(td1, "class", "text-center");
    			add_location(td1, file$c, 78, 3, 2002);
    			add_location(em, file$c, 79, 16, 2208);
    			add_location(td2, file$c, 79, 12, 2204);
    			add_location(tr, file$c, 76, 2, 1902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, strong);
    			append_dev(strong, t0);
    			append_dev(strong, t1);
    			append_dev(strong, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td1);
    			append_dev(td1, a);
    			append_dev(a, t4);
    			append_dev(a, t5);
    			append_dev(a, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td2);
    			append_dev(td2, em);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ingredients*/ 1 && t0_value !== (t0_value = /*ing*/ ctx[3].Quantity + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*ingredients*/ 1 && t2_value !== (t2_value = /*ing*/ ctx[3].Quantity_Measurement + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*ingredients*/ 1 && t4_value !== (t4_value = /*ing*/ ctx[3].ingredients_meals.Brand + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*ingredients*/ 1 && t6_value !== (t6_value = /*ing*/ ctx[3].ingredients_meals.Ingredient + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*ingredients*/ 1 && a_href_value !== (a_href_value = "/ingredients/" + /*ing*/ ctx[3].ingredients_meals.id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(76:4) {#each ingredients as ing }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let t0;
    	let h2;
    	let t2;
    	let if_block1_anchor;
    	let if_block0 = /*meal*/ ctx[1] && create_if_block_1$7(ctx);
    	let if_block1 = /*ingredients*/ ctx[0] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			h2 = element("h2");
    			h2.textContent = "Ingredients";
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			add_location(h2, file$c, 68, 0, 1778);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*meal*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$7(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*ingredients*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MealsDetailComponent', slots, []);
    	let { params } = $$props;
    	let { ingredients } = $$props;
    	let { meal } = $$props;

    	onMount(async () => {
    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `{
                ingredients_meals(where: {MealID: {_eq: 1}}) {
                    Quantity
                    Quantity_Measurement
                    ingredients_meals {
                    id
                    Brand
                    Ingredient
                    }
                }
            }`
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(0, ingredients = res.data.ingredients_meals);
    			console.log(res.data);
    		});

    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `{
                meals_by_pk(id: ` + params.id + `) {
                    meals_recipes {
                    Recipe
                    }
                    Date
                    Cost
                    Notes
                }
            }`
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(1, meal = res.data.meals_by_pk);
    			console.log(res.data);
    		});
    	});

    	const writable_props = ['params', 'ingredients', 'meal'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$a.warn(`<MealsDetailComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(2, params = $$props.params);
    		if ('ingredients' in $$props) $$invalidate(0, ingredients = $$props.ingredients);
    		if ('meal' in $$props) $$invalidate(1, meal = $$props.meal);
    	};

    	$$self.$capture_state = () => ({ onMount, link, params, ingredients, meal });

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(2, params = $$props.params);
    		if ('ingredients' in $$props) $$invalidate(0, ingredients = $$props.ingredients);
    		if ('meal' in $$props) $$invalidate(1, meal = $$props.meal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ingredients, meal, params];
    }

    class MealsDetailComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { params: 2, ingredients: 0, meal: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MealsDetailComponent",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[2] === undefined && !('params' in props)) {
    			console_1$a.warn("<MealsDetailComponent> was created without expected prop 'params'");
    		}

    		if (/*ingredients*/ ctx[0] === undefined && !('ingredients' in props)) {
    			console_1$a.warn("<MealsDetailComponent> was created without expected prop 'ingredients'");
    		}

    		if (/*meal*/ ctx[1] === undefined && !('meal' in props)) {
    			console_1$a.warn("<MealsDetailComponent> was created without expected prop 'meal'");
    		}
    	}

    	get params() {
    		throw new Error("<MealsDetailComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<MealsDetailComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ingredients() {
    		throw new Error("<MealsDetailComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ingredients(value) {
    		throw new Error("<MealsDetailComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meal() {
    		throw new Error("<MealsDetailComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meal(value) {
    		throw new Error("<MealsDetailComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/IngredientsComponent.svelte generated by Svelte v3.46.4 */

    const { console: console_1$b } = globals;
    const file$d = "src/components/IngredientsComponent.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (108:0) {#if ingredient}
    function create_if_block_4$3(ctx) {
    	let h1;
    	let t0_value = /*ingredient*/ ctx[1].Ingredient + "";
    	let t0;
    	let t1;
    	let h2;
    	let t2_value = /*ingredient*/ ctx[1].Brand + "";
    	let t2;
    	let t3;
    	let h3;
    	let t4;
    	let t5_value = /*ingredient*/ ctx[1].Price + "";
    	let t5;
    	let t6;
    	let h4;
    	let t7_value = /*ingredient*/ ctx[1].Calories + "";
    	let t7;
    	let t8;
    	let t9_value = /*ingredient*/ ctx[1].Calories_Serving + "";
    	let t9;
    	let t10;
    	let t11_value = /*ingredient*/ ctx[1].Calories_Serving_Measurement + "";
    	let t11;
    	let t12;
    	let br;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(t2_value);
    			t3 = space();
    			h3 = element("h3");
    			t4 = text("$");
    			t5 = text(t5_value);
    			t6 = space();
    			h4 = element("h4");
    			t7 = text(t7_value);
    			t8 = text(" calories per ");
    			t9 = text(t9_value);
    			t10 = space();
    			t11 = text(t11_value);
    			t12 = space();
    			br = element("br");
    			attr_dev(h1, "class", "text-center");
    			add_location(h1, file$d, 108, 0, 3012);
    			attr_dev(h2, "class", "text-center");
    			add_location(h2, file$d, 109, 0, 3065);
    			attr_dev(h3, "class", "text-center");
    			add_location(h3, file$d, 110, 0, 3113);
    			attr_dev(h4, "class", "text-center");
    			add_location(h4, file$d, 111, 0, 3162);
    			add_location(br, file$d, 112, 0, 3298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t4);
    			append_dev(h3, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t7);
    			append_dev(h4, t8);
    			append_dev(h4, t9);
    			append_dev(h4, t10);
    			append_dev(h4, t11);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ingredient*/ 2 && t0_value !== (t0_value = /*ingredient*/ ctx[1].Ingredient + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*ingredient*/ 2 && t2_value !== (t2_value = /*ingredient*/ ctx[1].Brand + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*ingredient*/ 2 && t5_value !== (t5_value = /*ingredient*/ ctx[1].Price + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*ingredient*/ 2 && t7_value !== (t7_value = /*ingredient*/ ctx[1].Calories + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*ingredient*/ 2 && t9_value !== (t9_value = /*ingredient*/ ctx[1].Calories_Serving + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*ingredient*/ 2 && t11_value !== (t11_value = /*ingredient*/ ctx[1].Calories_Serving_Measurement + "")) set_data_dev(t11, t11_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(108:0) {#if ingredient}",
    		ctx
    	});

    	return block;
    }

    // (116:0) {#if inventory }
    function create_if_block_3$3(ctx) {
    	let h2;
    	let t1;
    	let table;
    	let thead;
    	let t2;
    	let tbody;
    	let each_value_2 = /*inventory*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Current Inventory";
    			t1 = space();
    			table = element("table");
    			thead = element("thead");
    			t2 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h2, file$d, 116, 0, 3329);
    			add_location(thead, file$d, 118, 1, 3379);
    			add_location(tbody, file$d, 120, 1, 3398);
    			attr_dev(table, "class", "table");
    			add_location(table, file$d, 117, 0, 3356);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(table, t2);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inventory*/ 8) {
    				each_value_2 = /*inventory*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(116:0) {#if inventory }",
    		ctx
    	});

    	return block;
    }

    // (122:8) {#each inventory as inv }
    function create_each_block_2$2(ctx) {
    	let tr;
    	let td;
    	let t0_value = /*inv*/ ctx[12].Quantity + "";
    	let t0;
    	let t1;
    	let t2_value = /*inv*/ ctx[12].Quantity_Measurement + "";
    	let t2;
    	let t3;
    	let t4_value = /*inv*/ ctx[12].Location + "";
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text(" in the ");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(td, "class", "text-center");
    			add_location(td, file$d, 123, 3, 3450);
    			add_location(tr, file$d, 122, 2, 3442);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, t0);
    			append_dev(td, t1);
    			append_dev(td, t2);
    			append_dev(td, t3);
    			append_dev(td, t4);
    			append_dev(tr, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inventory*/ 8 && t0_value !== (t0_value = /*inv*/ ctx[12].Quantity + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*inventory*/ 8 && t2_value !== (t2_value = /*inv*/ ctx[12].Quantity_Measurement + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*inventory*/ 8 && t4_value !== (t4_value = /*inv*/ ctx[12].Location + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(122:8) {#each inventory as inv }",
    		ctx
    	});

    	return block;
    }

    // (132:0) {#if ingredient}
    function create_if_block_1$8(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let h20;
    	let t3;
    	let t4_value = /*ingredient*/ ctx[1].Ingredient + "";
    	let t4;
    	let t5;
    	let table;
    	let thead;
    	let t6;
    	let t7;
    	let h21;
    	let t8;
    	let t9_value = /*ingredient*/ ctx[1].Ingredient + "";
    	let t9;
    	let mounted;
    	let dispose;
    	let if_block = /*recipes*/ ctx[0] && create_if_block_2$5(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t0 = text("  Add to Grocery List");
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			h20 = element("h2");
    			t3 = text("Recipes with ");
    			t4 = text(t4_value);
    			t5 = space();
    			table = element("table");
    			thead = element("thead");
    			t6 = space();
    			if (if_block) if_block.c();
    			t7 = space();
    			h21 = element("h2");
    			t8 = text("Recent Meals with ");
    			t9 = text(t9_value);
    			attr_dev(img, "class", "svg");
    			if (!src_url_equal(img.src, img_src_value = "/open-iconic-master/svg/cart.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "cart");
    			add_location(img, file$d, 132, 113, 3730);
    			attr_dev(button, "class", "btn btn-md btn-success addToGroceryList");
    			add_location(button, file$d, 132, 0, 3617);
    			add_location(br, file$d, 133, 0, 3833);
    			add_location(h20, file$d, 134, 0, 3840);
    			add_location(thead, file$d, 136, 4, 3913);
    			attr_dev(table, "class", "table");
    			add_location(table, file$d, 135, 0, 3887);
    			add_location(h21, file$d, 152, 0, 4266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h20, anchor);
    			append_dev(h20, t3);
    			append_dev(h20, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(table, t6);
    			if (if_block) if_block.m(table, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, h21, anchor);
    			append_dev(h21, t8);
    			append_dev(h21, t9);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ingredient*/ 2 && t4_value !== (t4_value = /*ingredient*/ ctx[1].Ingredient + "")) set_data_dev(t4, t4_value);

    			if (/*recipes*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$5(ctx);
    					if_block.c();
    					if_block.m(table, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*ingredient*/ 2 && t9_value !== (t9_value = /*ingredient*/ ctx[1].Ingredient + "")) set_data_dev(t9, t9_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(table);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(h21);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(132:0) {#if ingredient}",
    		ctx
    	});

    	return block;
    }

    // (140:4) {#if recipes}
    function create_if_block_2$5(ctx) {
    	let tbody;
    	let each_value_1 = /*recipes*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$5(get_each_context_1$5(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tbody, file$d, 140, 4, 3989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*recipes*/ 1) {
    				each_value_1 = /*recipes*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$5(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(140:4) {#if recipes}",
    		ctx
    	});

    	return block;
    }

    // (142:8) {#each recipes as rec }
    function create_each_block_1$5(ctx) {
    	let tr;
    	let td;
    	let a;
    	let t0_value = /*rec*/ ctx[9].ingredients_recipe_2.Recipe + "";
    	let t0;
    	let a_href_value;
    	let link_action;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = "/recipes/" + /*rec*/ ctx[9].ingredients_recipe_2.id);
    			add_location(a, file$d, 143, 36, 4100);
    			attr_dev(td, "class", "text-center");
    			add_location(td, file$d, 143, 12, 4076);
    			attr_dev(tr, "class", "table-primary");
    			add_location(tr, file$d, 142, 8, 4037);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*recipes*/ 1 && t0_value !== (t0_value = /*rec*/ ctx[9].ingredients_recipe_2.Recipe + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*recipes*/ 1 && a_href_value !== (a_href_value = "/recipes/" + /*rec*/ ctx[9].ingredients_recipe_2.id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$5.name,
    		type: "each",
    		source: "(142:8) {#each recipes as rec }",
    		ctx
    	});

    	return block;
    }

    // (155:0) {#if meals}
    function create_if_block$a(ctx) {
    	let table;
    	let thead;
    	let t;
    	let tbody;
    	let each_value = /*meals*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			t = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(thead, file$d, 156, 1, 4387);
    			add_location(tbody, file$d, 160, 1, 4447);
    			attr_dev(table, "class", "table table-responsive table-light");
    			add_location(table, file$d, 155, 0, 4335);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(table, t);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*meals*/ 4) {
    				each_value = /*meals*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(155:0) {#if meals}",
    		ctx
    	});

    	return block;
    }

    // (162:8) {#each meals as mea }
    function create_each_block$c(ctx) {
    	let tr;
    	let td;
    	let a;
    	let t0_value = /*mea*/ ctx[6].ingredients_meals_2.meals_recipes.Recipe + "";
    	let t0;
    	let t1;
    	let t2_value = /*mea*/ ctx[6].ingredients_meals_2.Date + "";
    	let t2;
    	let t3;
    	let a_href_value;
    	let link_action;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = text(" (");
    			t2 = text(t2_value);
    			t3 = text(")");
    			t4 = space();
    			attr_dev(a, "href", a_href_value = "/meals/" + /*mea*/ ctx[6].MealID);
    			add_location(a, file$d, 163, 40, 4561);
    			attr_dev(td, "class", "text-center");
    			add_location(td, file$d, 163, 16, 4537);
    			attr_dev(tr, "class", "table-info");
    			add_location(tr, file$d, 162, 12, 4497);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, a);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, t2);
    			append_dev(a, t3);
    			append_dev(tr, t4);

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*meals*/ 4 && t0_value !== (t0_value = /*mea*/ ctx[6].ingredients_meals_2.meals_recipes.Recipe + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*meals*/ 4 && t2_value !== (t2_value = /*mea*/ ctx[6].ingredients_meals_2.Date + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*meals*/ 4 && a_href_value !== (a_href_value = "/meals/" + /*mea*/ ctx[6].MealID)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(162:8) {#each meals as mea }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let t3;
    	let if_block3_anchor;
    	let if_block0 = /*ingredient*/ ctx[1] && create_if_block_4$3(ctx);
    	let if_block1 = /*inventory*/ ctx[3] && create_if_block_3$3(ctx);
    	let if_block2 = /*ingredient*/ ctx[1] && create_if_block_1$8(ctx);
    	let if_block3 = /*meals*/ ctx[2] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			add_location(br, file$d, 130, 0, 3593);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*ingredient*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4$3(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*inventory*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$3(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*ingredient*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$8(ctx);
    					if_block2.c();
    					if_block2.m(t3.parentNode, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*meals*/ ctx[2]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$a(ctx);
    					if_block3.c();
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t2);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IngredientsComponent', slots, []);
    	let { params } = $$props;
    	let { recipes } = $$props;
    	let { ingredient } = $$props;
    	let { meals } = $$props;
    	let { inventory } = $$props;

    	onMount(async () => {
    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `{
            ingredients_by_pk(id: ` + params.id + `) {
                Brand
                Ingredient
                Location
                Notes
                Price
                Quantity
                Quantity_Measurement
                In_Stock
                Calories
                Calories_Serving
                Calories_Serving_Measurement
                id
            }
            }
        `
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(1, ingredient = res.data.ingredients_by_pk);
    			console.log(res.data);
    		});

    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `{
            ingredients_recipes(where: {IngredientID: {_eq: ` + params.id + `}}) {
                ingredients_recipe_2 {
                id
                Recipe
                }
            }
        }
        `
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(0, recipes = res.data.ingredients_recipes);
    			console.log(res.data);
    		});

    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `{
                ingredients_meals(where: {ingredients_meals: {id: {_eq: ` + params.id + `}}}) {
                    ingredients_meals_2 {
                    Date
                    meals_recipes {
                        Recipe
                    }
                }
                    Quantity
                    Quantity_Measurement
                    MealID
                }
            }`
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(2, meals = res.data.ingredients_meals);
    			console.log(res.data);
    		});

    		fetch('https://graphql-jeffrecipes.herokuapp.com/v1/graphql', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				query: `{
                inventory(where: {ingredient_inventory_2: {id: {_eq: ` + params.id + `}}}) {
                    Location
                    Quantity
                    Quantity_Measurement
                    Brand
                }
            }`
    			})
    		}).then(res => res.json()).then(res => {
    			$$invalidate(3, inventory = res.data.inventory);
    			console.log(res.data);
    		});
    	});

    	const writable_props = ['params', 'recipes', 'ingredient', 'meals', 'inventory'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$b.warn(`<IngredientsComponent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => addToGroceryList(ingredient.Ingredient);

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(4, params = $$props.params);
    		if ('recipes' in $$props) $$invalidate(0, recipes = $$props.recipes);
    		if ('ingredient' in $$props) $$invalidate(1, ingredient = $$props.ingredient);
    		if ('meals' in $$props) $$invalidate(2, meals = $$props.meals);
    		if ('inventory' in $$props) $$invalidate(3, inventory = $$props.inventory);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		link,
    		addToGroceryList,
    		params,
    		recipes,
    		ingredient,
    		meals,
    		inventory
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(4, params = $$props.params);
    		if ('recipes' in $$props) $$invalidate(0, recipes = $$props.recipes);
    		if ('ingredient' in $$props) $$invalidate(1, ingredient = $$props.ingredient);
    		if ('meals' in $$props) $$invalidate(2, meals = $$props.meals);
    		if ('inventory' in $$props) $$invalidate(3, inventory = $$props.inventory);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [recipes, ingredient, meals, inventory, params, click_handler];
    }

    class IngredientsComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			params: 4,
    			recipes: 0,
    			ingredient: 1,
    			meals: 2,
    			inventory: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IngredientsComponent",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[4] === undefined && !('params' in props)) {
    			console_1$b.warn("<IngredientsComponent> was created without expected prop 'params'");
    		}

    		if (/*recipes*/ ctx[0] === undefined && !('recipes' in props)) {
    			console_1$b.warn("<IngredientsComponent> was created without expected prop 'recipes'");
    		}

    		if (/*ingredient*/ ctx[1] === undefined && !('ingredient' in props)) {
    			console_1$b.warn("<IngredientsComponent> was created without expected prop 'ingredient'");
    		}

    		if (/*meals*/ ctx[2] === undefined && !('meals' in props)) {
    			console_1$b.warn("<IngredientsComponent> was created without expected prop 'meals'");
    		}

    		if (/*inventory*/ ctx[3] === undefined && !('inventory' in props)) {
    			console_1$b.warn("<IngredientsComponent> was created without expected prop 'inventory'");
    		}
    	}

    	get params() {
    		throw new Error("<IngredientsComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<IngredientsComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get recipes() {
    		throw new Error("<IngredientsComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipes(value) {
    		throw new Error("<IngredientsComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ingredient() {
    		throw new Error("<IngredientsComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ingredient(value) {
    		throw new Error("<IngredientsComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meals() {
    		throw new Error("<IngredientsComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meals(value) {
    		throw new Error("<IngredientsComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inventory() {
    		throw new Error("<IngredientsComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inventory(value) {
    		throw new Error("<IngredientsComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/authentication/LoginSuccessfulComponent.svelte generated by Svelte v3.46.4 */

    const { console: console_1$c } = globals;

    const file$e = "src/components/authentication/LoginSuccessfulComponent.svelte";

    function create_fragment$g(ctx) {
    	let h1;
    	let t1;
    	let small;
    	let em;
    	let t2;
    	let t3_value = /*params*/ ctx[0].code + "";
    	let t3;
    	let t4;
    	let t5_value = /*params*/ ctx[0].state + "";
    	let t5;
    	let t6;
    	let table;
    	let legend;
    	let t8;
    	let tbody;
    	let tr0;
    	let td0;
    	let button0;
    	let t9;
    	let span0;
    	let t11;
    	let td1;
    	let button1;
    	let t12;
    	let span1;
    	let t14;
    	let td2;
    	let button2;
    	let t15;
    	let span2;
    	let t17;
    	let tr1;
    	let td3;
    	let button3;
    	let t18;
    	let span3;
    	let t20;
    	let td4;
    	let button4;
    	let t21;
    	let span4;
    	let t23;
    	let td5;
    	let button5;
    	let t24;
    	let span5;
    	let t26;
    	let td6;
    	let button6;
    	let t27;
    	let span6;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Welcome back!";
    			t1 = space();
    			small = element("small");
    			em = element("em");
    			t2 = text("Your encoded JWT token is: ");
    			t3 = text(t3_value);
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = space();
    			table = element("table");
    			legend = element("legend");
    			legend.textContent = "Record Your Recent Meals";
    			t8 = space();
    			tbody = element("tbody");
    			tr0 = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			t9 = text("Breakfast ");
    			span0 = element("span");
    			span0.textContent = "1";
    			t11 = space();
    			td1 = element("td");
    			button1 = element("button");
    			t12 = text("Lunch ");
    			span1 = element("span");
    			span1.textContent = "1";
    			t14 = space();
    			td2 = element("td");
    			button2 = element("button");
    			t15 = text("Dinner ");
    			span2 = element("span");
    			span2.textContent = "1";
    			t17 = space();
    			tr1 = element("tr");
    			td3 = element("td");
    			button3 = element("button");
    			t18 = text("Salad ");
    			span3 = element("span");
    			span3.textContent = "0";
    			t20 = space();
    			td4 = element("td");
    			button4 = element("button");
    			t21 = text("Snack ");
    			span4 = element("span");
    			span4.textContent = "0";
    			t23 = space();
    			td5 = element("td");
    			button5 = element("button");
    			t24 = text("Smoothie ");
    			span5 = element("span");
    			span5.textContent = "0";
    			t26 = space();
    			td6 = element("td");
    			button6 = element("button");
    			t27 = text("Dessert ");
    			span6 = element("span");
    			span6.textContent = "0";
    			add_location(h1, file$e, 13, 0, 283);
    			add_location(em, file$e, 14, 7, 313);
    			add_location(small, file$e, 14, 0, 306);
    			add_location(legend, file$e, 16, 4, 436);
    			attr_dev(span0, "class", "badge badge-light");
    			add_location(span0, file$e, 21, 26, 609);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-primary");
    			add_location(button0, file$e, 20, 16, 536);
    			add_location(td0, file$e, 19, 12, 515);
    			attr_dev(span1, "class", "badge badge-light");
    			add_location(span1, file$e, 26, 22, 796);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-primary");
    			add_location(button1, file$e, 25, 16, 727);
    			add_location(td1, file$e, 24, 12, 706);
    			attr_dev(span2, "class", "badge badge-light");
    			add_location(span2, file$e, 31, 23, 984);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-primary");
    			add_location(button2, file$e, 30, 16, 914);
    			add_location(td2, file$e, 29, 12, 893);
    			add_location(tr0, file$e, 18, 8, 498);
    			attr_dev(span3, "class", "badge badge-secondary");
    			add_location(span3, file$e, 39, 22, 1199);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn btn-primary");
    			add_location(button3, file$e, 38, 16, 1130);
    			add_location(td3, file$e, 37, 12, 1109);
    			attr_dev(span4, "class", "badge badge-secondary");
    			add_location(span4, file$e, 44, 22, 1390);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-primary");
    			add_location(button4, file$e, 43, 16, 1321);
    			add_location(td4, file$e, 42, 12, 1300);
    			attr_dev(span5, "class", "badge badge-secondary");
    			add_location(span5, file$e, 49, 25, 1584);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn btn-primary");
    			add_location(button5, file$e, 48, 16, 1512);
    			add_location(td5, file$e, 47, 12, 1491);
    			attr_dev(span6, "class", "badge badge-secondary");
    			add_location(span6, file$e, 54, 24, 1777);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "btn btn-primary");
    			add_location(button6, file$e, 53, 16, 1706);
    			add_location(td6, file$e, 52, 12, 1685);
    			add_location(tr1, file$e, 36, 8, 1092);
    			add_location(tbody, file$e, 17, 4, 482);
    			attr_dev(table, "class", "table-responsive table-light");
    			add_location(table, file$e, 15, 0, 387);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, small, anchor);
    			append_dev(small, em);
    			append_dev(em, t2);
    			append_dev(em, t3);
    			append_dev(em, t4);
    			append_dev(em, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, legend);
    			append_dev(table, t8);
    			append_dev(table, tbody);
    			append_dev(tbody, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, button0);
    			append_dev(button0, t9);
    			append_dev(button0, span0);
    			append_dev(tr0, t11);
    			append_dev(tr0, td1);
    			append_dev(td1, button1);
    			append_dev(button1, t12);
    			append_dev(button1, span1);
    			append_dev(tr0, t14);
    			append_dev(tr0, td2);
    			append_dev(td2, button2);
    			append_dev(button2, t15);
    			append_dev(button2, span2);
    			append_dev(tbody, t17);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td3);
    			append_dev(td3, button3);
    			append_dev(button3, t18);
    			append_dev(button3, span3);
    			append_dev(tr1, t20);
    			append_dev(tr1, td4);
    			append_dev(td4, button4);
    			append_dev(button4, t21);
    			append_dev(button4, span4);
    			append_dev(tr1, t23);
    			append_dev(tr1, td5);
    			append_dev(td5, button5);
    			append_dev(button5, t24);
    			append_dev(button5, span5);
    			append_dev(tr1, t26);
    			append_dev(tr1, td6);
    			append_dev(td6, button6);
    			append_dev(button6, t27);
    			append_dev(button6, span6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*params*/ 1 && t3_value !== (t3_value = /*params*/ ctx[0].code + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*params*/ 1 && t5_value !== (t5_value = /*params*/ ctx[0].state + "")) set_data_dev(t5, t5_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(small);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(table);
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
    	validate_slots('LoginSuccessfulComponent', slots, []);
    	let { params } = $$props;
    	console.log(querystring);

    	//   console.log(params.state);
    	console.log("HI from AUTH");

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$c.warn(`<LoginSuccessfulComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		location: location$1,
    		querystring,
    		link,
    		params
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [params];
    }

    class LoginSuccessfulComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoginSuccessfulComponent",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[0] === undefined && !('params' in props)) {
    			console_1$c.warn("<LoginSuccessfulComponent> was created without expected prop 'params'");
    		}
    	}

    	get params() {
    		throw new Error("<LoginSuccessfulComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<LoginSuccessfulComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */

    const { console: console_1$d } = globals;
    const file$f = "src/App.svelte";

    // (130:1) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let a;
    	let h1;
    	let t0;
    	let t1_value = /*$userInfo*/ ctx[2]["nickname"] + "";
    	let t1;
    	let t2;
    	let img0;
    	let img0_src_value;
    	let span;
    	let t4;
    	let img1;
    	let img1_src_value;
    	let link_action;
    	let t5;
    	let hr;
    	let t6;
    	let router;
    	let current;
    	let mounted;
    	let dispose;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			h1 = element("h1");
    			t0 = text("Welcome, ");
    			t1 = text(t1_value);
    			t2 = text("! ");
    			img0 = element("img");
    			span = element("span");
    			span.textContent = "0";
    			t4 = space();
    			img1 = element("img");
    			t5 = space();
    			hr = element("hr");
    			t6 = space();
    			create_component(router.$$.fragment);
    			attr_dev(img0, "class", "menuIcon");
    			if (!src_url_equal(img0.src, img0_src_value = "/open-iconic-master/svg/bell.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "notifications");
    			add_location(img0, file$f, 131, 90, 5330);
    			attr_dev(span, "class", "menuIconNotificiation badge badge-light");
    			add_location(span, file$f, 131, 171, 5411);
    			attr_dev(img1, "class", "menuIcon");
    			if (!src_url_equal(img1.src, img1_src_value = "/open-iconic-master/svg/cog.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "settings");
    			add_location(img1, file$f, 131, 234, 5474);
    			attr_dev(h1, "class", "text-center welcome");
    			add_location(h1, file$f, 131, 24, 5264);
    			attr_dev(a, "href", "/");
    			add_location(a, file$f, 131, 3, 5243);
    			add_location(hr, file$f, 132, 2, 5561);
    			attr_dev(div, "class", "container-fluid");
    			add_location(div, file$f, 130, 2, 5210);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, img0);
    			append_dev(h1, span);
    			append_dev(h1, t4);
    			append_dev(h1, img1);
    			append_dev(div, t5);
    			append_dev(div, hr);
    			append_dev(div, t6);
    			mount_component(router, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$userInfo*/ 4) && t1_value !== (t1_value = /*$userInfo*/ ctx[2]["nickname"] + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(router);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(130:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (111:1) {#if !$authToken }
    function create_if_block$b(ctx) {
    	let div3;
    	let h2;
    	let t1;
    	let div0;
    	let auth0context;
    	let t2;
    	let div1;
    	let t4;
    	let div2;
    	let a;
    	let button;
    	let link_action;
    	let current;
    	let mounted;
    	let dispose;

    	auth0context = new Auth0Context({
    			props: {
    				domain: "jeffca.auth0.com",
    				client_id: "URjctPE9nuCr4V9rFYWXbfEx04gZ9Faa",
    				callback_url: /*env*/ ctx[0],
    				logout_url: "http://localhost:5000",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Groceries, Recipes And Meal Prep";
    			t1 = space();
    			div0 = element("div");
    			create_component(auth0context.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			div1.textContent = " ";
    			t4 = space();
    			div2 = element("div");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Continue as Guest";
    			attr_dev(h2, "class", "text-center");
    			attr_dev(h2, "id", "title");
    			add_location(h2, file$f, 112, 3, 4124);
    			attr_dev(div0, "class", "text-center");
    			add_location(div0, file$f, 119, 4, 4732);
    			add_location(div1, file$f, 124, 3, 5007);
    			attr_dev(button, "class", "btn btn-lg btn-primary");
    			add_location(button, file$f, 126, 26, 5081);
    			attr_dev(a, "href", "/");
    			add_location(a, file$f, 126, 5, 5060);
    			attr_dev(div2, "class", "text-center");
    			add_location(div2, file$f, 125, 4, 5029);
    			attr_dev(div3, "class", "text-left container-fluid");
    			add_location(div3, file$f, 111, 2, 4081);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h2);
    			append_dev(div3, t1);
    			append_dev(div3, div0);
    			mount_component(auth0context, div0, null);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, a);
    			append_dev(a, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*loginAsGuest*/ ctx[4], { once: true }, false, false),
    					action_destroyer(link_action = link.call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const auth0context_changes = {};
    			if (dirty & /*env*/ 1) auth0context_changes.callback_url = /*env*/ ctx[0];

    			if (dirty & /*$$scope*/ 128) {
    				auth0context_changes.$$scope = { dirty, ctx };
    			}

    			auth0context.$set(auth0context_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(auth0context.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(auth0context.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(auth0context);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(111:1) {#if !$authToken }",
    		ctx
    	});

    	return block;
    }

    // (122:5) <Auth0LoginButton class="btn btn-lg">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Login");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(122:5) <Auth0LoginButton class=\\\"btn btn-lg\\\">",
    		ctx
    	});

    	return block;
    }

    // (121:4) <Auth0Context domain="jeffca.auth0.com" client_id="URjctPE9nuCr4V9rFYWXbfEx04gZ9Faa" callback_url="{env }" logout_url="http://localhost:5000">
    function create_default_slot(ctx) {
    	let auth0loginbutton;
    	let current;

    	auth0loginbutton = new Auth0LoginButton({
    			props: {
    				class: "btn btn-lg",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(auth0loginbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(auth0loginbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const auth0loginbutton_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				auth0loginbutton_changes.$$scope = { dirty, ctx };
    			}

    			auth0loginbutton.$set(auth0loginbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(auth0loginbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(auth0loginbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(auth0loginbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(121:4) <Auth0Context domain=\\\"jeffca.auth0.com\\\" client_id=\\\"URjctPE9nuCr4V9rFYWXbfEx04gZ9Faa\\\" callback_url=\\\"{env }\\\" logout_url=\\\"http://localhost:5000\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*$authToken*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
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
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let $idToken;
    	let $claims;
    	let $authToken;
    	let $userInfo;
    	validate_store(idToken, 'idToken');
    	component_subscribe($$self, idToken, $$value => $$invalidate(5, $idToken = $$value));
    	validate_store(claims, 'claims');
    	component_subscribe($$self, claims, $$value => $$invalidate(6, $claims = $$value));
    	validate_store(authToken, 'authToken');
    	component_subscribe($$self, authToken, $$value => $$invalidate(1, $authToken = $$value));
    	validate_store(userInfo, 'userInfo');
    	component_subscribe($$self, userInfo, $$value => $$invalidate(2, $userInfo = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	authToken.subscribe(async token => {
    		if (token) {
    			console.log('user is logged in!');
    			set_store_value(claims, $claims = $idToken, $claims);
    			console.log("claims store is set to @dopry/svelte-auth0's idToken (JWT token from Auth0)!");
    		}
    	});

    	var env;

    	// console.log(window.location.href);
    	if (window.location.href == 'http://localhost:5000/') {
    		env = 'http://localhost:5000/';
    	} else {
    		env = 'https://vigilant-sinoussi-95d5cb.netlify.app/';
    	}

    	console.log(env);

    	const routes = {
    		// Exact path
    		'/': HomeComponent,
    		'/food': Food,
    		'/food/recipes/new': RecipeNew,
    		'/food/recipes/:id': RecipeDetailComponent,
    		'/inventory': Inventory,
    		'/recipes': RecipeComponent,
    		'/recipes/:id': RecipeDetailComponent,
    		'/recipes/:id/cooking': MealsCookingComponent,
    		'/ingredients/:id': IngredientsComponent,
    		'/grocerylist': GroceryListComponent,
    		'/meals': MealsComponent,
    		'/meals/history': MealsHistoryComponent,
    		'/meals/:id': MealsDetailComponent,
    		//API 
    		'/callback': LoginSuccessfulComponent
    	};

    	function loginAsGuest() {
    		console.log("guest trying to login");
    		set_store_value(authToken, $authToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUVXpRMEZFTWpOQ016VkdSVEE1TVRSR05EVkVRVUZDUlVWQk1qSTVNekl5UlVaQlJFSXlOUSJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6Imdvb2dsZS1vYXV0aDJ8MTAzNjE0MzY4Nzg1MDc0MzUwNzU5In0sImdpdmVuX25hbWUiOiJHZW9mZnJleSIsImZhbWlseV9uYW1lIjoiQ2Fpcm5zIiwibmlja25hbWUiOiJnZW9mZnJleWNhaXJuczAiLCJuYW1lIjoiR2VvZmZyZXkgQ2Fpcm5zIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBVFhBSnlxUlNESlFMQXBvd2YwdnNTc21ISWtEdTI0TmJoTGI4Q1owZTRkPXM5Ni1jIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAyMi0wMi0wNlQwMDo1MDoxOS40MjFaIiwiZW1haWwiOiJnZW9mZnJleWNhaXJuczBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vamVmZmNhLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMzYxNDM2ODc4NTA3NDM1MDc1OSIsImF1ZCI6IlVSamN0UEU5bnVDcjRWOXJGWVdYYmZFeDA0Z1o5RmFhIiwiaWF0IjoxNjQ0MTA4NjIxLCJleHAiOjE2NDQxNDQ2MjEsIm5vbmNlIjoiUVVqaWRUV1VZeU5faHlGLmZGeTBZMFppQUx1ZGlibloxWnNEX01hV1BiOSJ9.gQscuRUduj6XnFIetaA-E6ViVzlrGHQWxwfpFFKIlw9fCboutytngxbwuaxJW5-AX1znR2_iwuw1zbBpB9ZsDwVyY19CmEgn4zzpfPTUK6yR2MdbPsTOlm7w2Pjl4yYKNjBvAE1VvQtU3i9aI-WeBZnT8xaSYRg0OYMveSCaTOG0GNYprJAZ6n1k42KZWQO9O0uDEjFt4s5H6sISqWqC_vYyK2Vx6CAHUEgo2c6IDv04qY5Ay7c_1EfYNrxBI460GUxMiY_pk41PcbU_dnFD3T_bDbbADXzO2EB4tlhn-b0yUBIFIUSRPii3vUNWxGW4a6pcu2eurP7PGvG3PjUzSg', $authToken);
    		set_store_value(userInfo, $userInfo['nickname'] = 'Guest', $userInfo);
    		set_store_value(idToken, $idToken = $authToken, $idToken);
    		set_store_value(claims, $claims = $idToken, $claims);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$d.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		claims,
    		Auth0Context,
    		Auth0LoginButton,
    		authError,
    		authToken,
    		isAuthenticated,
    		isLoading,
    		login,
    		logout,
    		userInfo,
    		idToken,
    		env,
    		Home: HomeComponent,
    		Food,
    		Recipe_New: RecipeNew,
    		loading: HomeComponent,
    		Inventory,
    		RecipeDetailComponent,
    		RecipeComponent,
    		GroceryListComponent,
    		MealsComponent,
    		MealsCookingComponent,
    		MealsHistoryComponent,
    		MealsDetailComponent,
    		IngredientsComponent,
    		LoginSuccessfulComponent,
    		Router,
    		link,
    		routes,
    		loginAsGuest,
    		$idToken,
    		$claims,
    		$authToken,
    		$userInfo
    	});

    	$$self.$inject_state = $$props => {
    		if ('env' in $$props) $$invalidate(0, env = $$props.env);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [env, $authToken, $userInfo, routes, loginAsGuest];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {},
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
