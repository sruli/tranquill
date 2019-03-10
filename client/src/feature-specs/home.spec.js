import api from '../api';
import mountApp from '../spec/helpers/mountApp';
import wait from '../spec/helpers/wait';
import resetImportedMock from '../spec/helpers/resetImportedMock';

jest.mock('../api');

describe('home', () => {
  describe('email signup form', () => {
    describe('on page load', () => {
      let wrapper;

      beforeEach(async () => {
        const { app } = await mountApp();
        wrapper = app.update();
      });

      afterEach(() => {
        wrapper.unmount();
      });

      it('loads with the correct button state', () => {
        const button = wrapper.find('form').find('Button');
        expect(button.prop('disabled')).toBe(false);
        expect(button.text()).toMatch(/add me/i);
      });
    });

    describe('submitting the form', () => {
      const fillAndSubmitForm = async function fillAndSubmitForm({ wrapper, email }) {
        const form = wrapper.find('form');
        form.find('input[type="email"]').simulate('change', { target: { value: email } });
        await wait();
        form.simulate('submit');
        await wait();
        wrapper.update();
      };

      describe('happy path', () => {
        let wrapper;

        beforeEach(async () => {
          api.submitEmailSignup.mockResolvedValue({ status: 'subscribed' });

          const { app } = await mountApp();
          wrapper = app.update();

          await fillAndSubmitForm({ wrapper, email: 'email@example.com' });
        });

        afterEach(() => {
          resetImportedMock(api);
          wrapper.unmount();
        });

        it('submits the email signup form', () => {
          expect(api.submitEmailSignup).toHaveBeenCalledWith({ email: 'email@example.com' });
        });

        it('sets the correct button state', () => {
          const button = wrapper.find('form').find('Button');
          expect(button.prop('disabled')).toBe(true);
          expect(button.text()).toMatch(/added/i);
        });

        it('does not show an error', () => {
          expect(wrapper.find('#formError')).toHaveLength(0);
        });
      });

      describe('when there is an error', () => {
        let wrapper;

        beforeEach(async () => {
          api.submitEmailSignup.mockResolvedValue({ status: 400 });

          const { app } = await mountApp();
          wrapper = app.update();

          await fillAndSubmitForm({ wrapper, email: 'email@example.com' });
        });

        afterEach(() => {
          resetImportedMock(api);
          wrapper.unmount();
        });

        it('sets the correct button state', () => {
          const button = wrapper.find('form').find('Button');
          expect(button.prop('disabled')).toBe(true);
          expect(button.text()).toMatch(/add me/i);
        });

        it('displays the error', () => {
          const error = wrapper.find('#formError');
          expect(error).toHaveLength(1);
          expect(error.text()).toMatch(/Something went wrong\. Try again\./);
        });
      });
    });
  });
});
