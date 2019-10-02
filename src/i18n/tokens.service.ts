import { TRANSLATION_TOKENS_ENUM } from './tokens/translation-tokens.enum';

export class TokensService {
  public static getAllLanguageTokenKeys(): string[] {
    return Object.keys(TRANSLATION_TOKENS_ENUM);
  }

  public static getAllLanguageTokens(): string[] {
    return Object.values(TRANSLATION_TOKENS_ENUM);
  }

  public static languageAvailable(languageToken: TRANSLATION_TOKENS_ENUM): boolean {
    const matchesArray = this.getAllLanguageTokens().filter(token => token === languageToken);
    return matchesArray.length > 0;
  }
}
