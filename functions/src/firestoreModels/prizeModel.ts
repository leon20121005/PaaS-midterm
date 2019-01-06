import * as firebaseAdmin from "firebase-admin"

import * as memberModel from "./memberModel"
import { Prize } from "./model"

const database = firebaseAdmin.firestore()

export const getAvailablePrize = async function(): Promise<Prize>
{
    let prize = null
    await database.collection("prize").where("memberId", "==", "").get().then(snapshot => {
        if (!snapshot.empty)
        {
            prize = new Prize()
            prize.id = snapshot.docs[0].data().id
            prize.serialNumber = snapshot.docs[0].data().serialNumber
        }
    })
    return prize
}

export const writeWinner = async function(prize: Prize, timestamp: number): Promise<void>
{
    await database.collection("prize").doc(prize.id).update({ memberId: prize.member.id, time: timestamp })
}

export const getPrizesByUserId = async function(userId: string): Promise<Prize[]>
{
    const member = await memberModel.getMemberByUserId(userId)
    let prizes = null
    await database.collection("prize").where("memberId", "==", member.id).get().then(snapshot => {
        if (!snapshot.empty)
        {
            prizes = []
            for (let document of snapshot.docs)
            {
                const prize = new Prize()
                prize.id = document.data().id
                prize.serialNumber = document.data().serialNumber
                prize.member = member
                prize.time = document.data().time
                prizes.push(prize)
            }
        }
    })
    return prizes
}
