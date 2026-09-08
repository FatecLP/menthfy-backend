const MySqlAlunoRepository = require('../../infrastructure/persistence/MySqlAlunoRepository');
const MySqlProfessorRepository = require('../../infrastructure/persistence/MySqlProfessorRepository');
const LoginUseCase = require('../../application/usecases/auth/LoginUseCase');

class AuthController {
    constructor({ loginUseCase } = {}) {
        const alunoRepo = new MySqlAlunoRepository();
        const professorRepo = new MySqlProfessorRepository();
        this.loginUseCase = loginUseCase || new LoginUseCase(alunoRepo, professorRepo);

        this.login = this.login.bind(this);
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const usuario = await this.loginUseCase.execute({ email, senha });

            return res.status(200).json({ usuario });
        } catch (error) {
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }

            console.error('Erro no login:', error);
            return res.status(500).json({ message: 'Erro interno' });
        }
    }
}

const defaultAuthController = new AuthController();

module.exports = {
    AuthController,
    authController: defaultAuthController,
    login: defaultAuthController.login,
};
