const API_MOVIES = "http://localhost:3000/movies"
const API_SEARCH = "http://localhost:3000/search?title="
const API_TOP = "http://localhost:3000/top-movies"
const API_RATE = "http://localhost:3000/rate-movie"
const API_REVIEW = "http://localhost:3000/review"

const container = document.getElementById("movies")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const allBtn = document.getElementById("allBtn")
const topContainer = document.getElementById("topMovies")
const favContainer = document.getElementById("favorites")

/* =========================
   RENDER MOVIES
========================= */

function renderMovies(data){

    container.innerHTML = ""

    data.forEach(movie => {

        const card = document.createElement("div")
        card.classList.add("movie-card")

        card.innerHTML = `
        <img src="https://picsum.photos/200/300?random=${movie.movieId}" />

        <h3>${movie.title}</h3>
        <p>${movie.genres}</p>

        <p class="rating">
        ⭐ ${movie.rating > 0 ? movie.rating : "Sin rating"} 
        (${movie.votos} reseñas)
        </p>

        <select class="rating-select">
            <option value="5">⭐ 5</option>
            <option value="4">⭐ 4</option>
            <option value="3">⭐ 3</option>
            <option value="2">⭐ 2</option>
            <option value="1">⭐ 1</option>
        </select>

        <button class="rate-btn">Calificar</button>
        <button class="fav-btn">❤️ Favorito</button>

        <input class="user-name" placeholder="Tu nombre" />
        <textarea class="review-text" placeholder="Escribe tu reseña"></textarea>
        <button class="review-btn">Enviar reseña</button>

        <div class="reviews"></div>
        `

        const btn = card.querySelector(".rate-btn")
        const select = card.querySelector(".rating-select")
        const favBtn = card.querySelector(".fav-btn")

        const reviewBtn = card.querySelector(".review-btn")
        const userInput = card.querySelector(".user-name")
        const reviewText = card.querySelector(".review-text")
        const reviewsContainer = card.querySelector(".reviews")

        /* ⭐ CALIFICAR */
        btn.addEventListener("click", () => {

            fetch(API_RATE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    movieId: movie.movieId,
                    rating: select.value
                })
            })
            .then(res => res.json())
            .then(() => {
                alert("⭐ Calificación guardada")
                loadMovies()
                loadTopMovies()
            })

        })

        /* ❤️ FAVORITO */
        let favs = JSON.parse(localStorage.getItem("favorites")) || []
        const isFav = favs.find(f => f.movieId === movie.movieId)

        if(isFav){
            favBtn.style.background = "#00c853"
            favBtn.textContent = "💚 Guardado"
        }

        favBtn.addEventListener("click", () => {
            toggleFavorite(movie)
            loadMovies()
        })

        /* 📝 RESEÑA */
        reviewBtn.addEventListener("click", () => {

            if(!userInput.value || !reviewText.value){
                alert("Completa nombre y reseña 😅")
                return
            }

            fetch(API_REVIEW, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userName: userInput.value,
                    movieId: movie.movieId,
                    rating: select.value,
                    comment: reviewText.value
                })
            })
            .then(res => res.json())
            .then(() => {

                alert("📝 Reseña enviada")

                userInput.value = ""
                reviewText.value = ""

                loadReviews(movie.movieId, reviewsContainer)
                loadMovies()
                loadTopMovies()

            })

        })

        // 👇 cargar reseñas al renderizar
        loadReviews(movie.movieId, reviewsContainer)

        container.appendChild(card)

    })

}

/* =========================
   CARGAR PELÍCULAS
========================= */

function loadMovies(){
    fetch(API_MOVIES)
    .then(res => res.json())
    .then(data => renderMovies(data))
}

loadMovies()

/* =========================
   BUSCAR
========================= */

searchBtn.addEventListener("click", () => {

    const query = searchInput.value

    fetch(API_SEARCH + query)
    .then(res => res.json())
    .then(data => renderMovies(data))

})

/* =========================
   VOLVER A TODAS
========================= */

allBtn.addEventListener("click", () => {
    loadMovies()
})

/* =========================
   TOP MOVIES
========================= */

function loadTopMovies(){

    topContainer.innerHTML = ""

    fetch(API_TOP)
    .then(res => res.json())
    .then(data => {

        data.forEach(movie => {

            const card = document.createElement("div")
            card.classList.add("top-card")

            card.innerHTML = `
            <strong>${movie.title}</strong><br>
            ⭐ ${movie.promedio} (${movie.votos} votos)
            `

            topContainer.appendChild(card)

        })

    })

}

loadTopMovies()

/* =========================
   FAVORITOS
========================= */

function toggleFavorite(movie){

    let favs = JSON.parse(localStorage.getItem("favorites")) || []

    const exists = favs.find(f => f.movieId === movie.movieId)

    if(exists){
        favs = favs.filter(f => f.movieId !== movie.movieId)
        alert("❌ Eliminado de favoritos")
    } else {
        favs.push(movie)
        alert("❤️ Agregado a favoritos")
    }

    localStorage.setItem("favorites", JSON.stringify(favs))
    loadFavorites()
}

function loadFavorites(){

    favContainer.innerHTML = ""

    const favs = JSON.parse(localStorage.getItem("favorites")) || []

    favs.forEach(movie => {

        const card = document.createElement("div")
        card.classList.add("fav-card")

        card.innerHTML = `
        <strong>${movie.title}</strong>
        <button class="remove-fav">❌</button>
        `

        const btn = card.querySelector(".remove-fav")

        btn.addEventListener("click", () => {
            toggleFavorite(movie)
        })

        favContainer.appendChild(card)

    })

}

loadFavorites()

/* =========================
   REVIEWS
========================= */

function loadReviews(movieId, container){

    fetch(`http://localhost:3000/reviews/${movieId}`)
    .then(res => res.json())
    .then(data => {

        container.innerHTML = ""

        if(data.length === 0){
            container.innerHTML = "<small>Sin reseñas aún</small>"
            return
        }

        data.forEach(r => {

            const div = document.createElement("div")
            div.classList.add("review-item")

            div.innerHTML = `
                <strong>${r.userName}</strong> ⭐ ${r.rating}<br>
                <small>${r.comment}</small>
            `

            container.appendChild(div)

        })

    })

}