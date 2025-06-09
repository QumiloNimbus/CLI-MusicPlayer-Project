
import ffmpeg from 'fluent-ffmpeg';
import stream from 'stream';
import sharp from 'sharp';
export async function savePNG(buffer) {
    try {
        // Use sharp to convert the buffer to PNG and write to memory temporarily
        if(Buffer.isBuffer(buffer)){
            return await sharp(buffer).png().toBuffer()
        }
        // else{
        //     await sharp(buffer).png().toBuffer();
        // }
            
            // .toFormat('png')
            // .toFile(outputPath);
    } catch (error) {
        console.error('Error saving PNG:', error);
    }
}