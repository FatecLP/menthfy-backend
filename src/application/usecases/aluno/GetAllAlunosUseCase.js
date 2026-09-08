class GetAllAlunosUseCase {
    constructor(alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    async execute() {
        return await this.alunoRepository.getAll();
    }
}

module.exports = GetAllAlunosUseCase;
