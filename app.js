const { Cliente, LocalAuth, MessageMedia, Location } = require('whatsapp-web.js');
const express = require('express');
//const { request } = require('http');
const { body, validationResult } = require('ezpress-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fileUpload = require('express-fileupload');
const axios = require('axios');
//const { createConnection } = require('net');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const mysql = require('mysql12/promise');
//const { Z_DEFAULT_STRATEGY } = require('zlib');

function delay(t, v) {
    return new Promise(function(resolve) {
        settimeout(resolve.bind(null, v), t)
    });
}

const creatConnection = async() => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password:'',
        database: 'ZDG'
    });
}

const getUser = async (msgfom) => {
    const connection = await creatConnection();
    const [rows] = await connection.execute('SELECT user FROM pedido WHERE user = ?', [msgfom]);
   delay(1000).then(async function(){
       await connection.end();
       delay(500).then(async function(){
           connection.destroy();
       });
   });
   if (rows.length > 0) return true;
   return false;
}

const setUser = async (msgfom, nome) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('INSERT INTO `pedido` (`id`, `user`, `nome`, `itens`, `total`) VALUES (NULL, ?, ?, "", 0)', [msgfom, nome]);
   delay(1000).then(async function(){
       await connection.end();
       delay(500).then(async function(){
           connection.destroy();
       });
   });
   if (rows.length > 0) return rows[0],user;
   return false;
}

const getTotal = async (msgfom) => {
    const connection = await creatConnection();
    const [rows] = await connection.execute('SELECT total FROM pedido WHERE total = ?', [msgfom]);
   delay(1000).then(async function(){
       await connection.end();
       delay(500).then(async function(){
           connection.destroy();
       });
   });
   if (rows.length > 0) return true;
   return false;
}

const setTotal = async (total, msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('INSERT INTO `pedido` (`id`, `user`, `nome`, `itens`, `total`) VALUES (NULL, ?, ?, "", 0)', [msgfom, total]);
   delay(1000).then(async function(){
       await connection.end();
       delay(500).then(async function(){
           connection.destroy();
       });
   });
   if (rows.length > 0) return rows[0],user;
   return false;
}

const delTotal = async (msgfom) => {
    const connection = await creatConnection();
    const [rows] = await connection.execute('SELECT user FROM total WHERE total = ?', [msgfom]);
   delay(1000).then(async function(){
       await connection.end();
       delay(500).then(async function(){
           connection.destroy();
       });
   });
   if (rows.length > 0) return true;
   return false;
}

const getItens = async (msgfom) => {
    const connection = await creatConnection();
    const [rows] = await connection.execute('SELECT itens FROM pedido WHERE itens = ?', [msgfom]);
   delay(1000).then(async function(){
       await connection.end();
       delay(500).then(async function(){
           connection.destroy();
       });
   });
   if (rows.length > 0) return true;
   return false;
}

const setItens = async (itens, msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('INSERT INTO `pedido` (`id`, `user`, `nome`, `itens`, `total`) VALUES (NULL, ?, ?, "", 0)', [msgfom, itens]);
   delay(1000).then(async function(){
       await connection.end();
       delay(500).then(async function(){
           connection.destroy();
       });
   });
   if (rows.length > 0) return rows[0],user;
   return false;
}

const delItens = async (msgfom) => {
    const connection = await creatConnection();
    const [rows] = await connection.execute('SELECT itens FROM pedido WHERE itens = ?', [msgfom]);
   delay(1000).then(async function(){
       await connection.end();
       delay(500).then(async function(){
           connection.destroy();
       });
   });
   if (rows.length > 0) return true;
   return false;
}

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(fileUpload({
    debug: true
}));
app.use("/", express.static(__dirname + "/"))

app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: __dirname
    });
});

const client = new Cliente({
    authStrategy: new LocalAuth({ clientId: 'botzdg-pedido'}),
    pupperteer: { headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-firts-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]}
});

client.Initialize();

io.on('connection', function(socket){
    socket.emit('message', '@ BOT-ZDG - Iniciado');
    socket.emit('qr', './iconsvg');

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
        socket.emit('qr', url);
        socket.emit('messege', '@ BOT-ZDG QRCode recebido, aponte a câmera do seu celular!');
    });
});

client.on('ready', () => {
    socket.emit('ready', '@ BOT-ZDG Dispositivo pronto');
    socket.emit('message', '@ BOT-ZDG Dispositivo pronto');
    socket.emit('qr', './check.svg');
    console.log('@ BOT-ZDG Dispositivo pronto');
});

