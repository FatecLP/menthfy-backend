class Aluno {
    constructor({ id, nome, email, senha, criado_em }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.criado_em = criado_em;
    }
}

module.exports = Aluno;
