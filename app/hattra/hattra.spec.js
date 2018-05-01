/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
("use strict");
const config = require("config");
const chai = require("chai");
chai.use(require("chai-http"));
chai.use(require("sinon-chai"));
const routes = require("../app");
const knex = require("../components/knex");
const { template, generateTest } = require("../common/helper");

const expect = chai.expect;

describe("Hattra handling", () => {
  const hattra = {
    id_hattra: 1,
    id_layanan: 1,
    nama: "Ray Andrew",
    ijin_hattra: "654321",
    wrong_id_hattra: 999,
    wrong_id_layanan: 999
  };

  const paginateProps = [
    "data",
    "currentPage",
    "perPage",
    "lastPage",
    "totalCount",
    "sort"
  ];

  const hattraColumns = [
    "id_hattra",
    "id_layanan",
    "nama",
    "ijin_hattra",
    "verified",
    "tanggal_verified",
    "created_at",
    "updated_at"
  ];

  const username = {
    provinsi: "prov_jawabarat",
    kota: "kota_tasik",
    puskesmas: "pusk_tasik",
    kestrad: "kestrad_tasik"
  };

  const templateTest = [
    template`should ${"should"} get list of hattra if ${"role"} is logged in`,
    template`should ${"should"} get list of hattra by searching if ${"role"} is logged in`,
    template`should ${"should"} get list of hattras based on id of layanan by ${"role"}`,
    template`should ${"should"} edit hattra if ${"role"} is logged in`,
    {
      desc: template`details of specific hattra by ${"role"}`,
      test: [
        template`should ${"should"} get details of specific wrong id of hattra because resource not found`,
        template`should ${"should"} get details of specific correct id of hattra`
      ]
    },
    {
      desc: template`list of hattras based on username of user by ${"role"}`,
      test: [
        template`should ${"should"} get list of hattras based on username of provinsi`,
        template`should ${"should"} get list of hattras based on username of kota`,
        template`should ${"should"} get list of hattras based on username of puskesmas`,
        template`should ${"should"} get list of hattras based on username of kestrad`
      ]
    },
    {
      desc: template`hattra verification by ${"role"}`,
      test: [
        template`should ${"should"} verify hattra`,
        template`should ${"should"} unverify hattra`
      ]
    }
  ];

  const authenticatedTest = [
    {
      credentials: {
        username: "administrator",
        password: "administrator",
        role: "admin"
      },
      tests: [
        {
          url: "/hattra",
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.have.ownProperty("data");
            expect(result.body.data).to.be.an("array");
            expect(result.body).to.have.all.keys(paginateProps);
          }
        },
        {
          url: "/hattra/search?search=ray",
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("array");
          }
        },
        {
          url: `/hattra/byLayanan/${hattra.id_layanan}`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("object");
            expect(result.body).to.include.all.keys(paginateProps);
          }
        },
        {
          props: { should: "not" },
          url: `/hattra/${hattra.id_hattra}`,
          payload: hattra,
          method: `patch`,
          check: result => {
            expect(result).to.have.status(403);
            expect(result.body.message).to.equal("Forbidden");
            expect(result.body.name).to.equal("ForbiddenError");
          }
        },
        [
          {
            props: { should: "not" },
            url: `/hattra/${hattra.wrong_id_hattra}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(404);
              expect(result.body.message).to.equal("Hattra not found.");
              expect(result.body.name).to.equal("NotFoundError");
            }
          },
          {
            url: `/hattra/${hattra.id_hattra}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(hattraColumns);
            }
          }
        ],
        [
          {
            url: `/hattra/byUser/${username.provinsi}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(paginateProps);
            }
          },
          {
            url: `/hattra/byUser/${username.kota}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(paginateProps);
            }
          },
          {
            url: `/hattra/byUser/${username.puskesmas}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(paginateProps);
            }
          },
          {
            url: `/hattra/byUser/${username.kestrad}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(paginateProps);
            }
          }
        ],
        [
          {
            props: { should: "not" },
            url: `/hattra/${hattra.id_hattra}/verification`,
            method: `patch`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            props: { should: "not" },
            url: `/hattra/${hattra.id_hattra}/verification/unverify`,
            method: `patch`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          }
        ]
      ]
    },
    {
      credentials: {
        username: "prov_jawabarat",
        password: "prov_jawabarat",
        role: "provinsi"
      },
      tests: [
        {
          url: `/hattra`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.have.ownProperty("data");
            expect(result.body.data).to.be.an("array");
            expect(result.body).to.have.all.keys(paginateProps);
          }
        },
        {
          url: `/hattra/search?search=ray`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("array");
          }
        },
        {
          url: `/hattra/byLayanan/${hattra.id_layanan}`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("object");
            expect(result.body).to.include.all.keys(paginateProps);
          }
        },
        {
          props: { should: "not" },
          url: `/hattra/${hattra.id_hattra}`,
          method: `patch`,
          payload: hattra,
          check: result => {
            expect(result).to.have.status(403);
            expect(result.body.message).to.equal("Forbidden");
            expect(result.body.name).to.equal("ForbiddenError");
          }
        },
        [
          {
            props: { should: "not" },
            url: `/hattra/${hattra.wrong_id_hattra}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(404);
              expect(result.body.message).to.equal("Hattra not found.");
              expect(result.body.name).to.equal("NotFoundError");
            }
          },
          {
            url: `/hattra/${hattra.id_hattra}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(hattraColumns);
            }
          }
        ],
        [
          {
            props: { should: "not" },
            url: `/hattra/byUser/${username.provinsi}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            url: `/hattra/byUser/${username.kota}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(paginateProps);
            }
          },
          {
            url: `/hattra/byUser/${username.puskesmas}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(paginateProps);
            }
          },
          {
            url: `/hattra/byUser/${username.kestrad}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(paginateProps);
            }
          }
        ],
        [
          {
            props: { should: "not" },
            url: `/hattra/${hattra.id_hattra}/verification`,
            method: `patch`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            props: { should: "not" },
            url: `/hattra/${hattra.id_hattra}/verification/unverify`,
            method: `patch`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          }
        ]
      ]
    },
    {
      credentials: {
        username: "kota_tasik",
        password: "kota_tasik",
        role: "kota"
      },
      tests: [
        {
          url: `/hattra`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.have.ownProperty("data");
            expect(result.body.data).to.be.an("array");
            expect(result.body).to.have.all.keys(paginateProps);
          }
        },
        {
          url: `/hattra/search?search=ray`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("array");
          }
        },
        {
          url: `/hattra/byLayanan/${hattra.id_layanan}`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("object");
            expect(result.body).to.include.all.keys(paginateProps);
          }
        },
        {
          props: { should: "not" },
          url: `/hattra/${hattra.id_hattra}`,
          method: `patch`,
          payload: hattra,
          check: result => {
            expect(result).to.have.status(403);
            expect(result.body.message).to.equal("Forbidden");
            expect(result.body.name).to.equal("ForbiddenError");
          }
        },
        [
          {
            props: { should: "not" },
            url: `/hattra/${hattra.wrong_id_hattra}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(404);
              expect(result.body.message).to.equal("Hattra not found.");
              expect(result.body.name).to.equal("NotFoundError");
            }
          },
          {
            url: `/hattra/${hattra.id_hattra}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(hattraColumns);
            }
          }
        ],
        [
          {
            props: { should: "not" },
            url: `/hattra/byUser/${username.provinsi}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            props: { should: "not" },
            url: `/hattra/byUser/${username.kota}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            url: `/hattra/byUser/${username.puskesmas}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(paginateProps);
            }
          },
          {
            url: `/hattra/byUser/${username.kestrad}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(paginateProps);
            }
          }
        ],
        [
          {
            url: `/hattra/${hattra.id_hattra}/verification`,
            method: `patch`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body.affectedRowCount).to.equal(1);
            }
          },
          {
            url: `/hattra/${hattra.id_hattra}/verification/unverify`,
            method: `patch`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body.affectedRowCount).to.equal(1);
            }
          }
        ]
      ]
    },
    {
      credentials: {
        username: "pusk_tasik",
        password: "pusk_tasik",
        role: "puskesmas"
      },
      tests: [
        {
          url: `/hattra`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.have.ownProperty("data");
            expect(result.body.data).to.be.an("array");
            expect(result.body).to.have.all.keys(paginateProps);
          }
        },
        {
          url: `/hattra/search?search=ray`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("array");
          }
        },
        {
          url: `/hattra/byLayanan/${hattra.id_layanan}`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("object");
            expect(result.body).to.include.all.keys(paginateProps);
          }
        },
        {
          url: `/hattra/${hattra.id_hattra}`,
          method: `patch`,
          payload: hattra,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("object");
            expect(result.body.affectedRowCount).to.equal(1);
          }
        },
        [
          {
            props: { should: "not" },
            url: `/hattra/${hattra.wrong_id_hattra}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(404);
              expect(result.body.message).to.equal("Hattra not found.");
              expect(result.body.name).to.equal("NotFoundError");
            }
          },
          {
            url: `/hattra/${hattra.id_hattra}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(hattraColumns);
            }
          }
        ],
        [
          {
            props: { should: "not" },
            url: `/hattra/byUser/${username.provinsi}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            props: { should: "not" },
            url: `/hattra/byUser/${username.kota}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            props: { should: "not" },
            url: `/hattra/byUser/${username.puskesmas}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            url: `/hattra/byUser/${username.kestrad}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(paginateProps);
            }
          }
        ],
        [
          {
            props: { should: "not" },
            url: `/hattra/${hattra.id_hattra}/verification`,
            method: `patch`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            props: { should: "not" },
            url: `/hattra/${hattra.id_hattra}/verification/unverify`,
            method: `patch`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          }
        ]
      ]
    },
    {
      credentials: {
        username: "kestrad_tasik",
        password: "kestrad_tasik",
        role: "kestrad"
      },
      tests: [
        {
          url: `/hattra`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.have.ownProperty("data");
            expect(result.body.data).to.be.an("array");
            expect(result.body).to.have.all.keys(paginateProps);
          }
        },
        {
          url: `/hattra/search?search=ray`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("array");
          }
        },
        {
          url: `/hattra/byLayanan/${hattra.id_layanan}`,
          method: `get`,
          check: result => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.an("object");
            expect(result.body).to.include.all.keys(paginateProps);
          }
        },
        {
          props: { should: "not" },
          url: `/hattra/${hattra.id_hattra}`,
          method: `patch`,
          payload: hattra,
          check: result => {
            expect(result).to.have.status(403);
            expect(result.body.message).to.equal("Forbidden");
            expect(result.body.name).to.equal("ForbiddenError");
          }
        },
        [
          {
            props: { should: "not" },
            url: `/hattra/${hattra.wrong_id_hattra}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(404);
              expect(result.body.message).to.equal("Hattra not found.");
              expect(result.body.name).to.equal("NotFoundError");
            }
          },
          {
            url: `/hattra/${hattra.id_hattra}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(200);
              expect(result.body).to.be.an("object");
              expect(result.body).to.include.all.keys(hattraColumns);
            }
          }
        ],
        [
          {
            props: { should: "not" },
            url: `/hattra/byUser/${username.provinsi}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            props: { should: "not" },
            url: `/hattra/byUser/${username.kota}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            props: { should: "not" },
            url: `/hattra/byUser/${username.puskesmas}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            props: { should: "not" },
            url: `/hattra/byUser/${username.kestrad}`,
            method: `get`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          }
        ],
        [
          {
            props: { should: "not" },
            url: `/hattra/${hattra.id_hattra}/verification`,
            method: `patch`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          },
          {
            props: { should: "not" },
            url: `/hattra/${hattra.id_hattra}/verification/unverify`,
            method: `patch`,
            check: result => {
              expect(result).to.have.status(403);
              expect(result.body.message).to.equal("Forbidden");
              expect(result.body.name).to.equal("ForbiddenError");
            }
          }
        ]
      ]
    }
  ];

  // Hattra api test by not logged in user
  describe("not logged in", () => {
    before(() =>
      knex.migrate
        .rollback()
        .then(() => knex.migrate.latest())
        .then(() => knex.seed.run())
    );

    after(() => knex.migrate.rollback());

    // Get /hattra
    it("should not get list of hattra if kestrad or higher is not logged in", () =>
      chai
        .request(routes)
        .get(`${config.get("routePrefix")}/hattra`)
        .then(res => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal("Unauthorized");
          expect(res.body.name).to.equal("UnauthorizedError");
        }));

    // Get /hattra/search
    it("should not get list of hattra by searching if user is not logged in", () =>
      chai
        .request(routes)
        .get(`${config.get("routePrefix")}/hattra/search`)
        .then(res => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal("Not logged in.");
          expect(res.body.name).to.equal("UnauthorizedError");
        }));

    // Get /hattra/:id_hattra
    it("should unauthorized to get details of specific hattra by not logged in user", () =>
      chai
        .request(routes)
        .get(`${config.get("routePrefix")}/hattra/${hattra.id_hattra}`)
        .then(res => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal("Unauthorized");
          expect(res.body.name).to.equal("UnauthorizedError");
        }));

    // Get /hattra/byLayanan/:id_layanan
    it("should unauthorized to get list of hattras based on id of layanan by not logged in user", () =>
      chai
        .request(routes)
        .get(
          `${config.get("routePrefix")}/hattra/byLayanan/${hattra.id_layanan}`
        )
        .then(res => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal("Unauthorized");
          expect(res.body.name).to.equal("UnauthorizedError");
        }));

    // Patch /hattra/:id_hattra
    it("should not edit hattra if puskesmas is not logged in", () =>
      chai
        .request(routes)
        .patch(`${config.get("routePrefix")}/hattra/${hattra.id_hattra}`)
        .send(hattra)
        .then(res => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal("Unauthorized");
          expect(res.body.name).to.equal("UnauthorizedError");
        }));

    // Patch /hattra/:id_hattra/verification
    it("should unauthorized to verify hattra by not logged in user", () =>
      chai
        .request(routes)
        .patch(
          `${config.get("routePrefix")}/hattra/${
            hattra.id_hattra
          }/verification/unverify`
        )
        .then(res => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal("Unauthorized");
          expect(res.body.name).to.equal("UnauthorizedError");
        }));
  });

  authenticatedTest.forEach(auth => {
    describe(`authenticated role : ${auth.credentials.role}`, () => {
      const authenticated = chai.request.agent(routes);

      before(() =>
        knex.migrate
          .rollback()
          .then(() => knex.migrate.latest())
          .then(() => knex.seed.run())
          .then(() =>
            authenticated
              .post(`${config.get("routePrefix")}/session`)
              .send(auth.credentials)
          )
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.ownProperty("username");
            expect(res.body).to.have.ownProperty("status");
          })
      );

      after(() =>
        authenticated.del(`${config.get("routePrefix")}/session`).then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Logged out successfully.");
        })
      );

      generateTest(authenticated, auth.credentials, templateTest, auth.tests);
    });
  });
});
