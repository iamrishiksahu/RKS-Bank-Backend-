const {format} = require('date-fns');

const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');


const logEvents = async (message, filename) => {

    const dateTime = format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')

    const logString = dateTime +  '\t' + randomUUID() +  '\t' +  message + '\n';

    console.error(logString);

    try{
        
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
    
            try{
                fs.mkdir(path.join(__dirname, '..', 'logs'),() =>{
                    //empty callback
                })
            }catch(err){
                console.log(err);
            }
        }
        await fs.promises.appendFile(path.join(__dirname, '..', 'logs', filename), logString)
    }catch(err){
        console.error(err);
    }

}


const requestLogger = (req, res, next) =>{

    const reqURL = req.url
    const method = req.method
    const origin = req.headers.origin

    logEvents(`origin: ${origin}\t${method}\t${reqURL}\t`, 'requestLog.log')

    next()
}


module.exports = {requestLogger, logEvents}