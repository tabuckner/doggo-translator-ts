import en_translations from './en_translations.json';

class DoggoTranslator {
    /**
     * Creates a new instance and sets the language
     *
     * @param {string} language
     */
    constructor(language) {
        this.setLanguage(language);
    }

    /**
     * Translates the given sentence with the language
     *
     * @param {string} sentence The input language
     * @param {bool} reverse When false, the sentence goes from the chosen language to Doggo speak.
     *                        When true, the sentence goes from Doggo speak to the chosen language.
     *
     * @returns {string} The translated sentence
     */
    translateSentence(sentence, reverse) {
        if (typeof sentence !== 'string' || sentence === '') {
            return 'Bork';
        }

        let languageFile = this._getLanguageFile();

        for (let key in languageFile) {
            if (languageFile.hasOwnProperty(key)) {
                let value = languageFile[key];

                if (!reverse) {
                    sentence = this._translateSingleEntry(sentence, key, value);
                }
                else {
                    sentence = this._translateSingleEntry(sentence, value, key);
                }
            }
        }

        return sentence;
    }

    /**
     * Gets the available languages
     *
     * @returns {[string]} The array with available languages
     */
    getLanguages() {
        return ['en'];
    }

    /**
     * Sets the language to translate from
     *
     * @param {string} language The language to translate from
     */
    setLanguage(language) {
        if (this._languageAvailable(language)) {
            this.language = language;
        }
        else {
            this._logError("The language was not found, defaulting to EN");

            this.language = 'en';
        }
    }

    /**
     * Gets the language's JSON file
     * TODO: remove this function and create something like a dictionary with the available languages and their JSON file
     *
     * @returns {object} The JSON object
     *
     * @private
     */
    _getLanguageFile() {
        switch (this.language) {
            case 'en':
                return en_translations;
            default:
                return en_translations;
        }
    }

    /**
     * Checks whether the given language exists in the available languages
     *
     * @param {string} language The language to check
     *
     * @returns {boolean} Whether it exists or not
     *
     * @private
     */
    _languageAvailable(language) {
        return this.getLanguages().indexOf(language) !== -1;
    }

    /**
     * Replaces a part from the input and tries to format it with the proper case.
     *
     * @param {string} input The complete input
     * @param {string} find The word or sentence to find
     * @param {string} replace The word or sentence to replace the found word or sentence
     *
     * @returns {string} The input with the replaced text.
     *
     * @private
     */
    _translateSingleEntry(input, find, replace) {
        find = this._escapeRegex(find);

        return input.replace(new RegExp('\\b(' + find + ')\\b', 'gi'), (match) => {
            if (match === match.toUpperCase()) {
                return replace.toUpperCase();
            }

            if (match === this._ucfirst(match)) {
                return this._ucfirst(replace);
            }

            return replace;
        })
    }

    /**
     * Makes the first character in the string uppercase
     *
     * @param {string} string The string to format
     *
     * @returns {string} The string with the first character uppercase.
     *
     * @private
     */
    _ucfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Escapes all the special characters so that the translation regex see them as special characters
     *
     * @param {string} string The string to escape
     *
     * @returns {string} The escaped string
     *
     * @private
     */
    _escapeRegex(string) {
        return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    /**
     * Logs an error message to the console with a prefix.
     *
     * @param {string} message Message to log
     *
     * @private
     */
    _logError(message) {
        console.error('[DoggoTranslator]' + message);
    }
}

export default DoggoTranslator;