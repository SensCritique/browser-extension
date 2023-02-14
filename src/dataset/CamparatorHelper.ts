import { VideoType } from '../enum/VideoType'

const sensCritiqueProduct = {
  flattenedOriginalTitle: null,
  flattenedTitle: 'brooklyn ninenine',
  nbrSeasons: 8,
  originalTitle: null,
  rating: 7.5,
  title: 'Brooklyn Nine-Nine',
  type: VideoType.TVSHOW,
  url: '/serie/brooklyn_nine_nine/8855898',
  year: 2021,
  providers: ['Disney+'],
}

const platformProduct = {
  flattenedTitle: 'brooklyn ninenine',
  nbrSeasons: 8,
  title: 'Brooklyn Nine-Nine',
  type: VideoType.TVSHOW,
  year: 2021,
  providers: ['disney'],
}

// Match
export const matchByTitleAndYearDataset = [
  [
    {
      ...sensCritiqueProduct,
      flattenedTitle: 'brooklyn ninenine',
      title: 'Brooklyn Nine-Nine',
      type: VideoType.TVSHOW,
      year: 2021,
    },
    {
      ...platformProduct,
      flattenedTitle: 'brooklyn ninenine',
      title: 'Brooklyn Nine-Nine',
      type: VideoType.TVSHOW,
      year: 2021,
    },
    {
      name: 'Brooklyn Nine-Nine',
      redirect: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      id: VideoType.TVSHOW,
      url: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      type: VideoType.TVSHOW,
      rating: '7.5',
    },
  ],
  [
    {
      ...sensCritiqueProduct,
      flattenedTitle: 'brooklyn ninenine',
      title: 'Brooklyn Nine-Nine',
      type: VideoType.TVSHOW,
      year: 1991,
    },
    {
      ...platformProduct,
      flattenedTitle: 'brookl ninenine',
      title: 'Brookl Nine-Nine',
      type: VideoType.TVSHOW,
      year: 1991,
    },
    {
      name: 'Brooklyn Nine-Nine',
      redirect: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      id: VideoType.TVSHOW,
      url: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      type: VideoType.TVSHOW,
      rating: '7.5',
    },
  ],
  [
    {
      ...sensCritiqueProduct,
      flattenedTitle: 'brooklyn ninenine',
      title: 'Brooklyn Nine-Nine',
      type: VideoType.MOVIE,
      year: 1991,
    },
    {
      ...platformProduct,
      flattenedTitle: 'brookl ninenine',
      title: 'Brooklyn Nine-Nine',
      type: VideoType.MOVIE,
      year: 1991,
    },
    {
      name: 'Brooklyn Nine-Nine',
      redirect: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      id: VideoType.MOVIE,
      url: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      type: VideoType.MOVIE,
      rating: '7.5',
    },
  ],
]

export const matchByMovieAndYearDataset = [
  [
    {
      ...sensCritiqueProduct,
      type: VideoType.MOVIE,
      year: 2021,
    },
    {
      ...platformProduct,
      type: VideoType.MOVIE,
      year: 2021,
    },
    {
      name: 'Brooklyn Nine-Nine',
      redirect: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      id: VideoType.MOVIE,
      url: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      type: VideoType.MOVIE,
      rating: '7.5',
    },
  ],
]

export const matchYearAndSeasonIfTvShowDataset = [
  [
    {
      ...sensCritiqueProduct,
      nbrSeasons: 8,
      type: VideoType.TVSHOW,
      year: 2021,
    },
    {
      ...platformProduct,
      nbrSeasons: 8,
      type: VideoType.TVSHOW,
      year: 2021,
    },
    {
      name: 'Brooklyn Nine-Nine',
      redirect: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      id: VideoType.TVSHOW,
      url: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      type: VideoType.TVSHOW,
      rating: '7.5',
    },
  ],
]

export const matchByTitleAndSeasonIfTvShowDataset = [
  [
    {
      ...sensCritiqueProduct,
      flattenedTitle: 'Brooklyn NineNine',
      nbrSeasons: 8,
      title: 'Brooklyn NineNine',
      type: VideoType.TVSHOW,
      year: 2000,
    },
    {
      ...platformProduct,
      flattenedTitle: 'brooklyn ninenine',
      nbrSeasons: 8,
      title: 'Brooklyn Nine-Nine',
      type: VideoType.TVSHOW,
      year: 2010,
    },
    {
      name: 'Brooklyn NineNine',
      redirect: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      id: VideoType.TVSHOW,
      url: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
      type: VideoType.TVSHOW,
      rating: '7.5',
    },
  ],
]

// Not Match
export const notMatchByTypeOrProviderDataset = [
  [
    {
      ...sensCritiqueProduct,
      type: VideoType.TVSHOW,
      providers: ['netflix'],
    },
    {
      type: VideoType.TVSHOW,
      providers: ['disney'],
    },
  ],
  [
    {
      ...sensCritiqueProduct,
      type: VideoType.MOVIE,
      providers: ['Disney+'],
    },
    {
      ...platformProduct,
      type: VideoType.TVSHOW,
      providers: ['disney'],
    },
  ],
  [
    {
      ...sensCritiqueProduct,
      type: VideoType.MOVIE,
      providers: ['Amazon'],
    },
    {
      ...platformProduct,
      type: VideoType.TVSHOW,
      providers: ['disney'],
    },
  ],
]

export const notMatchByTitleAndYearIfMovieDataset = [
  [
    {
      ...sensCritiqueProduct,
      flattenedTitle: 'brook',
      title: 'Brook',
      type: VideoType.MOVIE,
      year: 2021,
    },
    {
      ...platformProduct,
      flattenedTitle: 'brooklyn ninenine',
      title: 'Brooklyn Nine-Nine',
      type: VideoType.MOVIE,
      year: 2000,
    },
  ],
  [
    {
      ...sensCritiqueProduct,
      flattenedTitle: 'brooklyn ninenine',
      title: 'Brooklyn NineNine',
      type: VideoType.MOVIE,
      year: 2021,
    },
    {
      ...platformProduct,
      flattenedTitle: 'brooklyn ninenine',
      title: 'Brooklyn Nine-Nine',
      type: VideoType.MOVIE,
      year: 1996,
    },
  ],
]

export const notMatchByTitleYearAndSeasonsIfTvShowDataset = [
  [
    {
      ...sensCritiqueProduct,
      flattenedTitle: 'brooklyn ninenine',
      nbrSeasons: 8,
      title: 'Brooklyn NineNine',
      type: VideoType.TVSHOW,
      year: 2000,
    },
    {
      ...platformProduct,
      flattenedTitle: 'brooklyn ninenine',
      nbrSeasons: 2,
      title: 'Brooklyn Nine-Nine',
      type: VideoType.TVSHOW,
      year: 2021,
    },
  ],
  [
    {
      ...sensCritiqueProduct,
      flattenedTitle: 'brook',
      nbrSeasons: 8,
      title: 'brook',
      type: VideoType.TVSHOW,
      year: 2021,
    },
    {
      ...platformProduct,
      flattenedTitle: 'brooklyn ninenine',
      nbrSeasons: 2,
      title: 'Brooklyn Nine-Nine',
      type: VideoType.TVSHOW,
      year: 2021,
    },
  ],
]
