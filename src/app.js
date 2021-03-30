const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.query;
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs.split(","), // ["Node.js", "Reactive"]
    likes: 0
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.query;
  const index = repositories.findIndex( x => x.id == id );
  if (index >= 0) {
    const repository = { 
      id: id, 
      title: title || repositories[index].title, 
      url: url || repositories[index].url, 
      techs: techs.split(",") || repositories[index].techs, 
      likes: repositories[index].likes 
    };
    repositories[index] = repository;
    return response.json(repositories[index]);
  }
  else {
    return response.status(400).json({error: 'Não foi possível encontrar esse id para alteração.'});
  }

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex( x => x.id == id );
  if (index >= 0) {
    repositories.splice(index, 1);
    return response.status(204).json();
  }
  else {
    return response.status(400).json({error: 'Não foi possível encontrar esse id para a exclusão.'});
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex( x => x.id == id );
  if (index >= 0) {
    repositories[index].likes++;
    return response.json(repositories[index]);
  }
  else {
    return response.status(400).json({error: 'Não foi possível encontrar esse id para a operação.'});
  }  
});

module.exports = app;
