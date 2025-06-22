# Pokémon MERN App

This is a web application built using the MERN stack (MongoDB, Express, React, Node.js) that allows users to search for Pokémon, view details about them, and see a daily random Pokémon card.

## Features

- **Homepage**: Includes a search bar for Pokémon names and displays a daily random Pokémon card.
- **Search Functionality**: Users can search for Pokémon by name, with results displayed on a separate results page.
- **Details Page**: Users can click on a Pokémon from the search results to view detailed information about it.
- **Daily Random Pokémon**: A random Pokémon card is displayed daily on the homepage.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API**: PokeAPI for fetching Pokémon data

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running (if using a local database).

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

4. Set up your database connection in `server/src/config/db.js`.

5. Start the server:
   ```
   npm start
   ```

6. In a new terminal, navigate to the client directory and start the React application:
   ```
   cd client
   npm start
   ```

### Usage

- Open your browser and go to `http://localhost:3000` to access the application.
- Use the search bar to find Pokémon or view the daily random Pokémon card.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.

## License

This project is licensed under the MIT License.