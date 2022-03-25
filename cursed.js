let blessed = require('blessed');
let fuzzysort = require ('fuzzysort')

// Return a list of all the Node widget list's items string content
getNodeListItemsContent = function (NodeListItems){
    let itemsList = []
    for ( let i = 0 ; i < NodeListItems.length ; i++ ){
       itemsList.push(NodeListItems[i].content)
    }
    return(itemsList)
}
blessed.list.prototype.originalItems = []

function fuzzySortFunc(string , list){
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
    title : "Elicit Notes",
    grabKeys : true
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
        type : 'line',
        fg : "blue"
    },
    style: {
        fg : "blue",
        bg : "yellow",
        hover : {
            fg : "red"
        }
    },
});


let paddingObjectProperties = {
    left : 1,
    right : 1,
    top : 1
}
let focusObjectProperties = {
    selected: {
        bg: 'blue',
        bold: true
    },
    border: {
        fg: 'cyan'
    },
    label: {
        fg: 'cyan'
    }
}

//let noteGroupList = ["Gaming", "Programming" , "Homework" , "practicing" , 'Playing' , 'Studying' , "College", "Music" , "Bills" , "Transportation" , 'Moving' , 'Bathing']
let noteGroupList = ["Gaming", "Programming" , "Homework" , "practicing" , 'Playing' , 'Studying' , "College", "Music", "Bills" , "Transportation" , 'Moving' , 'Bathing' ]

let noteGroupListNode = blessed.list({
    parent : screen,
    label: `[ Properties ]`,
    padding : paddingObjectProperties ,
    shadow : false,
    height : '100%',
    width : '20%',
    keys : true,
    vi : true,
    items : noteGroupList,
    border : {
        type : 'line',
        fg: "yellow"
    },
    style : {
        fg : 'white',
        bg : '#15151b',
        label : {
            fg : 'yellow',
            bold : true
        },
        selected : {
            fg : 'yellow',
            bg : 'cyan',
            width : '10%'
        },
        focus:focusObjectProperties
    }
})

let noteList = ['having a bath', 'playing games with fellow pals' , 'doing my homework' , 'just brand new item']

let noteListNode = blessed.list({
    parent: screen,
    label: `[ Notes ]`,
    padding : paddingObjectProperties,
    shadow : true,
    left : '20%',
    height : '100%',
    width : '80%',
    keys: true,
    vi : true,
    mouse : true,
    items : noteList,
    border: {
        type: 'line',
        fg : 'white'
    },
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
        scrollbar: {
            bg: 'blue',
        },
        focus:focusObjectProperties ,
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
        fg: 'green'
    },
    style: {
        label: {
            fg: 'green',
            left: 'center',
            bold: true,
        }
    }
})

let searchBox = blessed.textbox({
    parent: noteForm,
    inputOnFocus: true,
    keys : true,
    vi : true,
    border: {
        type: 'line',
        fg: 'green'
    },
    label: ` Content `,
    clickable : true,
    hover : true,
    style: {
        label: {
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



//I had to resort to these two 'global' variables ,
//as sometimes the active pane is another node (other than the two panes) which doesn't meet the subsequent conditionals.
//Also they could have been defined within a confined function without declaration word , but that would raise a bug in case '/' was pressed before tab after screen load .

function currentPaneFunc(paneIsFocused){
    const panesList = [noteListNode, noteGroupListNode]
    let returnPane
    for (let index = 0; index < panesList.length; index++) {
        let currentPane = panesList[index]
        if ( currentPane.focused  && paneIsFocused ){
            returnPane = currentPane 
        }else if ( !paneIsFocused && !currentPane.focused ){
            returnPane = currentPane
        }
    }
    return (returnPane)
}

// Search functionality

screen.key('/' , function(){
    searchBox.top = '40%'
    searchBox.height = '6%',
    searchBox.width = '40%',
    searchBox.left = 'center'
    screen.append(searchBox)
    searchBox.show()
    searchBox.focus()
})

// The usage/call of function is mostly confined within List widget's fuzzy finding events
// It replicates the items' list ONLY when fuzzy finding is about to ignite
function checkOriginalItems(listNode) {
    if ( listNode.originalItems.length == 0 ){
        listNode.originalItems = getNodeListItemsContent(listNode.items)
    }
}

searchBox.on('update', function(){
    currentPane = currentPaneFunc(true)
    checkOriginalItems(currentPane)
    if (searchBox.value.length != 0 ){
        currentPane.setItems(fuzzySortFunc(searchBox.value , currentPane.originalItems))
    }else{
        currentPane.setItems(currentPane.originalItems)
    }
})

searchBox.key ('enter', function() {
    currentPane = currentPaneFunc(true)
    searchBox.clearValue()
    currentPane.setItems(currentPane.items)
    searchBox.hide()
    screen.render()
})


let descrBox = blessed.textbox({
    parent : noteForm,
    top : 1,
    border : {
        type : "line",
        fg : "yellow"
    },
    inputOnFocus : true,
    label : ' description ',
    style : {
        label : {
            fg : 'red',
        },
    }
})

noteListNode.key ("enter",function(){
    noteForm.show()
    descrBox.setValue(this.ritems[this.selected])
    descrBox.focus()
    screen.render()
})

descrBox.key ("enter" , function(){
    noteListNode.setItem(noteListNode.selected , descrBox.content)
    noteForm.hide()
    screen.render()
})


//These two nodes will listen for the keyboard pressing keyboardEvent , and whichever is currently focused of them will actually get to actually receive the keyboardEvent .
screen.key('tab',function(){
    currentPaneFunc(false).focus()
})

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function() {
});

// Append our box to the screen.
screen.append(box);

screen.append(noteListNode)

screen.append(noteForm)
noteForm.hide()

screen.append(noteGroupListNode)

//noteListNode.focus()

noteGroupListNode.focus()

// Render the screen.
screen.render()

