import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileUpload } from './FileUpload.js';

const meta = {
  title: 'Composants/Saisie/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Sélecteur de fichiers avec drag-and-drop, basé sur `<input type=\"file\">` natif. L'upload réseau reste à l'app : le composant émet `onFilesChange(File[])` à chaque sélection, l'app POSTe avec sa logique d'auth/progression/retry.",
      },
    },
  },
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Pièce jointe',
    multiple: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'Formats acceptés : PDF, JPG, PNG. Taille maximale : 5 Mo.',
    accept: '.pdf,image/jpeg,image/png',
    maxSize: 5 * 1024 * 1024,
    dropzoneHint: 'PDF, JPG ou PNG · max 5 Mo',
  },
};

export const Multiple: Story = {
  args: {
    label: 'Pièces justificatives',
    hint: 'Vous pouvez ajouter plusieurs fichiers.',
    multiple: true,
    dropzoneTitle: 'Glissez-déposez vos fichiers ici',
    dropzoneHint: 'Ou cliquez pour parcourir',
  },
};

export const Required: Story = {
  args: { required: true },
};

export const WithError: Story = {
  args: {
    error: 'Au moins un fichier est obligatoire.',
    required: true,
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Controlled: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    const [rejected, setRejected] = useState<string | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FileUpload
          {...args}
          label="Justificatifs"
          multiple
          accept=".pdf,image/*"
          maxSize={2 * 1024 * 1024}
          dropzoneHint="PDF ou image · max 2 Mo"
          files={files}
          onFilesChange={(next) => {
            setRejected(null);
            setFiles(next);
          }}
          onReject={(rej) => {
            setRejected(
              rej
                .map((r) =>
                  r.reason === 'size'
                    ? `${r.file.name} dépasse 2 Mo`
                    : `${r.file.name} : type non accepté`,
                )
                .join(' · '),
            );
          }}
        />
        {rejected && (
          <p style={{ color: 'var(--color-feedback-danger)', margin: 0, fontSize: 14 }}>
            ⚠ {rejected}
          </p>
        )}
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 14 }}>
          {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné
          {files.length > 1 ? 's' : ''}
        </p>
      </div>
    );
  },
};
