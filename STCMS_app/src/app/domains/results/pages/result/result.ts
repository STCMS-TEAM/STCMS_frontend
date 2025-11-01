import { Component } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Categories } from '../categories/categories';
import { Match } from '../match/match';

@Component({
  selector: 'app-result',
  imports: [Match, Categories, Navbar],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result {}
