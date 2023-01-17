import { VideoType } from '../http/VideoType'

export type Product = {
    title: string,
    flattenedTitle: string,
    originalTitle?: string,
    flattenedOriginalTitle?: string,
    year: number,
    type: VideoType,
    nbrSeasons: number,
    url?: string,
    rating?: number,
    distance?: number
}
