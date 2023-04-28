import { getSSRClient } from "@/libs/client"
import { gql } from "@apollo/client";
import { GetServerSideProps } from "next"
import Link from "next/link";


export const getServerSideProps: GetServerSideProps = async (context) => {

  const {id}  = context.query
  console.log(id)

  const query = gql`
    query location($id: ID!) {
        location(id : $id) {
            name
            dimension
            residents{
                name
                id
            }
        }
    }
    `;

  

  const client = getSSRClient();
  
  const {data} = await client.query<{
    location: {
        name:string
        dimension:string
        residents: {
            name:string
            id:string
        }[]
    }
  }>({
    query,
    variables: {
      id: id
    }
  })


  console.log(data.location.name)

  return {
    props: {
        name: data.location.name,
        dimension: data.location.dimension,
        residents: data.location.residents
    },
  };
};


export default function Home(props: { name: string, dimension: string, residents: {name:string, id: string}[]}) {
  return (
    <>
      <h1>Nombre</h1>
      {props.name}
      <h1>dimension</h1>
      {props.dimension}
      <h1>residentes</h1>
      {props.residents.map((ep) => {
        return <div><Link href={`/character/${ep.id}`}>{ep.name}</Link></div>
      })
      }
      
    </>
  )
}

