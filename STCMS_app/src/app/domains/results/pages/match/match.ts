import { Component } from '@angular/core';
import { Tournaments } from '../tournaments/tournaments';

@Component({
  selector: 'app-match',
  imports: [Tournaments],
  templateUrl: './match.html',
  styleUrl: './match.css',
})
export class Match {
  // track active tab
  activeTab: string = 'All';

  // set active tab on click
  setActive(tab: string) {
    this.activeTab = tab;
  }
}
