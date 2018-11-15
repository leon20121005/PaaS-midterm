import { google } from "googleapis"
import { OAuth2Client } from "google-auth-library"

import axios from "axios"

import { SHEET_SECRET, SHEET_TOKEN } from "./sheetConfig"

export const authorize = function(): Promise<OAuth2Client>
{
    return new Promise(function(resolve)
    {
        const secret = SHEET_SECRET.installed.client_secret
        const clientId = SHEET_SECRET.installed.client_id
        const redirectUrl = SHEET_SECRET.installed.redirect_uris[0]
        const oauth2Client = new OAuth2Client(clientId, secret, redirectUrl)
        oauth2Client.setCredentials(
        {
            access_token: SHEET_TOKEN.access_token,
            refresh_token: SHEET_TOKEN.refresh_token
        })
        resolve(oauth2Client)
    })
}

export const readSheet = function(auth: OAuth2Client, spreadsheetId: string, range: string): Promise<Array<any>>
{
    return new Promise(function(resolve, reject)
    {
        const sheets = google.sheets("v4")
        sheets.spreadsheets.values.get(
        {
            spreadsheetId: spreadsheetId,
            range: range,
            auth: auth
        },
        function(error, result)
        {
            if (error)
            {
                console.log("The API returned an error: ", error)
                reject(error)
            }
            else
            {
                resolve(result.data.values)
            }
        })
    })
}

export const writeSheet = function(auth: OAuth2Client, spreadsheetId: string, range: string, values: any): Promise<any>
{
    return new Promise(async function(resolve, reject)
    {
        const sheets = google.sheets("v4")
        sheets.spreadsheets.values.update(
        {
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: "USER_ENTERED",
            resource: { values: values },
            auth: auth
        },
        function(error, result)
        {
            if (error)
            {
                console.log("The API returned an error: ", error)
                reject(error)
            }
            else
            {
                console.log("%d cells updated.", result.data.updatedCells)
                resolve(result)
            }
        })
    })
}

export const appendSheet = function(auth: OAuth2Client, spreadsheetId: string, range: string, values: any): Promise<any>
{
    return new Promise(function(resolve, reject)
    {
        const sheets = google.sheets("v4")
        sheets.spreadsheets.values.append(
        {
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: "USER_ENTERED",
            resource: { values: values },
            auth: auth
        },
        function(error, result)
        {
            if (error)
            {
                console.log(error)
                reject(error)
            }
            else
            {
                console.log("%d cells appended.", result.data.updates.updatedCells)
                resolve(result)
            }
        })
    })
}

export const clearSheet = function(auth: OAuth2Client, spreadsheetId: string, range: string): Promise<any>
{
    return new Promise(function(resolve, reject)
    {
        const sheets = google.sheets("v4")
        sheets.spreadsheets.values.clear(
        {
            spreadsheetId: spreadsheetId,
            range: range,
            auth: auth
        },
        function(error, result)
        {
            if (error)
            {
                console.log("The API returned an error: ", error)
                reject(error)
            }
            else
            {
                console.log("%d cells clear.", 1)
                resolve(result)
            }
        })
    })
}

export const querySheet = function(auth: OAuth2Client, queryString: string, sheetId: string, gid: string): Promise<Array<any>>
{
    return new Promise(async function(resolve, reject)
    {
        const reg = /google.visualization.Query.setResponse\((.*)\)/g
        const query = encodeURI(queryString)
        const url = `https://spreadsheets.google.com/tq?tqx=out:json&tq=${query}&key=${sheetId}&gid=${gid}`
        const token = await auth.refreshAccessToken()
        const headers = {
            "Authorization": "Bearer " + token.credentials.access_token
        }
        axios.get(url, { headers }).then(function(result)
        {
            const data = JSON.parse(reg.exec(result.data)[1]).table.rows
            const formats = []
            data.forEach(function(column)
            {
                const format = []
                column.c.forEach(function(row)
                {
                    if (row)
                    {
                        if (typeof row.v === "string")
                        {
                            if (row.v.includes("Date"))
                            {
                                format.push(row.f)
                                return
                            }
                        }
                        if (typeof row.v === "number")
                        {
                            if (row.f.includes("%"))
                            {
                                format.push(row.f)
                                return
                            }
                        }
                        if (Array.isArray(row.v))
                        {
                            format.push(row.f)
                            return
                        }
                        format.push(row.v)
                        return
                    }
                    format.push(null)
                })
                formats.push(format)
            })
            resolve(formats)
        }).catch(error => reject(error))
    })
}
