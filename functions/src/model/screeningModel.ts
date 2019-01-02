import { getConditionExpression } from "./model"

import * as movieModel from "./movieModel"
import * as cinemaModel from "./cinemaModel"

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
    return cinemaModel.getCinemasById(cinemaIds)
}

export const getScreenings = async function(movieId: number, cinemaId: number): Promise<Screening[]>
{
    const movie = await movieModel.getMoviesById(movieId)
    const cinema = await cinemaModel.getCinemasById(cinemaId)

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

export const getScreeningsById = async function(screeningIds: number | number[]): Promise<Screening[]>
{
    const authorization = await sheetServices.authorize()
    const query = `select ${screeningColumn.id}, ` +
        `${screeningColumn.movieId}, ` +
        `${screeningColumn.cinemaId}, ` +
        `${screeningColumn.showtime} ` +
        `where ${getConditionExpression(screeningColumn.id, screeningIds)}`
    const values = await sheetServices.querySheet(authorization, query, screeningColumn.sheetId, screeningColumn.gid)

    if (!values.length)
    {
        return null
    }
    const screenings = []
    for (let value of values)
    {
        const movie = await movieModel.getMoviesById(value[1])
        const cinema = await cinemaModel.getCinemasById(value[2])
        const screening = new Screening()
        screening.id = Number(value[0])
        screening.movie = movie[0]
        screening.cinema = cinema[0]
        screening.showtime = Number(value[3])
        screenings.push(screening)
    }
    return screenings
}
