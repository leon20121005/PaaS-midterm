const moduleName = "dailyDrawService"

import * as moment from "moment-timezone"

import * as memberModel from "./model/memberModel"
import * as prizeModel from "./model/prizeModel"
import * as lineService from "./lineService"
import { Member } from "./model/model"

export const dailyDraw = async function(userId: string, replyToken: string, timestamp: number): Promise<void>
{
    let resultMessage
    const member = await memberModel.getMemberByUserId(userId)

    if (!isDailyDrawAvailable(member, timestamp))
    {
        const errorCode = -1
        resultMessage = getErrorMessage(errorCode)
    }
    else
    {
        member.dailyDraw.drawCount++
        member.dailyDraw.lastDrawTime = timestamp
        memberModel.updateMemberDailyDraw(member)
        const availablePrize = await prizeModel.getAvailablePrize()
        if (availablePrize != null)
        {
            if (getDrawResult())
            {
                resultMessage = getWinningPrizeMessage(availablePrize.serialNumber, timestamp, member.dailyDraw.drawCount)
                prizeModel.writeWinner(availablePrize, member)
            }
            else
            {
                resultMessage = getLosingPrizeMessage(timestamp, member.dailyDraw.drawCount)
            }
        }
        else
        {
            resultMessage = getLosingPrizeMessage(timestamp, member.dailyDraw.drawCount)
        }
    }
    const lineMessage = lineService.toTextMessage(resultMessage)
    lineService.replyMessage(replyToken, lineMessage)
}

const isDailyDrawAvailable = function(member: Member, timestamp: number): boolean
{
    const lastDrawTime = member.dailyDraw.lastDrawTime
    if (lastDrawTime)
    {
        if (moment(timestamp).tz("Asia/Taipei").date() == moment(lastDrawTime).tz("Asia/Taipei").date())
        {
            return false
        }
    }
    return true
}

const getDrawResult = function(): boolean
{
    if (Math.floor(Math.random() * 10) == 0)
    {
        return true
    }
    return false
}

const getWinningPrizeMessage = function(serialNumber: string, timestamp: number, drawCount: number): string
{
    let message
    message = `恭喜中獎\n`
    message += `中獎序號: ${serialNumber}\n`
    message += `時間: ${moment(timestamp).tz("Asia/Taipei").format("YYYY-MM-DD HH:mm:ss")}\n`
    message += `累積簽到次數: ${drawCount}`
    return message
}

const getLosingPrizeMessage = function(timestamp: number, drawCount: number): string
{
    let message = `可惜沒中...\n`
    message += `時間: ${moment(timestamp).tz("Asia/Taipei").format("YYYY-MM-DD HH:mm:ss")}\n`
    message += `累積簽到次數: ${drawCount}`
    return message
}

const getErrorMessage = function(errorCode: number): string
{
    let errorMessage
    switch (errorCode)
    {
        case -1:
            errorMessage = "本日已簽到"
            break
        default:
            break
    }
    return errorMessage
}
