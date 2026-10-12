const test = require('node:test');
const assert = require('node:assert/strict');

const {
    ProfessorController,
} = require('../src/presentation/controllers/ProfessorController');

const {
    AlunoController,
} = require('../src/presentation/controllers/AlunoController');

const {
    AuthController,
} = require('../src/presentation/controllers/AuthController');

// Simula a resposta do Express, sem iniciar servidor HTTP.
function createResponse() {
    return {
        statusCode: 200,
        body: undefined,

        status(code) {
            this.statusCode = code;
            return this;
        },

        json(body) {
            this.body = body;
            return this;
        },
    };
}

function createError(message, extra = {}) {
    return Object.assign(new Error(message), extra);
}

// PROFESSORES

test('ProfessorController - lista professores com sucesso', async () => {
    const professores = [{ id: 1, nome: 'Alberto' }];

    const controller = new ProfessorController({
        getAllProfessorsUseCase: {
            execute: async () => professores,
        },
    });

    const res = createResponse();

    await controller.getAllProfessores({ query: {} }, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, professores);
});

test('ProfessorController - repassa filtros ao caso de uso', async () => {
    const filtros = {
        disciplina: 'Matemática',
        precoMax: '80',
    };

    let filtrosRecebidos;

    const controller = new ProfessorController({
        getAllProfessorsUseCase: {
            execute: async (query) => {
                filtrosRecebidos = query;
                return [];
            },
        },
    });

    const res = createResponse();

    await controller.getAllProfessores({ query: filtros }, res);

    assert.deepEqual(filtrosRecebidos, filtros);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, []);
});

test('ProfessorController - retorna 400 para filtro inválido', async () => {
    const controller = new ProfessorController({
        getAllProfessorsUseCase: {
            execute: async () => {
                throw new Error(
                    'O preço mínimo não pode ser negativo'
                );
            },
        },
    });

    const res = createResponse();

    await controller.getAllProfessores(
        { query: { precoMin: '-10' } },
        res
    );

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /preço mínimo/i);
});

test('ProfessorController - retorna 500 em erro inesperado', async () => {
    const controller = new ProfessorController({
        getAllProfessorsUseCase: {
            execute: async () => {
                throw new Error('Falha interna');
            },
        },
    });

    const res = createResponse();

    await controller.getAllProfessores({ query: {} }, res);

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.message, 'Erro interno do servidor');
});

test('ProfessorController - busca professor por ID', async () => {
    const professor = { id: 7, nome: 'Marina' };

    const controller = new ProfessorController({
        getProfessorByIdUseCase: {
            execute: async (id) => {
                assert.equal(id, '7');
                return professor;
            },
        },
    });

    const res = createResponse();

    await controller.getProfessorById(
        { params: { id: '7' } },
        res
    );

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, professor);
});

test('ProfessorController - retorna 404 se não encontrar professor', async () => {
    const controller = new ProfessorController({
        getProfessorByIdUseCase: {
            execute: async () => null,
        },
    });

    const res = createResponse();

    await controller.getProfessorById(
        { params: { id: '999' } },
        res
    );

    assert.equal(res.statusCode, 404);
    assert.equal(res.body.message, 'Professor não encontrado');
});

test('ProfessorController - cria professor com sucesso', async () => {
    const novoProfessor = {
        id: 3,
        nome: 'Ana',
        email: 'ana@example.com',
    };

    const dados = {
        nome: 'Ana',
        email: 'ana@example.com',
        senha: 'senha-teste',
    };

    let dadosRecebidos;

    const controller = new ProfessorController({
        createProfessorUseCase: {
            execute: async (body) => {
                dadosRecebidos = body;
                return novoProfessor;
            },
        },
    });

    const res = createResponse();

    await controller.createProfessor({ body: dados }, res);

    assert.equal(res.statusCode, 201);
    assert.deepEqual(dadosRecebidos, dados);
    assert.deepEqual(res.body, novoProfessor);
});

test('ProfessorController - rejeita dados obrigatórios ausentes', async () => {
    const controller = new ProfessorController({
        createProfessorUseCase: {
            execute: async () => {
                throw new Error(
                    'Nome, email e senha são obrigatórios.'
                );
            },
        },
    });

    const res = createResponse();

    await controller.createProfessor(
        { body: { nome: 'Ana' } },
        res
    );

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /obrigatórios/i);
});

