const moduleName = "reservationService"

import * as movieModel from "./firestoreModels/movieModel"
import * as screeningModel from "./firestoreModels/screeningModel"
import * as reservationModel from "./firestoreModels/reservationModel"
import * as lineService from "./lineService"

export const showMatchedCinemas = async function(movieId: string, userId: string): Promise<void>
{
    const movie = await movieModel.getMovieById(movieId)
    const cinemas = await screeningModel.getCinemasByMovieId(movieId)
    if (cinemas == null)
    {
        const lineMessage = lineService.toTextMessage("票已售完")
        lineService.pushMessage(userId, lineMessage)
    }
    else
    {
        const lineMessage = lineService.toChoosingCinemaCarousel(movie, cinemas)
        lineService.pushMessage(userId, lineMessage)
    }
}

export const showMatchedScreenings = async function(movieId: string, cinemaId: string, userId: string): Promise<void>
{
    const screenings = await screeningModel.getScreenings(movieId, cinemaId)
    const lineMessage = lineService.toConfirmingScreeningCarousel(screenings)
    lineService.pushMessage(userId, lineMessage)
}

export const reserveTickets = async function(screeningId: number, userId: string, timestamp: number): Promise<void>
{
    await reservationModel.reserveTickets(screeningId, userId, timestamp)
    const lineMessage = lineService.toTextMessage("訂票成功")
    lineService.pushMessage(userId, lineMessage)
}

export const showUserTickets = async function(userId: string, replyToken: string): Promise<void>
{
    const tickets = await reservationModel.getTicketsByUserId(userId)
    if (tickets == null)
    {
        lineService.replyMessage(replyToken, lineService.toTextMessage("尚無訂票"))
        return
    }
    const lineMessage = lineService.toTicketsFlexCarousel(tickets)
    lineService.replyMessage(replyToken, lineMessage)
}

export const checkTicket = async function(reservationId: string, userId: string): Promise<void>
{
    const ticket = await reservationModel.getTicketById(reservationId)
    if (ticket == null)
    {
        lineService.pushMessage(userId, lineService.toTextMessage("查無訂票"))
        return
    }
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`
    const lineMessage = lineService.toImageMessage(url, url)
    lineService.pushMessage(userId, lineMessage)
}

export const cancelTicket = async function(reservationId: string, userId: string): Promise<void>
{
    await reservationModel.deleteTicketById(reservationId)
    lineService.pushMessage(userId, lineService.toTextMessage("訂票取消成功"))
}
