import express from "express";
import payload from "payload";
import invariant from "tiny-invariant";
import { options } from "../../app/i18n";

const restCountries = 'https://restcountries.com/v2/all?fields=alpha2Code,translations,name';
const locales = options.supportedLngs;

export async function seedCountries() {
  let countries = [];
  try {
    const res = await fetch(restCountries)
    countries = await res.json();
  } catch (err) {
    payload.logger.fatal(`Could not fetch countries from ${restCountries}`);
    return;
  }
  
  for (const country of countries) {
    const alpha2 = (country.alpha2Code as string).toLowerCase();
    payload.logger.info(`adding ${alpha2}: ${country.name}`);
    
    // create item if not already exists
    try {
      await payload.create({
        collection: 'countries',
        data: {
          id: alpha2,
          name: country.name, // name returned by restcountries.com is english
        },
        locale: 'en',
      });
      payload.logger.info(`added ${alpha2} ${country.name}`);
    } catch (err) {
      payload.logger.info(`skipping ${alpha2}: ${country.name} because it already exists`);
    }

    // add translations for languages other than 'en'
    for (const locale of locales) {
      if (locale === 'en') continue;

      await payload.update({
        collection: 'countries',
        id: alpha2,
        data: {
          name: country.translations[locale],
        },
        locale,
      });

      payload.logger.info(`added ${locale} name for ${alpha2}: ${country.translations[locale]}`);
    };
  };
}

export async function seed() {
  invariant(process.env.PAYLOAD_SECRET, "PAYLOAD_SECRET is required");
  invariant(process.env.MONGODB_URI, "MONGODB_URI is required");
  
  // Initialize Payload
  console.log('initializing payload...')
  console.log('MONGODB_URI', process.env.MONGODB_URI)
  const app = express();
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: () => console.log('Done.')
  });
  
  await seedCountries();
  
  process.exit(0);
}

seed();