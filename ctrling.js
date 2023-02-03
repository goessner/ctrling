/**
 * ctrling.js (c) 2022/23 Stefan Goessner
 * ver. 0.8.25
 * @license MIT License
 */
"use strict";

// Custom element (Web Component)
class Ctrling extends HTMLElement {
    static get observedAttributes() {
        return ['ref','width','top','right','darkmode','autoupdate','autogenerate','tickspersecond','callback'];
    }

    // private properties ...
    #main;
    #initialized = false;
    #oninit;
    #refObj;
    #sections = [];
    #timer = false;
    #ticksPerSecond = 4;
    #usrValueCallback;

    constructor() {
        super().attachShadow({ mode:'open' });
        this.shadowRoot.innerHTML = Ctrling.template({ width: this.getAttribute('width') || '200px', 
                                                       top: this.getAttribute('top') || '0px', 
                                                       right: this.getAttribute('right') || '0px' });
        this.#main = this.shadowRoot.querySelector('main');
    }

    // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
    connectedCallback() {
        // fires with opening tag complete only. No children available yet ... see ...
        // https://stackoverflow.com/questions/70949141/web-components-accessing-innerhtml-in-connectedcallback
        // https://github.com/WICG/webcomponents/issues/551
        window.setTimeout(()=>this.#init());
    }
    disconnectedCallback() {
        for (const sec of this.#sections)
            this.#removeListeners(sec);
        if (this.#timer)
            window.clearInterval(this.#timer);
    }
    attributeChangedCallback(name, oldval, val) {
        if (name === 'ref' && this.#initialized) {
            const ref = /[A-Za-z_][A-Za-z_0-9]*/.test(val) ? val : "";  // must conform to variable syntax rules (ASCII).
            // `globalThis` does not work with let and const, only with var ...
            // see https://stackoverflow.com/questions/28776079/do-let-statements-create-properties-on-the-global-object
            try {
                this.#refObj = ref && (globalThis[ref] || eval(ref));
            }
            catch (e) { this.addSection({sec:'hdr',text:"Ctrling: 'ref' object " + e.message}); }
        }
        else if (name === 'width') {
            this.style.setProperty('width', val);  // set width of :host ...
        }
        else if (name === 'right') {
            this.#main.style.setProperty('right', val);
        }
        else if (name === 'top') {
            this.#main.style.setProperty('top', val);
        }
        else if (name === 'darkmode') {
            if (this.hasAttribute('darkmode')) {
                this.style.setProperty("--bkg-1", "var(--dark-bkg-1)");
                this.style.setProperty("--bkg-2", "var(--dark-bkg-2)");
                this.style.setProperty("--bkg-3", "var(--dark-bkg-3)");
                this.style.setProperty("--col-1", "var(--dark-col-1)");
                this.style.setProperty("--col-2", "var(--dark-col-2)");
                this.style.setProperty("--col-3", "var(--dark-col-3)");
            }
            else {   // removed via API ... 
                this.style.setProperty("--bkg-1", "var(--lite-bkg-1)");
                this.style.setProperty("--bkg-2", "var(--lite-bkg-2)");
                this.style.setProperty("--bkg-3", "var(--lite-bkg-3)");
                this.style.setProperty("--col-1", "var(--lite-col-1)");
                this.style.setProperty("--col-2", "var(--lite-col-2)");
                this.style.setProperty("--col-3", "var(--lite-col-3)");
            }
        }
        else if (name === 'autoupdate' && this.#initialized) {
            this.#timer = window.setInterval(() => this.updateControlValues(), 1000/this.#ticksPerSecond)
        }
        else if (name === 'autogenerate' && this.#initialized) {
            this.#autogenerateSections(val === 'src' || val === 'source');
        }
        else if (name === 'callback' && this.#initialized) {
            const [obj, member] = this.#getRef(val);
            const prop = obj && member && Object.getOwnPropertyDescriptor(obj, member);
            if (prop !== undefined  && "value" in prop && typeof obj[member] === 'function')
                this.#usrValueCallback = obj === globalThis 
                                       ? obj[member]
                                       : obj[member].bind(obj);
        }
        else if (name === 'tickspersecond') {
            const tps = +val;
            if (!Number.isNaN(tps)) {
                this.#ticksPerSecond = Math.min(tps, 60);
                if (!!this.#timer) {
                    window.clearInterval(this.timer);
                    this.#timer = window.setInterval(() => this.updateControlValues(), 1000/this.#ticksPerSecond)
                }
            }
        }
    }

    #init() {
        this.#initialized = true;

        // lazy attribute initialization ...
        if (this.hasAttribute('ref')) {
            this.setAttribute('ref', this.getAttribute('ref'));
        }
        if (this.hasAttribute('callback')) {
            this.setAttribute('callback', this.getAttribute('callback'));
        }
        if (this.hasAttribute('autogenerate')) {
            this.setAttribute('autogenerate', this.getAttribute('autogenerate'));
        }
        if (this.hasAttribute('autoupdate')) {
            this.setAttribute('autoupdate', this.getAttribute('autoupdate'));
        }

        const content = this.innerHTML.trim();
        if (!!content)        // empty or not ?
            this.#sectionsFromJSON(content);

        this.style.display = 'block';
        this.style.height = this.#main.offsetHeight + 'px';  // adjust height of :host with height of shadow content ... !
        this.#main.style.width = this.offsetWidth + 'px';    // fill up to width of :host ... !
        if (this.#oninit && typeof this.#oninit === 'function')
            this.#oninit(this);

        if (this.#usrValueCallback)
            this.#usrValueCallback({ctrl:this});  // call initially once with empty arguments object ...
    }

    #sectionsFromJSON(content) {
        try {
            this.#sections.push(...JSON.parse(content));
            for (let i=0; i<this.#sections.length;i++)
                this.#main.append(this.#newHtmlSection(this.#sections[i]));
            return this.#sections;
        }
        catch (e) { this.#sections = []; this.addSection({sec:'hdr',text:"Ctrling: " + e.message}); }
        return this.#sections;
    }
    #autogenerateSections(src) {
        if (typeof this.#refObj === 'object') {
            const obj = this.#refObj;
            const members = Object.keys(obj); //Object.getOwnPropertyNames(obj);
            const sectype = {"boolean":"chk","number":"num","string":"txt"};

            this.addSection({"sec":"hdr","text":`Generated for: ${this.getAttribute('ref')}`});
            for (const m of members) {
                if (!m.startsWith('_')) {
                    if (typeof obj[m] === 'string' && obj[m].startsWith('#'))   // rgb color ...
                        this.addSection({"sec":`col`,"label":m,"path":`$['${m}']`});
                    else if (['boolean','number','string'].includes(typeof obj[m]))
                        this.addSection({"sec":`${sectype[typeof obj[m]]}`,"label":m,"path":`$['${m}']`});
                }
            }
            if (src) {
                const str = JSON.stringify(this.#sections).replaceAll('},','},\n ')
                                                          .replaceAll(/(,"_hdls":\[[^\]]*\])/gm,''); // skip private event handler array ...

                this.addSection({"sec":"out","label":"src=","value":str});
            }
        }
    }

    #getRef(path) {
        const root = path === undefined ? undefined
                   : path.startsWith('$') ? this.#refObj 
                   : path.match(/^(window|globalThis)/) ? globalThis
                   : undefined;
        if (root) {
            const indexes = path.match(/^(\$|window|globalThis)/) && path.endsWith(']') 
                   ? path.substring(path.search(/\[/)+1, path.length-1).replaceAll("'","").split("][")
                   : undefined;
            let refval = root;

            if (indexes && indexes.length > 0) {
                for (let i=0; i<indexes.length-1; i++)
                    refval = refval[indexes[i]];
                return [refval, indexes[indexes.length-1]];
            }
            else
                return [refval];
        }
        return [];
    }

    #getRefValue(obj, member, deflt) {
        return obj ? (member ? obj[member] : obj) : deflt;
    }
    #setRefValue(ctrl, obj, member, value, section, elem) {
        value = (value === true || 
                 value === false ||
                 value === null) ? value
              : !Number.isNaN(+value) ? +value
              : value;
        obj[member] = value;
        if (this.#usrValueCallback !== undefined) {
            this.#usrValueCallback({ctrl, obj, member, value, section, elem});
        }
        return value;
    }

    #addListeners(args, handlers) {
        for (const h of handlers)
            h.elem.addEventListener(h.type, h.hdl, true);
        args._hdls = handlers; 
    }
    #removeListeners(args) {
        if (args._hdls)
            for (const h of args._hdls)
                h.elem.removeEventListener(h.type, h.hdl, true);
        delete args._hdls;
    }

    #newHtmlSection(args) {
        if (args && args.sec && Object.hasOwn(Ctrling.prototype, args.sec)) {
            const secElem = document.createElement('section');
            secElem.setAttribute('class',args.sec);
            this[args.sec](secElem,args);
            return secElem;
        }
        return undefined;
    }

