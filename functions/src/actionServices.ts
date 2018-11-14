const moduleName = "actionServices"

import * as lineServices from "./lineServices"

export const showIndex = function(replyToken: string): void
{
    const lineMessage = lineServices.toCarouselMessage()
    lineServices.replyMessage(replyToken, lineMessage)
}
