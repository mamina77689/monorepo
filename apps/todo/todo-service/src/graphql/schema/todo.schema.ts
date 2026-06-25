import gql from 'graphql-tag';

export const todoTypeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    description: String
    xpReward: Int!
    isCompleted: Boolean!
  }

  input TodoInput {
    title: String!
    description: String
    xpReward: Int!
  }

  type Query {
    getTodoByUserId(userId: ID!): [Todo]!
  }

  type Mutation {
    createTodo(input: TodoInput): Response!
  }
`;