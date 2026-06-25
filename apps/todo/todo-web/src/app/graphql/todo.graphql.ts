import { TypedDocumentNode } from "@apollo/client";
import gql from "graphql-tag";
import { CreateTodoData, CreateTodoVariable } from "../types/todo";

export const CREATE_TODO:TypedDocumentNode<CreateTodoData, CreateTodoVariable> = gql`
  mutation Mutation($title: String!) {
    createTodo(title: $title) {
      id
      title
      isCompleted
    }
  }
`;