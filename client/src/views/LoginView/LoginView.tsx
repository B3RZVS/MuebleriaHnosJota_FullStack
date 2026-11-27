import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useEstadoNavegacion } from '../../hooks/useEstadoNavegacion';
import { useLogin } from '../../hooks/useLogin';
import { useAuth } from '../../auth/context/useAuth';
import './LoginView.css';

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<LoginValues>;

type LoginLocationState = {
  mensaje?: string;
  from?: string;
};

const initialValues: LoginValues = {
  email: '',
  password: '',
};

function LoginView() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { login, estaAutenticado, cargando } = useAuth();
  const estadoNavegacion = useEstadoNavegacion<LoginLocationState>();
  const mensajeRegistro = estadoNavegacion?.mensaje;
  const destino = estadoNavegacion?.from ?? '/';

  const [values, setValues] = useState<LoginValues>(initialValues);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [mensajeExito, setMensajeExito] = useState(mensajeRegistro ?? '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateField = (field: keyof LoginValues, value: string) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setMensajeExito('');
    if (loginMutation.isError) loginMutation.reset();
  };

  const validate = () => {
    const nextErrors: LoginErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = 'Ingresá tu correo electrónico.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = 'Ingresá un correo electrónico válido.';
    }

    if (!values.password) {
      nextErrors.password = 'Ingresá tu contraseña.';
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensajeExito('');
    if (loginMutation.isError) loginMutation.reset();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    loginMutation.mutate(
      {
        email: values.email.trim(),
        password: values.password,
      },
      {
        onSuccess: (resultado) => {
          login(resultado.token, resultado.usuario);
          navigate(destino, { replace: true });
        },
      }
    );
  };

  const mensajeError =
    loginMutation.error instanceof Error
      ? loginMutation.error.message
      : loginMutation.isError
        ? 'No pudimos iniciar sesión. Intentá nuevamente.'
        : '';

  const feedback = mensajeError || mensajeExito;
  const esExito = Boolean(mensajeExito) && !mensajeError;

  // Si ya hay sesión, el formulario no tiene sentido.
  // Se exceptúa el render posterior al login, que todavía está navegando.
  if (estaAutenticado && !cargando && !loginMutation.isSuccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="auth-section" aria-labelledby="login-title">
      <div className="auth-section__intro">
        <p className="auth-section__eyebrow">Tu cuenta</p>
        <h1 id="login-title">Iniciá sesión</h1>
        <p className="auth-section__description">
          Entrá con tu correo y contraseña para continuar. Si todavía no tenés
          cuenta, podés registrarte en unos minutos.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__heading">
          <h2>Datos de acceso</h2>
          <p>Los campos marcados con * son obligatorios.</p>
        </div>

        <div className="auth-form__field">
          <label htmlFor="login-email">Correo electrónico *</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            required
          />
          {errors.email && (
            <span className="auth-form__error" id="login-email-error">
              {errors.email}
            </span>
          )}
        </div>

        <div className="auth-form__field">
          <label htmlFor="login-password">Contraseña *</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(event) => updateField('password', event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'login-password-error' : undefined
            }
            required
          />
          {errors.password && (
            <span className="auth-form__error" id="login-password-error">
              {errors.password}
            </span>
          )}
        </div>

        <button
          className="auth-form__submit"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Ingresando…' : 'Iniciar sesión'}
        </button>

        <p
          className={`auth-form__feedback${esExito ? ' auth-form__feedback--ok' : feedback ? ' auth-form__feedback--error' : ''}`}
          aria-live="polite"
          role="status"
        >
          {feedback}
        </p>

        <p className="auth-form__link">
          ¿No tenés una cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </form>
    </section>
  );
}

export default LoginView;
