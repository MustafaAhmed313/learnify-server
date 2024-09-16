const pug = require('pug');

const TEMPLATES = {
  FORGET_PASSWORD: 'passwordReset'
}

const generateEmailTemplate = (template, data) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, data);
  return html;
}

module.exports = {
  generateEmailTemplate,
  TEMPLATES
};