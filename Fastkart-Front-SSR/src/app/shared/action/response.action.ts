
export class SuccessResponse {
    static readonly type = "[Response] Success";
    constructor(public payload?: any) {}
  }
  
  export class FailureResponse {
    static readonly type = "[Response] Failure";
    constructor(public payload?: any) {}
  }
  