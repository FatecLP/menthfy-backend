class CreateProfessorUseCase {
    constructor(professorRepository) {
        this.professorRepository = professorRepository;
    }

    async execute(professorData = {}) {
        if (!professorData.nome || !professorData.email || !professorData.senha) {
            throw new Error('Nome, email e senha são obrigatórios.');
        }

        return await this.professorRepository.create(professorData);
    }
}

module.exports = CreateProfessorUseCase;
