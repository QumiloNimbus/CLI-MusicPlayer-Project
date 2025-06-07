
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import chalk from 'chalk';
import NodeID3 from 'node-id3';
import {audioEvents, convertMP3toPCM} from './music.js'
import os from 'os';
import path from 'path';
import {screen,menu,box2,table,label,progressBar} from './widgets.js'
// let musicFolder=path.join(os.userInfo().homedir,'Music');
import { listMusicFiles, musicFolder,makeTableLists } from './music.js';



async function app(){
  try{
    let musicFiles=await listMusicFiles();
    let tableLists=makeTableLists(musicFiles);
    
    table.setData({headers: ['Title', 'Artist', 'Album'],
                  data:tableLists})
    // console.log(musicFiles)
    // tableLists.forEach((file)=>menu.addItem(file))
    menu.addItem('exit')
    interfaceStuff();
    // console.log(menu)
  }
 catch(err){
    console.log(err)
  }
 } 


// Create a screen object.


// Create a box perfectly centered horizontally and vertically.
function interfaceStuff(){
    

  screen.render()
  //table here
   //allow control the table with the keyboard

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
  screen.append(table);
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
  // If our box is clicked, change the content.
  // box.on('click', function(data) {
  //   box.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
  //   screen.render();
  // });
  
  // If box is focused, handle `enter`/`return` and give us some more content.
  // box.key('enter', function(ch, key) {
  //   box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
  //   box.setLine(1, 'bar');
  //   box.insertLine(1, 'foo');
  //   screen.render();
  // });
  
  // Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
    
  });
  
  // Focus our element.
  menu.focus();
  table.focus()
  
  screen.render();
  
}

app();

//  table.rows.on('select',(e)=>{
  
//   const choice = e.content;
//   console.log(e)
  // if (choice === 'exit') {
  //   return process.exit(0);
  // }else{
  //   convertMP3toPCM(path.join(musicFolder,choice))
  // }
// })

table.rows.on('select', (item, index) => {
  const rowIndex = index; // subtract header row
  const row = table.rows.items[rowIndex].content.trim().split(/\s{2,}/); // split by 2+ spaces

  const [title, artist, album] = row;

  // console.log('Selected row:', { title, artist, album });
    if (item === 'exit') {
    return process.exit(0);
  }else{
    musicCheckTemp(title);
    
  }
});

async function musicCheckTemp(title){
  let musicFile=await listMusicFiles();

      musicFile.forEach((file)=>{
        const tags = NodeID3.read(file)
      if(tags.title===title){
        convertMP3toPCM(file)
      }
      })
    
  }

