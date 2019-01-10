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
    id: string
    name: string
    releaseDate: number
    director: string
    category: string
    runtime: number
    url: string
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

export class Hall
{
    id: string
    name: string
    cinema: Cinema
}

export class Seat
{
    id: string
    row: string
    column: string
    hall: Hall
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
        this.seats = []
    }
    id: string
    screening: Screening
    seats: Seat[]
    member: Member
    time: number
}
