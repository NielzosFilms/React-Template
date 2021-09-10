const { gql } = require("apollo-server-express");

const typeDefs = gql(`
    scalar Date

    type User {
        id: Int!
        name: String!
        admin: Boolean!
        createdAt: Date!
        updatedAt: Date!
    }

    type LoginPayload {
        success: Boolean!
        token: String
    }

    type Query {
        isAuthenticated: Boolean
        getAuthenticatedUser: User
    }

    type Mutation {
        login(username: String!, password: String!): LoginPayload
        logout: Boolean
        changePassword(password: String!): Boolean
    }
`);

module.exports = typeDefs;
