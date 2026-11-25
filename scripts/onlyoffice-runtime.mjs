import { execFile } from 'node:child_process'
import { access, cp, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import sirv from 'sirv'

const run = promisify(execFile)
const commit = '7583158067fb0c9bdb312cbdc76d4f9fa32ef6c9'
const version = '9.3.0.133-24e34b4f401d86dfb31def637358e2fa'
const repo = 'https://github.com/fernfei/OnlyofficePersonal'
const cache = join(process.env.LOCALAPPDATA || tmpdir(), 'gca-office-cache')
const runtime = join(cache, commit + '-practice-2')

async function exists(path) {
  try { await access(path); return true } catch { return false }
}

async function checkout(staging, output) {
  const metadata = join(staging, 'repo.git')
  await run('git', ['init', '--quiet', '--separate-git-dir', metadata, output])
  const git = (...args) => run('git', ['-C', output, ...args])
  await git('remote', 'add', 'origin', repo + '.git')
  await git('config', 'core.sparseCheckout', 'true')
  await git('config', 'remote.origin.promisor', 'true')
  await git('config', 'remote.origin.partialclonefilter', 'blob:none')
  await writeFile(join(metadata, 'info/sparse-checkout'), [
    '/LICENSE.txt', '/' + version + '/vendor/', '!**/resources/help/*/', '**/resources/help/en/',
    '!**/web-apps/apps/pdfeditor/', '!**/web-apps/apps/visioeditor/',
    '!**/sdkjs/pdf/', '!**/sdkjs/visio/', '',
  ].join('\n'))
  await git('fetch', '--quiet', '--depth=1', '--filter=blob:none', 'origin', commit)
  await git('checkout', '--quiet', '--detach', commit)
  await rm(join(output, '.git'))
}

async function prepare() {
  if (await exists(join(runtime, 'SOURCE.txt'))) return runtime
  await mkdir(cache, { recursive: true })
  const staging = await mkdtemp(join(cache, 'prepare-'))
  const output = join(staging, 'assets')
  try {
    if (process.env.GCA_ONLYOFFICE_SOURCE_DIR) {
      const source = resolve(process.env.GCA_ONLYOFFICE_SOURCE_DIR)
      await cp(join(source, version, 'vendor'), join(output, version, 'vendor'), { recursive: true })
      await cp(join(source, 'LICENSE.txt'), join(output, 'LICENSE.txt'))
    } else {
      await checkout(staging, output)
    }
    const helper = join(output, version, 'vendor/sdkjs/common/wasm/x2t/x2t_helper.js')
    const original = await readFile(helper, 'utf8')
    // The offline converter posts its exported bytes back to the embedding page.
    const post = "t.postMessage(payload, '*')"
    const fetchFonts = 'X2TConverter.prototype.fetchFonts = async function () {'
    if (!original.includes(post) || !original.includes(fetchFonts)) throw new Error('Unexpected ONLYOFFICE conversion helper')
    // The font catalog loads asynchronously, independently of the WASM converter.
    const waitForCatalog = `
        const deadline = Date.now() + 60000;
        while (!Array.isArray(window.AscFonts?.g_font_infos) || !window.AscCommon?.g_font_loader?.fontFiles) {
            if (Date.now() >= deadline) throw new Error('ONLYOFFICE font catalog did not load');
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    `
    await writeFile(helper, original.replace(post, 't.postMessage(payload, window.location.origin)')
      .replace(fetchFonts, fetchFonts + waitForCatalog))
    const vendor = join(output, version, 'vendor')
    await writeFile(join(vendor, 'plugins.json'), JSON.stringify({ pluginsData: [] }))
    await writeFile(join(vendor, 'themes.json'), JSON.stringify({ themes: [] }))
    await writeFile(join(output, 'SOURCE.txt'), repo + '/tree/' + commit + '\nONLYOFFICE browser build. Modified x2t_helper.js to wait for the font catalog and restrict export messages to the hosting origin. See LICENSE.txt.\n')
    try { await rename(output, runtime) } catch (error) {
      if (!await exists(join(runtime, 'SOURCE.txt'))) throw error
    }
    return runtime
  } finally {
    if (dirname(resolve(staging)) === resolve(cache)) await rm(staging, { recursive: true, force: true })
  }
}

export function onlyOfficeRuntime() {
  let pending
  let outDir
  let slideThemes
  const themePath = version + '/vendor/sdkjs/slide/themes'
  const assets = () => pending ??= prepare().catch(error => { pending = null; throw error })
  return {
    name: 'academy-onlyoffice',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
      slideThemes = resolve(config.root, 'compiler/slide-themes')
    },
    configureServer(server) {
      let middleware
      server.middlewares.use('/compiler/runtime/' + themePath, sirv(slideThemes, { dev: true }))
      server.middlewares.use('/compiler/runtime', async (req, res, next) => {
        try {
          middleware ??= sirv(await assets(), { dev: true })
          middleware(req, res, next)
        } catch (error) { next(error) }
      })
    },
    async writeBundle() {
      const destination = join(outDir, 'compiler/runtime')
      await cp(await assets(), destination, { recursive: true })
      await cp(slideThemes, join(destination, themePath), { recursive: true })
    },
  }
}
