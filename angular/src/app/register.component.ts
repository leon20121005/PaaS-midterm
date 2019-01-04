import { Component } from "@angular/core"
import { ActivatedRoute } from "@angular/router"

import { config } from "../environments/config"
import { Member } from "./model"
import { ModelService } from "./services/modelService"

@Component({
    selector: "register",
    templateUrl: "./views/register.component.html",
    styleUrls: ["./app.component.css"]
})

export class RegisterComponent
{
    member: Member = new Member()
    errorMessage: string

    phonePattern = new RegExp("^09[0-9]{8}$")
    emailPattern = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9]+")

    constructor(private activatedRoute: ActivatedRoute, private modelService: ModelService)
    {
        this.activatedRoute.queryParams.subscribe(params => {
            if (!params.lineid)
            {
            }
            else
            {
                this.member.lineId = params.lineid
            }
        })
    }

    onSubmit(): void
    {
        this.errorMessage = ""
        if (!this.member.name)
        {
            this.errorMessage += this.getErrorMessage(-1) + "<br>"
        }
        if (!this.phonePattern.test(this.member.phone))
        {
            this.errorMessage += this.getErrorMessage(-2) + "<br>"
        }
        if (!this.emailPattern.test(this.member.email))
        {
            this.errorMessage += this.getErrorMessage(-3) + "<br>"
        }
        if (this.errorMessage == "")
        {
            this.member.role = "member"
            this.member.dailyDraw.drawCount = 0
            this.member.dailyDraw.lastDrawTime = 0
            this.modelService.registerMember(this.member).then(function()
            {
                window.location.href = config.lineBotUrl
            })
        }
    }

    getErrorMessage(errorCode: number): string
    {
        let errorMessage
        switch (errorCode)
        {
            case -1:
                errorMessage = "請輸入姓名"
                break
            case -2:
                errorMessage = "手機格式錯誤"
                break
            case -3:
                errorMessage = "信箱格式錯誤"
                break
            default:
                break
        }
        return errorMessage
    }
}
