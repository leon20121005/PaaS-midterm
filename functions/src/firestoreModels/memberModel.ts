import * as firebaseAdmin from "firebase-admin"

import { Member } from "./model"

const database = firebaseAdmin.firestore()

export const bindMember = async function(name: string, lineId: string): Promise<void>
{
	await database.collection("member").add({
        name: name,
        phone: "",
        email: "",
        lineId: lineId,
        role: "member",
        dailyDraw: {
            drawCount: 0,
            lastDrawTime: 0
        }
    }).then(documentReference => {
	    database.collection("member").doc(documentReference.id).update({ id: documentReference.id })
	})
}

export const getMembersLineId = async function(): Promise<Member[]>
{
	let members = null
	await database.collection("member").get().then(snapshot => {
		if (!snapshot.empty)
		{
			members = []
			for (let document of snapshot.docs)
			{
				const member = new Member()
				member.id = document.data().id
				member.lineId = document.data().lineId
				members.push(member)
			}
		}
	})
	return members
}

export const getMemberById = async function(memberId: string): Promise<Member>
{
	let member = null
	await database.collection("member").doc(memberId).get().then(snapshot => {
		if (snapshot.exists)
		{
			member = new Member()
			member.id = snapshot.data().id
			member.name = snapshot.data().name
			member.phone = snapshot.data().phone
			member.email = snapshot.data().email
			member.lineId = snapshot.data().lineId
			member.role = snapshot.data().role
			member.dailyDraw.drawCount = snapshot.data().dailyDraw.drawCount
			member.dailyDraw.lastDrawTime = snapshot.data().dailyDraw.lastDrawTime
		}
	})
	return member
}

export const getMemberByUserId = async function(lineId: string): Promise<Member>
{
	let member = null
	await database.collection("member").where("lineId", "==", lineId).get().then(snapshot => {
		if (!snapshot.empty)
		{
			member = new Member()
			member.id = snapshot.docs[0].data().id
			member.name = snapshot.docs[0].data().name
			member.phone = snapshot.docs[0].data().phone
			member.email = snapshot.docs[0].data().email
			member.lineId = snapshot.docs[0].data().lineId
			member.role = snapshot.docs[0].data().role
			member.dailyDraw.drawCount = snapshot.docs[0].data().dailyDraw.drawCount
			member.dailyDraw.lastDrawTime = snapshot.docs[0].data().dailyDraw.lastDrawTime
		}
	})
	return member
}

export const updateMemberDailyDraw = async function(member: Member): Promise<void>
{
	database.collection("member").doc(member.id).update({ dailyDraw: { drawCount: member.dailyDraw.drawCount, lastDrawTime: member.dailyDraw.lastDrawTime } })
}
