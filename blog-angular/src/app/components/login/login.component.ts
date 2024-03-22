import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [HttpClientModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserService]
})
export class LoginComponent {
  public page_title: string;
  public user: User;
  public status: string;
  public token : any;
  public identity: User | null;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Identifícate';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
    this.status = 'success';
    this.token = '';
    this.identity = this.user;
  }

  ngOnInit() {
    // Se ejecuta cuando se carga el componente y si tiene el parámetro sure en la url
    this.logout();
  }

  onSubmit(form: any) {
    this._userService.login(this.user).subscribe(
      response => {
        // Token
        if (response.status != 'error') {
          this.status = 'success';
          this.token = response;

          // Objeto usuario identificado
          this._userService.login(this.user, true).subscribe(
            response => {
              // Token
              this.status = 'success';
              this.identity = response;
              console.log("Token: " + this.token);
              console.log(this.identity);

              // Se guarda la sesión con su usuario
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));
              this._router.navigate(['inicio']);
            },
            error => {
              this.status = 'error';
              console.log(error);
            }
          );
        }
        else {
          this.status = 'error';
          console.log("Login incorrecto");
        }
      },
      error => {
        this.status = 'error';
        console.log(error);
      }
    );
  }

  logout() {
    this._route.params.subscribe(params => {
      let logout = +params['sure'];

      if (logout == 1) {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;

        // Redirección a la página principal
        this._router.navigate(['inicio']);
      }
    });
  }

}
