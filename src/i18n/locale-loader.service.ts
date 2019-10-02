import { LANGUAGE_TOKENS_ENUM } from './tokens/translation-tokens.enum';
import { EN_TRANSLATIONS } from './locales/en';
import { ErrorService } from '../util/error.service';

export class LocaleLoaderService {
  private translationsMap: { [key: string]: string } = {};

  public setTranslationsMap(newTranslationsMap: { [key: string]: string }) {
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

  public getTranslationsMap(): { [key: string]: string } {
    if (!this.translationMapHasTranslations) {
      ErrorService.logError('No translations found in TranslationsMap.');
    }
    return this.translationsMap;
  }

  private get translationMapHasTranslations(): boolean {
    return !!(Object.keys(this.translationsMap).length > 0);
  }
}
