import * as memberModel from "./memberModel"
import * as screeningModel from "./screeningModel"

import * as sheetServices from "./sheetServices"
import { reservationColumn } from "./sheetColumnConfig"
import { Reservation } from "./model"

export const reserveTickets = async function(screeningId: number, userId: string): Promise<void>
{
    const member = await memberModel.getMemberByUserId(userId)

    const authorization = await sheetServices.authorize()
    const range = encodeURI(`${reservationColumn.workspace}`)
    await sheetServices.appendSheet(authorization, reservationColumn.sheetId, range, [["=ROW()", screeningId, member.id]])
}

export const getTickets = async function(): Promise<Reservation[]>
{
    const authorization = await sheetServices.authorize()
    const query = `select ${reservationColumn.id}, ` +
        `${reservationColumn.screeningId}, ` +
        `${reservationColumn.memberId}`
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
        `${reservationColumn.memberId} ` +
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
        reservations.push(reservation)
    }
    return reservations
}
