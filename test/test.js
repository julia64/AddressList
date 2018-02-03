let chai = require('chai');
let expect = require('chai').expect;
const debug = require('debug')('TEST');

chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));

let baseUrl = 'http://localhost:8064';
let addContactsJsonSchema = {
    title: 'Add Contacts Response JSON Schema',
    type: 'object',
    required: ['result'],
    properties: {
        result: {
            type: 'object',
            required: ['name', 'tel', 'email'],
            properties: {
                name: {type: 'string'},
                tel: {type: 'string'},
                email: {type: 'string'},
            }
        }
    }
};

describe('Contacts API', function() {
    it('Add Contact', function () {
    let testBody = {
        name: 'dian',
        tel: '18827054817',
        email: 'email@email.com'
    };
    chai.request(baseUrl)
        .post('/add')
        .send(testBody)
        .end(function(err, res) {
        if (err) {
            debug(`error => ${err.stack}`);
            done(err);
        }else{
            expect(res.body).to.be.jsonSchema(addContactsJsonSchema);
    //debug(`response => ${JSON.stringify(res.body, null, 2)}`);
    done();
    }
})
});
});
