import "./App.css";
import { useEffect, useState } from "react";
import PokeProfile from "./profile/PokeProfile";

interface PokemonResult {
  name: string;
  url: string;
}

interface PokemonListState {
  data: PokemonResult[];
  isLoading: boolean;
  error: Error | null;
}

export default function App() {
  const [pokemonList, setPokemonList] = useState<PokemonListState>({
    data: [],
    isLoading: true,
    error: null,
  });
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    async function fetchData(page: number) { // this sucks, how do I define an async funtion outside and call it inside useEffect?
      try {
        setPokemonList(prev => ({ ...prev, isLoading: true }));
        const offset = 6 * (page - 1);
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=6`
        );
        const data = await response.json();
        setPokemonList({
          data: data.results,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setPokemonList({
          data: [],
          isLoading: false,
          error: error as Error,
        });
      }
    };
    fetchData(page);
  }, [page]);

  if (pokemonList.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }
  if (pokemonList.error) return <div>Error: {pokemonList.error.message}</div>;
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        {pokemonList.data.map((pokemon) => (
          <div className="bg-white rounded-lg shadow-md p-4">
            <PokeProfile pokeurl={pokemon.url} />
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
