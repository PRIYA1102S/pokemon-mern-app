const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    base_experience: {
        type: Number
    },
    types: [{
        type: String,
        required: true
    }],
    abilities: [{
        type: String,
        required: true
    }],
    stats: [{
        base_stat: {
            type: Number,
            required: true
        },
        stat: {
            type: String,
            required: true
        }
    }],
    imageUrl: {
        type: String,
        required: true
    },
    sprites: {
        front_default: String,
        back_default: String,
        front_shiny: String,
        back_shiny: String
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create indexes for better search performance
pokemonSchema.index({ name: 'text' }); // Text search index
pokemonSchema.index({ name: 1, types: 1 }); // Compound index for name and types
pokemonSchema.index({ types: 1 }); // Index for type-based queries
pokemonSchema.index({ id: 1 }); // Index for ID-based queries
pokemonSchema.index({ createdAt: 1 }); // Index for time-based queries
pokemonSchema.index({ lastUpdated: 1 }); // Index for cache invalidation

// Add instance methods
pokemonSchema.methods.toJSON = function() {
    const pokemon = this.toObject();

    // Remove sensitive/unnecessary fields from API response
    delete pokemon.__v;
    delete pokemon.lastUpdated;

    return pokemon;
};

// Add static methods for common queries
pokemonSchema.statics.findByNameOrId = function(identifier) {
    const isNumeric = /^\d+$/.test(identifier);

    if (isNumeric) {
        return this.findOne({ id: parseInt(identifier) });
    } else {
        return this.findOne({ name: identifier.toLowerCase() });
    }
};

pokemonSchema.statics.searchByName = function(name, limit = 20) {
    return this.find({
        name: { $regex: name.toLowerCase(), $options: 'i' }
    })
    .limit(limit)
    .sort({ name: 1 });
};

pokemonSchema.statics.findByType = function(type, limit = 20) {
    return this.find({
        types: { $in: [type.toLowerCase()] }
    })
    .limit(limit)
    .sort({ name: 1 });
};

// Add pre-save middleware for data validation and normalization
pokemonSchema.pre('save', function(next) {
    // Normalize name to lowercase
    if (this.name) {
        this.name = this.name.toLowerCase();
    }

    // Normalize types to lowercase
    if (this.types && Array.isArray(this.types)) {
        this.types = this.types.map(type => type.toLowerCase());
    }

    // Normalize abilities to lowercase
    if (this.abilities && Array.isArray(this.abilities)) {
        this.abilities = this.abilities.map(ability => ability.toLowerCase());
    }

    next();
});

// Add post-save middleware for logging
pokemonSchema.post('save', function(doc) {
    const logger = require('../config/logger');
    logger.debug(`Pokemon saved to database: ${doc.name} (ID: ${doc.id})`);
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;