const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const LicencaTaxa = require('./LicencaTaxa');

const DocumentoAnexo = sequelize.define('DocumentoAnexo', {
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
  nome_arquivo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  caminho_arquivo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tipo_documento: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  data_upload: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'DocumentosAnexos',
  timestamps: false
});

// Definindo as associações
DocumentoAnexo.belongsTo(LicencaTaxa, { foreignKey: 'licenca_taxa_id', as: 'licencaTaxa' });
LicencaTaxa.hasMany(DocumentoAnexo, { foreignKey: 'licenca_taxa_id', as: 'documentosAnexos' });

module.exports = DocumentoAnexo;

