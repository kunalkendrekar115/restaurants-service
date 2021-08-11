const chai = require("chai");
const sinon = require("sinon");

const { RestaruntsModal } = require("../src/db");
const { getRestaurants, getRestaurantById } = require("../src/app/controllers");

const fakeData = {
  name: "Test Hotel",
  address: "test address",
  city: "test city",
  location: {
    lat: 1234,
    lng: 1254
  },
  menu: [
    {
      name: "test menu",
      price: 100
    }
  ],
  cuisine: ["test"]
};

function testAsync(callback) {
  setTimeout(() => {
    callback();
  }, 400);
}

describe("controllers", () => {
  describe("getRestaurants", () => {
    let req = { query: {} };
    const json = sinon.stub();
    const status = sinon.stub().returns({ json });
    let res = {
      status
    };
    var next = sinon.fake();

    it("Should return list of restaurants", (done) => {
      const handlerResult = getRestaurants(req, res, next);

      chai.expect(handlerResult).to.be.a("promise");

      testAsync(() => {
        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledWith(
          json,
          sinon.match({
            totalRecords: 5
          })
        );
        done();
      });
    });
  });

  describe("getRestaurants by id", () => {
    let req = { params: { id: "60fea0d36423db7aa4440b23" } };
    const json = sinon.stub();
    const status = sinon.stub().returns({ json });
    let res = {
      status
    };
    var next = sinon.fake();

    it("Should return restaurant by id", (done) => {
      const handlerResult = getRestaurantById(req, res, next);

      chai.expect(handlerResult).to.be.a("promise");

      testAsync(() => {
        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledWith(json, sinon.match([fakeData]));
        done();
      });
    });
  });
});
