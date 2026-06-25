export type Todo = {
    id: string,
    title: string,
    description?: string
    xpReward: number,
    userId: string,
    isCompleted: boolean
}


export type GetTodoByUserIdData = {
    getTodoByUserId: Todo[]
}

export type GetTodoByUserIdVariable = {
    userId: string
}


export type TodoInput = {
    title: string
    description: string,
    xpReward: number
}

export type CreateTodoVariable = {
    input: TodoInput
}
export type CreateTodoData = {
    createTodo: Response
}
export type Response ={
    message: string
}

