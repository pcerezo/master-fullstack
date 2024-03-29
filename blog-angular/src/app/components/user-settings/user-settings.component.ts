import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { global } from '../../services/global';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [RouterLink, FormsModule, FroalaEditorModule, FroalaViewModule],
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
  public url: string;
  public froala_options: Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
  };
  public fileName;

  constructor(
    private _userService: UserService,
  ) {
    this.page_title = 'Ajustes de usuario';
    this.user = this._userService.getBlankUser();
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global.url;


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

    this.fileName = '';
    console.log(this.user);
  }

  onSubmit() {
    this._userService.update(this.token, this.user).subscribe(
      response => {
        if (response && response.status == 'success') {
          this.status = response.status;

          if (response.changes.name) {
            this.user.name = response.changes.name;
          }

          if (response.changes.surname) {
            this.user.surname = response.changes.surname;
          }

          if (response.changes.email) {
            this.user.email = response.changes.email;
          }

          if (response.changes.description) {
            this.user.description = response.changes.description;
          }

          if (response.changes.image) {
            this.user.image = response.changes.image;
          }

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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    console.log("file: " + file);
    if (file) {
      this._userService.uploadUserImage(file, this.token).subscribe(
        response => {
          if (response && response.status == 'success') {
            this.status = "successFoto";
            this.user.image = response.image;
            this.fileName = response.image;
            this.identity = this.user;
            localStorage.setItem('identity', JSON.stringify(this.identity));
          }
          else {
            this.status = 'errorFoto';
          }
          console.log("Respuesta: " + response.image);
        },
        error => {
          this.status = 'errorFoto';
          console.error("Error: " + error);
        }
      );
    }
  }
}
