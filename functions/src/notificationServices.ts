const moduleName = "notificationServices"

import * as functions from "firebase-functions"
import * as moment from "moment-timezone"

import * as groupServices from "./groupServices"
import * as reservationServices from "./reservationServices"
import * as lineServices from "./lineServices"
import { Reservation } from './model'

export const reportAttendance = functions.https.onRequest(async function(request, response): Promise<void>
{
    const memberCount = request.body.memberCount
    const totalDrawCount = request.body.totalDrawCount
    const groups = await groupServices.getGroups()
    const message = getReportText(memberCount, totalDrawCount)
    const lineMessage = lineServices.toTextMessage(message)
    for (let group of groups)
    {
        lineServices.pushMessage(group.lineId, lineMessage)
    }
    response.sendStatus(200)
})

export const notifyReservation = functions.https.onRequest(async function(request, response): Promise<void>
{
    const tickets = await reservationServices.getTickets()
    for (let ticket of tickets)
    {
        if (isItAlmostShowtime(ticket))
        {
            const message = getNotificationText(ticket)
            const lineMessage = lineServices.toTextMessage(message)
            lineServices.pushMessage(ticket.member.lineId, lineMessage)
        }
    }
    response.sendStatus(200)
})

const getReportText = function(memberCount: number, totalDrawCount: number): string
{
    let report = "會員人數: " + memberCount + "\n"
    report += "總簽到次數: " + totalDrawCount
    return report
}

const isItAlmostShowtime = function(ticket: Reservation): boolean
{
    const condition = "YYYY-MM-DD-hh"
    if (moment(ticket.screening.showtime).tz("Asia/Taipei").format(condition) == moment().tz("Asia/Taipei").format(condition))
    {
        return true
    }
    return false
}

const getNotificationText = function(ticket: Reservation): string
{
    let notification = "電影: " + ticket.screening.movie.name + "\n"
    notification += "交易序號: " + ticket.id + "\n"
    notification += "影城: " + ticket.screening.cinema.name + "\n"
    notification += "即將於一小時後上映，別忘囉"
    return notification
}
