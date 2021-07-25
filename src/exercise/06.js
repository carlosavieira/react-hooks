// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import { fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback } from '../pokemon';

function PokemonInfo({ pokemonName }) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  const { pokemon, error, status } = state



  React.useEffect(() => {
    if (!pokemonName) {
      setState({
        status: 'idle'
      });
      return;
    }

    setState({
      status: 'pending'
    })

    fetchPokemon(pokemonName)
      .then(
        pokemon => {
          setState({
            pokemon,
            status: 'resolved'
          })
        },
        error => {
          setState({
            error,
            status: 'rejected'
          })
        }
      )
  }, [pokemonName])

  switch (status) {
    case 'rejected':
      return (
        <div role="alert">
          There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
        </div>
      )
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    case 'idle':
      return ('Submit a pokemon');
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    default:
      throw new Error(`Unhandled status: ${status}`);
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
