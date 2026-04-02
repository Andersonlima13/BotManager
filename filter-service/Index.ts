import { FilterConsumer } from './services/FilterConsumer.js'
import { VideoFilter }    from './services/VideoFilter.js'

const filter = new VideoFilter({
  minLikes:    1_000,
  minViews:    10_000,
  minComments: 50,
  minShares:   100,
    requireCaption: true,  // ← rejeita "..." e vazios
  captionMustContain: ['filme'] // ← exige palavras-chave na legenda

})

const consumer = new FilterConsumer(filter)

await consumer.connect()
await consumer.start()