import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('quantity-measurement-app');

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Handle OAuth2 redirect — token comes as ?token=xxx in URL
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        localStorage.setItem('token', params['token']);
        this.router.navigate(['/dashboard']);
      }
    });
  }
}