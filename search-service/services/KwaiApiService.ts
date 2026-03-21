import { ApiUrl } from "../api/ApiUrl.js"
import { CookieService } from "./CookieService.js"


export class KwaiApiService {
  constructor(private cookieService: CookieService) {}

  async getFeed(count: number) {
    const cookie = await this.cookieService.getCookie()
    const response = await fetch(ApiUrl , {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        "Origin": "https://www.kwai.com",
        "Referer": "https://www.kwai.com/",
        "Cookie": cookie
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