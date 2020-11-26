import {AfterViewInit, Component, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {WsErrorDialogComponent} from '../ws-dialogs/ws-error-dialog/ws-error-dialog.component';
import {WsMamError} from '../shared/services/ws-base-mam/ws-mam-error';
import { MatDialog } from '@angular/material/dialog';
import { MatSlider } from '@angular/material/slider';
import {WsPlayerService} from './ws-player.service';
import {WsAppStateService} from '../ws-app-state.service';
import {SimpleTimer} from 'ng2-simple-timer';
import {WsVideoTools} from './ws-video-tools';
import {Slider} from 'primeng/slider';
import * as screenfull from 'screenfull'
import {Screenfull} from 'screenfull'

const DescriptorTypeIn = 1;
const FieldNumberIn = 5;
const DescriptorTypeOut = 1;
const FieldNumberOut = 6;
const LastFramSkew = 0.4;
const PlayBackRates = [0.25, 1, 2, 3, 5, 8, 12, 16];
const DefaultPlayBackRate = 1;

let playerHeight;

// @ts-ignore
// @ts-ignore
@Component({
  selector: 'app-ws-player',
  templateUrl: './ws-player.component.html',
  styleUrls: ['./ws-player.component.css']
})
export class WsPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mediaPlayer', {static: true}) mediaPlayer: any;
  @ViewChild('playerHeader', {static: true}) playerHeader: any;
  @ViewChild('playerControl', {static: true}) playerControl: any;
  @ViewChild('markerSlider', {static: true}) markerSlider: Slider;
  @ViewChild('videoSlider', {static: true}) videoSlider: MatSlider;

  @Input() set playerHeight(value: number) {
    this.playerContainerHeight = value;
    this.calculateVideoPlayerHeight();
  };

  public loading = false;
  private subscribers: any[];
  public selectedClip: any;
  public masterClip: any;
  public selectedBin: any;
  public container: any;
  public player;
  public tvFormat: any;
  public videoHelper = new WsVideoTools();
  public timmecodeHead = '--:--:--:--';
  public timmecodeStart = '--:--:--:--';
  public timmecodeEnd = '--:--:--:--';
  public timmecodeDuration = '--:--:--:--';
  private tapeStart: number;
  public clipStart: number;
  public clipEnd: number;
  public clipDuration: number;
  public clipIn: number;
  public clipOut: number;
  public sliderHead: number;
  public sliderStart: number;
  public sliderEnd: number;
  public sliderMarkers: any;
  public sliderStep: number;
  public markerIn: number;
  public markerOut: number;
  private timerId: string;
  private timerName = 'videoTimer';
  private revTimerId: string;
  private revTimerName = 'revVideoTimer';
  public canCreateSubclip: boolean;
  public thumbnailUrl = '';
  public fullscreen = screenfull;
  public showMarkerIn = false;
  public showMarkerOut = false;
  public markers: number[] = [0, 0];
  private markerClipDescriptors = [];
  private isSelectedClipMasterclip: boolean;
  private currentPlayBackIndexRate = DefaultPlayBackRate;
  private keyActionMap = [];
  private isPlayRev = false;
  private playerContainerHeight: number;

  constructor(
    private timer: SimpleTimer,
    private appState: WsAppStateService,
    private playerService: WsPlayerService,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) {
    this.isSelectedClipMasterclip = false;
    this.subscribers = [];

    let subscriber = this.appState.playClipSubject
      .subscribe(response => this.selectedClipResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.playerService.getMasterClipSubject
      .subscribe(response => this.getMasterclipResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.playerService.getClipDescriptorSubject
      .subscribe(response => this.getClipDescriptorResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.playerService.setMarkerSubject
      .subscribe(response => this.setMarkerResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.appState.selectBinNodeSubject
      .subscribe(response => this.selectBinNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.appState.selectNodeSubject
      .subscribe(response => this.selectNodeResponse(response));
    this.subscribers.push(subscriber);


    this.playerService.getClipDescriptors();
  }

  ngOnInit() {
    this.showMarkerIn = false;
    this.showMarkerOut = false;
    this.markers = [0, 0];

    this.canCreateSubclip = false;

    this.sliderHead = 0;
    this.sliderStart = 0;
    this.sliderEnd = 10;
    this.sliderMarkers = [{start: 0, end: 0}];
    this.sliderStep = 0.05;

    this.player = this.mediaPlayer.nativeElement;
    this.player.ontimeupdate = () => {
      if (this.player.currentTime >= this.clipEnd) {
        this.pause();
      }
    };
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
  }

  /* *** Service Responses *** */
  private calculateVideoPlayerHeight() {
    let heights = this.markerSlider.el.nativeElement.offsetHeight +
      this.videoSlider._elementRef.nativeElement.offsetHeight +
      this.playerHeader.nativeElement.offsetHeight +
      this.playerControl.nativeElement.offsetHeight + 80;
    this.mediaPlayer.nativeElement.style.height = (this.playerContainerHeight - heights) + 'px';

  }

  private selectedClipResponse(response: any) {
    this.loading = false;
    if (response instanceof WsMamError) {
      return;
    }
    this.selectedClip = response;


    // tslint:disable-next-line:max-line-length
    this.thumbnailUrl = this.videoHelper.getThumbnailUrl(this.selectedClip, this.appState.selectedMam, this.selectedClip.videoFormat);

    if (this.selectedClip.type !== 'masterClip') {
      this.isSelectedClipMasterclip = false;
      this.playerService.getMasterclip(this.selectedClip.masterClipId);
    } else {
      this.isSelectedClipMasterclip = true;
      this.playerService.getMasterclip(this.selectedClip.id);
    }
  }

  private getMasterclipResponse(response: any) {
    this.loading = false;
    if (response instanceof WsMamError) {
      return;
    }

    if (this.isSelectedClipMasterclip) {
      this.selectedClip = response;
    } else {
      this.masterClip = response;
    }

    this.loadClip();
  }

  private getClipDescriptorResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    response.forEach(item => {
      if (item.nameInternal === 'pd_in') {
        this.markerClipDescriptors[0] = item.id;
      }
      if (item.nameInternal === 'pd_out') {
        this.markerClipDescriptors[1] = item.id;
      }
    });
  }

  private setMarkerResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }
  }

  private selectBinNodeResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }
    if (response == null) {
      this.selectedBin = null;
      this.canCreateSubclip = false;
      return;
    }
    this.selectedBin = response;
    if (this.selectedClip == undefined) {
      return;
    }
    switch (this.selectedClip.type) {
      case 'clip':
        if (this.selectedBin.parent.type == 'clipBin') {
          this.canCreateSubclip = true;
        } else {
          this.canCreateSubclip = false;
        }
        break;
      case 'masterClip':
        if (this.selectedBin.parent.type == 'clipBin') {
          this.canCreateSubclip = true;
        } else if (this.selectedBin.parent.type == 'roll' &&
          this.selectedClip.isEntire &&
          this.selectedClip.parent == this.selectedBin.parent.id) {
          this.canCreateSubclip = true;
        } else {
          this.canCreateSubclip = false;
        }
        break;
      default:
        this.canCreateSubclip = false;
        break;
    }
  }

  /* *** Private Methods *** */
  private getThumbnail() {
    // tslint:disable-next-line:max-line-length
    return this.videoHelper.getThumbnailUrl(this.selectedClip, this.appState.selectedMam, this.selectedClip.videoFormat);
  }

  private loadClip() {
    try {

      this.loading = true;

      if (this.timerId != null && this.timerId.length > 0) {
        this.timer.unsubscribe(this.timerId);
        this.timer.delTimer(this.timerName);
      }
      if (this.revTimerId != null && this.revTimerId.length > 0) {
        this.timer.unsubscribe(this.revTimerId);
        this.timer.delTimer(this.revTimerName);
      }

      let mediaUrl: string;

      switch (this.selectedClip.type) {
        case 'clip':
          this.canCreateSubclip = true;
          this.selectedClip.mog = this.masterClip;
          this.tvFormat = this.selectedClip.mog.videoFormat;
          this.clipStart = this.videoHelper.getClipStart(this.selectedClip);
          this.clipEnd = this.videoHelper.getClipEnd(this.selectedClip);
          this.clipDuration = this.videoHelper.getDuration(this.selectedClip);
          this.clipIn = this.selectedClip.in / 10000000;
          this.clipOut = this.selectedClip.out / 10000000;
          this.tapeStart = this.videoHelper.getTimecodeStart(this.selectedClip);
          this.timmecodeHead = this.videoHelper.getTimecodeString(this.tvFormat, this.clipStart);
          this.timmecodeHead = this.videoHelper.getTimecodeString(this.tvFormat, this.videoHelper.getTimecodeStart(this.selectedClip));
          this.timmecodeStart = this.videoHelper.getTimecodeString(this.tvFormat, this.videoHelper.getTimecodeStart(this.selectedClip));
          this.timmecodeEnd = this.videoHelper.getTimecodeString(this.tvFormat, this.videoHelper.getTimecodeEnd(this.selectedClip));
          this.timmecodeDuration = this.videoHelper.getTimecodeString(this.tvFormat, this.clipOut - this.clipIn);
          mediaUrl = this.videoHelper.getMediaUrl(this.masterClip, this.appState.selectedMam);
          break;
        case 'masterClip':
          this.canCreateSubclip = this.selectedClip.isEntire;
          this.tvFormat = this.selectedClip.videoFormat;
          this.clipStart = this.videoHelper.getClipStart(this.selectedClip);
          this.clipEnd = this.videoHelper.getClipEnd(this.selectedClip);
          this.clipDuration = this.videoHelper.getDuration(this.selectedClip);
          this.clipIn = 0;
          this.clipOut = this.clipDuration;
          this.tapeStart = this.videoHelper.getTimecodeStart(this.selectedClip);
          this.timmecodeHead = this.videoHelper.getTimecodeString(this.tvFormat, this.videoHelper.getTimecodeStart(this.selectedClip));
          this.timmecodeStart = this.videoHelper.getTimecodeString(this.tvFormat, this.videoHelper.getTimecodeStart(this.selectedClip));
          this.timmecodeEnd = this.videoHelper.getTimecodeString(this.tvFormat, this.videoHelper.getTimecodeEnd(this.selectedClip));
          this.timmecodeDuration = this.videoHelper.getTimecodeString(this.tvFormat, this.clipDuration);
          mediaUrl = this.videoHelper.getMediaUrl(this.selectedClip, this.appState.selectedMam);
          break;
      }

      this.markerSlider.disabled = !this.canCreateSubclip;

      if (mediaUrl === null) {
        this.player.poster = './assets/img/noMedia.png';
        this.player.src = null;
      } else {
        this.player.src = mediaUrl + this.setMediaFragment();

        this.player.load();

      }

      this.sliderHead = 0;
      this.sliderStart = 0;
      this.sliderEnd = this.clipDuration;

      this.markerIn = this.clipIn;
      this.markerOut = this.clipOut;

      if (this.markerIn > this.sliderStart) {
        this.showMarkerIn = true;
      } else {
        this.showMarkerIn = false;
      }

      if (this.markerOut < this.sliderEnd) {
        this.showMarkerOut = true;
      } else {
        this.showMarkerOut = false;
      }

      this.markers = [this.markerIn * 10, this.markerOut * 10];

      this.loading = false;
      this.player.focus();

    } catch (e) {
      this.loading = false;
    }
  }

  private setMediaFragment(): string {
    return `#t=${this.clipStart},${this.clipEnd}`;
  }

  // Timer
  private timerCallback() {
    this.tick();
  }

  private tick() {
    this.sliderHead = this.player.currentTime - this.clipStart;
    // tslint:disable-next-line:max-line-length
    this.timmecodeHead = this.videoHelper.getTimecodeString(this.tvFormat, this.videoHelper.getTimecodeHead(this.tapeStart, this.clipStart, this.player.currentTime));
  }

  // Marker Slider
  public markerSliderChanged(event) {
    this.videoSliderMoved(this.markerSlider.values[this.markerSlider.handleIndex] / 10.0);
  }

  public markerSliderEnded(event) {
    this.videoSliderMoved(this.markerSlider.values[this.markerSlider.handleIndex] / 10.0);

    switch (this.markerSlider.handleIndex) {
      case 0:
        this.setMarkIn();
        break;
      case 1:
        this.setMarkOut();
        break;
    }
  }

  // Video Slider
  public videoSliderMoved(pos) {
    if (!this.player.src) {
      return;
    }

    this.pause();

    const newPos = this.clipStart + pos;

    if (newPos >= this.clipEnd) {
      return;
    }

    this.sliderHead = pos;
    // tslint:disable-next-line:max-line-length
    this.timmecodeHead = this.videoHelper.getTimecodeString(this.tvFormat, this.videoHelper.getTimecodeHead(this.tapeStart, this.clipStart, newPos));
    this.player.currentTime = newPos;
  }

  public videoSliderChanged() {
  }

  // Player

  // Player: Clicked and keys
  public playerClicked(event: any) {
    if (!this.player.src) {
      return;
    }

    this.player.focus();

    if (this.player.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  public playerKeyPressed(event: any) {
//    console.log(event);
    if (!this.player.src) {
      return;
    }

    this.keyActionMap[event.keyCode] = event.type == 'keydown';
    if (this.keyActionMap[75] && this.keyActionMap[76]) {
      this.currentPlayBackIndexRate = 0;
      this.playWithPlayBackRate();
    } else if (event.type == 'keydown') {
      switch (event.keyCode) {
        case 32: // space
          if (this.player.paused === true) {
            this.play();
          } else {
            this.pause();
          }
          break;
        case 37: // left arrow
        case 51: // 3
          this.pause();
          if (this.player.currentTime <= this.clipStart) {
            return;
          }
          if (event.altKey) {
            this.player.currentTime -= (10 * 0.04);
          } else {
            this.player.currentTime -= 0.04;
          }
          if (this.player.currentTime <= this.clipStart) {
            this.player.currentTime = this.clipStart;
          }
          this.tick();
          break;
        case 49: // 1
          this.pause();
          if (this.player.currentTime <= this.clipStart) {
            return;
          }
          this.player.currentTime -= (10 * 0.04);
          if (this.player.currentTime <= this.clipStart) {
            this.player.currentTime = this.clipStart;
          }
          this.tick();
          break;
        case 35: // End
          this.toClipEnd();
          break;
        case 36: // Home
          this.toClipStart();
          break;
        case 39: // right arrow
        case 52: // 4
          this.pause();
          if (this.player.currentTime >= this.clipEnd) {
            return;
          }
          if (event.altKey) {
            this.player.currentTime += (10 * 0.04);
          } else {
            this.player.currentTime += 0.04;
          }
          if (this.player.currentTime > this.clipEnd) {
            this.player.currentTime = this.clipEnd;
          }
          this.tick();
          break;
        case 50: // 2
          this.pause();
          if (this.player.currentTime >= this.clipEnd) {
            return;
          }
          this.player.currentTime += (10 * 0.04);
          if (this.player.currentTime > this.clipEnd) {
            this.player.currentTime = this.clipEnd;
          }
          this.tick();
          break;
        case 71: // g
          this.clearMarkInOut();
          break;
        case 73: // i
          this.setMarkIn();
          break;
        case 79: // o
          this.setMarkOut();
          break;
        case 68: // d
          this.clearMarkIn();
          break;
        case 70: // f
          this.clearMarkOut();
          break;
        case 74: // j
          if (!this.isPlayRev) {
            this.pause();
          }
          this.isPlayRev = true;
          this.playRevWithPlayBackRate();
          if (this.currentPlayBackIndexRate < PlayBackRates.length - 1) {
            this.currentPlayBackIndexRate++;
          }
          break;
        case 75: // k
          this.pause();
          break;
        case 76: // l
          if (this.isPlayRev) {
            this.pause();
          }
          this.playWithPlayBackRate();
          if (this.currentPlayBackIndexRate < PlayBackRates.length - 1) {
            this.currentPlayBackIndexRate++;
          }
          break;
        case 67: // c
          this.createSubClip();
          break;
        case 90: // z
        case 123: // F12
          this.toggleFullscreen();
          break;
        case 65: // a
          this.previousEvent();
          break;
        case 83: // s
          this.nextEvent();
          break;
      }
    }
  }

  public playerError(event: any) {
    let msg: string;

    if (event && event.path && event.path[0]) {
      msg = `Player Error: ${event.path[0].error.message}, Code ${event.path[0].error.code}`;
    } else if (event && event.currentTarget) {
      msg = `Player Error: ${event.currentTarget.error.message}, Code ${event.currentTarget.error.code}`;
    } else {
      msg = `Player Error`;
    }

    throw new Error(msg);
  }

  // Player: Play and pause
  public play(playbackRate: number = PlayBackRates[DefaultPlayBackRate]) {
    try {
      if (!this.player.src) {
        return;
      }

      this.stopPlayRev()
      if (playbackRate == PlayBackRates[DefaultPlayBackRate]) {
        this.currentPlayBackIndexRate = DefaultPlayBackRate;
      }

      if (this.player.currentTime >= this.clipEnd) {
        this.pause();
        return;
      }
      this.timer.newTimer(this.timerName, 0.1);
      this.timerId = this.timer.subscribe(this.timerName, () => this.timerCallback());
      if (this.player.playbackRate != playbackRate) {
        this.player.playbackRate = playbackRate
      }
      this.player.play();
      this.player.focus();
    } catch (e) {
      throw new Error(e.message);
    }
  }

  public playWithPlayBackRate() {
    this.play(PlayBackRates[this.currentPlayBackIndexRate]);
  }

  public playRev(playbackRate: number = PlayBackRates[DefaultPlayBackRate]) {
    if (!this.player.src) {
      return;
    }
    this.player.pause();
    this.timer.newTimer(this.revTimerName, playbackRate * 0.04);
    this.revTimerId = this.timer.subscribe(this.revTimerName, () => {
      this.player.currentTime += (-0.04 * playbackRate);
      this.tick();
    });
  }

  public playRevWithPlayBackRate() {
    this.playRev(PlayBackRates[this.currentPlayBackIndexRate]);
  }

  public stopPlayRev() {
    this.isPlayRev = false;
    this.timer.unsubscribe(this.revTimerId);
    this.timer.delTimer(this.revTimerName);
  }

  public pause() {
    if (!this.player.src) {
      return;
    }

    this.stopPlayRev()
    this.currentPlayBackIndexRate = DefaultPlayBackRate;
    this.player.pause();
    this.timer.unsubscribe(this.timerId);
    this.timer.delTimer(this.timerName);
    this.player.focus();
  }

  // Player: Toggle Mute and fullscreen
  public toggleMute() {
    this.player.muted = !this.player.muted;
    this.player.focus();
  }

  public toggleFullscreen() {
    const videoContainer: any = document.getElementById('playerComponent');
    let sf = <Screenfull>screenfull;
    if (sf.enabled) {
      sf.toggle(videoContainer).then(() => {
          if (sf.isFullscreen) {
            this.mediaPlayer.nativeElement.style.height = 'auto';
          } else {
            this.calculateVideoPlayerHeight();
          }
        }
      );
    }

    this.player.focus();
  }

  // Marker handling
  public setMarkIn() {
    if (!this.player.src) {
      return;
    }

    this.markerIn = this.sliderHead;
    if (this.markerIn >= this.markerOut) {
      this.markerOut = this.sliderEnd;
      this.showMarkerOut = false;
    } else {
      this.showMarkerIn = true;
    }

    this.markers = [this.markerIn * 10, this.markerOut * 10];
    this.timmecodeDuration = this.videoHelper.getTimecodeString(this.tvFormat, this.markerOut - this.markerIn);
    this.player.focus();
    this.saveMarkers();
  }

  public setMarkOut() {
    if (!this.player.src) {
      return;
    }

    this.markerOut = this.sliderHead;
    if (this.markerIn >= this.markerOut) {
      this.markerIn = 0;
      this.showMarkerIn = false;
    } else {
      this.showMarkerOut = true;
    }

    this.markers = [this.markerIn * 10, this.markerOut * 10];
    this.timmecodeDuration = this.videoHelper.getTimecodeString(this.tvFormat, this.markerOut - this.markerIn);
    this.player.focus();
    this.saveMarkers();
  }

  public clearMarkIn() {
    if (!this.player.src) {
      return;
    }

    this.markerIn = 0;
    this.showMarkerIn = false;
    this.markers = [this.markerIn * 10, this.markerOut * 10];
    this.timmecodeDuration = this.videoHelper.getTimecodeString(this.tvFormat, this.markerOut - this.markerIn);
    this.player.focus();
    this.saveMarkers();
  }

  public clearMarkOut() {
    if (!this.player.src) {
      return;
    }

    this.markerOut = this.sliderEnd;
    this.showMarkerOut = false;
    this.markers = [this.markerIn * 10, this.markerOut * 10];
    this.timmecodeDuration = this.videoHelper.getTimecodeString(this.tvFormat, this.markerOut - this.markerIn);
    this.player.focus();
    this.saveMarkers();
  }

  public clearMarkInOut() {
    if (!this.player.src) {
      return;
    }

    this.markerIn = 0;
    this.markerOut = this.sliderEnd;
    this.showMarkerIn = false;
    this.showMarkerOut = false;
    this.markers = [this.markerIn * 10, this.markerOut * 10];
    this.timmecodeDuration = this.videoHelper.getTimecodeString(this.tvFormat, this.markerOut - this.markerIn);
    this.player.focus();
    this.saveMarkers();
  }

  public saveMarkers() {
    const markerIn: number = Math.round(this.markerIn * 10000000);
    const markerOut: number = Math.round(this.markerOut * 10000000);
    this.selectedClip.in = markerIn;
    this.selectedClip.out = markerOut;
    this.playerService.setMarker(this.selectedClip.id, markerIn, markerOut, this.markerClipDescriptors[0], this.markerClipDescriptors[1]);
  }

  public createSubClip() {
    // alert(this.selectedClip.type);

    /*    if (this.selectedClip.in === 0 && this.selectedClip.out === (this.selectedClip.tapeOut - this.selectedClip.tapeIn)) {
          this.openErrorDialog('Markers not set');
          return;
        }*/
    //alert(this.selectedClip.type);
    if (this.selectedBin == null) {
      return;
    }

    switch (this.selectedClip.type) {
      case 'masterClip':
        if (this.selectedBin.parent.type == 'clipBin') {
          this.playerService.linkMasterclip(this.selectedClip, this.selectedBin.parent);
        } else {
          this.playerService.createSubclipFromMasterclip(this.selectedClip);
        }
        break;
      default:
        this.playerService.createSubclipFromClip(this.selectedClip);
        break;
    }
  }

  public toClipStart() {
    if (!this.player.src) {
      return;
    }
    this.pause();
    this.player.currentTime = this.clipStart;
    this.tick();
    this.player.focus();
  }

  public toClipEnd() {
    if (!this.player.src) {
      return;
    }
    this.pause();
    this.player.currentTime = this.clipEnd;
    this.tick();
    this.player.focus();
  }

  public previousEvent() {
    if (!this.player.src) {
      return;
    }
    this.pause();
    let pos = this.sliderHead;

    if (pos > this.markerOut) {
      pos = this.markerOut;
    } else if (pos > this.markerIn) {
      pos = this.markerIn;
    } else {
      pos = this.sliderStart;
    }

    this.player.currentTime = pos + this.clipStart;
    this.tick();
    this.player.focus();
  }

  public nextEvent() {
    if (!this.player.src) {
      return;
    }
    this.pause();
    let pos = this.sliderHead;

    if (pos < this.markerIn) {
      pos = this.markerIn;
    } else if (pos < this.markerOut) {
      pos = this.markerOut;
    } else {
      pos = this.sliderEnd;
    }

    this.player.currentTime = pos + this.clipStart;
    this.tick();
    this.player.focus();
  }

  /* *** Dialogs *** */

  private openErrorDialog(msg: string) {
    const dialogRef = this.dialog.open(WsErrorDialogComponent, {
      width: '300px',
      data: msg
    });
  }

  canPlay(event: Event) {
    if (this.isPlayRev) {
      this.tick();
//      this.playRev();
    }
  }

  resizePlayer($event: UIEvent) {
    console.log('resize player');
  }

  private selectNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }
    if (response == null || (response.type != 'masterClip' && response.type != 'clip')) {
      this.clearPlayerData();
      this.player.removeAttribute('src')
      this.player.load();
    }
  }

  private clearPlayerData() {
    this.clearMarkInOut();
    this.showMarkerIn = false;
    this.showMarkerOut = false;
    this.markers = [0, 0];
    this.sliderHead = 0;
    this.sliderStart = 0;
    this.timmecodeHead = '--:--:--:--';
    this.timmecodeStart = '--:--:--:--';
    this.timmecodeEnd = '--:--:--:--';
    this.timmecodeDuration = '--:--:--:--';
    this.selectedClip = null;
  }

}
