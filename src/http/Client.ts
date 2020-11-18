import { VideoType } from './VideoType'

export interface VideoInfo {
  name: string,
  redirect?: string,
  id?: string,
  url?: string,
  type?: VideoType,
  rating?: string,
  hashId?: string,
}

export interface Client {
  getVideoInfo(search: string, type: VideoType, year?: string): Promise<VideoInfo>
}
