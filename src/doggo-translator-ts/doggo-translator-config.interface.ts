import { LANGUAGE_TOKENS_ENUM } from '../i18n';
import { TranslationMapInterface } from '../i18n/models/translation.model';

export interface DoggoTranslatorConfig {
  languageToken?: LANGUAGE_TOKENS_ENUM;
  userTranslationsMap?: TranslationMapInterface;
}
