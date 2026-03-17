const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const db = require("./config/db")

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

/* =========================
   LISTAR PELICULAS
========================= */

app.get("/movies", (req, res) => {

    const query = `
    SELECT 
        m.movieId,
        m.title,
        m.genres,
        IFNULL(ROUND(AVG(r.rating),1), 0) AS rating,
        COUNT(r.rating) AS votos
    FROM movies m
    LEFT JOIN (
        SELECT movieId, rating FROM ratings_dataset
        UNION ALL
        SELECT movieId, rating FROM ratings
        UNION ALL
        SELECT movieId, rating FROM reviews
    ) r
    ON m.movieId = r.movieId
    GROUP BY m.movieId
    LIMIT 100
    `

    db.query(query, (err, result) => {
        if(err) return res.status(500).json(err)
        res.json(result)
    })
})

/* =========================
   BUSCAR
========================= */

app.get("/search", (req, res) => {

    const title = req.query.title

    const query = `
    SELECT 
        m.movieId,
        m.title,
        m.genres,
        IFNULL(ROUND(AVG(r.rating),1), 0) AS rating,
        COUNT(r.rating) AS votos
    FROM movies m
    LEFT JOIN (
        SELECT movieId, rating FROM ratings_dataset
        UNION ALL
        SELECT movieId, rating FROM ratings
        UNION ALL
        SELECT movieId, rating FROM reviews
    ) r
    ON m.movieId = r.movieId
    WHERE m.title LIKE ?
    GROUP BY m.movieId
    `

    db.query(query, [`%${title}%`], (err, result) => {
        if(err) return res.status(500).json(err)
        res.json(result)
    })
})

/* =========================
   TOP PELICULAS
========================= */

app.get("/top-movies", (req, res) => {

    const query = `
    SELECT 
        m.title,
        ROUND(AVG(r.rating),2) AS promedio,
        COUNT(r.rating) AS votos
    FROM (
        SELECT movieId, rating FROM ratings_dataset
        UNION ALL
        SELECT movieId, rating FROM ratings
        UNION ALL
        SELECT movieId, rating FROM reviews
    ) r
    JOIN movies m ON r.movieId = m.movieId
    GROUP BY r.movieId
    HAVING votos > 5
    ORDER BY promedio DESC
    LIMIT 10
    `

    db.query(query, (err, result) => {
        if(err) return res.status(500).json(err)
        res.json(result)
    })
})

/* =========================
   CALIFICAR (RATING)
========================= */

app.post("/rate-movie", (req, res) => {

    const { movieId, rating } = req.body

    const query = `
    INSERT INTO ratings (userId, movieId, rating)
    VALUES (999, ?, ?)
    `

    db.query(query, [movieId, rating], (err, result) => {
        if(err) return res.status(500).json(err)
        res.json({ message: "Rating guardado ✅" })
    })
})

/* =========================
   RESEÑAS
========================= */

/* CREAR RESEÑA */

app.post("/review", (req, res) => {

    const { userName, movieId, rating, comment } = req.body

    const query = `
    INSERT INTO reviews (userName, movieId, rating, comment)
    VALUES (?, ?, ?, ?)
    `

    db.query(query, [userName, movieId, rating, comment], (err, result) => {

        if(err){
            return res.status(500).json(err)
        }

        res.json({ message: "Reseña guardada ✅" })

    })

})

/* OBTENER RESEÑAS */

app.get("/reviews/:movieId", (req, res) => {

    const movieId = req.params.movieId

    const query = `
    SELECT userName, rating, comment, createdAt
    FROM reviews 
    WHERE movieId = ?
    ORDER BY createdAt DESC
    `

    db.query(query, [movieId], (err, result) => {

        if(err){
            return res.status(500).json(err)
        }

        res.json(result)

    })

})

/* =========================
   SERVIDOR
========================= */

const PORT = 3000

app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`)
})