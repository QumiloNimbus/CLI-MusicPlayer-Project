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
    currentFFmpegCommand.kill('SIGTERM');
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

export let musicFolder=path.join(os.userInfo().homedir,'Music');


//returning list of absolute paths of all song files
export async function listMusicFiles(){
  try {
        let musicFiles= await readdir(musicFolder);
        return musicFiles.map((file)=>path.join(musicFolder,file))
    } catch (err) {
      console.error(err);
    } 
    
}


// import NodeID3 from "node-id3";


//making a list of meta deta that will be inserted into the table
export function makeTableLists(musicFiles){
    // let filePath='/home/nimbus/Music/videoclub-roi.mp3'
    let tableList=[]
    
    for(let filePath of musicFiles){
        
        const tags = NodeID3.read(filePath)
        tableList.push([tags.title,tags.artist,tags.album])
    }
    
    return tableList;
}