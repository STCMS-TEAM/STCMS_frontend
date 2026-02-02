# Sports Tournaments and Championship Management System (STCMS)
## Frontend Application

This repository contains the **frontend application** of the *Sports Tournaments and Championship Management System (STCMS)* .

The frontend is provided in **two architectural variants**, each maintained in a separate Git branch, in order to support and reflect different backend architectures.

---

## 📌 Project Overview

STCMS is a web-based platform designed to support the management of sports tournaments and championships.  
The frontend provides a user interface that allows users to:

- browse tournaments and championships;
- view matches, results, and standings;
- register and authenticate users;
- manage teams and tournament data (for authorized users);
- read news and blog posts related to tournaments.

The application is implemented as a **Single Page Application (SPA)** and communicates with the backend exclusively through REST APIs.

---

## 🌿 Repository Organization

This repository contains **two main branches**, both implementing the **same frontend application**, but intended to work with different backend architectures.

### `main` branch — Frontend for Monolithic Backend
The `main` branch contains the frontend configured to work with the **monolithic backend architecture**.

Characteristics:
- Frontend served by the monolithic backend
- Same origin for frontend and backend
- API calls performed using relative paths (e.g. `/api/...`)
- No CORS configuration required in production
- Tightly coupled deployment with the backend

---

### `microservices` branch — Frontend for Microservices Backend
The `microservices` branch contains the frontend configured to work with the **microservices-based backend architecture**.

Characteristics:
- Frontend deployed as an **independent application**
- Communication with multiple backend services via APIs
- API endpoints configured using environment variables
- CORS-enabled communication
- Loose coupling between frontend and backend services

---

## 🧩 Frontend Architecture

The frontend is developed using **Angular** and follows a modular, component-based architecture.

Key characteristics:
- Domain-driven folder structure
- Separation between UI components and services
- Centralized routing and navigation
- Reusable components and shared modules
- Reactive state management using Angular services and signals

Each functional area of the system (authentication, tournaments, matches, administration, news) is encapsulated in dedicated modules and components.

---

## 🎨 UI/UX and Responsiveness

- The user interface is built using **Bootstrap**
- Responsive layouts support desktop, tablet, and mobile devices
- Consistent styling and navigation across all views
- Accessibility and usability considered during design

---

## 🔐 Frontend Security

The frontend integrates with the backend security mechanisms and implements:

- JWT-based authentication
- Access token management on the client side
- Secure session handling
- Route protection based on authentication state
- Automatic token injection via HTTP interceptors

---

## 🐳 Deployment Context

While this repository contains **only the frontend**, the deployment strategy differs by branch:

- In the `main` branch, the frontend is bundled and served by the monolithic backend
- In the `microservices` branch, the frontend is deployed independently and communicates with backend services over HTTP

This distinction reflects the architectural differences explored in the project.

---

## ▶️ How to Run the Frontend

### `main` branch (Monolithic Backend)
In the `main` branch, the frontend is served by the monolithic backend.

To run the application:
- Clone the STCMS_project repository and enter the STCMS_project directory.
- Create an .env file like the one in the STCMS_project repository.
- Start the system using `docker-compose up --build -d`

No additional frontend setup is required in this branch.

---

### `microservices` branch (Standalone Frontend)

In the `microservices` branch, the frontend is deployed as an independent Angular application.

#### Prerequisites
- Node.js (v18 or later)
- Angular CLI (`npm install -g @angular/cli`)

#### Steps

```bash

# clone the repository
$ git clone git@github.com:STCMS-TEAM/STCMS_frontend.git

# enter the repository
$ cd STCMS_frontend

# switch to the microservices branch
$ git checkout microservices

# access the app folder
$ cd STCMS_app

# install dependencies
$ npm install

# start the Angular development server
$ ng serve

```

After these steps, the application will be available at http://localhost:4200/ .
