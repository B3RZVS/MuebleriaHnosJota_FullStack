const contactFormMiddleware = (req, res, next) => {
	const { nombre, email, mensaje } = req.body ?? {};
	const emailValido = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

	if (
		typeof nombre !== 'string' || !nombre.trim() ||
		!emailValido ||
		typeof mensaje !== 'string' || !mensaje.trim()
	) {
		return res.status(400).json({ mensaje: 'Completá nombre, email válido y mensaje.' });
	}

	req.body = {
		nombre: nombre.trim(),
		email: email.trim(),
		mensaje: mensaje.trim(),
	};

	return next();
};

export default contactFormMiddleware;
