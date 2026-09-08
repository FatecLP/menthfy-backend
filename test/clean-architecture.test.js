const test = require('node:test');
const assert = require('node:assert/strict');

const GetAllProfessorsUseCase = require('../src/application/usecases/professor/GetAllProfessorsUseCase');
const LoginUseCase = require('../src/application/usecases/auth/LoginUseCase');
const Professor = require('../src/domain/models/Professor');
const Aluno = require('../src/domain/models/Aluno');

class MockProfessorRepository {
    constructor() {
        this.professores = [
            new Professor({
                id: 1,
                nome: 'Alberto',
                disciplina_principal: 'Programação',
                preco_hora: 50,
                media_avaliacao: 4.9,
                email: 'alberto@menthfy.com',
                senha: '123'
            }),
            new Professor({
                id: 2,
                nome: 'Bernardo',
                disciplina_principal: 'Português',
                preco_hora: 70,
                media_avaliacao: 4.8,
                email: 'bernardo@menthfy.com',
                senha: '123'
            })
        ];
    }

    async getAllProfessors(filters = {}) {
        let list = [...this.professores];
        if (filters.disciplina) {
            list = list.filter(p => p.disciplina_principal === filters.disciplina);
        }
        return list;
    }

    async getById(id) {
        return this.professores.find(p => p.id === Number(id)) || null;
    }

    async findByEmail(email) {
        return this.professores.find(p => p.email === email) || null;
    }
}

class MockAlunoRepository {
    constructor() {
        this.alunos = [
            new Aluno({
                id: 1,
                nome: 'João Silva',
                email: 'joao.silva@email.com',
                senha: '123'
            })
        ];
    }

    async getAll() {
        return [...this.alunos];
    }

    async getById(id) {
        return this.alunos.find(a => a.id === Number(id)) || null;
    }

    async findByEmail(email) {
        return this.alunos.find(a => a.email === email) || null;
    }
}

test('GetAllProfessorsUseCase - filtra professores corretamente', async () => {
    const repo = new MockProfessorRepository();
    const useCase = new GetAllProfessorsUseCase(repo);

    const todos = await useCase.execute();
    assert.equal(todos.length, 2);

    const filtrados = await useCase.execute({ disciplina: 'Programação' });
    assert.equal(filtrados.length, 1);
    assert.equal(filtrados[0].nome, 'Alberto');
});

test('GetAllProfessorsUseCase - lança erro de validação para preço inválido', async () => {
    const repo = new MockProfessorRepository();
    const useCase = new GetAllProfessorsUseCase(repo);

    await assert.rejects(
        () => useCase.execute({ precoMin: -10 }),
        /O preço mínimo não pode ser negativo/
    );

    await assert.rejects(
        () => useCase.execute({ precoMin: 100, precoMax: 50 }),
        /O preço mínimo não pode ser maior que o preço máximo/
    );
});

test('LoginUseCase - autentica aluno com sucesso', async () => {
    const alunoRepo = new MockAlunoRepository();
    const profRepo = new MockProfessorRepository();
    const useCase = new LoginUseCase(alunoRepo, profRepo);

    const usuario = await useCase.execute({
        email: 'joao.silva@email.com',
        senha: '123'
    });

    assert.equal(usuario.nome, 'João Silva');
    assert.equal(usuario.tipoUsuario, 'Aluno');
});

test('LoginUseCase - autentica professor com sucesso', async () => {
    const alunoRepo = new MockAlunoRepository();
    const profRepo = new MockProfessorRepository();
    const useCase = new LoginUseCase(alunoRepo, profRepo);

    const usuario = await useCase.execute({
        email: 'alberto@menthfy.com',
        senha: '123'
    });

    assert.equal(usuario.nome, 'Alberto');
    assert.equal(usuario.tipoUsuario, 'Professor');
});

test('LoginUseCase - falha com senha incorreta', async () => {
    const alunoRepo = new MockAlunoRepository();
    const profRepo = new MockProfessorRepository();
    const useCase = new LoginUseCase(alunoRepo, profRepo);

    await assert.rejects(
        () => useCase.execute({ email: 'alberto@menthfy.com', senha: 'errada' }),
        (err) => err.statusCode === 401 && err.message === 'Senha incorreta'
    );
});

test('LoginUseCase - falha com usuário inexistente', async () => {
    const alunoRepo = new MockAlunoRepository();
    const profRepo = new MockProfessorRepository();
    const useCase = new LoginUseCase(alunoRepo, profRepo);

    await assert.rejects(
        () => useCase.execute({ email: 'inexistente@email.com', senha: '123' }),
        (err) => err.statusCode === 401 && err.message === 'Usuário não encontrado'
    );
});
