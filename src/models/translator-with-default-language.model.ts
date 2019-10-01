import { TRANSLATION_TOKENS_ENUM } from '../enums/translation-tokens.enum'

export interface TranslatorWithDefaultLanguage {
  readonly defaultLanguage: TRANSLATION_TOKENS_ENUM
}
