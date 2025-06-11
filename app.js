
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import chalk from 'chalk';
import NodeID3 from 'node-id3';
import {audioEvents,songEndEmitter, convertMP3toPCM,} from './music.js'
import os from 'os';
import path, { relative } from 'path';
import {screen,menu,box2,table,label,progressBar,albumCover,previousButton,nextButton,PlayButton} from './widgets.js'
// let musicFolder=path.join(os.userInfo().homedir,'Music');
import { getMusicFilePath, musicFolder,makeTableRow, getMusicFilesDataArray } from './music.js';
import { exec } from 'child_process';
import { savePNG } from './imageRender.js';
import { EventEmitter } from 'events';


let musicFilesPath;
// let musicFilesDataArray=getMusicFilesDataArray()
let currentlyPlaying;
let musicFilesDataArray;
let globalTime=new Date(),timeElapsed=0,startTime=0,nowTime=0;
let timeInterval,isPlaying=false;



async function app(){
  musicFilesPath= await getMusicFilePath();
  musicFilesDataArray=await getMusicFilesDataArray(musicFilesPath)
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
    // progressValue=Number(percent.toFixed(2));
    timeElapsed=time;
    console.log(timeElapsed)
    let songTime=musicFilesDataArray[currentlyPlaying]
    songTime=songTime[songTime.length-3]
    songTime=Number(songTime)
    // console.log(time)
    progressValue=time/(songTime/1000)*100
// console.log(songTime)
    // label.content=`TimeElapsed: ${time[0]}:${time[1]}`
    progressBar.setProgress(progressValue)
    progressBar.content=`${time}`
    screen.render()
  })

  audioEvents.on('ended',async ()=>{
    
    if(currentlyPlaying===musicFilesDataArray.length-1){
      currentlyPlaying=0;
    }else{
      currentlyPlaying++;
    }
    isPlaying=true;
    convertMP3toPCM(musicFilesPath[currentlyPlaying])
    
    // clearInterval(timeInterval)
    // timeInterval=setInterval(setTimeElapsed,1000)

    await thingsToDoWhenMusicChanges()
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
      musicFilesPath=getMusicFilePath();
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
  PlayButton.focus()
  previousButton.focus()
  nextButton.focus()
  table.focus()
  screen.render();
  
}

app();

table.rows.on('select', async (item, index) => {
  const rowIndex = index;

  // console.log('Selected row:', { title, artist, album });
    if (item === 'exit') {
    return process.exit(0);
  }else{
    isPlaying=true;
    convertMP3toPCM(musicFilesPath[index],)
    
    currentlyPlaying=index;

    // clearInterval(timeInterval)
    // timeInterval=setInterval(setTimeElapsed,1000)
    await thingsToDoWhenMusicChanges()
    screen.render()
  }
});


//Note to self: a better way to do this would be to have a list of path to all the music files
// and then compare the number of the selected option to the array and then send that file path to the playback function
async function addRowToTable(){
  let musicFilesDataArray= await getMusicFilesDataArray(musicFilesPath);
  
    //tableLists [[no,title,artist,album]]
    let tableRowArray=makeTableRow(musicFilesDataArray);
 
    table.setData({headers: ['No','Title', 'Artist', 'Album'],
                  data:tableRowArray})
    

    screen.render();
}

progressBar.on('click', (data) => {
  
  let currentSongRow=musicFilesDataArray[currentlyPlaying]
  let totalDurationInSeconds=currentSongRow[currentSongRow.length-2]/1000
  const relativePosition = data.x-65
  // console.log(relativePosition)
   // progressBar.width;
  const newTime = (relativePosition/100 * totalDurationInSeconds)
  // menu.addItem(String(totalDurationInSeconds))
  isPlaying=true;

  convertMP3toPCM(musicFilesPath[currentlyPlaying], newTime);
  timeElapsed=newTime
  screen.render()
  // console.log(currentSongRow)
});


async function renderAlbumCover(imageBuffer){
  let image=await savePNG(imageBuffer)
  // console.log(image)
  if(image===undefined){
    albumCover.setImage('./Pictures/2.png')
  }else{
    albumCover.setImage(image)
  }
  image=null;
  screen.render()
}   

async function thingsToDoWhenMusicChanges(){
    timeElapsed=0;
  nowTime=new Date().getTime()

    let metadata=NodeID3.read(musicFilesPath[currentlyPlaying])
     
    if(metadata.image===undefined){
      albumCover.setImage('./Pictures/2.png')
    }else{
      let imageBuffer=metadata.image.imageBuffer
      await renderAlbumCover(imageBuffer)
    }
    label.setLabel(`Now Playing: ${musicFilesDataArray[currentlyPlaying][1]} - ${musicFilesDataArray[currentlyPlaying][2]}`)
    // await renderAlbumCover(musicFilesDataArray[currentlyPlaying][musicFilesDataArray[currentlyPlaying].length-1])
    
    screen.render()
}

previousButton.on('press',async ()=>{
  console.log('hello')
  
  if(currentlyPlaying===0){
    currentlyPlaying=musicFilesDataArray.length-1;
  }else{
    currentlyPlaying-=1;
  }
  isPlaying=true;
  convertMP3toPCM(musicFilesPath[currentlyPlaying])
    // clearInterval(timeInterval)
    // timeInterval=setInterval(setTimeElapsed,1000)
  await thingsToDoWhenMusicChanges()
  screen.render()
})




nextButton.on('press',async ()=>{
  console.log('hello')
  if(currentlyPlaying===musicFilesDataArray.length-1){
    currentlyPlaying=0;
  }else{
    currentlyPlaying++;
  }
  isPlaying=true;
  convertMP3toPCM(musicFilesPath[currentlyPlaying])
    // clearInterval(timeInterval)
    // timeInterval=setInterval(setTimeElapsed,1000)
  await thingsToDoWhenMusicChanges()
  screen.render()
})


export let playBackEmitter=new EventEmitter()

PlayButton.on('click',()=>{
  console.log('pressed')
  if(PlayButton.getContent()==='Play'){
    PlayButton.setContent('Pause')
    // timeInterval=setInterval(setTimeElapsed,1000)
    isPlaying=true;
    convertMP3toPCM(musicFilesPath[currentlyPlaying],timeElapsed)
    playBackEmitter.emit('play')
    
  }else{
    
    playBackEmitter.emit('pause')
    PlayButton.setContent('Play')
    isPlaying=false;
    // clearInterval(timeInterval)
    
    console.log(PlayButton.getContent())
    
    
  }
  screen.render()
})
playBackEmitter.on('start',()=>{
  PlayButton.setContent('Pause')
  screen.render()
})


