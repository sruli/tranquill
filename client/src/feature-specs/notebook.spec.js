import api from '../api';
import mountApp from '../specHelpers/mountApp';

jest.mock('../api');

describe('notebook', () => {
  let wrapper;

  beforeEach(async () => {
    window.scrollTo = () => {};
    api.getNotebook.mockResolvedValue({ name: 'Notebook' });
    const { app } = await mountApp({ path: '/notebooks/1' });
    wrapper = app.update();
  });

  it('displays the notebook name', () => {
    expect(wrapper.find('NameSection').find('input').prop('value')).toEqual('Notebook');
  });
});
