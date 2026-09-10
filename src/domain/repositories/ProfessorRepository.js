/**
 * Interface ProfessorRepository (Domain Contract)
 */
class ProfessorRepository {
    async getAllProfessors(filters = {}) {
        throw new Error('Método getAllProfessors não implementado.');
    }

    async getById(id) {
        throw new Error('Método getById não implementado.');
    }

    async getByName(nome) {
        throw new Error('Método getByName não implementado.');
    }

    async findByEmail(email) {
        throw new Error('Método findByEmail não implementado.');
    }

    async create(professorData) {
        throw new Error('Método create não implementado.');
    }
}

module.exports = ProfessorRepository;
