import { Component, OnInit, DoCheck, AfterViewInit } from '@angular/core';
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
  	private _userService: UserService
  ){
  	this.title = 'NGSOCIAL'

  }

  ngOnInit(){
  	this.identity = this._userService.getIdentity();
  }

  ngDoCheck(){
  	this.identity = this._userService.getIdentity();
  	Feather.replace();
  }

  ngAfterViewInit() {
  	Feather.replace();
  }
}
