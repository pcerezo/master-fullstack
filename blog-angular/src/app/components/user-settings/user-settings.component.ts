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

  constructor(
    private _userService: UserService
  ) {
    this.page_title = 'Ajustes de usuario';
    this.user = this._userService.getBlankUser();
  }

  onSubmit(form: any) {}
}
