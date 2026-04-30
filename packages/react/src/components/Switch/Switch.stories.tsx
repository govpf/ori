import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch.js';

const meta = {
  title: 'Primitives/Saisie/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Bascule on/off pour un réglage qui s'applique immédiatement (préférences, mode sombre, notifications…). Pour un choix qui doit être validé en soumettant un formulaire, préférer `<Checkbox>`.",
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Recevoir les notifications par email',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'Par défaut' };

export const On: Story = {
  args: { defaultChecked: true },
};

export const WithHint: Story = {
  name: 'Avec indication',
  args: {
    hint: "L'envoi est immédiat dès activation.",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  name: 'Désactivé',
  args: { disabled: true, defaultChecked: true, label: 'Réglage verrouillé' },
};

export const Controlled: Story = {
  name: 'Contrôlé',
  render: () => {
    const [enabled, setEnabled] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Switch
          label="Mode sombre"
          hint={enabled ? 'Activé' : 'Désactivé'}
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          État actuel : <strong>{enabled ? 'on' : 'off'}</strong>
        </p>
      </div>
    );
  },
};

export const Group: Story = {
  name: 'Groupe',
  render: () => (
    <fieldset className="ori-choice-group" style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="ori-field__label">Préférences de confidentialité</legend>
      <Switch defaultChecked label="Partager mes statistiques d'utilisation" />
      <Switch label="Recevoir des recommandations personnalisées" />
      <Switch defaultChecked label="Activer la sauvegarde automatique" />
    </fieldset>
  ),
};
