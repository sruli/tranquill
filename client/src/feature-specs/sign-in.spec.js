import api from '../api';
import mountApp from '../spec/helpers/mountApp';
import wait from '../spec/helpers/wait';
import resetImportedMock from '../spec/helpers/resetImportedMock';
import getNotebookResponse from '../spec/fixtures/apiResponses/notebooks';

jest.mock('../api');

const fillAndSubmitForm = async function fillAndSubmitForm({ wrapper, email, password }) {
  const form = wrapper.find('form');
  form.find('input[type="email"]').simulate('change', { target: { value: email } });
  form.find('input[type="password"]').simulate('change', { target: { value: password } });
  await wait();
  form.simulate('submit');
};

describe('sign-in', () => {
  describe('when submitting the form successfully', () => {
    let wrapper;

    beforeEach(async () => {
      window.scrollTo = () => {};
      api.signInUser.mockResolvedValue({ ok: true, status: 200 });
      api.getNotebooks.mockResolvedValue([{ href: 'http://localhost:8080/notebooks/1' }]);
      api.getNotebook.mockResolvedValue(getNotebookResponse({ name: 'Notebook', id: 1 }));
      const { app } = await mountApp({ path: '/sign-in' });
      wrapper = app.update();
      await fillAndSubmitForm({ wrapper, email: 'email@example.com', password: 'password' });
      await wait();
      wrapper.update();
    });

    afterEach(() => {
      resetImportedMock(api);
      wrapper.unmount();
    });

    it('makes a login request with the email and password', () => {
      expect(api.signInUser).toHaveBeenCalledWith({ email: 'email@example.com', password: 'password' });
    });

    it('redirects to a notebook', () => {
      expect(wrapper.find('Notebook')).toHaveLength(1);
    });
  });

  describe('when form entries are not valid', () => {
    let wrapper;

    beforeEach(async () => {
      api.signInUser.mockResolvedValue({ ok: true, status: 200 });
      const { app } = await mountApp({ path: '/sign-in' });
      wrapper = app.update();
      await fillAndSubmitForm({ wrapper, email: '', password: '' });
      await wait();
      wrapper.update();
    });

    afterEach(() => {
      resetImportedMock(api);
      wrapper.unmount();
    });

    it('does not make an api request', () => {
      expect(api.signInUser).not.toHaveBeenCalled();
    });

    it('displays the errors', () => {
      const errorElem = wrapper.find('Errors');
      expect(errorElem.text()).toMatch(/Enter an email/);
      expect(errorElem.text()).toMatch(/Enter a password/);
    });
  });

  describe('when there is a client error', () => {
    let wrapper;

    beforeEach(async () => {
      api.signInUser.mockResolvedValue({ ok: false, status: 400 });
      const { app } = await mountApp({ path: '/sign-in' });
      wrapper = app.update();
      await fillAndSubmitForm({ wrapper, email: 'email@example.com', password: 'password' });
      await wait();
      wrapper.update();
    });

    afterEach(() => {
      resetImportedMock(api);
      wrapper.unmount();
    });

    it('displays a client error', () => {
      const errorElem = wrapper.find('Errors');
      expect(errorElem.text()).toMatch(/That email\/password combination is not valid/);
    });
  });

  describe('when there is a server error', () => {
    let wrapper;

    beforeEach(async () => {
      api.signInUser.mockResolvedValue({ ok: false, status: 500 });
      const { app } = await mountApp({ path: '/sign-in' });
      wrapper = app.update();
      await fillAndSubmitForm({ wrapper, email: 'email@example.com', password: 'password' });
      await wait();
      wrapper.update();
    });

    afterEach(() => {
      resetImportedMock(api);
      wrapper.unmount();
    });

    it('displays a server error', () => {
      const errorElem = wrapper.find('Errors');
      expect(errorElem.text()).toMatch(/Something went wrong\. Try again\./);
    });
  });
});
