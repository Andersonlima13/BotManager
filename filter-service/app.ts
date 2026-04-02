import { FilterConsumer } from './services/FilterConsumer.js'
import { VideoFilter }    from './services/VideoFilter.js'

const filter = new VideoFilter({
  minLikes:    0,
  minViews:    100,
  minComments: 50,
  minShares:   0,

})

const consumer = new FilterConsumer(filter)

await consumer.connect()
await consumer.start()

