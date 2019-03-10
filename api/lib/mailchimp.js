const fetch = require('node-fetch');

const baseURL = 'https://us20.api.mailchimp.com/3.0';

const subscribe = async function subscribe({ email }) {
  const response = await fetch(`${baseURL}/lists/6006b2d7ac/members`, {
    method: 'POST',
    headers: { Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}` },
    body: JSON.stringify({ email_address: email, status: 'subscribed' }),
  });

  const json = await response.json();
  const { status } = response;

  return { status, json };
};

module.exports = {
  subscribe,
};
