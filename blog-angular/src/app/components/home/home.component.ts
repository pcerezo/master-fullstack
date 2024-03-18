import { Component } from '@angular/core';

@Component({
  selector: 'home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public page_title: string;

  constructor() {
    this.page_title = 'Inicio';
  }
}
