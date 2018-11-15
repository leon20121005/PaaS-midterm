const moduleName = "moviesServices"

import * as sheetServices from "./sheetServices"
import { movieColumn } from "./sheetColumnConfig"
import { Movie } from "./model"

export const getMoviesByReleaseDate = async function(): Promise<Movie[]>
{
    const authorization = await sheetServices.authorize()
    const query = `select ${movieColumn.id}, ` +
        `${movieColumn.name}, ` +
        `${movieColumn.releaseDate}, ` +
        `${movieColumn.director}, ` +
        `${movieColumn.category}, ` +
        `${movieColumn.runtime}, ` +
        `${movieColumn.thumbnail} ` +
        `order by ${movieColumn.runtime} desc`
    const values = await sheetServices.querySheet(authorization, query, movieColumn.sheetId, movieColumn.gid)

    if (!values.length)
    {
        return null
    }
    const movies = []
    for (let value of values)
    {
        const movie = new Movie()
        movie.id = Number(value[0])
        movie.name = value[1]
        movie.releaseDate = Number(value[2])
        movie.director = value[3]
        movie.category = value[4]
        movie.runtime = Number(value[5])
        movie.thumbnail = value[6]
        movies.push(movie)
    }
    return movies
}
