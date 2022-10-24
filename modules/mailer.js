const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const {host, post, user, pass} = require('../config/mail.json')

const transport = nodemailer.createTransport({
    host,
    post,
    auth: {user, pass}
});

transport.use('compile', hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve('./resources/mail/')
    },
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html',
  }));

module.exports = transport