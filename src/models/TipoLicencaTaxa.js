const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TipoLicencaTaxa = sequelize.define('TipoLicencaTaxa', {
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
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tempo_expiracao_dias: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  frequencia_renovacao_meses: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'TiposLicencasTaxas',
  timestamps: false
});

module.exports = TipoLicencaTaxa;