    // API
    oninit(fn) {
        this.#oninit = fn;
    }
    setAttr(attr, value) {
        this.setAttribute(attr, value);
        return this;
    }
    removeAttr(attr) {
        this.removeAttribute(attr);
        return this;
    }

    section(idx) { return this.#sections[idx]; }

    findSectionIndex(fn) {
        return this.#sections.findIndex(fn);
    }

    addSection(sec) {
        const secElem = this.#newHtmlSection(sec);
        if (secElem) {
            this.#main.append(secElem);
            this.#sections.push(sec);
        }
        return this;
    }
    insertSection(idx, sec) {
        if (idx >= 0) {
            const secElem = this.#newHtmlSection(sec);
            if (secElem) {
                this.#main.getElementsByTagName('section')[idx]?.insertAdjacentElement('beforebegin', secElem);
                this.#sections.splice(idx, 0, sec);
            }
        }
        return this;
    }
    removeSection(idx) {
        if (idx >= 0) {
            this.#removeListeners(this.#sections[idx]);
            this.#main.getElementsByTagName('section')[idx]?.remove();
            this.#sections.splice(idx, 1);
        }
        return this;
    }
    updateSection(idx, sec) {
        if (idx >= 0) {
            if (sec !== undefined) {
                this.#removeListeners(this.#sections[idx]);
                this.#sections.splice(idx, 1, sec);
            }
            else
                sec = this.#sections[idx];

            const secElem = this.#newHtmlSection(sec);
            if (secElem) {
                this.#main.getElementsByTagName('section')[idx]?.replaceWith(secElem);
            }
        }
        return this;
    }
    updateControlValues() {
        for (const sec of this.#sections)
            if (sec._upd)
                sec._upd();
        return this;
    }

    // section element generation ...
    hdr(elem, args) { // args={text}
        elem.innerHTML = `${args.text || ''}`;
        return elem;
    }
    chk(elem, args) {  // args={label,value,path,disabled}
        const [obj, member] = this.#getRef(args.path);
        elem.innerHTML = `<label>${args.label||'&nbsp;'}<input type="checkbox" ${this.#getRefValue(obj, member, args.value) ? "checked" : ""}${!!args.disabled ? " disabled" : ""}></label>`;
        const input = elem.querySelector('input');
        this.#addListeners(args, [{type:"input", elem:input, hdl:(e) => this.#setRefValue(this, obj, member, !!e.target.checked, args, elem)}]);
        args._upd = () => { input.checked = obj[member] ? 'checked' : '' };
        return elem;
    }
    col(elem, args) {  // args={label,value,path,disabled}
        const [obj, member] = this.#getRef(args.path);
        const value = this.#getRefValue(obj, member, (args.value || "#000000"));
        elem.innerHTML = `${args.label||'&nbsp;'}<span><input type="color" value="${value}"${!!args.disabled ? " disabled" : ""}><output>${value}</output></span>`;
        const input = elem.querySelector('input');
        this.#addListeners(args, [{type:"input", elem:input, hdl:(e) => { input.nextSibling.innerHTML = this.#setRefValue(this, obj, member, e.target.value, args, elem) }}]);
        args._upd = () => { input.nextSibling.innerHTML = input.value = this.#getRefValue(obj, member, "#000000"); };
        return elem;
    }
    num(elem, args) {  // args={label,value,min,max,step,fractions,unit,path,disabled}
        const [obj, member] = this.#getRef(args.path);
        const value = this.#getRefValue(obj, member, (args.value || 0));
        const round = (value, decimals) => decimals ? value.toFixed(decimals) : value;
        elem.innerHTML = `<label>${args.label||'&nbsp;'}<span><input type="number" value="${round(value, args.fractions)}"${args.min !== undefined ? ` min="${args.min}"` : ''}${args.max !== undefined ? ` max="${args.max}"` : ''}${args.step !== undefined ? ` step="${args.step}"` : ''}${!!args.disabled ? " disabled" : ""}>${args.unit ? `<span>${args.unit}</span>` : ''}</span></label>`;
        const input = elem.querySelector('input');
        this.#addListeners(args, [{type:"input", elem:input, hdl:(e) => this.#setRefValue(this, obj, member, round(+e.target.value, args.fractions), args, elem)},
                                  {type:"change",elem:input, hdl:(e) => this.#setRefValue(this, obj, member, e.target.value=round(+e.target.value, args.fractions), args, elem)} ]);
        args._upd = () => { input.value = this.#getRefValue(obj, member, 0); };
        return elem;
    }
    txt(elem, args) {  // args={label,value,path,disabled}
        const [obj, member] = this.#getRef(args.path);
        elem.innerHTML = `<label>${args.label||'&nbsp;'}<input type="text" value="${this.#getRefValue(obj, member, args.value || "")}"${!!args.disabled ? " disabled" : ""}></label>`;
        const input = elem.querySelector('input');
        this.#addListeners(args, [{type:"input", elem:input, hdl:(e) => this.#setRefValue(this, obj, member, e.target.value, args, elem)}]);
        args._upd = () => { input.value = this.#getRefValue(obj, member, "?"); };
        return elem;
    }
    rng(elem, args) {  // args={label,value,path,min,max,step,disabled}
        const [obj, member] = this.#getRef(args.path);
        const value = this.#getRefValue(obj, member, args.value);
        elem.innerHTML = `${args.label||'&nbsp;'}<span><input type="range" value="${value}"${args.min !== undefined ? ` min="${args.min}"` : ''}${args.max !== undefined ? ` max="${args.max}"` : ''}${args.step !== undefined ? ` step="${args.step}"` : ''}${!!args.disabled ? " disabled" : ""}><output>${value}</output>${args.unit ? `<span>${args.unit}</span>` : ''}`;
        const input = elem.querySelector('input');
        this.#addListeners(args, [{type:"input", elem:input, hdl:(e) => { input.nextSibling.innerHTML = this.#setRefValue(this, obj, member, +e.target.value, args, elem) }}]);
        args._upd = () => { input.nextSibling.innerHTML = input.value = this.#getRefValue(obj, member, 0); };
        return elem;
    }
    sel(elem, args) {  // args={label,options,path,disabled}
        const [obj, member] = this.#getRef(args.path);
        const options = Array.isArray(args.options) ? args.options.map(e => [e,e]) : Object.entries(args.options);
        const value =  this.#getRefValue(obj, member, options[0][1]);
        elem.innerHTML = `${args.label||'&nbsp;'}<select${!!args.disabled ? " disabled" : ""}>${options.map(o => `<option value="${o[1]}"${o[1]===value ? " selected" : ""}>${o[0]}</option>`).join('')}</select>`;
        const select = elem.querySelector('select');
        this.#addListeners(args, [{type:"input", elem:select, hdl:(e) => this.#setRefValue(this, obj, member, isNaN(e.target.value) ? e.target.value : +e.target.value, args, elem)}]);
        args._upd = () => { select.value = this.#getRefValue(obj, member, options[0][1]); };
        return elem;
    }
    sep(elem) {  // args={}
        elem.innerHTML = '<hr>';
        return elem;
    }
    btn(elem, args) {  // args={label,text,path,disabled} ... invoke getter or parameterless function ...
        elem.innerHTML = `${args.text && args.label || '&nbsp;'}<button type="button"${!!args.disabled ? " disabled" : ""}>${args.text || args.label}</button`;
        if (args.path && !args.disabled) {
            const [obj, member] = this.#getRef(args.path);
            const prop = obj && member && Object.getOwnPropertyDescriptor(obj, member);
            if (prop !== undefined  && "value" in prop && typeof obj[member] === 'function') {
                this.#addListeners(args, [{type:"click", elem:elem.querySelector('button'), hdl:(obj === globalThis ? obj[member] : obj[member].bind(obj))}]);
            }
        }
        return elem;
    }
    out(elem, args) { // args={label,value,unit,path}
        const [obj, member] = this.#getRef(args.path);
        const val = this.#getRefValue(obj, member, (args.value || ""));
        const value =  Ctrling.stringify(args.precision && typeof val === 'number' ? val.toPrecision(args.precision) : val);

        elem.innerHTML = `${args.label||'&nbsp;'}<span><output>${value}</output>${args.unit ? `<span>${args.unit}</span>` : ''}</span>`;
        if (obj !== undefined) {
            const output = elem.querySelector('output');
            args._upd = () => {
                const val = member ? obj[member] : obj;
                const value = Ctrling.stringify(args.precision && typeof val === 'number' ? val.toPrecision(args.precision) : val);
                if (output.innerHTML !== value) 
                    output.innerHTML = value;
            };
        }
        return elem; 
    }
    mtr(elem, args) { // args={label,value,min,max,low,high,optimum,unit,path}
        const [obj, member] = this.#getRef(args.path);
        const value = this.#getRefValue(obj, member, (args.value || args.min || 0));
        elem.innerHTML = `${args.label||'&nbsp;'}<span><meter value="${value}"${args.min!==undefined ? ` min="${args.min}"` : ""}${args.max!==undefined ? ` max="${args.max}"` : ""}${args.low!==undefined ? ` low="${args.low}"` : ""}${args.high!==undefined ? ` high="${args.high}"` : ""}${args.optimum!==undefined ? ` optimum="${args.optimum}"` : ""}></meter><output>${value}</output>${args.unit ? `<span>${args.unit}</span>` : ''}</span>`;
        if (obj !== undefined) {
            const meter = elem.querySelector('meter');
            const output = elem.querySelector('output');
            args._upd = () => {
                const refval = member ? obj[member] : obj;
                if (meter.value !== refval)
                    meter.value = output.value = refval;
            };
        }
        return elem; 
    }
    vec(elem, args) {  // args={label,width,unit,path,disabled}
        if (Array.isArray(args.path) && args.path.length > 0) {
            elem.innerHTML = `${args.label||'&nbsp;'}<span>${args.path.map(path => {
                const [obj, member] = this.#getRef(path);
                return `<input type="text"${obj ? ` value='${Ctrling.stringify(obj[member],true)}'` : ""}${!!args.disabled ? " disabled" : ""}${args.width ? ` style="width:${args.width}"` : ""}>`
            }).join('')}</span>${args.unit ? `<span>${args.unit}</span>` : ''}`;
            const inputs = elem.getElementsByTagName('input');
            const listeners = [];
            for (let i=0; i<inputs.length; i++) {
                inputs[i]._ctrlpath = args.path[i];
                listeners.push({type:"input", elem:inputs[i], hdl:(e) => {
                    const [obj, member] = this.#getRef(e.target._ctrlpath);
                    this.#setRefValue(this, obj, member, isNaN(e.target.value) ? e.target.value : +e.target.value, args, elem)}});
            }
            this.#addListeners(args, listeners);
            args._upd = () => {
                for (let i=0; i<inputs.length; i++) {
                    const [obj, member] = this.#getRef(inputs[i]._ctrlpath);
                    inputs[i].value = this.#getRefValue(obj, member, 0);
                }
            }
        }
        return elem;
    }
    // static methods ...
    static stringify(value,inner=false) {
        return Array.isArray(value) ? JSON.stringify(value)
             : (typeof value === 'object' && inner) ? JSON.stringify(value)
             : typeof value === 'object' ? JSON.stringify(value).replaceAll(/\[.*?\]/gm, ($0) => $0.replaceAll(',',';')) // nested arrays not treated properly !
                                                                .replaceAll(/\:\{([^}]*?)\}/gm, ($0) => $0.replaceAll(',',';'))
                                                                .replace(/^\{/g,'{\n  ')
                                                                .replace(/\}$/g,'\n}')
                                                                .replaceAll(',',',\n  ')
                                                                .replaceAll(/  ("_[^"]*":[^,\n]*,?\n)/gm,'') // skip private members
                                                                .replaceAll(';',',')
             : typeof value === 'string' ? value
             : JSON.stringify(value);
    }
    static template({width, top, right}) {
        return `
<style>
:host {
    --dark-bkg-1: #555;
    --dark-bkg-2: #666;
    --dark-bkg-3: #777;

    --dark-col-1: #fff;
    --dark-col-2: #eee;
    --dark-col-3: #bbb;

    --lite-bkg-1: #dadada;
    --lite-bkg-2: #efefef;
    --lite-bkg-3: #c0c0c0;

    --lite-col-1: #444;
    --lite-col-2: #222;
    --lite-col-3: #777;

    --bkg-1: var(--lite-bkg-1);
    --bkg-2: var(--lite-bkg-2);
    --bkg-3: var(--lite-bkg-3);

    --col-1: var(--lite-col-1);
    --col-2: var(--lite-col-2);
    --col-3: var(--lite-col-3);

    width: ${width};
}

main {
    /* grid layout */
    display: grid;
    grid: minmax(200px,100%);
    border-radius:5px;
    padding: 0 2px 0 2px;
    width: ${width};
    min-width: 200px;
    background-color: var(--bkg-1);
    overflow: hidden;

    font-family: monospace;

    /* top right corner position */
    position: absolute;
    top: ${top};
    right: ${right};
    user-select: none;
}
main > section {
    width: 100%;
    margin: 2px 0 2px 0;
}
main > section.hdr {
    text-align: center;
    font-weight: bold;
    color: var(--col-1);
    background-color: var(--bkg-3);
    border-radius: 5px 5px 0 0;
}
main > section.btn, 
main > section.sel, 
main > section.rng, 
main > section.col, 
main > section.out, 
main > section.mtr,
main > section.vec,
main > section > label  {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.25em;

    color: var(--col-2);

    border-radius: 0px;
    border: none;
}
main > section > span {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.1em;
}
main > section input:not([disabled]):hover {
    background-color: var(--bkg-3);
}
main > section input:focus-visible {
    color: var(--col-1);
    outline: 1px solid var(--col-2);
}
main > section input {
    background-color: var(--bkg-2);
    color: var(--col-1);
    border: none;
    font-family: monospace;
}
main > section output {
    background-color: var(--bkg-1);
    padding: 0 0.25em;
    font-family: monospace;
    white-space: pre;
}
main > section select, 
main > section button {
    font-family: monospace;
}

main > section.num input {
    width: 5em;
}
main > section.col input {
    width: 2em;
    height: 2em;
}
main > section.rng input {
    width: 7em;
}
main > section.vec input {
    width: 23%;
}
main > section.vec > span {
    display: flex;
    flex-flow: row wrap;
    justify-content: end;
    gap: 1px;
}
main > section.out {
    min-width: 2em;
    max-width: 100%;
    overflow: hidden;
}
main > section.out output {
    user-select: text;
}
main > section.rng output {
    width: 1.5em;
    text-align: right;
}
main > section.sep > hr {
    color: var(--bkg-3);
    width: 90%;
}
main > section input:disabled {
    background-color: var(--bkg-1);
    color: var(--col-3);
}
</style>
<main></main>`
    }
}

customElements.define("ctrl-ing", Ctrling);