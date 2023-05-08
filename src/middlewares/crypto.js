const crypto = require('crypto')

const DADOS_CRIPTOGRAFAR = {
    algoritmo : "aes256",
    segredo : "chaves",
    tipo : "hex"
};


function criptografar(senha) {
	const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
	cipher.update(senha);
	console.log(cipher.final(DADOS_CRIPTOGRAFAR.tipo));
};

module.exports = {
    criptografar
}