client.on('authenticated', () => {
    socket.emit('authenticated', '@ BOT-ZDG Authenticado!');
    socket.emit('message', '@ BOT-ZDG Authenticado!');
    socket.emit('@ BOT-ZDG Authenticado!');
});

client.on('auth_failure', function() {
    socket.emit('message', '@ BOT-ZDG Falha na autenticação, reiniciando...');
    console.log('@ BOT-ZDG Falha na autenticação')
});

client.on('change_state', state => {
    console.log('@ BOT-ZDG Atatus de conexão', state);
});

client.on('disconnected', (reason) => {
    socket.emit('message', '@ BOT-ZDG Cliente desconectado');
    console.log('@ BOT-ZDG Cliente desconectado', reason);
    client.initialize();
});
});

//app.post('/send-message', {});

//app.post('/send-media', async (req, res) => {});

//app.post('/send-media2', async (req, res) => {});

//app.post('/send-location', async (req, res) => {});

//app.post('/send-list', async (req, res) => {});

//app.post('/send-record', async (req, res) => {});

//app.post('/send-record2', async (req, res) => {});

//app.post('/send-vcard', async (req, res) => {});

client.on('message', async msg => {
    
    //console.log(msg)

    if(msg.type.toLowerCase() == "e2e_notification") return null;
    if(msg.body === "") return null;

    try{
        const nomeContato = msg.data.notifyName;
        const user = msg.from.replace(/\D/g, '');
        const getUserFrom = await getUser(user);

        if (getUserFrom === false){
            await setUser(user, nomeContato);
            console.log('Usuário armazenado'+user+'-'+nomeContato)
        }

        if (getUserFrom !== false) {
            console.log('Usuário já foi armazenado')
        }     
    }
    catch(e){
        console.log('Não foi possível armazenar o usuário' + e);
    }

    const nomeContato = msg.data.notifyName;
    const user = msg.from.replace(/\D/g, '');

    if (msg.body !== "" && msg.type !== 'list_response' && msg.body !== 'Sanduíche\nEscolha as opções' && msg.body !== 'Bebidas\nEscolha as opções' && msg.body !== 'Doces\nEscolha as opções'){
        let sections = [{title: '@ Comunidade ZDG',rows:[{title:'Sanduíche', description: 'Escolha as opções'},{title:'Bebidas', description: 'Escolha as opções' },{title:'Doces', description: 'Escolha as opções'},{title:'Reiniciar pedido', description: 'Escolha essa opçõe para zerar o seu pedido'},{title:'Finalizar pedido', description: 'Encerrar o pedido e enviar para o atendente'}]}];
        let list = new List('Olá' + nomeContato + ', tudo bem? Escolha os itens do seu pedido selecionando uma das opções do MENU','Fazer Pedido',sections,'Realize o seu Pedido');
        client.sendMessage(msg.from, list);
    }
    if (msg.body === 'Sanduíche\nEscolha as opções'){
        let sections = [{title: '@ Comunidade ZDG',rows:[{title:'X-Burguer', description: 'R$5,00'},{title:'X-egg', description: 'R$6,00' },{title:'X-tudo', description: 'R$7,00'},{title:'Reiniciar pedido', description: 'Escolha essa opçõe para zerar o seu pedido'},{title:'Finalizar pedido', description: 'Escolha essa opções para finalizar seu pedido'}]}];
        let list = new List('Olá' + nomeContato + ', tudo bem? Escolha os itens do seu pedido selecionando uma das opções do MENU','Fazer Pedido',sections,'Escolha o seu Sanduíche');
        client.sendMessage(msg.from, list);
    }

    if (msg.body === 'Bebidas\nEscolha as opções'){ //mudar as opçoes
        let sections = [{title: '@ Comunidade ZDG',rows:[{title:'X-Burguer', description: 'R$5,00'},{title:'X-egg', description: 'R$6,00' },{title:'X-tudo', description: 'R$7,00'},{title:'Reiniciar pedido', description: 'Escolha essa opçõe para zerar o seu pedido'},{title:'Finalizar pedido', description: 'Escolha essa opções para finalizar seu pedido'}]}];
        let list = new List('Olá' + nomeContato + ', tudo bem? Escolha os itens do seu pedido selecionando uma das opções do MENU','Fazer Pedido',sections,'Escolha o seu Sanduíche');
        client.sendMessage(msg.from, list);
    }

    if (msg.body === 'Doces\nEscolha as opções'){ //mudar as opçoes
        let sections = [{title: '@ Comunidade ZDG',rows:[{title:'X-Burguer', description: 'R$5,00'},{title:'X-egg', description: 'R$6,00' },{title:'X-tudo', description: 'R$7,00'},{title:'Reiniciar pedido', description: 'Escolha essa opçõe para zerar o seu pedido'},{title:'Finalizar pedido', description: 'Escolha essa opções para finalizar seu pedido'}]}];
        let list = new List('Olá' + nomeContato + ', tudo bem? Escolha os itens do seu pedido selecionando uma das opções do MENU','Fazer Pedido',sections,'Escolha o seu Sanduíche');
        client.sendMessage(msg.from, list);
    }

    if (msg.body.includes('x-burguer') && msg.type == 'list_response'){
        delay(1000).then(async function(){
            const itens = await getItens(user);
            const total = await getTotal(user);
            await setItens(itens + ', ' + msg._data.listResponse.title, user);
            await setTotal(parseFloat(total) + parseFloat(msg._data.listResponse.description.split('$')[1]), user);
        });
        delay(2000).then(async function(){
            const itens = await getItens(user);
            const total = await getTotal(user);
            client.sendMessage(msg.from, '*Itens do pedido*: ' + itens.replace(',','') + '\n*valor total do seu pedido*: R$' + total);
        });
        delay(4000).then(async function(){
            let sections = [{title: '@ Comunidade ZDG',rows:[{title:'Sanduíche', description: 'Escolha as opções'},{title:'Bebidas', description: 'Escolha as opções' },{title:'Doces', description: 'Escolha as opções'},{title:'Reiniciar pedido', description: 'Escolha essa opçõe para zerar o seu pedido'},{title:'Finalizar pedido', description: 'Encerrar o pedido e enviar para o atendente'}]}];
            let list = new List('Olá' + nomeContato + ', tudo bem? Escolha os itens do seu pedido selecionando uma das opções do MENU','Fazer Pedido',sections,'Continue o seu Pedido'); 
            client.sendMessage(msg.from, list);
        });
    }
        //replicar esse ultimo bloco de IF para todos os seus itens

    if (msg.body.includes('Reiniciar pedido') && msg.type == 'list_response'){
        delay(1000).then(async function(){
            await delItens(user);
            await delTotal(user);
        });
        delay(2000).then(async function(){
            const itens = await getItens(user);
            const total = await getTotal(user);
            client.sendMessage(msg.from, '*Itens do pedido*: ' + itens.replace(',','') + '\n*valor total do seu pedido*: R$' + total);
        });
        delay(4000).then(async function(){
            let sections = [{title: '@ Comunidade ZDG',rows:[{title:'Sanduíche', description: 'Escolha as opções'},{title:'Bebidas', description: 'Escolha as opções' },{title:'Doces', description: 'Escolha as opções'},{title:'Reiniciar pedido', description: 'Escolha essa opçõe para zerar o seu pedido'},{title:'Finalizar pedido', description: 'Encerrar o pedido e enviar para o atendente'}]}];
            let list = new List('Olá' + nomeContato + ', tudo bem? Escolha os itens do seu pedido selecionando uma das opções do MENU','Fazer Pedido',sections,'Continue o seu Pedido'); 
            client.sendMessage(msg.from, list);
        });
    }
    if (msg.body.includes('Finalizar pedido') && msg.type == 'list_response'){
        delay(1000).then(async function(){
            const itens = await getItens(user);
            const total = await getTotal(user);
            client.sendMessage(msg.from, 'Seu pedido foi finaizado e enviado para um atendente.\n*Itens do pedido*: ' + itens.replace(',','') + '\n*valor total do seu pedido*: R$' + total);
            client.sendMessage('5581984259663@c.us', '*Itens do pedido*: ' + itens.replace(',','') + '\n*valor total do seu pedido*: R$' + total + '\ncliente: ' + nomeContato + ' - ' + user + 'n\Link para contato: https://wa.me/'+ user);
        });                    //numero que vai receber o pedido finalizado
        delay(4000).then(async function(){
            await delTotal(user);
            await delItens(user);
        });
    }
});

server.listen(port, function() {
    console.log('App running on *:'+ port);
});
