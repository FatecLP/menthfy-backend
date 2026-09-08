class GetProfessorByIdUseCase {
    constructor(professorRepository) {
        this.professorRepository = professorRepository;
    }

    async execute(id) {
        if (!id) {
            throw new Error('O ID do professor é obrigatório.');
        }

        return await this.professorRepository.getById(id);
    }
}

module.exports = GetProfessorByIdUseCase;
