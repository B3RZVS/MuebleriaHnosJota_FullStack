const contactFormMiddleware = (req, res, next) => {
	const { nombre, email, mensaje } = req.body ?? {};
	const emailValido = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

	if (
		typeof nombre !== 'string' || nombre.trim().length < 3 ||
		!emailValido ||
		typeof mensaje !== 'string' || !mensaje.trim()
	) {
		return res.status(400).json({ mensaje: 'Completá nombre (mínimo 3 caracteres), email válido y mensaje.' });
	}

	req.body = {
		nombre: nombre.trim(),
		email: email.trim(),
		mensaje: mensaje.trim(),
	};

	return next();
};

export default contactFormMiddleware;
