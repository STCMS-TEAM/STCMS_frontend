import { Component } from '@angular/core';
import { Categories } from '../categories/categories';
import { Match } from '../match/match';

@Component({
  selector: 'app-result',
  imports: [Match, Categories],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result {}
