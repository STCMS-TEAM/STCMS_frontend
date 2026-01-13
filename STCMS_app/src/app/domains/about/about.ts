import { Component } from '@angular/core';

@Component({
  selector: 'aboutus',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
scrollTo(id: string) {
  const container = document.querySelector('.scrollspy-example') as HTMLElement;
  const target = document.getElementById(id);

  if (!container || !target) return;

  const top = target.offsetTop;

  container.scrollTo({
    top,
    behavior: 'smooth'
  });
}

}
