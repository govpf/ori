import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriFileUploadComponent } from './file-upload.component';

const meta: Meta<OriFileUploadComponent> = {
  title: 'Compositions/Saisie/FileUpload',
  component: OriFileUploadComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sélecteur de fichiers avec drag-and-drop, basé sur `<input type="file">` natif. L\'upload réseau reste à l\'app : le composant émet `(filesChange)` à chaque sélection.',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriFileUploadComponent] }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 480px;">${story.template}</div>` };
    },
  ],
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Pièce jointe',
    multiple: false,
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-file-upload
      [label]="label"
      [hint]="hint"
      [error]="error"
      [accept]="accept || ''"
      [multiple]="multiple"
      [disabled]="disabled"
      [required]="required"
      [maxSize]="maxSize || null"
      [dropzoneTitle]="dropzoneTitle || 'Glissez-déposez ou cliquez pour sélectionner'"
      [dropzoneHint]="dropzoneHint || ''"
    ></ori-file-upload>`,
  }),
};

export default meta;
type Story = StoryObj<OriFileUploadComponent>;

export const Default: Story = { name: 'Par défaut' };

export const WithHint: Story = {
  name: 'Avec indication',
  args: {
    hint: 'Formats acceptés : PDF, JPG, PNG. Taille maximale : 5 Mo.',
    accept: '.pdf,image/jpeg,image/png',
    maxSize: 5 * 1024 * 1024,
    dropzoneHint: 'PDF, JPG ou PNG · max 5 Mo',
  },
};

export const Multiple: Story = {
  name: 'Multiple',
  args: {
    label: 'Pièces justificatives',
    hint: 'Vous pouvez ajouter plusieurs fichiers.',
    multiple: true,
    dropzoneTitle: 'Glissez-déposez vos fichiers ici',
    dropzoneHint: 'Ou cliquez pour parcourir',
  },
};

export const Required: Story = {
  name: 'Requis',
  args: { required: true },
};

export const WithError: Story = {
  name: 'Avec erreur',
  args: {
    error: 'Au moins un fichier est obligatoire.',
    required: true,
  },
};

export const Disabled: Story = {
  name: 'Désactivé',
  args: { disabled: true },
};
