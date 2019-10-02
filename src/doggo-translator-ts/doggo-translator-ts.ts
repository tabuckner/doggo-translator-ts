import { TranslatorWithDefaultResponse } from '../models/translator-with-default-response.model';
import { LANGUAGE_TOKENS_ENUM } from '../i18n/tokens/translation-tokens.enum';
import { TranslatorWithDefaultLanguage } from '../models/translator-with-default-language.model';
import { TokensService } from '../i18n';
import { LocaleLoaderService } from '../i18n/locale-loader.service';
import { ErrorService } from '../util/error.service';
import { DoggoTranslatorConfig } from './doggo-translator-config.interface';

// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

/**
 * Given a language.json object, returns an instance of `DoggoTranslator`.
 */
export class DoggoTranslator
  implements TranslatorWithDefaultResponse, TranslatorWithDefaultLanguage {
  readonly defaultResponse = 'Bork';
  readonly defaultLanguage = LANGUAGE_TOKENS_ENUM.english;
  private languageToken!: string;
  private localeLoaderService = new LocaleLoaderService();

  constructor(config: DoggoTranslatorConfig) {
    this.configValidation(config);
    this.setUpTranslator(config);
  }

  /**
   *
   * @param sourceSentence Sentence in the sourceLanguage
   * @param reverse boolean to control direction of translation (e.g. true = sourceLanguage => doggo, false = doggo => sourceLanguage)
   */
  translateSentence(sourceSentence: string, reverse = false): string {
    if (sourceSentence === '') {
      return this.defaultResponse;
    }

    const languageFile: { [key: string]: any } = this.localeLoaderService.getTranslationsMap();

    for (const key in languageFile) {
      if (languageFile.hasOwnProperty(key)) {
        const value = languageFile[key];

        if (!reverse) {
          sourceSentence = this.translateSingleEntry(sourceSentence, key, value);
        } else {
          sourceSentence = this.translateSingleEntry(sourceSentence, value, key);
        }
      }
    }

    return sourceSentence;
  }

  /**
   * Returns available languages.
   */
  getAllLanguageTokens(): string[] {
    return TokensService.getAllLanguageTokens();
  }

  /**
   * Given a language token, will attempt to set the current language.
   * @param languageToken the language token
   */
  setLanguage(languageToken: LANGUAGE_TOKENS_ENUM): void {
    if (!this.languageAvailable(languageToken)) {
      ErrorService.logError(`The language was not found, defaulting to ${this.defaultLanguage}`);
      this.languageToken = this.defaultLanguage;
      return this.localeLoaderService.loadLibraryTranslations(languageToken);
    }
    this.languageToken = languageToken;
    return this.localeLoaderService.loadLibraryTranslations(languageToken);
  }

  private configValidation(config: DoggoTranslatorConfig): void {
    if (!config || (!config.languageToken && !config.userTranslationsMap)) {
      ErrorService.throw(
        'Invalid Config Provided. You must provide at least one of the following: \n\t`languageToken` or `userTranslationsMap`'
      );
    }
  }

  private setUpTranslator(config: DoggoTranslatorConfig): void {
    if (!config.userTranslationsMap) {
      return this.setLanguage(config.languageToken as LANGUAGE_TOKENS_ENUM);
    }
    this.setLanguage(LANGUAGE_TOKENS_ENUM.userDefined);
    return this.localeLoaderService.setTranslationsMap(config.userTranslationsMap);
  }

  /**
   * Gets the language file for the current language token.
   */
  // private loadLocaleIntoMemory() {
  //   switch (this.languageToken) {
  //     case LANGUAGE_TOKENS_ENUM.english:
  //       return this.localeLoaderService.loadFile(`${this.languageToken}.json`);
  //     default:
  //       return this.localeLoaderService.loadFile(`${this.defaultLanguage}.json`);
  //   }
  // }

  /**
   * Given a language token, will return whether the language is available.
   * @param language language token
   */
  private languageAvailable(languageToken: LANGUAGE_TOKENS_ENUM): boolean {
    return TokensService.languageAvailable(languageToken);
  }

  /**
   * Replaces a part from the input and tries to format it with the proper case.
   * @param input The complete input
   * @param find The word or sentence to find
   * @param replace The word or sentence to replace the found word or sentence
   */
  private translateSingleEntry(input: string, regex: string, replace: string): string {
    regex = this.escapeRegex(regex);

    return input.replace(new RegExp('\\b(' + regex + ')\\b', 'gi'), match => {
      if (match === match.toUpperCase()) {
        return replace.toUpperCase();
      }

      if (match === this.capitalizeFirstCharacter(match)) {
        return this.capitalizeFirstCharacter(replace);
      }

      return replace;
    });
  }

  /**
   * Returns a string with the first character capitalized.
   * @param target The string to format
   */
  private capitalizeFirstCharacter(target: string): string {
    const firstCharacterCapitalized = target.charAt(0).toUpperCase();
    const restOfTheWord = target.slice(1);
    return `${firstCharacterCapitalized}${restOfTheWord}`;
  }

  /**
   * Given a string, returns the string with all special characters escaped so that the translation
   * regex see them as special characters.
   * @param target The string to escape
   */
  private escapeRegex(target: string): string {
    return target.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
}
