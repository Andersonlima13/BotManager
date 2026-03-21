import { KwaiApiService } from '../services/KwaiApiService.js'
import { Video } from '../model/Video.js'
import { VideoMapper } from '../services/VideoMapper.js'


export class VideoDiscoveryService {
  constructor(
    private api: KwaiApiService,
    private mapper: VideoMapper
  ) {}

  async fetchVideos(limit: number = 500): Promise<Video[]> {
    const raw = await this.api.getFeed(limit)
    return raw.map(this.mapper.toDomain)
  }
}