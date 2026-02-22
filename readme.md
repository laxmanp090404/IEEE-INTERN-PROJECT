# 🚀 Task Management API — Dockerized Backend

A RESTful Task Management API built with **Node.js, Express, MongoDB, and JWT Authentication**, fully containerized using **Docker + Docker Compose** for easy setup and deployment.

---

## 📦 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Docker
* Docker Compose

---

## 📁 Project Structure

```
Backend-Task
 ├── docker-compose.yml
 └── server
      ├── index.js
      ├── package.json
      ├── Dockerfile
      ├── Config/
      ├── Controllers/
      ├── middleware/
      ├── Models/
      └── Routes/
```

---

## ⚙️ Environment Variables

Create a file:

```
server/.env
```

Add:

```
PORT=5000
DEV_MODE=development
MONGO_URI=mongodb://mongo:27017/taskdb
JWT_SECRET=your_secret_key
```

---

## 🐳 Docker Setup (Recommended)

### 1️⃣ Install Prerequisites

Make sure you have installed:

* Docker Desktop
* Docker Compose

Verify installation:

```
docker --version
docker-compose --version
```

---

### 2️⃣ Build & Start Containers

From project root:

```
docker-compose up --build
```

This will:

* Build backend image
* Pull MongoDB image
* Create containers
* Start API server

---

### 3️⃣ Run in Background

```
docker-compose up -d
```

---

### 4️⃣ Stop Containers

```
docker-compose down
```

---

### 5️⃣ View Logs

```
docker logs backend-container
```

---

## 🌐 API Base URL

Local:

```
http://localhost:5000
```

---

## 🔐 Authentication

Protected routes require JWT token:

```
Authorization: Bearer <your_token>
```

---

## 📌 API Endpoints

### Auth

| Method | Route   | Description |
| ------ | ------- | ----------- |
| POST   | `/auth` | Login user  |

---

### Users

| Method | Route        | Description    |
| ------ | ------------ | -------------- |
| POST   | `/users`     | Register user  |
| GET    | `/users`     | Get all users  |
| GET    | `/users/:id` | Get user by ID |
| PUT    | `/users/:id` | Update user    |

---

### Tasks

| Method | Route        | Description   |
| ------ | ------------ | ------------- |
| GET    | `/tasks`     | Get all tasks |
| GET    | `/tasks/:id` | Get task      |
| POST   | `/tasks`     | Create task   |
| PUT    | `/tasks/:id` | Update task   |
| DELETE | `/tasks/:id` | Delete task   |

---

## 📤 Supported Request Body Types

This API supports:

* JSON → `application/json`
* URL encoded → `application/x-www-form-urlencoded`

---

## 🧠 How Containers Communicate

Inside Docker network:

```
Backend → Mongo connection string:
mongodb://mongo:27017/taskdb
```

`mongo` is the service name defined in docker-compose.

---

## 💾 Persistent Database Storage

MongoDB data is stored in a Docker volume:

```
mongo-data
```

This ensures data persists even if containers stop.

---

## 🛠 Development Without Docker

Run manually:

```
cd server
npm install
npm run server
```

Make sure MongoDB is running locally.

---

## 🔒 Security Notes

Current setup is for only for dev not prod-ready.

<!-- For production:

* Enable MongoDB authentication
* Use HTTPS
* Use strong JWT secret
* Add rate limiting
* Add helmet middleware

--- -->

---

## 👨‍💻 Author

**Laxman P**

