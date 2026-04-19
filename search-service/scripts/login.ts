// scripts/login.ts
import { chromium } from 'playwright'

const browser = await chromium.launch({ 
  headless: false  // abre janela real para você logar
})
const context = await browser.newContext()
const page = await context.newPage()

await page.goto('https://www.kwai.com')

console.log('👉 Faça login no navegador que abriu...')
console.log('👉 Depois pressione ENTER aqui no terminal')

await new Promise(resolve => process.stdin.once('data', resolve))

await context.storageState({ path: 'kwai-session.json' })
console.log('✅ Sessão salva em kwai-session.json')

await browser.close()
process.exit(0)