import { useState, type FormEvent } from "react";
import { API_URL } from "../../utils/urls";
import "./ContactForm.css";

type ContactValues = {
  nombre: string;
  email: string;
  mensaje: string;
};

type ContactErrors = Partial<ContactValues>;

const initialValues: ContactValues = {
  nombre: "",
  email: "",
  mensaje: "",
};

function ContactForm() {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof ContactValues, value: string) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setFeedback("");
  };

  const validate = () => {
    const nextErrors: ContactErrors = {};

    if (!values.nombre.trim()) {
      nextErrors.nombre = "Ingresá tu nombre.";
    } else if (values.nombre.trim().length < 3) {
      nextErrors.nombre = "El nombre tiene que tener al menos 3 caracteres.";
    }
    if (!values.email.trim()) {
      nextErrors.email = "Ingresá tu email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Ingresá un email válido.";
    }
    if (!values.mensaje.trim()) nextErrors.mensaje = "Escribí tu consulta.";

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: values.nombre.trim(),
          email: values.email.trim(),
          mensaje: values.mensaje.trim(),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setFeedback(result.mensaje || "No pudimos enviar tu consulta.");
        return;
      }

      setValues(initialValues);
      setErrors({});
      setFeedback(result.mensaje || "Recibimos tu consulta. ¡Gracias!");
    } catch {
      // Llega acá si el servidor no responde: el error del navegador es técnico y en inglés
      setFeedback("No pudimos enviar tu consulta. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="contact-section"
      id="contacto"
      aria-labelledby="contact-title"
    >
      <div className="contact-section__intro">
        <p className="contact-section__eyebrow">Estamos para ayudarte</p>
        <h1 id="contact-title">Hablemos de tu próximo espacio</h1>
        <p className="contact-section__description">
          Contanos qué estás buscando. Nuestro equipo te responderá para
          ayudarte a encontrar la mejor opción para tu casa.
        </p>
        {/* Datos de contacto del Manual de Marca */}
        <ul className="contact-section__datos">
          <li>
            <span aria-hidden="true">01</span>
            <div>
              <h2>Showroom y taller</h2>
              <p>
                Av. San Juan 2847, San Cristóbal (CABA).
                <br />
                Lunes a viernes de 10 a 19 h y sábados de 10 a 14 h.
              </p>
            </div>
          </li>
          <li>
            <span aria-hidden="true">02</span>
            <div>
              <h2>Escribinos directo</h2>
              <p>
                <a href="mailto:ventas@hermanosjota.com.ar">
                  ventas@hermanosjota.com.ar
                </a>
                <br />
                <a href="https://wa.me/541145678900" target="_blank" rel="noreferrer">
                  WhatsApp +54 11 4567-8900
                </a>
              </p>
            </div>
          </li>
          <li>
            <span aria-hidden="true">03</span>
            <div>
              <h2>Programa Herencia Viva</h2>
              <p>
                También podés consultarnos por la restauración de piezas, el
                taller de cuidados y la recompra de muebles bien cuidados.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-form__heading">
          <h2>Dejanos tu consulta</h2>
          <p>Los campos marcados con * son obligatorios.</p>
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-name">Nombre *</label>
          <input
            id="contact-name"
            name="nombre"
            type="text"
            autoComplete="name"
            value={values.nombre}
            onChange={(event) => updateField("nombre", event.target.value)}
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={errors.nombre ? "contact-name-error" : undefined}
            required
          />
          {errors.nombre && (
            <span className="contact-form__error" id="contact-name-error">
              {errors.nombre}
            </span>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-email">Email *</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            required
          />
          {errors.email && (
            <span className="contact-form__error" id="contact-email-error">
              {errors.email}
            </span>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-message">Mensaje *</label>
          <textarea
            id="contact-message"
            name="mensaje"
            rows={5}
            value={values.mensaje}
            onChange={(event) => updateField("mensaje", event.target.value)}
            aria-invalid={Boolean(errors.mensaje)}
            aria-describedby={
              errors.mensaje ? "contact-message-error" : undefined
            }
            required
          />
          {errors.mensaje && (
            <span className="contact-form__error" id="contact-message-error">
              {errors.mensaje}
            </span>
          )}
        </div>

        <button
          className="contact-form__submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando…" : "Enviar consulta"}
        </button>
        <p className="contact-form__feedback" aria-live="polite" role="status">
          {feedback}
        </p>
      </form>
    </section>
  );
}

export default ContactForm;
