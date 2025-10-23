import { Component } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-homepage',
  imports: [Navbar],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {}
