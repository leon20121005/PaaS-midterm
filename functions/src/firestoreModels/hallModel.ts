import * as firebaseAdmin from "firebase-admin"

import * as cinemaModel from "./cinemaModel"
import { Hall } from "./model"

const database = firebaseAdmin.firestore()

export const getHallById = async function(hallId: string): Promise<Hall>
{
    let hall = null
    await database.collection("hall").doc(hallId).get().then(async snapshot => {
        if (snapshot.exists)
        {
            hall = new Hall()
            hall.id = snapshot.data().id
            hall.name= snapshot.data().name
            hall.cinema = await cinemaModel.getCinemaById(snapshot.data().cinemaId)
        }
    })
    return hall
}
