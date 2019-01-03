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

export class Movie
{
    id: number
    name: string
    releaseDate: number
    director: string
    category: string
    runtime: number
    thumbnail: string
}

export class Cinema
{
    id: number
    name: string
    address: string
    phone: string
    thumbnail: string
}

export class Screening
{
    constructor()
    {
        this.movie = new Movie()
        this.cinema = new Cinema()
    }
    id: number
    movie: Movie
    cinema: Cinema
    showtime: number
}

export class Reservation
{
    constructor()
    {
        this.screening = new Screening()
        this.member = new Member()
    }
    id: number
    screening: Screening
    member: Member
    time: number
}

export class Rating
{
    memberId: number
    movieId: number
    rating: number
}

export class Group
{
    id: number
    name: string
    lineId: string
}

export class Prize
{
    id: number
    serialNumber: string
    member: Member
    time: number
}

export const getConditionExpression = function(key: string, values: number | number[]): string
{
    if (!Array.isArray(values))
    {
        return key + " = " + String(values)
    }
    let expression = ""
    for (let value of values)
    {
        expression += key + " = " + value + " or "
    }
    return expression.slice(0, -4)
}
