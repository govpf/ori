import { useState } from 'react';
import {
  Breadcrumb,
  Steps,
  Tabs,
  Card,
  CardBody,
  Input,
  Select,
  DatePicker,
  Textarea,
  Checkbox,
  RadioGroup,
  Radio,
  FileUpload,
  Button,
  Alert,
  Tag,
  Dialog,
  DialogContent,
  Timeline,
  useToast,
} from '@govpf/ori-react';
import { FileText } from 'lucide-react';
import { demandes, documents, historique, STATUT_LABEL, STATUT_VARIANT } from '../data/mock.js';
import type { Route } from '../App.js';

interface DemandeDetailPageProps {
  demandeId: string;
  onNavigate: (route: Route) => void;
}

export function DemandeDetailPage({ demandeId, onNavigate }: DemandeDetailPageProps) {
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [notesInternes, setNotesInternes] = useState('');
  const [acceptCgu, setAcceptCgu] = useState(false);
  const [moyen, setMoyen] = useState('email');

  const demande = demandes.find((d) => d.id === demandeId);

  if (!demande) {
    return (
      <Alert severity="danger" title="Demande introuvable">
        L'identifiant {demandeId} ne correspond à aucune démarche.
      </Alert>
    );
  }

  const docsLies = documents.filter((doc) => doc.demandeNumero === demande.numero);

  const handleSoumettre = () => {
    setConfirmOpen(false);
    toast.success('Demande soumise avec succès. Vous recevrez un email de confirmation.', {
      duration: 7000,
    });
  };

  const handleEnregistrer = () => {
    toast.info('Brouillon enregistré.');
  };

  return (
    <>
      <div className="page-header">
        <Breadcrumb
          items={[
            {
              label: 'Accueil',
              href: '#',
              onClick: (e) => {
                e.preventDefault();
                onNavigate({ name: 'dashboard' });
              },
            },
            {
              label: 'Mes démarches',
              href: '#',
              onClick: (e) => {
                e.preventDefault();
                onNavigate({ name: 'dashboard' });
              },
            },
            { label: `Demande ${demande.numero}` },
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h1 className="page-title">Demande {demande.numero}</h1>
          <Tag variant={STATUT_VARIANT[demande.statut]}>{STATUT_LABEL[demande.statut]}</Tag>
        </div>
        <p className="page-subtitle">
          {demande.type} · {demande.service} · Créée le {demande.dateCreation}
        </p>
      </div>

      {demande.statut === 'a_completer' && (
        <Alert severity="warning" title="Action requise">
          Une pièce justificative est manquante. Veuillez compléter votre dossier dans l'onglet «
          Pièces jointes ».
        </Alert>
      )}

      {/* Steps - workflow */}
      <Card>
        <CardBody>
          <Steps
            current={demande.etapeActuelle}
            steps={[
              { title: 'Identité', description: 'Vos informations' },
              { title: 'Justificatifs', description: 'Pièces requises' },
              { title: 'Validation', description: 'Récapitulatif' },
              { title: 'Confirmation', description: 'Envoi du dossier' },
            ]}
          />
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="infos">
        <Tabs.List aria-label="Sections de la demande">
          <Tabs.Tab value="infos">Informations</Tabs.Tab>
          <Tabs.Tab value="pieces">Pièces jointes ({docsLies.length})</Tabs.Tab>
          <Tabs.Tab value="historique">Historique</Tabs.Tab>
        </Tabs.List>

        {/* Tab Informations */}
        <Tabs.Panel value="infos">
          <Card>
            <CardBody>
              <h3 className="section-title" style={{ marginBottom: '1rem' }}>
                Informations de la demande
              </h3>
              <div className="form-grid">
                <Select
                  label="Civilité"
                  required
                  options={[
                    { value: 'mme', label: 'Madame' },
                    { value: 'm', label: 'Monsieur' },
                    { value: 'autre', label: 'Autre' },
                  ]}
                  defaultValue="mme"
                />
                <Input label="Nom" required defaultValue="TUHEIAVA" />
                <Input label="Prénom" required defaultValue="Heitiare" />
                <DatePicker label="Date de naissance" required defaultValue="1985-06-15" />
                <Input
                  label="Adresse email"
                  type="email"
                  required
                  defaultValue="heitiare.tuheiava@gmail.com"
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  defaultValue="+689 87 12 34 56"
                  hint="Numéro mobile de préférence"
                />
              </div>

              <div className="form-stack" style={{ marginTop: '1rem' }}>
                <RadioGroup
                  label="Moyen de contact préféré"
                  value={moyen}
                  onChange={setMoyen}
                  orientation="inline"
                >
                  <Radio value="email" label="Email" />
                  <Radio value="sms" label="SMS" />
                  <Radio value="courrier" label="Courrier postal" />
                </RadioGroup>

                <Textarea
                  label="Notes complémentaires"
                  placeholder="Précisions à transmettre au service instructeur…"
                  rows={4}
                  value={notesInternes}
                  onChange={(e) => setNotesInternes(e.target.value)}
                  hint="Optionnel - 500 caractères max"
                  maxLength={500}
                />

                <Checkbox
                  label="J'atteste sur l'honneur que les informations fournies sont exactes et complètes."
                  checked={acceptCgu}
                  onChange={(e) => setAcceptCgu(e.target.checked)}
                />
              </div>
            </CardBody>
          </Card>
        </Tabs.Panel>

        {/* Tab Pièces jointes */}
        <Tabs.Panel value="pieces">
          <Card>
            <CardBody>
              <h3 className="section-title" style={{ marginBottom: '0.75rem' }}>
                Pièces déjà ajoutées
              </h3>
              {docsLies.length > 0 ? (
                <ul className="file-list">
                  {docsLies.map((doc) => (
                    <li key={doc.id} className="file-list__item">
                      <FileText
                        size={18}
                        aria-hidden="true"
                        style={{ color: 'var(--color-text-secondary)' }}
                      />
                      <span className="file-list__name">{doc.nom}</span>
                      <span className="file-list__size">{doc.taille}</span>
                      <Tag variant="success">Validé</Tag>
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}
                >
                  Aucune pièce déposée pour cette demande.
                </p>
              )}

              <h3
                className="section-title"
                style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}
              >
                Ajouter une pièce
              </h3>
              <FileUpload
                label="Pièce justificative"
                hint="Formats acceptés : PDF, JPG, PNG. Taille max : 5 Mo."
                accept=".pdf,image/*"
                maxSize={5 * 1024 * 1024}
                multiple
                files={files}
                onFilesChange={setFiles}
                dropzoneTitle="Glissez-déposez votre fichier ici"
                dropzoneHint="Ou cliquez pour parcourir"
              />
            </CardBody>
          </Card>
        </Tabs.Panel>

        {/* Tab Historique */}
        <Tabs.Panel value="historique">
          <Card>
            <CardBody>
              <h3 className="section-title" style={{ marginBottom: '1rem' }}>
                Activité récente
              </h3>
              <Timeline
                items={historique.map((entry, i) => ({
                  id: entry.id,
                  title: entry.action,
                  timestamp: entry.date,
                  actor: entry.acteur,
                  description: entry.detail,
                  status: i === 0 ? 'current' : 'completed',
                }))}
              />
            </CardBody>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Actions de bas de page */}
      <div className="form-actions">
        <Button variant="ghost" onClick={() => onNavigate({ name: 'dashboard' })}>
          Annuler
        </Button>
        <Button variant="secondary" onClick={handleEnregistrer}>
          Enregistrer brouillon
        </Button>
        <Button variant="primary" onClick={() => setConfirmOpen(true)} disabled={!acceptCgu}>
          Soumettre la demande
        </Button>
      </div>

      {/* Dialog de confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          title="Soumettre la demande"
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleSoumettre}>
                Confirmer l'envoi
              </Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            Une fois soumise, la demande <strong>{demande.numero}</strong> ne pourra plus être
            modifiée. Elle sera transmise au service instructeur sous 24h.
          </p>
          <p
            style={{
              margin: '0.75rem 0 0',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
            }}
          >
            Vous recevrez un email de confirmation à <strong>heitiare.tuheiava@gmail.com</strong>.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
