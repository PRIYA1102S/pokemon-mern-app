# Pokémon MERN App

## Overview
This is a MERN stack application that allows users to search for Pokémon using the PokeAPI. The application features a homepage with a search bar, a daily random Pokémon card, a search results page, and a details page for displaying Pokémon attributes.

## Features
- **Homepage**: Includes a search bar for Pokémon names and displays a daily random Pokémon card.
- **Search Functionality**: Users can search for Pokémon by name, with results displayed on a separate page.
- **Details Page**: Displays detailed information about a selected Pokémon.

## Technologies Used
- **MongoDB**: Database for storing Pokémon data.
- **Express.js**: Web framework for Node.js to handle server-side logic.
- **React**: Frontend library for building user interfaces.
- **Node.js**: JavaScript runtime for the server-side application.

## Setup Instructions

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB installed and running.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd pokemon-mern-app
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

### Running the Application
1. Start the server:
   ```
   cd server
   npm start
   ```

2. Start the client:
   ```
   cd ../client
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## API Endpoints
- **GET /api/pokemon/search**: Search for Pokémon by name.
- **GET /api/pokemon/:id**: Retrieve details for a specific Pokémon.

## Contributing
Feel free to submit issues or pull requests for improvements or bug fixes.

## License
This project is licensed under the MIT License.