test('ProfessorController - trata e-mail duplicado', async () => {
    const controller = new ProfessorController({
        createProfessorUseCase: {
            execute: async () => {
                throw createError('Duplicado', {
                    code: 'ER_DUP_ENTRY',
                });
            },
        },
    });

    const res = createResponse();

    await controller.createProfessor({
        body: {
            nome: 'Ana',
            email: 'ana@example.com',
            senha: 'senha-teste',
        },
    }, res);

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, 'Email já cadastrado');
});

// ALUNOS

test('AlunoController - lista alunos com sucesso', async () => {
    const alunos = [
        {
            id: 1,
            nome: 'João',
            email: 'joao@example.com',
        },
    ];

    const controller = new AlunoController({
        getAllAlunosUseCase: {
            execute: async () => alunos,
        },
    });

    const res = createResponse();

    await controller.getAllAlunos({}, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, alunos);
});

test('AlunoController - retorna 404 se aluno não existir', async () => {
    const controller = new AlunoController({
        getAlunoByIdUseCase: {
            execute: async () => null,
        },
    });

    const res = createResponse();

    await controller.getAlunoById(
        { params: { id: '999' } },
        res
    );

    assert.equal(res.statusCode, 404);
    assert.equal(res.body.message, 'Aluno não encontrado');
});

test('AlunoController - não retorna senha na resposta pública', async () => {
    const controller = new AlunoController({
        createAlunoUseCase: {
            execute: async () => ({
                id: 12,
                nome: 'João',
                email: 'joao@example.com',
                senha: 'nao-deve-ser-retornada',
            }),
        },
    });

    const res = createResponse();

    await controller.createAluno({
        body: {
            nome: 'João',
            email: 'joao@example.com',
            senha: 'senha-teste',
        },
    }, res);

    assert.equal(res.statusCode, 201);

    assert.deepEqual(res.body, {
        id: 12,
        nome: 'João',
        email: 'joao@example.com',
    });

    assert.equal(
        Object.hasOwn(res.body, 'senha'),
        false
    );
});

test('AlunoController - rejeita dados obrigatórios ausentes', async () => {
    const controller = new AlunoController({
        createAlunoUseCase: {
            execute: async () => {
                throw new Error(
                    'Nome, email e senha são obrigatórios.'
                );
            },
        },
    });

    const res = createResponse();

    await controller.createAluno(
        { body: { nome: 'João' } },
        res
    );

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /obrigatórios/i);
});

test('AlunoController - trata e-mail duplicado', async () => {
    const controller = new AlunoController({
        createAlunoUseCase: {
            execute: async () => {
                throw createError('Duplicado', {
                    code: 'ER_DUP_ENTRY',
                });
            },
        },
    });

    const res = createResponse();

    await controller.createAluno({
        body: {
            nome: 'João',
            email: 'joao@example.com',
            senha: 'senha-teste',
        },
    }, res);

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, 'Email já cadastrado');
});

// AUTENTICAÇÃO

test('AuthController - login retorna usuário', async () => {
    const usuario = {
        id: 1,
        nome: 'João',
        tipoUsuario: 'Aluno',
    };

    const controller = new AuthController({
        loginUseCase: {
            execute: async (credenciais) => {
                assert.deepEqual(credenciais, {
                    email: 'joao@example.com',
                    senha: 'senha-teste',
                });

                return usuario;
            },
        },
    });

    const res = createResponse();

    await controller.login({
        body: {
            email: 'joao@example.com',
            senha: 'senha-teste',
        },
    }, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { usuario });
});

test('AuthController - mantém status 401 para credenciais inválidas', async () => {
    const controller = new AuthController({
        loginUseCase: {
            execute: async () => {
                throw createError('Senha incorreta', {
                    statusCode: 401,
                });
            },
        },
    });

    const res = createResponse();

    await controller.login({
        body: {
            email: 'joao@example.com',
            senha: 'errada',
        },
    }, res);

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, 'Senha incorreta');
});
