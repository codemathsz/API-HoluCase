import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore  } from 'firebase-admin/firestore'
import express from 'express';
import serviceAccount from './serviceAccountKey.json' assert { type: "json" };
import {calculate} from './index.js'
import bodyParser from 'body-parser'
import cors from 'cors';

initializeApp({
  credential: cert(serviceAccount)
});


const db = getFirestore();
const app = express();
const port = 3000;

// Usando o body-parser para processar o corpo da solicitação
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());// Habilita a Cors para todas as rotas

let requestId = 1;

async function getDocs(){
  const snapshot = await db.collection('calculo').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
    return doc.data()
  });
}

app.get('/calculo', async (req, res) => {
  try {
    const docsForSend = [];
    const snapshot = await db.collection('calculo').get();
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      docsForSend.push({ id: doc.id, ...doc.data() });

    });
    console.log(docsForSend);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(docsForSend);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor' });
  }
});


app.get('/calculo/:id', async (req, res) => {

  const { id } = req.params;
  console.log("entrou aqui com id passado : "+id);
  if(id){
    const calcRef = db.collection('calculo').doc(id.toString());
    const doc = await calcRef.get();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(doc.data());
    console.log(doc.data());
  }
})


app.post('/calculo', async (req, res) => {
  const { value } = req.body;
  const result = calculate(value);
  
  try {

    const docRef = db.collection('calculo').doc(requestId.toString());

    await docRef.set({
      inverters: result?.inverters,
      amountPlates: result?.amountPlates,
      potential: result?.potential,
      lengthOfStructure: result?.lengthOfStructure,
      usefulArea: result?.usefulArea,
      structureType: result?.structureType,
    });

    console.log('Documento escrito  com ID: ', docRef.id)
    res.status(200).send()
    requestId++;
  } catch (e) {
    console.error('Error adding document: ', e);
    res.status(500).send();
  }
})

app.listen(port, () =>{
  console.log(`API Rest iniciada em http://localhost:${port}`);
})