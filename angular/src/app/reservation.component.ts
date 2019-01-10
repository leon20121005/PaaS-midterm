import { Component } from "@angular/core"
import { ActivatedRoute } from "@angular/router"

import { config } from "../environments/config"
import { Reservation } from "./model"
import { ModelService } from "./services/modelService"

@Component({
    selector: "register",
    templateUrl: "./views/reservation.component.html",
    styleUrls: ["./app.component.css"]
})

export class ReservationComponent
{
    screeningId: string
    lineId: string

    previous: string
    current: string

    constructor(private activatedRoute: ActivatedRoute, private modelService: ModelService)
    {
        this.activatedRoute.queryParams.subscribe(params => {
            this.screeningId = params.screeningid
            this.lineId = params.lineid
        })
    }

    onClick(event): void
    {
        this.previous = this.current
        this.current = event.target.attributes.id.value
        if (this.previous != undefined)
        {
            document.getElementById(this.previous).setAttribute("src", "https://sales.vscinemas.com.tw/VieShowTicket/img/standard_available.png")
        }
        else
        {
            document.getElementById("submit").removeAttribute("disabled")
        }
        document.getElementById(this.current).setAttribute("src", "https://sales.vscinemas.com.tw/VieShowTicket/img/standard_selected.png")
    }

    async onSubmit(): Promise<void>
    {
        const row = this.current.split("-")[0]
        const column = this.current.split("-")[1]
        await this.modelService.reserveTickets(this.screeningId, this.lineId, row, column, Date.now())
        window.location.href = config.lineBotUrl
    }
}
