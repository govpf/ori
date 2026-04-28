import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { Button } from '@govpf/ori-react';
import type { Route } from '../App.js';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
}

interface Intent {
  keywords: string[];
  reply: string;
  /** Action contextuelle proposée après la réponse (navigation interne). */
  action?: { label: string; route: Route };
}

const INTENTS: Intent[] = [
  {
    keywords: ['permis de construire', 'permis construire', 'construction', 'urbanisme', 'dau'],
    reply:
      "Le permis de construire est instruit par la Direction de l'Aménagement et de l'Urbanisme (DAU). Préparer le plan de situation, le plan de masse, les justificatifs de propriété et la notice descriptive du projet. La démarche peut être déposée en ligne via le catalogue.",
    action: { label: 'Voir la démarche', route: { name: 'catalogue' } },
  },
  {
    keywords: ['patente', 'commerce', 'activité', 'profession', 'entreprise', 'dicp'],
    reply:
      "L'ouverture, la modification ou la cessation de patente (commerçant, profession libérale, artisan) passe par la Direction des Impôts et des Contributions Publiques (DICP). Le catalogue regroupe les démarches associées.",
    action: { label: 'Voir le catalogue', route: { name: 'catalogue' } },
  },
  {
    keywords: ['carte grise', 'immatriculation', 'véhicule', 'voiture', 'permis de conduire', 'dtt'],
    reply:
      "L'immatriculation, la carte grise et le permis de conduire sont gérés par la Direction des Transports Terrestres (DTT). Le catalogue propose les formulaires en ligne.",
    action: { label: 'Voir la démarche', route: { name: 'catalogue' } },
  },
  {
    keywords: ['école', 'scolaire', 'inscription', 'collège', 'lycée', 'dgee', 'enseignement'],
    reply:
      "Les inscriptions scolaires en établissement public sont gérées par la Direction Générale de l'Éducation et des Enseignements (DGEE). Préparer le livret de famille, un justificatif de domicile et le carnet de santé.",
    action: { label: 'Voir la démarche', route: { name: 'catalogue' } },
  },
  {
    keywords: ['adresse', 'déménage', 'déménagement', 'changement'],
    reply:
      "Pour signaler un changement d'adresse aux services du Pays (CPS, DICP, services d'eau et électricité), ouvrir une démarche \"Changement d'adresse\" depuis le catalogue. Préparer un justificatif de domicile récent (moins de 3 mois).",
    action: { label: 'Démarrer', route: { name: 'catalogue' } },
  },
  {
    keywords: ['fiscal', 'impôt', 'impot', 'taxe', 'cst', 'foncier', 'tva'],
    reply:
      "Les démarches fiscales du Pays (CST, ISO, patente, foncier) sont gérées par la DICP. Le catalogue regroupe les formulaires courants ; pour les sujets complexes, prendre contact via l'annuaire.",
    action: { label: 'Annuaire des services', route: { name: 'annuaire' } },
  },
  {
    keywords: ['cps', 'santé', 'protection sociale', 'rspf', 'sécurité sociale'],
    reply:
      "La Caisse de Prévoyance Sociale (CPS) gère l'affiliation, les remboursements et le RSPF. Une partie des démarches est accessible via le portail dans la rubrique \"Santé et social\".",
    action: { label: 'Voir le catalogue', route: { name: 'catalogue' } },
  },
  {
    keywords: ['démarches', 'démarche', 'mes demandes'],
    reply:
      "Les démarches en cours sont consultables dans la rubrique \"Mes démarches\". L'avancement, les pièces demandées et les notifications y sont centralisés.",
    action: { label: 'Mes démarches', route: { name: 'mes-demarches' } },
  },
  {
    keywords: ['notification', 'notifications', 'alerte'],
    reply:
      "Les notifications regroupent les messages des services administratifs : pièces complémentaires demandées, décisions, rappels d'échéance.",
    action: { label: 'Voir les notifications', route: { name: 'notifications' } },
  },
  {
    keywords: ['profil', 'compte', 'mes informations'],
    reply:
      "Le profil contient les informations personnelles (nom, adresse, contacts). Modifier ces informations met automatiquement à jour les démarches en cours.",
    action: { label: 'Profil', route: { name: 'profil' } },
  },
  {
    keywords: ['contact', 'téléphone', 'numéro', 'standard', 'appeler'],
    reply:
      "Le standard du service public PF répond au (689) 40 47 20 20 du lundi au vendredi, 7 h 30 - 15 h 30. Pour un service spécifique, consulter l'annuaire.",
    action: { label: 'Annuaire', route: { name: 'annuaire' } },
  },
  {
    keywords: ['bonjour', 'salut', 'hello', 'bonsoir', 'iaorana'],
    reply:
      'Iaorana ! Je suis là pour orienter dans les démarches administratives. Posez une question sur un papier, un service ou un délai, ou cliquez une suggestion.',
  },
  {
    keywords: ['merci', 'thanks'],
    reply: "Avec plaisir. D'autres questions ?",
  },
];

