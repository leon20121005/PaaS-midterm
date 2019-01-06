const moduleName = "prizeService"

import * as prizeModel from "./firestoreModels/prizeModel"
import * as lineService from "./lineService"

export const showUserPrizes = async function(userId: string, replyToken: string): Promise<void>
{
    const prizes = await prizeModel.getPrizesByUserId(userId)
    if (prizes == null)
    {
        lineService.replyMessage(replyToken, lineService.toTextMessage("尚無中獎"))
        return
    }
    const lineMessage = lineService.toPrizesFlexCarousel(prizes)
    lineService.replyMessage(replyToken, lineMessage)
}
