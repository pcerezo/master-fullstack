import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { global } from '../../services/global';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [RouterLink, FormsModule, FroalaEditorModule],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css',
  providers: [UserService, PostService]
})
export class PostEditComponent {
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
    private _postService: PostService,
    private _categoryService: CategoryService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.page_title = "Editar un artículo";
    this.fileName = "";
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = this._postService.getBlankPost();
    this.categories = [];
  }

  ngOnInit() {
    this.getCategories();
    this.getPost();
    console.log(this.categories);
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

  getPost() {
    // Sacar id del post
    this._route.params.subscribe(params => {
      let id = +params['id'];

      // Petición Ajax para sacar los datos
      this._postService.getPost(id).subscribe(
        response => {
          if (response.status == 'success') {
            console.log(response.post.title);
            this.post = response.post;
            this.post.content = this._postService.limpiarTextoEnriquecido(this.post.content);
          }
          else {
            this._router.navigate(['inicio']);
          }
        }
      );
    })
  }

  onSubmit() {
    console.log("Imagen que se sube: " + this.fileName);
    this._postService.update(this.token, this.post, this.post.id).subscribe(
      response => {
        if (response && response.status == 'success') {
          this.status = response.status;
          console.log("Post final: ");
          console.log(response);
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
