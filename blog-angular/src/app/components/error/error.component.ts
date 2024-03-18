import { Component } from '@angular/core';

@Component({
  selector: 'error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  public page_title = 'Página no encontrada';

  constructor() {
    
  }
}
