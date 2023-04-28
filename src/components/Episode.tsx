import { getSSRClient } from "@/libs/client";
import { gql, useQuery } from "@apollo/client";
import { error } from "console";
import Link from "next/link";
import React, {FC} from "react";

const Episode: FC<{id : string}> = ({id}) => {

    const query = gql`
    query episode($id: ID!) {
        episode(id : $id) {
            name
            air_date
            characters{
                id
                name
            }
        }
    }
    `;

    console.log(id)


 
    const {loading, error, data } = useQuery<{
        episode: {
          name:string
          air_date:string
            characters: {
                id:string
                name:string
            }[]
        }
      }>(query,{
        variables: {
          id: id
        }
      })

      console.log(data?.episode.name)
      console.log(id)
    
      if(loading) return <div>Loading...</div>
      if(error) return <div>no data</div>
        return(
            <div>
                <h1>Nombre</h1>
                {data?.episode.name}
                <h1>Fecha de emisión</h1>
                {data?.episode.air_date}
                <h1>Personajes</h1>
                {data?.episode.characters.map((ep) => {
                    return <div><Link href={`/character/${ep.id}`}>{ep.name}</Link></div>
                })
                }
                
                
      
                
            </div>
          )
      }
  
    
    
    export default Episode