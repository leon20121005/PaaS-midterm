import { Client, Message } from "@line/bot-sdk"
import * as moment from "moment-timezone"

import { LINE } from "./chatbotConfig"
import { Movie } from "./model"

const lineClient = new Client(LINE)

export const getName = async function(userId: string): Promise<string>
{
    const profile = await lineClient.getProfile(userId)
    return profile.displayName
}

export const toTextMessage = function(text: string): Message
{
    const textMessage: Message = {
        type: "text",
        text: text
    }
    return textMessage
}

export const toImageMessage = function(originalContentUrl: string, previewImageUrl: string): Message
{
    const videoMessage: Message = {
        type: "image",
        originalContentUrl: originalContentUrl,
        previewImageUrl: previewImageUrl
    }
    return videoMessage
}

export const toVideoMessage = function(originalContentUrl: string, previewImageUrl: string): Message
{
    const videoMessage: Message = {
        type: "video",
        originalContentUrl: originalContentUrl,
        previewImageUrl: previewImageUrl
    }
    return videoMessage
}

export const toLocationMessage = function(title: string, address: string, latitude: number, longitude: number): Message
{
    const locationMessage: Message = {
        type: "location",
        title: title,
        address: address,
        latitude: latitude,
        longitude: longitude
    }
    return locationMessage
}

export const toStickerMessage = function(packageId: string, stickerId: string): Message
{
    const stickerMessage: Message = {
        type: "sticker",
        packageId: packageId,
        stickerId: stickerId
    }
    return stickerMessage
}

export const toCarouselMessage = function(): Message
{
    const functions = ["功能1", "功能2", "功能3"]
    const email = "leon20121005@gmail.com"
    let columns = []
    for (const each of functions)
    {
        columns.push({
            // thumbnailImageUrl: "",
            title: each,
            text: "測試",
            actions: [
                {
                    type: "uri",
                    label: "郵件",
                    uri: `mailto:${email}`
                }
            ]
        })
    }

    const carouselMessage: Message = {
        type: "template",
        altText: "carousel template",
        template: {
            type: "carousel",
            columns: columns
        }
    }
    return carouselMessage
}

export const toMoviesCarousel = function(movies: Movie[]): Message
{
    let columns = []
    for (let movie of movies)
    {
        columns.push(
        {
            thumbnailImageUrl: movie.thumbnail,
            title: movie.name,
            // Because of the height limitation for carousel template messages,
            // the lower part of the text display area will get cut off if the height limitation is exceeded
            text: getInformationText(movie),
            // Max: 3
            actions: [
                {
                    type: "postback",
                    label: "訂票",
                    data: "action=reserveTickets"
                }
            ]
        })
    }

    const carouselMessage: Message = {
        type: "template",
        altText: "carousel template",
        template: {
            type: "carousel",
            columns: columns
        }
    }
    return carouselMessage
}

export const replyMessage = function(replyToken: string, lineMessage: Message | Message[]): Promise<any>
{
    return lineClient.replyMessage(replyToken, lineMessage)
}

export const pushMessage = function(userId: string, lineMessage: Message | Message[]): Promise<any>
{
    return lineClient.pushMessage(userId, lineMessage)
}

const getInformationText = function(movie: Movie): string
{
    let information = "上映日期: " + moment(movie.releaseDate).tz("Asia/Taipei").format("YYYY-MM-DD") + "\n"
    information += "類型: " + movie.category + "\n"
    information += "片長: " + movie.runtime + "分"
    return information
}
