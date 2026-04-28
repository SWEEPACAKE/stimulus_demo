import { Controller } from '@hotwired/stimulus';

export default class extends Controller {

    static targets = ['liste', 'champSaisie', 'compteur', 'progression', 'messageVide'];
    static values  = { filtre: String, total: Number, completes: Number };
    static classes = ['done'];

    // ----------------------------------------------------------------
    // Callbacks
    // ----------------------------------------------------------------

    filtreValueChanged() {
        this.appliquerFiltre();
        this.mettreAJourCompteur();
    }

    totalValueChanged() {
        this.mettreAJourCompteur();
        this.mettreAJourProgression();
    }

    completesValueChanged() {
        this.mettreAJourProgression();
    }

    // ----------------------------------------------------------------
    // Actions
    // ----------------------------------------------------------------

    ajouterTache(event) {
        event.preventDefault();

        const texte = this.champSaisieTarget.value.trim();
        if (!texte) return;

        const li = document.createElement('li');
        li.dataset.texte = texte;
        li.dataset.complete = 'false';
        li.innerHTML = `
            <input type="checkbox" data-action="change->todo#toggleTache">
            <span>${texte}</span>
            <button data-action="todo#supprimerTache" data-todo-index-param="${this.totalValue}">✕</button>
        `;

        this.listeTarget.appendChild(li);
        this.champSaisieTarget.value = '';
        this.totalValue++;

        this.appliquerFiltre();
        this.mettreAJourMessageVide();
    }

    toggleTache(event) {
        // On navigue dans le DOM pour accéder au li complet
        const li = event.target.closest('li');
        const estComplete = event.target.checked;

        li.dataset.complete = estComplete ? 'true' : 'false';

        if (estComplete) {
            // doneClass est créé grâce à l'attribut data-todo-done-class et vaut tache-complete
            li.classList.add(this.doneClass);
            this.completesValue++;
        } else {
            li.classList.remove(this.doneClass);
            this.completesValue--;
        }

        this.appliquerFiltre();
    }

    supprimerTache(event) {
        // On navigue dans le DOM pour accéder au li complet
        const li = event.target.closest('li');
        const estComplete = li.dataset.complete === 'true';

        if (estComplete) this.completesValue--;
        this.totalValue--;

        li.remove();
        this.mettreAJourMessageVide();
    }

    filtrer(event) {
        this.filtreValue = event.params.filtre;
    }

    // ----------------------------------------------------------------
    // Méthodes internes
    // ----------------------------------------------------------------

    appliquerFiltre() {
        const taches = this.listeTarget.querySelectorAll('li');

        taches.forEach(li => {
            const estComplete = li.dataset.complete === 'true';

            const visible =
                this.filtreValue === 'tous' ||
                (this.filtreValue === 'completees' && estComplete) ||
                (this.filtreValue === 'actives' && !estComplete);

            li.hidden = !visible;
        });

        this.mettreAJourMessageVide();
    }

    mettreAJourCompteur() {
        const taches   = this.listeTarget.querySelectorAll('li');
        const visibles = [...taches].filter(li => !li.hidden).length;

        this.compteurTarget.textContent =
            this.totalValue > 0 ? `(${visibles}/${this.totalValue})` : '';
    }

    mettreAJourProgression() {
        if (this.totalValue === 0) {
            this.progressionTarget.style.width = '0%';
            return;
        }
        const pct = Math.round((this.completesValue / this.totalValue) * 100);
        this.progressionTarget.style.width = `${pct}%`;
    }

    mettreAJourMessageVide() {
        const taches   = this.listeTarget.querySelectorAll('li');
        const visibles = [...taches].filter(li => !li.hidden).length;
        this.messageVideTarget.hidden = visibles > 0;
    }
}