import { createServer } from 'node:http';
import { KwaiApiService}  from './services/KwaiApiService.js'
import { VideoDiscoveryService } from './services/VideoDiscoveryService.js'
import { VideoMapper } from './services/VideoMapper.js'
import { RabbitMQPublisher } from './services/RabbitMQPublisher.js'
import { CookieService } from './services/CookieService.js';
import {
  fetchCyclesTotal,
  videosPublishedTotal,
  fetchDuration,
  cycleRunning,
  register
} from './metrics/Metrics.js'





const publisher = new RabbitMQPublisher()
await publisher.connect()

const cookieService = new CookieService()
const api = new KwaiApiService(cookieService)
const service = new VideoDiscoveryService(api, new VideoMapper())

let isRunning = false

async function fetchAndPublishVideos(): Promise<any[]> {
  if (isRunning) {
    return []
  }

  isRunning = true
  cycleRunning.set(1) // ← indica ciclo ativo
  const end = fetchDuration.startTimer() // ← inicia o timer
 
  try {
    const videos = await service.fetchVideos(5)
    await Promise.all(videos.map(video => publisher.publish(video)))

    videosPublishedTotal.inc(videos.length) // ← conta vídeos publicados
    fetchCyclesTotal.inc({ status: 'success' }) // ← ciclo bem-sucedido

    return videos

  } catch (err) {
    fetchCyclesTotal.inc({ status: 'error' }) // ← ciclo com erro
    return []
  } finally {
    isRunning = false
     cycleRunning.set(0) // ← ciclo encerrado
      end() // ← registra a duração no histograma
  }
}

// Executa imediatamente e depois a cada 15 segundos
await fetchAndPublishVideos()
setInterval(() => {
  void fetchAndPublishVideos()
}, 15_000)




const server = createServer(async (req : any, res : any) =>  {
   if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': register.contentType })
    res.end(await register.metrics())
    return
  }

  if (req.url === '/videos') {
    const videos = await fetchAndPublishVideos()

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(videos))
    return
  }
    }
)






server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
  console.log('Metrics available at http://localhost:3000/metrics')
})