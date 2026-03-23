import fs from 'fs';
import path from 'path';

export class VideoDownloader {
  constructor(private outputDir: string = './downloads') {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  async download(video: any): Promise<string> {
    console.log(`Baixando: ${video.id} - ${video.caption}`);

    const response = await fetch(video.media.url);

    if (!response.ok) {
      throw new Error(`Falha no download: ${response.status}`);
    }

    const filePath = path.join(this.outputDir, `${video.id}.mp4`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    console.log(`Salvo em: ${filePath}`);
    return filePath;
  }
}