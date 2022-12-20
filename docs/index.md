---
"lang": "en-US",
"title": "ctrl-ing",
"subtitle": "An appealing GUI for controlling your Web-App, JSON or JavaScript Object Values",
"authors": ["Stefan Gössner<sup>1</sup>", "<a href='https://github.com/goessner/ctrlr'><svg height='16' width='16' viewBox='0 0 16 16'><path fill-rule='evenodd' fill='#1f3939' clip-rule='evenodd' d='M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z'></path></svg></a>"],
"adresses": ["<sup>1</sup>Dortmund University of Applied Sciences. Department of Mechanical Engineering"],
"date": "December 2022",
"description": "Interactively control your Web-App, JSON Values or JavaScript objects",
"tags": ["prototypical","GUI","controlling","JSON","javascript","object","JSONPath","HTML","custom element"]
---

## 1. Overview

`ctrl-ing` is a tiny HTML custom element (18.4 kB uncompressed) used to interactively control your Web-App parameters or JavaScript/JSON object values in a comfortable way with a pleasing GUI [[1]](#1).

<figure> 
   <img src="./lissajous.gif">
</figure>  
<figcaption>Fig. 1: Controlling an Animation.</figcaption><br>

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
<figcaption>Listing 1: Structure of custom HTML element <code>ctrl-ing</code>.</figcaption><br>

Beside implementing your web application, all you need to do for creating an appealing GUI, is inserting a `<ctrl-ing>` element to your HTML document (see Listing 1). Its content is compact JSON text, representing an array of section objects. Each section corresponds to a single line in the grid-like view structure of the `<ctrl-ing>` element's shadow DOM and is associated to either

* *input* controlling application parameters.
* *output* monitoring values.
* *structuring* elements.

All section objects are generating plain native HTML (form) elements in the background (shadow DOM). 

## 2. Getting Started

Let's start with a minimal example resulting in this controlling menu.

<figure> 
   <img src="./gettingstarted.gif">
</figure>  
<figcaption>Fig. 2: Minimal <code>&lt;ctrl-ing&gt;</code> Example.</figcaption><br>

Here is the HTML code.

```html
<!doctype html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Getting Started</title>
    <script src="./ctrling.js"></script>
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
* The `chk` section in the JSON content accesses the `toggle` member of the reference object `obj` via its `path` property using standard [JSONPath](https://ietf-wg-jsonpath.github.io/draft-ietf-jsonpath-base/draft-ietf-jsonpath-base.html#name-normalized-paths) syntax, where the root identifier `"$"` corresponds to the `ref` attribute above.
* The `out` section is monitoring the reference object in JSON text format.
* The `autoupdate` attribute of the `<ctrl-ing>` instance enables monitoring sections to be updated automatically. 
* `ctrling.js` is inserted via CDN to the page.

The generated encapsulated shadow DOM structure for this example is quite clear.

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



## 2. Implementation Aspects

The connection from JSON sections to application parameter values is established via their section object's `path` members, whose values obey the syntax of *Normalized Paths* according to [Internet standard *JSONPath*](https://ietf-wg-jsonpath.github.io/draft-ietf-jsonpath-base/draft-ietf-jsonpath-base.html#name-normalized-paths) (IETF). Herein the *root identifier* `$` will be replaced by the object variable name indicated by the `<ctrl-ing>` element's `ref` attribute.

Each JSON section creates a HTML `<section>` element at initialization time. Let's take a simple example

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; font-size:0.8em;background-color:#efefef; position:relative;">
    <pre id="out"></pre>
    <ctrl-ing ref="obj" callback="window['callbk']">
        [ {"sec":"hdr","text":"Toggle Example"},
          {"sec":"chk","label":"Toggle","path":"$['toggle']"}
        ]
    </ctrl-ing>
</div>
<script>
    const obj = {
        toggle: false
    }
    function callbk() { document.getElementById('out').innerHTML = "const obj = "+Ctrling.stringify(obj); }
</script>

which, by using 

```json
<ctrl-ing ref="obj">
    [ {"sec":"hdr","text":"Toggle Example"},
      {"sec":"chk","label":"Toggle","path":"$['toggle']"}
    ]
</ctrl-ing>
```

will create a GUI menu with a simple shadow DOM structure represented as

```html
<main>
  <section class="hdr">Toggle Example</section>
  <section class="chk">
    <label>Toggle<input type="checkbox"></label>
  </section>
</main>
```
Thanks to web component's encapsulation that markup is hidden and separated from other code on the page &mdash; avoiding code collisions [1].

So for each JSON section there is a HTML `<section>` element containing either plain visually representative or interactive form elements.


| Type | Class | HTML | Task |
|:--:|:--:|:--:|:--|
|`btn`  | Input | `<button>` | Perform an action by calling a parameterless function or object method.  |
|`chk`  | Input | `<input type="checkbox">` | Display a checkbox for setting Boolean parameter values. |
|`col`  | Input | `<input type="color">` | Display a color menu for setting RGB color parameter values. |
|`mtr`  | Input | Display a color menu for setting RGB color parameter values. |



## 3. Sections

### Button (`btn`)

The `btn` section is used to trigger an action of some kind, so it supports the invocation of a parameterless object method or a global function. You can specify a `label` and/or a `text` property. If one of them is missing, the other one is taken as the button text.

```json
<ctrl-ing ref="btn" darkmode>
  [ {"sec":"hdr","text":"Buttons"},
    {"sec":"btn","label":"Object method","text":"call","path":"$['method']"},
    {"sec":"btn","label":"Global function","text":"call","path":"window['fnc']"}
  ]
</ctrl-ing>
```

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;background-color:#efefef;">
<pre>
function fnc() { alert("'function' called."); }
var btn = {
  method() { alert("'method' called."); }
}
</pre>
<ctrl-ing ref="btn" darkmode>
  [ {"sec":"hdr","text":"Buttons"},
    {"sec":"btn","label":"Object method","text":"call","path":"$['method']"},
    {"sec":"btn","label":"Global function","text":"call","path":"window['fnc']"}
  ]
</ctrl-ing>
</div>
 <script>
function fnc() { alert("'function' called."); }
const btn = {
  method() { alert("'method' called."); }
}
</script>

**Properties**
| `btn` | Default | Comment |
|:--|:--:|:--|
|`label`  | - | Label text.  |
|`text`  | - | Button text.  |
|`path`  | - | Location of method within reference object or global function.  |
|`[disabled]`  | - | Disable button.  |

**HTML in Shadow DOM**
```html
<section class="btn">
  Object method
  <button type="button">call</button>
</section>
```

### Checkbox (`chk`)

The `chk` section is usually assigned to a boolean property of the object to be controlled.
```json
<ctrl-ing ref="chk" darkmode>
  [ {"sec":"hdr","text":"Checkbox"},
    {"sec":"chk","label":"Checkbox","path":"$['toggle']"}
  ]
</ctrl-ing>
```

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;">
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
    function cbchk() { document.getElementById('outchk').innerHTML = "chk = "+Ctrling.stringify(chk); }
</script>

**Properties**
| `chk` | Default | Comment |
|:--|:--:|:--|
|`label`  | - | Label text.  |
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

### Color (`col`)

The `col` section provides a user interface to assign a RGB color to an object property.
```json
<ctrl-ing ref="chk" darkmode>
  [ {"sec":"hdr","text":"Color"},
    {"sec":"col","label":"Color","path":"$['color']"}
  ]
</ctrl-ing>
```

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;background-color:#efefef;">
<pre id="outcol"></pre>
<ctrl-ing ref="col" darkmode callback="cbcol">
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
|`label`  | - | Label text.  |
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

### Header (`hdr`)
```json
<ctrl-ing darkmode>
  [ {"sec":"hdr","text":"Header Only"} ]
</ctrl-ing>
```

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;;background-color:#efefef;">
<ctrl-ing darkmode>
  [ {"sec":"hdr","text":"Header Only"} ]
</ctrl-ing>
</div>

**HTML in Shadow DOM**
```html
<section class="hdr">
  Header Only
</section>
```

We can use multiple headers for visually combining sections.


### Meter (`mtr`)

The `mtr` section provides a graphic view of a scalar object property value within a known range. It displays the value in its initial state and is not aware of value changes, unless either/or the
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

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;background-color:#efefef;">
<pre id="outmtr"></pre>
<ctrl-ing ref="mtr" darkmode callback="cbmtr">
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
    function cbmtr() { document.getElementById('outmtr').innerHTML = "var mtr = "+Ctrling.stringify(mtr); }
</script>

**Properties**
| `mtr` | Default | Comment |
|:--|:--:|:--|
|`label`  | - | Label text.  |
|`path`  | - | Location of scalar reference value within reference object.  |
|`[value]`  | [`min`&nbsp;\|&nbsp;0] | Used as value, if reference value is not available. |
|`[min]`  | 0 | Minimum value. |
|`[max]`  | 1 | Maximum value. |
|`[low]`  | `min` | Lower limit value (`low` &ge; `min`). Meter may change color when below. |
|`[high]`  | `max` | Upper limit value (`high` &le; `max`). Meter may change color when above. |
|`[optimum]`  | - | Optimal numeric value  (`min` &le; `optimum` &le; `max`); e.g., if it lies between `min` and `low`, that region is colored as the preferrable one. |
|`[unit]`  | - | Append unit string. |

**HTML in Shadow DOM**
```html
<section class="mtr">
  Volumn
  <span>
    <meter value="40" min="20" max="80" low="45" high="70" optimum="30"></meter>
    <output>40</output>
    <span>m&sup2;</span>
  </span>
</section>
```

### Number (`num`)

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

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;background-color:#efefef;">
<pre id="outnum"></pre>
<ctrl-ing ref="num" darkmode callback="cbnum">
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
            <span>[-]</span>
        </span>
    </label>
</section>
```

**Properties**
| `num` | Default | Comment |
|:--|:--:|:--|
|`label`  |  | Label text.  |
|`[min]`  | - | Minimum value. |
|`[max]`  | - | Maximum value. |
|`[step]`  | `1` | Step size. |
|`[fractions]`  | - | Number of decimal digits. |
|`[value]`  | reference value | Only used as value, if reference value is not available. |
|`path`  |  | Location of reference value within reference object.  |
|`[unit]`  | - | Unit symbol of value.  |
|`[disabled]`  | - | Disabled input.  |

### Output (`out`)

The `out` section displays an object property value in its initial state. It is not aware of value changes, unless either/or the
* `<ctrl-ing>`'s `autoupdate` property is set.
* API method `update()` is called.

The property value is mutated to JSON text for display. So only primitive object properties and getters are shown in case of structured property values.

```json
<ctrl-ing ref="mtr" darkmode>
  [ {"sec":"hdr","text":"Output"},
    {"sec":"out","label":"sub","path":"$['sub']"}
  ]
</ctrl-ing>
```

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;background-color:#efefef;">
<pre id="outout"></pre>
<ctrl-ing ref="out" darkmode callback="cbout">
  [ {"sec":"hdr","text":"Output"},
    {"sec":"out","label":"Point","path":"$['pnt']","unit":"[mm]"}
  ]
</ctrl-ing>
</div>
 <script>
    const out = {
        pnt: {x:5, y:7}
    }
    function cbout() { document.getElementById('outout').innerHTML = "var out = "+Ctrling.stringify(out); }
</script>

**Properties**
| `out` | Default | Comment |
|:--|:--:|:--|
|`label`  | - | Label text.  |
|`path`  | - | Location of reference value. |
|`[value]`  | reference value | Only used as value, if reference value is not available. |
|`[unit]`  | - | Append unit string. |

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

### Selection (`sel`)

The `sel` section provides a drop down menu of options. It uses the HTML `<select>` element. Options can be represented either by object members or array elements.
Then object member names are displayed in the drop down menu and member values are inserted as property values. Array elements (strings or numbers) are used as drop down items as well as target object property values.

Please note that the HTML `<selects>`'s `multiple` attribute and `<optgroup>` elements are not supported.

```json
<ctrl-ing ref="sel" darkmode>
  [ {"sec":"hdr","text":"Select"},
    {"sec":"sel","label":"Linestyle","path":"$['lineStyle']",
     "options":["solid","dashed","dotted"]},
    {"sec":"sel","label":"Thickness","path":"$['thickness']",
     "options":{"thin":1,"medium":2,"thick":3}}
  ]
</ctrl-ing>
```

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;background-color:#efefef;">
<pre id="outsel"></pre>
<ctrl-ing ref="sel" darkmode callback="cbsel">
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
    function cbsel() { document.getElementById('outsel').innerHTML = "var sel = "+Ctrling.stringify(sel); }
</script>

**Properties**
| `sel` | Default | Comment |
|:--|:--:|:--|
|`label`  | - | Label text.  |
|`[options]`  | - | Object as member name/value pairs or array elements. |
|`[value]`  | reference value | Only used as value, if reference value is not available. |
|`path`  | - | Location of reference value. |
|`[disabled]`  | - | Disabled selection.  |

### Separator (`sep`)

The `sep` section displays a separation line using the HTML `<hr>` element. It has no properties.

```json
<ctrl-ing darkmode>
  [ {"sec":"hdr","text":"Separator"},
    {"sec":"sep"}
  ]
</ctrl-ing>
```

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;background-color:#efefef;">
<pre id="outsep"></pre>
<ctrl-ing darkmode>
  [ {"sec":"hdr","text":"Output"},
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

### Text (`txt`)

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

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;background-color:#efefef;">
<pre id="outtxt"></pre>
<ctrl-ing ref="txt" darkmode callback="cbtxt">
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
|`label`  |  | Label text.  |
|`path`  |  | Location of reference value within reference object.  |
|`[value]`  | reference value | Only used as value, if reference value is not available. |
|`[disabled]`  | - | Disabled input.  |

### Vector (`vec`)

The `vec` section provides a user interface for object/array structures. It offers for each member/element an individual input field using HTML `<input type="text">` elements in grid-like structure. The `path` member in this section is an array holding multiple pathes, rather than a singular path.

Size of the input fields might be controlled by `width` member accepting CSS units. Input elements on the grid lines are wrapped onto a new line in case of overflow. They are always right aligned.

**Example**

```json
<ctrl-ing ref="vec" darkmode>
  [ {"sec":"hdr","text":"Vector"},
    {"sec":"vec","label":"Array",
     "path":["$['arr'][0]","$['arr'][1]","$['arr'][2]","$['arr'][3]"]},
    {"sec":"vec","label":"Object (x,y,z)",
     "path":["$['vec']['x']","$['vec']['y']","$['vec']['z']"],
     "unit":"[mm]"}
  ]
</ctrl-ing>
```

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;font-size:0.8em;background-color:#efefef;">
<pre id="outvec"></pre>
<ctrl-ing ref="vec" darkmode callback="cbvec">
  [ {"sec":"hdr","text":"Vector"},
    {"sec":"vec","label":"Array",
     "path":["$['arr'][0]","$['arr'][1]","$['arr'][2]","$['arr'][3]"]},
    {"sec":"vec","label":"Object (x,y,z)",
     "path":["$['vec']['x']","$['vec']['y']","$['vec']['z']"],
     "unit":"[mm]"}
  ]
</ctrl-ing>
</div>
<script>
    const vec = {
        arr: ["string",3.14,true,null,[1,2]],
        vec: {x:1,y:2,z:3}
    }
    function cbvec() { document.getElementById('outvec').innerHTML = "var vec = "+Ctrling.stringify(vec); }
</script>

**HTML in Shadow DOM**
```html
<section class="vec">
  Vector
  <span>
    <input type="text" value="1">
    <input type="text" value="2">
    <input type="text" value="3">
  </span>
  <span>[mm]</span>
</section>
```

**Properties**
| `vec` | Default | Comment |
|:--|:--:|:--|
|`label`  |  | Label text.  |
|`path`  | - | Location of reference value within reference object.  |
|`[width]`  | - | Input fields width in CSS units.  |
|`[unit]`  | - | Unit string.  |
|`[disabled]`  | - | Disabled input fields.  |



## 2. How to Use ?

```json
<ctrl-ing ref="obj1" darkmode>
  [ {"sec":"hdr","text":"Demo-1"},
    {"sec":"num","label":"Numbers","path":"$['numbers'][0]","unit":"[-]"},
    {"sec":"chk","label":"Toggle","path":"$['toggle']"}
  ]
</ctrl-ing>
```
<figcaption>Listing 1: Constructor &ndash; cartesian coordinates with origin centered.</figcaption><br>

<div style="display: flex; flex-wrap: nowrap; justify-content: space-between; position:relative;">
    <pre id="out1"></pre>
    <ctrl-ing ref="obj1" darkmode callback="callbk1">
        [ {"sec":"hdr","text":"Demo-1"},
            {"sec":"num","label":"Numbers[0]","path":"$['numbers'][0]","unit":"[-]"},
            {"sec":"chk","label":"Toggle","path":"$['toggle']"}
        ]
    </ctrl-ing>
</div>

View coordinates provided by events can be controlled in the constructor by an additional view argument `{x=0,y=0,scl=1,cartesian=false}` beside the canvas `RenderingContext2D` object.

* `x,y` &hellip; view's origin location.
* `scl` &hellip;  view's scaling.
* `cartesian` &hellip; cartesian coordinate system (y-axis up).


## 3. Handling Events

Each `canvasInteractor` instance handles DOM pointer events and some custom events.

<figcaption> Table 1: Supported Events </figcaption>

| Event | Comment |
|:--|:--|
|`pointermove`  |Pointer moved.  |
|`pointerdown`  |Pointer device button pressed. |
|`pointerup`  |Pointer device button released. |
|`pointerenter`  |Pointer enters canvas. |
|`pointerleave`  |Pointer leaves canvas. |
|`pointercancel`  |DOM event forwarded. |
|`click`  | Pointer device button pressed and released at the same location. |
|`wheel`  |Pointer device wheel event. |
|`tick`  |Throttled timer event. At most every 60 milliseconds. |
|`pan`  |Pan by pointer device. Occuring only with (left) button pressed. |
|`drag`  |Drag by pointer device. Occuring only with (left) button pressed and something was signalled as 'hit'. |

<br>

Instead of registering events via well known `addEventListener`, an application registers events to a `canvasInteractor` instance using thats `on` method.

```js
// ...
interactor.on('pointermove', (e) => { /* do stuff */ })
          .on('tick', (e) => { /* do other stuff */ })
          .on('pan',  (e) => { /* do yet other stuff */ })
          .startTimer();
```
<figcaption>Listing 2: Registering events and starting tick timer.</figcaption><br>

The `pointermove` event in combination with (left) pointer device button pressed also notifies the application of a `drag` or `pan` event, whether an underlying element is `hit` or not. See the example how to control that behavior.

Callback functions registered via `on` recieve an extended event object `e`.

<figcaption> Table 2: Event object properties </figcaption>

| Property | Type | Comment |
|:--|:--:|:--|
|`type` | `string`  | Event type.  |
|`x`, `y` | `number` | Canvas coordinates with respect to upper left or lower left (`cartesian`) corner. |
|`dx`, `dy` | `number` | Pointer location displacement from previous position. |
|`xusr`, `yusr` | `number` | Coordinates with respect to user defined view origin and scaling. |
|`dxusr`, `dyusr` | `number` | Pointer location displacement with respect to user defined view scaling. |
|`btn`  | `number` |  Pointer device button identifier on button press<br> (left: `1`, right: `2`, middle: `4`). |
|`dbtn`  | `number` | Pointer device button difference on button release<br> (left: `-1`, right: `-2`, middle: `-4`). |
|`eps`  | `number` | Some pixel tolerance for selecting/hitting<br> (default = `5`). |
|`inside` | `boolean` | Is pointer currently inside canvas. |
|`delta` | `number` | Wheel delta. |
|`hit` | `boolean` | Needs to be set by application within `pointermove` event. Can be treated then within `tick` event. |

<br>

## 4. Example

The example shows how to use `canvasInteractor`.
Rectangles can be `drag`ged, whereas the origin symbol can not, which induces the `pan` event. `zoom`ing is done by the pointer device' wheel operation.

<canvas id="c" width="601" height="301" style="border:1px solid black;background-color:snow"></canvas><br>
<span id="fps">fps: -</span> <b>|</b> 
<label><input id="cartesian" type="checkbox" onchange="interactor.view.cartesian = !interactor.view.cartesian"> cartesian</label> <b>|</b>
<span id="zoom">zoom-scale: 1</span> <b>|</b> 
<span id="coords">pos: ./.</span> <b>|</b> <span id="state">state: -</span> <b>|</b>


<br>

### Example Code

```html
<!doctype html>
<html>
<head>
    <title>canvasInteractor example</title>
</head>

<body>
    <h1>canvasInteractor example</h1>
    <canvas id="c" width="601" height="301" 
            style="border:1px solid black;background-color:snow"></canvas>

    <script src="https://cdn.jsdelivr.net/gh/goessner/canvasinteractor/canvasInteractor.js"></script>
    <script>
    const ctx = document.getElementById('c').getContext('2d');
    const interactor = canvasInteractor.create(ctx, {x:200,
                                                     y:100,
                                                     scl:1,
                                                     cartesian:true});
    const rec1 = {x:50,y:50,b:80,h:60,fs:'orange',lw:4};
    const rec2 = {x:150,y:50,b:100,h:40,fs:'cyan',lw:4};

    function render() {
        // ...
    }

    function hitRec(x,y,rec) {
        return (x > rec.x && x < rec.x + rec.b && y > rec.y && y < rec.y + rec.h);
    }
    interactor
        .on('tick', (e) => {
            render();
        })
        .on('pointermove', (e) => {
            rec1.sel = hitRec(e.xusr,e.yusr,rec1) ? true : false; 
            rec2.sel = hitRec(e.xusr,e.yusr,rec2) ? true : false;
            e.hit = rec1.sel || rec2.sel;
        })
        .on('wheel',  (e) => {   // zooming about pointer location ...
            interactor.view.x = e.x + e.dscl*(interactor.view.x - e.x);
            interactor.view.y = e.y + e.dscl*(interactor.view.y - e.y);
            interactor.view.scl *= e.dscl;
        })
        .on('pan',  (e) => { 
            interactor.view.x += e.dx; 
            interactor.view.y += e.dy;
        })
        .on('drag', (e) => {
            if (rec1.sel) { rec1.x += e.dxusr; rec1.y += e.dyusr; }
            if (rec2.sel) { rec2.x += e.dxusr; rec2.y += e.dyusr; }
        })
        .startTimer();
    </script>
</body>
</html>
```
<figcaption>Listing 3: canvasInteractor example.</figcaption><br>


## 5. Conclusion

`canvasInteractor` is a tiny JavaScript library enhancing and extending HTML canvas' event handling for performant animation and geometrical interaction.

A global event loop (singleton) based on `requestAnimationFrame` provides assistance with event throttling via its custom `tick` event. Cartesian coordinates preferred in scientific and engineering applications are supported. *Pan*, *drag* and *zoom* based on user defined origins can be done.

<br>

## References 

<span id="1">[1] Canvas API, [https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)</span>    
<span id="2">[2] 
D. Corbacho, Debouncing and Throttling Explained Through Examples    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[https://css-tricks.com/debouncing-throttling-explained-examples/](https://css-tricks.com/debouncing-throttling-explained-examples/)</span>    
 <span id="3">[3] S. Goessner, <code>canvas-area</code>, 
 [https://github.com/goessner/canvas-area](https://github.com/goessner/canvas-area)</span>    
 <span id="4">[4] S. Goessner, Make your HTML canvas Interactive, 
 [Researchgate, DOI: 10.13140/RG.2.2.31978.39367](https://www.researchgate.net/publication/360034117_Make_your_HTML_canvas_Interactive)</span>

<script src="https://cdn.jsdelivr.net/npm/ctrling/ctrling.js"></script>
  
