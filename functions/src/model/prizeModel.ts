import * as memberModel from "./memberModel"

import * as sheetServices from "./sheetServices"
import { prizeColumn } from "./sheetColumnConfig"
import { Prize, Member } from "./model"

export const getAvailablePrize = async function(): Promise<Prize>
{
    const authorization = await sheetServices.authorize()
    const query = `select ${prizeColumn.id}, ` +
        `${prizeColumn.serial}, ` +
        `${prizeColumn.memberId} ` +
        `where ${prizeColumn.memberId} = '' limit 1`
    const values = await sheetServices.querySheet(authorization, query, prizeColumn.sheetId, prizeColumn.gid)

    if (!values.length)
    {
        return null
    }
    const prize = new Prize()
    prize.id = Number(values[0][0])
    prize.serialNumber = values[0][1]
    prize.memberId = values[0][2]
    return prize
}

export const writeWinner = async function(prize: Prize, member: Member): Promise<void>
{
    const authorization = await sheetServices.authorize()
    const range = encodeURI(`${prizeColumn.workspace}!${prizeColumn.memberId}${prize.id}`)
    await sheetServices.writeSheet(authorization, prizeColumn.sheetId, range, [[member.id]])
}

export const getPrizesByUserId = async function(userId: string): Promise<Prize[]>
{
    const member = await memberModel.getMemberByUserId(userId)

    const authorization = await sheetServices.authorize()
    const query = `select ${prizeColumn.id}, ` +
        `${prizeColumn.serial}, ` +
        `${prizeColumn.memberId} ` +
        `where ${prizeColumn.memberId} = ${member.id}`
    const values = await sheetServices.querySheet(authorization, query, prizeColumn.sheetId, prizeColumn.gid)

    if (!values.length)
    {
        return null
    }
    const prizes = []
    for (let value of values)
    {
        const prize = new Prize()
        prize.id = Number(value[0])
        prize.serialNumber = value[1]
        prize.memberId = value[2]
        prizes.push(prize)
    }
    return prizes
}
