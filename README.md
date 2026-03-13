# 📚 ShelfWise - Organize, Manage, Borrow — Wisely.

## 🔗 Live Demo

[![🖥️ View ShelfWise Live](https://img.shields.io/badge/ShelfWise-Frontend-blue?style=for-the-badge&logo=vercel)](https://shelf-wise-two.vercel.app)

[![🛠️ Access ShelfWise API](https://img.shields.io/badge/ShelfWise-Backend-green?style=for-the-badge&logo=vercel)](https://library-management-server-redux.vercel.app)

---

## 📖 What is this project about?

**ShelfWise** is a minimal and modern full-stack **Library Management System** built using **React**, **TypeScript**, **Node.js**, **Express**, and **MongoDB**. It allows users to:

* 📚 Browse and filter a collection of books
* 🔍 View book details with real-time availability
* 🔄 Borrow books with automatic stock tracking
* 📊 See a summary of all borrowing activities
* 📚 Add Daily Hadith section with refresh button
---

There is no authentication system — the focus is on mastering **MVC architecture**, **RESTful APIs**, **data modeling with Mongoose**, and **real-world state management with RTK Query** on the frontend. The backend is built with a **modular, scalable TypeScript structure** and uses **Zod** for safe validation, **Mongoose instance methods** for logic, and **MongoDB aggregations** for reporting.

## 1. Project Overview

### 🖥️ ShelfWise (Client)

A modern, responsive single-page application built with React and Redux. ShelfWise empowers users to:

- View a catalog of books
- Search, filter, sort, and browse book details
- See real-time availability statuses
- Allow user to borrow a book
- Allow user to edit/update book
- Show Toast with proper message
- Show Borrow summary in grid card view
- Modern Theme

It's a user-friendly frontend that consumes the MVC server’s RESTful APIs.

### 🛠️ Library‑Management‑MVC‑Server (Backend)

A REST API built using Node.js, Express, and MongoDB (via Mongoose). It powers ShelfWise by providing endpoints to:

- Perform CRUD operations on books
- Track borrowing of books without user authentication
- Keep track of books availabilities and update status accordingly

The architecture follows an MVC pattern, keeping routes, controllers, and models organized.

---

## 2. Tech Stack

| Layer          | Technologies                                           |
| -------------- | ------------------------------------------------------ |
| **Frontend**   | React With Redux, Typescript ShadCn UI Powered by Tailwind 4 |
| **Backend**    | Node.js, Express, MongoDB,Mongoose,Prisma,Jod                   |
| **Dev Tools**  | ESLint, Prettier, nodemon, Postman            |
| **DB Hosting** | MongoDB Atlas                       |
| **Deployment** | Vercel (frontend), Vercel (backend) |

---


