import Speaker from 'speaker';
import chalk from 'chalk';
import {readdir} from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg'
import { EventEmitter } from 'events';
import NodeID3 from 'node-id3';
import { playBackEmitter } from './app.js';

let currentSpeaker=null;
let currentFFmpegCommand=null;

export const audioEvents = new EventEmitter();
export const songEndEmitter=new EventEmitter()

let nowPlayingPath, nowTime;
export async function convertMP3toPCM(mp3Path,timeStamp=0,) {

    if (currentFFmpegCommand) {
        currentSpeaker.destroy();
        currentFFmpegCommand.kill(currentFFmpegCommand.pid,'SIGTERM');
        currentFFmpegCommand = null;
    }

   nowPlayingPath=mp3Path;
   nowTime=timeStamp;
    
    
        playBackEmitter.once('play',()=>{
            // console.log(nowTime)
            playMusic(nowPlayingPath,timeStamp)
        })
        playBackEmitter.on('pause',()=>{
            console.log('playBackEmitter pause')
            if (currentFFmpegCommand) {
            currentSpeaker.destroy();
            currentFFmpegCommand.kill(currentFFmpegCommand.pid,'SIGTERM');
            currentFFmpegCommand = null;
            }
        })

    playMusic(mp3Path,timeStamp)
    


}

function playMusic(mp3Path,timeStamp){
    if (currentFFmpegCommand) {
        currentSpeaker.destroy();
        currentFFmpegCommand.kill(currentFFmpegCommand.pid,'SIGTERM');
        currentFFmpegCommand = null;
    }
    console.log('something played this is playMusic()')
    try {
        const speaker = new Speaker();
        currentSpeaker=speaker;

        let command = ffmpeg(mp3Path)
        .setStartTime(timeStamp)
        .audioChannels(2)
        .audioFrequency(44100)
        .format('s16le')
         .on('start', () => {
             playBackEmitter.emit('start')
         })
        .on('progress', (progress) => {
            
            // let timeElapsed = progress.timemark;

            
            const percentElapsed=progress.percent
            let timeMark=progress.timemark
            // console.log(progress.timemark)
            timeMark=timeMark.split(":")
            timeMark=Number(timeMark[1])*60+Number(timeMark[2])+timeStamp
            audioEvents.emit('progress',{
                percent:percentElapsed,
                time:timeMark
            })
            
             // HH:MM:SS.FF format
            // console.log(`Elapsed: ${timeElapsed}`);
        })
        .on('end',()=>{
            audioEvents.emit('ended')
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
    try {
        for(let data of musicFilesDataArray){
        //[no,title,artist,album]
        tableRow.push(data.slice(0,4))
        
    }
    return tableRow;
    //[[no,title,artist,album]]  
    // console.log(tableRow)
    
    } catch (error) {
        
        console.error(musicFilesDataArray)
    }
    
}

//returns the array of array of music data of every music files [[no,title,artist,album,duration,path]]
export async function getMusicFilesDataArray(musicFilesPath){
    // let filePath='/home/nimbus/Music/videoclub-roi.mp3'
    let musicFilesDataArray=[],i=0;
    // console.log("here")
    for(let filePath of musicFilesPath){
        i++;
        const metadata = NodeID3.read(filePath)
    
        if(metadata.title===undefined){
                metadata.title=path.parse(filePath);
                metadata.title=metadata.title.name;
        }
        // if(metadata.image===undefined){
        //     metadata.image={imageBuffer:'./Pictures/2.png'}
        // }
        if(metadata.length===undefined){
            metadata.length= await getAudioDuration(filePath)
            if(typeof metadata.length === 'number'){
                metadata.length=String(metadata.length*1000)
            }
            // metadata.length=100
        }

        let row=[i,
            metadata.title,
            metadata.artist,
            metadata.album,
            metadata.length,
            filePath,
            // metadata.image.imageBuffer
        ];

        row=row.map((element)=>{
            if(element===undefined){
                return '-'
            }else{
                return element
            }
        })

        musicFilesDataArray.push(row);
    }
    
    return musicFilesDataArray;
}



 async function  getAudioDuration(filePath) {
    return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration); // in seconds
      }
    });
  });
}
