import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriAvatarComponent } from './avatar.component';

const meta: Meta<OriAvatarComponent> = {
  title: 'Composants graphiques/Avatar',
  component: OriAvatarComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Avatar avec image et fallback sur initiales.',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriAvatarComponent] })],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
  },
  args: { alt: 'Léonard Tavae', size: 'md' },
  render: (args: Args) => ({
    props: args,
    template: `<ori-avatar
      [src]="src || ''"
      [alt]="alt"
      [initials]="initials || ''"
      [size]="size"
    ></ori-avatar>`,
  }),
};

export default meta;
type Story = StoryObj<OriAvatarComponent>;

export const InitialsOnly: Story = {};

export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/150?u=leonard' },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <ori-avatar alt="Marie Dupont" size="sm"></ori-avatar>
        <ori-avatar alt="Marie Dupont" size="md"></ori-avatar>
        <ori-avatar alt="Marie Dupont" size="lg"></ori-avatar>
        <ori-avatar alt="Marie Dupont" size="xl"></ori-avatar>
      </div>
    `,
  }),
};

export const FallbackOnError: Story = {
  args: {
    src: 'https://this-url-does-not-exist.invalid/avatar.jpg',
    alt: 'Jean Martin',
  },
};

export const ExplicitInitials: Story = {
  args: { alt: 'Direction des Affaires Maritimes', initials: 'DAM' },
};
