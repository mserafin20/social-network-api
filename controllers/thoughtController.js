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
  // Delete a user and remove their thoughts 
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No such user exists' });
      }

      const thought = await Thought.deleteMany({
        username: user.username,
      });

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a friend to user

    async addFriend(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.body } },
          { runValidators: true, new: true }
        );

        if (!user) {
          return res
            .status(404)
            .json({ message: 'No user found' });
        }

        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Remove friend from a user

    async removeFriend(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: req.params.friendId } },
          { runValidators: true, new: true }
        );

        if (!user) {
          return res
            .status(404)
            .json({ message: 'No user found' });
        }

        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
};
