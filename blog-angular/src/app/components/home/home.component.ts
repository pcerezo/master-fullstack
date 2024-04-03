import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { global } from '../../services/global';
import { Post } from '../../models/post';

@Component({
  selector: 'home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [PostService]
})
export class HomeComponent {
  public page_title: string;
  public url: string;
  public listaPosts: any = [];

  constructor(
    private _postService: PostService
  ) {
    this.page_title = 'Inicio';
    this.url = global.url;

    this.listarPosts();
  }

  listarPosts() {
    this._postService.getPosts().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaPosts = response.posts;
          console.log(this.listaPosts);
        }
        else {
          console.error(response);
        }
      }
    );
  }
}
