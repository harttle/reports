import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { access, readdir } from 'node:fs/promises'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const marpCli = path.join(root, 'node_modules', '@marp-team', 'marp-cli', 'marp-cli.js')

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

const entries = await readdir(root, { withFileTypes: true })
const themeArgs = []

for (const entry of entries) {
  if (!entry.isDirectory()) continue
  const theme = path.join(root, entry.name, 'theme.css')
  if (await exists(theme)) themeArgs.push('--theme-set', theme)
}

const child = spawn(process.execPath, [marpCli, '-s', '.', '--html', ...themeArgs], {
  cwd: root,
  stdio: 'inherit',
})

child.on('exit', (code) => process.exit(code ?? 0))
