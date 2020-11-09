import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})



export class LoginComponent implements OnInit {

	public title: string;

	public user: User;

	public status: string;

	public identity;

	public token;

  	constructor(
  		private _route: ActivatedRoute,
  		private _router: Router,
  		private _userService: UserService
  	) {
  		this.title = 'Identifícate';
  		this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
 	}

 	ngOnInit(): void {
  		console.log('Componente de login cargado');
 	}

 	onSubmit(){
 		this._userService.signup(this.user).subscribe(
 			response => {
 				this.identity = response.user;
 				if(!this.identity || !this.identity._id){
 					this.status = 'error';
 				}else {
 					this.status = 'success';

 					localStorage.setItem('identity', JSON.stringify(this.identity));

 					this.getToken();

 				}
 				
 			},
 			error => {
 				var errorMessage = <any>error;

 				if(errorMessage != null){
 					this.status = 'error';
 				}
 			}
 		);
 	}

 	getToken(){
 		this._userService.signup(this.user, 'true').subscribe(
 			response => {
 				this.token = response.token;

 				if(this.token <= 0){
 					this.status = 'error';
 				}else {
 					this.status = 'success';

 					localStorage.setItem('token', this.token);
 				}
 			},
 			error => {
 				var errorMessage = <any>error;

 				if(errorMessage != null){
 					this.status = 'error';
 				}
 			}
 		);

 	}

}
