import { ErrorPage } from '@govpf/ori-react';

export function MaintenancePage() {
  return (
    <ErrorPage
      variant="maintenance"
      code="Maintenance"
      title="Le service est temporairement indisponible"
      description="Une maintenance technique est en cours pour améliorer le portail. Le service sera de nouveau accessible vers 23 h, heure locale."
      detail={
        <>Pour les démarches urgentes, contacter le standard du service au (689) 40 47 20 20.</>
      }
    />
  );
}
