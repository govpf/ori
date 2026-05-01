import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriDownloadButtonComponent } from './download-button.component';

const meta: Meta<OriDownloadButtonComponent> = {
  title: 'Primitives/Actions/DownloadButton',
  component: OriDownloadButtonComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lien de téléchargement de fichier avec icône intégrée et métadonnées (type + taille) optionnelles.',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriDownloadButtonComponent] })],
};

export default meta;
type Story = StoryObj<OriDownloadButtonComponent>;

export const Default: Story = {
  name: 'Par défaut',
  args: { href: '#', fileType: 'PDF', fileSize: '2.55 MB' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-download-button [href]="href" [fileType]="fileType" [fileSize]="fileSize">
        Télécharger la brochure
      </ori-download-button>
    `,
  }),
};

export const PDF: Story = {
  name: 'Fichier PDF',
  args: { href: '#', fileType: 'PDF', fileSize: '847 Ko' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-download-button [href]="href" [fileType]="fileType" [fileSize]="fileSize">
        Notice d'information
      </ori-download-button>
    `,
  }),
};

export const Word: Story = {
  name: 'Fichier Word',
  args: { href: '#', fileType: 'DOCX', fileSize: '124 Ko' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-download-button [href]="href" [fileType]="fileType" [fileSize]="fileSize">
        Modèle de demande
      </ori-download-button>
    `,
  }),
};

export const Excel: Story = {
  name: 'Fichier Excel',
  args: { href: '#', fileType: 'XLSX', fileSize: '3.2 MB' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-download-button [href]="href" [fileType]="fileType" [fileSize]="fileSize">
        Tableau de suivi
      </ori-download-button>
    `,
  }),
};

export const SansMeta: Story = {
  name: 'Sans métadonnées',
  args: { href: '#', hideMeta: true },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-download-button [href]="href" [hideMeta]="hideMeta">
        Télécharger
      </ori-download-button>
    `,
  }),
};
