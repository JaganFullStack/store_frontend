import { Component, Input, ViewChild } from '@angular/core';
import { Link } from '../../../../../shared/interface/theme-option.interface';
import { getStringDataFromLocalStorage } from 'src/app/utilities/helper';
import { DealsModalComponent } from '../../../widgets/modal/deals-modal/deals-modal.component';
import { PleaseLoginModalComponent } from '../../../widgets/please-login-modal/please-login-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent {
  
  @Input() links: Link[] = [];
  constructor(private modalService: NgbModal) {}

  @ViewChild("dealsModal") DealsModal: DealsModalComponent;


  ngOnInit() {
    this.checkUserId();
  }
  checkUserId(): any {
    const userToken = getStringDataFromLocalStorage("user_token");
    const userId = getStringDataFromLocalStorage("user_id");
    return !!userId&&userToken; 
  }

  openModal() {
    const modalRef = this.modalService.open(PleaseLoginModalComponent, { centered: true });
    modalRef.componentInstance.closeModalEvent.subscribe(() => {
      modalRef.close();
    });
  }

  
}
