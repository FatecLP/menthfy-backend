class GetAllProfessorsUseCase {
    constructor(professorRepository) {
        this.professorRepository = professorRepository;
    }

    async execute(filters = {}) {
        const normalizedFilters = {
            ...filters,
            busca: filters.busca?.trim(),
            disciplina: filters.disciplina?.trim(),
        };

        if (normalizedFilters.precoMin !== undefined) {
            normalizedFilters.precoMin = Number(normalizedFilters.precoMin);
            if (isNaN(normalizedFilters.precoMin)) {
                throw new Error('O preço mínimo deve ser um número válido.');
            }
        }

        if (normalizedFilters.precoMax !== undefined) {
            normalizedFilters.precoMax = Number(normalizedFilters.precoMax);
            if (isNaN(normalizedFilters.precoMax)) {
                throw new Error('O preço máximo deve ser um número válido.');
            }
        }

        if (normalizedFilters.avaliacaoMin !== undefined) {
            normalizedFilters.avaliacaoMin = Number(normalizedFilters.avaliacaoMin);
            if (isNaN(normalizedFilters.avaliacaoMin)) {
                throw new Error('A avaliação mínima deve ser um número válido.');
            }
        }

        if (normalizedFilters.tempoRespostaMax !== undefined) {
            normalizedFilters.tempoRespostaMax = Number(normalizedFilters.tempoRespostaMax);
            if (isNaN(normalizedFilters.tempoRespostaMax)) {
                throw new Error('O tempo máximo de resposta deve ser um número válido.');
            }
        }

        if (
            normalizedFilters.precoMin !== undefined &&
            normalizedFilters.precoMax !== undefined &&
            normalizedFilters.precoMin > normalizedFilters.precoMax
        ) {
            throw new Error('O preço mínimo não pode ser maior que o preço máximo.');
        }

        if (
            normalizedFilters.avaliacaoMin !== undefined &&
            (normalizedFilters.avaliacaoMin < 0 || normalizedFilters.avaliacaoMin > 5)
        ) {
            throw new Error('A avaliação mínima deve estar entre 0 e 5.');
        }

        if (normalizedFilters.precoMin !== undefined && normalizedFilters.precoMin < 0) {
            throw new Error('O preço mínimo não pode ser negativo.');
        }

        if (normalizedFilters.precoMax !== undefined && normalizedFilters.precoMax < 0) {
            throw new Error('O preço máximo não pode ser negativo.');
        }

        if (normalizedFilters.tempoRespostaMax !== undefined && normalizedFilters.tempoRespostaMax < 0) {
            throw new Error('O tempo máximo de resposta não pode ser negativo.');
        }

        if (!normalizedFilters.ordenar) {
            normalizedFilters.ordenar = 'avaliacao';
        }

        if (!normalizedFilters.ordem) {
            normalizedFilters.ordem = 'desc';
        }

        return await this.professorRepository.getAllProfessors(normalizedFilters);
    }
}

module.exports = GetAllProfessorsUseCase;
