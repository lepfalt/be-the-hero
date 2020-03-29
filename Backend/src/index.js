const express = require('express');  //Armazenando na var as funcionalidades do módulo express
const cors = require('cors');
const routes = require('./routes'); //importando as rotas, referenciando o arquivo de rotas

const app = express(); //minha aplicação

app.use(cors()); //Em prod coloca a url da hospedagem
app.use(express.json()); //diz que usará json no corpo da requisição
app.use(routes);

app.listen(3333); //ouvir a porta 3333 (node)