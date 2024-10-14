const { generateFakeMembers, generateFakeDiscography, generateFakeUser, getRandomGenre } = require('../support/fakerUtils')
const { faker } = require('@faker-js/faker')
describe('Temple Of Rock', () => {
    beforeEach(function() {
        cy.visit('http://localhost:9090/web')
    })
    it('Verifica o título da página Temple of Rock', () => {   
        cy.title().should('be.equal', 'Temple Of Rock')
    })

    const letrasParaTestar = ['b', 'a', 'z']
    letrasParaTestar.forEach(letra => {
        it('Consulta Lista de Bandas pela Letra Inicial do Nome', () => {   
            cy.get('#letterSearch').clear().type(letra, { delay: 0 })
            cy.get('#searchByLetterBtn').click()

            cy.url().should('include', `bandsList.html?letter=${letra}`)
            cy.get('#bandsList').should('exist')
            cy.get('#bandsList').children().should('have.length.greaterThan', 0)
        })
    })

    let bandId
    const bandasparatestar = ['asia', 'Lost Horizon']
    bandasparatestar.forEach(banda => {
            it('Consulta de Banda pelo Nome', () => {  
                cy.request(`/api/bands/search?name=${banda}`).then((response) => {
                    cy.log(JSON.stringify(response.body))
                    expect(response.body).to.have.property('_id')
                    bandId = response.body._id

                cy.get('#searchBandSection').find('#searchBand').type('banda')
                cy.get('#searchBand').clear().type(banda, { delay: 0 })
                cy.get('#searchByNameBtn').click()

                cy.url().should('include', `bandDetails.html?id=${bandId}`)
                cy.get('#bandDetails').should('exist')
            })
        })
    })

    it('Faz Login de Usuário com sucesso', () => {    
        cy.get('#loginSection a').click()
        cy.url().should('include', `login.html`)
        cy.get('#username').type('admin')
        cy.get('#password').type('123')
        cy.get('#loginBtn').click()

        cy.get('.success').should('be.visible')
        cy.get('.success').should('contain', 'Login realizado com sucesso!')

    })

    it('Faz Login de Usuário com falha', () => {    
        cy.get('#loginSection a').click()
        cy.url().should('include', `login.html`)
        cy.get('#username').type('jhon')
        cy.get('#password').type('123456')
        cy.get('#loginBtn').click()

        cy.get('.error').should('be.visible')
        cy.get('.error').should('contain', 'Usuário ou senha incorretos.')
        
    })

    it('Faz Cadastro de Novo Usuário com sucesso', () => {  
  
        cy.get('#loginSection a').click()
        cy.url().should('include', `login.html`)
        const fakeUser = generateFakeUser()   
            cy.get('#registerUsername').type(fakeUser.username)
            cy.get('#registerPassword').type(fakeUser.password)
            cy.get('#registerEmail').type(fakeUser.email)

            cy.get('#registerBtn').click()

            cy.get('.success').should('be.visible')
            cy.get('.success').should('contain', 'Usuário registrado com sucesso!')

    })

    it('Faz Cadastro de Novo Usuário com E-mail Invalido', () => {   
        cy.get('#loginSection a').click()
        cy.url().should('include', `login.html`)
        const fakeUser = generateFakeUser()
            cy.get('#registerUsername').type(fakeUser.username)
            cy.get('#registerPassword').type(fakeUser.password)
            cy.get('#registerEmail').type('meuemail&meuemail.com')
            cy.get('#registerBtn').click()
            cy.get('.error').should('be.visible')
            cy.get('.error').should('contain', 'Erro no registro. Tente novamente.')
    })

    it('Faz Login e visita a pagina de Opções', () => {    
        cy.get('#loginSection a').click()
        cy.url().should('include', `login.html`)
        cy.get('#username').type('admin')
        cy.get('#password').type('123')
        cy.get('#loginBtn').click()
        cy.get('.success').should('contain', 'Login realizado com sucesso!')

        cy.wait(5000)
        cy.url().should('include', `optionsPage.html`)
        cy.get('#bandOptions').should('be.visible')
    })

    it('Faz o Cadastro de uma Nova Banda', () => {
        cy.get('#loginSection a').click()
        cy.url().should('include', `login.html`)
        cy.get('#username').type('admin')
        cy.get('#password').type('123')
        cy.get('#loginBtn').click()
        cy.get('.success').should('contain', 'Login realizado com sucesso!')
        cy.wait(5000)
        
        cy.url().should('include', `optionsPage.html`)
        cy.contains('button', 'Cadastrar Banda').click()
        cy.url().should('include', `registerBand.html`)

        const fakeBandName = faker.word.adjective() + ' ' + faker.word.noun()
        const fakeGenre = getRandomGenre()
        const numMembers = 5
        const fakeMembers = generateFakeMembers(numMembers)
        const membersString = fakeMembers.join(', ')
        const fakeFormationYear = faker.date.past(30).getFullYear() 
        const fakeCountry = faker.location.country()

        cy.get('#bandName').type(fakeBandName)
        cy.get('#genre').type(fakeGenre)
        cy.get('#members').type(membersString)
        cy.get('#formationYear').type(fakeFormationYear.toString())
        cy.get('#origin').type(fakeCountry)
        cy.contains('button', 'Cadastrar').click()
        cy.get('.alert').should('contain', 'Banda cadastrada com sucesso!')
    })
  
    it('Faz a Edição dos dados de uma Banda já Cadastrada e Inclui novos Discos', () => {
        cy.get('#loginSection a').click()
        cy.url().should('include', `login.html`)
    
        cy.get('#username').type('admin')
        cy.get('#password').type('123')
        cy.get('#loginBtn').click()
        cy.get('.success').should('contain', 'Login realizado com sucesso!')
        cy.wait(5000)  
    
        cy.url().should('include', `optionsPage.html`)
        cy.get('#editBandBtn').click()  
        cy.url().should('include', `editBand.html`)
    
        cy.get('#searchBand').type('Lost Horizon')
        cy.contains('button', 'Editar Banda').click()
    
        cy.get('#editFormationYear').invoke('val').then((formationYear) => {
            cy.log(`Ano de Formação: ${formationYear}`)  
    
            const new_fakeGenre = getRandomGenre()
            const numMembers = 4
            const fakeMembers = generateFakeMembers(numMembers)
            const new_membersString = fakeMembers.join(', ')
            const new_fakeCountry = faker.location.country()
    
            const maxTitles = 2
            const fakeDiscography = generateFakeDiscography(formationYear, maxTitles)  
            cy.log(JSON.stringify(fakeDiscography))  
    
            cy.get('#editGenre').clear().type(new_fakeGenre)
            cy.get('#editMembers').clear().type(new_membersString)
            cy.get('#editCountry').clear().type(new_fakeCountry)
    
            cy.get('#editDiscography').invoke('val').then((existingDiscography) => {
                let allDiscsArray = existingDiscography.split(', ').map(disc => {
                    const discParts = disc.match(/(.*) - (\d{4})/)
                    if (discParts) {
                        const title = discParts[1]
                        const year = parseInt(discParts[2])
                        return { title, releaseYear: year }
                    }
                    return null 
                }).filter(Boolean)
    
                fakeDiscography.forEach(disk => {
                    allDiscsArray.push(disk)
                })
    
                allDiscsArray.sort((a, b) => a.releaseYear - b.releaseYear)
    
                const updatedDiscography = allDiscsArray.map(disk => `${disk.title} - ${disk.releaseYear}`).join(', ')
    
                cy.get('#editDiscography').clear().type(updatedDiscography)
            })
    
            cy.get('#saveBtn').click()
            cy.get('#confirmYes').click() 
            cy.get('.success').should('be.visible', 'Banda editada com sucesso!')
        })
    }) 
    
    it.only('Inclui Discos para uma Banda', () => {
        cy.get('#loginSection a').click()
        cy.url().should('include', `login.html`)
    
        cy.get('#username').type('admin')
        cy.get('#password').type('123')
        cy.get('#loginBtn').click()
        cy.get('.success').should('contain', 'Login realizado com sucesso!')
        cy.wait(5000)  
    
        cy.url().should('include', `optionsPage.html`)
        
        let formationYear
        const banda = 'asia'
        cy.request(`/api/bands/search?name=${banda}`).then((response) => {
            cy.log(JSON.stringify(response.body))
            expect(response.body).to.have.property('formationYear')
            formationYear = response.body.formationYear
            cy.get('#discBandName').type(banda)
            cy.get('#editDiscographyBtn').click()  
    
            const maxTitles = 1
            const fakeDiscography = generateFakeDiscography(formationYear, maxTitles)  
            cy.log(JSON.stringify(fakeDiscography)) 
            fakeDiscography.forEach(disk => {
                cy.get('#discTitle').clear().type(disk.title)  
                cy.get('#discYear').clear().type(disk.releaseYear)  
                cy.contains('button', 'Salvar Disco').click()
                cy.get('.success').should('contain', 'Disco adicionado com sucesso!')  
            })
        })
    })    
})




