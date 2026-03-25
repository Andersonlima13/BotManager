import { RabbitMQConsumer } from './src/RabbitMQConsumer.js'
import { VideoDownloader } from  './src/VideoDownloader.js'

const consumer = new RabbitMQConsumer();
const downloader = new VideoDownloader('./downloads');

await consumer.connect();
console.log('Aguardando vídeos na fila...');

await consumer.consume(async (video) => {
  console.log(`Processando: ${video.id}`);
  await downloader.download(video);
});