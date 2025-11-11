import React, { useState } from 'react';

type LoginPageProps = {
  onForgotPassword?: () => void;
  onLogin?: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onForgotPassword, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: integrar con API de autenticación
    console.log({ email, password, rememberMe });
    onLogin?.();
  };

  return (
    <div className="grid min-h-screen bg-gradient-to-br from-[#0b3d91] to-[#1f8ecd] text-slate-900 lg:grid-cols-[1.1fr_1fr]">
      <section className="hidden min-h-full items-center justify-center bg-slate-950/25 px-8 py-16 text-slate-100 lg:flex lg:px-12">
        <img
          src="/img/kanban-image.svg"
          alt="Ilustración de tableros Kanban"
          className="w-full max-w-lg drop-shadow-2xl"
        />
      </section>

      <section className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl shadow-slate-900/15 backdrop-blur">
          <header className="space-y-3 text-center sm:text-left">
            <h2 className="text-3xl font-semibold text-slate-900">Inicia sesión</h2>
          </header>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
              Correo electrónico
              <input
                type="email"
                name="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
              Contraseña
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              />
            </label>

            <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/40"
                />
                Recordarme
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            >
              Entrar
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;

