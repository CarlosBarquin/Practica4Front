import { getSSRClient } from "@/libs/client"
import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next"
import Link from "next/link";


export const getStaticPaths: GetStaticPaths = async () => {
  const client = getSSRClient();
  const { data: { characters: { info: { pages } } } } = await client.query<{
    characters: {
      info: {
        pages: number
      }
    }
  }>({
    query: gql`
      query {
        characters {
          info {
            pages
          }
        }
      }
    `
  });

  const paths = [];
  for (let i = 1; i <= pages; i++) {
    const { data } = await client.query<{ characters: { results: { id: string }[] } }>({
      query: gql`
        query {
          characters(page: ${i}) {
            results {
              id
            }
          }
        }
      `
    })
    paths.push(...data.characters.results.map((character) => ({
      params: {
        id: character.id.toString(),
      },
    })))
  }

  //console.log(paths)

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const id = params?.id

  const query = gql`
    query character($id: ID!) {
        character(id : $id) {
            name
            gender
            location{
              id
              name
            }
            episode{
              id
              name
            }
        }
    }
    `;

  

  const client = getSSRClient();
  
  const {data} = await client.query<{
    character: {
      name:string
      gender:string
      location:{
        name:string
        id:string
      }
      episode: {
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



  return {
    props: {
      name: data.character.name,
      gender: data.character.gender,
      location: data.character.location,
      episode : data.character.episode
    },
  }
}


export default function Home(props: { name: string, gender: string, location:{name:string, id:string}, episode: {name:string, id:string}[]}) {
  return (
    <>
      <h1>Nombre</h1>
      {props.name}
      <h1>Genero</h1>
      {props.gender}
      <h1>Localizacion</h1>
      <Link href={`/location/${props.location.id}`}>{props.location.name}</Link>
      <h1>Episodios</h1>
      {props.episode.map((ep) => {
        return <div><Link href={`/episode/${ep.id}`}>{ep.name}</Link></div>
      })
      }
      
    </>
  )
}

