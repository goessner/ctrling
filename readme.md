[![](https://data.jsdelivr.com/v1/package/npm/ctrling/badge)](https://www.jsdelivr.com/package/npm/ctrling)
# `ctrling`

## What is it ... ?

`ctrl-ing` is a tiny HTML custom element used to interactively control your Web-App parameters or JavaScript/JSON object values in a comfortable way with the following characteristics:

* tiny footprint `18.7/11.3 kB` un/compressed.
* dependency free.
* easy prototypical generation with low effort.
* no programming required.
* getting a pleasing GUI.

<figure style="text-align:center"> 
   <img src="./docs/lissajous.gif">
</figure>  
<figcaption style="font-size:0.95em;text-align:center">Fig. 1: Controlling an Animation.</figcaption><br><br>

The interactive menu for this example was created via:

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
<figcaption>Listing 1: Structure of custom HTML element <code>ctrl-ing</code>.</figcaption><br><br>

Beside implementing your web application, all you need to do for prototyping an appealing GUI, is inserting a `<ctrl-ing>` element to your HTML document (see Listing 1). Its content is compact JSON text, representing an array of section objects. Each section corresponds to a single line in the grid-like view structure of the `<ctrl-ing>` menu and is associated to either

* *input* controlling application parameters.
* *output* monitoring values.
* *structuring* elements.

All section objects are generating plain native HTML (form) elements in the background (shadow DOM). That markup is hidden and separated from other code on the page &mdash; thus avoiding code collisions.

## 2. Getting Started

Let's start with a minimal example resulting in this controlling menu.

<figure style="text-align:center"> 
   <img src="./docs/gettingstarted.gif">
</figure>  
<figcaption style="font-size:0.95em;text-align:center">Fig. 2: Minimal <code>&lt;ctrl-ing&gt;</code> Example.</figcaption><br><br>

Here is the complete HTML code.

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
<figcaption>Listing 2: Minimalistic example using <code>&lt;ctrl-ing&gt;</code> element.</figcaption><br><br>

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

Following attributes are supported:

| Attribute | Default | Meaning |
|:--:|:--:|:--|
|`ref`  | `window` | Referencing a global object variable of the name indicated by this attribute.  |
|`width`  | `200px` | Width of the GUI menu.  |
|`top`  | `0` | Distance relative to top edge of parent element. |
|`right`  | `0` | Distance relative to right edge of parent element. |
|`darkmode`  | - | Display GUI menu in dark mode. |
|`autoupdate`  | - | Automatically update monitoring and input sections. |
|`tickspersecond`  | `4` | How often to update sections per second. |
|`callback`  | - | If present, will be called with each user value change by input sections. The attribute value must obey the [JSONPath](https://ietf-wg-jsonpath.github.io/draft-ietf-jsonpath-base/draft-ietf-jsonpath-base.html#name-normalized-paths) syntax rules and might be a global function or a static object method. |

The `callback` function or method will be handed over an argument object with the structure

```js
args = {
    obj,     // parent object holding the member, whose value is to be set.
    member,  // the member name, whose value is to be set.
    value,   // the new member value.
    section, // the current section object.
    elem     // the current html <section> element.
}
```
Please note, that during a single initial call of the `callback` function an empty `args` object will be passed as an argument.

## 4. JSON Sections Overview

| Type | HTML (shadow) | Task |
|:--:|:--|:--|
|`btn`  | `<button>` | Perform an action by calling a parameterless function or object method.  |
|`chk`  | `<input type="checkbox">` | Display a checkbox for entering Boolean parameter values. |
|`col`  | `<input type="color">` | Display a color menu for setting an RGB color parameter value. |
|`hdr`  | text string | Header for menu structuring. |
|`mtr`  | `<meter>` | Graphically monitoring a numerical value in a range. |
|`num`  | `<input type="number">` | Display an input field for entering a numerical parameter value. |
|`out`  | `<output>` | Monitoring any data. |
|`rng`  | `<input type="range">` | Display a slider element for setting a numerical parameter value. |
|`sel`  | `<select>` | Provides a drop down menu of options. |
|`sep`  | `<hr>` | Display a separating line for menu structuring. |
|`txt`  | `<input type="text">` | Display an input field for entering a textual parameter value. |
|`vec`  | multiple<br>`<input type="text">` | Display a set of input fields for entering multiple related data values. |

## CDN

Use a local instance or one of the following CDN links for `ctrling.js`.
* `https://cdn.jsdelivr.net/npm/ctrling/ctrling.js`
* `https://cdn.jsdelivr.net/npm/ctrling/ctrling.min.js`

## FAQ

* __Can I control a single global variable ?__
  * In short ... yes.
  * You only need to declare it using `var`, since `let` and `const` variables aren't accessible using `globalThis` or `window` object, which is used here for global variables. No restriction for objects or arrays though.
  * See [`ctrl-variable.html`](./examples/ctrl-variable.html) for an example.
* __Can I control an array ?__
  * Yes, see [`ctrl-array.html`](./examples/ctrl-array.html) for an example.
* __Can I convert values while setting ?__
  * Yes.
  * Either use getter/setter pair for get/set value ...
  * ... or use `callback` function for setting value only.
  * See [`ctrl-todeg.html`](./examples/ctrl-todeg.html) for an example.
* __Can you implement feature X and possibly feature Y ?__
  * `ctrling` serves my personal needs very well as it is.
  * So ... no, I won't.
  * Please go ahead and implement it by yourself.
  * If you think, your enhancement is of common interest, you are very welcome, to send me a pull request.

## Changelog

###  [0.8.1] on December 20, 2022
* First published.

## License

`ctrling` is licensed under the [MIT License](http://opensource.org/licenses/MIT)

 © [Stefan Gössner](https://github.com/goessner)
