const { gql } = require("apollo-server-express");

// Use input type to make saveBook simpler. GraphQL docs for input type: https://graphql.org/graphql-js/mutations-and-input-types/
const typeDefs = gql`
    type Query {
        me: User
    }
    
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    
    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    
    input BookInput {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }
    
    type Auth {
        token: ID!
        user: User
    }
    
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookData: BookInput!): User
        removeBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;