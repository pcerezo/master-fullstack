import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { ActivatedRoute, Router } from '@angular/router';
import { global } from '../../services/global';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
  providers: [PostService, UserService]
})
export class PostDetailsComponent {
  public page_title;
  public post: any;
  public url: string;
  public token: string | any;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.page_title = "Detalles del artículo";
    this.post = this._postService.getBlankPost();
    this.url = global.url;
    this.token = this._userService.getToken();
    this.getPost();
  }

  ngOnInit() {}

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
          }
          else {
            this._router.navigate(['inicio']);
          }
        }
      );
    })
  }
  
  update() {
    this._postService.update(this.token, this.post, this.post.id).subscribe();
  }
}
