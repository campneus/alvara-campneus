const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const LicencaTaxa = require('./LicencaTaxa');

const HistoricoRenovacao = sequelize.define('HistoricoRenovacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  licenca_taxa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: LicencaTaxa,
      key: 'id'
    }
  },
  data_renovacao: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  nova_data_vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  usuario_responsavel: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  data_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'HistoricoRenovacoes',
  timestamps: false
});

// Definindo as associações
HistoricoRenovacao.belongsTo(LicencaTaxa, { foreignKey: 'licenca_taxa_id', as: 'licencaTaxa' });
LicencaTaxa.hasMany(HistoricoRenovacao, { foreignKey: 'licenca_taxa_id', as: 'historicoRenovacoes' });

module.exports = HistoricoRenovacao;

