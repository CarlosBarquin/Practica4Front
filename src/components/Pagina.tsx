import { getSSRClient } from "@/libs/client";
import { gql, useQuery } from "@apollo/client";
import { error } from "console";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";

const Pagina = () => {
  const query = gql`
    query Characters($page: Int!) {
      characters(page: $page) {
        info {
          pages
        }
        results {
          id
          name
          image
        }
      }
    }
  `;
  const [page, setPage] = useState<number>(1);
  const [filtro, setFiltro] = useState<string>("");

  const { loading, error, data, refetch } = useQuery<{
    characters: {
      info: {
        pages: number;
      };
      results: {
        id: number;
        name: string;
        image: string;
      }[];
    };
  }>(query, {
    variables: {
      page: page,
    },
  });

  useEffect(() => {
    refetch({
      variables: {
        page: page,
      },
    });
  }, [page, filtro]);

  const FiltroTruco = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };




  if (loading) return <div>Loading...</div>;
  if (error) return <div>no data</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="buscar por nombre"
        value={filtro}
        onChange={FiltroTruco}
      />

      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === data?.characters.info.pages}
      >
        Next
      </button>

      <StyledContent>
        {data?.characters.results
          .filter((character) =>
            character.name.toLowerCase().includes(filtro.toLowerCase())
          )
          .map((character) => {
            const index = character.id;
            return (
              <div key={index}>
                <Link href={`/character/${index}`}>{character.name}</Link>
                <br />
                <img src={character.image} width="200" height="200" />
              </div>
            );
          })}
      </StyledContent>
    </div>
  );
};


const StyledContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
`;

export default Pagina
