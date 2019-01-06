import { Client, Message } from "@line/bot-sdk"
import * as moment from "moment-timezone"

import { LINE } from "./chatbotConfig"
import { Movie, Cinema, Screening, Reservation, Prize } from "./firestoreModels/model"

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
    const columns = []
    for (let each of functions)
    {
        columns.push(
        {
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
    const columns = []
    for (let movie of movies)
    {
        columns.push(
        {
            thumbnailImageUrl: movie.thumbnail,
            title: movie.name,
            // Because of the height limitation for carousel template messages,
            // the lower part of the text display area will get cut off if the height limitation is exceeded
            text: getMovieInformationText(movie),
            // Max: 3
            actions: [
                {
                    type: "postback",
                    label: "訂票",
                    data: `action=reserveTickets&movieId=${movie.id}`
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

export const toCinemasCarousel = function(cinemas: Cinema[]): Message
{
    const columns = []
    for (let cinema of cinemas)
    {
        columns.push(
        {
            thumbnailImageUrl: cinema.thumbnail,
            title: cinema.name,
            // Because of the height limitation for carousel template messages,
            // the lower part of the text display area will get cut off if the height limitation is exceeded
            text: getCinemaInformationText(cinema),
            // Max: 3
            actions: [
                {
                    type: "uri",
                    label: "開始導航",
                    uri: "line://nv/location"
                },
                {
                    type: "uri",
                    label: "撥打電話",
                    uri: `tel:${cinema.phone}`
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

export const toChoosingCinemaCarousel = function(movie: Movie, cinemas: Cinema[]): Message
{
    const columns = []
    for (let cinema of cinemas)
    {
        columns.push(
        {
            thumbnailImageUrl: cinema.thumbnail,
            title: cinema.name,
            // Because of the height limitation for carousel template messages,
            // the lower part of the text display area will get cut off if the height limitation is exceeded
            text: getCinemaInformationText(cinema),
            // Max: 3
            actions: [
                {
                    type: "postback",
                    label: "選擇",
                    data: `action=reserveTickets&movieId=${movie.id}&cinemaId=${cinema.id}`
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

export const toConfirmingScreeningCarousel = function(screenings: Screening[]): Message
{
    const columns = []
    for (let screening of screenings)
    {
        columns.push(
        {
            thumbnailImageUrl: screening.movie.thumbnail,
            title: screening.movie.name,
            // Because of the height limitation for carousel template messages,
            // the lower part of the text display area will get cut off if the height limitation is exceeded
            text: getScreeningInformationText(screening),
            // Max: 3
            actions: [
                {
                    type: "postback",
                    label: "確認場次",
                    data: `action=reserveTickets&movieId=${screening.movie.id}&cinemaId=${screening.cinema.id}&screeningId=${screening.id}`
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

export const toTicketsFlexCarousel = function(tickets: Reservation[]): Message
{
    const columns = []
    for (let ticket of tickets)
    {
        const contents = {
            type: "bubble",
            hero: {
                type: "image",
                url: ticket.screening.movie.thumbnail,
                size: "full",
                aspectRatio: "20:13",
                aspectMode: "cover"
            },
            body: {
                type: "box",
                layout: "vertical",
                spacing: "md",
                contents: [
                    {
                        type: "text",
                        text: ticket.screening.movie.name,
                        weight: "bold"
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "text",
                                text: `交易序號: ${ticket.id}`,
                                color: "#666666",
                                size: "sm"
                            },
                            {
                                type: "text",
                                text: `交易時間: ${moment(ticket.time).tz("Asia/Taipei").format("YYYY-MM-DD hh:mm")}`,
                                color: "#666666",
                                size: "sm"
                            },
                            {
                                type: "text",
                                text: `放映時間: ${moment(ticket.screening.showtime).tz("Asia/Taipei").format("YYYY-MM-DD hh:mm")}`,
                                color: "#666666",
                                size: "sm"
                            },
                            {
                                type: "text",
                                text: `影城: ${ticket.screening.cinema.name}`,
                                color: "#666666",
                                size: "sm"
                            },
                            {
                                type: "text",
                                text: `地址: ${ticket.screening.cinema.address}`,
                                color: "#666666",
                                size: "sm"
                            }
                        ]
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "button",
                        action: {
                            type: "postback",
                            label: "行動驗票",
                            data: `action=checkTickets&reservationId=${ticket.id}`
                        }
                    },
                    {
                        type: "button",
                        action: {
                            type: "postback",
                            label: "取消訂票",
                            data: `action=cancelTickets&reservationId=${ticket.id}`
                        },
                        color: "#ff0000"
                    }
                ]
            }
        }
        columns.push(contents)
    }
    const flexMessage: Message = {
        type: "flex",
        altText: "flex message",
        contents: {
            type: "carousel",
            contents: columns
        }
    }
    return flexMessage
}

export const toPrizesFlexCarousel = function(prizes: Prize[]): Message
{
    const columns = []
    for (let prize of prizes)
    {
        const contents = {
            type: "bubble",
            body: {
                type: "box",
                layout: "vertical",
                spacing: "md",
                contents: [
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "image",
                                url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${prize.serialNumber}`
                            }
                        ]
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "text",
                                text: `序號: ${prize.serialNumber}`,
                                color: "#666666",
                                size: "sm"
                            },
                            {
                                type: "text",
                                text: `中獎時間: ${moment(prize.time).tz("Asia/Taipei").format("YYYY-MM-DD hh:mm")}`,
                                color: "#666666",
                                size: "sm"
                            }
                        ]
                    }
                ]
            }
        }
        columns.push(contents)
    }
    const flexMessage: Message = {
        type: "flex",
        altText: "flex message",
        contents: {
            type: "carousel",
            contents: columns
        }
    }
    return flexMessage
}

export const replyMessage = function(replyToken: string, lineMessage: Message | Message[]): Promise<any>
{
    return lineClient.replyMessage(replyToken, lineMessage)
}

export const pushMessage = function(userId: string, lineMessage: Message | Message[]): Promise<any>
{
    return lineClient.pushMessage(userId, lineMessage)
}

const getMovieInformationText = function(movie: Movie): string
{
    let information = "上映日期: " + moment(movie.releaseDate).tz("Asia/Taipei").format("YYYY-MM-DD") + "\n"
    information += "類型: " + movie.category + "\n"
    information += "片長: " + movie.runtime + "分"
    return information
}

const getCinemaInformationText = function(cinema: Cinema): string
{
    let information = "影城地址: " + cinema.address + "\n"
    information += "服務專線: " + cinema.phone
    return information
}

const getScreeningInformationText = function(screening: Screening): string
{
    let information = "時間: " + moment(screening.showtime).tz("Asia/Taipei").format("YYYY-MM-DD hh:mm") + "\n"
    information += "影城: " + screening.cinema.name + "\n"
    information += "地址: " + screening.cinema.address
    return information
}
