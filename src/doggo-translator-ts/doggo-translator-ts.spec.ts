import { DoggoTranslator, LANGUAGE_TOKENS_ENUM } from '../index';
import { TokensService } from '../i18n';
import { ErrorService } from '../util/error.service';
import { DoggoTranslatorConfig } from './doggo-translator-config.interface';
import { TranslationMapInterface } from '../i18n/models/translation.model';

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

    it('should delegate to whole words method', () => {
      const mockLanguageFile: TranslationMapInterface = { words: { barking: 'borking' } };
      spyOnPrivate(instance['localeLoaderService'], 'getTranslationsMap').and.returnValue(
        mockLanguageFile
      );
      spyOnPrivate(instance, 'replaceWholeWords').and.returnValue(true);
      const mockInput = 'testing sentence';
      instance.translateSentence(mockInput, true);
      expect(instance['replaceWholeWords']).toHaveBeenCalledWith(
        mockLanguageFile.words,
        true,
        mockInput
      );
    });

    it('should delegate to suffixes method', () => {
      const mockLanguageFile: TranslationMapInterface = {
        words: { barking: 'borking' },
        suffixes: { ing: 'in' }
      };
      spyOnPrivate(instance['localeLoaderService'], 'getTranslationsMap').and.returnValue(
        mockLanguageFile
      );
      spyOnPrivate(instance, 'replaceSuffixes').and.returnValue(true);
      const mockInput = 'testing sentence';
      instance.translateSentence(mockInput, true);
      expect(instance['replaceSuffixes']).toHaveBeenCalledWith(
        mockLanguageFile.suffixes,
        true,
        mockInput
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
      const mockConfig: DoggoTranslatorConfig = {
        userTranslationsMap: { words: { test: 'true' } }
      };
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

  describe('#replaceWholeWords', () => {
    const mockLanguageFile: TranslationMapInterface = { words: { barking: 'borking' } };
    const mockLanguageKey = Object.keys(mockLanguageFile.words)[0];
    const input = mockLanguageKey;

    beforeEach(() => {
      spyOnPrivate(instance, 'translateWholeWord').and.returnValue(true);
    });

    it('should delegate whole words from english => doggo to #translateWholeWord', () => {
      instance['replaceWholeWords'](mockLanguageFile.words, false, input);
      expect(instance['translateWholeWord']).toHaveBeenCalledWith(
        input,
        mockLanguageKey,
        mockLanguageFile.words.barking
      );
    });

    it('should delegate whole words from doggo => english to #translateWholeWord', () => {
      instance['replaceWholeWords'](mockLanguageFile.words, true, input);
      expect(instance['translateWholeWord']).toHaveBeenCalledWith(
        input,
        mockLanguageFile.words.barking,
        mockLanguageKey
      );
    });
  });

  describe('#replaceSuffixes', () => {
    const mockSuffixes = { ing: 'in' };
    const mockLanguageKey = Object.keys(mockSuffixes)[0];
    const input = mockLanguageKey;

    beforeEach(() => {
      spyOnPrivate(instance, 'transformSuffixes').and.returnValue(true);
    });

    it('should delegate whole words from english => doggo to #transformSuffixes', () => {
      instance['replaceSuffixes'](mockSuffixes, false, input);
      expect(instance['transformSuffixes']).toHaveBeenCalledWith(
        input,
        mockLanguageKey,
        mockSuffixes.ing
      );
    });

    it('should delegate whole words from doggo => english to #transformSuffixes', () => {
      instance['replaceSuffixes'](mockSuffixes, true, input);
      expect(instance['transformSuffixes']).toHaveBeenCalledWith(
        input,
        mockSuffixes.ing,
        mockLanguageKey
      );
    });
  });

  describe('#translateWholeWord', () => {
    const mockInput = 'testing string test';
    const mockRegex = 'string';
    const mockReplacement = 'test';

    it('should escape input regex', () => {
      spyOnPrivate(instance, 'escapeRegex').and.returnValue(true);
      instance['translateWholeWord'](mockInput, mockRegex, mockReplacement);
      expect(instance['escapeRegex']).toHaveBeenCalled();
    });

    it('should use string.replace', () => {
      spyOn(String.prototype, 'replace').and.callThrough();
      instance['translateWholeWord'](mockInput, mockRegex, mockReplacement);
      expect(mockInput.replace).toHaveBeenCalled();
    });

    it('should handle all caps', () => {
      spyOn(String.prototype, 'replace').and.callThrough();
      const testEval = instance['translateWholeWord'](
        mockInput.toUpperCase(),
        mockRegex,
        mockReplacement
      );
      expect(testEval).toBe(testEval.toUpperCase());
    });

    it('should handle capitalized words', () => {
      const localMockInput = 'Testing';
      const testEval = instance['translateWholeWord'](localMockInput, 'testing', mockReplacement);
      expect(testEval).toBe('Test');
    });
  });

  describe('#transformSuffixes', () => {
    const mockInput = 'Running Jumping and Swimming.';
    const mockRegex = 'ing';
    const mockReplacement = 'in';

    it('should escape input regex', () => {
      spyOnPrivate(instance, 'escapeRegex').and.returnValue(true);
      instance['transformSuffixes'](mockInput, mockRegex, mockReplacement);
      expect(instance['escapeRegex']).toHaveBeenCalled();
    });

    it('should use string.replace', () => {
      spyOn(String.prototype, 'replace').and.callThrough();
      instance['transformSuffixes'](mockInput, mockRegex, mockReplacement);
      expect(mockInput.replace).toHaveBeenCalled();
    });

    it('should handle all caps', () => {
      spyOn(String.prototype, 'replace').and.callThrough();
      const testEval = instance['transformSuffixes'](
        mockInput.toUpperCase(),
        mockRegex,
        mockReplacement
      );
      expect(testEval).toBe(testEval.toUpperCase());
    });

    it('should replace suffixes of words in place', () => {
      const testEval = instance['transformSuffixes'](mockInput, mockRegex, mockReplacement);
      expect(testEval).toBe('Runnin Jumpin and Swimmin.');
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
