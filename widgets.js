import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { title } from 'process';



const green='#86f760';
const blue="#4287f5";
const yellow="#f7ff66";
const red="#ff6666";
const purple="#a340ff";
const lightPurple="#a340ff";

export let screen = blessed.screen({
    smartCSR: true,
    fullUnicode: true,
    terminal: 'xterm-256color'
  });
  
  screen.title = 'my window title';
    let box1 = blessed.box({
    top: '0',
    right: '0',
    width: '75%',
    height: '75%',
    content: '',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'red',
      border: {
        fg: '#f0f0f0'
      },
      hover: {
        bg: 'green'
      }
    }
  });



export let box2= blessed.box({
    bottom: '0',
    right: '0',
    width: '80%',
    height: '30%',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'red',
      // bg: 'black',
      border: {
        fg: red
      },
      hover: {
        bg: green
      }
    },
    label:"Progress"
  });


export  let menu=blessed.list({
      title:'Menu',
      label:'Menu',
      top:'0',
      left:'0',
      width: '20%',
      height: '100%',
      keys: true,
      vi: true,
      mouse: true,
      padding:1,
      border: {
        type: 'line'
      },
      style: {
        fg: blue,
        bg: 'black',
        selected:{bg:blue,fg:'black'}, 
        border: {
          fg: blue,
        },
        label:{
          fg:blue
        }
      }
  
    })

export let table = contrib.table(
     { 
      top:0,
      right:0,
       keys: true,
       mouse:true,
       vi:true
     , fg: lightPurple
     , selectedFg: 'black'
     , selectedBg: lightPurple
     , interactive: true
     , label: 'Songs'
     , width: '80%'
     , height: '75%'
     , border: {type: "line", fg: purple}
     , columnSpacing: 10 //in chars
     , columnWidth: [35, 35, 35] /*in chars*/ },
    )


  //    table.setData(
  //  { headers: ['Title', 'Artist', 'Album']})



export let progressBar=blessed.progressbar({
    parent:box2,
    border:'line',
    // filled:0,
    // value:0,
    orientation:'horizontal',
    width: '90%',
    height: 3,
    top:'center',
    left:'center',
    keys:true,
    mouse:true,
    padding:0,
    style:{
      fg:'#f0f0f0',
      bg:'black',
      bar:{
        fg:'black',
      bg:'#f0f0f0'
      },
      border:{
        fg:green,
        // bg:'white',
        
      }
    },
    ch:'',
    content:'0%'
    
  })

export let label = blessed.Text({
  parent: progressBar,
  top: 'center-3',
  left: 'center',
  content: 'Elapsed: 00:00 / 00:00', // Placeholder
  align: 'center',
});

