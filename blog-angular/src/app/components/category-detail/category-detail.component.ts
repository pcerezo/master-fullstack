import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent {
  public page_title: string;
  public url;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoryService
  ) {
    this.page_title = "Artículos de la categoría ";
    this.url = global.url;
  }

  ngOnInit() {}

  getPostsByCategory() {
    
  }
}
