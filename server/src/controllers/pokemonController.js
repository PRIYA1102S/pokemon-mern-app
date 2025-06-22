const axios = require('axios');
const Pokemon = require('../models/Pokemon');
const logger = require('../config/logger');
const { ApiResponse, asyncHandler, AppError } = require('../utils/apiResponse');

// Helper function to check if database is connected
const isDatabaseConnected = () => {
    return require('mongoose').connection.readyState === 1;
};

// Helper function to save Pokemon data to database
const savePokemonToDb = async (pokemonData) => {
    logger.debug(`Attempting to save Pokemon: ${pokemonData.name}`);

    if (!isDatabaseConnected()) {
        logger.warn('Database not connected - skipping save operation');
        return; // Skip database operations if not connected
    }

    logger.debug('Database connected - proceeding with save operation');

    try {
        const existingPokemon = await Pokemon.findOne({ name: pokemonData.name.toLowerCase() });
        if (!existingPokemon) {
            logger.info(`Creating new Pokemon record for: ${pokemonData.name}`);
            const pokemon = new Pokemon({
                id: pokemonData.id,
                name: pokemonData.name.toLowerCase(),
                height: pokemonData.height,
                weight: pokemonData.weight,
                base_experience: pokemonData.base_experience,
                types: pokemonData.types.map(type => type.type.name),
                abilities: pokemonData.abilities.map(ability => ability.ability.name),
                stats: pokemonData.stats.map(stat => ({
                    base_stat: stat.base_stat,
                    stat: stat.stat.name
                })),
                imageUrl: pokemonData.sprites.front_default,
                sprites: {
                    front_default: pokemonData.sprites.front_default,
                    back_default: pokemonData.sprites.back_default,
                    front_shiny: pokemonData.sprites.front_shiny,
                    back_shiny: pokemonData.sprites.back_shiny
                }
            });
            const savedPokemon = await pokemon.save();
            logger.info(`Successfully saved Pokemon ${pokemonData.name} with ID: ${savedPokemon._id}`);
        } else {
            logger.debug(`Pokemon ${pokemonData.name} already exists - updating timestamp`);
            // Update lastUpdated timestamp
            existingPokemon.lastUpdated = new Date();
            await existingPokemon.save();
            logger.debug(`Updated existing Pokemon ${pokemonData.name}`);
        }
    } catch (error) {
        logger.error(`Error saving Pokemon ${pokemonData.name} to database: ${error.message}`, {
            pokemon: pokemonData.name,
            error: error.stack
        });
    }
};

// Function to get a random Pokémon
const getRandomPokemon = asyncHandler(async (req, res) => {
    const randomId = Math.floor(Math.random() * 898) + 1; // PokeAPI has 898 Pokémon

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

        // Save to database for future searches
        await savePokemonToDb(response.data);

        logger.info(`Random Pokemon fetched: ${response.data.name}`);
        return ApiResponse.success(response.data, 'Random Pokemon fetched successfully').send(res);

    } catch (error) {
        logger.error(`Error fetching random Pokemon: ${error.message}`);

        if (error.response?.status === 404) {
            throw new AppError('Pokemon not found', 404);
        }

        throw new AppError('Failed to fetch random Pokemon', 500);
    }
});

// Function to search for Pokémon by name (supports partial matches)
const searchPokemon = asyncHandler(async (req, res) => {
    const { name } = req.params;

    if (!name || name.trim().length === 0) {
        throw new AppError('Pokemon name is required', 400);
    }

    const searchTerm = name.toLowerCase().trim();
    logger.info(`Searching for Pokemon: ${searchTerm}`);

    try {
        // First, search in database for exact or partial matches
        const dbResults = await Pokemon.find({
            name: { $regex: searchTerm, $options: 'i' }
        }).limit(20);

        if (dbResults.length > 0) {
            logger.info(`Found ${dbResults.length} Pokemon in database for search: ${searchTerm}`);
            return ApiResponse.success(dbResults, 'Pokemon found in database').send(res);
        }

        // If not found in DB, try exact match from API
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
            await savePokemonToDb(response.data);
            logger.info(`Found exact match from API: ${response.data.name}`);
            return ApiResponse.success([response.data], 'Pokemon found from external API').send(res);

        } catch (apiError) {
            // If exact match fails, try to get species list for partial matches
            if (apiError.response?.status === 404) {
                try {
                    const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species?limit=1000`);
                    const matchingSpecies = speciesResponse.data.results.filter(species =>
                        species.name.toLowerCase().includes(searchTerm)
                    ).slice(0, 10);

                    if (matchingSpecies.length === 0) {
                        throw new AppError('No Pokemon found matching your search', 404);
                    }

                    // Fetch details for matching species
                    const pokemonPromises = matchingSpecies.map(async (species) => {
                        try {
                            const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${species.name}`);
                            await savePokemonToDb(pokemonResponse.data);
                            return pokemonResponse.data;
                        } catch (err) {
                            logger.warn(`Failed to fetch Pokemon details for ${species.name}: ${err.message}`);
                            return null;
                        }
                    });

                    const pokemonResults = (await Promise.all(pokemonPromises)).filter(p => p !== null);

                    if (pokemonResults.length === 0) {
                        throw new AppError('No Pokemon found matching your search', 404);
                    }

                    logger.info(`Found ${pokemonResults.length} Pokemon from partial search: ${searchTerm}`);
                    return ApiResponse.success(pokemonResults, 'Pokemon found from partial search').send(res);

                } catch (speciesError) {
                    logger.error(`Error in species search: ${speciesError.message}`);
                    throw new AppError('No Pokemon found matching your search', 404);
                }
            } else {
                throw apiError;
            }
        }
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        logger.error(`Error searching for Pokemon ${searchTerm}: ${error.message}`);
        throw new AppError('Error searching for Pokemon', 500);
    }
});

