import { useState } from 'react';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Radio,
  RadioGroup,
  Select,
  Textarea,
  useToast,
} from '@govpf/ori-react';
import { Camera, Save } from 'lucide-react';
import type { Route } from '../App.js';

interface ProfilPageProps {
  onNavigate: (route: Route) => void;
}

export function ProfilPage({ onNavigate }: ProfilPageProps) {
  const { toast } = useToast();

  const [civilite, setCivilite] = useState('mme');
  const [nom, setNom] = useState('TUHEIAVA');
  const [prenom, setPrenom] = useState('Heitiare');
  const [dateNaissance, setDateNaissance] = useState('1985-06-12');
  const [email, setEmail] = useState('heitiare.tuheiava@gmail.com');
  const [telephone, setTelephone] = useState('+689 87 12 34 56');
  const [adresse, setAdresse] = useState('Avenue Pouvanaa a Oopa');
  const [complement, setComplement] = useState('Résidence Tiare, Bâtiment B');
  const [codePostal, setCodePostal] = useState('98714');
  const [ville, setVille] = useState('Papeete');
  const [ile, setIle] = useState('tahiti');
  const [bio, setBio] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      variant: 'success',
      title: 'Profil mis à jour',
      description: 'Vos informations personnelles ont bien été enregistrées.',
    });
  };

  return (
    <form onSubmit={handleSave}>
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Profil' },
          ]}
        />
        <h1 className="page-title">Mon profil</h1>
        <p className="page-subtitle">
          Consultez et mettez à jour vos informations personnelles. Ces données sont utilisées pour
          pré-remplir vos démarches.
        </p>
      </div>

      <Card>
        <CardHeader title="Photo et identité" />
        <CardBody>
          <div className="profile-identity">
            <div className="profile-avatar">
              <Avatar alt={`${prenom} ${nom}`} size="xl" />
              <Button variant="ghost" size="sm" type="button">
                <Camera size={14} aria-hidden="true" />
                Changer
              </Button>
            </div>
            <div className="form-grid" style={{ flex: 1 }}>
              <RadioGroup
                label="Civilité"
                value={civilite}
                onChange={setCivilite}
                orientation="inline"
              >
                <Radio value="mme" label="Madame" />
                <Radio value="m" label="Monsieur" />
                <Radio value="autre" label="Autre / non précisé" />
              </RadioGroup>
              <Input
                label="Prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
              <Input label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
              <Input
                label="Date de naissance"
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                required
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Coordonnées"
          subtitle="Utilisées pour vous joindre concernant vos démarches"
        />
        <CardBody>
          <div className="form-grid">
            <Input
              label="Adresse e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              hint="Vous recevrez les notifications sur cette adresse."
              required
            />
            <Input
              label="Téléphone"
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              hint="Format international, ex : +689 87 12 34 56"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Adresse postale" />
        <CardBody>
          <div className="form-grid">
            <Input
              label="Adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              wrapperClassName="form-grid__full"
              required
            />
            <Input
              label="Complément d'adresse"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              wrapperClassName="form-grid__full"
            />
            <Input
              label="Code postal"
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)}
              required
            />
            <Input
              label="Ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              required
            />
            <Select
              label="Île de résidence"
              value={ile}
              onChange={(e) => setIle(e.target.value)}
              required
            >
              <option value="tahiti">Tahiti</option>
              <option value="moorea">Moorea-Maiao</option>
              <option value="raiatea">Raiatea</option>
              <option value="bora">Bora-Bora</option>
              <option value="huahine">Huahine</option>
              <option value="autre">Autre</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="À propos"
          subtitle="Quelques mots qui s'afficheront sur votre fiche publique (optionnel)"
        />
        <CardBody>
          <Textarea
            label="Présentation"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={280}
            hint={`${bio.length} / 280 caractères`}
          />
        </CardBody>
      </Card>

      <div className="form-actions">
        <Button variant="ghost" type="button" onClick={() => onNavigate({ name: 'dashboard' })}>
          Annuler
        </Button>
        <Button variant="primary" type="submit">
          <Save size={16} aria-hidden="true" />
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
