import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { ActivatedRoute, Router } from '@angular/router';
import { global } from '../../services/global';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
  providers: [PostService]
})
export class PostDetailsComponent {
  public page_title;
  public post: any;
  public url: string;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.page_title = "Detalles del artículo";
    this.post = this._postService.getBlankPost();
    this.url = global.url;
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
            this.post.content = this.limpiarTextoEnriquecido(this.post.content);
          }
          else {
            this._router.navigate(['inicio']);
          }
        }
      );
    })
  }

  limpiarTextoEnriquecido(texto: string): string {
    return texto.replace(/<[^>]*>/g, '');
  }
  
}
