// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback } from '../pokemon';


function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error:
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  );
}


function PokemonInfo({ pokemonName }) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
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
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'idle':
      return ('Submit a pokemon');
    case 'rejected':
      throw error;
    default:
      throw new Error(`Unhandled status: ${status}`);
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
