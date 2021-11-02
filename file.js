const yargs = require("yargs")

noteObject = {
    1:"first note is that i'm really a cool type of person",
    2: "Secodn note is that i'm not really into these type of stuff right now"
}

const argv = yargs
    .command('lyr', 'Tells whether an year is leap year or not', {
        year: {
            description: 'the year to check for',
            alias: 'y',
            type: 'number',
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

if (argv._.includes('lyr')) {
    const year = argv.year || new Date().getFullYear();
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
        console.log(`${year} is a Leap Year`);
    } else {
        console.log(`${year} is NOT a Leap Year`);
    }
}

console.log(argv);
