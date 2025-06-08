import Speaker from 'speaker';
import chalk from 'chalk';
import {readdir} from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg'
import { EventEmitter } from 'events';
import NodeID3 from 'node-id3';

let currentSpeaker=null;
let currentFFmpegCommand=null;

export const audioEvents = new EventEmitter();


export async function convertMP3toPCM(mp3Path) {
    let startTime = new Date();

    if (currentFFmpegCommand) {
        currentSpeaker.destroy();
    currentFFmpegCommand.kill(currentFFmpegCommand.pid,'SIGTERM');
        currentFFmpegCommand = null;
    }

    try {
        const speaker = new Speaker();
        currentSpeaker=speaker;

        const command = ffmpeg(mp3Path)
        .audioChannels(2)
        .audioFrequency(44100)
        .format('s16le')
         .on('start', () => {
             // Capture start timestamp
         })
        .on('progress', (progress) => {
            
            // let timeElapsed = progress.timemark;
            let timeElapsed=[Math.floor((startTime.getTime()%1000)/60),Math.floor(startTime.getTime()%1000)]
            
            const percentElapsed=progress.percent
            audioEvents.emit('progress',{
                percent:percentElapsed,
                time:timeElapsed
            })
            
             // HH:MM:SS.FF format
            // console.log(`Elapsed: ${timeElapsed}`);
        })
        .on('error', (err) => true)


        currentFFmpegCommand=command;
        command.pipe(currentSpeaker, { end: true });

    } catch (err) {
        return true
    }
    


}



import path from 'path';
import os from 'os';

//default music folder
export let musicFolder=path.join(os.userInfo().homedir,'Music');


//returning list of absolute paths of all song files
export async function getMusicFilePath(){
  try {
        let musicFiles= await readdir(musicFolder);
        let musicFilesPath=musicFiles.map((file)=>path.join(musicFolder,file));
        return musicFilesPath;
    } catch (err) {
      console.error(err);
    } 
    
}




//making a list of meta deta that will be inserted into the table
export function makeTableRow(musicFilesDataArray){
    // let filePath='/home/nimbus/Music/videoclub-roi.mp3'
    let tableRow=[]
    
    for(let data of musicFilesDataArray){
        //[no,title,artist,album]
        tableRow.push(data.slice(0,4))
    }
    //[[no,title,artist,album]]  
    // console.log(tableRow)
    return tableRow;
}

//returns the array of array of music data of every music files [[no,title,artist,album,duration,path]]
export function getMusicFilesDataArray(musicFilesPath){
    // let filePath='/home/nimbus/Music/videoclub-roi.mp3'
    let musicFilesDataArray=[],i=0;
    
    for(let filePath of musicFilesPath){
        i++;
        const metadata = NodeID3.read(filePath)
    
        if(metadata.title===undefined){
                metadata.title=path.parse(filePath);
                metadata.title=metadata.title.name;
            }

        let temp=[i,metadata.title,metadata.artist,metadata.album,metadata.length,filePath];
        
        temp=temp.map((element)=>{

            if(element===undefined){
                return '-'
            }else{
                return element
            }

            
        })
        musicFilesDataArray.push(temp)
    }
    
    return musicFilesDataArray;
}
