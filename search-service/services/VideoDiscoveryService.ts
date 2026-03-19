import { KwaiApiService } from '/services/KwaiApiService'
import { Video } from '/interfaces/Video'
import { VideoMapper } from '/mappers/VideoMapper'


class VideoDiscoveryService {
  constructor(
    private api: KwaiApiService,
    private mapper: VideoMapper
  ) {}

  async fetchVideos(limit: number = 10): Promise<Video[]> {
    const raw = await this.api.getFeed(limit)
    return raw.map(this.mapper.toDomain)
  }
}