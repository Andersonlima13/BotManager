import { createServer } from 'node:http';
import { KwaiApiService}  from './services/KwaiApiService.js'
import { VideoDiscoveryService } from './services/VideoDiscoveryService.js'
import { VideoMapper } from './services/VideoMapper.js'
import { CookieService } from './services/CookieService.js';

const cookieService = new CookieService()
const api = new KwaiApiService(cookieService)
const service = new VideoDiscoveryService(api, new VideoMapper())


// transformar em uma funçao que executa a 1 hora



const server = createServer(async (req : any, res : any) =>  {
  try {
    if (req.url === '/videos') {
      const videos = await service.fetchVideos(50) // fetch de 50 videos
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(videos))
      return
    }
    res.writeHead(404)
    res.end()
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Erro interno do servidor' }))
  }
})



server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})