const moduleName = "contactServices"

import * as sheetServices from "./sheetServices"
import { memberColumn } from "./sheetColumnConfig"
import { Member } from "./model"

export const bindMember = async function(name: string, lineId: string): Promise<void>
{
    const authorization = await sheetServices.authorize()
    const range = encodeURI(`${memberColumn.workspace}`)
    await sheetServices.appendSheet(authorization, memberColumn.sheetId, range, [["=ROW()", name, undefined, undefined, lineId, "member", 0, undefined]])
}

export const getMembersLineId = async function(): Promise<Member[]>
{
    const auth = await sheetServices.authorize()
    const query = `select ${memberColumn.id}, ` +
        `${memberColumn.lineId}`
    const values = await sheetServices.querySheet(auth, query, memberColumn.sheetId, memberColumn.gid)

    if (!values.length)
    {
        return null
    }
    const members = []
    for (let value of values)
    {
        const member = new Member()
        member.id = Number(value[0])
        member.lineId = value[1]
        members.push(member)
    }
    return members
}

export const getMemberById = async function(memberId: string): Promise<Member>
{
    const auth = await sheetServices.authorize()
    const query = `select ${memberColumn.id}, ` +
        `${memberColumn.name}, ` +
        `${memberColumn.phone}, ` +
        `${memberColumn.email}, ` +
        `${memberColumn.lineId}, ` +
        `${memberColumn.role}, ` +
        `${memberColumn.drawCount}, ` +
        `${memberColumn.lastDrawTime} ` +
        `where ${memberColumn.id} = ${memberId}`
    const values = await sheetServices.querySheet(auth, query, memberColumn.sheetId, memberColumn.gid)

    if (!values.length)
    {
        return null
    }
    const member = new Member()
    member.id = Number(values[0][0])
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
    const query = `select ${memberColumn.id}, ` +
        `${memberColumn.name}, ` +
        `${memberColumn.phone}, ` +
        `${memberColumn.email}, ` +
        `${memberColumn.lineId}, ` +
        `${memberColumn.role}, ` +
        `${memberColumn.drawCount}, ` +
        `${memberColumn.lastDrawTime} ` +
        `where ${memberColumn.lineId} = '${lineId}'`
    const values = await sheetServices.querySheet(auth, query, memberColumn.sheetId, memberColumn.gid)

    if (!values.length)
    {
        return null
    }
    const member = new Member()
    member.id = Number(values[0][0])
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
