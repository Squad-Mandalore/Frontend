import { Component, Output, EventEmitter, ViewChildren, ViewChild, QueryList, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../components/buttons/primary-button/primary-button.component';
import { NavbarBottomComponent } from '../../components/navbar-bottom/navbar-bottom.component';
import { HelpSidebarComponent } from '../../components/help-sidebar/help-sidebar.component';
import { DatePipe, NgIf } from '@angular/common';
import { HeadlinesService } from '../../shared/headlines.service';
import { LoggerService } from '../../shared/logger.service';
import { IconComponent } from '../../components/icon/icon.component';
import { QuaternaryButtonComponent } from '../../components/buttons/quaternary-button/quaternary-button.component';


@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [PrimaryButtonComponent, QuaternaryButtonComponent, CommonModule, NavbarBottomComponent, IconComponent, HelpSidebarComponent, DatePipe, NgIf, NavbarBottomComponent],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.scss'
})

export class HelpPageComponent implements AfterViewInit {
  @Output() headlineInView = new EventEmitter<number>();
  @Output() subHeadlineInView = new EventEmitter<number>();
  headlines: { title: string, subtitles: string[] }[] = [];
  headlineElementsArray: HTMLElement[] = [];
  subHeadlineElementsArray: HTMLElement[] = [];
  subHeadlinesMap: Map<number, HTMLElement[]> = new Map();
  currentHeadline: number = 0;
  currentSubHeadline: number | null = null;

  @ViewChild('content') content: ElementRef | undefined;
  @ViewChildren('.headline') headlineElements: QueryList<ElementRef> | undefined;
  @ViewChildren('.sub-headline') subHeadlineElements: QueryList<ElementRef> | undefined;

  constructor(private headlinesService: HeadlinesService, private logger: LoggerService, private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    // Create a map to store the subheadline elements for each headline
    this.subHeadlinesMap = new Map<number, HTMLElement[]>();

    const sectionElements = Array.from(this.el.nativeElement.querySelectorAll('#content > div'));

    this.headlines = sectionElements.map((sectionElement: unknown, index: number) => {
      const element = sectionElement as HTMLElement;
      const title = element.querySelector('.headline')?.innerHTML || '';
      const subHeadlineElements = Array.from(element.querySelectorAll('.sub-headline')) as HTMLElement[];

      // Store the subheadline elements in the map
      this.subHeadlinesMap.set(index, subHeadlineElements);

      const subtitles = subHeadlineElements.map((subHeadlineElement: HTMLElement) => subHeadlineElement.textContent || '');

      return { title, subtitles };
    });

    this.headlineElementsArray = Array.from(this.el.nativeElement.querySelectorAll('.headline'));
    this.subHeadlineElementsArray = Array.from(this.el.nativeElement.querySelectorAll('.sub-headline'));

    setTimeout(() => {
      this.headlinesService.setHeadlines(this.headlines);
    }, 0);
    if (!this.content) return;
    this.renderer.listen(this.content.nativeElement, 'scroll', (event) => this.onContentScroll(event));

  }

  onContentScroll(_event: Event) {
    const { headlineIndex, subHeadlineIndex } = this.calculateHeadlineInViewAndSubHeadlineInView();
    this.headlineInView.emit(headlineIndex);
    this.currentHeadline = headlineIndex;
    this.subHeadlineInView.emit(subHeadlineIndex);
    this.currentSubHeadline = subHeadlineIndex;
  }

  calculateHeadlineInViewAndSubHeadlineInView(): { headlineIndex: number, subHeadlineIndex: number } {
    let headlineIndex = 0;
    let closestSubHeadlineIndex = 0;
    let closestSubHeadlineDistance = Number.MAX_VALUE;

    if (!this.content || !this.headlineElementsArray || !this.subHeadlineElementsArray) {
      return { headlineIndex, subHeadlineIndex: closestSubHeadlineIndex };
    }

    const contentScrollTop = this.content.nativeElement.scrollTop;
    const contentScrollHeight = this.content.nativeElement.scrollHeight;
    const contentClientHeight = this.content.nativeElement.clientHeight;

    // Determine the main headline in view
    for (let i = 0; i < this.headlineElementsArray.length; i++) {
      const headlineElement = this.headlineElementsArray[i];
      const headlinePosition = headlineElement.offsetTop - contentScrollTop;

      if (headlinePosition <= 0) {
        headlineIndex = i - 1;
      } else {
        break;
      }
    }
    // If scrolled to the bottom, set headlineIndex to the last index
    if (contentScrollTop + contentClientHeight >= contentScrollHeight) {
      headlineIndex = this.headlineElementsArray.length - 2;
    }
    const currentSubHeadlineElements = this.subHeadlinesMap.get(headlineIndex) || [];


    // Find the closest subheadline to the top of the viewport
    for (let i = 0; i < currentSubHeadlineElements.length; i++) {
      const subHeadlineElement = currentSubHeadlineElements[i];
      const subHeadlinePosition = subHeadlineElement.offsetTop - contentScrollTop;

      const distance = Math.abs(subHeadlinePosition);
      if (distance < closestSubHeadlineDistance) {
        closestSubHeadlineDistance = distance;
        closestSubHeadlineIndex = i;
      }
    }

    return { headlineIndex, subHeadlineIndex: closestSubHeadlineIndex };
  }

  scrollToHeadline(index: number) {
    if (this.headlineElementsArray.length > index) {
      this.headlineElementsArray[index].scrollIntoView({ behavior: 'smooth', block: "start", inline: "nearest" });
    }
  }

  scrollToSubHeadline({ headlineIndex, subHeadlineIndex }: { headlineIndex: number, subHeadlineIndex: number }) {
    if (this.headlines.length > headlineIndex) {
      const headline = this.headlines[headlineIndex];
      if (headline.subtitles.length > subHeadlineIndex) {
        const subHeadline = this.subHeadlineElementsArray.find((subHeadlineElement: HTMLElement) => subHeadlineElement.textContent === headline.subtitles[subHeadlineIndex]);
        subHeadline?.scrollIntoView({ behavior: 'smooth', block: "start", inline: "nearest" });
      }
    }
  }
}