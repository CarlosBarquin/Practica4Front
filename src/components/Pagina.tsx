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
    <Container>
      <Input
        type="text"
        placeholder="buscar por nombre"
        value={filtro}
        onChange={FiltroTruco}
      />

      <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </Button>

      <Button
        onClick={() => setPage(page + 1)}
        disabled={page === data?.characters.info.pages}
      >
        Next
      </Button>

      <br></br>
      <br></br>

      <StyledContent>
        {data?.characters.results
          .filter((character) =>
            character.name.toLowerCase().includes(filtro.toLowerCase())
          )
          .map((character) => {
            const index = character.id;
            return (
              <Card key={index}>
                <Link href={`/character/${index}`}>
                  <Image src={character.image} alt={character.name} />
                </Link>
                <Name>
                  <Link href={`/character/${index}`}>{character.name}</Link>
                </Name>
              </Card>
            );
          })}
      </StyledContent>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1.2rem;
  border: 2px solid #ccc;
  border-radius: 0.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font size: 1.2rem;
  border: 2px solid #ccc;
  border-radius: 0.5rem;
  background-color: #fff;
  cursor: pointer;
  margin-right: 1rem;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const StyledContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 0.5rem 0.5rem 0 0;
`;

const Name = styled.div`
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
`;


export default Pagina;
