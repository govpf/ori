// Bootstrap minimal - Storybook Angular ne consomme pas vraiment ce point
// d'entrée mais Angular CLI exige un build target valide. Le fichier reste
// minimaliste : une App vide avec providers par défaut.
import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<p>Storybook Angular host (non utilisé directement, voir Storybook)</p>',
})
class AppComponent {}

bootstrapApplication(AppComponent).catch((err) => console.error(err));
