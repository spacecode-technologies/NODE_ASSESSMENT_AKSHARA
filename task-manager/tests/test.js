const chai = require('chai')
const request = require('supertest')
require('../src/db/mongoose')
const User = require('../src/models/user')
const server = require('../src/index');
let should = chai.should();
const app = request.agent(server);


describe('users', () => {
  beforeEach((done) => {
      User.remove({}, (err) => {
         done();
      });
  });
  describe('user details saved', () => {
      it('posting user details', (done) => {
          let user = {
              name: "akshara",
              email: "akshara@gmail.com",
              password: "red@1234",
              role: "member",
              address: [{
                  state: "ts",
                  countryt: "India",
                  pin: 504106,
              }],
              company: [{
                  companyName: "ihs",
                  workEmail: "akshara@ihs.com",
                  workLocation: "hyd",
                  companySize: "20-50",
                  ats: "selected"
              }]
          }
          app
            .post('/users')
            .send(user)
            .end((err, res) => {
              res.status.should.be.equal(201);
              res.body.should.be.a('object');
              done();
            });
      });

  });
  describe('getting users', () => {
    it('it should GET all the users', (done) => {
      app
          .get('/users')
          .end((err, res) => {
            res.body.should.be.a('array');
            res.status.should.be.equal(200);
            done();
          });
    });
  });
  describe('/GET/:id user', () => {
    it('it should GET a user by the given id', (done) => {
        let user = new User({
          name: "akshara",
          email: "akshara@gmail.com",
          password: "red@1234",
          role: "member",
          address: [{
            state: "ts",
            countryt: "India",
            pin: 504106,
          }],
          company: [{
            companyName: "ihs",
            workEmail: "akshara@ihs.com",
            workLocation: "hyd",
            companySize: "20-50",
            ats: "selected"
          }]
        });
        user.save((err, user) => {
          app
          .get('/users/' + user.id)
          .send(user)
          .end((err, res) => {
                res.status.should.be.equal(200);
                res.body.should.be.a('object');
            done();
          });
        });

    });
  });
})