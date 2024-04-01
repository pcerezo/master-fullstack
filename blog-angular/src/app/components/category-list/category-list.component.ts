import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  public page_title: string;
  public categories: Array<Category> = [];

  constructor(
    private _categoryService: CategoryService
  ) {
    this.page_title = "Lista de categorías";
    this.categories = [];
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    /*this._categoryService.getCategories().subscribe(
      response => {
        if (response.status == 'success') {
          this.categories = response.categories;
        }
        console.log("categories: " + this.categories);
      },
      error => {
        console.error(error);
      }
    );*/
    this._categoryService.getCategories().subscribe((response) => {
      if (response.status == 'success') {
        this.categories = response.categories;
      }
      else {
        this.categories = [];
      }
    });
  }
}
