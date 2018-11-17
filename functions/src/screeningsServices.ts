const moduleName = "screeningsServices"

import * as moviesServices from "./moviesServices"
import * as cinemasServices from "./cinemasServices"

import * as sheetServices from "./sheetServices"
import { screeningColumn } from "./sheetColumnConfig"
import { Cinema, Screening } from "./model"

export const getCinemasByMovieId = async function(movieId: number): Promise<Cinema[]>
{
    const authorization = await sheetServices.authorize()
    const query = `select ${screeningColumn.cinemaId} ` +
        `where ${screeningColumn.movieId} = ${movieId}`
    const values = await sheetServices.querySheet(authorization, query, screeningColumn.sheetId, screeningColumn.gid)

    if (!values.length)
    {
        return null
    }
    const cinemaIds = []
    for (let value of values)
    {
        cinemaIds.push(value)
    }
    return cinemasServices.getCinemasById(cinemaIds)
}

export const getScreenings = async function(movieId: number, cinemaId: number): Promise<Screening[]>
{
    const movie = await moviesServices.getMoviesById(movieId)
    const cinema = await cinemasServices.getCinemasById(cinemaId)

    const authorization = await sheetServices.authorize()
    const query = `select ${screeningColumn.id}, ` +
        `${screeningColumn.showtime} ` +
        `where ${screeningColumn.movieId} = ${movieId} and ${screeningColumn.cinemaId} = ${cinemaId}`
    const values = await sheetServices.querySheet(authorization, query, screeningColumn.sheetId, screeningColumn.gid)

    if (!values.length)
    {
        return null
    }
    const screenings = []
    for (let value of values)
    {
        const screening = new Screening()
        screening.id = Number(value[0])
        screening.movie = movie[0]
        screening.cinema = cinema[0]
        screening.showtime = Number(value[1])
        screenings.push(screening)
    }
    return screenings
}
