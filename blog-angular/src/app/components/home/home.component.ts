import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { global } from '../../services/global';
import { Post } from '../../models/post';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { PostListComponent } from "../post-list/post-list.component";

@Component({
    selector: 'home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    providers: [PostService],
    imports: [RouterLink, PostListComponent]
})
export class HomeComponent {
  public page_title: string;
  public url: string;
  public listaPosts: any = [];
  public identity;
  public token;

  constructor(
    private _postService: PostService,
    private _userService: UserService
  ) {
    this.page_title = 'Inicio';
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.listarPosts();
  }

  listarPosts() {
    this._postService.getPosts().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaPosts = response.posts;
          console.log(this.listaPosts[1].title);
        }
        else {
          console.error(response);
        }
      }
    );
  }

  deletePost(id: number) {
    this._postService.delete(this.token!, id).subscribe(
      response => {
        this.listarPosts();
      }
    );
  }
}
