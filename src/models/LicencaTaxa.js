const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Cliente = require('./Cliente');
const TipoLicencaTaxa = require('./TipoLicencaTaxa');
const OrgaoRegulador = require('./OrgaoRegulador');
const Localidade = require('./Localidade');

const LicencaTaxa = sequelize.define('LicencaTaxa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'id'
    }
  },
  tipo_licenca_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoLicencaTaxa,
      key: 'id'
    }
  },
  orgao_regulador_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: OrgaoRegulador,
      key: 'id'
    }
  },
  localidade_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Localidade,
      key: 'id'
    }
  },
  data_emissao: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  data_vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Ativa'
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  data_cadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'LicencasTaxas',
  timestamps: false
});

// Definindo as associações
LicencaTaxa.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
LicencaTaxa.belongsTo(TipoLicencaTaxa, { foreignKey: 'tipo_licenca_id', as: 'tipoLicenca' });
LicencaTaxa.belongsTo(OrgaoRegulador, { foreignKey: 'orgao_regulador_id', as: 'orgaoRegulador' });
LicencaTaxa.belongsTo(Localidade, { foreignKey: 'localidade_id', as: 'localidade' });

Cliente.hasMany(LicencaTaxa, { foreignKey: 'cliente_id', as: 'licencasTaxas' });
TipoLicencaTaxa.hasMany(LicencaTaxa, { foreignKey: 'tipo_licenca_id', as: 'licencasTaxas' });
OrgaoRegulador.hasMany(LicencaTaxa, { foreignKey: 'orgao_regulador_id', as: 'licencasTaxas' });
Localidade.hasMany(LicencaTaxa, { foreignKey: 'localidade_id', as: 'licencasTaxas' });

module.exports = LicencaTaxa;

