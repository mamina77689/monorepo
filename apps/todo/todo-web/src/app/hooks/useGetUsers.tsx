import { useQuery } from "@apollo/client/react"
import { GET_USER } from "../graphql/user.graphql"

export const useGetUsers = ()=>{
    const {data, loading} = useQuery(GET_USER)

    if(loading) return <div>Loading...</div>
    const users = data?.getUsers
    
    
    return users
}