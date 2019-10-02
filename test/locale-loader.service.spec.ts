import { LocaleLoaderService } from '../src/i18n/locale-loader.service';
import * as fs from 'fs';
import * as path from 'path';

describe('LocaleLoaderService', () => {
  const instance = new LocaleLoaderService();

  it('should be instantiable', () => {
    expect(instance).toBeInstanceOf(LocaleLoaderService);
  });

  describe('#loadFile', () => {
    beforeEach(() => {
      spyOn(fs, 'readFileSync').and.returnValue(true);
    });

    it('should load library files', () => {
      const mockFilePath = './test-file.json';
      instance['loadFile'](mockFilePath);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        `${path.resolve(__dirname, '../src/i18n/locales', mockFilePath)}`,
        { encoding: 'utf8' }
      );
    });

    it('should load user defined file paths', () => {
      const userDirectory = 'my/nested/dir';
      const mockFilePath = './test-file.json';
      instance['loadFile'](`${path.join(userDirectory, mockFilePath)}`, true);
      expect(fs.readFileSync).toHaveBeenCalledWith(`${path.join(userDirectory, mockFilePath)}`, {
        encoding: 'utf8'
      });
    });
  });
});
