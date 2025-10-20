import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertTitle: string;
  private alertDescription: string;
  private type: 'success' | 'error';
  private isVisible: boolean
  private closeAlert;
  private timeout!: ReturnType<typeof setTimeout>;

  get Title(){
    return this.alertTitle;
  }

  get Description(){
    return this.alertDescription;
  }

  get Type() {
    return this.type;
  }

  get IsVisible(){
    return this.isVisible;
  }

  constructor() {
    this.type = 'success';
    this.alertTitle = 'Alert';
    this.alertDescription = 'Alert';
    this.isVisible = false;
    this.closeAlert = () => {
      clearTimeout(this.timeout);
      this.isVisible = false;
    }
  }

  show(alertTitle: string, alertDescription: string, alertType: 'success' | 'error', ms: number = 4000) {
    if (this.isVisible) {
        return;
    }
    this.type = alertType;
    this.alertTitle = alertTitle;
    this.alertDescription = alertDescription;
    this.isVisible = true;
    this.timeout = setTimeout(this.closeAlert, ms);
  }

  hide(){
    this.closeAlert();
  }
}
