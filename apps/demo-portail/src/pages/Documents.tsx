import { useMemo, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  CardBody,
  Dialog,
  DialogContent,
  FileCard,
  FileUpload,
  Input,
  Pagination,
  Select,
  Tabs,
  useToast,
} from '@govpf/ori-react';
import { Download, Eye, FileText, Search, Trash2, Upload } from 'lucide-react';
import { documents as documentsInitiaux, type Document } from '../data/mock.js';
import type { Route } from '../App.js';

interface DocumentsPageProps {
  onNavigate: (route: Route) => void;
}

type FiltreType = 'all' | Document['type'];

const PAGE_SIZE = 6;

const TAB_ORDER: { value: FiltreType; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'pdf', label: 'PDF' },
  { value: 'image', label: 'Images' },
  { value: 'doc', label: 'Documents' },
];

export function DocumentsPage({ onNavigate }: DocumentsPageProps) {
  const { toast } = useToast();

  const [docs, setDocs] = useState<Document[]>(documentsInitiaux);
  const [filtre, setFiltre] = useState<FiltreType>('all');
  const [search, setSearch] = useState('');
  const [demandeFilter, setDemandeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Document | null>(null);

  const counters = useMemo(() => {
    const out: Record<FiltreType, number> = { all: docs.length, pdf: 0, image: 0, doc: 0 };
    for (const d of docs) out[d.type] += 1;
    return out;
  }, [docs]);

  const demandeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const d of docs) if (d.demandeNumero) set.add(d.demandeNumero);
    return Array.from(set).sort().reverse();
  }, [docs]);

  const filtered = useMemo(() => {
    let rows = docs;
    if (filtre !== 'all') rows = rows.filter((d) => d.type === filtre);
    if (demandeFilter === '__none') {
      rows = rows.filter((d) => !d.demandeNumero);
    } else if (demandeFilter) {
      rows = rows.filter((d) => d.demandeNumero === demandeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((d) => d.nom.toLowerCase().includes(q));
    }
    return rows;
  }, [docs, filtre, demandeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleUploadComplete = (files: File[]) => {
    const ajoutes = files.map<Document>((f, i) => ({
      id: `local-${Date.now()}-${i}`,
      nom: f.name,
      type: f.type.startsWith('image/') ? 'image' : f.name.endsWith('.docx') ? 'doc' : 'pdf',
      taille: formatTaille(f.size),
      dateAjout: '2026-04-25',
    }));
    setDocs((prev) => [...ajoutes, ...prev]);
    setUploadOpen(false);
    toast({
      variant: 'success',
      title: 'Documents ajoutés',
      description: `${files.length} fichier${files.length > 1 ? 's' : ''} importé${files.length > 1 ? 's' : ''}.`,
    });
  };

  const handleDelete = (doc: Document) => {
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    setConfirmDelete(null);
    toast({ variant: 'info', description: `Document « ${doc.nom} » supprimé.` });
  };

  const handleDownload = (doc: Document) => {
    toast({ variant: 'info', description: `Téléchargement de « ${doc.nom} »…` });
  };

  return (
    <>
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Mes documents' },
          ]}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 className="page-title">Mes documents</h1>
            <p className="page-subtitle">
              Retrouvez tous les fichiers liés à vos démarches et vos documents personnels.
            </p>
          </div>
          <Button variant="primary" onClick={() => setUploadOpen(true)}>
            <Upload size={16} aria-hidden="true" />
            Téléverser
          </Button>
        </div>
      </div>

      <Tabs
        value={filtre}
        onValueChange={(v) => {
          setFiltre(v as FiltreType);
          setPage(1);
        }}
      >
        <Tabs.List aria-label="Filtrer par type de fichier">
          {TAB_ORDER.map((t) => (
            <Tabs.Tab key={t.value} value={t.value}>
              {t.label}
              <span className="tab-count" aria-hidden="true">
                {counters[t.value]}
              </span>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <div className="filters-row">
        <div className="filters-row__field" style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search
            size={16}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '0.625rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
            }}
          />
          <Input
            placeholder="Rechercher un document…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ paddingLeft: '2rem' }}
          />
        </div>
        <div className="filters-row__field" style={{ flex: '0 1 220px' }}>
          <Select
            value={demandeFilter}
            onChange={(e) => {
              setDemandeFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrer par démarche"
          >
            <option value="">Toutes les démarches</option>
            <option value="__none">Documents personnels</option>
            {demandeOptions.map((num) => (
              <option key={num} value={num}>
                Liée à {num}
              </option>
            ))}
          </Select>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setFiltre('all');
            setSearch('');
            setDemandeFilter('');
            setPage(1);
          }}
        >
          Réinitialiser
        </Button>
      </div>

      {visible.length === 0 ? (
        <Card variant="flat">
          <CardBody>
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <FileText
                size={32}
                aria-hidden="true"
                style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}
              />
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                {search || demandeFilter || filtre !== 'all'
                  ? 'Aucun document ne correspond aux filtres.'
                  : "Vous n'avez aucun document pour le moment."}
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="doc-grid">
          {visible.map((doc) => (
            <FileCard
              key={doc.id}
              name={doc.nom}
              type={doc.type}
              size={doc.taille}
              meta={`Ajouté le ${doc.dateAjout}`}
              link={doc.demandeNumero ? { label: `Lié à ${doc.demandeNumero}` } : undefined}
              actions={[
                {
                  label: `Aperçu de ${doc.nom}`,
                  icon: <Eye size={16} aria-hidden="true" />,
                  onClick: () => handleDownload(doc),
                },
                {
                  label: `Télécharger ${doc.nom}`,
                  icon: <Download size={16} aria-hidden="true" />,
                  onClick: () => handleDownload(doc),
                },
                {
                  label: `Supprimer ${doc.nom}`,
                  icon: <Trash2 size={16} aria-hidden="true" />,
                  variant: 'danger',
                  onClick: () => setConfirmDelete(doc),
                },
              ]}
            />
          ))}
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="table-footer">
          <span className="table-footer__count">
            {filtered.length} document{filtered.length > 1 ? 's' : ''}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent
          title="Téléverser des documents"
          footer={
            <Button variant="secondary" onClick={() => setUploadOpen(false)}>
              Annuler
            </Button>
          }
        >
          <FileUpload
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.docx"
            label="Documents à téléverser"
            dropzoneTitle="Glissez-déposez vos fichiers ici, ou cliquez pour parcourir"
            dropzoneHint="Formats acceptés : PDF, PNG, JPG, DOCX. 10 Mo max par fichier."
            onFilesChange={(files) => files.length > 0 && handleUploadComplete(files)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <DialogContent
          title="Supprimer ce document ?"
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={() => confirmDelete && handleDelete(confirmDelete)}>
                Supprimer
              </Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            Le document <strong>{confirmDelete?.nom}</strong> sera supprimé définitivement. Cette
            action est irréversible.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatTaille(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
