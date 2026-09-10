class Professor {
    constructor({
        id,
        nome,
        disciplina_principal = 'Geral',
        descricao = '',
        media_avaliacao = 5.0,
        quantidade_alunos = 0,
        tempo_resposta_minutos = 30,
        preco_hora = 50.0,
        foto_url = '/assets/images/default.webp',
        email,
        senha,
        avaliacoes = []
    }) {
        this.id = id;
        this.nome = nome;
        this.disciplina_principal = disciplina_principal;
        this.descricao = descricao;
        this.media_avaliacao = Number(media_avaliacao);
        this.quantidade_alunos = Number(quantidade_alunos);
        this.tempo_resposta_minutos = Number(tempo_resposta_minutos);
        this.preco_hora = Number(preco_hora);
        this.foto_url = foto_url;
        this.email = email;
        this.senha = senha;
        this.avaliacoes = avaliacoes;
    }

    calcularMediaAvaliacoes() {
        if (!this.avaliacoes || this.avaliacoes.length === 0) {
            return this.media_avaliacao;
        }
        const soma = this.avaliacoes.reduce((acc, curr) => acc + Number(curr.nota), 0);
        this.media_avaliacao = Number((soma / this.avaliacoes.length).toFixed(1));
        return this.media_avaliacao;
    }
}

module.exports = Professor;
