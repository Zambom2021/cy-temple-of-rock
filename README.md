# 🤘🎸 TEMPLE OF ROCK 🤘🎸

Projeto criado como exercício profissional em QA, com objetivo de garantir qualidade em funcionalidades simuladas de **cadastro de bandas** 🎸🎶.  
O projeto utiliza **Cypress** para automação de testes, incluindo cenários **Web** e **API**, com suporte a execução local e CI/CD via **GitHub Actions** e **Cypress Cloud**.

## 🖥️ Para executar os testes localmente:

### 🌟 Abrir a interface do Cypress com visualização desktop, use:

- `npm run cy:open`

### 👻 Execução headless (padrão em CI/CD):

- `npm test`

### 📊 Relatórios de Teste

#### 🧩 Allure Report
Gerar relatório Allure após a execução:
- `npm run allure:generate`

Abrir relatório no navegador:
- `npm run allure:open`

Atalho para gerar + abrir direto:
- `npm run allure:report`

### 📸 Evidências (screenshots e vídeos)
Cypress salva screenshots e vídeos automaticamente em falhas.

Pastas:

- cypress/screenshots/

- cypress/videos/

### ☁️ Cypress Cloud

Este projeto está integrado ao Cypress Cloud, permitindo:

- 📝 Registro e histórico de execuções.
- 📊 Insights sobre falhas e métricas de qualidade.
- 🔄 Integração contínua com GitHub Actions.

### Execução na nuvem:
- npm run test:cloud


### 🤖 Integração com GitHub Actions
O workflow está configurado para:

- 🏁 Subir a aplicação em container Docker.
- 🏹 Executar testes Web/API com Cypress.
- 📦 Fazer upload dos resultados (screenshots, vídeos e relatórios).
- ☁️ Registrar execuções no Cypress Cloud.

### 🏆 Boas práticas

- Utilize npm run cy:open para depuração local e validação visual.
- Use npm test em pipelines ou para execuções headless rápidas.
- Gere relatórios Allure (npm run allure:report) para análise detalhada.
- Não versione allure-results/, allure-report/, videos/ e screenshots/.

___
#### 💀🤘🎸 Developed by: Ricardo Zambom 🤘🎸💀