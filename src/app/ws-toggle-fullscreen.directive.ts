import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import * as screenfull from 'screenfull';
import {Screenfull} from "screenfull";
@Directive({
  selector: '[appWsToggleFullscreen]'
})
export class WsToggleFullscreenDirective {

  @Input() targetElement: any;

  constructor(private el: ElementRef) {
    console.log(`*** WsToggleFullscreenDirective`);
     this.el.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('click') onClick() {
    console.log(`*** Fullscreen clicked`);
    let sf = <Screenfull>screenfull;
    if (sf.enabled) {
      sf.request(this.targetElement);
    }
  }


}
