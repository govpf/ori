import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher.js';

const meta = {
  title: 'Primitives/Actions/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Sélecteur de langue compact. La liste des langues est fournie par l'app (cf. décision J.2 : pas de hardcoding pour permettre les contextes locaux - tahitien, marquisien, etc.).",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 80, display: 'flex', justifyContent: 'flex-end' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FrEn: Story = {
  render: () => {
    const [lang, setLang] = useState('fr');
    return (
      <LanguageSwitcher
        languages={[
          { code: 'fr', label: 'Français' },
          { code: 'en', label: 'English' },
        ]}
        value={lang}
        onChange={setLang}
      />
    );
  },
};

export const WithTahitian: Story = {
  render: () => {
    const [lang, setLang] = useState('fr');
    return (
      <LanguageSwitcher
        languages={[
          { code: 'fr', label: 'Français' },
          { code: 'ty', label: 'Reo Tahiti' },
          { code: 'en', label: 'English' },
        ]}
        value={lang}
        onChange={setLang}
      />
    );
  },
};

export const FullSet: Story = {
  render: () => {
    const [lang, setLang] = useState('fr');
    return (
      <LanguageSwitcher
        languages={[
          { code: 'fr', label: 'Français' },
          { code: 'ty', label: 'Reo Tahiti' },
          { code: 'mq', label: 'Reo Eṅana (marquisien)' },
          { code: 'en', label: 'English' },
        ]}
        value={lang}
        onChange={setLang}
      />
    );
  },
};
