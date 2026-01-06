import { Component } from '@angular/core';
import { Hero } from '../hero/hero';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [Hero],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {}
