
import inquirer from 'inquirer';
import chalk from 'chalk';
import {readdir} from 'fs/promises';
import { createReadStream } from 'fs';
import { Readable } from 'stream';
import boxen from 'boxen';
import {Lame} from 'node-lame'
import Speaker from 'speaker';
import path from 'path';
import os from 'os';

let musicFolder=path.join(os.userInfo().homedir,'Music');
// let musicFolder='./Music'
let files;
console.log(path.resolve(musicFolder,'something.mp3'))

async function readDirectory(){
    // console.clear()

    try {
      files = await readdir(musicFolder);
    } catch (err) {
      console.error(err);
    } 



    let question={
    name:'choice',
    type:'list',
    message:boxen("==========MENU==========",{
          padding: 1,
          margin: 1,
          borderColor: 'cyan',
          borderStyle: 'round',
          title: 'CLI Player',
          titleAlignment: 'center'
        }),
    choices:[...files,new inquirer.Separator(" ")],
    loop:true
    }

  inquirer.prompt(question)
    .then(answer=>{
      let musicFile=answer.choice;
      chalk.bgRedBright.italic(path.resolve(musicFolder,musicFile))
      
      convertMP3toPCM(path.resolve(musicFolder,musicFile))
      readDirectory();
      logger(musicFile);
    })
}



const decoder =new Lame({
  output:'buffer'
});


const speaker = new Speaker();


async function convertMP3toPCM(mp3Path) {
  try {
    console.log(mp3Path)
    decoder.setFile(mp3Path);
    await decoder.decode()
    const pcmBuffer=decoder.getBuffer();
    // let mp3Stream = await createReadStream(mp3Path);

    const bufferStream= new Readable({
      read(){
        this.push(pcmBuffer)
        this.push(null)
      }

    })
    bufferStream.pipe(speaker)
    
  } catch (err) {
    console.error(chalk.bgRed('Error decoding MP3:', err));
  }
}


readDirectory();

function logger(musicName){
  console.log(chalk.bgGreen(`Now playing...${musicName}`))

}