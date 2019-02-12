const { expect } = require('chai');
const NotebooksPresenter = require('../../../src/services/presenters/NotebooksPresenter');
const NotebookPresenter = require('../../../src/services/presenters/NotebookPresenter');
const notebookFactory = require('../../factories/notebookFactory');
const timesMap = require('../../helpers/timesMap');

describe('NotebooksPresenter', () => {
  describe('prototype.present()', () => {
    let notebooks;

    beforeEach(async () => {
      notebooks = await Promise.all(timesMap(3, () => notebookFactory.create('notebook')));
    });

    it('returns an array of presented notebooks', async () => {
      const presented = await NotebooksPresenter.init({ notebooks }).present();
      expect(presented).to.have.lengthOf(3);

      expect(
        presented[0],
      ).to.eql(
        await NotebookPresenter.init({ notebook: notebooks[0] }).present(),
      );
    });
  });
});
