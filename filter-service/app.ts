import { FilterConsumer } from './services/FilterConsumer.js'
import { VideoFilter }    from './services/VideoFilter.js'

const filter = new VideoFilter({
  minLikes:    50000,
  minViews:    0,
  minComments: 0,
  minShares:   0,
  requireCaption: true, 
  captionMustContain: ['filme', 'series','filmetop' , 'melhorserie', 'filmes', 'filme' ,'ftv'] 
})

const consumer = new FilterConsumer(filter)

await consumer.connect()
await consumer.start()

