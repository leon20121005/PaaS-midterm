import { Injectable } from "@angular/core"
import { AngularFirestore } from "@angular/fire/firestore"
import { Http } from "@angular/http"

import { Member, Screening, Reservation } from "../model"

@Injectable()
export class ModelService
{
    constructor(private database: AngularFirestore, private http: Http)
    {
    }

    registerMember(member: Member): Promise<any>
    {
        return this.database.collection<Member>("member").add(JSON.parse(JSON.stringify(member)))
    }

    async reserveTickets(screeningId: string, userId: string, row: string, column: string, timestamp: number): Promise<any>
    {
        return this.http.post("https://0df1b43a.ngrok.io/paas-midterm-6355f/us-central1/httpReserveTickets", { screeningId: screeningId, userId: userId, row: row, column: column, timestamp: timestamp }).toPromise()
    }
}
