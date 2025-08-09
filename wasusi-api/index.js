// Incluirmos la librería para levantar una API
const express = require('express');
const cors = require('cors');

require('dotenv').config({path: 'src/config/.env'})

// Creamos la APP y la configuramos para parsear JSON enla request
const app = express()

app.use(express.json({limit:process.env.JSONLIMI}));
app.use(express.urlencoded({limit:process.env.JSONLIMI, extended:true}))
app.use(cors())

// atendemos solo peticion post

app.use(process.env.APIPREFIX+'/knn', require('./src/routes/endpoints/knn'));
app.use(process.env.APIPREFIX+'/control', require('./src/routes/endpoints/control'));

// Levantamos el servidor en un puerto
app.listen(process.env.PORT, function () {
    console.log(`WASUSI-API: Escuchando puerto ${process.env.PORT}`);
    // Nos conectamos al nodo de control y nos registramos
})
