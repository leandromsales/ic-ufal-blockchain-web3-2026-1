const fs = require('fs');
const path = require('path');

const ENV_PATH = path.join(__dirname, '..', '..', '.env');

/** Atualiza ou insere uma variável no .env da raiz do projeto. */
function updateEnvVar(key, value) {
  if (!fs.existsSync(ENV_PATH)) {
    fs.writeFileSync(ENV_PATH, `${key}=${value}\n`, 'utf8');
    return;
  }

  let content = fs.readFileSync(ENV_PATH, 'utf8');
  const re = new RegExp(`^${key}=.*`, 'm');
  if (re.test(content)) {
    content = content.replace(re, `${key}=${value}`);
  } else {
    content = `${content.trimEnd()}\n${key}=${value}\n`;
  }
  fs.writeFileSync(ENV_PATH, content, 'utf8');
}

module.exports = { ENV_PATH, updateEnvVar };
