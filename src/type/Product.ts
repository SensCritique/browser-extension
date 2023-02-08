import { VideoType } from '../enum/VideoType'

export type Product = {
    title: string | null,
    flattenedTitle: string | null,
    originalTitle?: string | null,
    flattenedOriginalTitle?: string | null,
    year: number,
    type: VideoType,
    nbrSeasons: number,
    url?: string,
    rating?: number,
    distance?: number,
    providers?: string[]
}
