import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { routing, appRoutingProviders } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  providers: [appRoutingProviders],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'blog-angular';
}
