# 🎬 Movie Rating System

Sistema web para visualizar, calificar y reseñar películas en tiempo real, utilizando arquitectura cliente-servidor y base de datos relacional.

---

## 🚀 Descripción

Este proyecto permite:

* 📽️ Ver listado de películas
* ⭐ Calificar películas
* 📝 Escribir reseñas en tiempo real
* ❤️ Guardar favoritos (localStorage)
* 🔍 Buscar películas por nombre
* 🏆 Ver top de películas mejor calificadas

---

## 🧠 Arquitectura

El sistema está dividido en 3 capas:

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js + Express
* **Base de datos:** MySQL (phpMyAdmin / XAMPP)

---

## 🧰 Tecnologías utilizadas

* Node.js
* Express.js
* MySQL
* HTML5
* CSS3
* JavaScript (Vanilla)
* Git & GitHub

---

## 📁 Estructura del proyecto

```
movie-rating-system/
│
├── backend/
│   ├── src/
│   ├── package.json
│
├── frontend/
│   ├── pages/
│   ├── js/
│   ├── css/
│
├── dataset/
│   ├── movies_small.csv
│   ├── ratings_small.csv
│
└── README.md
```

---

## ⚙️ Requisitos

Antes de ejecutar el proyecto debes tener instalado:

* Node.js
* MySQL (XAMPP recomendado)
* Git
* Navegador web (Chrome recomendado)

---

## 🛠️ Instalación paso a paso

### 1️⃣ Clonar el repositorio

```
git clone https://github.com/Evankhells/movie-rating-system.git
cd movie-rating-system
```

---

### 2️⃣ Configurar la base de datos

1. Abrir **XAMPP**

2. Iniciar **Apache** y **MySQL**

3. Entrar a:
   👉 http://localhost/phpmyadmin

4. Crear base de datos:

```
movierating
```

---

### 3️⃣ Crear tablas

Ejecutar en SQL:

```sql
CREATE TABLE movies (
  movieId INT PRIMARY KEY,
  title VARCHAR(255),
  genres VARCHAR(255)
);

CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  movieId INT,
  rating FLOAT
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userName VARCHAR(100),
  movieId INT,
  rating FLOAT,
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4️⃣ Importar dataset

Importar archivos:

* `movies_small.csv`
* `ratings_small.csv`

Desde phpMyAdmin usando la opción **Importar (CSV)**

---

### 5️⃣ Configurar backend

Entrar a la carpeta backend:

```
cd backend
npm install
```

---

### 6️⃣ Configurar conexión a MySQL

Editar archivo:

```
backend/src/config/db.js
```

Y colocar tus datos:

```js
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "movierating"
});
```

---

### 7️⃣ Ejecutar backend

```
node src/index.js
```

Debería mostrar:

```
Servidor corriendo en http://localhost:3000
```

---

### 8️⃣ Ejecutar frontend

Abrir el archivo:

```
frontend/pages/index.html
```

En el navegador

---

## 🌐 Endpoints principales

| Método | Ruta         | Descripción      |
| ------ | ------------ | ---------------- |
| GET    | /movies      | Listar películas |
| GET    | /search      | Buscar películas |
| GET    | /top-movies  | Top películas    |
| POST   | /rate-movie  | Calificar        |
| POST   | /review      | Crear reseña     |
| GET    | /reviews/:id | Obtener reseñas  |

---

## 💡 Funcionalidades destacadas

* 🔄 Actualización en tiempo real de ratings
* 📊 Promedio calculado con SQL (AVG)
* 📈 Conteo de votos (COUNT)
* 🔗 Unión de datasets + usuarios (UNION)
* 💾 Favoritos con localStorage

---

## ⚠️ Notas

* El dataset completo no se incluye por tamaño
* Se utiliza una versión reducida (`*_small.csv`)
* Para pruebas completas, se recomienda usar el dataset original de MovieLens

---

## 👨‍💻 Autor

**Carlos Alberto Dorado Vega**

---

## 📌 Estado del proyecto

🚧 En desarrollo 

📊 Diagrama de capas de la estructura del proyecto
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/fddb0be3-e9b3-4359-8a92-1ef31071474e" />

