# Book Note Application

## Overview
This is a web application for managing book notes and personal library. Users can add books with titles, authors, ratings, notes, and cover images. The application allows viewing, editing, and deleting books in your personal library.

## Features
- View a collection of books with cover images, titles, authors, and ratings
- Add new books to your personal library
- Edit existing book information
- Delete books from your library
- Sort books by title, author, or rating

## Technologies Used
- Node.js with Express.js framework
- EJS templating engine
- PostgreSQL database
- Bootstrap for styling
- AOS (Animate On Scroll) library for animations

## Project Structure
- `app.js` - Main application file with routing logic
- `views/` - EJS template files for rendering pages
- `public/` - Static files (CSS, client-side JavaScript)
- `node_modules/` - Project dependencies

## Database Schema
The application uses two main tables:
1. `cover` - Contains book information (title, author, image_url, rating) and notes
2. `new_book` - User's personal library with similar structure

## Routes
- GET `/` - Home page displaying book collection
- GET `/new` - Form to add a new book
- GET `/book` - User's personal library
- POST `/new` - Handle new book submission
- POST `/delete/:id` - Delete a book from library
- GET `/edit/:id` - Form to edit a book
- POST `/edit/:id` - Handle book update

## How to Run
1. Install dependencies: `npm install`
2. Set up PostgreSQL database and configure environment variables in `.env` file
3. Start the server: `npm start`
4. Visit `http://localhost:3000` in your browser

## Environment Variables
Create a `.env` file with the following variables:
- DB_USER=your_database_user
- DB_HOST=your_database_host
- DB_DATABASE=your_database_name
- DB_PASSWORD=your_database_password
- DB_PORT=your_database_port (usually 5432)

## Dependencies
- express: Web framework
- ejs: Embedded JavaScript templating
- pg: PostgreSQL client
- bootstrap: Frontend framework
- aos: Animation library
- dotenv: Environment variable loader
- body-parser: Parse incoming request bodies