import type { Meta, StoryObj, Args } from '@storybook/angular';
import { OriCodeBlockComponent } from './code-block.component';

const meta: Meta<OriCodeBlockComponent> = {
  title: 'Publishing/Documentation/CodeBlock',
  component: OriCodeBlockComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Bloc de code avec en-tête (langue / nom de fichier) et bouton de copie. Le syntax highlighting n'est pas embarqué : projeter du HTML stylé via ng-content.",
      },
    },
  },
  argTypes: {
    lang: { control: 'text' },
    filename: { control: 'text' },
    noCopy: { control: 'boolean' },
  },
  args: {
    lang: 'ts',
    code: `import { OriButtonComponent } from '@govpf/ori-angular';

@Component({
  imports: [OriButtonComponent],
  template: '<ori-button variant="primary">Commencer</ori-button>'
})
export class App {}`,
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-code-block [code]="code" [lang]="lang" [filename]="filename" [noCopy]="noCopy"></ori-code-block>`,
  }),
};

export default meta;
type Story = StoryObj<OriCodeBlockComponent>;

export const Default: Story = {};

export const WithFilename: Story = {
  args: { filename: 'app.component.ts' },
};

export const Bash: Story = {
  args: { lang: 'bash', code: 'pnpm install @govpf/ori-angular' },
};

export const NoCopyButton: Story = {
  args: { noCopy: true },
};
