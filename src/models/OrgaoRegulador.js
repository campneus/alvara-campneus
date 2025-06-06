const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrgaoRegulador = sequelize.define('OrgaoRegulador', {
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
  contato_email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  contato_telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'OrgaosReguladores',
  timestamps: false
});

module.exports = OrgaoRegulador;

