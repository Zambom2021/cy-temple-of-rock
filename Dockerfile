# Use a imagem oficial do Node.js como base
FROM node:16

# Crie e defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos de dependências da sua aplicação (package.json e package-lock.json)
COPY package*.json ./

# Instale as dependências da aplicação
RUN npm install

# Copie todo o código da aplicação para o diretório de trabalho no container
COPY . .

# Exponha a porta que o servidor irá usar
EXPOSE 9090

# Comando para iniciar o servidor
CMD ["node", "server.js"]
