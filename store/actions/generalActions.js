import { SET_LANGUAGE } from '../constants';
export function setLanguage(lang) {
    return {
        type: SET_LANGUAGE,
        payload: lang
    }
}