const MySqlProfessorRepository = require('../../infrastructure/persistence/MySqlProfessorRepository');
const GetAllProfessorsUseCase = require('../../application/usecases/professor/GetAllProfessorsUseCase');
const GetProfessorByIdUseCase = require('../../application/usecases/professor/GetProfessorByIdUseCase');
const GetProfessorByNameUseCase = require('../../application/usecases/professor/GetProfessorByNameUseCase');
const CreateProfessorUseCase = require('../../application/usecases/professor/CreateProfessorUseCase');

class ProfessorController {
    constructor({
        getAllProfessorsUseCase,
        getProfessorByIdUseCase,
        getProfessorByNameUseCase,
        createProfessorUseCase,
    } = {}) {
        const repo = new MySqlProfessorRepository();
        this.getAllProfessorsUseCase = getAllProfessorsUseCase || new GetAllProfessorsUseCase(repo);
        this.getProfessorByIdUseCase = getProfessorByIdUseCase || new GetProfessorByIdUseCase(repo);
        this.getProfessorByNameUseCase = getProfessorByNameUseCase || new GetProfessorByNameUseCase(repo);
        this.createProfessorUseCase = createProfessorUseCase || new CreateProfessorUseCase(repo);

        this.getAllProfessores = this.getAllProfessores.bind(this);
        this.getProfessorById = this.getProfessorById.bind(this);
        this.getProfessorByName = this.getProfessorByName.bind(this);
        this.createProfessor = this.createProfessor.bind(this);

        this.getAll = this.getAllProfessores;
        this.getById = this.getProfessorById;
        this.getByName = this.getProfessorByName;
        this.create = this.createProfessor;
    }

    async getAllProfessores(req, res) {
        try {
            const professores = await this.getAllProfessorsUseCase.execute(req.query);
            return res.status(200).json(professores);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);

            const isValidationError =
                error.message.includes('deve ser um número') ||
                error.message.includes('não pode ser') ||
                error.message.includes('deve estar entre');

            if (isValidationError) {
                return res.status(400).json({ message: error.message });
            }

            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getProfessorById(req, res) {
        try {
            const { id } = req.params;
            const professor = await this.getProfessorByIdUseCase.execute(id);

            if (!professor) {
                return res.status(404).json({ message: 'Professor não encontrado' });
            }

            return res.status(200).json(professor);
        } catch (error) {
            console.error('Erro ao buscar professor por id:', error);

            if (error.message.includes('obrigatório')) {
                return res.status(400).json({ message: error.message });
            }

            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getProfessorByName(req, res) {
        try {
            const { nome } = req.params;
            const professor = await this.getProfessorByNameUseCase.execute(nome);

            if (!professor) {
                return res.status(404).json({ message: 'Professor não encontrado' });
            }

            return res.status(200).json(professor);
        } catch (error) {
            console.error('Erro ao buscar professor por nome:', error);

            if (error.message.includes('obrigatório')) {
                return res.status(400).json({ message: error.message });
            }

            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async createProfessor(req, res) {
        try {
            const novoProfessor = await this.createProfessorUseCase.execute(req.body);
            return res.status(201).json(novoProfessor);
        } catch (error) {
            console.error('Erro ao cadastrar professor:', error);

            if (error.message.includes('obrigatórios')) {
                return res.status(400).json({ message: error.message });
            }

            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Email já cadastrado' });
            }

            return res.status(500).json({ message: 'Erro ao cadastrar professor' });
        }
    }
}

const defaultController = new ProfessorController();

module.exports = {
    ProfessorController,
    professorController: defaultController,
    getAllProfessores: defaultController.getAllProfessores,
    getProfessorById: defaultController.getProfessorById,
    getProfessorByName: defaultController.getProfessorByName,
    createProfessor: defaultController.createProfessor,
};
