const MySqlAlunoRepository = require('../../infrastructure/persistence/MySqlAlunoRepository');
const GetAllAlunosUseCase = require('../../application/usecases/aluno/GetAllAlunosUseCase');
const GetAlunoByIdUseCase = require('../../application/usecases/aluno/GetAlunoByIdUseCase');
const CreateAlunoUseCase = require('../../application/usecases/aluno/CreateAlunoUseCase');

class AlunoController {
    constructor({
        getAllAlunosUseCase,
        getAlunoByIdUseCase,
        createAlunoUseCase,
    } = {}) {
        const repo = new MySqlAlunoRepository();
        this.getAllAlunosUseCase = getAllAlunosUseCase || new GetAllAlunosUseCase(repo);
        this.getAlunoByIdUseCase = getAlunoByIdUseCase || new GetAlunoByIdUseCase(repo);
        this.createAlunoUseCase = createAlunoUseCase || new CreateAlunoUseCase(repo);

        this.getAllAlunos = this.getAllAlunos.bind(this);
        this.getAlunoById = this.getAlunoById.bind(this);
        this.createAluno = this.createAluno.bind(this);
    }

    async getAllAlunos(req, res) {
        try {
            const alunos = await this.getAllAlunosUseCase.execute();
            return res.json(alunos);
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            return res.status(500).json({ message: 'Erro ao buscar alunos' });
        }
    }

    async getAlunoById(req, res) {
        try {
            const { id } = req.params;
            const aluno = await this.getAlunoByIdUseCase.execute(id);
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado' });
            }
            return res.json(aluno);
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            return res.status(500).json({ message: 'Erro ao buscar aluno' });
        }
    }

    async createAluno(req, res) {
        try {
            const aluno = await this.createAlunoUseCase.execute(req.body);
            return res.status(201).json({
                id: aluno.id,
                nome: aluno.nome,
                email: aluno.email,
            });
        } catch (error) {
            console.error('Erro ao cadastrar aluno:', error);
            if (error.message.includes('obrigatórios')) {
                return res.status(400).json({ message: error.message });
            }
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Email já cadastrado' });
            }
            return res.status(500).json({ message: 'Erro ao cadastrar aluno' });
        }
    }
}

const defaultAlunoController = new AlunoController();

module.exports = {
    AlunoController,
    alunoController: defaultAlunoController,
    getAllAlunos: defaultAlunoController.getAllAlunos,
    getAlunoById: defaultAlunoController.getAlunoById,
    createAluno: defaultAlunoController.createAluno,
};
