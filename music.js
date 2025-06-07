import Speaker from 'speaker';
import chalk from 'chalk';
import ffmpeg from 'fluent-ffmpeg'
import { EventEmitter } from 'events';

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
            console.log(progress.timemark);
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

