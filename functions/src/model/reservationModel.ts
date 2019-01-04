import { getConditionExpression } from "./model"

import * as memberModel from "./memberModel"
import * as screeningModel from "./screeningModel"

import * as sheetServices from "./sheetServices"
import { reservationColumn } from "./sheetColumnConfig"
import { Reservation } from "./model"

export const reserveTickets = async function(screeningId: number, userId: string, timestamp: number): Promise<void>
{
    const member = await memberModel.getMemberByUserId(userId)

    const authorization = await sheetServices.authorize()
    const range = encodeURI(`${reservationColumn.workspace}`)
    await sheetServices.appendSheet(authorization, reservationColumn.sheetId, range, [["=ROW()", screeningId, member.id, timestamp]])
}

export const getTickets = async function(): Promise<Reservation[]>
{
    const authorization = await sheetServices.authorize()
    const query = `select ${reservationColumn.id}, ` +
        `${reservationColumn.screeningId}, ` +
        `${reservationColumn.memberId}, ` +
        `${reservationColumn.time}`
    const values = await sheetServices.querySheet(authorization, query, reservationColumn.sheetId, reservationColumn.gid)

    if (!values.length)
    {
        return null
    }
    const reservations = []
    for (let value of values)
    {
        const screening = await screeningModel.getScreeningsById(value[1])
        const member = await memberModel.getMemberById(value[2])
        const reservation = new Reservation()
        reservation.id = value[0]
        reservation.screening = screening[0]
        reservation.member = member
        reservation.time = Number(value[3])
        reservations.push(reservation)
    }
    return reservations
}

export const getTicketsByUserId = async function(userId: string): Promise<Reservation[]>
{
    const member = await memberModel.getMemberByUserId(userId)

    const authorization = await sheetServices.authorize()
    const query = `select ${reservationColumn.id}, ` +
        `${reservationColumn.screeningId}, ` +
        `${reservationColumn.memberId}, ` +
        `${reservationColumn.time} ` +
        `where ${reservationColumn.memberId} = ${member.id}`
    const values = await sheetServices.querySheet(authorization, query, reservationColumn.sheetId, reservationColumn.gid)

    if (!values.length)
    {
        return null
    }
    const reservations = []
    for (let value of values)
    {
        const screening = await screeningModel.getScreeningsById(value[1])
        const member = await memberModel.getMemberById(value[2])
        const reservation = new Reservation()
        reservation.id = value[0]
        reservation.screening = screening[0]
        reservation.member = member
        reservation.time = Number(value[3])
        reservations.push(reservation)
    }
    return reservations
}

export const getTicketsById = async function(reservationIds: number | number[]): Promise<Reservation[]>
{
    const authorization = await sheetServices.authorize()
    const query = `select ${reservationColumn.id}, ` +
        `${reservationColumn.screeningId}, ` +
        `${reservationColumn.memberId}, ` +
        `${reservationColumn.time} ` +
        `where ${getConditionExpression(reservationColumn.id, reservationIds)}`
    const values = await sheetServices.querySheet(authorization, query, reservationColumn.sheetId, reservationColumn.gid)

    if (!values.length)
    {
        return null
    }
    const reservations = []
    for (let value of values)
    {
        const screening = await screeningModel.getScreeningsById(value[1])
        const member = await memberModel.getMemberById(value[2])
        const reservation = new Reservation()
        reservation.id = value[0]
        reservation.screening = screening[0]
        reservation.member = member
        reservation.time = Number(value[3])
        reservations.push(reservation)
    }
    return reservations
}

export const deleteTicketsById = async function(reservationIds: number | number[]): Promise<void>
{
    const authorization = await sheetServices.authorize()
    if (!Array.isArray(reservationIds))
    {
        const range = encodeURI(`${reservationColumn.workspace}!${reservationColumn.id}${reservationIds}:${reservationColumn.time}${reservationIds}`)
        await sheetServices.clearSheet(authorization, reservationColumn.sheetId, range)
        return
    }
    for (let reservationId of reservationIds)
    {
        const range = encodeURI(`${reservationColumn.workspace}!${reservationColumn.id}${reservationId}:${reservationColumn.time}${reservationId}`)
        await sheetServices.clearSheet(authorization, reservationColumn.sheetId, range)
    }
}
