const express = require('express');
const rotas = express();
const {postaContas, criaContaNova, atualizaUsuario, deletaConta, depositaNaConta, sacaDaConta, transferenciaEntreContas, saldoDaConta, extratoDaConta} = require('./controladores/operacoes');

rotas.use(express.json());

rotas.get('/contas', postaContas)
rotas.post('/contas', criaContaNova)
rotas.put('/contas/:numeroConta/usuario', atualizaUsuario)
rotas.delete('/contas/:numeroConta', deletaConta)
rotas.post('/transacoes/depositar', depositaNaConta)
rotas.post('/transacoes/sacar', sacaDaConta)
rotas.post('/transacoes/transferir', transferenciaEntreContas)
rotas.get('/contas/saldo', saldoDaConta)
rotas.get('/contas/extrato', extratoDaConta)

module.exports = rotas;
