import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [UserService]
})
export class RegisterComponent {
  public page_title: string;
  public user: User;
  public status?: string;

  constructor(
    private _userService: UserService
  ) {
    this.page_title = 'Regístrate';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '', '');
  }

  ngOnInit() {
    console.log(this._userService.test());
  }

  onSubmit(form: any) {
    this._userService.register(this.user).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = response.status;
          form.reset();
        }
        else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(error)
      }
    );
  }
}
