import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Card from './components/Card';
import Setup from './components/Search/Search'
import Categories from './components/Categories/Categories'
import { getPokemon, getAllPokemon } from './services/pokemon';
import './App.css';

function App() {
 
  const [pokemonData, setPokemonData] = useState([])
  const [search, setSearch] = useState('')
  const [allPokemonData, setallPokemonData]= useState([])
  const  allCategories = ["all", "grass", "fire", "water", "bug", "normal", "poison", "electric", "ground", "fairy", "fighting", "psychic", "rock", "ghost", "ice", "dragon"] 
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(allCategories)
  const initialURL = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=150'

  
  useEffect(() => {
    
    async function fetchData() {
      let response = await getAllPokemon(initialURL)
      setNextUrl(response.next);
      setPrevUrl(response.previous);
     
      await loadPokemon(response.results);
     
      setLoading(false);
    }
    fetchData();
    
  }, [])

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon)
      
      return pokemonRecord
    }))
    setPokemonData(_pokemonData);
    setallPokemonData(_pokemonData);
    
  }
  
  const filterItems = (category) => {
    if(category === 'all') {
      setPokemonData(allPokemonData)
     
      return
    }
    setPokemonData(allPokemonData)
   
    const newItemsFirst = allPokemonData.filter(pokemon => pokemon.types[0].type.name === category)
    const newItemsSecond = allPokemonData.filter(pokemon => pokemon.types[1]!== undefined && pokemon.types[1].type.name === category )
   
    const newItems = newItemsFirst.concat(newItemsSecond);
    console.log(newItems)

    
    const test =  newItems.sort((a, b) => (a.id > b.id) ? 1 : -1)
    console.log(test)
    setPokemonData(test)
    
  }
  console.log(allPokemonData)
  
  return (
    <>
      <Navbar />
      <div>
        {loading ? <div className='loading'></div> : (
          <>
         <Categories categories={categories} filterItems={filterItems}/>
         <Setup search={search}/>
            <div className="grid-container">
              {pokemonData.map((pokemon, i) => {
                
                return <Card key={i} pokemon={pokemon} />
              })}
            </div>
            <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
