import { Component, DoCheck, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { routing, appRoutingProviders } from './app.routes';
import { UserService } from './services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { global } from './services/global';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HttpClientModule, FroalaEditorModule, FroalaViewModule],
  providers: [appRoutingProviders, UserService, HttpClient, CategoryService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, DoCheck {
  title = 'blog-angular';
  public identity :any;
  public token :any;
  public url: string;
  public categories : any;

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService
  ) {
    this.loadUser();
    this.url = global.url;
  }

  ngOnInit(): void {
    //console.log("Cargado correctamente");
  }

  ngDoCheck(): void {
    this.loadUser();
  }

  loadUser() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }
}
