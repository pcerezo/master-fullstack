import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { global } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { PostListComponent } from "../post-list/post-list.component";

@Component({
    selector: 'app-category-detail',
    standalone: true,
    templateUrl: './category-detail.component.html',
    styleUrl: './category-detail.component.css',
    providers: [CategoryService, UserService, PostService],
    imports: [RouterLink, PostListComponent]
})
export class CategoryDetailComponent {
  public page_title: string;
  public url;
  public listaPosts: any = [];
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoryService,
    private _userService: UserService,
    private _postService: PostService
  ) {
    this.page_title = "";
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.getCategory();
    this.getPostsByCategory();
  }

  getCategory() {
    this._route.params.subscribe(params => {
      let id = + params['id'];

      this._categoryService.getCategory(id).subscribe( response => {
        if (response.status == "success") {
          this.page_title = response.category.name;
        }
      });
    });
  }

  getPostsByCategory() {
    this._route.params.subscribe(params => {
      let id = + params['id'];

      this._categoryService.getPosts(id).subscribe(
        response => {
          if (response && response.status == "success") {
            this.listaPosts = response.message;
          }
          else {
            this._router.navigate(['/inicio']);
          }
        }
      );
    });
  }

  deletePost(id: number) {
    this._postService.delete(this.token!, id).subscribe(
      response => {
        this.getPostsByCategory();
      }
    );
  }

}
