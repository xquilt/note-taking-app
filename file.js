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
            alias : "u",
            type : "string"
        }
    })
    .option('time', {
        description: 'Tell the present Time',
        alias: 't',
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

if (argv._.includes("list")){
    let userName = argv.user
    if (userName != undefined){
        if (student.hasOwnProperty(userName)) {
            console.log("The notes for " , userName)
            let userNotes = student[userName]['notes']
            for (let i = 0 ; i < userNotes.length ; i++){
                console.log(userNotes[i])
            }
        }else{
            console.log("Input a valid username!")
        }
    }else {
        console.log("The list of users ")
        let usersList = Object.keys(student)
        for (let i = 0 ; i < usersList.length ; i++ ){
            console.log(usersList[i])
            //console.log(student[usersList[i]]['name'])
        }
    }
}
