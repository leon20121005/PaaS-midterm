const moduleName = "lineWebhook"

import * as dialogflow from "dialogflow"
import * as functions from "firebase-functions"
import { validateSignature, WebhookEvent } from "@line/bot-sdk"
import * as structjson from "./structjson"
import * as queryString from "query-string"

import { LINE, DIALOGFLOW } from "./chatbotConfig"
import * as actionService from "./actionService"
import * as contactService from "./contactService"
import * as dailyDrawService from "./dailyDrawService"
import * as movieService from "./movieService"
import * as cinemaService from "./cinemaService"
import * as reservationService from "./reservationService"
import * as prizeService from "./prizeService"
import * as lineService from "./lineService"

const sessionClient = new dialogflow.SessionsClient({ keyFilename: DIALOGFLOW.path })

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
    const userId = event.source.userId
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

const follow = (userId: string, replyToken: string, timestamp: number): void => setDialogflowEvent(userId, "follow", replyToken, timestamp)

const unfollow = (userId: string): void => console.log("unfollow")

const join = (groupId: string, replyToken: string, timestamp: number): void => setDialogflowEvent(groupId, "join", replyToken, timestamp)

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
        case "訂票":
            actionDispatcher(userId, "showTickets", replyToken, timestamp)
            break
        case "兌獎":
            actionDispatcher(userId, "showPrizes", replyToken, timestamp)
            break
        default:
            setDialogflowText(userId, userIntent, replyToken, timestamp, groupId)
            break
    }
}

const setDialogflowText = function(userId: string, userIntent: string, replyToken: string, timestamp: number, groupId?: string): void
{
    const sessionId = groupId ? groupId : userId
    const sessionPath = sessionClient.sessionPath(DIALOGFLOW.projectId, sessionId)
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userIntent,
                languageCode: DIALOGFLOW.languageCode
            }
        }
    }
    sessionClient.detectIntent(request).then(function(responses)
    {
        const result = responses[0].queryResult
        if (result.intent)
        {
            const action = result.action
            const parameters = structjson.structProtoToJson(result.parameters)
            const response = result.fulfillmentText
            actionDispatcher(userId, action, replyToken, timestamp, parameters, response, groupId)
        }
    }).catch(function(error)
    {
        console.log(error)
    })
}

const setDialogflowEvent = function(userId: string, eventName: string, replyToken: string, timestamp: number): void
{
    const sessionId = userId
    const sessionPath = sessionClient.sessionPath(DIALOGFLOW.projectId, sessionId)
    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                name: eventName,
                languageCode: DIALOGFLOW.languageCode,
            }
        }
    }
    sessionClient.detectIntent(request).then(function(responses)
    {
        const result = responses[0].queryResult
        if (result.intent)
        {
            const action = result.action
            const parameters = structjson.structProtoToJson(result.parameters)
            const response = result.fulfillmentText
            actionDispatcher(userId, action, replyToken, timestamp, parameters, response)
        }
    }).catch(function(error)
    {
        console.log(error)
    })
}

const actionDispatcher = async function(userId: string, action: string, replyToken: string, timestamp: number, parameters?: any, response?: string, groupId?: string): Promise<void>
{
    console.log("In lineWebhook.actionDispatcher: " + action)
    let lineMessage
    switch (action)
    {
        case "showIndex":
            actionService.showIndex(replyToken)
            break
        case "sendTextToMember":
            lineMessage = lineService.toTextMessage(response)
            lineService.replyMessage(replyToken, lineMessage)
            break
        case "bindMember":
            contactService.bindMember(parameters.name, userId, replyToken)
            break
        case "sendTextToGroup":
            lineMessage = lineService.toTextMessage(response)
            lineService.replyMessage(replyToken, lineMessage)
            break
        case "bindGroup":
            contactService.bindGroup(parameters.name, groupId, replyToken)
            break
        case "dailyDraw":
            dailyDrawService.dailyDraw(userId, replyToken, timestamp)
            break
        case "showMovies":
            movieService.showMoviesByReleaseDate(replyToken)
            break
        case "showCinemas":
            cinemaService.showCinemas(replyToken)
            break
        case "showTickets":
            reservationService.showUserTickets(userId, replyToken)
            break
        case "showPrizes":
            prizeService.showUserPrizes(userId, replyToken)
            break
        case "post":
            contactService.post(parameters.url)
            break
        default:
            lineMessage = lineService.toTextMessage(getErrorMessage(-2))
            lineService.replyMessage(replyToken, lineMessage)
            break
    }
}

const postbackDispatcher = async function(userId: string, postbackData: string): Promise<void>
{
    console.log(postbackData)
    const postback = queryString.parse(postbackData)
    switch (postback.action)
    {
        case "reserveTickets":
            if (Object.keys(postback).length == 2)
            {
                reservationService.showMatchedCinemas(postback.movieId, userId)
            }
            else if (Object.keys(postback).length == 3)
            {
                reservationService.showMatchedScreenings(postback.movieId, postback.cinemaId, userId)
            }
            else if (Object.keys(postback).length == 4)
            {
                reservationService.reserveTickets(postback.screeningId, userId)
            }
            break
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
