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
    thumbnail: string
}

export class Cinema
{
    id: number
    name: string
    address: string
    phone: number
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
}

export class Rating
{
    memberId: number
    movieId: number
    rating: number
}
