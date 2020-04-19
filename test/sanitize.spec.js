const sanitize = require('../sanitize');
const expect = require('chai').expect;

const doc = {
  title: 'Title',
  nested: {
    tag: 'hello'
  }
};

const settings = {
  title: { append: '-x' },
  'nested.tag': [{ prepend: 'y-' }, { append: '-x' }]
};

describe('sanitize', function () {
  it('Should correctly sanitize fields of the source document', function () {
    const newDoc = sanitize(doc, settings);
    expect(newDoc.title).to.equal('Title-x');
    expect(newDoc.nested.tag).to.equal('y-hello-x');
  });
});
