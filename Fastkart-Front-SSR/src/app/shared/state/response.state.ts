import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetRefund, SendRefundRequest } from "../action/refund.action";
import { Refund } from "../interface/refund.interface";
import { RefundService } from "../services/refund.service";
import { FailureResponse, SuccessResponse } from "../action/response.action";

export class ResponseStateModel {
    response = {
        success: {
            load: false,
            content: null,
        },
        failure: {
            load: false,
            content: null,
        },
    }
}

@State<any>({
    name: "response",
    defaults: {
        success: {
            load: false,
            content: null,
        },
        failure: {
            load: false,
            content: null,
        },
    },
})

@Injectable()
export class ResponseSate {

    constructor() { }

    @Selector()
    static sucess(state: any) {
        return state.reponse.sucess;
    }

    @Selector()
    static failure(state: any) {
        return state.reponse.failure;
    }

    @Action(SuccessResponse)
    setSuccessResponse(ctx: StateContext<ResponseStateModel>, action: SuccessResponse) {
        return ctx.patchState({
            response: {
                success: {
                    load: true,
                    content: action.payload,
                },
                failure: {
                    load: false,
                    content: null,
                },

            }
        });
    }

    @Action(FailureResponse)
    setFailureResponse(ctx: StateContext<ResponseStateModel>, action: FailureResponse) {
        return ctx.patchState({
            response: {
                success: {
                    load: false,
                    content: action.payload,
                },
                failure: {
                    load: true,
                    content: action.payload,
                },
            }
        });
    }


}
