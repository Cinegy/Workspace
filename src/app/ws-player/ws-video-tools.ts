import { WsMamConnection } from './../shared/services/ws-base-mam/ws-mam-connection';
export class WsVideoTools {
    public getDuration(clip: any): number {
        return (clip.tapeOut - clip.tapeIn) / 10000000;
    }

    public getClipStart(clip: any): number {
        return (clip.mog.offset + clip.tapeIn - clip.mog.tapeIn) / 10000000;
    }

    public getMasterclipStart(masterClip: any): number {
        return masterClip.offset / 10000000;
    }

    public getClipEnd(clip: any): number {
        const duration = this.getDuration(clip);
        const start = this.getClipStart(clip);
        return (start + duration);
    }

    public getMasterclipEnd(masterClip: any): number {
        const duration = this.getDuration(masterClip);
        const start = this.getMasterclipStart(masterClip);
        return (start + duration);
    }

    public getFrame(tvFormat: any, position: number) {
        const frequency: number = tvFormat.videoFormat.frameRate.fps;
        const frame: number = Math.round(position * frequency);
        return frame;
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
                return `${mam.mediaServer}${encodeURI(file.fileName)}`;
            }
        }

        return null;
    }

    public getThumbnailUrl(clip: any, mam: WsMamConnection, tvFormat?: any) {
        let url: string;

        switch (clip.type) {
            case 'image':
                url = `${mam.thumbnailServer}${clip.id}.png?file=${encodeURIComponent(clip.path + clip.fileName)}&frame=0&width=160`;
                return url;
            case 'masterClip':
            case 'clip':
                let fileName: string;

                for (const file of clip.fileSet.files) {
                    if (file.fileType.toLowerCase() === 'fT_Video'.toLowerCase()) {
                        fileName = `${file.filePath}${file.fileName}`;
                        break;
                    }
                }

                let thumbnail = clip.thumbnail;

                if (thumbnail < clip.tapeIn) {
                    thumbnail = clip.tapeIn;
                }

                if (thumbnail > clip.tapeOut) {
                    thumbnail = clip.tapeOut;
                }

                const pos = (thumbnail - clip.tapeIn + clip.offset) / 10000000;
                const frame = this.getFrame(tvFormat, pos);

                url = `${mam.thumbnailServer}${clip.id}.png?file=${encodeURIComponent(fileName)}&frame=${frame}&width=160`;
                return url;
            default: return null;
        }
    }

}
