console.log("The project got just initialized!")


noteObject = {
    1:"first note is that i'm really a cool type of person",
    2: "Secodn note is that i'm not really into these type of stuff right now"
}

console.log(noteObject[1])

commandLineArgument = process.argv.slice(2)

noteObject[3] = commandLineArgument[0]

console.log(noteObject)
