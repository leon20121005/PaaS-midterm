import * as firebaseAdmin from "firebase-admin"

import * as hallModel from "./hallModel"
import { Seat } from "./model"

const database = firebaseAdmin.firestore()

export const getSeatById = async function(seatId: string): Promise<Seat>
{
    let seat = null
    await database.collection("seat").doc(seatId).get().then(async snapshot => {
        if (snapshot.exists)
        {
            seat = new Seat()
            seat.id = snapshot.data().id
            seat.row = snapshot.data().row
            seat.column = snapshot.data().column
            seat.hall = await hallModel.getHallById(snapshot.data().hallId)
        }
    })
    return seat
}

export const getSeatByRowColumn = async function(row: string, column: string): Promise<Seat>
{
    let seat = null
    await database.collection("seat").where("row", "==", row).where("column", "==", column).get().then(async snapshot => {
        if (!snapshot.empty)
        {
            seat = new Seat()
            seat.id = snapshot.docs[0].data().id
            seat.row = snapshot.docs[0].data().row
            seat.column = snapshot.docs[0].data().column
            seat.hall = await hallModel.getHallById(snapshot.docs[0].data().hallId)
        }
    })
    return seat
}
