import React,{useState, useEffect} from "react";

import "./styles.css";
import api from './services/api'


function App() {

  const [repositories,setRepositories] = useState([])

  useEffect( () => {
      api.get('/repositories').then( response => {
        setRepositories(response.data)
      })
  }, [] )
  async function handleAddRepository() {
   const response = await api.post("/repositories", {     
      "title": "gostack-desafios",
      "url": "https://github.com/Rocketseat/bootcamp-gostack-desafios",
      "techs": ["nodejs", "reactjs", "react-native"]
    })
    setRepositories([...repositories, response.data])


  }

  async function handleRemoveRepository(id) {
    const repositoryIndex = repositories.findIndex(repository => repository.id === id)
    await api.delete(`/repositories/${id}`)
     const repositoryUpdated =  repositories.filter( (repository)=> repository.id!==id)
        setRepositories(repositoryUpdated)
  }

  return (
    <div>
      <ul data-testid="repository-list">
       {repositories.map( repository =>
                <li key={repository.id}>
                {repository.title}
                      <button onClick={() => handleRemoveRepository(repository.id)}>
                  Remover
                </button>
              </li> )}

      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
