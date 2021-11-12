#!/usr/bin/node

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
    //This add function should be more sophisticated later on with accompanying capability to check the current loged in user and whatnot
    .command ("add [note]" , "Add a note to the first user") 
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

function accessData(fileName){
    let newRawData = fs.readFileSync(fileName)
    let newParsedData = JSON.parse(newRawData)
    return (newParsedData)
}

//Check if an option is passed or not
function optionCheck(option){
    if (option != undefined) {
        return true
    }else {
        return false
    }
}

if (argv._.includes("list")){
    let userName = argv.user
    if (optionCheck(userName)) {
        let parsedData = accessData("file.json")
        if (parsedData.hasOwnProperty(userName)) {
            console.log("The notes for " , userName)
            let userNotes = parsedData[userName]['notes']
            for (let i = 0 ; i < userNotes.length ; i++){
                console.log(userNotes[i])
            }
        }else{
            console.log("Input a valid username!")
        }
    }else {
        console.log("The list of users ")
        let usersList = Object.keys(parsedData)
        for (let i = 0 ; i < usersList.length ; i++ ){
            console.log(usersList[i])
            //console.log(parsedData[usersList[i]]['name'])
        }
    }
}

function writeData(fileName , data){
    data = JSON.stringify(data , null , 2)
    fs.writeFileSync( fileName , data )
}

if (argv._.includes("add")) {
    if (argv.note != undefined) {
        let newParsedData = accessData("newUserFile.json")
        newParsedData.hobbies.push(argv.note)
        writeData('newUserFile.json' , newParsedData)
        //just one liner printing statement for debugging
        console.log(newParsedData)
    }else {
        console.log("Please provide a valid note!")
    }
}

