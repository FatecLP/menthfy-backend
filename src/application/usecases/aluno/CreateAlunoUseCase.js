class CreateAlunoUseCase {
    constructor(alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    async execute(alunoData = {}) {
        const { nome, email, senha } = alunoData;
        if (!nome || !email || !senha) {
            throw new Error('Nome, email e senha são obrigatórios.');
        }

        return await this.alunoRepository.create({ nome, email, senha });
    }
}

module.exports = CreateAlunoUseCase;
