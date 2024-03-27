import { Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { content } from 'src/app/shared/routes/routes';
import { ResponseSate } from 'src/app/shared/state/response.state';

@Component({
  selector: 'app-please-login-modal',
  templateUrl: './please-login-modal.component.html',
  styleUrls: ['./please-login-modal.component.scss']
})
export class PleaseLoginModalComponent {
  displayMessage: string = '';
  successData: any;
  failureData: any;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Select(ResponseSate.sucess) sucess$: Observable<any>;
  @Select(ResponseSate.failure) failure$: Observable<any>;
  @Output() openModalEvent = new EventEmitter<void>();

  constructor(private modalService: NgbModal,) {
    this.sucess$.subscribe((data) => {
      this.successData = data;
      if (data?.load) {
        setTimeout(() => {
          this.modalService.dismissAll();
        }, 3);
      }
    });

    this.failure$.subscribe((data) => {
      this.failureData = data;
      if (data?.load) {
        setTimeout(() => {
          this.modalService.dismissAll();
        }, 3);
      }
    });

  }
  closeModal() {
    this.closeModalEvent.emit();

    setTimeout(() => {
      this.modalService.dismissAll();
    }, 3);
  }

  openModal() {
    this.openModalEvent.emit();
    this.modalService.open(this.displayMessage);
  }

}
