import { TokensService, LANGUAGE_TOKENS_ENUM } from '.';

/**
 * TokensService
 */
describe('TokensService', () => {
  describe('#getAllLanguageTokenKeys', () => {
    it('should do that...', () => {
      const testEval = TokensService.getAllLanguageTokenKeys();
      expect(testEval).toContain(Object.keys(LANGUAGE_TOKENS_ENUM)[0]);
    });
  });

  describe('#getAllLanguageTokens', () => {
    it('should do that...', () => {
      const testEval = TokensService.getAllLanguageTokens();
      expect(testEval).toContain(LANGUAGE_TOKENS_ENUM.english);
    });
  });

  describe('#languageAvailable', () => {
    it('should return true if the language is', () => {
      const testEval = TokensService.languageAvailable(LANGUAGE_TOKENS_ENUM.english);
      expect(testEval).toBe(true);
    });

    it('should return false if the language is', () => {
      const testEval = TokensService.languageAvailable('asdf' as any);
      expect(testEval).toBe(false);
    });
  });
});
