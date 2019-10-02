export class ErrorService {
  /**
   * Logs an error message to the console with a prefix.
   * @param message Message to log
   */
  public static logError(message: any) {
    const error = ErrorService.buildError(message);
    console.error(error); //tslint:disable-line
  }

  public static throw(message: any) {
    const error = ErrorService.buildError(message);
    throw error;
  }

  private static buildError(message: any) {
    return new Error(`[DoggoTranslatorTS] ${message}`);
  }
}
