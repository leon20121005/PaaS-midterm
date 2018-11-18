const moduleName = "actionServices"

import * as lineServices from "./lineServices"

export const showIndex = function(replyToken: string): void
{
    const lineMessage = lineServices.toCarouselMessage()
    lineServices.replyMessage(replyToken, lineMessage)
}

export const getConditionExpression = function(key: string, values: number | number[]): string
{
    if (!Array.isArray(values))
    {
        return key + " = " + String(values)
    }
    let expression = ""
    for (let value of values)
    {
        expression += key + " = " + value + " or "
    }
    return expression.slice(0, -4)
}
