import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AccountUser } from "../../../shared/interface/account.interface";
import { AccountState } from '../../../shared/state/account.state';
import { DeleteAddress, GetUserDetails } from '../../../shared/action/account.action';
import { AddressModalComponent } from '../../../shared/components/widgets/modal/address-modal/address-modal.component';
import { DeleteModalComponent } from '../../../shared/components/widgets/modal/delete-modal/delete-modal.component';
import { UserAddress } from '../../../shared/interface/user.interface';
import { GetCities, GetCountries } from 'src/app/shared/action/country.action';
import { GetStates } from 'src/app/shared/action/state.action';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/shared/services/account.service';
import { mockResponseData } from 'src/app/utilities/helper';
import { PleaseLoginModalComponent } from 'src/app/shared/components/widgets/please-login-modal/please-login-modal.component';
import { FailureResponse } from 'src/app/shared/action/response.action';

@Component({
  selector: 'app-adresses',
  templateUrl: './adresses.component.html',
  styleUrls: ['./adresses.component.scss']
})
export class AdressesComponent implements OnInit {

  @Select(AccountState.user) user$: Observable<any>;

  @ViewChild("addressModal") AddressModal: AddressModalComponent;
  @ViewChild("deleteModal") DeleteModal: DeleteModalComponent;

  constructor(private store: Store, private modalService: NgbModal, private sas: AccountService) { }

  ngOnInit(): void {
    this.store.dispatch(new GetCountries());
    this.store.dispatch(new GetStates());
    this.store.dispatch(new GetCities());
  }



  delete(action: string, data: UserAddress) {
    if (action === 'delete') {
      this.sas.UserAddressDelete(data.id).subscribe({
        next: result => {
          this.store.dispatch(new GetUserDetails());
          // const mockMessageObject = mockResponseData(result.messageobject);
        },
        error: error => {
          const messageObject = mockResponseData(error?.error.messageobject);
          console.log(messageObject?.message);
          this.store.dispatch(new FailureResponse(messageObject));
        }
      });
    }
    this.modalService.dismissAll();
  }



}
