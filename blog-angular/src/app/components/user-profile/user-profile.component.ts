import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  public page_title: string;
  public user;
  public token;
  public url;

  constructor(
    private _userService: UserService
  ) {
    this.page_title = "Mi Perfil";
    this.user = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global.url;
    console.log(this.user);
  }
}
