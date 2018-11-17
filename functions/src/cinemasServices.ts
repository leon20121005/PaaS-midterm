const moduleName = "cinemasServices"

import * as sheetServices from "./sheetServices"
import { cinemaColumn } from "./sheetColumnConfig"
import { Cinema } from "./model"

export const getCinemas = async function(): Promise<Cinema[]>
{
    const authorization = await sheetServices.authorize()
    const query = `select ${cinemaColumn.id}, ` +
        `${cinemaColumn.name}, ` +
        `${cinemaColumn.address}, ` +
        `${cinemaColumn.phone}, ` +
        `${cinemaColumn.thumbnail}`
    const values = await sheetServices.querySheet(authorization, query, cinemaColumn.sheetId, cinemaColumn.gid)

    if (!values.length)
    {
        return null
    }
    const cinemas = []
    for (let value of values)
    {
        const cinema = new Cinema()
        cinema.id = Number(value[0])
        cinema.name = value[1]
        cinema.address = value[2]
        cinema.phone = Number(value[3])
        cinema.thumbnail = value[4]
        cinemas.push(cinema)
    }
    return cinemas
}

export const getCinemasById = async function(cinemaIds: number | number[]): Promise<Cinema[]>
{
    const authorization = await sheetServices.authorize()
    const query = `select ${cinemaColumn.id}, ` +
        `${cinemaColumn.name}, ` +
        `${cinemaColumn.address}, ` +
        `${cinemaColumn.phone}, ` +
        `${cinemaColumn.thumbnail} ` +
        `where ${getConditionExpression(cinemaColumn.id, cinemaIds)}`
    const values = await sheetServices.querySheet(authorization, query, cinemaColumn.sheetId, cinemaColumn.gid)

    if (!values.length)
    {
        return null
    }
    const cinemas = []
    for (let value of values)
    {
        const cinema = new Cinema()
        cinema.id = Number(value[0])
        cinema.name = value[1]
        cinema.address = value[2]
        cinema.phone = Number(value[3])
        cinema.thumbnail = value[4]
        cinemas.push(cinema)
    }
    return cinemas
}

const getConditionExpression = function(key: string, values: number | number[]): string
{
    if (!Array.isArray(values))
    {
        return key + " = " + String(values)
    }
    let expression = ""
    for (let value of values)
    {
        expression += key + " = " + value + " or "
    }
    return expression.slice(0, -4)
}
