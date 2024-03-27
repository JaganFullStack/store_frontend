import { Component, Input, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ThemeOptionState } from '../../state/theme-option.state';
import { Option } from '../../interface/theme-option.interface';
import { GetUserDetails } from '../../action/account.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;

  @Input() logo?: string | undefined;

  public style: string = 'basic_header';
  public sticky: boolean = true;

  constructor(router: Router, @Inject(PLATFORM_ID) private platformId: Object, private store: Store) {
    this.setHeader();
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.setHeader();
      }
    });
  }

  ngOnInit(): void {

  }

  setHeader() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      if (window.location.pathname == '/theme/rome') {
        this.style = 'standard_header';
      } else if (window.location.pathname == '/theme/madrid') {
        this.style = 'classic_header';
      } else if (window.location.pathname == '/theme/berlin' || window.location.pathname == '/theme/denver') {
        this.style = 'minimal_header';
      } else {
        this.themeOption$.subscribe(theme => {
          this.style = theme?.header ? theme?.header?.header_options : 'basic_header';
          this.sticky = theme?.header && theme?.header?.sticky_header_enable ? true : this.sticky;
        });
      }
    }
  }

}
