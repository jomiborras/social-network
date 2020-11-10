import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

	public title: string;
	public user: User;
	public identity;
	public token;
	public status: string;

  constructor(
  	private _route: ActivatedRoute,
  	private _router: Router,
  	private _userService: UserService
  ) {
  	this.title = 'Actualizar mis datos';
  	this.identity = this._userService.getIdentity();
  	this.user = this.identity;
  	
  	this.token = this._userService.getToken();
  }

  ngOnInit(): void {
  	
  }

  onSubmit(){
  	this._userService.updateUser(this.user).subscribe(
  		response =>{
  			if(!response.user){
  				this.status = 'error';
  			}else {
  				this.status = 'success';
  				localStorage.setItem('identity', JSON.stringify(this.user));
  				this.identity = this.user;


  			}

  		},

  		error => {
  			var errorMessage = <any>error;
  			console.log(errorMessage);

  			if(errorMessage != null){
  				this.status = 'error';
  			}
  		}
  	);
  }

}
