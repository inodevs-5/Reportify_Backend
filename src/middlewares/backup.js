const cron = require('node-cron');
const exec = require("child_process").exec;
const path = require("path");
const fs = require("fs");

// ...

const backupDirPath = path.join(__dirname, '\\backup');

// Criar o diretório de backup, se ele não existir
if (!fs.existsSync(backupDirPath)) {
  try {
    fs.mkdirSync(backupDirPath, { recursive: true });
    console.log('Diretório de backup criado com sucesso:', backupDirPath);
    fs.chmodSync(backupDirPath, 0o755)
    // Defina as permissões corretas para o diretório, se necessário
    // Exemplo: fs.chmodSync(backupDirPath, 0o755); // Permissões de leitura, gravação e execução para o proprietário, e leitura e execução para grupo e outros
  } catch (error) {
    console.error('Erro ao criar o diretório de backup:', error);
  }
}

// caminho do mongo tools instalado no seu computador
let mongoToolsPath = 'C:\\Program Files\\MongoDB\\Tools\\100\\bin'

// URI do banco de dados
let dbUrl = process.env.DB_URL_BACKUP + "/reportify3"

// URI do banco de dados de chaves
// let dbUrlKeys = process.env.DB_URL_SECOND_DB

// função principal que cria o backup
const dbBackup = () => {

  // exibindo mensagem de inicialização de backup
  console.log("Inicando backup....")

  // utilizando data atual como nome do arquivo de backup
  const currentDate = new Date()
  var backupDirName = 'data_' + currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear() + '-' + currentDate.getHours() + '-' + currentDate.getMinutes() +  '.gzip';
  // var backupKeysDirName = 'keys' + currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear() + '-' + currentDate.getHours() + '-' + currentDate.getMinutes() +  '.gzip';

  // criando pasta que será salvo o backup
  const backupDirPath = path.join(__dirname + '\\backup', backupDirName);

  // código no cmd que cria o backup
  // let cmd = `runas /user:administrator cd ${mongoToolsPath} & mongodump --uri=${dbUrl} --archive=${backupDirPath} --gzip`;
  let cmd = `cd "${mongoToolsPath}" & mongorestore --uri="${dbUrl}" --archive="${backupDirPath}" --gzip`;
  // let cmdKeys = `cd ${mongoToolsPath} & mongodump --uri=${dbUrlKeys} --archive="${backupDirPath}" --gzip`;

  // executando o código anterior e exibindo mensagens de erro ou sucesso
  exec(cmd, (error, stdout, stderr) => {
    if(error){
      console.log([cmd, error, backupDirPath]);
      // console.log([cmdKeys, error]);
    }else{
      console.log([cmd, backupDirPath],"\nBackup criado com sucesso!")
    }  
  });
};

// dbBackup()

// agendando a execução do backup
cron.schedule('0 3 1 * *', dbBackup); // executa todo dia 1 de cada mês às 3h da manhã

module.exports = {dbBackup};