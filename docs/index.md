---
"lang": "en-US",
"title": "&lt;ctrl-ing&gt; - A Smart GUI Controller",
"subtitle": "An appealing GUI for controlling your Web-App, JSON, DOM or JavaScript Object Values",
"authors": ["Stefan Gössner<sup>1</sup>", "<a href='https://github.com/goessner/ctrling'><svg height='16' width='16' viewBox='0 0 16 16'><path fill-rule='evenodd' fill='#1f3939' clip-rule='evenodd' d='M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z'></path></svg></a>"],
"adresses": ["<sup>1</sup>Dortmund University of Applied Sciences. Department of Mechanical Engineering"],
"date": "January 2023",
"description": "A tiny HTML custom element for interactively controlling your Web-App parameters",
"tags": ["prototypical","GUI","controlling","JSON","javascript","object","JSONPath","HTML","custom element"]
---

### Abstract

Many webapplications are of small to medium size. Equipping these with a pleasing user control menu usually is comparatively costly. For this purpose, presented is a simple solution concept to rapidly prototype a pleasing GUI even without programming.

## Content

  - [1. What is It ?](#1-what-is-it)
  - [2. Getting Started](#2-getting-started)
  - [3. `<ctrl-ing>` Element](#3-ctrl-ing-element)
    - [3.1 `<ctrl-ing>` Attributes](#31-ctrl-ing-attributes)
    - [3.2 Automatical Menu Generation](#32-automatical-menu-generation)
    - [3.3 Examples](#33-examples)
  - [4. Sections Reference](#4-sections-reference)
    - [4.1 Button](#41-button)
    - [4.2 Checkbox](#42-checkbox)
    - [4.3 Color](#43-color)
    - [4.4 Header](#44-header)
    - [4.5 Meter](#45-meter)
    - [4.6 Number](#46-number)
    - [4.7 Output](#47-output)
    - [4.8 Range](#48-range)
    - [4.9 Selection](#49-selection)
    - [4.10 Separator](#410-separator)
    - [4.11 Text](#411-text)
    - [4.12 Vector](#412-vector)
  - [5. API](#5-api)
    - [5.1 Self-Control](#51-self-control)
  - [6. Other Controller Libraries](#6-other-controller-libraries)
  - [7. Conclusion](#7-conclusion)
  - [References](#references)


## 1. What is It ?

`ctrl-ing` is a tiny HTML custom element used to interactively control your Web-App parameters or JavaScript/JSON/DOM object values in a comfortable way with the following characteristics:

* tiny footprint `25.3/14.2 kB` un/compressed.
* dependency free.
* easy prototypical generation with low effort.
* given an object, a menu template can even be created automatically.
* no programming required.
* getting a pleasing GUI.

<figure style="text-align:center"> 
   <img src="./lissajous.gif">
</figure>  
<figcaption style="font-size:0.95em;text-align:center">Fig. 1: Controlling an Animation.</figcaption><br>

Here is the [live version](../examples/ctrl-lissajous.html) of the Lissajous example. Its interactive menu was created via:

```html
<ctrl-ing ref="app" darkmode>
  [ {"sec":"hdr","text":"Parameters"},
    {"sec":"num","label":"a","min":0,"max":10,"step":1,"path":"$['a']","unit":"[-]"},
    {"sec":"num","label":"b","min":0,"max":10,"step":1,"path":"$['b']","unit":"[-]"},
    {"sec":"hdr","text":"Animation"},
    {"sec":"chk","label":"run","path":"$['run']"},
    {"sec":"rng","label":"vel","min":1,"max":10,"step":1,"path":"$['vel']"},
    {"sec":"hdr","text":"Style"},
    {"sec":"col","label":"Stroke","path":"$['ls']"},
    {"sec":"col","label":"Fill","path":"$['fs']"}
  ]
</ctrl-ing>
```
<figcaption>Listing 1: Structure of custom HTML element <code>ctrl-ing</code>.</figcaption><br>

Beside implementing your web application, all you need to do for prototyping an appealing GUI, is inserting a `<ctrl-ing>` element to your HTML document (see Listing 1). Its content is compact JSON text, representing an array of section objects. Each section corresponds to a single line in the grid-like view structure of the `<ctrl-ing>` menu and is associated to either

* *input* controlling application parameters.
* *output* monitoring values.
* *structuring* elements.

All section objects are generating plain native HTML (form) elements in the background (shadow DOM) [[1]](#1). That markup is hidden and separated from other code on the page &mdash; thus avoiding code collisions.

## 2. Getting Started

You might want to start with a minimal example. Let's say, we want to create this controlling menu.

<figure style="text-align:center"> 
   <img src="./gettingstarted.gif">
</figure>  
<figcaption style="font-size:0.95em;text-align:center">Fig. 2: Minimal <code>&lt;ctrl-ing&gt;</code> Example.</figcaption><br>

Here is the complete HTML code ([Live version](./gettingstarted.html))

```html
<!doctype html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Getting Started</title>
    <script src="https://cdn.jsdelivr.net/npm/ctrling/ctrling.min.js"></script>
</head>
<body>
    <ctrl-ing ref="obj" autoupdate>
        [ {"sec":"hdr","text":"Getting Started"},
          {"sec":"chk","label":"Toggle","path":"$['toggle']"},
          {"sec":"out","label":"obj=","path":"$"}
        ]
    </ctrl-ing>
    <script>
        const obj = {
            toggle: false
        }
    </script>
</body>
</html>
```
<figcaption>Listing 2: Minimalistic example using <code>&lt;ctrl-ing&gt;</code> element.</figcaption><br>

With this example please take note of following points:

* By its `ref="obj"` attribute the `<ctrl-ing>` instance references a global object `obj`.
* The `chk` section in the JSON content accesses the `toggle` member of the reference object `obj` via its `path` property using standard [JSONPath](https://ietf-wg-jsonpath.github.io/draft-ietf-jsonpath-base/draft-ietf-jsonpath-base.html#name-normalized-paths) syntax, where the root identifier `"$"` corresponds to the `ref` attribute content above.
* The `out` section is monitoring the reference object in JSON text format.
* The `autoupdate` attribute of the `<ctrl-ing>` instance enables monitoring sections to be updated automatically. 
* `ctrling.js` is inserted via CDN to the page.

The generated encapsulated shadow DOM structure for the `<ctrl-ing>` element in this example is quite clear.

```html
<main>
    <section class="hdr">Getting Started</section>
    <section class="chk">
        <label>Toggle<input type="checkbox"></label>
    </section>
    <section class="out">
        obj=<span><output>{
          "toggle":false
        }</output></span>
    </section>
</main>
```
<figcaption>Listing 3: Internal DOM structure of the <code>ctrl-ing</code> element.</figcaption><br>

## 3. `<ctrl-ing>` Element

The default width of the `<ctrl-ing>` menu is `200px`, which can be modified by the element's `width` attribute. Its default position is the top right corner of its parent element's area. This might be fine-adjusted via `top` and `right` attributes.

We can use multiple `<ctrl-ing>`s per page &ndash; always right aligned each. In this case the elements should be encapsulated via 

```html
<div style="position:relative;">
    <ctrl-ing>...</ctrl-ing>
</div>
```

If the `<ctrl-ing>` element should be positioned side-by-side with another (to be controlled) element &ndash; which is frequently the case, the following markup might be used

```html
<div style="display:flex; position:relative;">
    <div>...</div>
    <ctrl-ing>...</ctrl-ing>
</div>
```

The connection from the `<ctrl-ing>` element and its content to application parameter values is established via element attributes and section members representing paths pointing into an application object. These path strings MUST start with one of

* `globalThis` or `window`
* the root identifier `$`, referencing an application object name indicated by the `<ctrl-ing>` element's `ref` attribute.

Thus the reference object MUST be an object (JavaScript arrays are objects).

The rest of the path string MUST obey the syntax of *Normalized Paths* according to [Internet standard *JSONPath*](https://ietf-wg-jsonpath.github.io/draft-ietf-jsonpath-base/draft-ietf-jsonpath-base.html#name-normalized-paths) (IETF), i.e.

* using the bracket syntax `[...]` exclusively.
* enclosing member names in single quotation marks.

### 3.1 `<ctrl-ing>` Attributes

For an `<ctrl-ing>` element following optional attributes are supported:

| Attribute | Default | Meaning |
|:--:|:--:|:--|
|`ref`  | `window` | Referencing a global object variable of the name indicated by this attribute.  |
|`width`  | `200px` | Width of the GUI menu (CSS units).  |
|`top`  | `0` | Distance relative to top edge of parent element (CSS units). |
|`right`  | `0` | Distance relative to right edge of parent element (CSS units). |
|`darkmode`  | - | Display GUI menu in dark mode (default: light). |
|`autoupdate`  | - | Automatically update monitoring and input sections. |
|`autogenerate`  | - | Automatically generate a prototype menu from the object given by `ref` attribute. |
|`tickspersecond`  | `4` | How often to update sections per second (on external value change). |
|`callback`  | - | If present, will be called with each user value change by input sections. The attribute value must obey the [JSONPath](https://ietf-wg-jsonpath.github.io/draft-ietf-jsonpath-base/draft-ietf-jsonpath-base.html#name-normalized-paths) syntax rules and might be a global function or an object method. |

<figcaption>Table 1: Supported <code>ctrl-ing</code> attributes.</figcaption><br>

The `callback` function or method will be handed over an argument object with the structure:

```js
args = {
    ctrl,    // current `<ctrl-ing>` element object.
    obj,     // parent object holding the member, whose value is to be set.
    member,  // the member name, whose value is to be set.
    value,   // the new member value.
    section, // the current section object.
    elem     // the current html <section> element.
}
```
Please note, that a first initial call of the `callback` function &ndash; when exists &ndash; is automatically done during initialization time. A reduced object `args = {ctrl}` will be passed as an argument then.

### 3.2 Automatical Menu Generation

It is possible to let a `<ctrl-ing>` element automatically generate a GUI menu from a given JavaScript object.

```html
<ctrl-ing ref="gen" autogenerate></ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
<pre id="genout"></pre>
<ctrl-ing ref="gen" autogenerate autoupdate callback="window['cbgen']"></ctrl-ing>
</div>
<script>
const gen = {
    checked: true,
    _priv: false,
    month: "january",
    number: 42,
    color: '#ff0000',
    get phi() { return this._phi || 3.14; },
    set phi(q) { return this._phi = q; }
}
function cbgen() { document.getElementById('genout').innerHTML = "const gen = "+Ctrling.stringify(gen); }
</script>

Automatical menu generation with `<ctrl-ing>` works according to following rules.

* its `ref` attribute must point to a valid object.
* its `autogenerate` attribute must be present.
* the object's properties delivered by [`Object.getOwnPropertyNames()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames) are taken to build the menu.
  * the member value types `boolean`, `number` and `string` create sections of type `chk`, `num` and `txt`.
  * a member value type of `string` whose value starts with `"#"` is assumed to represent a rgb color value and generates a section of type `col`.
  * members with type of `object` are not taken into account.
  * getters/setters are treated as normal properties.
  * property names starting with underline `"_"` are considered private and skipped.
* an `autogenerate="source"` attribute generates an additional final section of type `out` containing the JSON text of the generated sections as a template for further use.

### 3.3 Examples

| Run | Source | Example |
|:--|:--|:--|
|[API](https://goessner.github.io/ctrling/examples/ctrl-api.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-api.html) | Using the API |
|[array](https://goessner.github.io/ctrling/examples/ctrl-array.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-array.html) | Controlling an array object |
|[autogenerate](https://goessner.github.io/ctrling/examples/ctrl-autogenerate.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-autogenerate.html) | Automatically generating a menu |
|[color](https://goessner.github.io/ctrling/examples/ctrl-color.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-color.html) | Controlling an RGB color |
|[demo](https://goessner.github.io/ctrling/examples/ctrl-demo.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-demo.html) | Showing all features |
|[lissajous](https://goessner.github.io/ctrling/examples/ctrl-lissajous.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-lissajous.html) | Lissajous App |
|[minimal](https://goessner.github.io/ctrling/examples/ctrl-minimal.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-minimal.html) | Minimal menu generation |
|[parse-error](https://goessner.github.io/ctrling/examples/ctrl-parse-error.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-parse-error.html) | Treating JSON parse error |
|[paths](https://goessner.github.io/ctrling/examples/ctrl-paths.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-paths.html) | Using paths as JSONPath strings |
|[self](https://goessner.github.io/ctrling/examples/ctrl-self.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-self.html) | Controlling the menu itself |
|[svg](https://goessner.github.io/ctrling/examples/ctrl-svg.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-svg.html) | Controlling SVG graphics |
|[todeg](https://goessner.github.io/ctrling/examples/ctrl-todeg.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-todeg.html) | Transform property with user setting |
|[variable](https://goessner.github.io/ctrling/examples/ctrl-variable.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-variable.html) | Controlling a single variable value |
|[vector](https://goessner.github.io/ctrling/examples/ctrl-vector.html) | [source](https://github.com/goessner/ctrling/docs/examples/ctrl-vector.html) | Controlling multiple values as vector |


## 4. Sections Reference

For each section in the JSON content of the `<ctrl-ing>` element there is a HTML `<section>` element containing either plain visually structuring, data monitoring or interactive form elements. Here is an overview of the twelve different section types. 

| Type | HTML (shadow) | Task |
|:--:|:--|:--|
|[`btn`](#41-button)  | `<button>` | Perform an action by calling a parameterless function or object method.  |
|[`chk`](#42-checkbox)  | `<input type="checkbox">` | Display a checkbox for entering Boolean parameter values. |
|[`col`](#43-color)  | `<input type="color">` | Display a color menu for setting an RGB color parameter value. |
|[`hdr`](#44-header)  | text string | Header for menu structuring. |
|[`mtr`](#45-meter)  | `<meter>` | Graphically monitoring a numerical value in a range. |
|[`num`](#46-number)  | `<input type="number">` | Display an input field for entering a numerical parameter value. |
|[`out`](#47-output)  | `<output>` | Monitoring any data. |
|[`rng`](#48-range)  | `<input type="range">` | Display a slider element for setting a numerical parameter value. |
|[`sel`](#49-selection)  | `<select>` | Provides a drop down menu of options. |
|[`sep`](#410-separator)  | `<hr>` | Display a separating line for menu structuring. |
|[`txt`](#411-text)  | `<input type="text">` | Display an input field for entering a textual parameter value. |
|[`vec`](#412-vector)  | multiple<br>`<input type="text">` | Display a set of input fields for entering multiple related data values. |

<figcaption>Table 2: Available section types.</figcaption><br>

### 4.1 Button

The `btn` section is used to trigger an action of some kind, so it supports the invocation of a parameterless object method or a global function. You can specify a `label` and/or a `text` property. If one of them is missing, the other one is taken as the button text.

```json
<ctrl-ing ref="btn">
  [ {"sec":"hdr","text":"Buttons"},
    {"sec":"btn","label":"Method","text":"green","path":"$['method']"},
    {"sec":"btn","label":"Function","text":"red","path":"window['fnc']"}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
<pre id="btnsrc">
function fnc() { ... }
const btn = { method() { ... } }
</pre>
<ctrl-ing ref="btn">
  [ {"sec":"hdr","text":"Buttons"},
    {"sec":"btn","label":"Method","text":"green","path":"$['method']"},
    {"sec":"btn","label":"Function","text":"red","path":"window['fnc']"}
  ]
</ctrl-ing>
</div>
 <script>
const src=document.getElementById('btnsrc');
function fnc() { src.style.backgroundColor='red'; }
var btn = {
  method() { src.style.backgroundColor='green'; }
}
</script>

**HTML in Shadow DOM**
```html
<section class="btn">
  Method
  <button type="button">green</button>
</section>
```

**Properties**
| `btn` | Default | Comment |
|:--|:--:|:--|
|`[label]` | '' | Label text.  |
|`text`  | - | Button text.  |
|`path`  | - | Location of method within reference object or global function.  |
|`[disabled]`  | - | Disable button.  |

### 4.2 Checkbox

The `chk` section is usually assigned to a boolean object property to be controlled.
```json
<ctrl-ing ref="chk" darkmode>
  [ {"sec":"hdr","text":"Checkbox"},
    {"sec":"chk","label":"Checkbox","path":"$['toggle']"}
  ]
</ctrl-ing>
```

<div style="display: flex; position:relative; font-size:0.8em;">
<pre id="outchk"></pre>
<ctrl-ing ref="chk" darkmode callback="window['cbchk']">
  [ {"sec":"hdr","text":"Checkbox"},
    {"sec":"chk","label":"Checkbox","path":"$['toggle']"}
  ]
</ctrl-ing>
</div>
 <script>
    const chk = {
        toggle:true
    }
    function cbchk() { document.getElementById('outchk').innerHTML = "const chk = "+Ctrling.stringify(chk); }
</script>

**Properties**
| `chk` | Default | Comment |
|:--|:--:|:--|
|`[label]` | '' | Label text.  |
|`path`  | - | Location of reference value within reference object.  |
|`[value]`  | reference value | Only used as value, if reference value is not available. |
|`[disabled]`  | - | Disable input element.  |

**HTML in Shadow DOM**
```html
<section class="chk">
  <label>
    Toggle
    <input type="checkbox" checked>
  </label>
</section>
```

### 4.3 Color

The `col` section provides a user interface to assign a RGB color in HEX-notation to an object property.
```json
<ctrl-ing ref="col">
  [ {"sec":"hdr","text":"Color"},
    {"sec":"col","label":"Color","path":"$['color']"}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
<pre id="outcol"></pre>
<ctrl-ing ref="col" callback="window['cbcol']">
  [ {"sec":"hdr","text":"Color"},
    {"sec":"col","label":"Color","path":"$['color']"}
  ]
</ctrl-ing>
</div>
 <script>
    const col = {
        color:"#456789"
    }
    function cbcol() { document.getElementById('outcol').innerHTML = "col = "+Ctrling.stringify(col); }
</script>

**Properties**
| `col` | Default | Comment |
|:--|:--:|:--|
|`[label]` | '' | Label text.  |
|`path`  | - | Location of reference value within reference object.  |
|`[value]`  | `#000000` | Used as value, if reference value is not available. |
|`[disabled]`  | - | Disable input element.  |

**HTML in Shadow DOM**
```html
<section class="col">
  Color
  <span>
    <input type="color" value="#456789">
    <output>#456789</output>
  </span>
</section>
```

### 4.4 Header

The `hdr` section is used for menu structuring. We can use multiple headers for visually subdivide sections.

```json
<ctrl-ing>
  [ {"sec":"hdr","text":"Header Only"} ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
<ctrl-ing>
  [ {"sec":"hdr","text":"Header Only"} ]
</ctrl-ing>
</div>

**HTML in Shadow DOM**
```html
<section class="hdr">
  Header Only
</section>
```

**Properties**
| `hdr` | Default | Comment |
|:--|:--:|:--|
|`text` | - | Header text.  |


### 4.5 Meter

The monitoring `mtr` section provides a graphic view of a scalar object property value within a known range. It displays the value in its initial state and is not aware of value changes, unless either the
* `<ctrl-ing>`'s `autoupdate` property is set.
* API method `update()` is called.

```json
<ctrl-ing ref="mtr" darkmode>
  [ {"sec":"hdr","text":"Meter"},
    {"sec":"mtr","label":"Volumn","path":"$['volumn']","min":20,"max":80,
                 "low":45,"high":70,"optimum":40,"value":50,"unit":"m&sup3;"}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
<pre id="outmtr">const mtr = {
  volumn:40
}
</pre>
<ctrl-ing ref="mtr" darkmode>
  [ {"sec":"hdr","text":"Meter"},
    {"sec":"mtr","label":"Volumn","path":"$['volumn']","min":20,"max":80,
                 "low":45,"high":70,"optimum":40,"value":50,"unit":"m&sup3;"}
  ]
</ctrl-ing>
</div>
 <script>
    const mtr = {
        volumn:40
    }
</script>

**HTML in Shadow DOM**
```html
<section class="mtr">
    Volumn
    <span>
        <meter value="40" min="20" max="80" low="45" high="70" optimum="30"></meter>
        <output>40</output>
        <span>m&sup3;</span>
    </span>
</section>
```

**Properties**
| `mtr` | Default | Comment |
|:--|:--:|:--|
|`[label]` | '' | Label text.  |
|`path`  | - | Location of scalar reference value within reference object.  |
|`[value]`  | `min`&nbsp;\|&nbsp;0 | Used as value, if reference value is not available. |
|`[min]`  | 0 | Minimum value. |
|`[max]`  | 1 | Maximum value. |
|`[low]`  | `min` | Lower limit value (`low` &ge; `min`). Meter may change color when below. |
|`[high]`  | `max` | Upper limit value (`high` &le; `max`). Meter may change color when above. |
|`[optimum]`  | - | Optimal numeric value  (`min` &le; `optimum` &le; `max`); e.g., if it lies between `min` and `low`, that region is colored as the preferrable one. |
|`[unit]`  | - | Append unit string. |

### 4.6 Number

The `num` section provides a user interface to enter a numerical value and assign it to an object property. It uses the HTML `<input type="number">` element and supports its `min`, `max` and `step` attributes.

**Example**

```json
<ctrl-ing ref="num" darkmode>
  [ {"sec":"hdr","text":"Number"},
    {"sec":"num","label":"Number","min":1,"max":2,"step":0.2,
                 "path":"$['number']","unit":"[s]"}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
<pre id="outnum"></pre>
<ctrl-ing ref="num" darkmode callback="window['cbnum']">
  [ {"sec":"hdr","text":"Number"},
    {"sec":"num","label":"Number","min":1,"max":2,"step":0.2,
                 "path":"$['number']","unit":"[s]"}
  ]
</ctrl-ing>
</div>
<script>
    const num = {
        number: 1.2
    }
    function cbnum() { document.getElementById('outnum').innerHTML = "var num = "+Ctrling.stringify(num); }
</script>

**HTML in Shadow DOM**
```html
<section class="num">
    <label>
        Number
        <span>
            <input type="number" value="0" min="1" max="2" step="0.2">
            <span>[s]</span>
        </span>
    </label>
</section>
```

**Properties**
| `num` | Default | Comment |
|:--|:--:|:--|
|`[label]`  | '' | Label text.  |
|`[min]`  | - | Minimum value. |
|`[max]`  | - | Maximum value. |
|`[step]`  | `1` | Step size. |
|`[fractions]`  | - | Number of decimal digits. |
|`[value]`  | reference value | Only used as value, if reference value is not available. |
|`path`  |  | Location of reference value within reference object.  |
|`[unit]`  | - | Unit symbol of value.  |
|`[disabled]`  | - | Disabled input.  |

### 4.7 Output

The `out` section displays an object property value in its initial state. It is not aware of object value changes, unless either the
* `<ctrl-ing>`'s `autoupdate` property is set.
* API method `update()` is called.

The property value is mutated to JSON text for display. So only primitive object properties and getters are shown in case of structured property values.

```json
<ctrl-ing ref="out">
  [ {"sec":"hdr","text":"Output"},
    {"sec":"out","label":"Point","path":"$['pnt']","unit":"[mm]"}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
<pre id="outout">const out = {
  pnt: {x:5, y:7}
}
</pre>
<ctrl-ing ref="out">
  [ {"sec":"hdr","text":"Output"},
    {"sec":"out","label":"Point","path":"$['pnt']","unit":"[mm]"}
  ]
</ctrl-ing>
</div>
 <script>
    const out = {
        pnt: {x:5, y:7}
    }
</script>

**HTML in Shadow DOM**
```html
<section class="out">
    Point
    <span>
        <output>{
          "x":5,
          "y":7
        }</output>
        <span>[mm]</span>
    </span>
</section>
```

**Properties**
| `out` | Default | Comment |
|:--|:--:|:--|
|`[label]` | '' | Label text.  |
|`path`  | - | Location of reference value. |
|`[value]`  | reference value | Only used as value, if reference value is not available. |
|`[unit]`  | - | Append unit string. |

### 4.8 Range

The `rng` section provides a user interface to enter a numerical value in a range by a slider. It uses the HTML `<input type="range">` element and supports its `min`, `max` and `step` attributes.

**Example**

```json
<ctrl-ing ref="rng" darkmode>
  [ {"sec":"hdr","text":"Range"},
    {"sec":"rng","label":"Weight","min":10,"max":100,"step":5,
                 "path":"$['value']","unit":"kg"}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
<pre id="outrng"></pre>
<ctrl-ing ref="rng" darkmode callback="window['cbrng']">
  [ {"sec":"hdr","text":"Range"},
    {"sec":"rng","label":"Weight","min":10,"max":100,"step":5,
                 "path":"$['value']","unit":"kg"}
  ]
</ctrl-ing>
</div>
<script>
    const rng = {
        value: 40
    }
    function cbrng() { document.getElementById('outrng').innerHTML = "const rng = "+Ctrling.stringify(rng); }
</script>

**HTML in Shadow DOM**
```html
<section class="rng">
    Weight
    <span>
        <input type="range" value="40" min="10" max="100" step="5">
        <output>40</output>
        <span>kg</span>
    </span>
</section>
```

**Properties**
| `num` | Default | Comment |
|:--|:--:|:--|
|`[label]`  | '' | Label text.  |
|`[min]`  | - | Minimum value. |
|`[max]`  | - | Maximum value. |
|`[step]`  | `1` | Step size. |
|`[value]`  | reference value | Only used as value, if reference value is not available. |
|`path`  |  | Location of reference value within reference object.  |
|`[unit]`  | - | Unit string.  |
|`[disabled]`  | - | Disabled input.  |

### 4.9 Selection

The `sel` section provides a drop down menu of options. It uses the HTML `<select>` element. Options can be represented either by object members or array elements.
Then object member names are displayed in the drop down menu and member values are inserted as property values. Array elements (strings or numbers) are used as drop down items as well as target object property values.

Please note that the HTML `<select>`'s `multiple` attribute and `<optgroup>` elements are not supported.

```json
<ctrl-ing ref="sel">
  [ {"sec":"hdr","text":"Select"},
    {"sec":"sel","label":"Linestyle","path":"$['lineStyle']",
     "options":["solid","dashed","dotted"]},
    {"sec":"sel","label":"Thickness","path":"$['thickness']",
     "options":{"thin":1,"medium":2,"thick":3}}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
<pre id="outsel"></pre>
<ctrl-ing ref="sel" callback="window['cbsel']">
  [ {"sec":"hdr","text":"Output"},
    {"sec":"sel","label":"Linestyle","options":["solid","dashed","dotted"],"path":"$['lineStyle']"},
    {"sec":"sel","label":"Thickness","options":{"thin":1,"medium":2,"thick":3},"path":"$['thickness']"}
  ]
</ctrl-ing>
</div>
<script>
    const sel = {
      lineStyle: "dashed",
      thickness: 1
    }
    function cbsel() { document.getElementById('outsel').innerHTML = "const sel = "+Ctrling.stringify(sel); }
</script>

**HTML in Shadow DOM**
```html
<section class="sel">
  Linestyle
  <select>
    <option value="solid">solid</option>
    <option value="dashed" selected>dashed</option>
    <option value="dotted">dotted</option>
  </select>
</section>
<section class="sel">
  Thickness
  <select>
    <option value="1" selected>thin</option>
    <option value="2">medium</option>
    <option value="3">thick</option>
  </select>
</section>
```

**Properties**
| `sel` | Default | Comment |
|:--|:--:|:--|
|`[label]` | '' | Label text.  |
|`options`  | - | Object as member name/value pairs or array elements. |
|`[value]`  | reference value | Only used as value, if reference value is not available. |
|`path`  | - | Location of reference value. |
|`[disabled]`  | - | Disabled selection.  |

### 4.10 Separator

The `sep` section displays a separation line using the HTML `<hr>` element. It has no properties.

```json
<ctrl-ing darkmode>
  [ {"sec":"hdr","text":"Separator"},
    {"sec":"sep"}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
  <ctrl-ing>
    [ {"sec":"hdr","text":"Separator"},
      {"sec":"sep"}
    ]
  </ctrl-ing>
</div>

**HTML in Shadow DOM**
```html
<section class="sep">
    <hr>
</section>
```

### 4.11 Text

The `txt` section provides a user interface to enter a text string and assign it to an object property. It uses the HTML `<input type="text">` element.

Please note that multiline text is not supported.

**Example**

```json
<ctrl-ing ref="txt" darkmode>
  [ {"sec":"hdr","text":"Text"},
    {"sec":"txt","label":"Text","path":"$['text']"}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
<pre id="outtxt"></pre>
<ctrl-ing ref="txt" callback="window['cbtxt']">
  [ {"sec":"hdr","text":"Text"},
    {"sec":"txt","label":"Text","path":"$['text']"}
  ]
</ctrl-ing>
</div>
<script>
    const txt = {
        text: "something ..."
    }
    function cbtxt() { document.getElementById('outtxt').innerHTML = "var txt = "+Ctrling.stringify(txt); }
</script>

**HTML in Shadow DOM**
```html
<section class="txt">
    <label>
        Text
        <input type="text" value="something ...">
    </label>
</section>
```

**Properties**
| `txt` | Default | Comment |
|:--|:--:|:--|
|`[label]`  |  | Label text.  |
|`path`  |  | Location of reference value within reference object.  |
|`[value]`  | reference value | Only used as value, if reference value is not available. |
|`[disabled]`  | - | Disabled input.  |

### 4.12 Vector

The `vec` section provides a user interface for object/array structures. It offers for each member/element an individual input field using HTML `<input type="text">` elements in a grid-like structure. The `path` member in this section is an array holding multiple pathes, rather than a singular path.

Size of the input fields might be controlled by `width` member accepting CSS units. Input elements on the grid lines are wrapped onto a new line in case of overflow. They are always right aligned.

**Example**

```json
<ctrl-ing ref="vec" darkmode>
  [ {"sec":"hdr","text":"Vector"},
    {"sec":"vec","label":"Array",
                 "path":["$['arr'][0]","$['arr'][1]","$['arr'][2]","$['arr'][3]"]},
    {"sec":"vec","label":"Object (x,y,z)",
                 "path":["$['vec']['x']","$['vec']['y']","$['vec']['z']"],
                 "unit":"mm","width":"1em"}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">
  <pre id="outvec"></pre>
  <ctrl-ing ref="vec" darkmode callback="window['cbvec']">
    [ {"sec":"hdr","text":"Vector"},
      {"sec":"vec","label":"Array",
      "path":["$['arr'][0]","$['arr'][1]","$['arr'][2]","$['arr'][3]"]},
      {"sec":"vec","label":"Object (x,y,z)",
      "path":["$['vec']['x']","$['vec']['y']","$['vec']['z']"],
      "unit":"mm","width":"1em"}
    ]
  </ctrl-ing>
</div>
<script>
    const vec = {
        arr: ["string",3.14,true,null],
        vec: {x:1,y:2,z:3}
    }
    function cbvec() { document.getElementById('outvec').innerHTML = "const vec = "+Ctrling.stringify(vec); }
</script>

**HTML in Shadow DOM**
```html
<section class="vec">
    Array
    <span>
        <input type="text" value="string">
        <input type="text" value="3.14">
        <input type="text" value="true">
        <input type="text" value="null">
    </span>
</section>
<section class="vec">
    Object (x,y,z)
    <span>
        <input type="text" value="1" style="width:1em">
        <input type="text" value="2" style="width:1em">
        <input type="text" value="3" style="width:1em">
    </span>
    <span>mm</span>
</section>
```

**Properties**
| `vec` | Default | Comment |
|:--|:--:|:--|
|`label`  |  | Label text.  |
|`path`  | - | Location of reference value within reference object.  |
|`[width]`  | 24% | Input fields width in CSS units.  |
|`[unit]`  | - | Unit string.  |
|`[disabled]`  | - | Disabled input fields.  |
<br>

## 5. API

The `<ctrl-ing>` menu internals are hidden behind the shadow DOM. For offering programmatical access to these internals, an API is provided. Here is an example how to use it.

```html
<ctrl-ing id="ctrl"></ctrl-ing>
<script>
  const obj = {
    chk: true,
    num: 246,
    str: 'hello'
  }

  document.getElementById('ctrl').oninit((ctrl) => {                        // (1)
    ctrl.setAttr('ref', 'obj')                                              // (2)
        .setAttr('darkmode')
        .setAttr('autoupdate')
        .addSection({"sec":"hdr","text":"API-Test"})                        // (3)
        .addSection({"sec":"chk","label":"chk","path":"$['chok']"})         // (4)
        .addSection({"sec":"num","label":"num","path":"$['num']"})
        .addSection({"sec":"out","label":"obj=","path":"$"})
        .insertSection(3, {"sec":"txt","label":"str","path":"$['str']"})    // (5)
        .updateSection(1, {"sec":"chk","label":"chk","path":"$['chk']"})    // (6)
        .removeSection(2)                                                   // (7)
  })
</script>
```
<figcaption>Listing 4: Control menu generation and modification via API calls.</figcaption><br>

Comments to the line numbers:

1. Ensure to start with API calls when the `<ctrl-ing>` element is completely initialized.
2. The `setAttr` method is merely syntactic sugar for the native `setAttribute` method. It additionally supports chaining of method calls only.
3. `addSection` methods are used to sequentially build the control menu. They get a single object literal argument representing a section.
4. Note the intentional typo with the `path` value. That will be corrected in (6).
5. `insertSection` method inserts a new section before section with current index `3`, i.e. `{"sec":"out",...}`.
6. `updateSection` method corrects the typo in line (4) and updates section with current index `1`, i.e. `{"sec":"chk",...}`.
7. `removeSection` method removes the section with current index `2`, i.e. `{"sec":"num",...}`.

The API works properly at the earliest after the `<ctrl-ing>` element is completely initialized. In order to ensure this, we want to encapsulate the API method calls in a callback function oninit((ctrl) => { ... }). The callback function receives the `<ctrl-ing>` element object as a single argument.

| Method | Returns | Comment |
|:--|:--|:--|
|`addSection(sec)` | `this` | Append a new section object `sec` to the sections array.  |
|`findSectionIndex(fn)` | index | Locate the first section in the sections array, that fulfills the condition given by function `fn`. Returns the array index found or `-1` on failure. The condition function receives the current section during iteration as argument. |
|`insertSection(idx,sec)` | `this` | Insert a new section object `sec` to the sections array before the section at index `idx`.  |
|`oninit(fn)` | - | Invoking a callback function `fn`, while ensuring that the control menu object is completely initialized. The callback function receives the `<ctrl-ing>` element object as a single argument. |
|`removeAttr(attr)` | `this` | Remove `<ctrl-ing>`'s attribute `attr`.  |
|`removeSection(idx)` | `this` | Remove the section at index `idx`. |
|`setAttr(attr,value)` | `this` | Set `<ctrl-ing>`'s attribute `attr` to value `value`.  |
|`section(idx)` | section | Select a section from the sections array by index `idx`.  |
|`updateControlValues()` | `this` | When the `autoupdate` attribute is not set, this method might be used programmatically to update current values in the control elements instead. |
|`updateSection(idx,sec)` | `this` | If `sec` is present, current section at index `idx` will be replaced by `sec`, otherwise current section is assumed to be modified and stays in place. The shadow DOM is getting updated hereafter. |

<figcaption>Table 3: API Methods.</figcaption><br>

### 5.1 Self-Control

API methods may be used to modify the `<ctrl-ing>` menu itself. Here is an example, how to disable the section with index `2`.


```json
<ctrl-ing ref="objslf" callback="$['callbk']">
  [ {"sec":"hdr","text":"Self-Control"},
    {"sec":"chk","label":"Disable str","path":"$['disable']"},
    {"sec":"txt","label":"str","path":"$['str']"}
  ]
</ctrl-ing>
```

<div style="display:flex; position:relative; font-size:0.8em;">

```js
const objslf = {
    disable: false,
    str: "Hello",
    callbk({ctrl, obj, member, value, section, elem}) {
        if (member === 'disable') {
            ctrl.section(2).disabled = value;
            ctrl.updateSection(2);
        }
    }
}
```
  <ctrl-ing ref="objslf" callback="$['callbk']">
    [ {"sec":"hdr","text":"Self-Control"},
      {"sec":"chk","label":"Disable str","path":"$['disable']"},
      {"sec":"txt","label":"str","path":"$['str']"}
    ]
  </ctrl-ing>
</div>
<script>
    const objslf = {
        disable: false,
        str: "Hello",
        callbk({ctrl,obj, member, value, section, elem}) {
            if (member === 'disable') {
                ctrl.section(2).disabled = value;
                ctrl.updateSection(2);
            }
        }
    }
</script>

## 6. Other Controller Libraries

There are a couple of JavaScript controller libraries. Here are two overview pages [[2, 3]](#2). From the controller libraries listed there `dat.gui` is the most mature and most popular one. Many of the other libraries are kind of `dat.gui` clones providing an identical or very similar API. Some of them have very powerful features added like enhanced color pickers and/or charting capabilities. If you want a `dat.gui` like JavaScript solution, it is recommended to take one of these controller libraries.

`<ctr-ing>` has a different, more minimalistic approach with quickly prototyping a GUI menu by using markup/JSON alone. It deliberately uses plain standard HTML form elements for user interaction despite some of their known deficiencies. Hence the advantage of its light weight, which is considerable smaller (25 kB uncompressed) than the libraries above.


## 7. Conclusion

`<ctrl-ing>` is a lightweight HTML custom element. It helps to rapidly prototype a pleasing GUI without programming. Web-App parameters or JavaScript/JSON/DOM object values can be monitored or interactively modified.

A `<ctrl-ing>` menu can be built with few HTML/JSON text alone. Accessing its HTML element via JavaScript can be done via well known DOM methods. Accessing the hidden shadow DOM sections is not possible though. For enabling programmatical access to the internal menu structure, a small API is provided.

`<ctrl-ing>` does not depend on other libraries and is meant as a helper for webapplications of small to medium size.

<br>

## References 

<span id="1">[1] HTML input types,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#input_types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#input_types)</span>    
<span id="2">[2] List of JavaScript GUI Control libraries, [https://xosh.org/javascript-control-ui/](https://xosh.org/javascript-control-ui/)</span>    
<span id="3">[3] JavaScript GUI libraries,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[https://gist.github.com/SMUsamaShah/71d5ac6849cdc0bffff4c19329e9d0bb](https://gist.github.com/SMUsamaShah/71d5ac6849cdc0bffff4c19329e9d0bb)</span>    

<script src="https://cdn.jsdelivr.net/npm/ctrling/ctrling.js"></script>
