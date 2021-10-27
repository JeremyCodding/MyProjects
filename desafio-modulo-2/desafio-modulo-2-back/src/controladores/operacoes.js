const bancoDeDados = require('../bancodedados');
const {format} = require('date-fns'); 

function createTimeStamp() {
    const momentoAtual = new Date();
    return format(momentoAtual, "yyyy-MM-dd' 'HH:mm:ss")
}
const postaContas = (req, res) => {
    const senhaFornecida = req.query.senha_banco

    if (senhaFornecida === bancoDeDados.banco.senha) {
        const contasDoBanco = bancoDeDados.contas;
        res.status(200)
        res.json(contasDoBanco)
    }else {
        res.status(401)
        res.json({
            mensagem: "A senha informada não é válida!"
        })
    }
}
const criaContaNova = (req, res) => {
    let nextAccNumber;
    const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;

    if(bancoDeDados.contas.length !== 0){
        const numeroUltimaConta = bancoDeDados.contas[bancoDeDados.contas.length - 1].numero;
        nextAccNumber = Number(numeroUltimaConta) + 1;
    }else {
        nextAccNumber = 1;
    }


    const emailRepetido = bancoDeDados.contas.find(contaEmail => contaEmail.usuario.email === email);
    const cpfRepetido = bancoDeDados.contas.find(contaCPF => contaCPF.usuario.cpf === cpf);

    if (cpfRepetido || emailRepetido) {
        res.status(400)
        return res.json({
            "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
        })
    }else {
        const newConta = {
            "numero": nextAccNumber.toString(),
            "saldo": 0,
            "usuario": {
                "nome": nome,
                "cpf": cpf,
                "data_nascimento": data_nascimento,
                "telefone": telefone,
                "email": email,
                "senha": senha
            }
        }

        bancoDeDados.contas.push(newConta);
        return res.status(201).send();
    }
}
const atualizaUsuario = (req, res) => {
    const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;
    const numeroDaConta = req.params.numeroConta;
    const validacaoNumConta = bancoDeDados.contas.findIndex(conta => conta.numero === numeroDaConta);

    if (validacaoNumConta === -1) {
        res.status(400);
        res.json({
            mensagem: "O número de conta informado é inválido!"
        })
    }

    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        res.status(400);
        res.json({
            mensagem: "Todos os campos do usuário precisam ser preenchidos!"
        })
    }

    for (let conta of bancoDeDados.contas) {
        if (conta.numero !== numeroDaConta && conta.cpf === cpf) {
            return res.status(400).json({
                mensagem: "Já existe um conta cadastrada com esse CPF!"
            })
        }else if (conta.numero !== numeroDaConta && conta.email === email) {
            return res.status(400).json({
                mensagem: "Já existe uma conta cadastrada com esse email!"
            })
        }
    }

    bancoDeDados.contas[validacaoNumConta].usuario.nome = nome;
    bancoDeDados.contas[validacaoNumConta].usuario.cpf = cpf;
    bancoDeDados.contas[validacaoNumConta].usuario.data_nascimento = data_nascimento;
    bancoDeDados.contas[validacaoNumConta].usuario.telefone = telefone;
    bancoDeDados.contas[validacaoNumConta].usuario.email = email;
    bancoDeDados.contas[validacaoNumConta].usuario.senha = senha;

    res.status(204)
    res.send()
    
}
const deletaConta = (req, res) => {
    const numeroDaConta = req.params.numeroConta;
    const numeroValido = bancoDeDados.contas.findIndex(conta => conta.numero === numeroDaConta);

    if (numeroValido !== -1 && bancoDeDados.contas[numeroValido].saldo === 0) {
        bancoDeDados.contas.splice(numeroValido, 1)
        res.status(204)
        res.send()
    }else {
        res.status(400)
        res.json({
            mensagem: "Não é possível excluir a conta selecionada!"
        })
    }

}
const depositaNaConta = (req, res) => {
    const { numero_conta, valor} = req.body;

    if (!numero_conta || !valor){
        return res.status(400).json({
            mensagem: "Por favor, informe valor e número da conta!"
        })
    }

    const checaNumConta = bancoDeDados.contas.findIndex(conta => conta.numero === numero_conta);

    if (checaNumConta === -1) {
        res.status(400).json({
            mensagem: "O número de conta informado não existe!"
        })
    }

    if(valor < 0) {
        res.status(400).json({
            mensagem: "O valor do depósito não é válido!"
        })
    }

    bancoDeDados.contas[checaNumConta].saldo = bancoDeDados.contas[checaNumConta].saldo + valor

    const novaMovimentacao = {
        'data': createTimeStamp(),
        'numero_conta': numero_conta,
        'valor': valor
    }

    bancoDeDados.depositos.push(novaMovimentacao)

    res.status(200).send()

}
const sacaDaConta = (req, res) => {
    const { numero_conta, valor, senha} = req.body;
    const checaNumConta = bancoDeDados.contas.findIndex(conta => conta.numero === numero_conta);
    let contaUtilizada;

    if(!numero_conta || !valor || !senha) {
        return res.status(400).json({
            mensagem: "Todos os campos precisam ser preenchidos!"
        })
    }

    if (checaNumConta === -1) {
        return res.status(400).json({
            mensagem: "O número de conta informado não existe!"
        })
    }else {
        contaUtilizada = bancoDeDados.contas[checaNumConta]
    }

    if (senha !== contaUtilizada.usuario.senha) {
        return res.status(400).json({
            mensagem: "A senha informada está incorreta!"
        })
    }

    if(valor < 0) {
        return res.status(400).json({
            mensagem: "O valor do depósito não é válido!"
        })
    }

    if (contaUtilizada.saldo >= valor) {
        const novaMovimentacao = {
            'data': createTimeStamp(),
            'numero_conta': numero_conta,
            'valor': valor
        }
        contaUtilizada.saldo = contaUtilizada.saldo - valor;
        bancoDeDados.saques.push(novaMovimentacao)
        return res.status(200).send()
    }else {
        return res.status(400).json({
            mensagem: "A conta não possui saldo suficiente!"
        })
    }
}
const transferenciaEntreContas = (req, res) => {
    const {numero_conta_origem: contaSaida, numero_conta_destino: contaEntrada, valor, senha} = req.body;
    const checaNumContaSaida = bancoDeDados.contas.findIndex(conta => conta.numero === contaSaida);
    const checaNumContaEntrada = bancoDeDados.contas.findIndex(conta => conta.numero === contaEntrada);
    
    if(!contaEntrada || !contaSaida || !valor || !senha) {
        return res.status(400).json({
            mensagem: "informe todos os valores pedidos para continuar com a operação!"
        })
    }

    if (checaNumContaEntrada === -1 || checaNumContaSaida === -1) {
        return res.status(400).json({
            mensagem: "Insira um valor válido de conta em ambos os espaços!"
        })
    }

    if (senha !== bancoDeDados.contas[checaNumContaSaida].usuario.senha) {
        return res.status(400).json({
            mensagem: "A senha informada está incorreta!"
        })
    }

    if(bancoDeDados.contas[checaNumContaSaida].saldo < valor) {
        return res.status(400).json({
            mensagem: "O valor da transferência excede o limite do saldo disponível!"
        })
    }

    bancoDeDados.contas[checaNumContaSaida].saldo = bancoDeDados.contas[checaNumContaSaida].saldo - valor;
    bancoDeDados.contas[checaNumContaEntrada].saldo = bancoDeDados.contas[checaNumContaEntrada].saldo + valor;

    const novaMovimentacao = {
        'data': createTimeStamp(),
        'numero_conta_origem': contaSaida,
        'numero_conta_destino': contaEntrada,
        'valor': valor
    }
    bancoDeDados.transferencias.push(novaMovimentacao)

    return res.status(200).send()

}
const saldoDaConta = (req, res) => {
    const senhaFornecida = req.query.senha;
    const contaFornecida = req.query.numero_conta;
    const checaNumConta = bancoDeDados.contas.findIndex(conta => conta.numero === contaFornecida);
    let contaUtilizada;

    if (!senhaFornecida || !contaFornecida) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos requistados para prosseguir com a operação!"
        })
    }

    if (checaNumConta === -1) {
        return res.status(400).json({
            mensagem: "O número de conta informado não existe!"
        })
    }else {
        contaUtilizada = bancoDeDados.contas[checaNumConta]
    }

    if (senhaFornecida !== contaUtilizada.usuario.senha) {
        return res.status(400).json({
            mensagem: "A senha informada está incorreta!"
        })
    }

    return res.status(200).json({
        saldo: contaUtilizada.saldo
    })
}
const extratoDaConta = (req, res) => {
    const senhaFornecida = req.query.senha;
    const contaFornecida = req.query.numero_conta;
    const checaNumConta = bancoDeDados.contas.findIndex(conta => conta.numero === contaFornecida);
    let contaUtilizada;

    if (!contaFornecida || !senhaFornecida) {
        return res.status(400).json({
            mensagem: "O número da conta e a senha precisam ser fornecidos!"
        })
    }

    if (checaNumConta === -1) {
        return res.status(400).json({
            mensagem: "O número de conta informado não existe!"
        })
    }else {
        contaUtilizada = bancoDeDados.contas[checaNumConta]
    }

    if (senhaFornecida !== contaUtilizada.usuario.senha) {
        return res.status(400).json({
            mensagem: "A senha informada está incorreta!"
        })
    }

    const depositosDaConta = bancoDeDados.depositos.filter(depositos => depositos.numero_conta === contaFornecida);
    const saquesDaConta = bancoDeDados.saques.filter(saques => saques.numero_conta === contaFornecida);
    const transferenciasEnviadas = bancoDeDados.transferencias.filter(transferencias => transferencias.numero_conta_origem === contaFornecida);
    const transferenciasRecebidas = bancoDeDados.transferencias.filter(transferencias => transferencias.numero_conta_destino === contaFornecida);

    return res.status(200).json({
        depositos: depositosDaConta,
        saques: saquesDaConta,
        transferenciasEnviadas,
        transferenciasRecebidas
    })
}

module.exports = {
    createTimeStamp,
    postaContas,
    criaContaNova,
    atualizaUsuario,
    deletaConta,
    depositaNaConta,
    sacaDaConta,
    transferenciaEntreContas,
    saldoDaConta,
    extratoDaConta
}