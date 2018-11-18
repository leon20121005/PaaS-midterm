const moduleName = "screeningsServices"

import { getConditionExpression } from "./actionServices"

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

export const getScreeningsById = async function(screeningId: number[]): Promise<Screening[]>
{
    const authorization = await sheetServices.authorize()
    const query = `select ${screeningColumn.id}, ` +
        `${screeningColumn.movieId}, ` +
        `${screeningColumn.cinemaId}, ` +
        `${screeningColumn.showtime} ` +
        `where ${getConditionExpression(screeningColumn.id, screeningId)}`
    const values = await sheetServices.querySheet(authorization, query, screeningColumn.sheetId, screeningColumn.gid)

    if (!values.length)
    {
        return null
    }
    const screenings = []
    for (let value of values)
    {
        const movie = await moviesServices.getMoviesById(value[1])
        const cinema = await cinemasServices.getCinemasById(value[2])
        const screening = new Screening()
        screening.id = Number(value[0])
        screening.movie = movie[0]
        screening.cinema = cinema[0]
        screening.showtime = Number(value[3])
        screenings.push(screening)
    }
    return screenings
}
