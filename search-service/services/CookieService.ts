import { chromium } from 'playwright'

export class CookieService {
  private cookie: string | null = null
  private lastGenerated = 0
  private TTL = 1000 * 60 * 20 // 20 minutos

  async getCookie(): Promise<string> {
    const now = Date.now()

    // usa cache se ainda for válido
    if (this.cookie && (now - this.lastGenerated < this.TTL)) {
      return this.cookie
    }

    console.log('🔄 Gerando novo cookie do Kwai...')

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('https://www.kwai.com', {
      waitUntil: 'domcontentloaded'
    })

    // espera cookies serem setados
    await page.waitForTimeout(3000)

    const cookies = await context.cookies()

    await browser.close()

    const cookieString = cookies
      .map(c => `${c.name}=${c.value}`)
      .join('; ')

    this.cookie = cookieString
    this.lastGenerated = now

    return cookieString
  }
}