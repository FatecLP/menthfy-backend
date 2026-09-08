/**
 * Interface AlunoRepository (Domain Contract)
 */
class AlunoRepository {
    async getAll() {
        throw new Error('Método getAll não implementado.');
    }

    async getById(id) {
        throw new Error('Método getById não implementado.');
    }

    async findByEmail(email) {
        throw new Error('Método findByEmail não implementado.');
    }

    async create(alunoData) {
        throw new Error('Método create não implementado.');
    }
}

module.exports = AlunoRepository;
