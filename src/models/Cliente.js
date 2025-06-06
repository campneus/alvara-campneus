const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_razao_social: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cnpj_cpf: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  endereco: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contato_email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  contato_telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  data_cadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Clientes',
  timestamps: false
});

module.exports = Cliente;

