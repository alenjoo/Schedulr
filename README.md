# Schedulr - Event Management System

Schedulr is a comprehensive event management system designed to streamline the process of organizing and managing events. The application provides a user-friendly interface for creating, updating, searching, and managing events. Built with React for the frontend and Node.js for the backend, this system allows users to access event details, filter and search for events, and interact with a flexible layout.

## Features

- **Event Creation & Management**: Users can create and manage events.
- **Event Search**: Search events by various filters like date, category, and location.
- **Responsive Layout**: The app is designed with a grid-based layout to ensure responsiveness on various devices.
- **User-Friendly Interface**: Clean and modern design with intuitive navigation.
- **Sidebar Navigation**: Fixed sidebar containing links for easy navigation across sections.
- **Event Details Table**: Displays detailed event information in a table format with sorting capabilities.

## Demo

You can access a video walkthrough of the project that explains the features, architecture. (https://drive.google.com/file/d/1R28V_RVzjefVQUcsH1iAnTH4PjeXRzfI/view?usp=drive_link)).

## Installation

Follow the steps below to set up and run the project locally:

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Frontend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/alenjoo/schedulr.git
    ```
2. Navigate to the frontend folder:
    ```bash
    cd schedulr/frontend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the development server:
    ```bash
    npm start
    ```
   The frontend will be accessible at `http://localhost:3000`.

### Backend Setup

1. Navigate to the backend folder:
    ```bash
    cd schedulr/backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the server:
    ```bash
    npm start
    ```
   The backend will be accessible at `http://localhost:5001`.

### Database Setup

Ensure you have a MySQL database set up. Configure the database connection in `backend/config/db.js` with your database credentials.

## Project Structure

### Frontend

/frontend ├── /src ├── /components # React components for various views )  └── App.js # Main entry point for the app


### Backend

/backend ├── /controllers # Handles requests for creating, fetching, and updating events  ├── /routes # API routes for handling events and other functionality ├── /config # Configuration files (e.g., database) └── server.js # Server entry point


## Usage

1. **Create an Event**: Navigate to the Add New Event creation form to add new events.
2. **Search for Events**: Use the filters to find specific events based on criteria like date, category, and location.
3. **View Event Details**: Click on an event in the list to view detailed information.

   ## GitHub Repository

[Schedulr GitHub Repository](https://github.com/alenjoo/schedulr)


