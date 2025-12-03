// Ignora erros de exceção não tratados
Cypress.on('uncaught:exception', (err, runnable) => {
    // Retorna false para impedir que o Cypress falhe no teste ao encontrar erros de exceção
    return false;
  });

// ***********************************************
// Custom Commands para Temple of Rock
// ***********************************************

// LOGIN
Cypress.Commands.add('login', (username = 'admin', password = '123') => {
    cy.get('#loginSection a').click()
    cy.url().should('include', 'login.html')
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('#loginBtn').click()
    cy.get('.success').should('be.visible')
    cy.get('.success').should('contain', 'Login realizado com sucesso!')
    cy.wait(5000)
})

// LOGIN COM FALHA
Cypress.Commands.add('loginFail', (username, password) => {
    cy.get('#loginSection a').click()
    cy.url().should('include', 'login.html')
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('#loginBtn').click()
    cy.get('.error').should('be.visible')
})

// CADASTRO DE USUÁRIO
Cypress.Commands.add('registerUser', (user) => {
    cy.get('#registerUsername').type(user.username)
    cy.get('#registerPassword').type(user.password)
    cy.get('#registerEmail').type(user.email)
    cy.get('#registerBtn').click()
})

// PESQUISA DE BANDA POR LETRA
Cypress.Commands.add('searchBandByLetter', (letra) => {
    cy.get('#letterSearch').clear().type(letra, { delay: 0 })
    cy.get('#searchByLetterBtn').click()
    cy.url().should('include', `bandsList.html?letter=${letra}`)
    cy.get('#bandsList').should('exist')
    cy.get('#bandsList').children().should('have.length.greaterThan', 0)
})

// PESQUISA DE BANDA POR NOME
Cypress.Commands.add('searchBandByName', (banda) => {
    let bandId
    cy.request(`/api/bands/search?name=${banda}`).then((response) => {
        expect(response.body).to.have.property('_id')
        bandId = response.body._id

        cy.get('#searchBandSection').find('#searchBand').clear().type(banda, { delay: 0 })
        cy.get('#searchByNameBtn').click()
        cy.url().should('include', `bandDetails.html?id=${bandId}`)
        cy.get('#bandDetails').should('exist')

        // Validar elementos
        cy.get('#bandName').should('have.text', response.body.name)
        cy.get('#bandGenre').should('have.text', response.body.genre)
        cy.get('#bandCountry').should('have.text', response.body.country)
        cy.get('#formationYear').should('have.text', response.body.formationYear.toString())

        // Validar membros
        cy.get('#bandMembers')
            .invoke('text')
            .then(text => {
                const expectedMembers = response.body.members.join(', ')
                expect(text.trim()).to.eq(expectedMembers)
            })

        // Validar discografia
        cy.get('#discographyList .discography-item').should('have.length', response.body.discography.length)

        response.body.discography.forEach((disc, index) => {
            cy.get('#discographyList .discography-item')
                .eq(index)
                .should('contain.text', disc.title)
                .and('contain.text', disc.releaseYear)
        })

    })
})

// CADASTRO DE BANDA
Cypress.Commands.add('registerBand', (band) => {
    cy.url().should('include', `optionsPage.html`)
    cy.contains('button', 'Cadastrar Banda').click()
    cy.url().should('include', `registerBand.html`)
    cy.contains('button', 'Cadastrar Banda').click()
    cy.get('#bandName').type(band.name)
    cy.get('#genre').type(band.genre)
    cy.get('#members').type(band.members)
    cy.get('#formationYear').type(band.formationYear.toString())
    cy.get('#origin').type(band.country)
    cy.get('#CadastroBtn').click()
    cy.get('.success').should('contain', 'Banda cadastrada com sucesso!')
})

