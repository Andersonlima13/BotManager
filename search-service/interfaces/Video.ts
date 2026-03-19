import { VideoMedia } from '/interfaces/VideoMedia'
import { VideoMetrics } from '/interfaces/VideoMetrics'

export interface Video {
  id: string
  caption: string
  createdAt: string
  userId: string
  media: VideoMedia
  metrics: VideoMetrics
}