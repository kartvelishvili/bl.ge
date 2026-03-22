import 'server-only';

const dictionaries = {
    en: () => import('./en.json'),
    ge: () => import('./ge.json'),
    ru: () => import('./ru.json'),
}

export const getDictionary = async (locale: 'en' | 'ge' | 'ru') => dictionaries[locale]()