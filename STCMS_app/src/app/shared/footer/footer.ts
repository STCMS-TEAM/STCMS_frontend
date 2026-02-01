import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  scrollTop(event?: Event) {
    if (event) event.preventDefault();
    window.scrollTo({ top: 0, left: 0 });
  }
}
