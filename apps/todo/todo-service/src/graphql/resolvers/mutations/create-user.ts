import { Todo } from "../../../../generated/prisma/client";
import { Context } from "../../../types/index";

type User = {
    name: string

}

export const createUser = async(_:unknown, args: User, ctx: Context)=>{
    const {db} = ctx

    try {
        await db.user.create({
            data: {
                name:args.name,
            }
        })
        return {message: "Success"}
    } catch(err: unknown) {
        if(err instanceof Error) {
            return {message: `System error message: ${err.message}`}
        } 
    }
}