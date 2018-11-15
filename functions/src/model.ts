export class Member
{
    constructor()
    {
        this.dailyDraw = new DailyDraw()
    }
    id: number
    name: string
    phone: number
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

export class Movie
{
    id: number
    name: string
    releaseDate: number
    director: string
    category: string
    runtime: number
}

export class Cinema
{
    id: number
    name: string
    address: string
    phone: number
}

export class Screening
{
    id: number
    movieId: number
    cinemaId: number
    showtime: number
}

export class Reservation
{
    id: number
    screeningId: number
    memberId: number
}

export class Rating
{
    memberId: number
    movieId: number
    rating: number
}
