export class Member
{
    constructor()
    {
        this.dailyDraw = new DailyDraw()
    }
    id: number
    name: string
    phone: string
    email: string
    lineId: string
    role: string
    dailyDraw: DailyDraw
}

export class DailyDraw
{
    drawCount: number
    lastDrawTime: number
}
