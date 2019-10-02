import { ErrorService } from './error.service';

describe('ErrorService', () => {
  describe('#logError', () => {
    // tslint:disable
    it('should prepend our error signature', () => {
      const mockInput = 'testing';
      spyOn(console, 'error').and.returnValue(true);
      ErrorService['logError'](mockInput);
      expect(console.error).toHaveBeenCalledWith(new Error('[DoggoTranslatorTS] testing'));
    });
    // tslint:enable
  });
});
