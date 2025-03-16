import { useEffect, useState } from "react";

interface PokeProfileProps {
  pokeurl: string;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  [key: string]: string | undefined;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonType[];
}

interface PokemonState {
  data: Pokemon | null;
  isLoading: boolean;
  error: Error | null;
}


export default function PokeProfile({pokeurl}: PokeProfileProps) {
    const [pokemon, setPokemon] = useState<PokemonState>({
        data: null,
        isLoading: true,
        error: null
    });
    useEffect(() => {
        async function fetchData() {
            try {
              setPokemon((prev) => ({ ...prev, isLoading: true }));
              const response = await fetch(pokeurl);
              const data: Pokemon = await response.json();
              setPokemon({
                data,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              setPokemon({
                data: null,
                isLoading: false,
                error: error as Error,
              });
            }
        };

        fetchData();
    }, [pokeurl])

    return (
      <div className="flex flex-col items-center justify-center p-4 min-h-48 min-w-sm">
        {pokemon.isLoading && (
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500" />
        )}

        {pokemon.error && (
          <div className="text-red-500">Error: {pokemon.error.message}</div>
        )}

        {!pokemon.isLoading && !pokemon.error && pokemon.data && (
          <>
            <h1 className="text-xl font-bold capitalize mb-2">
              {pokemon.data.name}
            </h1>
            <img
              src={pokemon.data.sprites.front_default}
              alt={pokemon.data.name}
              className="w-32 h-32 object-contain"
            />
            <div className="flex gap-2 mt-2">
              {pokemon.data.types.map((type) => (
                <span
                  key={type.slot}
                  className={
                    "px-3 py-1 rounded-full text-sm capitalize text-white bg-green-500"
                  }
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    );
}