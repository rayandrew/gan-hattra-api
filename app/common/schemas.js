'use strict';

const schemas = {
  auto_id: {
    'type': 'integer',
    'minimum': 0
  },

  varchar: (length) => {
    let schema = {
      'type': 'string'
    };

    if (length) schema.maxLength = length;
    return schema;
  },

  text: {
    'type': 'string'
  },

  datetime: {
    'type': 'string',
    'format': 'date-time'
  },

  date: {
    'type': 'string',
    'format': 'date'
  },

  year: {
    'type': 'integer',
    'minimum': 1900,
    'maximum': 2100
  },

  gender: {
    'type': 'string',
    'enum': ['male', 'female']
  },

  phone: {
    'type': 'string',
    'maxLength': 16
  },

  line: {
    'type': 'string',
    'maxLength': 32,
    'pattern': '^[a-zA-Z0-9@!#*+=/.,<>?~_-]+$'
  },

  nim: {
    'type': ['integer', 'null'],
    'minimum': 10000000,
    'maximum': 20000000
  },

  username: {
    'type': 'string',
    'maxLength': 255,
    'pattern': '^[a-zA-Z0-9_]+$'
  },

  email: {
    'type': 'string',
    'format': 'email',
    'maxLength': 255
  },

  password: {
    'type': 'string',
    'minLength': 6,
    'maxLength': 255
  },

  role: {
    'type': 'string',
    'enum': ['admin', 'provinsi', 'kota', 'puskesmas', 'kestrad', 'user']
  },

  userStatus: {
    'type': 'string',
    'enum': ['active', 'awaiting_validation', 'disabled']
  },

  pagingAndSortingProperties: {
    'page': {
      'type': 'integer',
      'minimum': 1
    },
    'perPage': {
      'type': 'integer',
      'minimum': 1
    },
    'sort': {
      'type': 'string'
    }
  },

  searchingProperties: {
    'search': {
      'type': 'string'
    }
  }

};

module.exports = schemas;
