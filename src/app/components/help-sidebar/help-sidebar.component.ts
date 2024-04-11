import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadlinesService } from '../../shared/headlines.service';

@Component({
  standalone: true,
  selector: 'app-help-sidebar',
  templateUrl: './help-sidebar.component.html',
  styleUrls: ['./help-sidebar.component.scss'],
  imports: [CommonModule]
})


export class HelpSidebarComponent {
  @Output() headlineClicked = new EventEmitter<number>();
  @Output() subHeadlineClicked = new EventEmitter<{headlineIndex: number, subHeadlineIndex: number}>();
  headlines: { title: string, subtitles: string[] }[] = [];
  selectedHeadline: number | null = 0;
  selectedSubHeadline: number | null = null;

  constructor(private headlinesService: HeadlinesService) {
    this.headlinesService.headlines.subscribe((headlines: { title: string; subtitles: string[]; }[]) => {
      this.headlines = headlines;
    });
  }

  onHeadlineClick(index: number) {
    this.headlineClicked.emit(index);
    this.selectedHeadline = index;
  }

  onSubHeadlineClick(headlineIndex: number, subHeadlineIndex: number) {
    this.subHeadlineClicked.emit({headlineIndex, subHeadlineIndex});
    this.selectedSubHeadline = subHeadlineIndex;
  }
}