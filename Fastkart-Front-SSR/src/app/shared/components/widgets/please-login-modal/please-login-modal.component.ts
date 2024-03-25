import { Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-please-login-modal',
  templateUrl: './please-login-modal.component.html',
  styleUrls: ['./please-login-modal.component.scss']
})
export class PleaseLoginModalComponent {

  @Output() closeModalEvent = new EventEmitter<void>();
  // @Output() openModalEvent = new EventEmitter<void>();
constructor(private modalService: NgbModal,){
  
}
  closeModal() {
    this.closeModalEvent.emit();

    setTimeout(() => {
      this.modalService.dismissAll();
    }, 1);
  }

  openModal() {
    // this.openModalEvent.emit();
    console.log("error")
    this.modalService.open("Success");
  }

}
