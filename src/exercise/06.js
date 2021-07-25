// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import { fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback } from '../pokemon';


class ErrorBoundary extends React.Component {

  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;

    if (error) {
      return <this.props.FallbackComponent error={error} />;
    }

    console.log('ErrorBoundary', this.state.error)
    return this.props.children
  }
}

function ErrorFallback({ error }) {
  return (
    <div>
      There was an error:
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
    </div>
  );
}


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

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
