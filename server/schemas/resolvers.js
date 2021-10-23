const { User, Book } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        // if user is logged in, get their data
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password")
        
                return userData;
            }
    
            throw new AuthenticationError("Not logged in");
        },
    },
    Mutation: {
        // login to site, evaluate credentials, create token for user on successful evaluation
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
    
            if (!user) {
                throw new AuthenticationError("Incorrect credentials");
            }
    
            const correctPw = await user.isCorrectPassword(password);
    
            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }
    
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
    
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const userUpdate = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: args.bookData } },
                    { new: true }
                );
            
                return userUpdate;
            }
        
            throw new AuthenticationError("Not logged in. Log in to save books.");
        },
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const userUpdate = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
            
                return userUpdate;
            }
        
            throw new AuthenticationError("Not logged in. Log in to remove books.");
        },
    }
};
  
  module.exports = resolvers;