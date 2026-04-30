import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriLogoComponent } from './logo.component';

const meta: Meta<OriLogoComponent> = {
  title: 'Primitives/Affichage/Logo',
  component: OriLogoComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Logo institutionnel : écusson PF officiel + titre/sous-titre. SVG inline.',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriLogoComponent] })],
  args: { title: 'Polynésie française' },
  render: (args: Args) => ({
    props: args,
    template: `<ori-logo
      [title]="title"
      [subtitle]="subtitle || ''"
      [href]="href || ''"
      [hideCrest]="hideCrest || false"
    ></ori-logo>`,
  }),
};

export default meta;
type Story = StoryObj<OriLogoComponent>;

export const Default: Story = { name: 'Par défaut' };

export const WithSubtitle: Story = {
  name: 'Avec sous-titre',
  args: { subtitle: 'Direction des affaires maritimes' },
};

export const AsLink: Story = {
  args: { href: '/', subtitle: 'Service en ligne' },
};

export const TitleOnly: Story = {
  name: 'Titre seul',
  args: { hideCrest: true, subtitle: 'Service en ligne' },
};
