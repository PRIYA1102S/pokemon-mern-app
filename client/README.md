# Pokémon MERN App

## Overview
This is a MERN stack web application that allows users to search for Pokémon using the PokeAPI. The application features a homepage with a search bar, a daily random Pokémon card, a search results page, and a details page for displaying Pokémon attributes.

## Features
- **Homepage**: Displays a search bar and a daily random Pokémon card.
- **Search Functionality**: Users can search for Pokémon by name.
- **Search Results Page**: Displays a list of Pokémon that match the search query.
- **Details Page**: Shows detailed information about a selected Pokémon.

## Technologies Used
- **MongoDB**: Database for storing Pokémon data.
- **Express.js**: Web framework for Node.js to handle API requests.
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

2. Navigate to the client directory and install dependencies:
   ```
   cd client
   npm install
   ```

3. Navigate to the server directory and install dependencies:
   ```
   cd ../server
   npm install
   ```

### Running the Application
1. Start the server:
   ```
   cd server
   npm start
   ```

2. In a new terminal, start the client:
   ```
   cd client
   npm start
   ```

3. Open your browser and go to `http://localhost:3000` to view the application.

## API Endpoints
- **GET /api/pokemon**: Search for Pokémon by name.
- **GET /api/pokemon/:id**: Retrieve details of a specific Pokémon.

## Contributing
Feel free to fork the repository and submit pull requests for any improvements or features you would like to add.

## License
This project is licensed under the MIT License.