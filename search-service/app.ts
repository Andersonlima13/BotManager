import { createServer } from 'node:http';
import { KwaiApiService}  from './services/KwaiApiService.js'
import { VideoDiscoveryService } from './services/VideoDiscoveryService.js'
import { VideoMapper } from './services/VideoMapper.js'
import { RabbitMQPublisher } from './services/RabbitMQPublisher.js'
import { CookieService } from './services/CookieService.js';



const publisher = new RabbitMQPublisher()
await publisher.connect()
const cookieService = new CookieService()
const api = new KwaiApiService(cookieService)
const service = new VideoDiscoveryService(api, new VideoMapper())


// transformar em uma funçao que executa a cada 15 min
// talvez jogar um multi-thread pra fazer varios fetchs ao mesmo tempo


const server = createServer(async (req : any, res : any) =>  {
  if (req.url === '/videos') {
  const videos = await service.fetchVideos(5);

  console.log('VIDEOS:', videos.length);

  await Promise.all(
    videos.map(video => publisher.publish(video))
  );

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: `${videos.length} vídeos enviados para fila`
  }));

  return;
}})






server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})