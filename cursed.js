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
    content: 'Hello {bold}world{/bold}!',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'magenta',
        border: {
          fg: '#f0f0f0'
        },
        hover: {
          bg: 'green'
        }
    }
});

// Append our box to the screen.
screen.append(box);

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
        selected: {
            bg: 'black',
            fg: 'white',
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

screen.append(brandNewList)

// Add a png icon to the box
var icon = blessed.image({
  parent: box,
  top: 0,
  left: 0,
  type: 'overlay',
  width: 'shrink',
  height: 'shrink',
  file: __dirname + '/my-program-icon.png',
  search: false
});

box.key("enter", function (){
    box.setContent ('{center}{blue-fg}Youve pressed Enter.{/blue-fg}{/center}')
    for (let i =0 ; i < newList.length ; i++){
        box.insertLine(i+1 , newList[i])
    }
    screen.render()
})

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.key("Q", function(){
    this.destroy()
})

// Focus our element.
//box.focus();

brandNewList.focus()

// Render the screen.
screen.render();
