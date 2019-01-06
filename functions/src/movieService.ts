const moduleName = "movieService"

import * as movieModel from "./firestoreModels/movieModel"
import * as lineService from "./lineService"

export const showMoviesByReleaseDate = async function(replyToken: string): Promise<void>
{
    const movies = await movieModel.getMoviesByReleaseDate()
    const lineMessage = lineService.toMoviesCarousel(movies)
    lineService.replyMessage(replyToken, lineMessage)
}
