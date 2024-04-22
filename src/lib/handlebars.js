const {format} = require('timeago.js');
const helpers  = {}

helpers.timeago = (timestamp) =>{
    return format(timestamp)
}

helpers.getFormat = (number) => {
    const formattedNumber = number.toLocaleString("de-DE");
    return formattedNumber;
}

module.exports = helpers;