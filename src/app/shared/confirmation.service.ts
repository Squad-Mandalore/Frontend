import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private title: string;
  private description: string;
  private confirmText: string;
  private cancelText: string;
  private isVisible: boolean;
  private isDelete: boolean;
  private icon: string;
  private confirm;
  private cancel;

  get Title(){
    return this.title;
  }

  get Description(){
    return this.description;
  }

  get ConfirmText() {
    return this.confirmText;
  }

  get CancelText() {
    return this.cancelText;
  }

  get IsVisible(){
    return this.isVisible;
  }

  get IsDelete() {
    return this.isDelete;
  }

  get Icon() {
    return this.icon;
  }

  constructor() {
    this.title = 'Confirmation';
    this.description = 'Confirmation';
    this.confirmText = 'Confirm';
    this.cancelText = 'Cancel';
    this.isVisible = false;
    this.icon = '';
    this.isDelete = false;
    this.cancel = () => {
    };
    this.confirm = () =>{
    };
  }

  show(confirmTitle: string, confirmDescription: string, confirmText: string, cancelText: string, isDelete: boolean, onConfirm: () => void, onCancel: () => void = () => {}) {
    if (this.isVisible) {
      return;
    }
    this.title = confirmTitle;
    this.description = confirmDescription;
    this.confirmText = confirmText;
    this.cancelText = cancelText;
    this.isDelete = isDelete;
    if(this.IsDelete) {
      this.icon = 'delete';
    }
    this.isVisible = true;
    this.cancel = onCancel;
    this.confirm = onConfirm
  }

  Confirm(){
    this.confirm();
    this.isVisible = false;
  }

  Cancel(){
    this.cancel();
    this.isVisible = false;
  }
}
