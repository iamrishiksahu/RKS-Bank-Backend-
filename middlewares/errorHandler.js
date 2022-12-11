const {logEvents} = require('./logger');

const errorHandler = (err, req, res, next) => {
    console.log(err.stack)
    logEvents(`${err.name}\t${err.message}`, 'errorLog.log')
    res.status(500).send(err.message);
}

module.exports = errorHandler