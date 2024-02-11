const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
const ejs = require('ejs');
const fs = require('fs');
const multer = require('multer');

const app = express();
var porta = process.env.PORT || 5000;

/* Definição de limite de dados de upload.*/
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json());  // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: true }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

const diretorioAtual = __dirname;
const pastaRaiz = path.resolve(diretorioAtual);

//const rota1 = require('../gerenciador_assinatura/index');
const rota2 = require('../api_agenda/index');

//app.use('/rota1', rota1);
app.use('/agenda', rota2);

app.get('/', (req,res) =>{
    res.send('Router')
})

function startServer() {
    const server = http.createServer(app);

    server.listen(porta)
        .on('listening', () => {
            console.log(`Servidor iniciado na porta ${porta}`);
        })
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`A porta ${porta} está ocupada, tentando a próxima porta.`);
                porta++;
                startServer();
            } else {
                console.error(`Erro ao tentar verificar a porta: ${err.message}`);
            }
        });
}

startServer();