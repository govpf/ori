import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar.js';

const meta = {
  title: 'Primitives/Affichage/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avatar avec image et fallback sur initiales. Si `src` est absent ou échoue à charger, on affiche les initiales calculées depuis `alt` (ou fournies via `initials`).',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
  },
  args: {
    alt: 'Léonard Tavae',
    size: 'md',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InitialsOnly: Story = {};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?u=leonard',
  },
};

export const Sizes: Story = {
  name: 'Tailles',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar alt="Marie Dupont" size="sm" />
      <Avatar alt="Marie Dupont" size="md" />
      <Avatar alt="Marie Dupont" size="lg" />
      <Avatar alt="Marie Dupont" size="xl" />
    </div>
  ),
};

export const FallbackOnError: Story = {
  args: {
    src: 'https://this-url-does-not-exist.invalid/avatar.jpg',
    alt: 'Jean Martin',
  },
};

export const ExplicitInitials: Story = {
  args: {
    alt: 'Direction des Affaires Maritimes',
    initials: 'DAM',
  },
};
