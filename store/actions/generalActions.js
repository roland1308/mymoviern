import { SET_LANGUAGE, TOGGLE_BACK, IS_BACK_VISIBLE } from '../constants';

export function setLanguage(lang) {
    return {
        type: SET_LANGUAGE,
        payload: lang
    }
}

export function toggleBack() {
    return {
        type: TOGGLE_BACK,
    }
}

export function isBackVisible(status) {
    return {
        type: IS_BACK_VISIBLE,
        payload: status
    }
}