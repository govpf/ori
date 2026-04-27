import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriSkeletonComponent } from './skeleton.component';

const meta: Meta<OriSkeletonComponent> = {
  title: 'Composants graphiques/Skeleton',
  component: OriSkeletonComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Placeholder animé (shimmer) pour indiquer un chargement. Décoratif (`aria-hidden`).',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriSkeletonComponent] })],
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
  },
  args: { variant: 'rect', width: 200, height: 16 },
  render: (args: Args) => ({
    props: args,
    template: `<ori-skeleton [variant]="variant" [width]="width" [height]="height"></ori-skeleton>`,
  }),
};

export default meta;
type Story = StoryObj<OriSkeletonComponent>;

export const Text: Story = {
  args: { variant: 'text', width: 240, height: '' },
};

export const Rectangle: Story = {
  args: { variant: 'rect', width: 280, height: 120 },
};

export const Circle: Story = {
  args: { variant: 'circle', width: 48, height: 48 },
};

export const ListItem: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 360px;">
        @for (n of [1, 2, 3]; track n) {
          <div style="display: flex; align-items: center; gap: 12px;">
            <ori-skeleton variant="circle" [width]="40" [height]="40"></ori-skeleton>
            <div style="display: flex; flex-direction: column; gap: 6px; flex: 1;">
              <ori-skeleton variant="text" width="60%"></ori-skeleton>
              <ori-skeleton variant="text" width="90%"></ori-skeleton>
            </div>
          </div>
        }
      </div>
    `,
  }),
};

export const Card: Story = {
  render: () => ({
    template: `
      <div style="width: 320px; display: flex; flex-direction: column; gap: 12px;">
        <ori-skeleton variant="rect" width="100%" [height]="160"></ori-skeleton>
        <ori-skeleton variant="text" width="80%" [height]="20"></ori-skeleton>
        <ori-skeleton variant="text" width="60%"></ori-skeleton>
        <ori-skeleton variant="text" width="90%"></ori-skeleton>
      </div>
    `,
  }),
};
