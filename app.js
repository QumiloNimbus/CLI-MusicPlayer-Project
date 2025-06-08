
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import chalk from 'chalk';
import NodeID3 from 'node-id3';
import {audioEvents, convertMP3toPCM} from './music.js'
import os from 'os';
import path from 'path';
import {screen,menu,box2,table,label,progressBar} from './widgets.js'
// let musicFolder=path.join(os.userInfo().homedir,'Music');
import { getMusicFilePath, musicFolder,makeTableRow, getMusicFilesDataArray } from './music.js';
import { exec } from 'child_process';

let musicFilesPath;

async function app(){
  musicFilesPath= await getMusicFilePath();
  try{
    
    addRowToTable();
    
    interfaceStuff();
    
  }
 catch(err){
    console.log(err)
  }
 } 

function interfaceStuff(){
    

  screen.render()

// code for the progress bar takes 
  let progressValue;

  audioEvents.on('progress', ({ percent, time }) => {
    progressValue=Number(percent.toFixed(2));

    label.content=`TimeElapsed: ${time[0]}:${time[1]}`
    progressBar.setProgress(progressValue)
    progressBar.content=`${progressValue}%`
    screen.render()
  })

  // Appending the elements to the screen

  screen.append(menu);
  screen.append(table);
  screen.append(box2);
  

  //menu events
  menu.on('select',(e)=>{
  
  const choice = e.getText();

  if (choice === 'Exit') {
    return process.exit(0);
  }else if(choice==='Detect'){
      exec('mv /home/nimbus/Downloads/*mp3 /home/nimbus/Music')
      addRowToTable();

  }
  screen.render();
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
  progressBar.focus();
  table.focus()
  screen.render();
  
}

app();

table.rows.on('select', (item, index) => {
  const rowIndex = index; // subtract header row
  const row = table.rows.items[rowIndex].content.trim().split(/\s{2,}/); // split by 2+ spaces

  const [no,title, artist, album] = row;

  // console.log('Selected row:', { title, artist, album });
    if (item === 'exit') {
    return process.exit(0);
  }else{
    convertMP3toPCM(musicFilesPath[index])
    
    
  }
});


//Note to self: a better way to do this would be to have a list of path to all the music files
// and then compare the number of the selected option to the array and then send that file path to the playback function
async function addRowToTable(){
  let musicFilesDataArray= getMusicFilesDataArray(musicFilesPath);
  
    //tableLists [[no,title,artist,album]]
    let tableRowArray=makeTableRow(musicFilesDataArray);
 
    table.setData({headers: ['No','Title', 'Artist', 'Album'],
                  data:tableRowArray})
    
    
    screen.render();
}

