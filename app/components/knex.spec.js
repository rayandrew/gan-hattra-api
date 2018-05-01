/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
"use strict";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

const knex = require("./knex.js");

describe("Knex extensions", () => {
  describe("Filter", () => {
    it("should produce correct SQL for a single simple column filter", () => {
      const filterQuery = {
        column1: "filter query 1"
      };
      const filters = {
        column1: {},
        column2: {},
        column3: {}
      };
      const sql = knex
        .select("column1", "column2")
        .from("table")
        .filter(filterQuery, filters)
        .toString()
        .replace(/"/g, "`");
      expect(sql).to.be.equal(
        "select `column1`, `column2` from `table` where (`column1` like '%filter query 1%')"
      );
    });

    it("should produce correct SQL if no filter is used", () => {
      const filterQuery = {};
      const filters = {
        column1: {},
        column2: {},
        column3: {}
      };
      const sql = knex
        .select("column1", "column2")
        .from("table")
        .filter(filterQuery, filters)
        .toString()
        .replace(/"/g, "`");
      expect(sql).to.be.equal("select `column1`, `column2` from `table`");
    });

    it("should produce correct SQL if no filter is provided", () => {
      const filterQuery = {
        column1: "filter query 1",
        column3: "filter query 2"
      };
      const filters = {};
      const sql = knex
        .select("column1", "column2")
        .from("table")
        .filter(filterQuery, filters)
        .toString()
        .replace(/"/g, "`");
      expect(sql).to.be.equal("select `column1`, `column2` from `table`");
    });

    it("should produce correct SQL for multiple simple column filters", () => {
      const filterQuery = {
        column1: "filter query 1",
        column3: "filter query 2"
      };
      const filters = {
        column1: {},
        column2: {},
        column3: {}
      };
      const sql = knex
        .select("column1", "column2")
        .from("table")
        .filter(filterQuery, filters)
        .toString()
        .replace(/"/g, "`");
      expect(sql).to.be.equal(
        "select `column1`, `column2` from `table` where (`column1` like '%filter query 1%' and `column3` like '%filter query 2%')"
      );
    });

    it("should produce correct SQL for multiple filters with custom operators", () => {
      const filterQuery = {
        column1: "filter query 1",
        column2: "filter query 2",
        column3: "filter query 3",
        thisIsNotAColumnName: "not a filter query"
      };
      const filters = {
        column1: { operator: "=" },
        column2: { operator: ">=" },
        column3: { operator: "contains" }
      };
      const sql = knex
        .select("column1", "column2")
        .from("table")
        .filter(filterQuery, filters)
        .toString()
        .replace(/"/g, "`");
      expect(sql).to.be.equal(
        "select `column1`, `column2` from `table` where (`column1` = 'filter query 1' and `column2` >= 'filter query 2' and `column3` like '%filter query 3%')"
      );
    });

    it("should produce correct SQL for multiple named filters with custom operators", () => {
      const filterQuery = {
        containsColumn3: "filter query 3",
        equalsColumn2: "filter query 2",
        notColumn1: "filter query 1",
        thisIsNotAFilterName: "not a filter query",
        column1: "not a filter query",
        column3: "not a filter query"
      };
      const filters = {
        notColumn1: { field: "column1", operator: "<>" },
        equalsColumn2: { field: "column2", operator: "=" },
        containsColumn3: { field: "column3", operator: "contains" }
      };
      const sql = knex
        .select("column1", "column2")
        .from("table")
        .filter(filterQuery, filters)
        .toString()
        .replace(/"/g, "`");
      expect(sql).to.be.equal(
        "select `column1`, `column2` from `table` where (`column1` <> 'filter query 1' and `column2` = 'filter query 2' and `column3` like '%filter query 3%')"
      );
    });
  });

  describe("Search", () => {
    it("should produce correct SQL for single search column", () => {
      const sql = knex
        .select("column1", "column2")
        .from("table")
        .search("search query", ["column1"])
        .toString()
        .replace(/"/g, "`");
      expect(sql).to.be.equal(
        "select `column1`, `column2` from `table` where (`column1` like '%search query%')"
      );
    });

    it("should produce correct SQL for multiple search columns", () => {
      const sql = knex
        .select("column1", "column2")
        .from("table")
        .search("search query", ["column3", "column4"])
        .toString()
        .replace(/"/g, "`");
      expect(sql).to.be.equal(
        "select `column1`, `column2` from `table` where (`column3` like '%search query%' or `column4` like '%search query%')"
      );
    });

    it("should produce correct SQL if no search column is specified", () => {
      const sql = knex
        .select("column1", "column2")
        .from("table")
        .search("search query", [])
        .toString()
        .replace(/"/g, "`");
      expect(sql).to.be.equal("select `column1`, `column2` from `table`");
    });
  });

  describe("Paging and sorting", () => {
    it("should produce correct pagination output");
    it("should produce correct pagination and sorting output");
  });
});
