const moduleName = "reservationService"

import * as movieModel from "./model/movieModel"
import * as screeningModel from "./model/screeningModel"
import * as reservationModel from "./model/reservationModel"
import * as lineService from "./lineService"

export const showMatchedCinemas = async function(movieId: number, userId: string): Promise<void>
{
    const movies = await movieModel.getMoviesById(movieId)
    const cinemas = await screeningModel.getCinemasByMovieId(movieId)
    if (cinemas == null)
    {
        const lineMessage = lineService.toTextMessage("票已售完")
        lineService.pushMessage(userId, lineMessage)
    }
    else
    {
        const lineMessage = lineService.toChoosingCinemaCarousel(movies[0], cinemas)
        lineService.pushMessage(userId, lineMessage)
    }
}

export const showMatchedScreenings = async function(movieId: number, cinemaId: number, userId: string): Promise<void>
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
