import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css',
  providers : [UserService]
})
export class UserSettingsComponent {
  public page_title: string;
  public status: any;
  public user: User;
  public identity: any;
  public token: any;

  constructor(
    private _userService: UserService
  ) {
    this.page_title = 'Ajustes de usuario';
    this.user = this._userService.getBlankUser();
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    // Se rellena el usuario
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email, '',
      this.identity.description,
      this.identity.image,
    );
    console.log(this.user);
  }

  onSubmit() {
    this._userService.update(this.token, this.user).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = response.status;
          this.identity = this.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));
        }
        else {
          this.status = 'error';
          console.log(response.messages);
        }
      },
      error => {
        this.status = 'error';
        console.log(error);
      }
    );
  }
}
