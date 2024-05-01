import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'post-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  @Input() listaPosts: any;
  @Input() identity: any;
  @Input() url: any;
  public token: string | null;

  constructor(
    private _postService: PostService,
    private _userService: UserService
  ) {
    this.token = this._userService.getToken();
  }

  ngOnInit() {}

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
