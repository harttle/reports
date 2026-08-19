const { Marp } = require('@marp-team/marp-core')
const liquidDefinition = require('highlightjs-liquid').default

const LIQUID_TOKEN =
  /(\{%-?[\s\S]*?-?%\}|\{\{-?[\s\S]*?-?\}\}|<\/?[A-Za-z][\w:-]*(?:\s+[^>]*)?\/?>)/g

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function enhanceLiquidFilters(html) {
  return html.replace(
    /(<span class="hljs-operator">\|<\/span> )([a-z_][\w]*)/gi,
    '$1<span class="hljs-function">$2</span>'
  )
}

function highlightLiquidExpression(code, hljs) {
  const html = hljs.highlight(code, { language: 'liquid', ignoreIllegals: true }).value
  return enhanceLiquidFilters(html)
}

function highlightLiquidTemplate(code, hljs) {
  const parts = []
  let lastIndex = 0
  let match

  LIQUID_TOKEN.lastIndex = 0
  while ((match = LIQUID_TOKEN.exec(code)) !== null) {
    if (match.index > lastIndex) {
      parts.push(escapeHtml(code.slice(lastIndex, match.index)))
    }

    const token = match[1]
    if (token.startsWith('{%') || token.startsWith('{{')) {
      parts.push(highlightLiquidExpression(token, hljs))
    } else {
      parts.push(hljs.highlight(token, { language: 'xml', ignoreIllegals: true }).value)
    }

    lastIndex = LIQUID_TOKEN.lastIndex
  }

  if (lastIndex < code.length) {
    parts.push(escapeHtml(code.slice(lastIndex)))
  }

  return parts.join('')
}

module.exports = (opts) => {
  const marp = new Marp(opts)
  const { highlightjs } = marp

  highlightjs.registerLanguage('liquid', liquidDefinition)

  const defaultHighlighter = marp.highlighter.bind(marp)

  marp.highlighter = (code, lang, attrs) => {
    if (lang === 'liquid') {
      return highlightLiquidTemplate(code, highlightjs)
    }

    return defaultHighlighter(code, lang, attrs)
  }

  return marp
}
