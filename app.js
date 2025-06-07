


import blessed from 'blessed';
import chalk from 'chalk';
import {readdir} from 'fs/promises';
import {audioEvents, convertMP3toPCM} from './music.js'
import os from 'os';
import path from 'path';
let musicFolder=path.join(os.userInfo().homedir,'Music');
let musicFiles='';

async function listMusicFiles(){
  try {
      musicFiles= await readdir(musicFolder);
      musicFiles.forEach((file)=>file=chalk.bgCyan(file))
      console.log(musicFiles)
    } catch (err) {
      console.error(err);
    } 
    
    interfaceStuff()
}

console.log(musicFolder)
// Create a screen object.


// Create a box perfectly centered horizontally and vertically.
function interfaceStuff(){
    let screen = blessed.screen({
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

  let box2= blessed.box({
    bottom: '0',
    right: '0',
    width: '75%',
    height: '30%',
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
  
  let menu=blessed.list({
    items:[...musicFiles,"exit"],
    // items:[chalk.bgRed("hello")],
    title:'Menu',
    top:'0',
    left:'0',
    width: '25%',
    height: '100%',
    keys: true,
    vi: true,
    mouse: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'black',
      bg: '#4287f5',
      selected:{bg:'red'}, 
      border: {
        fg: '#f0f0f0'
      }
    }

  })


  let progressBar=blessed.progressbar({
    parent:box2,
    border:'line',
    filled:0,
    // value:0,
    orientation:'horizontal',
    width: '90%',
    height: 3,
    top:'center',
    left:'center',
    keys:true,
    mouse:true,
    style:{
      fg:'black',
      bg:'white',
      bar:{
      bg:'black'
      },
      border:{
        fg:'yellow',
        bg:'white',
        padding:0
      }
    },
    ch:'',
    content:'0%'
    
  })

let label = blessed.Text({
  parent: progressBar,
  top: 'center-3',
  left: 'center',
  content: 'Elapsed: 00:00 / 00:00', // Placeholder
  align: 'center',
});




      let progressValue;
  audioEvents
  .on('progress', ({ percent, time }) => {
    // console.log(`Elapsed: ${formatted} (${elapsed.toFixed(1)}s)`);
    progressValue=Number(percent.toFixed(2));
    // console.log(progressValue)
    // progressBar.filled=progressValue;
    label.content=`TimeElapsed: ${time[0]}:${time[1]}`
    progressBar.setProgress(progressValue)
    progressBar.content=`${progressValue}%`
    screen.render()
  })

  // Append our box to the screen.

  screen.append(menu);
  screen.append(box1);
  screen.append(box2);
  
  // Add a png icon to the box

  //menu events
  menu.on('select',(e)=>{
  
  const choice = e.getText();
  if (choice === 'exit') {
    return process.exit(0);
  }else{
    convertMP3toPCM(path.join(musicFolder,choice))
  }
})

  // Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
    
  });
  
  // Focus our element.
  menu.focus();
  
  
  // Render the screen.
  // screen.noEcho();
  screen.render();
  
}


listMusicFiles();


