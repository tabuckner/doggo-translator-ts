import { LANGUAGE_TOKENS_ENUM } from './tokens/translation-tokens.enum';
import { EN_TRANSLATIONS } from './locales/en/en';
import { ErrorService } from '../util/error.service';
import { TranslationMapInterface } from './models/translation.model';

export class LocaleLoaderService {
  private translationsMap!: TranslationMapInterface;

  public setTranslationsMap(newTranslationsMap: TranslationMapInterface) {
    this.translationsMap = newTranslationsMap;
  }

  public loadLibraryTranslations(token: LANGUAGE_TOKENS_ENUM): void {
    switch (token) {
      case LANGUAGE_TOKENS_ENUM.english:
        return this.setTranslationsMap(EN_TRANSLATIONS);
      default:
        return this.setTranslationsMap(EN_TRANSLATIONS);
    }
  }

  public getTranslationsMap(): TranslationMapInterface {
    if (!this.translationMapHasTranslations) {
      ErrorService.logError('No translations found in TranslationsMap.');
    }
    return this.translationsMap;
  }

  private get translationMapHasTranslations(): boolean {
    return !!(Object.keys(this.translationsMap).length > 0);
  }
}
