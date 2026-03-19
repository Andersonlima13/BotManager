import { ApiUrl } from "/api/ApiUrl"

export class KwaiApiService {
  async getFeed(count: number) {
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
        request_source: 1105,
        mobile: true
      })
    })

    const data = await response.json()
    return data.feeds
  }
}