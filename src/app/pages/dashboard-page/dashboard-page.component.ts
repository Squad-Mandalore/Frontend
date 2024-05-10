import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarBottomComponent } from '../../components/navbar-bottom/navbar-bottom.component';
import { NgClass, NgFor, NgIf, DatePipe } from '@angular/common';

import { UserCardComponent } from '../../components/user-card/user-card.component';
import { PrimaryButtonComponent } from '../../components/buttons/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../components/buttons/secondary-button/secondary-button.component';
import { QuaternaryButtonComponent } from '../../components/buttons/quaternary-button/quaternary-button.component';
import { IconComponent } from '../../components/icon/icon.component';
import { AthleteCompletesResponseSchema, AthletePatchSchema, AthletePostSchema, AthleteResponseSchema, CompletesResponseSchema, CompletesService, CsvService, ResponseParseCsvFileCsvParsePost, TrainersService } from '../../shared/generated';
import { Subscription } from 'rxjs';
import customSort from '../../../utils/custom-sort';
import customFilter from '../../../utils/custom-filter';
import { calculateProgress, calculateProgressPercent } from '../../../utils/calculate-progress';
import { calculateProgressColor } from '../../../utils/calculate-progress';
import { ConfirmationService } from '../../shared/confirmation.service';
import { AthleteFullResponseSchema } from '../../shared/generated';
import { AthletesService } from '../../shared/generated';
import { AlertService } from '../../shared/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateCompletesComponent } from '../../components/create-completes-modal/create-completes-modal.component';
import { enterLeaveAnimation } from '../../shared/animation';
import { FormGroup } from '@angular/forms';
import { LoggerService } from '../../shared/logger.service';
import { CreateAthleteModalComponent } from '../../components/create-athlete-modal/create-athlete-modal.component';
import { PDFDocument, PDFForm } from 'pdf-lib';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, DatePipe, NavbarBottomComponent, NgIf, NgFor, NgClass, UserCardComponent, PrimaryButtonComponent, SecondaryButtonComponent, QuaternaryButtonComponent, IconComponent, CreateCompletesComponent, CreateAthleteModalComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  animations: [
    enterLeaveAnimation
  ]
})

