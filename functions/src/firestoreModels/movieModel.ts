import * as firebaseAdmin from "firebase-admin"

import { Movie } from "./model"

const database = firebaseAdmin.firestore()

export const getMoviesByReleaseDate = async function(): Promise<Movie[]>
{
    let movies = null
    await database.collection("movie").orderBy("releaseDate", "desc").get().then(snapshot => {
        if (!snapshot.empty)
        {
            movies = []
            for (let document of snapshot.docs)
            {
                movies.push(loadMovie(document.data()))
            }
        }
    })
    return movies
}

export const getMovieById = async function(movieId: string): Promise<Movie>
{
    let movie = null
    await database.collection("movie").doc(movieId).get().then(snapshot => {
        if (snapshot.exists)
        {
            movie = loadMovie(snapshot.data())
        }
    })
    return movie
}

const loadMovie = function(data): Movie
{
    const movie = new Movie()
    movie.id = data.id
    movie.name = data.name
    movie.releaseDate = data.releaseDate
    movie.director = data.director
    movie.category = data.category
    movie.runtime = data.runtime
    movie.thumbnail = data.thumbnail
    return movie
}
