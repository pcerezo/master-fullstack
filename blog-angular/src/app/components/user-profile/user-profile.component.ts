import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  providers: [UserService, PostService]
})
export class UserProfileComponent {

  public page_title: string;
  public user;
  public token;
  public url;
  public listaPosts: any = [];

  constructor(
    private _userService: UserService,
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.page_title = "Mi Perfil";
    this.user = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global.url;
    console.log(this.user);
  }

  ngOnInit() {
    this._userService.getPosts(this.user.id).subscribe(
      response => {
        if (response.status == 'success') {
          this.listaPosts = response.posts;
          console.log(this.listaPosts[1].title);
        }
        else {
          console.error(response);
        }
    });
  }

  deletePost(id: number) {
    this._postService.delete(this.token!, id).subscribe(
      response => {
        this._router.navigate(['perfil']);
      }
    );
  }
}
