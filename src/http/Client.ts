import { VideoType } from '../enum/VideoType'

export interface VideoInfo {
  name: string
  redirect?: string
  id?: string | number
  url?: string
  type?: VideoType
  rating?: string
  hash?: string
  platformId?: string | number
}

export interface Client {
  getVideoInfo(
    search: string,
    type: VideoType,
    year?: string,
    seasons?: string,
    provider?: string
  ): Promise<VideoInfo>
}