// EDIÇÃO DE BANDA
Cypress.Commands.add('editBand', (bandName, updates, newDiscs = []) => {
    cy.url().should('include', 'optionsPage.html')
    cy.get('#editBandBtn').should('be.visible').click()

    cy.url().should('include', 'editBand.html')
    cy.get('#searchBand').should('be.visible').clear().type(bandName)
    cy.contains('button', 'Editar Banda').should('be.visible').click()

    cy.get('#editFormationYear').should('exist').invoke('val').then((formationYear) => {
        if (updates.genre) cy.get('#editGenre').should('be.visible').clear().type(updates.genre)
        if (updates.members) cy.get('#editMembers').should('be.visible').clear().type(updates.members)
        if (updates.country) cy.get('#editCountry').should('be.visible').clear().type(updates.country)

        if (newDiscs.length > 0) {
            cy.get('#editDiscography').should('be.visible').invoke('val').then((existingDiscography) => {
                let allDiscs = existingDiscography
                    ? existingDiscography.split(', ').map(d => {
                        const match = d.match(/(.*) - (\d{4})/)
                        return match ? { title: match[1], releaseYear: parseInt(match[2]) } : null
                    }).filter(Boolean)
                    : []

                allDiscs = [...allDiscs, ...newDiscs].sort((a,b)=> a.releaseYear - b.releaseYear)
                cy.get('#editDiscography').should('be.visible').clear()
                    .type(allDiscs.map(d => `${d.title} - ${d.releaseYear}`).join(', '))
            })
        }

        // Scroll antes de clicar
        cy.get('#saveBtn').scrollIntoView().should('be.visible').click()
        cy.get('#confirmYes').scrollIntoView().should('be.visible').click()

        cy.get('.success', { timeout: 10000 }).should('be.visible')
            .and('contain', 'Banda atualizada com sucesso!')
    })
})

// ADICIONAR DISCOS
Cypress.Commands.add('addDiscsToBand', (bandName, discs) => {
    cy.request(`/api/bands/search?name=${bandName}`).then((response) => {
        expect(response.body).to.have.property('formationYear')
        const formationYear = response.body.formationYear
        cy.get('#discBandName').type(bandName)
        cy.get('#editDiscographyBtn').click()
        discs.forEach(d => {
            cy.get('#discTitle').clear().type(d.title)
            cy.get('#discYear').clear().type(d.releaseYear)
            cy.contains('button', 'Salvar Disco').click()
            cy.get('.success').should('contain', 'Disco adicionado com sucesso!')
        })
    })
})

// EDIÇÃO DE BANDA - CANCELANDO EDIÇÃO
Cypress.Commands.add('editBandCancel', (bandName, updates, newDiscs = []) => {
    cy.url().should('include', 'optionsPage.html')
    cy.get('#editBandBtn').should('be.visible').click()

    cy.url().should('include', 'editBand.html')
    cy.get('#searchBand').should('be.visible').clear().type(bandName)
    cy.contains('button', 'Editar Banda').should('be.visible').click()

    cy.get('#editFormationYear').should('exist').invoke('val').then((formationYear) => {
        if (updates.genre) cy.get('#editGenre').should('be.visible').clear().type(updates.genre)
        if (updates.members) cy.get('#editMembers').should('be.visible').clear().type(updates.members)
        if (updates.country) cy.get('#editCountry').should('be.visible').clear().type(updates.country)

        if (newDiscs.length > 0) {
            cy.get('#editDiscography').should('be.visible').invoke('val').then((existingDiscography) => {
                let allDiscs = existingDiscography
                    ? existingDiscography.split(', ').map(d => {
                        const match = d.match(/(.*) - (\d{4})/)
                        return match ? { title: match[1], releaseYear: parseInt(match[2]) } : null
                    }).filter(Boolean)
                    : []

                allDiscs = [...allDiscs, ...newDiscs].sort((a,b)=> a.releaseYear - b.releaseYear)
                cy.get('#editDiscography').should('be.visible').clear()
                    .type(allDiscs.map(d => `${d.title} - ${d.releaseYear}`).join(', '))
            })
        }

        // Scroll antes de clicar
        cy.get('#saveBtn').scrollIntoView().should('be.visible').click()
        cy.get('#confirmNo').scrollIntoView().should('be.visible').click()  // <-- Clica em "Não" para cancelar

        cy.get('.success', { timeout: 10000 }).should('be.visible')
            .and('contain', 'Dados não salvos. Retornando à página de edição.')
    })
})
