import { Component, OnInit, DoCheck, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import * as Feather from 'feather-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent implements OnInit, DoCheck, AfterViewInit {
  public title: string;

  public identity;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService: UserService
  ){
  	this.title = 'NGSOCIAL'

  }

  ngOnInit(){
  	this.identity = this._userService.getIdentity();
    Feather.replace();
  }

  ngDoCheck(){
  	this.identity = this._userService.getIdentity();
  	Feather.replace();
  }

  logout(){
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);
    Feather.replace();
  }

  ngAfterViewInit() {
  	Feather.replace();
  }
}
