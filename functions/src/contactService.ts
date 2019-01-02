const moduleName = "contactService"

import * as memberModel from "./model/memberModel"
import * as groupModel from "./model/groupModel"
import * as lineService from "./lineService"

export const bindMember = async function(name: string, lineId: string, replyToken: string): Promise<void>
{
    await memberModel.bindMember(name, lineId)
    const lineMessage = lineService.toTextMessage("綁定成功")
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
