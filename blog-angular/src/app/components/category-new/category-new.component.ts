import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Category } from '../../models/category';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-new',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './category-new.component.html',
  styleUrl: './category-new.component.css',
  providers : [UserService, CategoryService]
})
export class CategoryNewComponent {
  public page_title: string;
  public identity;
  public token;
  public category;
  public status: any;

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService
    ) {
    this.page_title = "Crear nueva categoría";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.category = new Category(1, '');
    this.status = null;
  }

  ngOnInit() {}

  onSubmit(categoryForm: any) {
    console.log(this.category);
    this.status = null;
    this._categoryService.create(this.token, this.category).subscribe(
      response => {
        this.status = response.status;
        console.log(response);
      },
      error => {
        this.status = 'error';
        console.error(error);
      }
    );
  }
}
