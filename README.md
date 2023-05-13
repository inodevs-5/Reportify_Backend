# Reportify Backend

![status](https://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=RED&style=for-the-badge)

## Sobre

Este README contém as informações necessárias para a execução do back-end do projeto.

#

## Pré-requisitos
- [Node](https://nodejs.org/en/download) >= 18.14.2
- [NPM](https://www.npmjs.com/package/download) >= 9.5.0
- [MongoDB Atlas Database](https://www.mongodb.com/atlas/database)

#

## Setup
- Acesse [MongoDB Atlas Database](https://www.mongodb.com/atlas/database) e crie uma conta. 
- Acesse no menu lateral DEPLOYMENT e em seguida Database.
- Crie um Shared Cluster, selecione Cloud Environment e em seguida clique em Connect e selecione Drivers e depois clique em Close.
- Copie a string gerada e crie no repositório do projeto um arquivo .env, e dentro do arquivo cole o link. Deverá ficar dessa forma:
```
DB_URL = link_mongodb
SECRET = inodevs2k23
```
**Obs.:** Colocar o username e o password no link do banco.

- No terminal do repositório da branch **main**:
```
> npm install
> npm run dev
```

- A seguinte mensagem deverá aparecer:

**Conectado ao banco!**

#

##### <p align="center"><img src="https://cdn.discordapp.com/attachments/826526043917647912/883363052425195560/faTec.png" width="20" height="20" /> Projeto Integrador 2023 - Fatec São José dos Campos </center>
