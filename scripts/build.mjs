import { access, cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const marp = path.join(root, 'node_modules', '@marp-team', 'marp-cli', 'marp-cli.js')

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

await rm(dist, { recursive: true, force: true })
await mkdir(path.join(dist, 'assets'), { recursive: true })
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true })
await cp(path.join(root, 'index.html'), path.join(dist, 'index.html'))
await writeFile(path.join(dist, '.nojekyll'), '')

const entries = await readdir(root, { withFileTypes: true })
let count = 0

for (const entry of entries) {
  if (!entry.isDirectory()) continue
  if (entry.name.startsWith('.') || ['node_modules', 'dist', 'scripts', 'themes', 'assets'].includes(entry.name)) continue
  const slides = path.join(root, entry.name, 'slides.md')
  if (!(await exists(slides))) continue

  const outDir = path.join(dist, entry.name)
  await mkdir(outDir, { recursive: true })

  const result = spawnSync(process.execPath, [marp, slides, '-o', path.join(outDir, 'index.html')], {
    cwd: root,
    stdio: 'inherit',
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
  count++
}

console.log(`Built ${count} report(s) into dist/`)
