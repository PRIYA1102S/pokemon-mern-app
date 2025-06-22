const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemonController');
const {
    validatePokemonSearch,
    validatePokemonId,
    sanitizeInput
} = require('../middleware/validation');

// Apply input sanitization to all routes
router.use(sanitizeInput);

/**
 * @swagger
 * /pokemon/random:
 *   get:
 *     summary: Get a random Pokemon
 *     description: Fetches a random Pokemon from the PokeAPI and caches it in the database
 *     tags: [Pokemon]
 *     responses:
 *       200:
 *         description: Random Pokemon fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.get('/random', pokemonController.getRandomPokemon);

/**
 * @swagger
 * /pokemon/daily:
 *   get:
 *     summary: Get daily Pokemon
 *     description: Returns the same Pokemon for all users on the same day (changes daily)
 *     tags: [Pokemon]
 *     responses:
 *       200:
 *         description: Daily Pokemon fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Pokemon'
 *                         - type: object
 *                           properties:
 *                             dailyDate:
 *                               type: string
 *                               format: date
 *                               description: Date for which this is the daily Pokemon
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/daily', pokemonController.getDailyPokemon);

/**
 * @swagger
 * /pokemon/suggestions/{query}:
 *   get:
 *     summary: Get search suggestions
 *     description: Returns Pokemon name suggestions based on partial input
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         description: Partial Pokemon name to search for
 *         example: pika
 *     responses:
 *       200:
 *         description: Search suggestions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.get('/suggestions/:query', validatePokemonSearch, pokemonController.getSearchSuggestions);

/**
 * @swagger
 * /pokemon/search/{name}:
 *   get:
 *     summary: Search Pokemon by name
 *     description: Search for Pokemon by exact or partial name match. Searches database first, then external API
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           pattern: '^[a-zA-Z0-9\-]+$'
 *         description: Pokemon name to search for
 *         example: pikachu
 *     responses:
 *       200:
 *         description: Pokemon found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.get('/search/:name', validatePokemonSearch, pokemonController.searchPokemon);

/**
 * @swagger
 * /pokemon/details/{id}:
 *   get:
 *     summary: Get Pokemon details
 *     description: Get detailed information about a specific Pokemon by ID or name
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           oneOf:
 *             - type: integer
 *               minimum: 1
 *               maximum: 10000
 *             - type: string
 *               minLength: 1
 *               maxLength: 50
 *               pattern: '^[a-zA-Z0-9\-]+$'
 *         description: Pokemon ID (number) or name (string)
 *         example: 25
 *     responses:
 *       200:
 *         description: Pokemon details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get('/details/:id', validatePokemonId, pokemonController.getPokemonDetails);

module.exports = router;