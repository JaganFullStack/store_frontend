import { Component, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store, Select } from '@ngxs/store';
import { Observable, forkJoin } from 'rxjs';
import { ThemeOptionState } from '../shared/state/theme-option.state';
import { Option } from '../shared/interface/theme-option.interface';
import { GetCategories } from '../shared/action/category.action';
import { ThemeOptionService } from '../shared/services/theme-option.service';
import { GetBlogs } from '../shared/action/blog.action';
import { GetDealProducts } from '../shared/action/product.action';
import { GetUserDetails } from '../shared/action/account.action';
import { GetCities, GetCountries } from '../shared/action/country.action';
import { GetStates } from '../shared/action/state.action';
import { ResponseSate } from '../shared/state/response.state';
import { GetCartItems } from '../shared/action/cart.action';
import { GetWishlist } from '../shared/action/wishlist.action';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  success: any = {};
  failure: any = {};

  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;
  @Select(ThemeOptionState.cookies) cookies$: Observable<boolean>;
  @Select(ThemeOptionState.exit) exit$: Observable<boolean>;
  @Select(ResponseSate.sucess) sucess$: Observable<any>;
  @Select(ResponseSate.failure) failure$: Observable<any>;

  public cookies: boolean;
  public exit: boolean;
  @ViewChild("responseModal", { static: false }) PleaseLoginModalComponent: TemplateRef<any>;

  constructor(private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object,
    public themeOptionService: ThemeOptionService) {

    this.sucess$.subscribe((data) => {
      this.success=data;
    });

    this.failure$.subscribe((data) => {
      this.failure=data;
    });
    this.cookies$.subscribe(res => this.cookies = res);
    this.exit$.subscribe(res => this.exit = res);

    this.themeOptionService.preloader = true;
    this.store.dispatch(new GetUserDetails());


    const getCategories$ = this.store.dispatch(new GetCategories({ status: 1 }));
    const getBlog$ = this.store.dispatch(new GetBlogs({ status: 1, paginate: 10 }));
    const getProduct$ = this.store.dispatch(new GetDealProducts({ status: 1, paginate: 2 }));

    forkJoin([getCategories$, getProduct$]).subscribe({
      complete: () => {
        this.themeOptionService.preloader = false;
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetUserDetails());
    this.store.dispatch(new GetCities());
    this.store.dispatch(new GetCountries());
    this.store.dispatch(new GetStates());
    this.store.dispatch(new GetCartItems());
    this.store.dispatch(new GetWishlist());
  }
  setLogo() {
    var headerLogo;
    var footerLogo;
    var footerClass;
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      if (window.location.pathname == '/home' || window.location.pathname == '/theme/osaka') {
        headerLogo = 'assets/images/logo/1.png';
        footerLogo = 'assets/images/logo/1.png';
      } else if (window.location.pathname == '/theme/tokyo') {
        headerLogo = 'assets/images/logo/2.png';
        footerLogo = 'assets/images/logo/2.png';
      } else if (window.location.pathname == '/theme/rome') {
        headerLogo = 'assets/images/logo/3.png';
        footerLogo = 'assets/images/logo/3.png';
      } else if (window.location.pathname == '/theme/madrid') {
        headerLogo = 'assets/images/logo/4.png';
        footerLogo = 'assets/images/logo/4.png'
        footerClass = 'footer-section-2 footer-color-2'
      } else if (window.location.pathname == '/theme/berlin' || window.location.pathname == '/theme/denver') {
        headerLogo = 'assets/images/logo/6.png';
        footerLogo = 'assets/images/logo/4.png'
        footerClass = 'footer-section-2 footer-color-3'
      } else {
        this.themeOption$.subscribe(theme => {
          headerLogo = theme?.logo?.header_logo?.original_url;
          footerLogo = theme?.logo?.footer_logo?.original_url;
          footerClass = theme?.footer.footer_style === 'dark_mode' ? 'footer-section-2 footer-color-3' : '';
        });
      }
    }
    return { header_logo: headerLogo, footer: { footer_logo: footerLogo, footer_class: footerClass } }
  }

}
