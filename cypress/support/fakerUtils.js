// cypress/support/fakerUtils.js

const { faker } = require('@faker-js/faker');

// Função para gerar membros fictícios
function generateFakeMembers(numMembers) {
    const members = [];
    for (let i = 0; i < numMembers; i++) {
        const fullName = `${faker.person.firstName()} ${faker.person.lastName()}`;
        members.push(fullName);
    }
    return members;
}

// Função para gerar dados de disco com base no ano de formação
function generateFakeDiscography(formationYear, numTitles) {
    const discography = [];
    let currentYear = new Date().getFullYear(); // Ano atual
    let minYear = parseInt(formationYear); // Ano de formação convertido para número

    for (let i = 0; i < numTitles; i++) {
        const title = faker.music.songName();  // Gera o nome do álbum
        let releaseYear = faker.number.int({ min: minYear, max: currentYear });  // Gera o ano entre o ano de formação e o ano atual

        discography.push({ title, releaseYear });
    }
    discography.sort((a, b) => a.releaseYear - b.releaseYear);
    return discography;
}

// Função para gerar dados de usuário fictícios
function generateFakeUser() {
    const fakeUsername = faker.internet.userName();
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password();
    
    return {
        username: fakeUsername,
        email: fakeEmail,
        password: fakePassword
    };
}

// Definindo os gêneros específicos
const musicGenres = [
    'Hard Rock', 
    'Heavy Metal', 
    'Punk',  
    'Blues', 
    'Classic Rock', 
    'Symphonic Metal',
    'Progressive Metal', 
    'Vicking Metal',
    'Black Metal'
];

// Função para gerar um gênero aleatório entre os definidos
function getRandomGenre() {
    const randomIndex = Math.floor(Math.random() * musicGenres.length);
    return musicGenres[randomIndex];
}

module.exports = {
    generateFakeMembers,
    generateFakeDiscography,
    generateFakeUser,
    getRandomGenre
};
