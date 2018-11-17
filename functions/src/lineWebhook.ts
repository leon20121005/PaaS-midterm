const moduleName = "lineWebhook"

import * as functions from 'firebase-functions'
import { validateSignature, WebhookEvent } from "@line/bot-sdk"
import * as queryString from "query-string"

import { LINE } from "./chatbotConfig"
import * as actionServices from "./actionServices"
import * as dailyDrawServices from "./dailyDrawServices"
import * as movieServices from "./moviesServices"
import * as cinemasServices from "./cinemasServices"
import * as screeningsServices from "./screeningsServices"
import * as lineServices from "./lineServices"

export const chatbotWebhook = functions.https.onRequest(function(request, response): void
{
    const signature = request.headers["x-line-signature"] as string
    if (validateSignature(JSON.stringify(request.body), LINE.channelSecret, signature))
    {
        const events = request.body.events as Array<WebhookEvent>
        for (const event of events)
        {
            eventDispatcher(event)
        }
        response.sendStatus(200)
    }
    else
    {
        const message = getErrorMessage(-1)
        console.log(message)
        response.status(403).send(message)
    }
})

const eventDispatcher = function(event: WebhookEvent): void
{
    let userId = event.source.userId
    const timestamp = event.timestamp
    console.log("In lineWebhook.eventDispatcher: " + userId)
    switch (event.type)
    {
        case "message":
            if (event.message.type == "text")
            {
                const userIntent = event.message.text
                if (event.source.type == "group")
                {
                    messageDispatcher(userId, userIntent, event.replyToken, timestamp, event.source.groupId)
                    break
                }
                messageDispatcher(userId, userIntent, event.replyToken, timestamp)
            }
            break
        case "postback":
            postbackDispatcher(userId, event.postback.data)
            break
        case "follow":
            follow(userId, event.replyToken, timestamp)
            break
        case "unfollow":
            unfollow(userId)
            break
        case "join":
            if (event.source.type == "group")
            {
                join(event.source.groupId, event.replyToken, timestamp)
            }
            break
        case "leave":
            if (event.source.type == "group")
            {
                leave(event.source.groupId)
            }
            break
    }
}

const follow = (userId: string, replyToken: string, timestamp: number): void => console.log("follow")

const unfollow = (userId: string): void => console.log("unfollow")

const join = (groupId: string, replyToken: string, timestamp: number): void => console.log("join")

const leave = (groupId: string): void => console.log("leave")

const messageDispatcher = function(userId: string, userIntent: string, replyToken: string, timestamp: number, groupId?: string): void
{
    switch (userIntent)
    {
        case "首頁":
            actionDispatcher(userId, "showIndex", replyToken, timestamp)
            break
        case "簽到":
            actionDispatcher(userId, "dailyDraw", replyToken, timestamp)
            break
        case "列表":
            actionDispatcher(userId, "showMovies", replyToken, timestamp)
            break
        case "影城":
            actionDispatcher(userId, "showCinemas", replyToken, timestamp)
            break
        default:
            actionDispatcher(userId, null, replyToken, timestamp)
            break
    }
}

const actionDispatcher = async function(userId: string, action: string, replyToken: string, timestamp: number, groupId?: string): Promise<void>
{
    console.log("In lineWebhook.actionDispatcher: " + action)
    let lineMessage
    switch (action)
    {
        case "showIndex":
            actionServices.showIndex(replyToken)
            break
        case "dailyDraw":
            dailyDrawServices.dailyDraw(userId, replyToken, timestamp)
            break
        case "showMovies":
            const movies = await movieServices.getMoviesByReleaseDate()
            lineMessage = lineServices.toMoviesCarousel(movies)
            lineServices.replyMessage(replyToken, lineMessage)
            break
        case "showCinemas":
            const cinemas = await cinemasServices.getCinemas()
            lineMessage = lineServices.toCinemasCarousel(cinemas)
            lineServices.replyMessage(replyToken, lineMessage)
            break
        default:
            lineMessage = lineServices.toTextMessage(getErrorMessage(-2))
            lineServices.replyMessage(replyToken, lineMessage)
            break
    }
}

const postbackDispatcher = async function(userId: string, postbackData: string): Promise<void>
{
    console.log(postbackData)
    let lineMessage
    const postback = queryString.parse(postbackData)
    switch (postback.action)
    {
        case "reserveTickets":
            if (Object.keys(postback).length == 2)
            {
                const movies = await movieServices.getMoviesById(postback.movieId)
                const cinemas = await screeningsServices.getCinemasByMovieId(postback.movieId)
                if (cinemas == null)
                {
                    lineMessage = lineServices.toTextMessage("票已售完")
                    lineServices.pushMessage(userId, lineMessage)
                }
                else
                {
                    lineMessage = lineServices.toChoosingCinemaCarousel(movies[0], cinemas)
                    lineServices.pushMessage(userId, lineMessage)
                }
            }
            else if (Object.keys(postback).length == 3)
            {
                const screenings = await screeningsServices.getScreenings(postback.movieId, postback.cinemaId)
                lineMessage = lineServices.toConfirmingScreeningCarousel(screenings)
                lineServices.pushMessage(userId, lineMessage)
            }
            else if (Object.keys(postback).length == 4)
            {
                lineMessage = lineServices.toTextMessage("訂票成功")
                lineServices.pushMessage(userId, lineMessage)
            }
        default:
            break
    }
}

const getErrorMessage = function(errorCode: number): string
{
    let errorMessage
    switch (errorCode)
    {
        case -1:
            errorMessage = "系統錯誤: 授權失敗"
            break
        case -2:
            errorMessage = "系統錯誤: 指令不存在"
            break
        default:
            break
    }
    return errorMessage
}
