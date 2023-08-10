const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            // Unique
            // Trim
        },
        email: {
            type: String,
            required: true,
            // Unique
            // validate email
        },

        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thought"
            }
        ],

        friend: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    }
);

userSchema.virtual("friendCount").get(function () {
    return this.friend.length;
})

const User = model('user', userSchema);

module.exports = User;
