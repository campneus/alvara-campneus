const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const LicencaTaxa = require('./LicencaTaxa');

const Pagamento = sequelize.define('Pagamento', {
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
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  data_pagamento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  data_vencimento_boleto: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status_pagamento: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Em aberto'
  },
  comprovante_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  data_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Pagamentos',
  timestamps: false
});

// Definindo as associações
Pagamento.belongsTo(LicencaTaxa, { foreignKey: 'licenca_taxa_id', as: 'licencaTaxa' });
LicencaTaxa.hasMany(Pagamento, { foreignKey: 'licenca_taxa_id', as: 'pagamentos' });

module.exports = Pagamento;

