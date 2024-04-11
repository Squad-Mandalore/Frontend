import { Component, Output, EventEmitter, Input } from '@angular/core';
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
  @Input() selectedHeadline: number | null = null;
  @Input() selectedSubHeadline: number | null = null;
  @Output() headlineClicked = new EventEmitter<number>();
  @Output() subHeadlineClicked = new EventEmitter<{headlineIndex: number, subHeadlineIndex: number}>();
  headlines: { title: string, subtitles: string[] }[] = [];

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