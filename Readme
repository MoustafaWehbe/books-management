# Books Management

## 📌 Overview
Books Management is a monorepo project built with **Yarn Workspaces**, consisting of a **Next.js client** and an **Express/SQLite backend**. The project is structured as follows:

```
books-management/
├── packages/
│   ├── client/  # Next.js Frontend
│   ├── server/  # Express Backend
├── package.json # Root configuration
├── yarn.lock    # Dependency lock file
└── README.md    # Project documentation
```

---
## 🚀 Getting Started
### 1️⃣ Install Dependencies
Ensure you have **Yarn** installed. If not, install it globally:
```sh
npm install -g yarn
```
Then, install all dependencies:
```sh
yarn install
```

### 2️⃣ Start the Application
To start both the **server** and **client** simultaneously, run:
```sh
yarn start
```
Alternatively, you can start them separately:
```sh
yarn start:server  # Starts the backend
yarn start:client  # Starts the frontend
```

---
## 🏗️ Project Structure
The project is managed using **Yarn Workspaces**, with two main packages:

### 🔹 Client (Next.js)
- Path: `packages/client`
- Commands:
  ```sh
  yarn workspace client dev     # Start development server
  yarn workspace client build   # Build the app
  yarn workspace client start   # Start the production server
  yarn workspace client lint    # Run ESLint
  ```

### 🔹 Server (Express + SQLite)
- Path: `packages/server`
- Commands:
  ```sh
  yarn workspace server start   # Start the backend server
  yarn workspace server test    # Run tests
  ```

---
## ⚙️ Configuration
### 📜 Environment Variables (not required for running the project locally)
Copy a `.env.example` file inside the **server** into a new `.env` file. Do the same for the client app.

---
## 🛠️ Development
### 🧪 Running Tests
The backend uses **Mocha + Chai + Supertest** for testing. To run tests:
```sh
yarn workspace server test
```

### 🔍 Linting & Formatting
The client has ESLint configured. Run:
```sh
yarn workspace client lint
```

---
## 📄 License
This project is licensed under the **MIT License**.

---
## 👤 Author
**Moustafa**  
Email: moustafawehbe102@gmail.com

