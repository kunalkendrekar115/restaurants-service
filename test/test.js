const chai = require("chai");
const chaiHttp = require("chai-http");
const express = require("express");
const sinon = require("sinon");

const { logger, errorHandler } = require("restaurants-utils");

const { restaruntsRoutes } = require("../src/app/routes");
const { RestaruntsModal } = require("../src/db");

chai.use(chaiHttp);
chai.should();

const app = express();
let RestaurantModalStub1, RestaurantModalStub2;
let server = null;

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

before(() => {
  app.use(express.json());
  app.use("/restaurants", restaruntsRoutes);
  app.use(errorHandler);

  server = app.listen(4444, () =>
    logger.info("Running Test Restaurants  API Services on PORT 4444")
  );
});

after(() => {
  server.close();
});

beforeEach(() => {
  RestaurantModalStub1 = sinon.stub(RestaruntsModal, "find").returns([{ ...fakeData }]);
  RestaurantModalStub2 = sinon.stub(RestaruntsModal, "count").returns(5);
});

afterEach(() => {
  RestaurantModalStub1.restore();
  RestaurantModalStub2.restore();
});

describe("Restaurants", () => {
  describe("Fetch Restaurants", () => {
    it("should get restaurants", async () => {
      chai
        .request(app)
        .get("/restaurants")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
    });

    it("should get restaurants by search", async () => {
      chai
        .request(app)
        .get("/restaurants?search=Veg Thali")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
    });

    it("should filter restaurants by city", async () => {
      chai
        .request(app)
        .post("/restaurants/filter")
        .set("content-type", "application/json")
        .set({ city: "Pune" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
    });
  });

  describe("getRestaurant By Id", () => {
    it("should get restaurants by id", async () => {
      const id = "60fea0d36423db7aa4440b23";
      chai
        .request(app)
        .get(`/restaurants/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
    });

    const mock = null;

    it("should through 404 for not found restaurant", async () => {
      const id = "60fea0d36423db7aa4440b29";
      RestaurantModalStub1.restore();
      RestaurantModalStub2.restore();
      RestaurantModalStub1 = sinon.stub(RestaruntsModal, "find").returns([]);
      chai
        .request(app)
        .get(`/restaurants/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
        });
    });

    it("should through 500 for db error", async () => {
      const id = "60fea0d36423db7aa44";

      RestaurantModalStub1.restore();
      RestaurantModalStub2.restore();

      RestaurantModalStub1 = sinon.stub(RestaruntsModal, "find").throws(new Error("DB Error"));
      chai
        .request(app)
        .get(`/restaurants/${id}`)
        .end((err, res) => {
          res.should.have.status(500);
        });
    });
  });

  describe("Add new restaurant", () => {
    RestaurantModalStub1 = sinon.stub(RestaruntsModal.prototype, "save").returns({ id: "test" });

    it("should successfully add restaurant", async () => {
      chai
        .request(app)
        .post(`/restaurants`)
        .set("Content-Type", "application/json")
        .send(fakeData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
    });
  });

  describe("update restaurant", () => {
    RestaurantModalStub1 = sinon.stub(RestaruntsModal, "findById").callsFake((id) => {
      if (id === "adefgew") return { name: "test" };
      return null;
    });

    RestaurantModalStub2 = sinon
      .stub(RestaruntsModal, "findByIdAndUpdate")
      .returns({ id: "Test Hotel", name: "test" });

    const fakeUpdateData = {
      name: "Test Hotel"
    };

    it("should successfully update restaurant", async () => {
      const restaurantId = "adefgew";

      chai
        .request(app)
        .patch(`/restaurants/${restaurantId}`)
        .set("Content-Type", "application/json")
        .send(fakeUpdateData)
        .end(async (err, res) => {
          const data = await res.json();
          chai.expect(data.name).to.equal(fakeUpdateData.name);
          res.should.have.status(200);
        });
    });

    it("should through 404 for invalid id", async () => {
      const id = "invalid_id";

      chai
        .request(app)
        .patch(`/restaurants/${id}`)
        .set("Content-Type", "application/json")
        .send(fakeData)
        .end((err, res) => {
          res.should.have.status(404);
        });
    });
  });
});