const FALLBACK_REPLY =
  "Je n'ai pas la réponse à cette question pour l'instant. Vous pouvez consulter le catalogue des démarches, contacter le service concerné via l'annuaire, ou appeler le (689) 40 47 20 20.";

const SUGGESTIONS = [
  'Comment déposer un permis de construire ?',
  'Où voir mes démarches en cours ?',
  'Comment ouvrir une patente ?',
];

function findReply(message: string): { reply: string; action?: Intent['action'] } {
  const normalized = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  for (const intent of INTENTS) {
    const hit = intent.keywords.some((k) =>
      normalized.includes(k.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')),
    );
    if (hit) return { reply: intent.reply, action: intent.action };
  }
  return { reply: FALLBACK_REPLY };
}

let messageId = 0;
const nextId = () => `msg-${++messageId}`;

interface Props {
  onNavigate: (route: Route) => void;
}

export function ChatBot({ onNavigate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId(),
      role: 'bot',
      content:
        "Iaorana, je suis l'assistant d'orientation du portail. Posez une question sur une démarche administrative ou cliquez une suggestion.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAction, setPendingAction] = useState<Intent['action'] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setInput('');
      setPendingAction(null);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'user', content: trimmed, timestamp: Date.now() },
      ]);
      setIsTyping(true);
      // Simule un délai de réflexion plausible (800-1400 ms).
      const delay = 800 + Math.random() * 600;
      window.setTimeout(() => {
        const { reply, action } = findReply(trimmed);
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: 'bot', content: reply, timestamp: Date.now() },
        ]);
        setIsTyping(false);
        if (action) setPendingAction(action);
      }, delay);
    },
    [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleAction = () => {
    if (!pendingAction) return;
    onNavigate(pendingAction.route);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="chatbot-fab"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {isOpen && (
        <aside
          className="chatbot-drawer"
          role="dialog"
          aria-label="Assistant d'orientation"
        >
          <header className="chatbot-drawer__header">
            <div className="chatbot-drawer__title">
              <Sparkles size={18} aria-hidden="true" />
              <strong>Assistant d'orientation</strong>
            </div>
            <button
              type="button"
              className="chatbot-drawer__close"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer l'assistant"
            >
              <X size={18} />
            </button>
          </header>

          <div className="chatbot-drawer__disclaimer" role="note">
            Assistant en évaluation. Vérifier toujours les informations
            officielles auprès du service concerné.
          </div>

          <div className="chatbot-drawer__messages" aria-live="polite">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chatbot-msg chatbot-msg--${m.role}`}
              >
                <div className="chatbot-msg__bubble">{m.content}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chatbot-msg chatbot-msg--bot">
                <div className="chatbot-msg__bubble chatbot-msg__bubble--typing" aria-label="Assistant en train d'écrire">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            {pendingAction && !isTyping && (
              <div className="chatbot-msg chatbot-msg--bot">
                <Button variant="secondary" size="sm" onClick={handleAction}>
                  {pendingAction.label} →
                </Button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="chatbot-drawer__suggestions">
              <span className="chatbot-drawer__suggestions-label">Suggestions</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chatbot-suggestion"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form className="chatbot-drawer__form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="chatbot-drawer__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Poser une question..."
              aria-label="Question à poser à l'assistant"
            />
            <button
              type="submit"
              className="chatbot-drawer__send"
              disabled={!input.trim() || isTyping}
              aria-label="Envoyer"
            >
              <Send size={18} />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
