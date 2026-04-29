import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, FormSection, FormField, FormActions } from './Form';

describe('Form', () => {
  it('rend un <form> avec noValidate', () => {
    const { container } = render(<Form>x</Form>);
    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    expect(form).toHaveAttribute('novalidate');
  });

  it('appelle onSubmit au submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e) => e.preventDefault());
    render(
      <Form onSubmit={onSubmit}>
        <button type="submit">OK</button>
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});

describe('FormSection', () => {
  it('rend un <section> avec un titre h3 lié via aria-labelledby', () => {
    render(
      <FormSection title="Mon titre">
        <span>contenu</span>
      </FormSection>,
    );
    const section = screen.getByRole('region', { name: 'Mon titre' });
    expect(section).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Mon titre');
  });

  it('rend la description sous le titre', () => {
    render(<FormSection title="T" description="Une description courte." />);
    expect(screen.getByText('Une description courte.')).toBeInTheDocument();
  });

  it('ne rend pas de header sans titre ni description', () => {
    const { container } = render(<FormSection>x</FormSection>);
    expect(container.querySelector('.ori-form-section__header')).toBeNull();
  });
});

describe('FormField', () => {
  it('lie le label au control via htmlFor / id', () => {
    render(<FormField label="Nom">{(p) => <input {...p} />}</FormField>);
    const input = screen.getByLabelText('Nom');
    expect(input).toBeInTheDocument();
    expect(input.id).toMatch(/^pf-form-field-/);
  });

  it('affiche le marker required (visuel + aria-required sur le control)', () => {
    render(
      <FormField label="Nom" required>
        {(p) => <input {...p} />}
      </FormField>,
    );
    expect(screen.getByLabelText(/nom/i)).toBeRequired();
    // Le marker visuel * est en aria-hidden ; on vérifie sa présence dans le DOM
    const { container } = render(
      <FormField label="X" required>
        {(p) => <input {...p} />}
      </FormField>,
    );
    expect(container.querySelector('.ori-form-field__required')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('expose le hint via aria-describedby', () => {
    render(
      <FormField label="Nom" hint="Indication">
        {(p) => <input {...p} />}
      </FormField>,
    );
    const input = screen.getByLabelText('Nom');
    const describedById = input.getAttribute('aria-describedby');
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById!)).toHaveTextContent('Indication');
  });

  it("expose l'erreur via aria-describedby + aria-invalid", () => {
    render(
      <FormField label="Nom" error="Erreur de saisie">
        {(p) => <input {...p} />}
      </FormField>,
    );
    const input = screen.getByLabelText('Nom');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedById = input.getAttribute('aria-describedby');
    expect(document.getElementById(describedById!)).toHaveTextContent('Erreur de saisie');
  });

  it("rend l'erreur en role=alert (annoncée par les lecteurs d'écran)", () => {
    render(
      <FormField label="Nom" error="Boom">
        {(p) => <input {...p} />}
      </FormField>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
  });

  it('hint et erreur cohabitent (les deux liés via aria-describedby)', () => {
    render(
      <FormField label="Nom" hint="Astuce" error="Erreur">
        {(p) => <input {...p} />}
      </FormField>,
    );
    const input = screen.getByLabelText('Nom');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy.split(' ')).toHaveLength(2);
  });
});

describe('FormActions', () => {
  it("applique la classe d'alignement (default end)", () => {
    const { container } = render(<FormActions>x</FormActions>);
    expect(container.firstChild).toHaveClass('ori-form-actions--end');
  });

  it('respecte align=start', () => {
    const { container } = render(<FormActions align="start">x</FormActions>);
    expect(container.firstChild).toHaveClass('ori-form-actions--start');
  });

  it('respecte align=center', () => {
    const { container } = render(<FormActions align="center">x</FormActions>);
    expect(container.firstChild).toHaveClass('ori-form-actions--center');
  });
});
