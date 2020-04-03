const express = require('express');  //Armazenando na var as funcionalidades do módulo express
const cors = require('cors');
const { errors }  = require('celebrate');
const routes = require('./routes'); //importando as rotas, referenciando o arquivo de rotas

const app = express(); //minha aplicação

app.use(cors()); //Em prod coloca a url da hospedagem
app.use(express.json()); //diz que usará json no corpo da requisição
app.use(routes);
app.use(errors());

module.exports = app;