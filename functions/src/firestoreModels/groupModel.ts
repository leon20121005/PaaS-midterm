import * as firebaseAdmin from "firebase-admin"

import { Group } from "./model"

const database = firebaseAdmin.firestore()

export const bindGroup = async function(name: string, lineId: string): Promise<void>
{
    await database.collection("group").add({ name: name, lineId: lineId }).then(documentReference => {
        database.collection("group").doc(documentReference.id).update({ id: documentReference.id })
    })
}

export const getGroups = async function(): Promise<Group[]>
{
    let groups = null
    await database.collection("group").get().then(snapshot => {
        if (!snapshot.empty)
        {
            groups = []
            for (let document of snapshot.docs)
            {
                const group = new Group()
                group.id = document.data().id
                group.name = document.data().name
                group.lineId = document.data().lineId
                groups.push(group)
            }
        }
    })
    return groups
}
