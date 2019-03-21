import { UNAUTHORIZED } from 'http-status';
import api from '../api';
import { cookieToObject } from '../utilities/cookieUtils';
import { stubAuth, unstubAuth } from '../spec/helpers/authStubs';
import mountApp from '../spec/helpers/mountApp';
import getNotebookResponse from '../spec/fixtures/apiResponses/notebooks';

jest.mock('../api');

describe('authenticated requests', () => {
  beforeEach(() => stubAuth());
  afterEach(() => unstubAuth());

  describe('when response status is UNAUTHORIZED', () => {
    let wrapper;

    beforeEach(async () => {
      api.getNotebook.mockResolvedValue({ status: UNAUTHORIZED });
      const { app } = await mountApp({ path: '/notebooks/1' });
      wrapper = app.update();
    });

    it('sets the authenticated cookie to false', async () => {
      expect(cookieToObject().authenticated).toBe(false);
    });

    it('redirects to the sign in page', () => {
      expect(wrapper.find('SignIn')).toHaveLength(1);
    });
  });

  describe('when response status is not UNAUTHORIZED', () => {
    let wrapper;

    beforeEach(async () => {
      api.getNotebook.mockResolvedValue(getNotebookResponse({ name: 'Notebook', id: 1 }));
      const { app } = await mountApp({ path: '/notebooks/1' });
      wrapper = app.update();
    });

    it('renders the page', () => {
      expect(wrapper.find('Notebook')).toHaveLength(1);
    });
  });
});
