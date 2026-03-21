import { ApiUrl } from "../api/ApiUrl.js"

export class KwaiApiService {
  async getFeed(count: number , cursor?: string) {
    const response = await fetch(ApiUrl , {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        "Origin": "https://www.kwai.com",
        "Referer": "https://www.kwai.com/",
        "Cookie": "SEU_COOKIE"
      },
      body: JSON.stringify({
        count,
        pcursor: cursor, // 👈 chave aqui
        request_source: 1105,
        mobile: true
      })
    })

    const data = await response.json()
    return data.feeds
  }
}