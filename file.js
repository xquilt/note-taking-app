const fs = require("fs")
const yargs = require("yargs")

noteObject = {
    1:"first note is that i'm really a cool type of person",
    2: "Secodn note is that i'm not really into these type of stuff right now"
}

const argv = yargs
    .command ('list' , "Prints out the notes associated with the current user (if no users were explicitly specificed) " , {
        user: {
            description: 'Name of a registered user',
            alias : "l",
            type: "string"
        }
    })
    .option('time', {
        alias: 't',
        description: 'Tell the present Time',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h')
    .argv;

if (argv.time) {
    console.log('The current time is: ', new Date().toLocaleTimeString());
}

if (argv.note) {
    console.log("The current note is " , argv.note)
}

let rawData = fs.readFileSync("./file.json")
let student = JSON.parse(rawData)
console.log(student)

function listUsers(){
    let usersList = Object.keys(student)
    console.log("The list of users ")
    for (let i = 1 ; i <= usersList.length ; i++ ){
        console.log(student[i.toString()]["name"])
    }
}
listUsers()
