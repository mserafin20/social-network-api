const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

// Schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatDate,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [Reaction],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

function formatDate(createdAt) {
    return createdAt.toLocaleDateString("en-US", {
        day: "2-digit",
        year: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
