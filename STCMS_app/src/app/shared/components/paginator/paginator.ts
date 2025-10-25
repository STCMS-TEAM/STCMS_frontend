import {
  Component,
  effect,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  Signal,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator implements OnChanges {
  @Input() page!: number;
  @Input() totalPages!: number;

  @Output() pageChange = new EventEmitter<number>();

  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges) {
    // Recalculate page numbers whenever totalPages changes
    if (changes['totalPages']) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  }

  goToPrevious(event: Event) {
    event.preventDefault();
    if (this.page > 1) this.pageChange.emit(this.page - 1);
  }

  goToNext(event: Event) {
    event.preventDefault();
    if (this.page < this.totalPages) this.pageChange.emit(this.page + 1);
  }

  goToPage(p: number, event: Event) {
    event.preventDefault();
    this.pageChange.emit(p);
  }
}
