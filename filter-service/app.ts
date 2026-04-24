import { FilterConsumer } from './services/FilterConsumer.js'
import { VideoFilter }    from './services/VideoFilter.js'

const filter = new VideoFilter({
  minLikes:    100000,
  minViews:    0,
  minComments: 0,
  minShares:   0,
  requireCaption: true, 
})

const consumer = new FilterConsumer(filter)

await consumer.connect()
await consumer.start()

