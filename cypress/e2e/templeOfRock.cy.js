import '@shelex/cypress-allure-plugin';

const { generateFakeMembers, generateFakeDiscography, generateFakeUser, getRandomGenre } = require('../support/fakerUtils')
const { faker } = require('@faker-js/faker')

describe('Temple Of Rock', () => {
    beforeEach(() => {
        cy.visit('/web')
    })

    it('Verifica o título da página Temple of Rock', () => {   
        cy.title().should('be.equal', 'Temple Of Rock')
    })

    const letrasParaTestar = ['d', 'i', 'l', 'u']
    letrasParaTestar.forEach(letra => {
        it(`Consulta Lista de Bandas pela Letra "${letra}"`, () => {   
            cy.searchBandByLetter(letra)
        })
    })

    const bandasParaTestar = ['Metal Factor', 'Ultimate School', 'Dr. Doom']
    bandasParaTestar.forEach(banda => {
        it(`Consulta de Banda pelo Nome: ${banda}`, () => {
            cy.searchBandByName(banda)
        })
    })

    it('Faz Login de Usuário com sucesso', () => {
        cy.login()
    })

    it('Faz Login de Usuário com falha', () => {
        cy.loginFail('jhon','123456')
        cy.get('.error').should('contain','Usuário ou senha incorretos.')
    })

    it('Faz Cadastro de Novo Usuário com sucesso', () => {
        cy.get('#loginSection a').click()
        cy.url().should('include', `login.html`)
        cy.registerUser(generateFakeUser())
        cy.get('.success').should('contain', 'Usuário registrado com sucesso!')
    })

    it('Faz Cadastro de Novo Usuário com E-mail Invalido', () => {
        cy.get('#loginSection a').click()
        cy.url().should('include', `login.html`)
        const user = generateFakeUser()
        cy.registerUser({...user, email:'meuemail&meuemail.com'})
        cy.get('.error').should('contain', 'Erro no registro. Tente novamente.')
    })

    it('Faz o Cadastro de uma Nova Banda', () => {
        cy.login()
        const fakeBand = {
            name: faker.word.adjective() + ' ' + faker.word.noun(),
            genre: getRandomGenre(),
            members: generateFakeMembers(3).join(', '),
            formationYear: faker.date.past(30).getFullYear(),
            country: faker.location.country()
        }
        cy.registerBand(fakeBand)
    })

    it('Faz a Edição dos dados de uma Banda já Cadastrada e Inclui novos Discos', () => {
        cy.login()
        const updates = {
            genre: getRandomGenre(),
            members: generateFakeMembers(4).join(', '),
            country: faker.location.country()
        }
        const newDiscs = generateFakeDiscography(1990,2)
        cy.editBand('Iron Show', updates, newDiscs)
    })

    it('Inclui Discos para uma Banda', () => {
        cy.login()
        const newDiscs = generateFakeDiscography(2000,1)
        cy.addDiscsToBand('The Prevent', newDiscs)
    })

    it('Desiste de fazer a Edição dos dados de uma Banda já Cadastrada', () => {
        cy.login()
        const updates = {
            genre: getRandomGenre(),
            members: generateFakeMembers(4).join(', '),
            country: faker.location.country()
        }
        const newDiscs = generateFakeDiscography(1990,2)
        cy.editBandCancel('Iron Daughter', updates, newDiscs)
    })
})
