class GetProfessorByNameUseCase {
    constructor(professorRepository) {
        this.professorRepository = professorRepository;
    }

    async execute(nome) {
        if (!nome || typeof nome !== 'string' || !nome.trim()) {
            throw new Error('O nome do professor é obrigatório.');
        }

        return await this.professorRepository.getByName(nome.trim());
    }
}

module.exports = GetProfessorByNameUseCase;
