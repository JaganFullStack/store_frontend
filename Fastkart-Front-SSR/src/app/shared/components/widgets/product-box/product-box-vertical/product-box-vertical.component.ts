import { Component, Input } from '@angular/core';
import { Product } from '../../../../../shared/interface/product.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-box-vertical',
  templateUrl: './product-box-vertical.component.html',
  styleUrls: ['./product-box-vertical.component.scss']
})
export class ProductBoxVerticalComponent {
  apibaseurl:string=environment.apiBaseUrl;
  @Input() product: any;

}
