import { Injectable } from "@angular/core"
import { AngularFirestore } from "@angular/fire/firestore"

import { Member } from "../model"

@Injectable()
export class ModelService
{
    constructor(private database: AngularFirestore)
    {
    }

    registerMember(member: Member): Promise<any>
    {
        return this.database.collection<Member>("member").add(JSON.parse(JSON.stringify(member)))
    }
}
