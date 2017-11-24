'use strict';

var knex = require('../components/knex.js');
var helper = require('../common/helper.js');
const errors = require('http-errors');
const _ = require('lodash');

const hattraColumns = [
  'id_hattra',
  'id_layanan',
  'nama',
  'ijin_hattra',
  'verified',
  'tanggal_verified'
];

const hattraSearchableColumns = [
  'id_hattra',
  'id_layanan',
  'nama',
  'ijin_hattra',
  'verified'
];

const hattraAssignableColumns = [
  'nama_layanan',
  'ijin_hattra', 
  'verified'
];

const displayColumns = [
  'username_provinsi',
  'username_kota',
  'username_puskesmas',
  'username_kestrad'
];

module.exports = {
  listHattra: (search, page, perPage, sort) => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
        .concat(displayColumns)
      )
      .from('hattra')
      .innerJoin(
        'hattra_additional',
        'hattra.id_hattra',
        'hattra_additional.id_hattra'
      )
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        hattraColumns.map(column => 'hattra.' + column)
      );
  },

  listHattraByKestrad: (search, page, perPage, sort, user) => {
    return knex
    .select(
      hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
    .concat(displayColumns))
    .from('hattra')
    .innerJoin(
      'hattra_additional',
      'hattra.id_hattra',
      'hattra_additional.id_hattra'
    )
    .where('username_kestrad', user)
    .search(
      search,
      hattraSearchableColumns.map(column => 'hattra.' + column)
    )
    .pageAndSort(
      page,
      perPage,
      sort,
      hattraColumns.map(column => 'hattra.' + column)
    );
  },

  listHattraByPuskesmas: (search, page, perPage, sort, user) => {
    return knex
    .select(
      hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
    .concat(displayColumns))
    .from('hattra')
    .innerJoin(
      'hattra_additional',
      'hattra.id_hattra',
      'hattra_additional.id_hattra'
    )
    .where('username_puskesmas', user)
    .search(
      search,
      hattraSearchableColumns.map(column => 'hattra.' + column)
    )
    .pageAndSort(
      page,
      perPage,
      sort,
      hattraColumns.map(column => 'hattra.' + column)
    );
  },

  listHattraByKota: (search, page, perPage, sort, user) => {
    return knex
    .select(
      hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
    .concat(displayColumns))
    .from('hattra')
    .innerJoin(
      'hattra_additional',
      'hattra.id_hattra',
      'hattra_additional.id_hattra'
    )
    .where('username_kota', user)
    .search(
      search,
      hattraSearchableColumns.map(column => 'hattra.' + column)
    )
    .pageAndSort(
      page,
      perPage,
      sort,
      hattraColumns.map(column => 'hattra.' + column)
    );
  },

  listHattraByProvinsi: (search, page, perPage, sort, user) => {
    return knex
    .select(
      hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
    .concat(displayColumns))
    .from('hattra')
    .innerJoin(
      'hattra_additional',
      'hattra.id_hattra',
      'hattra_additional.id_hattra'
    )
    .where('username_provinsi', user)
    .search(
      search,
      hattraSearchableColumns.map(column => 'hattra.' + column)
    )
    .pageAndSort(
      page,
      perPage,
      sort,
      hattraColumns.map(column => 'hattra.' + column)
    );
  },

  listHattraByUsername : (search, page, perPage, sort, usernameLister, usernameRole, usernameListed) => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return helper.getRole(usernameListed)
        .map(function(row) {
          return row.role;
        });
    });
    return promises
      .then((role) => {
        if(role) {
          if(usernameRole === 'admin') {
            return listHattraByProvinsi(search, page, perPage, sort, usernameListed);
          } else if (usernameRole === 'provinsi') {
            if(role[0] === 'admin' || role[0] === 'provinsi') {
              return new errors.Forbidden();
            } else {
              if(role[0] === 'kota') {
                console.log('masuk sini');
                let getUser = knex('hattra_additional')
                .select('username_provinsi')
                .where('username_provinsi', usernameLister)
                .andWhere('username_kota', usernameListed);

                return getUser
                .first()
                .then(provinsi => {
                  if(provinsi) {
                    console.log("masuk kota");
                    return module.exports.listHattraByKota(search, page, perPage, sort, usernameListed);                                 
                  } else {
                    return new errors.Forbidden();
                  }
                });
              } else if (role[0] === 'puskesmas') {
                let getUser = knex('hattra_additional')
                .select('username_provinsi')
                .where('username_provinsi', usernameLister)
                .andWhere('username_puskesmas', usernameListed);

                return getUser
                .first()
                .then(provinsi => {
                  if(provinsi) {
                    console.log("masuk puskesmas");            
                    return module.exports.listHattraByPuskesmas(search, page, perPage, sort, usernameListed);                    
                  } else {
                    return new errors.Forbidden();
                  }
                });
              } else if(role[0] === 'kestrad') {
                let getUser = knex('hattra_additional')
                .select('username_provinsi')
                .where('username_provinsi', usernameLister)
                .andWhere('username_kestrad', usernameListed);
                
                return getUser
                .first()
                .then(provinsi => {
                  if(provinsi) {
                    return module.exports.listHattraByKestrad(search, page, perPage, sort, usernameListed);                  
                  } else {
                    return new errors.Forbidden();
                  }
                });
              } else {
                return new errors.Forbidden();
              }
            }
          } else if (usernameRole === 'kota') {
            if(role[0] === 'admin' || role[0] === 'provinsi' || role[0] === 'kota') {
              return new errors.Forbidden();
            } else {
               if (role[0] === 'puskesmas') {
                let getUser = knex('hattra_additional')
                .select('username_kota')
                .where('username_kota', usernameLister)
                .andWhere('username_puskesmas', usernameListed);

                return getUser
                .first()
                .then(kota => {
                  if(kota) {
                    console.log("masuk puskesmas");            
                    return module.exports.listHattraByPuskesmas(search, page, perPage, sort, usernameListed);                    
                  } else {
                    return new errors.Forbidden();
                  }
                });
              } else if(role[0] === 'kestrad') {
                let getUser = knex('hattra_additional')
                .select('username_kota')
                .where('username_kota', usernameLister)
                .andWhere('username_kestrad', usernameListed);
                
                return getUser
                .first()
                .then(kota => {
                  if(kota) {
                    return module.exports.listHattraByKestrad(search, page, perPage, sort, usernameListed);                  
                  } else {
                    return new errors.Forbidden();
                  }
                });
              } else {
                return new errors.Forbidden();
              }
            }
          } else if (usernameRole === 'puskesmas') {
            if(role[0] !== 'kestrad') {
              return new errors.Forbidden();
            } else {
               if(role[0] === 'kestrad') {
                let getUser = knex('hattra_additional')
                .select('username_puskesmas')
                .where('username_puskesmas', usernameLister)
                .andWhere('username_kestrad', usernameListed);
                
                return getUser
                .first()
                .then(puskesmas => {
                  if(puskesmas) {
                    return module.exports.listHattraByKestrad(search, page, perPage, sort, usernameListed);                  
                  } else {
                    return new errors.Forbidden();
                  }
                });
              } else {
                return new errors.Forbidden();
              }
            }
          }
        } else {
          return new errors.Forbidden();
        }
      });
  },

  searchHattra: search => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      .concat(displayColumns))
      .from('hattra')
      .innerJoin(
        'hattra_additional',
        'hattra.id_hattra',
        'hattra_additional.id_hattra'
      )
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .limit(20);
  },
  
  searchHattraForKestrad: search => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      .concat(displayColumns))
      .from('hattra')
      .innerJoin(
        'hattra_additional',
        'hattra.id_hattra',
        'hattra_additional.id_hattra'
      )
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .limit(20);
  },

  searchHattraForPuskesmas: (search, username) => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      .concat(displayColumns))
      .from('hattra')
      .innerJoin(
        'hattra_additional',
        'hattra.id_hattra',
        'hattra_additional.id_hattra'
      )
      .where('username_puskesmas', username)
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .limit(20);
  },

  searchHattraForKota: (search, username) => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      .concat(displayColumns))
      .from('hattra')
      .innerJoin(
        'hattra_additional',
        'hattra.id_hattra',
        'hattra_additional.id_hattra'
      )
      .where('user_puskesmas.username_kota', username)
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .limit(20);
  },

  searchHattraForProvinsi: (search, username) => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      .concat(displayColumns))
      .from('hattra')
      .innerJoin(
        'hattra_additional',
        'hattra.id_hattra',
        'hattra_additional.id_hattra'
      )
      .where('user_kota.username_provinsi', username)
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .limit(20);
  },

  getSpecificHattra: id => {
    return knex.select(
      hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
    .concat(displayColumns))
    .innerJoin(
      'hattra_additional',
      'hattra.id_hattra',
      'hattra_additional.id_hattra'
    )
    .where('id_hattra', id)
  },

  updateNamaHattra: (id_hattra, hattraUpdates, username) => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return knex()
        .select()
        .from('hattra')
        .innerJoin(
          'hattra_additional',
          'hattra.id_hattra',
          'hattra_additional.id_hattra'
        )
        .where('username_puskesmas', username)
        .first();
    });

    return promises
      .then((hattra) => {
        if(hattra) {
          hattraUpdates = _.pick(hattraUpdates, hattraAssignableColumns);
          return knex('hattra')
            .update(layananUpdates)
            .where('id_hattra', id_layanan);
        } else {
          return 0;
        }
      });
  },
    
  updateVerifikasiHattra: (id_hattra, hattraUpdates, username) => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return knex()
        .select()
        .from('hattra')
        .innerJoin(
          'hattra_additional',
          'hattra.id_hattra',
          'hattra_additional.id_hattra'
        )
        .where('username_kota', username)
        .first();
    });

    return promises
    .then((hattra) => {
      if(hatra) {
        hattraUpdates = _.pick(hattraUpdates, hattraAssignableColumns);
        return knex('hattra')
        .update(hattraUpdates)
        .where('id_hattra', id_hattra);
      } else {
        return 0;
      }
    });
  }
};
