/**
 * ctrling.js (c) 2022 Stefan Goessner
 * @license MIT License
 */
"use strict";

// Custom element (Web Component)
class Ctrling extends HTMLElement {
    static get observedAttributes() {
        return ['ref','width','top','right','darkmode','autoupdate','tickspersecond','callback'];
    }
//    static secType = ['hdr','btn','chk','num','txt','rng','col','sel','sep','out','mtr','vec'];
    static updateNextSibling(evt) {
        evt.target.nextSibling.innerHTML = evt.target.value;
    }
    static stringify(value) {
        return Array.isArray(value) ? JSON.stringify(value)
             : typeof value === 'object' ? JSON.stringify(value).replaceAll(/\[.*?\]/gm, ($0) => $0.replaceAll(',',';'))
                                                                .replaceAll(/\:\{([^}]*?)\}/gm, ($0) => $0.replaceAll(',',';'))
                                                                .replace(/^\{/gm,'{\n  ')
                                                                .replace(/\}$/gm,'\n}')
                                                                .replaceAll(',',',\n  ')
                                                                .replaceAll(';',',')
             : typeof value === 'string' ? value
             : JSON.stringify(value);
    }
    constructor() {
        super().attachShadow({ mode:'open' });
    }

    get refRoot() {
        const ref = this.getAttribute('ref') || '';   // must conform to variable syntax rules (ASCII).
        const refName = /[A-Za-z_][A-Za-z_0-9]*/.test(ref) ? ref : "";
        // `globalThis` does not work with let and const, only with var ...
        // see https://stackoverflow.com/questions/28776079/do-let-statements-create-properties-on-the-global-object
        const refroot = globalThis[refName];
        return refroot !== undefined ? refroot : eval(refName);  // ... so use 'eval'.
    }
    get width() { return this.getAttribute('width') || '200px'; }
    set width(q) { if (q) this.setAttribute('width',q); }
    get top() { return this.getAttribute('top') || '0px'; }
    get right() { return this.getAttribute('right') || '0px'; }
    get darkmode() { return !!this.hasAttribute('darkmode') || false; }
    get autoupdate() { return !!this.hasAttribute('autoupdate') || false; }

    // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
    connectedCallback() {
        // fires with opening tag complete only. No children available yet ... see ...
        // https://stackoverflow.com/questions/70949141/web-components-accessing-innerhtml-in-connectedcallback
        // https://github.com/WICG/webcomponents/issues/551
        setTimeout(()=>this.init()); 
    }
    disconnectedCallback() {}
    attributeChangedCallback(name, oldval, val) {}

    init() {
        this.shadowRoot.innerHTML = Ctrling.template.main({ width:this.width, top:this.top, right:this.right, darkmode:this.darkmode});
        this.main = this.shadowRoot.querySelector('main');

        this.sections = this.innerHTML !== undefined ? this.sectionsFromJSON() : [];
//console.log(this.main.innerHTML);
        this.style.display = 'block';
        this.style.width = this.main.offsetWidth + 'px';
        this.style.height = this.main.offsetHeight + 'px';

        if (this.hasAttribute('callback')) {
            const [obj, member] = this.getRef(this.getAttribute('callback'));
            const prop = obj && member && Object.getOwnPropertyDescriptor(obj, member);
   
            if (prop !== undefined  && "value" in prop && typeof obj[member] === 'function') {
                this.setRefValueCallback = obj[member];
                this.setRefValueCallback();  // call initially once ...
            }
        }
        if (this.hasAttribute('tickspersecond')) {
            const tps = +this.getAttribute('tickspersecond');
            if (!Number.isNaN(tps))
                Ctrling.timer.ticksPerSecond = tps;
        }
    }

    sectionsFromJSON() {
    //console.log(this.innerHTML)
        try {
            this.sections = JSON.parse(this.innerHTML);
            for (let i=0; i<this.sections.length;i++)
                this.main.append(this.#newHtmlSection(this.sections[i]));
            return this.sections;
        }
        catch (e) { this.sections = []; this.addSection({sec:'hdr',text:"Ctrling: " + e.message}); }
        return this.sections;
    }

    idxById(id) {
        return this.sections.findIndex((sec) => sec.id === id);
    }
    sectionById(id) {
        const idx = this.sections.findIndex((sec) => sec.id === id);
        return idx >= 0 ? this.sections[idx] : undefined;
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

    addSection(args) {
        const secElem = this.#newHtmlSection(args);
        if (secElem) {
            this.main.append(secElem);
            this.sections.push(args);
        }
        return this;
    }
    removeSection(idx) {
        this.main.getElementsByTagName('section')[idx]?.remove();
        this.sections.splice(idx,1);
        return this;
    }
    updateSection(args, idx) {
        if (idx === undefined)
            idx = this.sections.findIndex((sec) => sec === args);
        if (idx >= 0) {
            const secElem = this.#newHtmlSection(args);
            if (secElem)
                this.main.getElementsByTagName('section')[idx]?.replaceWith(secElem);
        }
        return this;
    }
    replaceSection(idx, args) {
        const secElem = this.#newHtmlSection(args);
        if (secElem) {
            this.main.getElementsByTagName('section')[idx]?.replaceWith(secElem);
            this.sections.splice(idx,1,args);
        }
        return this;
    }
    getRef(path) {
        const root = path.startsWith('$') ? this.refRoot 
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

    getRefValue(obj, member, deflt) {
        return obj ? (member ? obj[member] : obj) : deflt;
    }
    setRefValue(obj, member, value) {
        obj[member] = (value === true || 
                       value === false ||
                       value === null) ? value
                    : !Number.isNaN(+value) ? +value
                    : value;

        if (this.setRefValueCallback !== undefined)
            this.setRefValueCallback(obj, member, value);
    }

    #addUpdateHandler(hdl) {
        if (this.autoupdate)
            Ctrling.timer.ontick(hdl);
        else
            (this.updators || (this.updators=[])).push(hdl);
    }
    update() {
        if (this.updators)
            for (const hdl of this.updators)
                hdl();
    }

    // section element completion ...
    hdr(elem, args) { // args={text}
        elem.innerHTML = `${args.text || ''}`;
        return elem;
    }
    chk(elem, args) {  // args={label,value,path,disabled}
        const [obj, member] = this.getRef(args.path);
        elem.innerHTML = `<label>${args.label}<input type="checkbox" ${this.getRefValue(obj, member, args.value) ? "checked" : ""}${!!args.disabled ? " disabled" : ""}></label>`;
        elem.querySelector('input')
            .addEventListener("input", (e) => this.setRefValue(obj, member, !!e.target.checked), true);
        return elem;
    }
    col(elem, args) {  // args={label,value,path,disabled}
        const [obj, member] = this.getRef(args.path);
        const value = this.getRefValue(obj, member, (args.value || "#000000"));
        elem.innerHTML = `${args.label}<span><input type="color" value="${value}"${!!args.disabled ? " disabled" : ""}><output>${value}</output></span>`;
        elem.querySelector('input')
            .addEventListener("input", (e) => { this.setRefValue(obj, member, e.target.value); Ctrling.updateNextSibling(e); }, true);
        return elem;
    }
    num(elem, args) {  // args={label,value,min,max,step,fractions,unit,path,disabled}
        const [obj, member] = this.getRef(args.path);
        const value = this.getRefValue(obj, member, (args.value || 0));
        const round = (value, decimals) => decimals ? value.toFixed(decimals) : value;
        elem.innerHTML = `<label>${args.label}<span><input type="number" value="${round(value, args.fractions)}"${args.min !== undefined ? ` min="${args.min}"` : ''}${args.max !== undefined ? ` max="${args.max}"` : ''}${args.step !== undefined ? ` step="${args.step}"` : ''}${!!args.disabled ? " disabled" : ""}>${args.unit ? `<span>${args.unit}</span>` : ''}</span></label>`;
        elem.querySelector('input')
            .addEventListener("input", (e) => this.setRefValue(obj, member, round(+e.target.value, args.fractions)), true);
        elem.querySelector('input')
            .addEventListener("change", (e) => this.setRefValue(obj, member, e.target.value=round(+e.target.value, args.fractions)), true);
        return elem;
    }
    txt(elem, args) {  // args={label,value,path,disabled}
        const [obj, member] = this.getRef(args.path);
        elem.innerHTML = `<label>${args.label}<input type="text" value="${this.getRefValue(obj, member, args.value || "")}"${!!args.disabled ? " disabled" : ""}></label>`;
        elem.querySelector('input')
            .addEventListener("input", (e) => this.setRefValue(obj, member, e.target.value), true);
        return elem;
    }
    rng(elem, args) {  // args={label,value,path,min,max,step,disabled}
        const [obj, member] = this.getRef(args.path);
        const value = this.getRefValue(obj, member, args.value);
        elem.innerHTML = `${args.label}<span><input type="range" value="${value}"${args.min !== undefined ? ` min="${args.min}"` : ''}${args.max !== undefined ? ` max="${args.max}"` : ''}${args.step !== undefined ? ` step="${args.step}"` : ''}${!!args.disabled ? " disabled" : ""}><output>${value}</output>${args.unit ? `<span>${args.unit}</span>` : ''}`;
        elem.querySelector('input')
            .addEventListener("input", (e) => { this.setRefValue(obj, member, +e.target.value); Ctrling.updateNextSibling(e); }, true);
        return elem;
    }
    sel(elem, args) {  // args={label,options,path,disabled}
        const [obj, member] = this.getRef(args.path);
        const options = Array.isArray(args.options) ? args.options.map(e => [e,e]) : Object.entries(args.options);
        const value =  this.getRefValue(obj, member, options[0][1]);
        elem.innerHTML = `${args.label}<select${!!args.disabled ? " disabled" : ""}>${options.map(o => `<option value="${o[1]}"${o[1]===value ? " selected" : ""}>${o[0]}</option>`).join('')}</select>`;
        elem.querySelector('select')
            .addEventListener("input", (e) => this.setRefValue(obj, member, isNaN(e.target.value) ? e.target.value : +e.target.value), true);
        return elem;
    }
    sep(elem) {  // args={}
        elem.innerHTML = '<hr>';
        return elem;
    }
    btn(elem, args) {  // args={label,text,path,disabled} ... invoke getter or parameterless function ...
        elem.innerHTML = `${args.text && args.label || '&nbsp;'}<button type="button"${!!args.disabled ? " disabled" : ""}>${args.text || args.label}</button`;
        if (args.path && !args.disabled) {
            const [obj, member] = this.getRef(args.path);
            const prop = obj && member && Object.getOwnPropertyDescriptor(obj, member);
    
            if (prop !== undefined  && "value" in prop && typeof obj[member] === 'function')
                elem.querySelector('button')
                    .addEventListener("click", obj[member], true);
        }
        return elem;
    }
    out(elem, args) { // args={label,value,unit,path}
        const [obj, member] = this.getRef(args.path);
        const value =  Ctrling.stringify(this.getRefValue(obj, member, (args.value || "")));

        elem.innerHTML = `${args.label}<span><output>${value}</output>${args.unit ? `<span>${args.unit}</span>` : ''}</span>`;
        if (obj !== undefined) {
            const output = elem.querySelector('output');
            this.#addUpdateHandler(() => {
                const refval = Ctrling.stringify(member ? obj[member] : obj);
                if (output.innerHTML !== refval) 
                    output.innerHTML = refval;
            });
        }
        return elem; 
    }
    mtr(elem, args) { // args={label,value,min,max,low,high,optimum,unit,path}
        const [obj, member] = this.getRef(args.path);
        const value = this.getRefValue(obj, member, (args.value || args.min || 0));
        elem.innerHTML = `${args.label}<span><meter value="${value}"${args.min!==undefined ? ` min="${args.min}"` : ""}${args.max!==undefined ? ` max="${args.max}"` : ""}${args.low!==undefined ? ` low="${args.low}"` : ""}${args.high!==undefined ? ` high="${args.high}"` : ""}${args.optimum!==undefined ? ` optimum="${args.optimum}"` : ""}></meter><output>${value}</output>${args.unit ? `<span>${args.unit}</span>` : ''}</span>`;
        if (obj !== undefined) {
            const meter = elem.querySelector('meter');
            const output = elem.querySelector('output');
            this.#addUpdateHandler(() => {
                const refval = member ? obj[member] : obj;
                if (meter.value !== refval)
                    meter.value = output.value = refval;
            });
        }
        return this; 
    }
    vec(elem, args) {  // args={label,width,unit,path,disabled}
        if (Array.isArray(args.path) && args.path.length > 0) {
            elem.innerHTML = `${args.label}<span>${args.path.map(path => {
                const [obj, member] = this.getRef(path);
                return `<input type="text" ${obj ? ` value="${Ctrling.stringify(obj[member])}"` : ""}${!!args.disabled ? " disabled" : ""}${args.width ? ` style="width:${args.width}"` : ""}>`
            }).join('')}</span>${args.unit ? `<span>${args.unit}</span>` : ''}`;
            const inputs = elem.getElementsByTagName('input');
            for (let i=0; i<inputs.length; i++) {
                inputs[i]._ctrlpath = args.path[i];
                inputs[i].addEventListener("input", (e) => {
                    const [obj, member] = this.getRef(e.target._ctrlpath);
                    this.setRefValue(obj, member, isNaN(e.target.value) ? e.target.value : +e.target.value);
                }, true);
            }
        }
        return elem;
    }

    static template = {
        main({width, top, right, darkmode}) {
            return `
<style>
main {
    /* grid layout */
    display: grid;
    grid: minmax(200px,100%);
    border-radius:5px;
    padding: 0 2px 0 2px;
    width: ${width};
    min-width: 200px;
    background-color: ${darkmode?'#444':'#dadada'};
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
    color: ${darkmode?'#eee':'#444'};
    background-color: ${darkmode?'#666':'#bbb'};
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

    color: ${darkmode?'#ddd':'#222'};

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
main > section input:hover {
    background-color: ${darkmode?'#666':'#fff'};
}
main > section input:focus-visible {
    color: ${darkmode?'#eee':'#111'};
    outline: 1px solid ${darkmode?'#ddd':'#222'}
}
main > section input {
    background-color: ${darkmode?'#555':'#efefef'};
    color: ${darkmode?'#ddd':'#222'};
    border: none;
}
main > section.num input {
    width: 5em;
}
main > section.col input {
    width: 2em;
}
main > section.rng input {
    width: 7em;
}
main > section.vec input {
    width: 24%;
}
main > section.vec > span {
    display: flex;
    flex-flow: row wrap;
    justify-content: end;
    gap: 1px;
    /*background-color: ${darkmode?'#444':'#cdcdcd'};*/
}
main > section.out {
    min-width: 2em;
    max-width: 100%;
    overflow: hidden;
}
main > section.rng output {
    width: 1.5em;
    text-align: right;
}
main > section.sep > hr {
    color: ${darkmode?'#666':'#ccc'};
    width: 90%;
}
main > section output {
    background-color: ${darkmode?'#555':'#e6e6e6'};
    padding: 0 0.25em;
    font-family: monospace;
    white-space: pre;
}
main > section select, 
main > section button {
    font-family: monospace;
}
</style>
<main></main>`
        }
    }
    static timer = {
        t: 0,
        handler: [],
        rafid: false,
        ticksPerSecond: 4,
        ontick(fn) { 
            this.handler.push(fn);
            if (!this.rafid)
                this.tick();
        },
        tick() {
            Ctrling.timer.t = (Ctrling.timer.t++) % (60/4);
            if (Ctrling.timer.t === 0 ) { 
                for (const hdl of Ctrling.timer.handler) 
                    hdl();
            }
            Ctrling.timer.rafid = requestAnimationFrame(Ctrling.timer.tick);   // request next tick ...
        }
    }
}

customElements.define("ctrl-ing", Ctrling);