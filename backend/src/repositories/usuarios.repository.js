import User from '../models/user.model.js';

const buscarPorEmail = (email) => User.findOne({ email });

const buscarPorEmailConPassword = (email) =>
  User.findOne({ email }).select('+password');

const buscarPorId = (id) => User.findById(id);

const crear = (datosUsuario) => User.create(datosUsuario);

export default {
  buscarPorEmail,
  buscarPorEmailConPassword,
  buscarPorId,
  crear,
};
