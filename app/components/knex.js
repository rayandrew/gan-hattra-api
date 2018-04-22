"use strict";

/**
 * An instance of [Knex](http://knexjs.org/), extended with custom methods.
 * Note: the method used to extend Knex below is a temporary workaround
 * until Knex provides a proper way to extend QueryBuilder.
 * See [this issue](https://github.com/tgriesser/knex/issues/1158)
 * (the workaround recommended there does not work starting from 0.12.0).
 * @module app/components/knex
 */

const Knex = require("knex");
const config = require("config");
const _ = require("lodash");

const knex = Knex(config.get("knex"));

/**
 * Extends Knex with basic filtering support.
 * @param filterQuery {object} Query values (e.g. req.query in Express)
 * @param filters {object} Filters: each filter object can have a field (default: same as filter name) and/or operator (default: 'contains')
 *        e.g. { name: {}, nim: { operator: '=' }, createdAfter: { field: 'created_at', operator: '>' } }
 *        Permitted operators are the same as Knex where operators
 *        except 'contains', which is the same as the 'like' operator but with '%' wildcards before and after the filter value.
 */
Object.getPrototypeOf(Knex.Client.prototype).filter = function(
  filterQuery,
  filters
) {
  return this.where(function() {
    let query = this;
    for (let filterName in filters) {
      let filterField = filters[filterName].field || filterName;
      if (filterQuery[filterName] !== undefined) {
        let filterOperator = filters[filterName].operator || "contains";
        let filterValue = filterQuery[filterName];
        if (filterOperator === "contains") {
          filterOperator = "like";
          filterValue = "%" + filterValue + "%";
        }
        query = query.where(filterField, filterOperator, filterValue);
      }
    }
  });
};

/**
 * Extends Knex with basic searching support.
 * @param search {string} Search string
 * @param searchFields {array} Field names to search in
 */
Object.getPrototypeOf(Knex.Client.prototype).search = function(
  search,
  searchFields
) {
  return this.where(function() {
    let query = this;
    if (search) {
      let first = true;
      for (let searchFieldIndex in searchFields) {
        if (first) {
          query = query.where(
            searchFields[searchFieldIndex],
            "like",
            "%" + search + "%"
          );
          first = false;
        } else {
          query = query.orWhere(
            searchFields[searchFieldIndex],
            "like",
            "%" + search + "%"
          );
        }
      }
    }
  });
};

/**
 * Extends Knex with basic sorting and pagination support. Sorting will be executed first, then paging.
 * @param page {number} The page number to retrieve (pages start from 1), default is 1
 * @param perPage {number} Number of items per page, default is 20
 * @param sort {string} Comma-separated string of fields to sort by. Sorts ascending by default.
 *        Prefix field name with '-' to sort descending.
 *        e.g. 'name', '-nim', 'name, nim'
 * @param sortableFields {array} Whitelist containing the names of fields that can be sorted.
 *        If it is not given, all fields will be sortable.
 * Inspired by [this gist](https://gist.github.com/htmlpack/e9c6b6c3c22736aa6a1e8473311b115b).
 */
Object.getPrototypeOf(Knex.Client.prototype).pageAndSort = function(
  page,
  perPage,
  sort,
  sortableFields
) {
  let query = this;
  sort = sort && typeof sort === "string" ? sort.split(/\s*,\s*/) : []; // Split comma-delimited values
  let sortFields = [];
  if (!_.isArray) sortableFields = false;
  for (let i = 0; i < sort.length; i++) {
    let sortField = sort[i];
    let sortDirection = "asc";
    if (_.startsWith(sortField, "+")) sortField = sortField.slice(1);
    if (_.startsWith(sortField, "-")) {
      sortField = sortField.slice(1).trim();
      sortDirection = "desc";
    }
    if (!sortableFields || _.includes(sortableFields, sortField)) {
      sortFields.push({
        field: sortField,
        direction: sortDirection === "desc" ? "descending" : "ascending"
      });
      query = query.orderBy(sortField, sortDirection);
    }
  }

  page = +page || 1;
  if (page < 1) page = 1;
  perPage = +perPage || 20;
  let offset = (page - 1) * perPage;

  return Promise.all([
    knex
      .from(query.clone().as("query"))
      .count("* as count")
      .first(), // WARNING: need to find some way to get a Knex instance from the current query instead.
    query.offset(offset).limit(perPage)
  ]).then(function(values) {
    let totalCount = values[0].count;
    let rows = values[1];
    return {
      data: rows,
      currentPage: page,
      perPage: perPage,
      lastPage: Math.ceil(totalCount / perPage),
      totalCount: totalCount,
      sort: sortFields
    };
  });
};

/** An instance of [Knex](http://knexjs.org/), initialized using the options in the `knex` section of the app configuration. */
module.exports = knex;
