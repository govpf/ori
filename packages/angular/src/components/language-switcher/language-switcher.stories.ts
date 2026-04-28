import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriLanguageSwitcherComponent } from './language-switcher.component';

const meta: Meta<OriLanguageSwitcherComponent> = {
  title: 'Composants/Actions/LanguageSwitcher',
  component: OriLanguageSwitcherComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Sélecteur de langue compact. La liste est fournie par l'app (pas de hardcoding).",
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriLanguageSwitcherComponent] }),
    (storyFn) => {
      const story = storyFn();
      return {
        ...story,
        template: `<div style="padding: 80px; display: flex; justify-content: flex-end;">${story.template}</div>`,
      };
    },
  ],
  render: (args: Args) => ({
    props: args,
    template: `<ori-language-switcher
      [languages]="languages"
      [value]="value"
      (languageChange)="value = $event"
    ></ori-language-switcher>`,
  }),
};

export default meta;
type Story = StoryObj<OriLanguageSwitcherComponent>;

export const FrEn: Story = {
  args: {
    value: 'fr',
    languages: [
      { code: 'fr', label: 'Français' },
      { code: 'en', label: 'English' },
    ],
  },
};

export const WithTahitian: Story = {
  args: {
    value: 'fr',
    languages: [
      { code: 'fr', label: 'Français' },
      { code: 'ty', label: 'Reo Tahiti' },
      { code: 'en', label: 'English' },
    ],
  },
};

export const FullSet: Story = {
  args: {
    value: 'fr',
    languages: [
      { code: 'fr', label: 'Français' },
      { code: 'ty', label: 'Reo Tahiti' },
      { code: 'mq', label: 'Reo Eṅana (marquisien)' },
      { code: 'en', label: 'English' },
    ],
  },
};
