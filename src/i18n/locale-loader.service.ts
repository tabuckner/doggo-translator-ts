import { readFileSync } from 'fs';
import { resolve, join } from 'path';

export class LocaleLoaderService {
  private readonly libraryLocaleDirectory = resolve(__dirname, './locales');

  public loadFile(filePath: string, userDefined = false): JSON {
    if (!userDefined) {
      filePath = join(this.libraryLocaleDirectory, filePath);
    }
    const contents = readFileSync(filePath, { encoding: 'utf8' });
    const data = JSON.parse(contents);
    return data;
  }
}
