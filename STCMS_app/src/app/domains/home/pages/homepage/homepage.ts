import { Component } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Hero } from '../hero/hero';

@Component({
  selector: 'app-homepage',
  imports: [Hero, Navbar],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {}
