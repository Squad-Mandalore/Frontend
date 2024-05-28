import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AthleteCardComponent } from '../athlete-card/athlete-card.component';
import { RouterModule } from '@angular/router';
import { QuaternaryButtonComponent } from '../buttons/quaternary-button/quaternary-button.component';
import { PrimaryButtonComponent } from '../buttons/primary-button/primary-button.component';
import customFilter from '../../../utils/custom-filter';
import { IconComponent } from '../icon/icon.component';
import { AthleteFullResponseSchema, CsvService, TrainerResponseSchema } from '../../shared/generated';
import { TrainerCardComponent } from '../trainer-card/trainer-card.component';
import { HostListener } from '@angular/core';
import { LoggerService } from '../../shared/logger.service';
import { AlertService } from '../../shared/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AthleteCardComponent, RouterModule, TrainerCardComponent, QuaternaryButtonComponent, PrimaryButtonComponent, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() athletes: AthleteFullResponseSchema[] = [];
  @Input() trainers: TrainerResponseSchema[] = [];
  @Input() type!: "athlete" | "trainer";
  @Input() modals: any = {};
  @Input() isLoading!: boolean;
  windowWidth: number = window.innerWidth;
  searchValue = "";

  constructor(
    private csvService: CsvService,
    private logger: LoggerService,
    private alertService: AlertService,
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = (event.target as Window).innerWidth;
  }

  customFilterCallAthletes(array: any[], options: Object, selectionFullFit:boolean = false){
    return customFilter(array, options, selectionFullFit, "athlete");
  }

  customFilterCallTrainer(array: any[], options: Object, selectionFullFit:boolean = false){
    return customFilter(array, options, selectionFullFit, "athlete");
  }

  triggerAthleteFileDownload() {
    this.csvService.readAthleteCsvCsvAthleteCsvGet().subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'athlete.csv';  // You can dynamically set the filename if needed
        document.body.appendChild(a);
        a.click();  // Trigger a click on the element to download the file

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.alertService.show('Keine Athleten gefunden.', error.error.detail, 'error');
        } else {
          this.alertService.show('Download der CSV-Datei fehlgeschlagen', error.error.detail, 'error');
        }
      },
    })

    this.csvService.readCompletesCsvCsvCompletesCsvGet().subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'completes.csv';  // You can dynamically set the filename if needed
        document.body.appendChild(a);
        a.click();  // Trigger a click on the element to download the file

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.alertService.show('Keine abgeschlossene Übungen gefunden.', error.error.detail, 'error');
        } else {
          this.alertService.show('Download der CSV-Datei fehlgeschlagen', error.error.detail, 'error');
        }
      },
    })
  }

  triggerTrainerFileDownload() {
    this.csvService.readTrainerCsvCsvTrainerCsvGet().subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trainer.csv';  // You can dynamically set the filename if needed
        document.body.appendChild(a);
        a.click();  // Trigger a click on the element to download the file

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.alertService.show('Keine Trainer gefunden.', error.error.detail, 'error');
        } else {
          this.alertService.show('Download der CSV-Datei fehlgeschlagen', error.error.detail, 'error');
        }
      },
    })
  }
}
