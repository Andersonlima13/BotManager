import amqp from 'amqplib'
import { Video } from '../model/Video.js'
import { VideoFilter } from './VideoFilter.js'

const INPUT_QUEUE    = 'videos'
const APPROVED_QUEUE = 'approved'

export class FilterConsumer {
  private connection: any
  private channel:    any

  constructor(private filter: VideoFilter) {}



  async connect() {
    this.connection = await amqp.connect(
      process.env.RABBITMQ_URL ?? 'amqp://localhost'
    )

    this.connection.on('error', (err: Error) => {
    console.error('Conexão RabbitMQ perdida:', err.message)
    process.exit(1)
    })


    this.connection.on('close', () => {
    console.error('Conexão RabbitMQ fechada — encerrando')
    process.exit(1)
    })


    this.channel = await this.connection.createChannel()

    await this.channel.assertQueue(INPUT_QUEUE,    { durable: true })
    await this.channel.assertQueue(APPROVED_QUEUE, { durable: true })

    this.channel.prefetch(10)
  }






  async start() {
    console.log(`Escutando fila "${INPUT_QUEUE}"...`)
    const channel = this.channel
    this.channel.consume(INPUT_QUEUE, async (msg: any) => {
    if (!msg) return

    try {
    const video: Video = JSON.parse(msg.content.toString())
    const result = this.filter.evaluate(video)

    if (result.approved) {
      console.log(`✓ aprovado  ${video.id} — likes:${video.metrics.likes} views:${video.metrics.views}`)

      this.channel.sendToQueue(
        APPROVED_QUEUE,
        Buffer.from(JSON.stringify(video)),
        { persistent: true }
      )
    } else {
      // log claro de por que foi rejeitado
      console.log(`✗ rejeitado ${video.id} — ${result.reasons.join(' | ')}`)
    }

    this.channel.ack(msg)

  } catch (err) {
    console.error('Erro ao processar:', err)
    this.channel.nack(msg, false, false)
  }
})


  }
}