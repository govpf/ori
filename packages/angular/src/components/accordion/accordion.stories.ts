import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriAccordionComponent, OriAccordionItemComponent } from './accordion.component';

const meta: Meta<OriAccordionComponent> = {
  title: 'Composants/Mise en page/Accordion',
  component: OriAccordionComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Accordéon basé sur `<details>` / `<summary>` natifs. A11y native, mode exclusif (single) via l'attribut HTML `name`.",
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriAccordionComponent, OriAccordionItemComponent] }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 540px;">${story.template}</div>` };
    },
  ],
};

export default meta;
type Story = StoryObj<OriAccordionComponent>;

export const Multiple: Story = {
  render: () => ({
    template: `
      <ori-accordion type="multiple">
        <ori-accordion-item title="Quelles sont les pièces à fournir ?">
          Une pièce d'identité, un justificatif de domicile de moins de 3 mois et le formulaire complété.
        </ori-accordion-item>
        <ori-accordion-item title="Quels sont les délais de traitement ?">
          Une fois le dossier complet reçu, le traitement prend en moyenne 7 jours ouvrés.
        </ori-accordion-item>
        <ori-accordion-item title="Comment suivre l'avancement ?">
          Vous recevez une notification par email à chaque changement d'état du dossier.
        </ori-accordion-item>
      </ori-accordion>
    `,
  }),
};

export const Single: Story = {
  render: () => ({
    template: `
      <ori-accordion type="single">
        <ori-accordion-item title="Section 1" [defaultOpen]="true">
          Quand un autre item est ouvert, celui-ci se ferme automatiquement (mode exclusif).
        </ori-accordion-item>
        <ori-accordion-item title="Section 2">Contenu de la section 2.</ori-accordion-item>
        <ori-accordion-item title="Section 3">Contenu de la section 3.</ori-accordion-item>
      </ori-accordion>
    `,
  }),
};

export const WithDefaultOpen: Story = {
  render: () => ({
    template: `
      <ori-accordion type="multiple">
        <ori-accordion-item title="Question fréquente A" [defaultOpen]="true">
          Cet item est ouvert au chargement.
        </ori-accordion-item>
        <ori-accordion-item title="Question fréquente B">Fermé par défaut.</ori-accordion-item>
      </ori-accordion>
    `,
  }),
};
