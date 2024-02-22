import { generatePagination, getTranslationByLocale } from './utils';

describe('utils', () => {
  describe('generatePagination', () => {
    it('should return 1 page', () => {
      const pages = generatePagination(1, 1);
      expect(pages).toStrictEqual([1]);
    });

    it('should return 2 pages', () => {
      const pages = generatePagination(1, 2);
      expect(pages).toStrictEqual([1, 2]);
    });

    it('should return 3 pages before ... and 2 last after', () => {
      const pages = generatePagination(1, 10);
      expect(pages).toStrictEqual([1, 2, 3, '...', 9, 10]);
    });

    it('should return 2 pages before ... and 3 last after', () => {
      const pages = generatePagination(8, 10);
      expect(pages).toStrictEqual([1, 2, '...', 8, 9, 10]);
    });

    it('should return first, middle, last pages', () => {
      const pages = generatePagination(5, 10);
      expect(pages).toStrictEqual([1, '...', 4, 5, 6, '...', 10]);
    });
  });

  describe('getTranslationByLocale', () => {
    it('should return en translation', () => {
      const text = getTranslationByLocale('en', 'Hello', 'Witam');

      expect(text).toEqual('Hello');
    });

    it('should return pl translation', () => {
      const text = getTranslationByLocale('pl', 'Hello', 'Witam');

      expect(text).toEqual('Witam');
    });
  });
});
