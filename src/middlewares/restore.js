// importações
const cron = require('node-cron');
const exec = require("child_process").exec;
const fs = require('fs');
const path = require('path');

// caminho do mongo tools instalado no seu computador
let mongoToolsPath = 'C:\\Program Files\\MongoDB\\Tools\\100\\bin'

// URI do banco de dados (igual do backup, mas não precisa inserir o nome do banco de dados no final)
let dbUrl = process.env.DB_URL_BACKUP

// função principal que faz a restauração do backup
const dbRestore = () => {

  // caminho do arquivo de backup
  const backupFilePath = __dirname + '\\backup\\'

  try {
    const files = fs.readdirSync(backupFilePath);
    const fileDetails = files.map((file) => {
      const filePath = path.join(backupFilePath, file);
      const stats = fs.statSync(filePath);
      return {
        file,
        birthtime: stats.birthtime,
      };
    });
    
    // Ordenar os arquivos por data de criação (do mais recente ao mais antigo)
    const sortedFiles = fileDetails.sort((fileA, fileB) => {
      return fileB.birthtime.getTime() - fileA.birthtime.getTime();
    });
    
    lastBackupFile = sortedFiles[0].file
    console.log('Ultimo arquivo de backup:', lastBackupFile);
  } catch (error) {
    console.error('Erro ao ler o diretório:', error);
  }


  const backupDirPath = path.join(__dirname + '\\backup\\' + lastBackupFile);
  console.log(backupDirPath)
  // código no cmd que restaura o backup
  // let cmd = `runas /user:administrator cd "${mongoToolsPath} & mongorestore --uri=${dbUrl} --archive=${backupDirPath} --gzip`;
  let cmd = `cd "${mongoToolsPath}" & mongorestore --uri="${dbUrl}" --archive="${backupDirPath}" --gzip`;

  // executando o código anterior
  exec(cmd, (error, stdout, stderr) => {
    if(error){
      console.log([cmd, error, backupDirPath]);
      // console.log([cmdKeys, error]);
    }else{
      console.log([error, cmd, backupDirPath],"\nRestauração feita com sucesso!")
    }  
  });
};


// cron.schedule('0 3 1 * *', dbRestore); // executa todo dia 1 de cada mês às 3h da manhã

module.exports = {dbRestore}