const { expect } = require('chai');
const { OK, BAD_REQUEST } = require('http-status');
const mailchimp = require('../../lib/mailchimp');
const { instantiatePolly } = require('../helpers/polly');

describe('mailchimp', () => {
  describe('subscribe()', () => {
    describe('new email address', () => {
      it('adds the email to the mailchimp list', async () => {
        const polly = instantiatePolly({ name: 'mailchimp/newEmailAddress' });
        const { status, json } = await mailchimp.subscribe({ email: 'seth@tranquillapp.com' });
        expect(status).to.equal(OK);
        expect(json).to.include({ email_address: 'seth@tranquillapp.com', status: 'subscribed' });
        await polly.stop();
      });
    });

    describe('existing email address', () => {
      it('does not create a membership', async () => {
        const polly = instantiatePolly({ name: 'mailchimp/existingEmailAddress' });
        const { status, json } = await mailchimp.subscribe({ email: 'seth@tranquillapp.com' });
        expect(status).to.equal(BAD_REQUEST);
        expect(json).to.include({ title: 'Member Exists' });
        await polly.stop();
      });
    });

    describe('when there is an error', () => {
      it('returns an error response', async () => {
        const polly = instantiatePolly({ name: 'mailchimp/notAnEmail' });
        const { status, json } = await mailchimp.subscribe({ email: 'not an email' });
        expect(status).to.equal(BAD_REQUEST);
        expect(json).to.include({ title: 'Invalid Resource' });
        await polly.stop();
      });
    });
  });
});
