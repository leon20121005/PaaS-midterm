import * as firebaseAdmin from "firebase-admin"

import * as memberModel from "./memberModel"
import * as screeningModel from "./screeningModel"
import * as seatModel from "./seatModel"
import { Reservation } from "./model"

const database = firebaseAdmin.firestore()

//
export const reserveTickets = async function(screeningId: string, userId: string, seatId: string, timestamp: number): Promise<void>
{
    const member = await memberModel.getMemberByUserId(userId)
    await database.collection("reservation").add({ screeningId: screeningId, memberId: member.id, seatIds: [seatId], time: timestamp}).then(documentReference => {
        database.collection("reservation").doc(documentReference.id).update({ id: documentReference.id })
    })
}

export const getTickets = async function(): Promise<Reservation[]>
{
    let reservations = null
    await database.collection("reservation").get().then(async snapshot => {
        if (!snapshot.empty)
        {
            reservations = []
            for (let document of snapshot.docs)
            {
                const reservation = new Reservation()
                reservation.id = document.data().id
                reservation.screening = await screeningModel.getScreeningById(document.data().screeningId)
                reservation.member = await memberModel.getMemberById(document.data().memberId)
                reservation.time = document.data().time
                reservations.push(reservation)
            }
        }
    })
    return reservations
}

export const getTicketsByUserId = async function(userId: string): Promise<Reservation[]>
{
    const member = await memberModel.getMemberByUserId(userId)
    let reservations = null
    await database.collection("reservation").where("memberId", "==", member.id).get().then(async snapshot => {
        if (!snapshot.empty)
        {
            reservations = []
            for (let document of snapshot.docs)
            {
                const reservation = new Reservation()
                reservation.id = document.data().id
                reservation.screening = await screeningModel.getScreeningById(document.data().screeningId)
                for (let seatId of document.data().seatIds)
                {
                    const seat = await seatModel.getSeatById(seatId)
                    reservation.seats.push(seat)
                }
                reservation.member = member
                reservation.time = document.data().time
                reservations.push(reservation)
            }
        }
    })
    return reservations
}

export const getTicketById = async function(reservationId: string): Promise<Reservation>
{
    let reservation = null
    await database.collection("reservation").doc(reservationId).get().then(async snapshot => {
        if (snapshot.exists)
        {
            reservation = new Reservation()
            reservation.id = snapshot.data().id
            reservation.screening = await screeningModel.getScreeningById(snapshot.data().screeningId)
            reservation.member = await memberModel.getMemberById(snapshot.data().memberId)
            reservation.time = snapshot.data().time
        }
    })
    return reservation
}

export const deleteTicketById = async function(reservationId: string): Promise<void>
{
    await database.collection("reservation").doc(reservationId).delete().then(function()
    {
        console.log("Document successfully deleted!")
    }).catch(error => console.error("Error removing document: ", error))
}
