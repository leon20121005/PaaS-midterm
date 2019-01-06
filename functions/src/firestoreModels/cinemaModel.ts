import * as firebaseAdmin from "firebase-admin"

import { Cinema } from "./model"

const database = firebaseAdmin.firestore()

export const getCinemas = async function(): Promise<Cinema[]>
{
    let cinemas = null
    await database.collection("cinema").get().then(snapshot => {
        if (!snapshot.empty)
        {
            cinemas = []
            for (let document of snapshot.docs)
            {
                cinemas.push(loadCinema(document.data()))
            }
        }
    })
    return cinemas
}

export const getCinemaById = async function(cinemaId: string): Promise<Cinema>
{
    let cinema = null
    await database.collection("cinema").doc(cinemaId).get().then(snapshot => {
        if (snapshot.exists)
        {
            cinema = loadCinema(snapshot.data())
        }
    })
    return cinema
}

const loadCinema = function(data): Cinema
{
    const cinema = new Cinema()
    cinema.id = data.id
    cinema.name = data.name
    cinema.address = data.address
    cinema.phone = data.phone
    cinema.thumbnail = data.thumbnail
    return cinema
}