export class DashboardPageComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private completesService: CompletesService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private athleteService: AthletesService,
    private alertService: AlertService,
    private logger: LoggerService,
    private csvService: CsvService,
    private http: HttpClient,
  ) { }

  athletes: AthleteFullResponseSchema[] = []
  searchValue: string = ""
  selectedAthlete?: AthleteFullResponseSchema;
  isLoading: boolean = true;
  filter: any = {};
  routeSubscription!: Subscription;
  sorting: { property: string, direction: "asc" | "desc" } = { property: 'tracked_at', direction: 'desc' };
  dashArray: number = 525;
  modals = {
    createAthleteModal: {
      isActive: false,
      title: "Neuen Sportler hinzufügen",
      primeButtonText: "Sportler anlegen",
    },
    createCompletesModal: {
      isActive: false,
    },
    showDetails: {
      isActive: false,
    },
    patchAthleteModal: {
      isActive: false,
      title: "Sportler bearbeiten",
      primeButtonText: "Speichern",
    },
  }

  patchAthlete(createAthleteForm: FormGroup) {
    // Get date values from the Form
    const day = createAthleteForm.value.day ?? this.selectedAthlete?.birthday?.split('-')[2];
    const month = createAthleteForm.value.month ?? this.selectedAthlete?.birthday?.split('-')[1];
    const year = createAthleteForm.value.year ?? this.selectedAthlete?.birthday?.split('-')[0];

    // Add Data for the Http-Request for the Backend
    let body: AthletePatchSchema = {
      birthday: year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0'), // Format Birthday for Backend
      ...createAthleteForm.value
    };
    //delete empty fields, so they wont be overwritten
    Object.keys(body).forEach(key => {
      if (body[key as keyof AthletePatchSchema] === "") {
        delete body[key as keyof AthletePatchSchema];
      }
    });

    // Http-Request for Post of the Athlete to the Backend
    this.athleteService.updateAthleteAthletesIdPatch(this.selectedAthlete!.id, body).subscribe({
      // Post Athlete if allowed
      next: (response: AthleteResponseSchema) => {
        this.alertService.show('Athlet aktualisiert', 'Athlet wurde erfolgreich bearbeitet.', 'success');
        this.modals.patchAthleteModal.isActive = false;
        if (response && response.id) {
          this.athleteService.getAthleteFullAthletesIdFullGet(response.id).subscribe({
            // Post Athlete if allowed
            next: (response: AthleteFullResponseSchema) => {
              if (response) {
                this.selectedAthlete = response;
                this.athletes = this.athletes.map(element => element.id === response.id ? response : element);

                //console.log(this.athletes)
              }
            },
            // Deny Athlete if Backend send Http-Error
            error: (error) => {
              if (error.status == 422) {
                this.alertService.show('Erstellung fehlgeschlagen', 'Benutzername ist nicht verfügbar.', "error");
              } else {
                this.alertService.show('Erstellung fehlgeschlagen', 'Bei der Erstellung ist etwas schief gelaufen', "error");
              }
            }
          })
        }
      },
      // Deny Athlete if Backend send Http-Error
      error: (error) => {
        if (error.status == 422) {
          this.alertService.show('Erstellung fehlgeschlagen', 'Benutzername ist nicht verfügbar.', "error");
        } else {
          this.alertService.show('Erstellung fehlgeschlagen', 'Bei der Erstellung ist etwas schief gelaufen', "error");
        }
      }
    })
  }
  createAthlete(createAthleteForm: FormGroup) {
    if (createAthleteForm.invalid) {
      this.logger.error("Form invalid");
      return;
    }
    // Get date values from the Form
    const day = createAthleteForm.value.day!;
    const month = createAthleteForm.value.month!;
    const year = createAthleteForm.value.year!;

    // Add Data for the Http-Request for the Backend
    const body: AthletePostSchema = {
      birthday: year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0'), // Format Birthday for Backend
      ...createAthleteForm.value
    };

    // Http-Request for Post of the Athlete to the Backend
    this.athleteService.createAthleteAthletesPost(body).subscribe({
      // Post Athlete if allowed
      next: (response: AthleteResponseSchema) => {
        this.alertService.show('Athlet erstellt', 'Athlet wurde erfolgreich erstellt.', 'success');
        this.modals.createAthleteModal.isActive = false;
        if (response && response.id) {
          this.athleteService.getAthleteFullAthletesIdFullGet(response.id).subscribe({
            // Post Athlete if allowed
            next: (response: AthleteFullResponseSchema) => {
              if (response) {
                this.athletes.push(response)
                //console.log(this.athletes)
              }
            },
            // Deny Athlete if Backend send Http-Error
            error: (error) => {
              if (error.status == 422) {
                this.alertService.show('Erstellung fehlgeschlagen', 'Benutzername ist nicht verfügbar.', "error");
              } else {
                this.alertService.show('Erstellung fehlgeschlagen', 'Bei der Erstellung ist etwas schief gelaufen', "error");
              }
            }
          })
        }
      },
      // Deny Athlete if Backend send Http-Error
      error: (error) => {
        if (error.status == 422) {
          this.alertService.show('Erstellung fehlgeschlagen', 'Benutzername ist nicht verfügbar.', "error");
        } else {
          this.alertService.show('Erstellung fehlgeschlagen', 'Bei der Erstellung ist etwas schief gelaufen', "error");
        }
      }
    })
  }

  csvParse(file: File) {
    this.csvService.parseCsvFileCsvParsePost(file).subscribe({
      next: (response: ResponseParseCsvFileCsvParsePost) => {
        let arr: string[] = Object.keys(response).map(key => `${key}: ${response[key as keyof typeof response]}`);
        let str: string = arr.join('\n');
        this.gnNoTini();
        this.alertService.show('CSV-Daten erfolgreich hinzugefügt', str, 'success');
        // important because you havent typed modals properly
        this.modals.showDetails.isActive = false;
        this.modals.patchAthleteModal.isActive = false;
        this.modals.createAthleteModal.isActive = false;
        this.modals.createCompletesModal.isActive = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Hochladen der CSV-Datei fehlgeschlagen', error.error.detail, 'error');
      },
    })
  }

  setSorting(property: string) {
    if (this.sorting.property === property) {
      this.sorting.direction = this.sorting.direction === "asc" ? "desc" : "asc";
      return
    }

    this.sorting.property = property;
    this.sorting.direction = "desc";
  }

  customSortCall(array: AthleteCompletesResponseSchema[], sortSettings: { property: string, direction: string }) {
    return array.sort((a: any, b: any) => customSort(a, b, sortSettings, "athlete"));
  }

  deleteAthlete(athlete: AthleteFullResponseSchema | null) {
    this.confirmationService.show(
      'Benutzer wirklich löschen?',
      'Mit dieser Aktion wird der ausgewählte Benutzer unwiderruflich gelöscht.',
      'Benutzer löschen',
      'Abbrechen',
      true,
      () => {
        if (!athlete) return;
        this.athleteService.deleteAhtleteAthletesIdDelete(athlete.id).subscribe({
          next: () => {
            this.alertService.show('Athlet erfolgreich gelöscht', 'Der Athlet wurde erfolgreich entfernt', "success");
            this.athletes = this.athletes.filter(element => element.id !== athlete.id);
            this.selectedAthlete = undefined;
            this.modals.showDetails.isActive = false;
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.show('Löschen fehlgeschlagen', 'Bitte probiere es später erneut', "error");
          }
        })
      }
    );
  }

  deleteCompletedExercise(completes: CompletesResponseSchema) {
    if (!completes || !this.selectedAthlete) return;
    this.confirmationService.show(
      'Leistung wirklich löschen?',
      'Mit dieser Aktion wird die ausgewählte Leistung unwiderruflich gelöscht.',
      'Leistung löschen',
      'Abbrechen',
      true,
      () => {
        this.completesService.deleteAhtleteCompletesDelete(completes.exercise.id, this.selectedAthlete!.id, completes.tracked_at).subscribe({
          next: () => {
            this.alertService.show('Übung erfolgreich gelöscht', 'Die Übung wurde erfolgreich entfernt', "success");
            if (this.selectedAthlete?.completes) {
              this.selectedAthlete.completes = this.selectedAthlete?.completes.filter(element => !(element.exercise.id === completes.exercise.id && element.tracked_at === completes.tracked_at));
            }
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.show('Löschen fehlgeschlagen', 'Bitte probiere es später erneut', "error");
          }
        })
      }
    )
  }

  async createPDF(athleteId: string = '') {
    // Load the PDF
    this.http.get('/assets/pdfs/einzelpruefkarte.pdf', { responseType: 'blob' }).subscribe((file: Blob) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const pdfBytes = new Uint8Array(reader.result as ArrayBuffer);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        // Fill the form with sample data
        if (!await this.fillPDF(form, athleteId)) {
          return;
        }

        // Save and download the filled PDF
        const filledPdfBytes = await pdfDoc.save();
        const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'filled-form.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.alertService.show('PDF erstellt', 'Die PDF wurde erfolgreich erstellt.', 'success');
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async fillPDF(form: PDFForm, athleteId: string = '') {
    if (this.selectedAthlete) {
      const { totalPoints, globalMedal, hasMedalInEachCategory, categoryPoints } = this.calculateGlobalMedal(this.selectedAthlete.completes);
      if (!hasMedalInEachCategory) {
        this.alertService.show('Fehler', 'Der Athlet hat nicht in jeder Kategorie eine Medaille.', 'error');
        return false;
      }
      // PDF Header
      await this.fillPDFHeader(form);

      // Ausdauer
      await this.fillPDFAusdauer(form, categoryPoints);
      // Kraft
      await this.fillPDFKraft(form, categoryPoints);
      // Schnelligkeit
      await this.fillPDFSchnelligkeit(form, categoryPoints);
      // Koordination
      await this.fillPDFKoordination(form, categoryPoints);

      // Footer
      await this.fillPDFFooter(form, totalPoints, globalMedal);

      if (athleteId) {
        form.getTextField('Ident-Nr. 6').setText(athleteId);
        form.getTextField('Ident-Nr. 5').setText(athleteId);
        form.getTextField('Ident-Nr. 4').setText(athleteId);
        form.getTextField('Ident-Nr. 3').setText(athleteId);
        form.getTextField('Ident-Nr. 2').setText(athleteId);
        form.getTextField('Ident-Nr. 1').setText(athleteId);
      }
      return true;
    }
    this.alertService.show('Fehler', 'Kein Athlet gefunden.', 'error');
    return false

  }

  async fillPDFHeader(form: PDFForm) {
    if (!this.selectedAthlete) return;
    form.getTextField('Nachname').setText(this.selectedAthlete.lastname ?? 'Kein');
    form.getTextField('Vorname').setText(this.selectedAthlete.firstname ?? 'Name');
    const currentYear = new Date().getFullYear();
    const birthYear = this.selectedAthlete.birthday?.split('-')[0];
    const age = currentYear - Number(birthYear);
    form.getTextField('Alter das im Kalenderjahr erreicht wird').setText(age.toString());
    form.getTextField('Geschlecht w  m').setText(this.selectedAthlete.gender === 'm' ? 'm' : 'w');
    const year = currentYear.toString().slice(-2);
    form.getTextField('0').setText(year);
    const ttmmjjjj = this.selectedAthlete.birthday?.split('-').reverse().join('') ?? '';
    form.getTextField('TTMMJJJJ').setText(ttmmjjjj);
    const email = this.selectedAthlete.email ?? 'E-Mail';
    form.getTextField('Telefon / E-Mail').setText(`+49 XXX XXXXXXX / ${email}`);
  }

  async fillPDFAusdauer(form: PDFForm, categoryPoints: any) {
    const ausdauerCompleteName = categoryPoints['Ausdauer']?.complete?.exercise.title.toLowerCase().replace(/\s+/g, '');
    const ausdauerResult = categoryPoints['Ausdauer']?.complete?.result ?? '';
    const [hours, minutes, seconds, milliseconds] = ausdauerResult.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const formattedResult = `${totalMinutes}, ${seconds}`;

    if (ausdauerCompleteName.includes('laufen')) {
      form.getTextField('Wert').setText(formattedResult);
    } else if (ausdauerCompleteName.includes('10kmlauf')) {
      form.getTextField('Wert_2').setText(formattedResult);
    } else if (ausdauerCompleteName.includes('dauer-/geländelauf')) {
      form.getTextField('Wert_3').setText(formattedResult);
    } else if (ausdauerCompleteName.includes('7,5kmwalking/nordicwalking')) {
      form.getTextField('Wert_4').setText(formattedResult);
    } else if (ausdauerCompleteName.includes('schwimmen')) {
      form.getTextField('Wert_5').setText(formattedResult);
    } else if (ausdauerCompleteName.includes('radfahren')) {
      form.getTextField('Wert_6').setText(formattedResult);
    } else {
      this.alertService.show('Warnung', 'Ausdauer-Wert konnte nicht zugeordnet werden.', 'error');
    }

    form.getTextField('Punkte Ausdauer').setText(categoryPoints['Ausdauer']?.points?.toString() ?? '0');
    const trackedAt = categoryPoints['Ausdauer']?.complete?.tracked_at ?? '';
    const germanDate = new Date(trackedAt).toLocaleDateString('de-DE');
    form.getTextField('Datum_1').setText(germanDate);
  }

  async fillPDFKraft(form: PDFForm, categoryPoints: any) {
    const kraftCompleteName = categoryPoints['Kraft']?.complete?.exercise.title.toLowerCase().replace(/\s+/g, '');
    const kraftResult = categoryPoints['Kraft']?.complete?.result ?? '';
    let formattedResult = '';

    if (kraftCompleteName.includes('gerätturnen')) {
      form.getTextField('Übung 627').setText(kraftResult);
    } else {
      const [km, mmm, cmcm] = kraftResult.split(':');
      const totalMeters = parseInt(km) * 1000 + parseInt(mmm) * 100 + parseInt(cmcm);
      formattedResult = `${totalMeters}, ${cmcm}`;

      if (kraftCompleteName.includes('schlagball/wurfball')) {
        form.getTextField('Wert_7').setText(formattedResult);
      } else if (kraftCompleteName.includes('medizinball')) {
        form.getTextField('Wert_8').setText(formattedResult);
      } else if (kraftCompleteName.includes('kugelstoßen')) {
        form.getTextField('Wert_9').setText(formattedResult);
      } else if (kraftCompleteName.includes('steinstoßen')) {
        form.getTextField('Wert_10').setText(formattedResult);
      } else if (kraftCompleteName.includes('standweitsprung')) {
        form.getTextField('Wert_11').setText(formattedResult);
      } else {
        this.alertService.show('Warnung', 'Kraft-Wert konnte nicht zugeordnet werden.', 'error');
      }
    }

    form.getTextField('Punkte Kraft').setText(categoryPoints['Kraft']?.points?.toString() ?? '0');
    const trackedAt = categoryPoints['Kraft']?.complete?.tracked_at ?? '';
    const germanDate = new Date(trackedAt).toLocaleDateString('de-DE');
    form.getTextField('Datum_2').setText(germanDate);
  }

  async fillPDFSchnelligkeit(form: PDFForm, categoryPoints: any) {
    const schnellCompleteName = categoryPoints['Schnelligkeit']?.complete?.exercise.title.toLowerCase().replace(/\s+/g, '');
    const schnellResult = categoryPoints['Schnelligkeit']?.complete?.result ?? '';
    let formattedResult = '';

    if (schnellCompleteName.includes('gerätturnen')) {
      form.getTextField('Übung 634').setText(schnellResult);
    } else {
      const [hh, mm, ss, msmsms] = schnellResult.split(':');
      const totalSeconds = parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(ss) + parseInt(msmsms.slice(0, 2)) / 1000;
      formattedResult = `${totalSeconds}, ${msmsms.slice(0, 2)}`;

      if (schnellCompleteName.includes('laufen')) {
        form.getTextField('Wert_12').setText(formattedResult);
      } else if (schnellCompleteName.includes('schwimmen')) {
        form.getTextField('Wert_13').setText(formattedResult);
      } else if (schnellCompleteName.includes('radfahren')) {
        form.getTextField('Wert_14').setText(formattedResult);
      } else {
        this.alertService.show('Warnung', 'Schnelligkeit-Wert konnte nicht zugeordnet werden.', 'error');
      }
    }

    form.getTextField('Punkte Schnelligkeit').setText(categoryPoints['Schnelligkeit']?.points?.toString() ?? '0');
    const trackedAt = categoryPoints['Schnelligkeit']?.complete?.tracked_at ?? '';
    const germanDate = new Date(trackedAt).toLocaleDateString('de-DE');
    form.getTextField('Datum_3').setText(germanDate);
  }

  async fillPDFKoordination(form: PDFForm, categoryPoints: any) {
    const koordinationCompleteName = categoryPoints['Koordination']?.complete?.exercise.title.toLowerCase().replace(/\s+/g, '');
    const koordinationResult = categoryPoints['Koordination']?.complete?.result ?? '';
    let formattedResult = '';

    if (koordinationCompleteName.includes('hochsprung') || (koordinationCompleteName.includes('weitsprung') && !koordinationCompleteName.includes('zonenweitsprung')) || koordinationCompleteName.includes('schleuderball')) {
      const [km, mmm, cmcm] = koordinationResult.split(':');
      const totalMeters = parseInt(km) * 1000 + parseInt(mmm) * 100 + parseInt(cmcm);
      formattedResult = `${totalMeters}, ${cmcm}`;
    } else {
      formattedResult = koordinationResult;
    }

    if (koordinationCompleteName.includes('hochsprung')) {
      form.getTextField('Wert_15').setText(formattedResult);
    } else if (koordinationCompleteName.includes('zonenweitsprung')) {
      form.getTextField('Wert_17').setText(formattedResult.replace(/^0+/, ''));
    } else if (koordinationCompleteName.includes('weitsprung')) {
      form.getTextField('Wert_16').setText(formattedResult);
    } else if (koordinationCompleteName.includes('drehwurf')) {
      form.getTextField('Wert_18').setText(formattedResult.replace(/^0+/, ''));
    } else if (koordinationCompleteName.includes('schleuderball')) {
      form.getTextField('Wert_19').setText(formattedResult);
    } else if (koordinationCompleteName.includes('seilspringen')) {
      form.getTextField('Übung').setText(categoryPoints['Koordination']?.complete?.exercise.title.replace('Seilspringen ', '') ?? '');
      form.getTextField('Anzahl 2').setText(formattedResult.replace(/^0+/, ''));
    } else if (koordinationCompleteName.includes('gerätturnen')) {
      form.getTextField('Übung 647').setText(formattedResult);
    } else {
      this.alertService.show('Warnung', 'Koordination-Wert konnte nicht zugeordnet werden.', 'error');
    }

    form.getTextField('Punkte Koordination').setText(categoryPoints['Koordination']?.points?.toString() ?? '0');
    const trackedAt = categoryPoints['Koordination']?.complete?.tracked_at ?? '';
    const germanDate = new Date(trackedAt).toLocaleDateString('de-DE');
    form.getTextField('Datum_4').setText(germanDate);
  }

  async fillPDFFooter(form: PDFForm, totalPoints: number, globalMedal: string) {
    if (!this.selectedAthlete) return;
    if (this.selectedAthlete.certificates?.length) {
      form.getCheckBox('Nachweis der Schwimmfertigkeit liegt vor').check();
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    form.getTextField('Ausstellungsdatum').setText(formattedDate);
    const currentYear = new Date().getFullYear();
    const birthYear = this.selectedAthlete.birthday?.split('-')[0];
    const age = currentYear - Number(birthYear);
    if (age < 18) {
      form.getCheckBox('Kinder und Jugendliche').check();
    }
    else {
      form.getCheckBox('Erwachsene Gültigkeitsdauer bei Erwachsenen auf 5 Jahre begrenzt').check();
    }

    form.getTextField('GESAMTPUNKTZAHL').setText(totalPoints.toString());
    switch (globalMedal) {
      case 'gold':
        form.getCheckBox('Gold').check();
        break;
      case 'silver':
        form.getCheckBox('Silber').check();
        break;
      case 'bronze':
        form.getCheckBox('Bronze').check();
        break;
      default:
        break;
    }
  }
  
  calculateGlobalMedal(completes: CompletesResponseSchema[]) {
    const categories = ['Ausdauer', 'Kraft', 'Schnelligkeit', 'Koordination'];
    const medalsAndPoints = categories.map((category, index) => {
      const result = this.calculateCategoryMedalAndPoints(category, completes);
      return { ...result, category: categories[index] };
    });
    const hasMedalInEachCategory = medalsAndPoints.every(({ medal }) => medal !== 'none');
    if (!hasMedalInEachCategory) {
      return { totalPoints: 0, globalMedal: 'none', hasMedalInEachCategory: false, categoryPoints: {} };
    }
    const points = medalsAndPoints.map(({ points }) => points);
    const totalPoints = points.reduce((sum, point) => sum + point, 0);
    let globalMedal = 'none';
    if (totalPoints >= 11) {
      globalMedal = 'gold';
    } else if (totalPoints >= 8) {
      globalMedal = 'silver';
    } else if (totalPoints >= 4) {
      globalMedal = 'bronze';
    }
    const categoryPoints: { [key: string]: { points: number, complete: CompletesResponseSchema } } = {};
    medalsAndPoints.forEach(({ category, points, complete }) => {
      categoryPoints[category] = { points, complete };
    });
    return { totalPoints, globalMedal, hasMedalInEachCategory: true, categoryPoints };
  }

  calculateCategoryMedalAndPoints(category: string, completes: CompletesResponseSchema[]) {
    const currentYear = new Date().getFullYear();
    const completesThisYear = completes.filter(complete => new Date(complete.tracked_at).getFullYear() === currentYear);
    if (completesThisYear.length === 0) return { medal: 'none', points: 0, complete: null };
    const filteredCompletes = this.customFilterCall(completesThisYear, { category: { filterValue: category, valueFullFit: true } }, true);
    const goldCompletes = filteredCompletes.filter(complete => complete.points.toString() === '3');
    const silverCompletes = filteredCompletes.filter(complete => complete.points.toString() === '2');
    const bronzeCompletes = filteredCompletes.filter(complete => complete.points.toString() === '1');
    let medal = 'none';
    let points = 0;
    let bestComplete = null;
    if (goldCompletes.length) {
      medal = 'gold';
      points = 3;
      bestComplete = goldCompletes.reduce((latest, complete) => {
        const completeDate = new Date(complete.tracked_at);
        return completeDate > new Date(latest.tracked_at) ? complete : latest;
      });
    } else if (silverCompletes.length) {
      medal = 'silver';
      points = 2;
      bestComplete = silverCompletes.reduce((latest, complete) => {
        const completeDate = new Date(complete.tracked_at);
        return completeDate > new Date(latest.tracked_at) ? complete : latest;
      });
    } else if (bronzeCompletes.length) {
      medal = 'bronze';
      points = 1;
      bestComplete = bronzeCompletes.reduce((latest, complete) => {
        const completeDate = new Date(complete.tracked_at);
        return completeDate > new Date(latest.tracked_at) ? complete : latest;
      });
    }
    return { medal, points, complete: bestComplete };
  }

  calculateCategoryMedal(category: string, completes: CompletesResponseSchema[]) {
    const currentYear = new Date().getFullYear();
    const completesThisYear = completes.filter(complete => new Date(complete.tracked_at).getFullYear() === currentYear);
    if (completes.length === 0) return 'none';
    const numberGoldMedals = this.customFilterCall(completesThisYear, { category: { filterValue: category, valueFullFit: true }, points: { filterValue: '3', valueFullFit: true } }, true).length;
    const numberSilverMedals = this.customFilterCall(completes, { category: { filterValue: category, valueFullFit: true }, points: { filterValue: '2', valueFullFit: true } }, true).length;
    const numberBronzeMedals = this.customFilterCall(completes, { category: { filterValue: category, valueFullFit: true }, points: { filterValue: '1', valueFullFit: true } }, true).length;
    if (numberGoldMedals) return 'gold';
    if (numberSilverMedals) return 'silver';
    if (numberBronzeMedals) return 'bronze';
    return 'none';
  }

  getActiveFilters() {
    let counter = 0;
    for (const [key, value] of Object.entries(this.filter)) {
      if (this.filter[key] && this.filter[key].filterValue) counter++;
    }
    return counter;
  }

  getTrackingDates(completes: AthleteCompletesResponseSchema[]) {
    const trackingDates: string[] = [];
    for (const result of completes) {
      if (!trackingDates.find(date => date === result.tracked_at)) trackingDates.push(result.tracked_at.toString());
    }
    return trackingDates;
  }

  getTrackingTrainers(completes: AthleteCompletesResponseSchema[]) {
    const trackingTrainers: string[] = [];
    for (const result of completes) {
      if (!trackingTrainers.find(trainer => trainer === result.trainer.firstname + ' ' + result.trainer.lastname)) trackingTrainers.push(result.trainer.firstname + ' ' + result.trainer.lastname);
    }
    return trackingTrainers;
  }

  setFilter(key: string, value: any, valueFullFit: boolean = true) {
    this.filter[key] = {
      filterValue: this.filter[key] && this.filter[key].filterValue == value ? "" : value,
      valueFullFit: valueFullFit,
    }
  }

  customFilterCall(array: any[], options: Object, selectionFullFit: boolean) {
    return customFilter(array, options, selectionFullFit, "athlete");
  }

  getProgress(completes: AthleteCompletesResponseSchema[]) {
    return calculateProgress(completes);
  }

  getColorVariable(completes: AthleteCompletesResponseSchema[]) {
    return calculateProgressColor(completes);
  }

  dashOffset(athlete: AthleteFullResponseSchema): number {
    const progressDecimal = calculateProgressPercent(athlete.completes) / 100;
    return this.dashArray * (1 - progressDecimal);
  }

  gnNoTini(): void {
    this.athletes.length = 0;
    this.athleteService.getAllAthletesAthletesGet().subscribe({
      next: (athletes: AthleteResponseSchema[]) => {
        for (const athlete of athletes) {
          this.athleteService.getAthleteFullAthletesIdFullGet(athlete.id).subscribe({
            next: (fullAthleteObject: AthleteFullResponseSchema) => {
              if (this.selectedAthlete?.id === fullAthleteObject.id) {
                this.selectedAthlete = fullAthleteObject;
              }
              this.athletes.push(fullAthleteObject);
            },
            error: (error: HttpErrorResponse) => {
              this.alertService.show('Abfragen der Athleten fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
            }
          })
        }
        // this.selectedAthlete = tempAthlete;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.show('Abfragen der Athleten fehlgeschlagen', 'Bitte probiere es später nochmal', "error");
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    if (this.athletes.length === 0) {
      this.gnNoTini();
    }
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const athleteId = params['id'];
      if (athleteId) {
        this.selectedAthlete = this.athletes.filter(element => element.id == athleteId)[0];
        if (!this.selectedAthlete) {
          this.router.navigate(['/athleten']);
        }
      }
    })
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
