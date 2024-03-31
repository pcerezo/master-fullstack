import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Router, RouterLink } from '@angular/router';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';

@Component({
  selector: 'app-post-new',
  standalone: true,
  imports: [FormsModule, RouterLink, FroalaEditorModule],
  templateUrl: './post-new.component.html',
  styleUrl: './post-new.component.css',
  providers: [UserService, CategoryService]
})
export class PostNewComponent {
  public page_title: string;
  public identity: User;
  public token;
  public post: Post;
  public status: any;
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
    private _router: Router
  ) {
    this.page_title = "Crear nueva entrada";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post(1, this.identity.id, 1, '', '', '');
  }

  ngOnInit() {
    //console.log(this.post);
  }

  onSubmit() {}
}
