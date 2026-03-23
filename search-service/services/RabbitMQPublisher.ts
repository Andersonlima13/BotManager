import amqp from  "amqplib"
import { Video } from "../model/Video.js";

export class RabbitMQPublisher {
  private connection: any;
  private channel: any;
  private queue = 'videos';

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(this.queue, {
      durable: true
    });
  }

  
async publish(video: Video) {
  console.log('Publicando:', video.id);
  const message = Buffer.from(JSON.stringify(video));
  this.channel.sendToQueue(this.queue, message, { persistent: true });
}


}