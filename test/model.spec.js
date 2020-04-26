const expect = require('chai').expect;
const model = require('../index');

const testData = {
  name: 'Colin ',
  age: '17',
  telephones: {
    home: '123',
    mobile: '456'
  },
  role: 'admin',
  rename: 'test'
};

const testModelOptions = {
  blacklist: ['role'],
  customSanitizers: {
    addMister: function (data) {
      return 'Mr. ' + data;
    }
  },
  sanitize: {
    name: ['trim', 'toUpperCase', 'addMister'],
    age: 'toInt',
    'telephones.home': { prepend: '+1 ' },
    'telephones.mobile': { prepend: '+1 ' }
  },
  customValidators: {
    checkMiss: function (value) {
      const regex = /^Ms\.\s/;
      if (!regex.test(value)) {
        return 'oh snap, ' + value + ' is not a Miss!';
      }
    }
  },
  validate: {
    name: {
      presence: true,
      checkMiss: true
    },
    age: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 21,
        lessThan: 150,
        message: 'invalid age'
      }
    },
    'telephones.home': {
      presence: true
    },
    'telephones.work': {
      presence: true
    }
  },
  static: {
    role: 'user'
  },
  rename: {
    rename: 'renamed'
  }
};

describe('Model', function () {
  it('Should behave as expected synchronously', function () {
    const user = new model(testModelOptions);
    const testUser = new user(testData);
    const results = testUser.process().results;
    expect(results.name).to.equal('Mr. COLIN');
    expect(results.age).to.be.a('number');
    expect(results.telephones.home).to.equal('+1 123');
    expect(results.role).to.equal('user');
    expect(testUser.errors).to.have.property('name');
    expect(testUser.errors).to.have.property('age');
    expect(testUser.errors).to.have.property('telephones.work');
    expect(results.renamed).to.equal('test');
    expect(results).not.to.have.property('rename');
  });

  it('Should whitelist objects correctly', function () {
    const options = {
      whitelist: ['name', 'telephones.home']
    };
    const user = new model(options);
    const testUser = new user(testData);
    const results = testUser.whitelist().results;
    expect(results).to.have.property('name');
    expect(results).to.have.nested.property('telephones.home');
    expect(results).to.not.have.property('age');
  });

  it('Should merge the results on top of another object', function () {
    const user = new model(testModelOptions);
    const testUser = new user(testData);
    const original = {
      name: 'Bob',
      secret: "don't tell",
      telephones: {
        office: '789'
      }
    };
    const results = testUser.merge(original).results;
    expect(results.name).to.equal('Colin ');
    expect(results.secret).to.equal("don't tell");
    expect(results.telephones.home).to.equal('123');
    expect(results.telephones.office).to.equal('789');
  });

  it('Should behave as expected asynchronously', function (done) {
    testModelOptions.async = true;
    const user = new model(testModelOptions);
    let testUser = new user(testData);
    testUser
      .process()
      .then(
        function () {
          throw new Error('Validation promise should have been rejected.');
        },
        function (errors) {
          expect(errors).to.have.property('name');
          expect(errors).to.have.property('age');
          expect(errors).to.have.property('telephones.work');
        }
      )
      .finally(function () {
        testUser = new user(testData);
        testUser.sanitize().then(function (results) {
          expect(results.name).to.equal('Mr. COLIN');
          done();
        });
      });
  });
});
