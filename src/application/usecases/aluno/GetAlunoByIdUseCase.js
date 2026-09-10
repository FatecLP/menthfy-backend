class GetAlunoByIdUseCase {
    constructor(alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    async execute(id) {
        if (!id) {
            throw new Error('O ID do aluno é obrigatório.');
        }

        return await this.alunoRepository.getById(id);
    }
}

module.exports = GetAlunoByIdUseCase;
