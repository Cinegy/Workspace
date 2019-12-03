import { WsMamConnection } from '../shared/services/ws-base-mam/ws-mam-connection';

export class WsVideoTools{
    public getDuration(clip: any): number {
        return (clip.tapeOut - clip.tapeIn) / 10000000;
      }
    
      public getClipStart(clip: any): number {
        switch (clip.type) {
          case 'clip':
            return (clip.mog.offset + clip.tapeIn - clip.mog.tapeIn) / 10000000;
          case 'masterClip':
            return clip.offset / 10000000;
        }
      }
    
      public getClipEnd(clip: any): number {
        const duration = this.getDuration(clip);
        const start = this.getClipStart(clip);
        return (start + duration);
      }
    
      public getFrame(tvFormat: any, position: number) {
        const frequency: number = tvFormat.videoFormat.frameRate.fps;
        const frame: number = Math.round(position * frequency);
        return frame;
      }
    
      public getTimecodeHead(tapeStart: number, clipStart: number, position: number) {
        return tapeStart + (position - clipStart);
      }
    
      public getTimecodeStart(clip: any) {
        switch (clip.type) {
          case 'clip':
            return (clip.mog.originalTapeIn + clip.tapeIn - clip.mog.tapeIn) / 10000000;
          case 'masterClip':
            return clip.originalTapeIn / 10000000;
        }
      }
    
      public getTimecodeEnd(clip: any) {
        switch (clip.type) {
          case 'clip':
            return ((clip.mog.originalTapeIn + clip.tapeIn - clip.mog.tapeIn) / 10000000) + this.getDuration(clip);
          case 'masterClip':
            return (clip.originalTapeIn / 10000000) + this.getDuration(clip);
        }
      }
    
      public getTimecodeString(tvFormat: any, position: number): string {
        const framerate: number = tvFormat.videoFormat.frameRate.fps;
        const frameCount = this.getFrame(tvFormat, position);
        let hours: number;
        let minutes: number;
        let seconds: number;
        let frames: number;
    
        hours = frameCount / (3600 * framerate);
    
        if (hours > 23) {
          hours = hours % 24;
        }
        minutes = (frameCount % (3600 * framerate)) / (60 * framerate);
        seconds = ((frameCount % (3600 * framerate)) % (60 * framerate) / framerate);
        frames = ((frameCount % (3600 * framerate)) % (60 * framerate) % framerate);
    
        hours = Math.floor(hours);
        minutes = Math.floor(minutes);
        seconds = Math.floor(seconds);
        frames = Math.floor(frames);
    
        let timecodeStr = '';
    
        if (hours < 10) {
          timecodeStr += '0';
        }
    
        timecodeStr += `${hours}:`;
    
        if (minutes < 10) {
          timecodeStr += '0';
        }
    
        timecodeStr += `${minutes}:`;
    
        if (seconds < 10) {
          timecodeStr += '0';
        }
    
        timecodeStr += `${seconds}:`;
    
        if (frames < 10) {
          timecodeStr += '0';
        }
    
        timecodeStr += `${frames}`;
    
        return timecodeStr;
      }
    
      public getMediaUrl(clip: any, mam: WsMamConnection) {
       
        for (const file of clip.fileSet.files) {

          if (file.auxFileType && file.auxFileType === 'AW1') {
            return `${file.url}${encodeURI(file.fileName)}`;
          }
        }
    
        return null;
      }
    
      public getThumbnailUrl(clip: any, mam: WsMamConnection, tvFormat?: any) {
        let url: string = null;
        let urlParams: URLSearchParams = null;
    
        switch (clip.type) {
          case 'image':
            if (clip.thumbnailUrl) {
              urlParams = this.getUrlParams(clip.thumbnailUrl);
              url = `${mam.thumbnailServer}${clip.id}.png?file=${(urlParams.get('file'))}&frame=0&width=160`;
            }
    
            return url;
          case 'masterClip':
          case 'clip':
            if (clip.thumbnailUrl) {
              urlParams = this.getUrlParams(clip.thumbnailUrl);
              // tslint:disable-next-line:max-line-length
              url = `${mam.thumbnailServer}${clip.id}.png?file=${(urlParams.get('file'))}&frame=${urlParams.get('frame')}&width=160`;
            }
            return url;
          default:
            return null;
        }
      }
    
      private getUrlParams(url: string) {
        const parser = document.createElement('a');
        parser.href = url;
        const urlParams = new URLSearchParams(parser.search);
        return urlParams;
      }
    
    }
    