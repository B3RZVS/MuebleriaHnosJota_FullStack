import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegistro } from '../../hooks/useRegistro';
import './RegistroView.css';

type RegistroValues = {
  nombre: string;
  email: string;
  password: string;
  confirmarPassword: string;
};

type RegistroErrors = Partial<RegistroValues>;

const PASSWORD_MIN = 6;

const initialValues: RegistroValues = {
  nombre: '',
  email: '',
  password: '',
  confirmarPassword: '',
};

function RegistroView() {
  const navigate = useNavigate();
  const registro = useRegistro();
  const [values, setValues] = useState<RegistroValues>(initialValues);
  const [errors, setErrors] = useState<RegistroErrors>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateField = (field: keyof RegistroValues, value: string) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    if (registro.isError) registro.reset();
  };

  const validate = () => {
    const nextErrors: RegistroErrors = {};

    if (!values.nombre.trim()) {
      nextErrors.nombre = 'Ingresá tu nombre.';
    } else if (values.nombre.trim().length < 2) {
      nextErrors.nombre = 'El nombre tiene que tener al menos 2 caracteres.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Ingresá tu correo electrónico.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = 'Ingresá un correo electrónico válido.';
    }

    if (!values.password) {
      nextErrors.password = 'Ingresá una contraseña.';
    } else if (values.password.length < PASSWORD_MIN) {
      nextErrors.password = `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
    }

    if (!values.confirmarPassword) {
      nextErrors.confirmarPassword = 'Confirmá tu contraseña.';
    } else if (values.password !== values.confirmarPassword) {
      nextErrors.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (registro.isError) registro.reset();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    registro.mutate(
      {
        nombre: values.nombre.trim(),
        email: values.email.trim(),
        password: values.password,
      },
      {
        onSuccess: (resultado) => {
          navigate('/login', {
            state: {
              mensaje:
                resultado.mensaje ||
                'Cuenta creada correctamente. Ya podés iniciar sesión.',
            },
          });
        },
      }
    );
  };

  const mensajeError =
    registro.error instanceof Error
      ? registro.error.message
      : registro.isError
        ? 'No pudimos crear tu cuenta. Intentá nuevamente.'
        : '';

  return (
    <section className="auth-section" aria-labelledby="registro-title">
      <div className="auth-section__intro">
        <p className="auth-section__eyebrow">Tu cuenta</p>
        <h1 id="registro-title">Creá tu cuenta</h1>
        <p className="auth-section__description">
          Registrate en nuestra mueblería y arma tu carritos de compras. Si ya
          tenés una cuenta, podés iniciar sesión.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__heading">
          <h2>Datos de registro </h2>
          <p>Los campos marcados con * son obligatorios.</p>
        </div>

        <div className="auth-form__field">
          <label htmlFor="registro-nombre">Nombre completo *</label>
          <input
            id="registro-nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            value={values.nombre}
            onChange={(event) => updateField('nombre', event.target.value)}
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={
              errors.nombre ? 'registro-nombre-error' : undefined
            }
            required
          />
          {errors.nombre && (
            <span className="auth-form__error" id="registro-nombre-error">
              {errors.nombre}
            </span>
          )}
        </div>

        <div className="auth-form__field">
          <label htmlFor="registro-email">Correo electrónico *</label>
          <input
            id="registro-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'registro-email-error' : undefined}
            required
          />
          {errors.email && (
            <span className="auth-form__error" id="registro-email-error">
              {errors.email}
            </span>
          )}
        </div>

        <div className="auth-form__field">
          <label htmlFor="registro-password">Contraseña *</label>
          <input
            id="registro-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(event) => updateField('password', event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'registro-password-error' : undefined
            }
            required
          />
          {errors.password && (
            <span className="auth-form__error" id="registro-password-error">
              {errors.password}
            </span>
          )}
        </div>

        <div className="auth-form__field">
          <label htmlFor="registro-confirmar">Confirmar contraseña *</label>
          <input
            id="registro-confirmar"
            name="confirmarPassword"
            type="password"
            autoComplete="new-password"
            value={values.confirmarPassword}
            onChange={(event) =>
              updateField('confirmarPassword', event.target.value)
            }
            aria-invalid={Boolean(errors.confirmarPassword)}
            aria-describedby={
              errors.confirmarPassword ? 'registro-confirmar-error' : undefined
            }
            required
          />
          {errors.confirmarPassword && (
            <span className="auth-form__error" id="registro-confirmar-error">
              {errors.confirmarPassword}
            </span>
          )}
        </div>

        <button
          className="auth-form__submit"
          type="submit"
          disabled={registro.isPending}
        >
          {registro.isPending ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p
          className={`auth-form__feedback${mensajeError ? ' auth-form__feedback--error' : ''}`}
          aria-live="polite"
          role="status"
        >
          {mensajeError}
        </p>

        <p className="auth-form__link">
          ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </section>
  );
}

export default RegistroView;
