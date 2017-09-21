import { element } from 'protractor';
import { Directive, HostListener, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import * as screenfull from 'screenfull';

@Directive({
  selector: '[appWsToggleFullscreen]'
})
export class WsToggleFullscreenDirective {
  @Input() targetElement: any;

  constructor(private el: ElementRef) {
    console.log(`*** WsToggleFullscreenDirective`);
    // this.el.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('click') onClick() {
    console.log(`*** Fullscreen clicked`);
    if (screenfull.enabled) {
      screenfull.request(this.targetElement);
    }
  }


}