// Function to get Pokémon details
const getPokemonDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || id.trim().length === 0) {
        throw new AppError('Pokemon ID or name is required', 400);
    }

    const identifier = id.toLowerCase().trim();
    logger.info(`Fetching Pokemon details for: ${identifier}`);

    try {
        // First check database using the static method
        const dbPokemon = await Pokemon.findByNameOrId(identifier);

        if (dbPokemon) {
            logger.info(`Found Pokemon in database: ${dbPokemon.name}`);
            return ApiResponse.success(dbPokemon, 'Pokemon details found in database').send(res);
        }

        // If not in database, fetch from API
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        await savePokemonToDb(response.data);

        logger.info(`Fetched Pokemon from API: ${response.data.name}`);
        return ApiResponse.success(response.data, 'Pokemon details fetched from external API').send(res);

    } catch (error) {
        if (error.response?.status === 404) {
            logger.warn(`Pokemon not found: ${identifier}`);
            throw new AppError('Pokemon not found', 404);
        }

        if (error instanceof AppError) {
            throw error;
        }

        logger.error(`Error fetching Pokemon details for ${identifier}: ${error.message}`);
        throw new AppError('Error fetching Pokemon details', 500);
    }
});

// Function to get daily Pokémon (same for all users on the same day)
const getDailyPokemon = asyncHandler(async (req, res) => {
    // Generate a seed based on current date
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Create a simple hash from the date string to get consistent random number
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Use absolute value and modulo to get a number between 1 and 898
    const dailyId = Math.abs(hash % 898) + 1;

    try {
        // Check if we already have this Pokemon in the database
        const dbPokemon = await Pokemon.findOne({ name: { $exists: true } }).skip(dailyId - 1).limit(1);

        if (dbPokemon) {
            const dailyPokemon = { ...dbPokemon.toObject(), dailyDate: dateString };
            logger.info(`Daily Pokemon from database: ${dbPokemon.name} for ${dateString}`);
            return ApiResponse.success(dailyPokemon, 'Daily Pokemon fetched from database').send(res);
        }

        // If not in database, fetch from API
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${dailyId}`);
        await savePokemonToDb(response.data);

        const dailyPokemon = { ...response.data, dailyDate: dateString };
        logger.info(`Daily Pokemon from API: ${response.data.name} for ${dateString}`);
        return ApiResponse.success(dailyPokemon, 'Daily Pokemon fetched from external API').send(res);

    } catch (error) {
        logger.error(`Error fetching daily Pokemon: ${error.message}`);
        throw new AppError('Error fetching daily Pokemon', 500);
    }
});

// Function to get search suggestions
const getSearchSuggestions = asyncHandler(async (req, res) => {
    const { query } = req.params;

    if (!query || query.length < 2) {
        return ApiResponse.success([], 'Query too short for suggestions').send(res);
    }

    const searchTerm = query.toLowerCase().trim();
    logger.debug(`Getting search suggestions for: ${searchTerm}`);

    try {
        // Search in database first for quick suggestions
        const dbSuggestions = await Pokemon.find({
            name: { $regex: searchTerm, $options: 'i' }
        }).select('name').limit(10);

        if (dbSuggestions.length >= 5) {
            const suggestions = dbSuggestions.map(p => p.name);
            logger.debug(`Found ${suggestions.length} suggestions in database`);
            return ApiResponse.success(suggestions, 'Search suggestions from database').send(res);
        }

        // If not enough suggestions from DB, get from API
        try {
            const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species?limit=1000`);
            const matchingSuggestions = speciesResponse.data.results
                .filter(species => species.name.toLowerCase().includes(searchTerm))
                .slice(0, 10)
                .map(species => species.name);

            // Combine DB and API suggestions, remove duplicates
            const allSuggestions = [...new Set([
                ...dbSuggestions.map(p => p.name),
                ...matchingSuggestions
            ])];

            const finalSuggestions = allSuggestions.slice(0, 10);
            logger.debug(`Found ${finalSuggestions.length} total suggestions`);
            return ApiResponse.success(finalSuggestions, 'Search suggestions from database and API').send(res);

        } catch (apiError) {
            const suggestions = dbSuggestions.map(p => p.name);
            logger.warn(`API error for suggestions, using database only: ${apiError.message}`);
            return ApiResponse.success(suggestions, 'Search suggestions from database only').send(res);
        }
    } catch (error) {
        logger.error(`Error getting search suggestions for ${searchTerm}: ${error.message}`);
        throw new AppError('Error getting search suggestions', 500);
    }
});

module.exports = {
    getRandomPokemon,
    searchPokemon,
    getPokemonDetails,
    getDailyPokemon,
    getSearchSuggestions,
};