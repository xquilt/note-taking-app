var blessed = require('blessed');

// Create a screen object.
let screen = blessed.screen({
    smartCSR: true,
    title : "Elicit Notes"
});

// If box is focused, handle `enter`/`return` and give us some more content.
//box.key('enter', function(ch, key) {
  //box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
  //box.setLine(1, 'bar');
  //box.insertLine(1, 'foo');
  //screen.render();
//});


// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
    top: 'center',
    left: 'center',
    width : "100%",  
    height: "100%",
    content: '{center}Elicit {bold}world{/bold}!{/center}',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'yellow',
        bg: 'magenta',
        border: {
          fg: '#f0f0f0'
        },
        hover: {
          bg: 'green'
        }
    }
});

let newList = ["having a bath", "playing games with fellow pals" , "doing my homework" , "just brand new item" , 'another brand new item' , 'a journey within new realms of abstract thoughts' , "having a bath", "playing games with fellow pals" , "doing my homework" , "just brand new item" , 'another brand new item' , 'a journey within new realms of abstract thoughts']

let brandNewList = blessed.list({
    parent: screen,
    shadow: true,
    left: '25%',
    width: '50%',
    top: '35%',
    height: '25%',
    keys: true,
    vi : true,
    mouse : true,
    items : newList,
    fuzzyFind : "string",
    border: {
        type: 'line',
    },
    label: `[ Notes ]`,
    scrollbar: true,
    style: {
        label: {
           fg: 'gray',
           bold: true,
        },
        selected : {
            bg: 'black',
            fg : "yellow"
        },
        item: {
            bg: 'black',
            height: '100',
        },
        focus: {
            selected: {
                bg: 'blue',
                bold: true,
            },
            border: {
                fg: 'cyan',
            },
            label: {
                fg: 'cyan',
            },
        },
        scrollbar: {
            bg: 'blue',
        },
    },
})

//The UI elements for editing a not

let noteForm = blessed.form ({
    //parent : screen,
    //top : 1,
    //top : "10%",
    //left : '10',
    //right : '80%',
    //height : '80%',
    //key : true,
    //vi : true,
    //shadow : true,
    //border : {
        //type : 'line',
        //fg : 'yellow',
        //bg : "white"
    //},
    //style : {
        //label : {
            //fg : "white",
            //bold : true
        //}
    //}
    //    
    parent: screen,
    top: '10%',
    left: '10%',
    width: '80%',
    height: '40%',
    keys: true,
    vi: true,
    shadow: true,
    padding: {
        top: 1,
        left: 1,
        right: 1,
        bottom: 0,
    },
    border: {
        type: 'line',
    },
    style: {
        label: {
            fg: 'green',
            left: 'center',
            bold: true,
        },
        border: {
            fg: 'green',
        }
    }
})

let titleBox = blessed.textbox({
    parent: noteForm,
    height: 3,
    top : 0,
    keys: true,
    vi: true,
    inputOnFocus: true,
    border: {
        type: 'line',
    },
    label: ` Content `,
    style: {
        label: {
            fg: 'green',
        },
        border: {
            fg: 'green',
        },
        focus: {
            label: {
                bold: true,
            },
            border: {
                bold: true,
            }
        }
    },
})

let descrBox = blessed.textbox({
    parent : noteForm,
    top : 1,
    border : {
        type : "line"
    },
    inputOnFocus : true,
    label : ' description ',
    style : {
        label : {
            fg : 'red',
        },
        border : {
            fg : "yellow"
        }
    }
})

brandNewList.key ("enter",function(){
    noteForm.show()
    descrBox.setValue(this.ritems[this.selected])
    descrBox.focus()
    screen.render()
})

descrBox.key ("enter" , function(){
    noteForm.hide()
    screen.render()
})

//box.key("enter", function (){
    //box.setContent ('{center}{blue-fg}Youve pressed Enter.{/blue-fg}{/center}')
    //for (let i =0 ; i < newList.length ; i++){
        //box.insertLine(i+1 , newList[i])
    //}
    //screen.render()
//})

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.key("Q", function(){
    this.destroy()
})

// Append our box to the screen.
screen.append(box);

screen.append(brandNewList)

screen.append(noteForm)
noteForm.hide()

brandNewList.focus()

// Render the screen.
screen.render();
