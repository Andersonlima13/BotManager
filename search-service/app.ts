import { createServer } from 'node:http';
import { KwaiApiService}  from './services/KwaiApiService.js'
import { VideoDiscoveryService } from './services/VideoDiscoveryService.js'
import { VideoMapper } from './services/VideoMapper.js'

const api = new KwaiApiService()
const service = new VideoDiscoveryService(api, new VideoMapper())


// transformar em uma funçao que executa a cada 15 min
// talvez jogar um multi-thread pra fazer varios fetchs ao mesmo tempo


const server = createServer(async (req : any, res : any) =>  {
  try {
    if (req.url === '/videos') {
      const videos = await service.fetchVideos(500) // fetch de 15 videos
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