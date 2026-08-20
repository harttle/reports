<!--
marp: true
theme: liquidjs
title: "LiquidJS: Building a template engine and growing an open source project"
_header: ''
paginate: false
-->

<style>@import 'styles.css';</style>

<div class="brand">
<img src="../assets/liquidjs-logo.png" alt="" />
<h1>LiquidJS</h1>
</div>

### Building a template engine and growing an open source project

Yang Jun

---

<!-- _class: speaker -->
<div class="speaker">
<div class="speaker-photo">
<img src="../assets/avatar.jpg" alt="" />
</div>
<div class="speaker-bio">

# About Me

My name is [Yang Jun](https://www.linkedin.com/in/harttle/), I have worked as engineer and architect at tech companies like Baidu, Microsoft, TikTok, AirWallex.

And I'm the creator and maintainer of the **LiquidJS** template engine.

</div>
</div>

---

# Today

1. **What is LiquidJS?** — what is template engine, what is Liquid, etc.
2. **Who's using LiquidJS?** — use cases and adoption
3. **How LiquidJS works?** — parse, render, the render flow
4. **Maintaining an open source library** — what it's like to maintain a project

---

<!-- paginate: true -->
<!-- _class: section-start -->
<div class="section-start">
<div class="section-start-image">
<img src="../assets/liquidjs-logo.png" />
<img src="../assets/liquid-sample.svg" />
</div>
<div class="section-start-content">

# Part 1

## What is LiquidJS?

</div>
</div>

---

# A brief history of Web rendering

The Web didn't start with React.

| Era             | Common approach                         | Mental model                                |
| --------------- | --------------------------------------- | ------------------------------------------- |
| **1990s**       | Static HTML → server-side scripting     | Documents → **dynamic pages**               |
| **2000s**       | PHP / Rails / Django + template engines | **Data-driven HTML** / MVC                  |
| **2010s** | Node.js + JS templates + AJAX / jQuery  | Data-driven HTML + **rich interaction**     |
| **Since then**  | React / Angular / Vue                   | Data-driven **interactive UI** / components |

LiquidJS is one of the JS template engines.

---

<!-- _class: template-engine template-engine-spaced -->
<style>
section.template-engine-spaced h1 {
  margin-bottom: 2rem;
}
</style>

# So what tempale engines actually do?

![width:1080px](../assets/template-engine-diagram.svg)

---

# Template engines vs. reactive UI frameworks

They solve different problems. React or Vue can power an application UI while template engine rendering is typicall one pass rendering.

| | Template engine | Reactive UI framework |
| --- | --- | --- |
| **Main job** | Turn a template and data into a document | Keep the DOM tree in sync with state |
| **Output** | HTML, email, text, or generated source code | An interactive user interface |
| **Best fit** | Content is rendered once for a given data | The interface changes as users interact with it |

---

# How are template engines different?

| Engine | Style | Logic | Best for |
|---|---|---|---|
| **EJS** | `<%= value %>` / `<% code %>` | Full JS | Straightforward server-rendered pages in Express |
| **Handlebars** | `{{value}}` / `{{#block}}` | Helpers only | Shared templates with explicit helpers |
| **Mustache** | `{{value}}` / `{{#section}}` | Logic-less | Portable templates across languages and runtimes |
| **LiquidJS** | `{{value}}` / `{% tag %}` | Tags + filters | Shopify- and Jekyll-compatible templates in JavaScript |
| **Nunjucks** | `{{value}}` / `{% tag %}` | Rich template logic | Content-heavy sites with inheritance and macros |

Different engines make different trade-offs, especially between flexibility and safety.

---

<!-- _class: language-overview -->
<!-- _style: --grammar-code-size: 14px; --grammar-code-line-height: 1.5 -->

# The Liquid Language

Liquid is a **template language** originally defined by Shopify, and implemented in Ruby.

- Adopted by Jekyll, the Ruby static site generator, and thus
- Github Pages as it's also based on Ruby ecosystem

The syntax is very straightforward and also flexible enough.

```liquid
<h2>{{ product.title }}</h2>

{% if product.available %}
  <p>{{ product.price | money }}</p>
  <button>Add to cart</button>
{% else %}
  <p>{{ product.title }} is sold out.</p>
{% endif %}
```

---

# LiquidJS

**LiquidJS = Liquid for JavaScript**

A JavaScript implementation of the Liquid language.

```js
import { Liquid } from 'liquidjs'

const engine = new Liquid()

await engine.parseAndRender(
  'Hello, {{ name | capitalize }}!',
  { name: 'liquid' }
)

// → Hello, Liquid!
```

---

<!-- _class: section-start -->
<div class="section-start">
<div class="section-start-image">
<img src="../assets/liquidjs-logo.png" style="width: 96px" />
<img src="../assets/users.png" style="width: 560px; max-width: 90%" />
</div>
<div class="section-start-content">

# Part 2

## Who's using LiquidJS?

</div>
</div>

---

# Adoption cases

| Use case | How teams use it |
| --- | --- |
| **Eleventy** | LiquidJS is the default template engine of this site generator |
| **Kibana** | Workflow YAML uses Liquid expressions to interpolate inputs and transform values with filters |
| **GitHub Docs** | Documentation content uses LiquidJS with custom tags |
| **C++ code generation** | Generate source files from templates—LiquidJS is HTML-agnostic |
| **OpenSense** | Compose and send personalized email content from Liquid templates |

For more details, check [liquidjs.com](https://liquidjs.com/) and [harttle/liquidjs/network/dependents](https://github.com/harttle/liquidjs/network/dependents)

---

# Adoption timeline

| Date | Milestone |
| --- | --- |
| **Jun 14, 2016** | First npm release: `shopify-liquid@1.0.0` |
| **Jun 23, 2016** | First GitHub issue: a request for `layout`, `include`, and `block` support |
| **Sep 12, 2016** | First community pull request: an async rendering experiment |
| **Feb 26, 2020** | First sponsor from Open Collective: Dropkiq |
| **Jan 26, 2026** | Reached 1M weekly npm downloads |
| **Aug 20, 2026** | 1.3M weekly download, 88K dependants, 93 contributors, 20 sponsors |

---
# What helped adoption?

**Keeping it reliable**

- Stay compatible with **Shopify Liquid** and **Jekyll** wherever possible
- Invest in **testing** — LiquidJS now has 1,640 test cases

**Making it developer-friendly**

- Built-in **TypeScript** types, clear [documentation](https://liquidjs.com) and interactive [demos](https://liquidjs.com/playground.html)
- Flexible **distribution options** — Node.js, browser bundle, and CLI

---

<!-- _class: section-start -->
<div class="section-start">
<div class="section-start-image"><img src="../assets/liquidjs-logo.png" /></div>
<div class="section-start-content">

# Part 3

## How LiquidJS works?

</div>
</div>

---

<!-- _class: template-engine -->

# Template + Data → HTML

![width:1080px](../assets/template-engine-diagram.svg)

---

# A detailed breakdown

Take the template and data context, create an output string, as HTML typically.

| Step | What happens |
| --- | --- |
| **1. Parse** | [`Liquid.parse()`](https://github.com/harttle/liquidjs/blob/master/src/liquid.ts) turns source text into `Template[]` objects: HTML, output, and tag nodes |
| **2. Walk the Template[]** | [`Render.renderTemplates()`](https://github.com/harttle/liquidjs/blob/master/src/render/render.ts) calls `render(ctx, emitter)` for each node in source order |
| **3. Evaluate** | Output the value of each node given context, running filters and tags at the same time |

---

<!-- _class: grid -->
# Parse: template → AST

<div class="grid-row">
<div class="grid-col border-right-dotted">

Source template:

```liquid
Hello, {{ name | capitalize }}!
```

Grammar:

```bnf
<output>   ::= "{{" <expression> "}}"
<expression> ::= <identifier> | <identifier> "|" <filter>
```

</div>

<div class="grid-col">

Result AST (Abstract Syntax Tree):

```text
Template
├── Text("Hello, ")
├── Output
│   └── Filter
│       └── Variable("name")
└── Text("!")
```

</div>

</div>

<div class="row">

The same parsed template can render repeatedly with different input data.

</div>

---

# Parser implementation: in theory

Any context-free grammar can be parsed by a state machine. The code highlighter in CodeMirror takes this approach. For example, the Liquid grammar:

```bnf
Interpolation { interpolationStart expression Filter* interpolationEnd }
Tag { tagStart (TagName expression? Filter*)? tagEnd }
forTag[@name=Tag] { tagStart tagName<"for"> VariableName kwx<"in"> expression Parameter* tagEnd }
tablerowTag[@name=Tag] { tagStart tagName<"tablerow"> VariableName kwx<"in"> expression Parameter* tagEnd }
cycleTag[@name=Tag] { tagStart tagName<"cycle"> (StringLiteral ":")? StringLiteral ("," StringLiteral)* tagEnd }
echoTag[@name=Tag] { tagStart tagName<"echo"> expression Filter* tagEnd }
assignTag[@name=Tag] { tagStart tagName<"assign"> expression Filter* tagEnd }
renderTag[@name=Tag] { tagStart tagName<"render"> expression RenderParameter* tagEnd }
liquidTag[@name=Tag] { tagStart tagName<"liquid"> liquidDirective* tagEnd }
Parameter { ParameterName { identifier } (":" expression)? }
endcommentTag[@name=EndTag] { endcommentTagStart tagName<"endcomment"> tagEnd }
endrawTag[@name=EndTag] { endrawTagStart tagName<"endraw"> tagEnd }
RenderParameter { "," VariableName ":" expression | (kwx<"with"> | kwx<"for">) expression (kwx<"as"> VariableName)? }
```

Liquid definition in CodeMirror: <https://code.haverbeke.berlin/codemirror/lang-liquid>

---

# Parser implementation: in practical

Real-world parsers are more complex and often tailored to a special purpose.

- In LiquidJS, the parser uses depth-first string traversal rather than a state machine.
- It uses recursion and backtracking thus it's not `O(n)` complexity.

| System | Approach | Source |
| --- | --- | --- |
| **LiquidJS** | DFS(tokenized Liquid) → AST for rendering templates | [Tokenizer](https://github.com/harttle/liquidjs/blob/master/src/parser/tokenizer.ts) · [Parser](https://github.com/harttle/liquidjs/blob/master/src/parser/parser.ts) |
| **Vue** | Vue tokenizer + Babel parser → AST for generating UI code | [parser.ts](https://github.com/vuejs/core/blob/main/packages/compiler-core/src/parser.ts) |
| **Babel / JSX** | DFS(tokenized JS/JSX) → AST for transforms and code generation | [babel-parser](https://github.com/babel/babel/blob/main/packages/babel-parser/src/parser/index.ts) |

But the result is the same: AST structure of the template string

---

# Render: AST + data → HTML

Basically, we use input data as context, traverse the AST, and output values along the way. In practice, rendering is more involved:

- Tags and filters, especially registered custom tags and filters
- Scope stack maintenance, somewhat like a call stack
- Other features: expression evaluation, streaming, async rendering, isolation, etc.

---

<!-- _class: grid -->
# Recap: the whole render flow

<div class="grid-row">
<div class="grid-col border-right-dotted">

Source template

```liquid
Hello, {{ name | capitalize }}!
```

</div>
<div class="grid-col border-right-dotted">

AST

```text
Template
├── Text("Hello, ")
├── Output
│   └── Filter
│       └── Variable("name")
└── Text("!")
```

Data

```json
{ "name": "liquidjs" }
```

</div>
<div class="grid-col">

Result HTML

```html
Hello, Liquidjs!
```

</div>
</div>

---

<!-- _class: section-start -->
<div class="section-start">
<div class="section-start-image"><img class="image-fill" src="../assets/contributors.png" /></div>
<div class="section-start-content">

# Part 4

## Maintaining an open source library

</div>
</div>

---

# Maintenance is a feedback loop

Every issue points to functionality somebody depends on.

| Signal | Ask | Action |
| --- | --- | --- |
| Something broken | Is this intended behavior? Can it be fixed without a breaking change? | Regression test / limitation note / bug fix / future plan |
| Something needed | Is it within the project's scope? Is it feasible? Would it be breaking? | Feature patch / won't-do decision / open discussion / future plan |
| Help needed | Is documentation missing? Can the user achieve it? Is the feature easy to use? | Documentation update / limitation note / code change |
| Vulnerability report | Is this intended behavior? Does the design need reconsidering? | Limitation note / fix and rollout / feature removal |

---

# Community shapes the library

When we build a useful project, document it well, and follow the feedback loop, the community gradually shapes it into something production-ready.

- The design and code structure are very different from the initial version.
- By August 2026, LiquidJS had [93 contributors](https://github.com/harttle/liquidjs/graphs/contributors).
- The repository has recorded [405 pull requests](https://github.com/harttle/liquidjs/pulls?q=is%3Apr+is%3Aclosed) and [417 issues](https://github.com/harttle/liquidjs/issues?q=is%3Aissue); it has [281 forks](https://github.com/harttle/liquidjs/forks).

The maintainer's job is to protect the project's purpose and principles.

---

# How AI changes maintenance

- **More reports.** AI makes large-scale analysis feasible for researchers.
- **More contributions.** AI assists patches, tests, and documentation; verify correctness and compatibility.

**The bottleneck shifts to maintainers:** understanding the reports, the changes, security model, and release impact.

---

<!-- _class: thank-you -->

<div class="thank-you">
<div class="thank-you-hero">
<img class="thank-you-logo" src="../assets/liquidjs-logo.png" alt="" />
<h1>Thank you</h1>
<p class="thank-you-questions">Questions?</p>
</div>
<div class="thank-you-panel">
<div class="thank-you-section">
<h2>Project</h2>
<a href="https://liquidjs.com">liquidjs.com</a>
<a href="https://github.com/harttle/liquidjs">github.com/harttle/liquidjs</a>
<a href="https://www.npmjs.com/package/liquidjs">npmjs.com/package/liquidjs</a>
</div>
<div class="thank-you-section">
<h2>Support</h2>
<a href="https://github.com/sponsors/harttle">github.com/sponsors/harttle</a>
<a href="https://opencollective.com/liquidjs">opencollective.com/liquidjs</a>
</div>
</div>
</div>

<!-- Q&A. Mention playground and docs for anyone who wants to try it. -->

---

![width:180px bg center](../assets/liquidjs-logo.png)
