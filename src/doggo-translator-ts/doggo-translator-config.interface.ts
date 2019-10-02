import { LANGUAGE_TOKENS_ENUM } from '../i18n';

export interface DoggoTranslatorConfig {
  languageToken?: LANGUAGE_TOKENS_ENUM;
  userTranslationsMap?: { [key: string]: string };
}
