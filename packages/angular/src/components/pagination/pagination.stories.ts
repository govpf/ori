import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriPaginationComponent } from './pagination.component';

const meta: Meta<OriPaginationComponent> = {
  title: 'Composants/Navigation/Pagination',
  component: OriPaginationComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pagination accessible avec ellipses calculées automatiquement. Émet `(pageChange)`.',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriPaginationComponent] })],
  render: (args: Args) => ({
    props: args,
    template: `<ori-pagination
      [page]="page"
      [totalPages]="totalPages"
      [siblings]="siblings || 1"
      (pageChange)="page = $event"
    ></ori-pagination>`,
  }),
};

export default meta;
type Story = StoryObj<OriPaginationComponent>;

export const Default: Story = {
  args: { page: 1, totalPages: 10 },
};

export const Middle: Story = {
  args: { page: 5, totalPages: 20 },
};

export const FewPages: Story = {
  args: { page: 2, totalPages: 4 },
};

export const ManyPages: Story = {
  args: { page: 50, totalPages: 100, siblings: 2 },
};

export const FirstPage: Story = {
  args: { page: 1, totalPages: 20 },
};

export const LastPage: Story = {
  args: { page: 20, totalPages: 20 },
};
