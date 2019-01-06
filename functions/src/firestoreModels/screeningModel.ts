import * as firebaseAdmin from "firebase-admin"

import * as movieModel from "./movieModel"
import * as cinemaModel from "./cinemaModel"
import { Cinema, Screening } from "./model"

const database = firebaseAdmin.firestore()

export const getCinemasByMovieId = async function(movieId: string): Promise<Cinema[]>
{
    let cinemas = null
    await database.collection("screening").where("movieId", "==", movieId).get().then(async snapshot => {
        if (!snapshot.empty)
        {
            cinemas = []
            for (let document of snapshot.docs)
            {
                cinemas.push(await cinemaModel.getCinemaById(document.data().cinemaId))
            }
        }
    })
    return cinemas
}

export const getScreenings = async function(movieId: string, cinemaId: string): Promise<Screening[]>
{
    let screenings = null
    await database.collection("screening").where("movieId", "==", movieId).where("cinemaId", "==", cinemaId).get().then(async snapshot => {
        if (!snapshot.empty)
        {
            screenings = []
            for (let document of snapshot.docs)
            {
                const screening = new Screening()
                screening.id = document.data().id
                screening.movie = await movieModel.getMovieById(movieId)
                screening.cinema = await cinemaModel.getCinemaById(cinemaId)
                screening.showtime = document.data().showtime
                screenings.push(screening)
            }
        }
    })
    return screenings
}

export const getScreeningById = async function(screeningId: string): Promise<Screening>
{
    let screening = null
    await database.collection("screening").doc(screeningId).get().then(async snapshot => {
        if (snapshot.exists)
        {
            screening = new Screening()
            screening.id = snapshot.data().id
            screening.movie = await movieModel.getMovieById(snapshot.data().movieId)
            screening.cinema = await cinemaModel.getCinemaById(snapshot.data().cinemaId)
            screening.showtime = snapshot.data().showtime
        }
    })
    return screening
}
