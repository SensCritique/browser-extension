import { VideoType } from '../enum/VideoType'
import { VideoInfo } from '../http/Client'
import { Product } from '../type/Product'

export const mapVideoInfos = (result: Product, title: string, type: VideoType): VideoInfo => {
  const baseUrl = 'https://www.senscritique.com'

  return {
    name: title,
    redirect: `${baseUrl}${result.url}`,
    url: `${baseUrl}${result.url}`,
    id: result.type,
    type: type,
    rating: result.rating?.toString()
  }
}
