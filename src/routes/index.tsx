import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, Eye, EyeOff, Loader2 } from "lucide-react";
import loginHero from "@/assets/login-hero.jpg";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <img
          src={loginHero}
          alt="StudyMind AI Neural Network"
          className="absolute inset-0 w-full h-full object-cover"
          width={960}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50" />
        <div className="relative z-10 px-16 max-w-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">StudyMind AI</span>
          </div>
          <h1 className="text-4xl font-extrabold text-foreground leading-tight mb-4">
            Estude com inteligência.
            <br />
            <span className="text-primary">Evolua com dados.</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Plataforma colaborativa de estudos acadêmicos com IA integrada, gamificação e organização inteligente.
          </p>
          <div className="mt-10 flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">2.4k+</div>
              <div className="text-xs text-muted-foreground">Alunos ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">98%</div>
              <div className="text-xs text-muted-foreground">Aprovação</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">15k+</div>
              <div className="text-xs text-muted-foreground">Horas de estudo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StudyMind AI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Entrar na plataforma</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Acesse sua conta para continuar estudando
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-11 rounded-lg bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-lg bg-input px-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm glow-primary hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-8">
            Acesso restrito. Contate o administrador para criar uma conta.
          </p>

          {/* Temporary dev link */}
          <div className="mt-6 text-center">
            <Link
              to="/dashboard"
              className="text-xs text-primary/60 hover:text-primary transition-colors"
            >
              Demo: Ir ao Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
