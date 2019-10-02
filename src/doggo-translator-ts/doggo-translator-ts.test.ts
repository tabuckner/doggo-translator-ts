import { DoggoTranslator, TRANSLATION_TOKENS_ENUM } from '../index';
import { TokensService } from '../i18n';

/**
 * DoggoTranslator
 */
describe('DoggoTranslator', () => {
  const instance = getDefaultInstance();

  it('DoggoTranslator is instantiable', () => {
    expect(instance).toBeInstanceOf(DoggoTranslator);
    expect(instance['languageToken']).toBe(TRANSLATION_TOKENS_ENUM.english);
  });

  describe('#translateSentence', () => {
    it('should return the default response for empty inputs', () => {
      const input = '';
      const testEval = instance.translateSentence(input);
      expect(testEval).toBe(instance.defaultResponse);
    });

    it('should return the input if there isnt a translation', () => {
      spyOnPrivate(instance, 'loadLocaleIntoMemory').and.returnValue({ nope: 'nopers' });
      const mockInput = 'failure';
      const testEval = instance.translateSentence(mockInput);
      expect(testEval).toBe(mockInput);
    });

    it('should get the language file', () => {
      spyOnPrivate(instance, 'loadLocaleIntoMemory').and.returnValue(true);
      const input = 'testing';
      instance.translateSentence(input);
      expect(instance['loadLocaleIntoMemory']).toHaveBeenCalled();
    });

    it('should be able to translate english => doggo', () => {
      const mockLanguageFile = { barking: 'borking' };
      spyOnPrivate(instance, 'loadLocaleIntoMemory').and.returnValue(mockLanguageFile);
      spyOnPrivate(instance, 'translateSingleEntry').and.returnValue(true);
      const mockLanguageKey = Object.keys(mockLanguageFile)[0];
      const input = mockLanguageKey;
      instance.translateSentence(input);
      expect(instance['translateSingleEntry']).toHaveBeenCalledWith(
        input,
        mockLanguageKey,
        mockLanguageFile.barking
      );
    });

    it('should be able to translate english => doggo', () => {
      const mockLanguageFile = { barking: 'borking' };
      spyOnPrivate(instance, 'loadLocaleIntoMemory').and.returnValue(mockLanguageFile);
      spyOnPrivate(instance, 'translateSingleEntry').and.returnValue(true);
      const mockLanguageKey = Object.keys(mockLanguageFile)[0];
      const input = mockLanguageKey;
      instance.translateSentence(input, true);
      expect(instance['translateSingleEntry']).toHaveBeenCalledWith(
        input,
        mockLanguageFile.barking,
        mockLanguageKey
      );
    });
  });

  describe('#getAllLanguageTokens', () => {
    it('should call static method on TokensService for this', () => {
      spyOn(TokensService, 'getAllLanguageTokens').and.returnValue(true);
      instance.getAllLanguageTokens();
      expect(TokensService.getAllLanguageTokens).toHaveBeenCalled();
    });
  });

  describe('#setLanguage', () => {
    it('should use the default language if one is not supplied', () => {
      spyOnPrivate(instance, 'languageAvailable').and.returnValue(false);
      spyOnPrivate(instance, 'logError').and.returnValue(true);
      instance.setLanguage('asdf' as TRANSLATION_TOKENS_ENUM);
      expect(instance['languageToken']).toBe(instance.defaultLanguage);
    });

    it('should log an error if language is not available', () => {
      spyOnPrivate(instance, 'languageAvailable').and.returnValue(false);
      spyOnPrivate(instance, 'logError').and.returnValue(true);
      instance.setLanguage('asdf' as TRANSLATION_TOKENS_ENUM);
      expect(instance['logError']).toHaveBeenCalled();
    });

    it('should set the language if its available', () => {
      spyOnPrivate(instance, 'languageAvailable').and.returnValue(true);
      spyOnPrivate(instance, 'logError').and.returnValue(true);
      const mockToken = 'asdf';
      instance.setLanguage(mockToken as TRANSLATION_TOKENS_ENUM);
      expect(instance['languageToken']).toBe(mockToken);
    });
  });

  describe('#loadLocaleIntoMemory', () => {
    it('should delegate to LocaleLoaderService', () => {
      spyOn(instance['localeLoaderService'], 'loadFile').and.returnValue(true);
      instance['loadLocaleIntoMemory']();
      expect(instance['localeLoaderService'].loadFile).toHaveBeenCalled();
    });

    it('should switch on TRANSLATION_TOKENS_ENUM', () => {
      spyOn(instance['localeLoaderService'], 'loadFile').and.returnValue(true);
      instance['languageToken'] = TRANSLATION_TOKENS_ENUM.english;
      instance['loadLocaleIntoMemory']();
      expect(instance['localeLoaderService'].loadFile).toHaveBeenCalledWith(
        `${TRANSLATION_TOKENS_ENUM.english}.json`
      );
    });
  });

  describe('#languageAvailable', () => {
    it('should delegate to TokensService', () => {
      spyOn(TokensService, 'languageAvailable').and.returnValue(true);
      instance['languageAvailable'](TRANSLATION_TOKENS_ENUM.english);
      expect(TokensService.languageAvailable).toHaveBeenCalled();
    });
  });

  describe('#translateSingleEntry', () => {
    const mockInput = 'testing string test';
    const mockRegex = 'string';
    const mockReplacement = 'test';

    it('should escape input regex', () => {
      spyOnPrivate(instance, 'escapeRegex').and.returnValue(true);
      instance['translateSingleEntry'](mockInput, mockRegex, mockReplacement);
      expect(instance['escapeRegex']).toHaveBeenCalled();
    });

    it('should use string.replace', () => {
      spyOn(String.prototype, 'replace').and.callThrough();
      instance['translateSingleEntry'](mockInput, mockRegex, mockReplacement);
      expect(mockInput.replace).toHaveBeenCalled();
    });

    it('should handle all caps', () => {
      spyOn(String.prototype, 'replace').and.callThrough();
      const testEval = instance['translateSingleEntry'](
        mockInput.toUpperCase(),
        mockRegex,
        mockReplacement
      );
      expect(testEval).toBe(testEval.toUpperCase());
    });

    it('should handle capitalized words', () => {
      const localMockInput = 'Testing';
      const testEval = instance['translateSingleEntry'](localMockInput, 'testing', mockReplacement);
      expect(testEval).toBe('Test');
    });
  });

  describe('#capitalizeFirstCharacter', () => {
    it('should do that...', () => {
      const mockInput = 'testing';
      const testEval = instance['capitalizeFirstCharacter'](mockInput);
      expect(testEval).toBe('Testing');
    });
  });

  describe('#escapeRegex', () => {
    it('should do that...', () => {
      const mockInput = '-[]{}()*+?.,^$|#';
      const testEval = instance['escapeRegex'](mockInput);
      expect(testEval).toBe('\\-\\[\\]\\{\\}\\(\\)\\*\\+\\?\\.\\,\\^\\$\\|\\#');
    });
  });

  describe('#logError', () => {
    // tslint:disable
    it('should prepend our error signature', () => {
      const mockInput = 'testing';
      spyOn(console, 'error').and.returnValue(true);
      instance['logError'](mockInput);
      expect(console.error).toHaveBeenCalledWith(new Error('[DoggoTranslatorTS] testing'));
    });
    // tslint:enable
  });
});

function getDefaultInstance(): DoggoTranslator {
  return new DoggoTranslator(TRANSLATION_TOKENS_ENUM.english);
}

function spyOnPrivate(target: any, thing: any): jasmine.Spy {
  return spyOn<any>(target, thing);
}
