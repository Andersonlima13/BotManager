import amqp from  "amqplib"

export class RabbitMQConsumer {
  private connection: any;
  private channel: any;
  private queue = 'videos';

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });

    // processa 1 mensagem por vez — não sobrecarrega o disco
    this.channel.prefetch(1);
  }

  async consume(handler: (data: any) => Promise<void>) {
    this.channel.consume(this.queue, async (msg: any) => {
      if (!msg) return;

      try {
        const video = JSON.parse(msg.content.toString());
        await handler(video);
        this.channel.ack(msg); // confirma só após sucesso
      } catch (err) {
        console.error('Erro ao processar mensagem:', err);
        this.channel.nack(msg, false, true); // devolve para a fila
      }
    });
  }
}