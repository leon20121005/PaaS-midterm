const moduleName = "contactServices"

import * as sheetServices from "./sheetServices"
import { memberColumn } from "./sheetColumnConfig"
import { Member } from "./model"

export const getMemberById = async function(memberId: string): Promise<Member>
{
    const auth = await sheetServices.authorize()
    const queryString = `select ${memberColumn.id}, ` +
        `${memberColumn.name}, ` +
        `${memberColumn.phone}, ` +
        `${memberColumn.email}, ` +
        `${memberColumn.lineId}, ` +
        `${memberColumn.role}, ` +
        `${memberColumn.drawCount}, ` +
        `${memberColumn.lastDrawTime} ` +
        `where ${memberColumn.id} = ${memberId}`
    const values = await sheetServices.querySheet(auth, queryString, memberColumn.sheetId, memberColumn.gid)

    if (!values.length)
    {
        return null
    }
    const member = new Member()
    member.id = values[0][0]
    member.name = values[0][1]
    member.phone = values[0][2]
    member.email = values[0][3]
    member.lineId = values[0][4]
    member.role = values[0][5]
    member.dailyDraw.drawCount = values[0][6]
    member.dailyDraw.lastDrawTime = values[0][7]
    return member
}

export const getMemberByUserId = async function(lineId: string): Promise<Member>
{
    const auth = await sheetServices.authorize()
    const queryString = `select ${memberColumn.id}, ` +
        `${memberColumn.name}, ` +
        `${memberColumn.phone}, ` +
        `${memberColumn.email}, ` +
        `${memberColumn.lineId}, ` +
        `${memberColumn.role}, ` +
        `${memberColumn.drawCount}, ` +
        `${memberColumn.lastDrawTime} ` +
        `where ${memberColumn.lineId} = '${lineId}'`
    const values = await sheetServices.querySheet(auth, queryString, memberColumn.sheetId, memberColumn.gid)

    if (!values.length)
    {
        return null
    }
    const member = new Member()
    member.id = values[0][0]
    member.name = values[0][1]
    member.phone = values[0][2]
    member.email = values[0][3]
    member.lineId = values[0][4]
    member.role = values[0][5]
    member.dailyDraw.drawCount = values[0][6]
    member.dailyDraw.lastDrawTime = values[0][7]
    return member
}

export const updateMemberDailyDraw = async function(member: Member): Promise<void>
{
    const auth = await sheetServices.authorize()
    const range = encodeURI(`${memberColumn.workspace}!${memberColumn.drawCount}${member.id}:${memberColumn.lastDrawTime}${member.id}`)
    sheetServices.writeSheet(auth, memberColumn.sheetId, range, [[member.dailyDraw.drawCount, member.dailyDraw.lastDrawTime]])
}
