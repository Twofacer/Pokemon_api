import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Card from './components/Card';
import Categories from './components/Categories/Categories'
import { getPokemon, getAllPokemon } from './services/pokemon';
import './App.css';

function App() {
 
  const [pokemonData, setPokemonData] = useState([])
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
  
  const searchPokemon =(pokemonName)=>{
    let data = allPokemonData
    let searchItem = pokemonName.trim().toLowerCase();
    console.log(data)
    if(searchItem.length > 0) {
      data = data.filter((el) => el.name.toLowerCase().match(searchItem))
      setPokemonData(data)
    }
   
  }
  const Setup = ({search,pokemonData}) => {
    const [pokemonName, setpokemonName] = useState('')
    return <div className="btn-container">
        <form onSubmit={(e) => e.preventDefault()}>
            <input  type="text" id="search_input" onInput={search} value={pokemonName} onChange={(e) => setpokemonName(e.target.value)}/>
            <input type="submit" placeholder="Search pokemon" value="Search" id="search_pokemon_button" onClick={()=>searchPokemon(pokemonName, pokemonData)}/>
      </form>
    </div>;
  };
  
  return (
    <>
      <Navbar />
      <div>
        {loading ? <div className='loading'></div> : (
          <>
         <Categories categories={categories} filterItems={filterItems}/>
         <Setup />
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
