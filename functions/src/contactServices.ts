const moduleName = "contactServices"

import { Member } from "./model"

export const getMember = async function(lineId: string): Promise<Member>
{
    const member = new Member()
    member.id = 0
    member.name = "test"
    member.phone = 0
    member.email = "test"
    member.lindId = "test"
    member.role = "test"
    member.dailyDraw.drawCount = 0
    member.dailyDraw.lastDrawTime = null
    return member
}

export const updateMemberData = async (member: Member): Promise<void> => {
    return
}
