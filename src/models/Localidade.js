const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Localidade = sequelize.define('Localidade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  endereco: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Localidades',
  timestamps: false
});

module.exports = Localidade;

