import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ws-logout',
  templateUrl: './ws-logout.component.html',
  styleUrls: ['./ws-logout.component.css']
})
export class WsLogoutComponent implements  OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public login(): void {
    this.router.navigate(['/login']);
  }

}

