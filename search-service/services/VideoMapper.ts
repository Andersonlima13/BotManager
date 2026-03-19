import { Video } from "../model/Video.js"

export class VideoMapper {
   toDomain(raw: any): Video {
    return {
      id: raw.photo_id,
      caption: raw.caption,
      createdAt: raw.timestamp,
      userId: raw.user_id,
      
      media: {
        videoId: raw.photo_id,
        url: raw.main_mv_urls?.[0]?.url,
        duration: raw.main_mv_urls?.[0]?.duration,
        width: raw.main_mv_urls?.[0]?.width,
        height: raw.main_mv_urls?.[0]?.height,
        localPath: null
      },

      metrics: {
        videoId: raw.photo_id,
        likes: raw.like_count,
        views: raw.view_count,
        comments: raw.comment_count,
        shares: raw.share_count
      }


    }
  }
}