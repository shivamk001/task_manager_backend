# Task Manager API

A backend REST API built with **Node.js**, **Express**, and **MongoDB** to manage tasks and users.  
The project includes **authentication**, **session management**, and follows a modular, service-based structure.

---

## Features

- User authentication (login, register)
- Session handling with Express sessions
- Password hashing with bcrypt
- MongoDB integration via Mongoose
- Environment configuration loader
- Structured logging
- API documentation support (Postman / Swagger-ready)

---

## Tech Stack

- **TypeScript** – Strongly typed JavaScript for better code quality
- **Node.js** – JavaScript runtime
- **Express** – Web framework
- **MongoDB** – NoSQL database
- **express-validator** - input validation
- **Mongoose** – MongoDB object modeling
- **bcrypt** – Password hashing
- **dotenv** – Environment variable management
- **winston** – Logger

---
## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/taskmanager.git
   cd taskmanager
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**<br>
   Create a prod.env file in the env folder in the root directory and add the following:
   ```bash
    NODE_ENV=production
    MONGODB_URL=mongodb://localhost:27017/task_manager
    APP_PORT=8080
    JWT_KEY=secret
    ```
4. **Run the server**
   ```bash
   npm run server
   ```
---
## Code Documentation
### TypeDoc Documentation
You can check the typedoc documentation [here](https://shivamk001.github.io/task_manager/index.html).

## API Documentation
### Postman API Docs
You can view and test the API endpoints using the Postman collection [here](https://www.postman.com/shivamk001001/shivamk001/collection/r3sivui/task-manager?action=share&creator=18060545).

## Database Documentation
### Draw.io Diagram
You can view the database diagram [here](https://drive.google.com/file/d/1vXzrVMxXfg-msaUGYFJTNGVeJcU1mfZo/view?usp=sharing).

   

