import { strings } from "./strings";

const mockResponseData = (errorObject: any) => {

    let object;

    if (errorObject?.status === 500) {
        object = {
            statusCode: errorObject.status,
            message: errorObject.error.messages.error ?? strings.commonErrors.systemError,
            title: errorObject.error.title ?? strings.commonErrors.systemError,
            property: errorObject.error.property ?? strings.commonErrors.systemError
        }
    } else if (errorObject?.status === 400) {
        object = {
            statusCode: errorObject.status,
            message: errorObject.error.messages.error ?? strings.commonErrors.failed,
            title: errorObject.error.title ?? strings.commonErrors.failed,
            property: errorObject.error.property ?? strings.commonErrors.failed
        }
    } else if (errorObject?.status === 401) {
        object = {
            statusCode: errorObject.status,
            message: errorObject.error.messages.error ?? strings.commonErrors.unauthorize,
            title: errorObject.error.title ?? strings.commonErrors.unauthorize,
            property: errorObject.error.property ?? strings.commonErrors.unauthorize
        }
    } else if (errorObject?.status === 404) {
        object = {
            statusCode: errorObject.status,
            message: strings.commonErrors.somethingWrong,
            title: strings.commonErrors.somethingWrong,
            property: strings.commonErrors.somethingWrong
        }
    } else if (errorObject?.errorCode === 200) {
        object = {
            statusCode: errorObject.errorCode,
            message: errorObject.messages.error ?? strings.commonErrors.success,
            title: errorObject.title ?? strings.commonErrors.success,
            property: errorObject.property ?? strings.commonErrors.success
        }
    } else if (errorObject?.errorCode === 204) {
        object = {
            statusCode: errorObject.status,
            message: errorObject.messages.error ?? strings.commonErrors.success,
            title: errorObject.title ?? strings.commonErrors.success,
            property: errorObject.property ?? strings.commonErrors.success
        }
    }

    return object;
};

const defaultError = () => {
    return {
        statusCode: 500,
        message: strings.commonErrors.somethingWrong,
        title: strings.commonErrors.somethingWrong,
        property: strings.commonErrors.somethingWrong
    };
};

const getStringDataFromLocalStorage =  (key: string) => {
    return  localStorage.getItem(key) || '';
};

const getObjectDataFromLocalStorage = (key: string) => {
    const stringData = localStorage.getItem(key) || '';
    return JSON.parse(stringData);
};

const storeObjectDataInLocalStorage = (key: string, value: object) => {
    return localStorage.setItem(key, JSON.stringify(value));
};

const storeStringDataInLocalStorage = (key: string, value: string) => {
    return localStorage.setItem(key, value);
};

const removeDataFromLocalStorage = (key: string) => {
    return localStorage.removeItem(key);
};

const clearLocalStorage = () => {
    return localStorage.clear();
};


export {
    mockResponseData,
    getStringDataFromLocalStorage,
    getObjectDataFromLocalStorage,
    storeObjectDataInLocalStorage,
    storeStringDataInLocalStorage,
    removeDataFromLocalStorage,
    clearLocalStorage,
    defaultError
};