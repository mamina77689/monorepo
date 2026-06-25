import { Context } from "../../../types/index";
type DeleteUserArgs ={
    id:string;
};

export const deleteUser =async(
    _:unknown,
    args:DeleteUserArgs,
    context : Context ,
)=> {
    const {db} = context;
    const {id}= args;
}