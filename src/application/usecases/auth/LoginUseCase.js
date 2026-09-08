const Usuario = require('../../../domain/models/Usuario');

class LoginUseCase {
    constructor(alunoRepository, professorRepository) {
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
    }

    async execute({ email, senha }) {
        if (!email || !senha) {
            const error = new Error('Email e senha são obrigatórios.');
            error.statusCode = 400;
            throw error;
        }

        const aluno = await this.alunoRepository.findByEmail(email);
        if (aluno) {
            if (aluno.senha !== senha) {
                const error = new Error('Senha incorreta');
                error.statusCode = 401;
                throw error;
            }

            return new Usuario({
                id: aluno.id,
                nome: aluno.nome,
                email: aluno.email,
                tipoUsuario: 'Aluno',
            });
        }

        const professor = await this.professorRepository.findByEmail(email);
        if (professor) {
            if (professor.senha !== senha) {
                const error = new Error('Senha incorreta');
                error.statusCode = 401;
                throw error;
            }

            return new Usuario({
                id: professor.id,
                nome: professor.nome,
                email: professor.email,
                tipoUsuario: 'Professor',
            });
        }

        const error = new Error('Usuário não encontrado');
        error.statusCode = 401;
        throw error;
    }
}

module.exports = LoginUseCase;
