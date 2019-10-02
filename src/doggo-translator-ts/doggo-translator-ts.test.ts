import { DoggoTranslator, LANGUAGE_TOKENS_ENUM } from '../index';
import { TokensService } from '../i18n';
import { ErrorService } from '../util/error.service';
import { DoggoTranslatorConfig } from './doggo-translator-config.interface';

/**
 * DoggoTranslator
 */
describe('DoggoTranslator', () => {
  const instance = getDefaultInstance();

  it('DoggoTranslator is instantiable', () => {
    expect(instance).toBeInstanceOf(DoggoTranslator);
    expect(instance['languageToken']).toBe(LANGUAGE_TOKENS_ENUM.english);
  });

  describe('#translateSentence', () => {
    it('should return the default response for empty inputs', () => {
      const input = '';
      const testEval = instance.translateSentence(input);
      expect(testEval).toBe(instance.defaultResponse);
    });

    it('should return the input if there isnt a translation', () => {
      spyOnPrivate(instance['localeLoaderService'], 'getTranslationsMap').and.returnValue({
        nope: 'nopers'
      });
      const mockInput = 'failure';
      const testEval = instance.translateSentence(mockInput);
      expect(testEval).toBe(mockInput);
    });

    it('should get the language file', () => {
      spyOnPrivate(instance['localeLoaderService'], 'getTranslationsMap').and.returnValue(true);
      const input = 'testing';
      instance.translateSentence(input);
      expect(instance['localeLoaderService'].getTranslationsMap).toHaveBeenCalled();
    });

    it('should be able to translate english => doggo', () => {
      const mockLanguageFile = { barking: 'borking' };
      spyOnPrivate(instance['localeLoaderService'], 'getTranslationsMap').and.returnValue(
        mockLanguageFile
      );
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
      spyOnPrivate(instance['localeLoaderService'], 'getTranslationsMap').and.returnValue(
        mockLanguageFile
      );
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
      spyOnPrivate(ErrorService, 'logError').and.returnValue(true);
      instance.setLanguage('asdf' as LANGUAGE_TOKENS_ENUM);
      expect(instance['languageToken']).toBe(instance.defaultLanguage);
    });

    it('should log an error if language is not available', () => {
      spyOnPrivate(instance, 'languageAvailable').and.returnValue(false);
      spyOnPrivate(ErrorService, 'logError').and.returnValue(true);
      instance.setLanguage('asdf' as LANGUAGE_TOKENS_ENUM);
      expect(ErrorService['logError']).toHaveBeenCalled();
    });

    it('should set the language if its available', () => {
      spyOnPrivate(instance, 'languageAvailable').and.returnValue(true);
      spyOnPrivate(ErrorService, 'logError').and.returnValue(true);
      const mockToken = 'TOKEN';
      instance.setLanguage(mockToken as LANGUAGE_TOKENS_ENUM);
      expect(instance['languageToken']).toBe(mockToken);
    });
  });

  describe('#configValidation', () => {
    it('should throw an error for undefined configs', () => {
      spyOnPrivate(instance, 'configValidation');
      instance['configValidation']((undefined as any) as DoggoTranslatorConfig);
      expect(ErrorService.throw).toThrow();
    });

    it('should throw an error for invalid configs', () => {
      spyOnPrivate(instance, 'configValidation');
      instance['configValidation']({ languageToken: undefined, userTranslationsMap: undefined });
      expect(ErrorService.throw).toThrow();
    });
  });

  describe('#setUpTranslator', () => {
    it('should use default language', () => {
      spyOn(instance, 'setLanguage').and.returnValue(true);
      const mockConfig: DoggoTranslatorConfig = { languageToken: 'test' as LANGUAGE_TOKENS_ENUM };
      instance['setUpTranslator'](mockConfig);
      expect(instance.setLanguage).toHaveBeenCalledWith(mockConfig.languageToken);
    });

    it('should allow user defined translation maps', () => {
      spyOn(instance, 'setLanguage').and.returnValue(true);
      spyOnPrivate(instance['localeLoaderService'], 'setTranslationsMap').and.returnValue(true);
      const mockConfig: DoggoTranslatorConfig = { userTranslationsMap: { test: 'true' } };
      instance['setUpTranslator'](mockConfig);
      expect(instance.setLanguage).toHaveBeenCalledWith(LANGUAGE_TOKENS_ENUM.userDefined);
      expect(instance['localeLoaderService'].setTranslationsMap).toHaveBeenCalledWith(
        mockConfig.userTranslationsMap
      );
    });
  });

  describe('#languageAvailable', () => {
    it('should delegate to TokensService', () => {
      spyOn(TokensService, 'languageAvailable').and.returnValue(true);
      instance['languageAvailable'](LANGUAGE_TOKENS_ENUM.english);
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
});

function getDefaultInstance(): DoggoTranslator {
  const config: DoggoTranslatorConfig = { languageToken: LANGUAGE_TOKENS_ENUM.english };
  return new DoggoTranslator(config);
}

function spyOnPrivate(target: any, thing: any): jasmine.Spy {
  return spyOn<any>(target, thing);
}
