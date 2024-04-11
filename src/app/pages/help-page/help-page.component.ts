import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
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
  headlines: { title: string, subtitles: string[] }[] = [];
  headlineElementsArray: HTMLElement[] = [];
  subHeadlineElementsArray: HTMLElement[] = [];

  @ViewChildren('.headline') headlineElements: QueryList<ElementRef> | undefined;
  @ViewChildren('.sub-headline') subHeadlineElements: QueryList<ElementRef> | undefined;

  constructor(private headlinesService: HeadlinesService, private logger: LoggerService, private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const sectionElements = Array.from(this.el.nativeElement.querySelectorAll('#content > div'));

    this.headlines = sectionElements.map((sectionElement: unknown) => {
      const element = sectionElement as HTMLElement;
      const title = element.querySelector('.headline')?.innerHTML || '';
      const subHeadlineElements = element.querySelectorAll('.sub-headline');
      const subtitles = Array.from(subHeadlineElements).map((subHeadlineElement: Element) => subHeadlineElement.textContent || '');

      return { title, subtitles };
    });

    this.headlineElementsArray = Array.from(this.el.nativeElement.querySelectorAll('.headline'));
    this.subHeadlineElementsArray = Array.from(this.el.nativeElement.querySelectorAll('.sub-headline'));

    this.logger.info(`Headlines: ${this.headlines.map(h => h.title)}, SubHeadlines: ${this.headlines.flatMap(h => h.subtitles)}`);
    this.headlinesService.setHeadlines(this.headlines);
  }

  scrollToHeadline(index: number) {
    if (this.headlineElementsArray.length > index) {
      this.headlineElementsArray[index].scrollIntoView({ behavior: 'smooth', block: "start", inline: "nearest"});
    }
  }

scrollToSubHeadline({headlineIndex, subHeadlineIndex}: {headlineIndex: number, subHeadlineIndex: number}) {
    if (this.headlines.length > headlineIndex) {
        const headline = this.headlines[headlineIndex];
        if (headline.subtitles.length > subHeadlineIndex) {
            const subHeadline = this.subHeadlineElementsArray.find((subHeadlineElement: HTMLElement) => subHeadlineElement.textContent === headline.subtitles[subHeadlineIndex]);
            subHeadline?.scrollIntoView({ behavior: 'smooth', block: "start", inline: "nearest"});
        }
    }
}
}