import { VideoMedia } from './VideoMedia.js'
import { VideoMetrics } from './VideoMetrics.js'

export interface Video {
  id: string
  caption: string
  createdAt: string
  userId: string
  media: VideoMedia
  metrics: VideoMetrics
}