import { chromium } from 'playwright'
import fs from 'fs'

export class CookieService {
  private cookie: string | null = null
  private lastGenerated = 0
  private TTL = 1000 * 60 * 20

  async getCookie(): Promise<string> {
    const now = Date.now()

    if (this.cookie && (now - this.lastGenerated < this.TTL)) {
      return this.cookie
    }

    if (!fs.existsSync('kwai-session.json')) {
      throw new Error('Sessão não encontrada. Rode: npx ts-node scripts/login.ts')
    }

    console.log('Renovando cookie da sessão...')

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      storageState: 'kwai-session.json',
      // imita um navegador real
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
      locale: 'pt-BR'
    })

    const page = await context.newPage()

    // intercepta a própria requisição de feed para pegar cookies frescos
    // sem precisar esperar o site carregar completamente
    await page.goto('https://www.kwai.com', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)

    const cookies = await context.cookies('https://www.kwai.com')

    // salva a sessão atualizada — o Kwai pode ter renovado tokens
    await context.storageState({ path: 'kwai-session.json' })

    await browser.close()

    this.cookie = cookies.map(c => `${c.name}=${c.value}`).join('; ')
    this.lastGenerated = now

    return this.cookie
  }
}