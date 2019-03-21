import api from '../api';
import mountApp from '../spec/helpers/mountApp';
import wait from '../spec/helpers/wait';
import resetImportedMock from '../spec/helpers/resetImportedMock';
import { setCookie, cookieToObject } from '../utilities/cookieUtils';
import getNotebookResponse from '../spec/fixtures/apiResponses/notebooks';

jest.mock('../api');

describe('signing out', () => {
  let wrapper;

  beforeEach(async () => {
    setCookie({ authenticated: true });
    api.getNotebook.mockResolvedValue(getNotebookResponse());
    const { app } = await mountApp({ path: '/notebooks/1' });
    wrapper = app.update();
    const signOutLink = wrapper.find('nav').find('Button');
    signOutLink.simulate('click');
    await wait();
    wrapper.update();
  });

  afterEach(() => {
    wrapper.unmount();
    resetImportedMock(api);
  });

  it('sets authenticated cookie to false', () => {
    expect(cookieToObject().authenticated).toBe(false);
  });

  it('redirects to the login path', () => {
    expect(wrapper.find('SignIn')).toHaveLength(1);
    expect(wrapper.find('Notebook')).toHaveLength(0);
  });

  it('makes a request to the server to delete the authJWT cookie', () => {
    expect(api.signOutUser).toHaveBeenCalled();
  });
});
