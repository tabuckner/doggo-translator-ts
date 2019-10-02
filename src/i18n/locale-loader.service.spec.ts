import { LocaleLoaderService } from './locale-loader.service';
import { LANGUAGE_TOKENS_ENUM } from './tokens/translation-tokens.enum';
import { EN_TRANSLATIONS } from './locales/en';
import { ErrorService } from '../util/error.service';

describe('LocaleLoaderService', () => {
  const instance = new LocaleLoaderService();

  it('should be instantiable', () => {
    expect(instance).toBeInstanceOf(LocaleLoaderService);
  });

  describe('#setTranslationsMap', () => {
    it('should do that...', () => {
      const mockData = { that: true };
      instance.setTranslationsMap(mockData as any);
      expect(instance['translationsMap']).toBe(mockData);
    });
  });

  describe('#loadLibraryTranslations', () => {
    it('should switch on LANGUAGE_TOKENS_ENUM', () => {
      spyOn(instance, 'setTranslationsMap').and.returnValue(true);
      instance.loadLibraryTranslations(LANGUAGE_TOKENS_ENUM.english);
      expect(instance.setTranslationsMap).toHaveBeenCalledWith(EN_TRANSLATIONS);
    });
  });

  describe('#getTranslationsMap', () => {
    it('should error for empty maps', () => {
      spyOn(ErrorService, 'logError').and.returnValue(true);
      instance.setTranslationsMap({});
      instance.getTranslationsMap();
      expect(ErrorService.logError).toHaveBeenCalled();
    });

    it('should return current map', () => {
      const mockMap = { test: 'true' };
      instance.setTranslationsMap(mockMap);
      const testEval = instance.getTranslationsMap();
      expect(testEval).toBe(mockMap);
    });
  });
});
