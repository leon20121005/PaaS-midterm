const moduleName = "actionService"

import * as lineService from "./lineService"

export const showIndex = function(replyToken: string): void
{
    const lineMessage = lineService.toCarouselMessage()
    lineService.replyMessage(replyToken, lineMessage)
}
