import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from './CodeBlock.js';

const meta = {
  title: 'Patterns/Documentation/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Bloc de code avec en-tête (langue / nom de fichier) et bouton de copie. Le syntax highlighting n'est pas embarqué : passer du HTML stylé via `highlighted` (résultat de Shiki, Prism, etc.).",
      },
    },
  },
  argTypes: {
    lang: { control: 'text' },
    filename: { control: 'text' },
    noCopy: { control: 'boolean' },
  },
  args: {
    lang: 'tsx',
    code: `import { Button } from '@govpf/ori-react';

export function App() {
  return <Button variant="primary">Commencer</Button>;
}`,
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'Par défaut' };

export const WithFilename: Story = {
  args: { filename: 'src/App.tsx' },
};

export const Bash: Story = {
  args: { lang: 'bash', code: 'pnpm install @govpf/ori-react' },
};

export const NoCopyButton: Story = {
  args: { noCopy: true },
};
