import { Response, Todo } from "./todo"

export type User = {
    id: string,
    name: string,
    xp: number,
    level: number
    todos: Todo[]
}

export type GetUsersData = {
    getUsers: User[]
}

export type CreateUserVariable = {
    name: string
}

export type CreateUserData ={
    createUser: Response
}
