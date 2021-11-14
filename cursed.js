let blessed = require('blessed');
let fuzzysort = require ('fuzzysort')

function neoGo(string , list){
    let matchedItems = fuzzysort.go(string , list)
    let neoMatchedItems = []
    for (let i=0 ; i < matchedItems.length ; i++) {
        neoMatchedItems.push(Object.values(matchedItems[i])[0])
    }
    return (neoMatchedItems)
}

// Create a screen object.
let screen = blessed.screen({
    smartCSR : true,
    title : "Elicit Notes"
});

// If box is focused, handle `enter`/`return` and give us some more content.
//box.key('enter', function(ch, key) {
  //box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
  //box.setLine(1, 'bar');
  //box.insertLine(1, 'foo');
  //screen.render();
//});


// The main parent box
var box = blessed.box({
    top: 'center',
    left: 'center',
    width : "100%",  
    height: "100%",
    tags: true,
    border : {
        type : 'line'
    },
    style: {
        fg : "blue",
        bg : "yellow",
        border : {
            fg : "blue"
        },
        hover : {
            fg : "red"
        }
    },
});


let projectItems = ["Gaming", "Programming" , "Homework" , "practicing" , 'Playing' , 'Studying' , "College", "Music" , "Bills" , "Transportation" , 'Moving' , 'Bathing']

let projectList = blessed.list({
    parent : screen,
    shadow : false,
    height : '100%',
    width : '20%',
    keys : true,
    vi : true,
    items : projectItems,
    border : {
        type : 'line'
    },
    style : {
        fg : 'white',
        bg : '#15151b',
        border : {
            fg: "blue"
        },
        selected : {
            fg : 'yellow',
            bg : 'cyan',
            width : '10%'
        }
    }
})

let newList = ['having a bath', 'playing games with fellow pals' , 'doing my homework' , 'just brand new item']

let brandNewList = blessed.list({
    parent: screen,
    shadow : true,
    left : '20%',
    height : '100%',
    width : '80%',
    keys: true,
    vi : true,
    mouse : true,
    items : newList,
    border: {
        type: 'line',
    },
    label: `[ Notes ]`,
    scrollbar: true,
    style: {
        bg : '#0b0b11',
        label : {
            fg : 'white',
            bold : true
        },
        selected : {
            bg: 'black',
            fg : "yellow"
        },
        //item: {
            //bg: 'black',
            //height: '100',
        //},
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
    inputOnFocus: true,
    keys : true,
    vi : true,
    border: {
        type: 'line',
    },
    label: ` Content `,
    clickable : true,
    hover : true,
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

projectList.key ('/' , function(){
    titleBox.top = '40%'
    titleBox.height = '6%',
    titleBox.width = '40%',
    titleBox.left = 'center'
    screen.append(titleBox)
    titleBox.show()
    titleBox.focus()
})

titleBox.on('update', function(){
    brandNewList.clearItems()
    brandNewList.setItems(neoGo(titleBox.value, newList))
    if (titleBox.value.length == 0 ){
        brandNewList.setItems(newList)
        screen.render()
    }
})

titleBox.key ('enter', function() {
    titleBox.clearValue()
    brandNewList.setItems(newList)
    titleBox.hide()
    screen.render()
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
    brandNewList.setItem(brandNewList.selected , descrBox.content)
    noteForm.hide()
    screen.render()
})

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

screen.append(projectList)

//brandNewList.focus()

projectList.focus()

// Render the screen.
screen.render()

