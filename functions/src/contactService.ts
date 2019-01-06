const moduleName = "contactService"

import { ANGULAR_URL } from "./chatbotConfig"
import * as memberModel from "./firestoreModels/memberModel"
import * as groupModel from "./firestoreModels/groupModel"
import * as lineService from "./lineService"

export const bindMember = async function(name: string, lineId: string, replyToken: string): Promise<void>
{
    await memberModel.bindMember(name, lineId)
    const lineMessage = lineService.toTextMessage("綁定成功")
    lineService.replyMessage(replyToken, lineMessage)
}

export const registerMember = async function(lineId: string, replyToken: string): Promise<void>
{
    const lineMessage = lineService.toTextMessage(`${ANGULAR_URL}/register?lineid=${lineId}`)
    lineService.replyMessage(replyToken, lineMessage)
}

export const bindGroup = async function(name: string, lineId: string, replyToken: string): Promise<void>
{
    await groupModel.bindGroup(name, lineId)
    const lineMessage = lineService.toTextMessage("綁定成功")
    lineService.replyMessage(replyToken, lineMessage)
}

export const post = async function(url: string): Promise<void>
{
    const members = await memberModel.getMembersLineId()
    for (let member of members)
    {
        lineService.pushMessage(member.lineId, lineService.toImageMessage(url, url))
    }
}
