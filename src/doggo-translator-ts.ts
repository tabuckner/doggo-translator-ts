import { TranslatorWithDefaultResponse } from './models/translator-with-default-response.model';
import { TRANSLATION_TOKENS_ENUM } from './enums/translation-tokens.enum';
import { TranslatorWithDefaultLanguage } from './models/translator-with-default-language.model';
import * as EN_TRANSLATIONS from './i18n/translations/en.json';

// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

/**
 * Given a language.json object, returns an instance of `DoggoTranslator`.
 */
export default class DoggoTranslator
  implements TranslatorWithDefaultResponse, TranslatorWithDefaultLanguage {
  readonly defaultResponse = 'Bork';
  readonly defaultLanguage = TRANSLATION_TOKENS_ENUM.english;
  private language!: string;

  constructor(languageToken: TRANSLATION_TOKENS_ENUM) {
    this.setLanguage(languageToken);
  }

  /**
   *
   * @param sourceSentence Sentence in the sourceLanguage
   * @param reverse boolean to control direction of translation (e.g. true = sourceLanguage => doggo, false = doggo => sourceLanguage)
   */
  translateSentence(sourceSentence: string, reverse: boolean): string {
    if (sourceSentence === '') {
      return this.defaultResponse;
    }

    const languageFile: { [key: string]: any } = this.getLanguageFile();

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
  getLanguages(): string[] {
    const languageOptions: string[] = [];
    for (const language in TRANSLATION_TOKENS_ENUM) {
      if (language) {
        languageOptions.push(language);
      }
    }
    return languageOptions;
  }

  /**
   * Given a language token, will attempt to set the current language.
   * @param language the language token
   */
  setLanguage(language: TRANSLATION_TOKENS_ENUM): void {
    if (this.languageAvailable(language)) {
      this.language = language;
    } else {
      this.logError(`The language was not found, defaulting to ${this.defaultLanguage}`);
      this.language = this.defaultLanguage;
    }
  }

  /**
   * Gets the language file for the current language token.
   */
  private getLanguageFile() {
    switch (this.language) {
      case 'en':
        return EN_TRANSLATIONS;
      default:
        return EN_TRANSLATIONS;
    }
  }

  /**
   * Given a language token, will return whether the language is available.
   * @param language language token
   */
  private languageAvailable(language: string): boolean {
    return this.getLanguages().indexOf(language) !== -1;
  }

  /**
   * Replaces a part from the input and tries to format it with the proper case.
   * @param input The complete input
   * @param find The word or sentence to find
   * @param replace The word or sentence to replace the found word or sentence
   */
  private translateSingleEntry(input: string, find: string, replace: string): string {
    find = this.escapeRegex(find);

    return input.replace(new RegExp('\\b(' + find + ')\\b', 'gi'), match => {
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
    return target.charAt(0).toUpperCase() + target.slice(1);
  }

  /**
   * Given a string, returns the string with all special characters escaped so that the translation
   * regex see them as special characters.
   * @param target The string to escape
   */
  private escapeRegex(target: string): string {
    return target.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  /**
   * Logs an error message to the console with a prefix.
   * @param message Message to log
   */
  private logError(message: string) {
    const error = new Error('[DoggoTranslator]' + message);
    console.error(error); //tslint:disable-line
  }
}
