'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const _ = require('lodash');

const kestradColumns = ['username', 'username_puskesmas', 'nama', 'penanggung_jawab', 'jumlah_pegawai', 'alamat', 'kecamatan', 'verified', 'tanggal_verifikasi', 'created_at', 'updated_at'];
const kestradSearchableColumns = ['username', 'username_puskesmas', 'nama'];
const layananColumns = ['id_layanan', 'id_subkategori', 'nama_layanan', 'verified', 'tanggal_verified'];
const subkategoriColumns = ['id_subkategori', 'id_kategori', 'nama_subkategori'];
const kategoriColumns = ['id_kategori', 'username', 'nama_kategori'];

module.exports = {
    listKestrad: (search, page, perPage, sort) => {
        return knex.select(kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column))
            .from('user_kestrad')
            .search(search, kestradSearchableColumns.map(column => 'user_kestrad.' + column))
            .pageAndSort(page, perPage, sort, kestradColumns.map(column => 'user_kestrad.' + column));
    },

    searchKestrad: (search) => {
        return knex.select(['user_kestrad', 'nama'])
            .from('user_kestrad')
            .search(search, ['nama', 'user_kestrad'])
            .limit(20);
    },

    getSpecificKestrad: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .where('username', username)
            .first();
    },

    getKestradForPuskesmas: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .innerJoin('user_puskesmas', 'user_kestrad.username_puskesmas', 'user_puskesmas.username')
            .where('username_puskesmas', username)
    },

    getKestradsForKota: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .innerJoin('user_puskesmas', 'user_kestrad.username_puskesmas', 'user_puskesmas.username')
            .innerJoin('user_kota', 'user_puskesmas.username_kota', 'user_kota.username')
            .where('username_kota', username)
    },

    getKestradForProvinsi: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .innerJoin('user_puskesmas', 'user_kestrad.username_puskesmas', 'user_puskesmas.username')
            .innerJoin('user_kota', 'user_puskesmas.username_kota', 'user_kota.username')
            .innerJoin('user_provinsi', 'user_kota.username_provinsi', 'user_provinsi.username')
            .where('username_provinsi', username);
    },

    getKestrad: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .where('username', username)
            .first();
    },

    updateKestrad: (username, kestradUpdates) => {
        let promises = Promise.resolve();

        return promises
            .then((kestradUpdates) => {
                return knex('user_kestrad').update(kestradUpdates).where('username', username);
            });
    },

    getKategoriKestrad: (username) => {
        return knex.select(kategoriColumns)
            .from('kategori')
            .where('username', username);
    },

    getSubKategoriKestrad: (username) => {
        return knex.select(subkategoriColumns)
            .from('subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where('username', username);
    },

    getLayananKestrad: (username) => {
        return knex.select(layananColumns)
            .from('layanan')
            .innerJoin('subkategori', 'layanan.id_subkategori', 'subkategori.id_subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where('username', username);
    },

    getSpesificKategoriKestrad: (username, kategori) => {
        return knex.select(kategoriColumns)
            .from('kategori')
            .where({
                'username': username,
                'nama_kategori': kategori
            });
    },

    getSpesifikSubKategoriByKategori: (username, kategori) => {
        return knex.select(subkategoriColumns)
            .from('subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where({
                'username': username,
                'nama_kategori': kategori
            });
    },

    getSpesifikSubKategoriBySubategori: (username, subkategori) => {
        return knex.select(subkategoriColumns)
            .from('subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where({
                'username': username,
                'nama_subkategori': subkategori
            });
    },

    getSpesifikLayananByKategori: (username, kategori) => {
        return knex.select(layananColumns)
            .from('layanan')
            .innerJoin('subkategori', 'layanan.id_subkategori', 'subkategori.id_subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where({
                'username': username,
                'nama_kategori': kategori
            });
    },

    getSpesifikLayananBySubkategori: (username, subkategori) => {
        return knex.select(layananColumns)
            .from('layanan')
            .innerJoin('subkategori', 'layanan.id_subkategori', 'subkategori.id_subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where({
                'username': username,
                'nama_subkategori': subkategori
            });
    },

    getSpesifikLayananByLayanan: (username, layanan) => {
        return knex.select(layananColumns)
            .from('layanan')
            .innerJoin('subkategori', 'layanan.id_subkategori', 'subkategori.id_subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where({
                'username': username,
                'nama_layanan': layanan
            });
    },

    getSubKategoriByKategoriAndSubkategori: (username, kategori, subkategori) => {
        return knex.select(subkategoriColumns)
            .from('subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where({
                'username': username,
                'nama_kategori': kategori,
                'nama_subkategori': subkategori
            });
    },

    getLayananByKategoriAndSubkategori: (username, kategori, subkategori) => {
        return knex.select(layananColumns)
            .from('layanan')
            .innerJoin('subkategori', 'layanan.id_subkategori', 'subkategori.id_subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where({
                'username': username,
                'nama_kategori': kategori,
                'nama_subkategori': subkategori
            });
    },

    getLayananByKategoriAndLayanan: (username, kategori, layanan) => {
        return knex.select(layananColumns)
            .from('layanan')
            .innerJoin('subkategori', 'layanan.id_subkategori', 'subkategori.id_subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where({
                'username': username,
                'nama_kategori': kategori,
                'nama_layanan': layanan
            });
    },

    getLayananBySubkategoriAndLayanan: (username, subkategori, layanan) => {
        return knex.select(layananColumns)
            .from('layanan')
            .innerJoin('subkategori', 'layanan.id_subkategori', 'subkategori.id_subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where({
                'username': username,
                'nama_subkategori': subkategori,
                'nama_layanan': layanan
            });
    },

    getSpesificLayananByAll: (username, kategori, subkategori, layanan) => {
        return knex.select(layananColumns)
            .from('layanan')
            .innerJoin('subkategori', 'layanan.id_subkategori', 'subkategori.id_subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where({
                'username': username,
                'nama_kategori': kategori,
                'nama_subkategori': subkategori,
                'nama_layanan': layanan
            });
    },

    updateLayanan: (username, layananUpdate) => {
        let promises = Promise.resolve();

        idLayanan = knex.select('id_layanan')
            .from('layanan')
            .innerJoin('subkategori', 'layanan.id_subkategori', 'subkategori.id_subkategori')
            .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
            .where('username', username);

        return promises
            .then((idLayanan, layananUpdate) => {
                return knex('layanan')
                    .update(layananUpdate)
                    .where('id_layanan', idLayanan);
            });
    }

};