// const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require("../models");

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought 

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' })
      }

    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if(!user) { 
        return res.status(404).json({ message: "Thought created but no user ID found."})
      }
      res.json("thought created!");
    } catch (err) {
        console.log(err);
      res.status(500).json(err);
    }
  },

  // Update a thought that already exists

  async updateThought(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404)
            .json({ message: "No thought found with that Id!" });
        }
        res.json({ message: "Your thought has been updated!" });
    } catch (err) {
        res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No such thought exists' });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
      );

      if (!user) {
        return res
        .status(404)
        .json({ message: "Thought deleted without user"})
      }

      res.json({ message: "Thought successfully deleted!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a reaction to thought

    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

        if (!thought) {
          return res
            .status(404)
            .json({ message: 'No thought found with that Id' });
        }

        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Remove reaction from a thought

    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

        if (!thought) {
          return res
            .status(404)
            .json({ message: 'No thought found with that Id' });
        }

        res.json({ message: "Reaction was successfully deleted!"});
      } catch (err) {
        res.status(500).json(err);
      }
    },
};
