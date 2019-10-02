import { TRANSLATION_TOKENS_ENUM } from '../i18n/tokens/translation-tokens.enum';

export interface TranslatorWithDefaultLanguage {
  readonly defaultLanguage: TRANSLATION_TOKENS_ENUM;
}
