import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetCities, GetCountries } from "../action/country.action";
import { Country } from "../interface/country.interface";
import { CountryService } from "../services/country.service";

export class CountryStateModel {
  country = {
    data: [] as Country[]
  };
  city = {
    data: []
  };
}

@State<CountryStateModel>({
  name: "country",
  defaults: {
    country: {
      data: []
    },
    city: {
      data: []
    }
  },
})
@Injectable()
export class CountryState {

  constructor(private countryService: CountryService) { }

  @Selector()
  static country(state: CountryStateModel) {
    return state.country;
  }

  @Selector()
  static city(state: any) {
    return state.city;
  }

  @Selector()
  static countries(state: CountryStateModel) {
    return state?.country?.data?.map(cn => {
      return { label: cn?.name, value: cn?.id }
    });
  }

  @Selector()
  static cities(state: any) {
    return (state_id?: any) => {
      if (state_id)
        return state.city.data.filter((element:any) => element.state_id == state_id).map((st:any) => {
          return { label: st?.name, value: st?.id, state_id: st?.state_id }
        });
      else
        return state.state.data.map((st:any) => {
          return { label: st?.name, value: st?.id, state_id: st?.state_id }
        });
    };
  }



  @Action(GetCountries)
  getCountries(ctx: StateContext<CountryStateModel>, action: GetCountries) {
    const state = ctx.getState();

    if (state?.country?.data?.length > 0) {
      // If the country has been already loaded
      // we just break the execution
      return true;
    }
    return this.countryService.getCountries().pipe(
      tap({
        next: result => {
          ctx.patchState({
            country: {
              data: result?.data ? result.data : []
            }
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  };

  @Action(GetCities)
  getCities(ctx: StateContext<CountryStateModel>, action: GetCities) {
    const state = ctx.getState();
    if (state?.city?.data?.length > 0) {
      // If the country has been already loaded
      // we just break the execution
      return true;
    }
    return this.countryService.getCities().pipe(
      tap({
        next: result => {
          ctx.patchState({
            city: {
              data: result.data ? result.data : []
            }
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  };

}
