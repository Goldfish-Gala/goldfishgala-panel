const cookieObj = typeof window === 'undefined' ? require('next/headers') : require('universal-cookie');
const { cookies } = require('next/headers');
import UniversalCookie from 'universal-cookie';

import en from './public/locales/en.json';
import ae from './public/locales/ae.json';
import da from './public/locales/da.json';
import de from './public/locales/de.json';
import el from './public/locales/el.json';
import es from './public/locales/es.json';
import fr from './public/locales/fr.json';
import hu from './public/locales/hu.json';
import it from './public/locales/it.json';
import ja from './public/locales/ja.json';
import pl from './public/locales/pl.json';
import pt from './public/locales/pt.json';
import ru from './public/locales/ru.json';
import sv from './public/locales/sv.json';
import tr from './public/locales/tr.json';
import zh from './public/locales/zh.json';
import ina from './public/locales/ina.json';
const langObj: any = { en, ae, da, de, el, es, fr, hu, it, ja, pl, pt, ru, sv, tr, zh, ina };

const getLang = async () => {
    if (typeof window === 'undefined') {
        const cookieStore = await cookies();
        const lang = cookieStore.get('i18nextLng')?.value;
        return lang || 'ina';
    } else {
        // Client-side: Use universal-cookie
        const cookies = new UniversalCookie();
        const lang = cookies.get('i18nextLng');
        return lang || 'ina'; // Default to 'ina'
    }
};

export const getTranslation = async () => {
    const lang = await getLang();
    const data = langObj[lang || 'ina'];

    const t = (key: string) => {
        return data[key] ? data[key] : key;
    };

    const initLocale = async (themeLocale: string) => {
        const detectedLang = await getLang();
        i18n.changeLanguage(detectedLang || themeLocale);
    };

    const i18n = {
        language: lang,
        changeLanguage: (lang: string) => {
            const cookies = new UniversalCookie();
            cookies.set('i18nextLng', lang, { path: '/' });
        },
    };

    return { t, i18n, initLocale };
};
