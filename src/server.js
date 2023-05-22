import express from 'express';
import { calculate } from '../src/index.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));//  middleware do Express, processamento de dados Formulários HTML.
app.use(cors());// Habilita a Cors para todas as rotas

app.post('/', (req, res) => {
    const { value } = req.body;
    const result = calculate(value);
    console.log(result);

    res.send(result)  // resultado de volta para o Front-End
});

app.listen(port, () =>{
    console.log(`Servidor rodando na porta ${port}`);
})