// importações
const cron = require('node-cron');
const exec = require("child_process").exec;

// caminho do mongo tools instalado no seu computador
let mongoToolsPath = 'C:\\Program Files\\MongoDB\\Tools\\100\\bin'

// URI do banco de dados (igual do backup, mas não precisa inserir o nome do banco de dados no final)
let dbUrl = 'mongodb+srv://admin:admin@cluster0.jkblaoo.mongodb.net/api'

// função principal que faz a restauração do backup
const dbRestore = () => {

  // caminho do arquivo de backup
  const backupFilePath = __dirname + '\\backup\\11-5-2023.gzip'

  // código no cmd que restaura o backup
  let cmd = `cd ${mongoToolsPath} & mongorestore --uri=${dbUrl} --archive="${backupFilePath}" --gzip`;

  // executando o código anterior
  exec(cmd, (error, stdout, stderr) => {
    console.log([cmd, error, backupFilePath]);
  });
};

cron.schedule('0 3 1 * *', dbRestore); // executa todo dia 1 de cada mês às 3h da manhã