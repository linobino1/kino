import { type Payload } from "payload";
import { options } from "../../app/i18n";
import countries from "i18n-iso-countries";

const locales = options.supportedLngs;
const fallbackLocale = options.fallbackLng;

export async function seedCountries(payload: Payload) {
  for (const alpha2 of Object.keys(countries.getAlpha2Codes())) {
    payload.logger.info(`adding ${alpha2}`);

    // create item in fallback language if not already exists
    const name = countries.getName(alpha2, fallbackLocale) as string;
    try {
      await payload.create({
        collection: "countries",
        data: {
          id: alpha2,
          name,
        },
        locale: fallbackLocale,
      });
      payload.logger.info(`added ${alpha2} ${name}`);
    } catch (err) {
      payload.logger.info(
        `skipping ${alpha2}: ${name} because it already exists`
      );
    }

    // add translations for other languages
    for (const locale of locales) {
      if (locale === fallbackLocale) continue;

      const name = countries.getName(alpha2, locale);
      await payload.update({
        collection: "countries",
        id: alpha2,
        data: {
          name,
        },
        locale,
      });

      payload.logger.info(`added ${locale} name for ${alpha2}: ${name}`);
    }
  }
}
