const moduleName = "groupServices"

import * as sheetServices from "./sheetServices"
import { groupColumn } from "./sheetColumnConfig"
import { Group } from "./model"

export const bindGroup = async function(name: string, lineId: string): Promise<void>
{
    const authorization = await sheetServices.authorize()
    const range = encodeURI(`${groupColumn.workspace}`)
    await sheetServices.appendSheet(authorization, groupColumn.sheetId, range, [["=ROW()", name, lineId]])
}

export const getGroups = async function(): Promise<Group[]>
{
    const auth = await sheetServices.authorize()
    const queryString = `select ${groupColumn.id}, ` +
        `${groupColumn.name}, ` +
        `${groupColumn.lineId}`
    const values = await sheetServices.querySheet(auth, queryString, groupColumn.sheetId, groupColumn.gid)

    if (!values.length)
    {
        return null
    }
    const groups = []
    for (let value of values)
    {
        const group = new Group()
        group.id = Number(value[0])
        group.name = value[1]
        group.lineId = value[2]
        groups.push(group)
    }
    return groups
}
