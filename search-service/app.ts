import { createServer } from 'node:http';
import {KwaiApiService}  from './services/KwaiApiService.js'
import { VideoDiscoveryService } from './services/VideoDiscoveryService.js'
import { VideoMapper } from './services/VideoMapper.js'

const api = new KwaiApiService()
const service = new VideoDiscoveryService(api, new VideoMapper())

const server = createServer(async (req : any, res : any) => {
  if (req.url === '/videos') {
    const videos = await service.fetchVideos(5)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(videos))
    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})