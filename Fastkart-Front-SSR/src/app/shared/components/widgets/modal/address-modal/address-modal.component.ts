import { Component, TemplateRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { CreateAddress, UpdateAddress } from '../../../../action/account.action';
import { CountryState } from '../../../../state/country.state';
import { StateState } from '../../../../state/state.state';
import { UserAddress } from '../../../../interface/user.interface';
import * as data from '../../../../data/country-code';
import { convertStringToNumber, getStringDataFromLocalStorage } from 'src/app/utilities/helper';

@Component({
  selector: 'address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss']
})
export class AddressModalComponent {
  cityList: Array<any> = [];
  stateList: Array<any> = [];
  addressTypes: Array<any> = [
    {
      "label": "Billing",
      "value": "Billing"
    },
    {
      "label": "Shipping",
      "value": "Shipping"
    }
  ];

  public form: FormGroup;
  public closeResult: string;
  public modalOpen: boolean = false;

  public states$: Observable<any>;
  public cities$: Observable<any>;
  public address: UserAddress | null;
  public codes = data.countryCodes;

  @ViewChild("addressModal", { static: false }) AddressModal: TemplateRef<string>;
  @Select(CountryState.countries) countries$: Observable<any>;

  constructor(private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store,
    private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      state_id: new FormControl('', [Validators.required]),
      country_id: new FormControl('', [Validators.required]),
      address_type: new FormControl('', [Validators.required]),
      // city: new FormControl('', [Validators.required]),
      city_id: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
      country_code: new FormControl('91', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)])
    })
  }

  fetchState(event: any) {
    if (event && event?.value) {
      this.states$ = this.store
        .select(StateState.states)
        .pipe(map(filtern => filtern(+event.value)));

      if (!this.address)
        this.form.controls['state_id'].setValue('');
    } else {
      this.form.controls['state_id'].setValue('');
    }

  };

  slectedAddressType(event: any) {
    this.form.controls['address_type'].setValue('');
  };

  fetchCity(event: any) {
    if (data && event?.value) {
      this.cities$ = this.store
        .select(CountryState.cities)
        .pipe(map(filtern => filtern(+event.value)));
      if (!this.address)
        this.form.controls['city_id'].setValue('');
    } else {
      this.form.controls['city_id'].setValue('');
    }
  }

  async openModal(value?: UserAddress) {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.modalOpen = true;
      this.patchForm(value);
      this.modalService.open(this.AddressModal, {
        ariaLabelledBy: 'address-add-Modal',
        centered: true,
        windowClass: 'theme-modal modal-lg'
      }).result.then((result) => {
        `Result ${result}`
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }


  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  patchForm(value?: UserAddress) {
    if (value) {
      this.address = value;
      this.form.patchValue({
        user_id: value?.user_id,
        title: value?.title,
        street: value?.street,
        country_id: value?.country_id,
        state_id: value?.state_id,
        city: value?.city,
        pincode: value?.pincode,
        country_code: value?.country_code,
        phone: value?.phone
      });
    } else {
      this.address = null;
      this.form.reset();
      this.form?.controls?.['country_code'].setValue('91');
    }
  }

  submit() {

    this.form.markAllAsTouched();
   
    const user_id = getStringDataFromLocalStorage("user_id");

    let requestObject = {
      user_id: user_id,
      country_id: this.form.value.country_id,
      state_id: this.form.value.state_id,
      city_id: this.form.value.city_id,
      address: this.form.value.street,
      is_default: 1,
      phone: this.form.value.phone,
      address_type: this.form.value.address_type,
      title:this.form.value.title,
      pincode: this.form.value.pincode,
    };

    let action = new CreateAddress(requestObject);

    if (this.address) {
      action = new UpdateAddress(requestObject, this.address.id);
    }

    if (this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => {
          this.form.reset();
          this.ngOnDestroy();
          if (!this.address) {
            this.form?.controls?.['country_code'].setValue('91');
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}
