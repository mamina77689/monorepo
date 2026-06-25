import { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';
import { CreateUserData, CreateUserVariable, GetUsersData } from '../types/user';


export const CREATE_USER: TypedDocumentNode<CreateUserData, CreateUserVariable> = gql`
mutation Mutation($name: String!) {
  createUser(name: $name) {
    message
  }
}`;

export const GET_USER:TypedDocumentNode<GetUsersData> =gql`
query Query {
  getUsers {
    id
    level
    name
    todos {
      xpReward
      description
      id
      isCompleted
      title
    }
  }
}`;



