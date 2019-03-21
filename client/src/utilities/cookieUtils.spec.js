import { setCookie, cookieToObject } from './cookieUtils';

describe('cookieUtils', () => {
  describe('setCookie()', () => {
    it('sets a cookie', () => {
      setCookie({ authenticated: true });
      expect(document.cookie).toMatch(/authenticated=true/);
    });

    it('sets multiple cookies', () => {
      setCookie({ first: 'first', second: 'second' });
      expect(document.cookie).toMatch(/first=first/);
      expect(document.cookie).toMatch(/second=second/);
    });
  });

  describe('cookieToObject()', () => {
    it('returns cookies as an object', () => {
      document.cookie = 'foo=foo';
      document.cookie = 'bar=bar';
      expect(cookieToObject()).toMatchObject({ foo: 'foo', bar: 'bar' });
    });

    it('parses boolean values', () => {
      document.cookie = 'authenticated=false';
      document.cookie = 'awesome=true';
      document.cookie = 'name=Sruli';
      const { authenticated, awesome, name } = cookieToObject();
      expect(authenticated).toBe(false);
      expect(awesome).toBe(true);
      expect(name).toEqual('Sruli');
    });
  });
});
