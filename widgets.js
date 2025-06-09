import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { title } from 'process';
import chalk from 'chalk';


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
  
  screen.title = 'Termuse';
  //   let box1 = blessed.box({
  //   top: '0',
  //   right: '0',
  //   width: '75%',
  //   height: '75%',
  //   content: '',
  //   tags: true,
  //   border: {
  //     type: 'line'
  //   },
  //   style: {
  //     fg: 'white',
  //     bg: 'red',
  //     border: {
  //       fg: '#f0f0f0'
  //     },
  //     hover: {
  //       bg: 'green'
  //     }
  //   }
  // });



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
      items:['Detect','Exit'],
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
     , label: 'Songs',
     style:{
      label:{
        fg:purple
      }
     }
     , width: '80%'
     , height: '70%'
     , border: {type: "line", fg: purple}
     , columnSpacing: 15 //in chars
     , columnWidth: [3,35, 30, 30] /*in chars*/ },
    )



  //    table.setData(
  //  { headers: ['Title', 'Artist', 'Album']})



export let progressBar=blessed.progressbar({
    parent:box2,
    // border:'line',
    // border:{
    //   type:'line',
    //   bg:purple,
    //   fg:purple


    // },
    // filled:0,
    // value:0,
    orientation:'horizontal',
    width: 100,
    height: 2,
    top:'center',
    left:'center',
    keys:true,
    mouse:true,
    padding:0,
    style:{
      // fg:'#f0f0f0',
      fg:red,
      bg:'#f0f0f0',
      bar:{
        fg:'black',
        bg:red
      },
      label:{
        bg:blue,
        fg:'black'
      }
      // border:{
      //   fg:green,
      //   bg:'white', 
      // }
    },
    // label:'time elapsed',
    ch:'',
    content:'0%'
    
  })

export let label = blessed.text({
  width:'100%',
  parent: progressBar,
  top:'center-2',
  left: 'center',
  content: '', // Placeholder
  align: 'center',
});

export let albumCover=blessed.image({
  parent:menu,
  bottom:0,
  left:'center',
  // file:'./Pictures/2.png',
  type:'ansi',
  // height:17,
  width: 32,
  height:18,
  ascii:true
})