export class Member
{
    constructor()
    {
        this.dailyDraw = new DailyDraw()
    }
    id: string
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
    id: string
    name: string
    releaseDate: number
    director: string
    category: string
    runtime: number
    thumbnail: string
}

export class Cinema
{
    id: string
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
    id: string
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
    id: string
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
    id: string
    name: string
    lineId: string
}

export class Prize
{
    id: string
    serialNumber: string
    member: Member
    time: number
}
