const resetImportedMock = function resetImportedMock(mockedObj) {
  Object.keys(mockedObj).forEach(k => mockedObj[k].mockReset());
};

export default resetImportedMock;
