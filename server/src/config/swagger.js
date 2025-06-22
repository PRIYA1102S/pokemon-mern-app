// Simple swagger configuration without requiring swagger-jsdoc for now
const specs = {
    openapi: '3.0.0',
    info: {
        title: 'Pokemon MERN API',
        version: '1.0.0',
        description: 'A comprehensive Pokemon API built with MERN stack'
    },
    servers: [
        {
            url: 'http://localhost:5000/api',
            description: 'Development server'
        }
    ]
};

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pokemon MERN API',
            version: '1.0.0',
            description: 'A comprehensive Pokemon API built with MERN stack',
            contact: {
                name: 'API Support',
                email: 'support@pokemon-app.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production' 
                    ? 'https://your-domain.com/api'
                    : 'http://localhost:5000/api',
                description: process.env.NODE_ENV === 'production' 
                    ? 'Production server'
                    : 'Development server'
            }
        ],
        components: {
            schemas: {
                Pokemon: {
                    type: 'object',
                    required: ['id', 'name', 'height', 'weight', 'types', 'abilities'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'MongoDB ObjectId'
                        },
                        id: {
                            type: 'integer',
                            description: 'Pokemon ID from PokeAPI',
                            example: 25
                        },
                        name: {
                            type: 'string',
                            description: 'Pokemon name',
                            example: 'pikachu'
                        },
                        height: {
                            type: 'integer',
                            description: 'Pokemon height in decimeters',
                            example: 4
                        },
                        weight: {
                            type: 'integer',
                            description: 'Pokemon weight in hectograms',
                            example: 60
                        },
                        base_experience: {
                            type: 'integer',
                            description: 'Base experience gained when defeating this Pokemon',
                            example: 112
                        },
                        types: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Pokemon types',
                            example: ['electric']
                        },
                        abilities: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Pokemon abilities',
                            example: ['static', 'lightning-rod']
                        },
                        stats: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    base_stat: {
                                        type: 'integer'
                                    },
                                    stat: {
                                        type: 'string'
                                    }
                                }
                            },
                            description: 'Pokemon base stats'
                        },
                        imageUrl: {
                            type: 'string',
                            description: 'URL to Pokemon image',
                            example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
                        },
                        sprites: {
                            type: 'object',
                            properties: {
                                front_default: { type: 'string' },
                                back_default: { type: 'string' },
                                front_shiny: { type: 'string' },
                                back_shiny: { type: 'string' }
                            },
                            description: 'Pokemon sprite URLs'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'When the Pokemon was added to database'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'When the Pokemon was last updated'
                        }
                    }
                },
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Whether the request was successful'
                        },
                        message: {
                            type: 'string',
                            description: 'Response message'
                        },
                        data: {
                            description: 'Response data (varies by endpoint)'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Response timestamp'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        error: {
                            type: 'string',
                            description: 'Detailed error information'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                }
            },
            responses: {
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                BadRequest: {
                    description: 'Bad request',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                TooManyRequests: {
                    description: 'Too many requests',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                InternalServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

module.exports = specs;
