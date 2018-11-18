const moduleName = "dailyDrawServices"

import * as moment from "moment-timezone"

import * as contactServices from "./contactServices"
import * as lineServices from "./lineServices"
import { Member } from "./model"

export const dailyDraw = async function(userId: string, replyToken: string, timestamp: number): Promise<void>
{
    let resultMessage
    const member = await contactServices.getMemberByUserId(userId)

    if (!isDailyDrawAvailable(member, timestamp))
    {
        const errorCode = -1
        resultMessage = getErrorMessage(errorCode)
    }
    else
    {
        member.dailyDraw.drawCount++
        member.dailyDraw.lastDrawTime = timestamp
        contactServices.updateMemberDailyDraw(member)
        resultMessage = `恭喜中獎\n`
        resultMessage += `時間: ${moment(timestamp).tz("Asia/Taipei").format("YYYY-MM-DD HH:mm:ss")}\n`
        resultMessage += `累積簽到次數: ${member.dailyDraw.drawCount}`
    }
    const lineMessage = lineServices.toTextMessage(resultMessage)
    lineServices.replyMessage(replyToken, lineMessage)
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
