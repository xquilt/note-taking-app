let blessed = require('blessed');
let fuzzysort = require ('fuzzysort')
let fs = require('fs')

// This global variable preserves the last focused 'note'/'note group' pane, before search box being focused.
let previousFocusedPane

// Return a list of all the Node widget list's items string content
function getNodeListItemsContent(NodeListItems){
    let itemsList = []
    for ( let i = 0; i < NodeListItems.length; i++ ){
       itemsList.push(NodeListItems[i].content)
    }
    return(itemsList)
}

/*
 * -Purpose
 *      -When you're about to fuzzy find an object's list of items
 *          -These items gets altered in place (the object's items list get changed with the new fuzzed result)
 *              -This function essentially makes an original copy of the original object's items list
*/
blessed.list.prototype.originalItems = []
function checkOriginalItems(listNode) {
    if ( (listNode == undefined) || (listNode.originalItems.length == 0) ) {
        listNode.originalItems = getNodeListItemsContent(listNode.items)
    }
}

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

let noteList = ['having a bath', 'playing games with fellow pals' , 'doing my homework' , 'just brand new item', 'Just jogging with others', 'Aiding my friends with their homework', 'commuting all the way to the college', 'checking out all my fellow friends', 'Traversing through the jungle of madisom and what not']

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

/*
 * -Purpose
 *      -Return the 'focused' or 'unfocused' pane
 * -Notes
 *     -I had to resort to these two array item 'global' variables
 *          -As sometimes the active pane is another node (other than the two panes) which doesn't meet the subsequent conditionals.
 *          -they could have been defined within a confined function without the declaration word
 *              -but that would raise a bug in case '/' was pressed before tab after screen load .
*/

function returnCurrentPane(paneIsFocused){
    const paneList = [noteGroupListNode, noteListNode]
    let returnPane
    for (let index = 0; index < paneList.length; index++) {
        let currentPane = paneList[index]
        if ( paneIsFocused && currentPane.focused ){
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
    previousFocusedPane = returnCurrentPane(true)
    searchBox.focus()
})

/*
 * -A current error
 *      -When you're about to type and filter in real time
 *          -The current 'focused' pane become the search box
 *              -As you rely on the current 'focused' pane at the function.
 *                  -you essentially get the 'search box' instead (as the object)
 *
 *                  -So far i've added an inadequate patch
 *                      -Initialized a global variable
 *                      -This variable gets updated with the current active pane right before the search box is initialized & lose focus
*/

searchBox.on('update', function(){
    // currentPane = returnCurrentPane(true)
    currentPane = previousFocusedPane
    checkOriginalItems(currentPane)
    if (searchBox.value.length != 0 ){
        currentPane.setItems(fuzzySortFunc(searchBox.value , currentPane.originalItems))
    }else{
        currentPane.setItems(currentPane.originalItems)
    }
})

searchBox.key ('enter', function() {
    currentPane = returnCurrentPane(true)
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


// These two nodes will listen for the keyboard pressing keyboardEvent , and whichever is currently focused of them will actually get to actually receive the keyboardEvent .
/*
 * This 'event handler' works by intercepting the tab key. 
 *  -Call the function
 *      -The function will loop through the pane list
 *          -Will continue looping till it meets a focused pane
 *              -Only then will return the right-adjacent unfocused pane i.e. focused pane + 1
*/
screen.key('tab', function(){
    returnCurrentPane(false).focus()
})

// Quit on Escape, q, or Control-C.
item.key(['escape', 'q', 'C-c'], function() {
   screen.destroy() 
});

// Append our box to the screen.
screen.append(box);

screen.append(noteListNode)

screen.append(noteForm)
noteForm.hide()

screen.append(noteGroupListNode)

// noteListNode.focus()

noteGroupListNode.focus()

// Render the screen.
screen.render()

