import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Router, RouterLink } from '@angular/router';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { Category } from '../../models/category';
import { global } from '../../services/global';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-new',
  standalone: true,
  imports: [FormsModule, RouterLink, FroalaEditorModule],
  templateUrl: './post-new.component.html',
  styleUrl: './post-new.component.css',
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent {
  public page_title: string;
  public fileName: string;
  public url: string;
  public identity: User;
  public token: any;
  public post: Post;
  public status: any;
  public categories: any;
  public froala_options: Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
  };

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService,
    private _router: Router
  ) {
    this.page_title = "Crear nueva entrada";
    this.fileName = "";
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post(1, this.identity.id, 1, '', '', '');
    this.categories = [];
  }

  ngOnInit() {
    this.getCategories();
    //console.log(this.post);
  }

  getCategories() {
    this._categoryService.getCategories().subscribe(
      response => {
        if (response.status == 'success') {
          this.categories = response.categories;
          console.log("categorías: " + JSON.stringify(this.categories));
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  onFilePostSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this._postService.uploadPostImage(file, this.token).subscribe(
        response => {
          console.log("RESPONSE: " + response.status);
          if (response && response.status == 'success') {
            this.status = "successFoto";
            this.post.image = response.image;
            this.fileName = response.image;
            console.log("Nombre de la imagen: " + response.image);
            //localStorage.setItem('identity', JSON.stringify(this.identity));
          }
          else {
            this.status = 'errorFoto';
          }
          console.log("Respuesta: " + response.image);
        }
      );
    }
  }

  onSubmit() {
    console.log(this.post);
    console.log("Imagen que se sube: " + this.fileName);
    this._postService.create(this.token, this.post).subscribe(
      response => {
        if (response && response.status == 'success') {
          this.status = response.status;
        }
        else {
          this.status = 'error';
          console.log(response.messages);
        }
        console.log("Status de guardado: " + response.status);
      },
      error => {
        this.status = 'error';
        console.log(error);
      }
    );
  }
}
