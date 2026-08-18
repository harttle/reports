import { access, cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const marpCli = path.join(root, 'node_modules', '@marp-team', 'marp-cli', 'marp-cli.js')

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

export async function findReports() {
  const entries = await readdir(root, { withFileTypes: true })
  const reports = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith('.') || ['node_modules', 'dist', 'scripts'].includes(entry.name)) continue
    if (await exists(path.join(root, entry.name, 'slides.md'))) reports.push(entry.name)
  }

  return reports.sort()
}

function titleFromMarkdown(markdown, fallback) {
  const firstSlide = markdown.split(/^---$/m)[0]
  const heading = firstSlide.match(/<h1[^>]*>([^<]+)<\/h1>/i) || firstSlide.match(/^#\s+(.+)$/m)
  if (!heading) return fallback
  return heading[1].replace(/<[^>]+>/g, '').trim()
}

const reports = await findReports()
await mkdir(dist, { recursive: true })

for (const name of reports) {
  const sourceDir = path.join(root, name)
  const outDir = path.join(dist, name)
  const theme = path.join(sourceDir, 'theme.css')
  await mkdir(outDir, { recursive: true })

  const args = [
    marpCli,
    path.join(sourceDir, 'slides.md'),
    '-o',
    path.join(outDir, 'index.html'),
    '--html',
    '--allow-local-files',
  ]
  if (await exists(theme)) args.push('--theme-set', theme)

  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)

  const assets = path.join(sourceDir, 'assets')
  if (await exists(assets)) {
    await cp(assets, path.join(outDir, 'assets'), { recursive: true })
  }
}

const items = []
for (const name of reports) {
  const markdown = await readFile(path.join(root, name, 'slides.md'), 'utf8')
  const title = titleFromMarkdown(markdown, name)
  items.push(`    <li><a href="./${name}/">${title}</a></li>`)
}

const index = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reports</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1.5rem; color: #222; }
    h1 { font-size: 1.75rem; }
    ul { padding-left: 1.2rem; line-height: 1.8; }
    a { color: #0284c7; }
  </style>
</head>
<body>
  <h1>Reports</h1>
  <ul>
${items.join('\n')}
  </ul>
</body>
</html>
`

await writeFile(path.join(dist, 'index.html'), index)
await writeFile(path.join(dist, '.nojekyll'), '')
console.log(`Built ${reports.length} report(s) into dist/`)
