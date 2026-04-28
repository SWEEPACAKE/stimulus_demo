import { Controller } from '@hotwired/stimulus';

export default class extends Controller {

    // Déclaration des targets et values
    static targets = ['affichageValeur', 'affichageStep', 'message', 'totalPanier', 'historique'];
    static values  = { valeur: Number, step: Number, max: Number, min: Number, prix: Number };

    valeurValueChanged() {
        this.messageTarget.textContent = "";
        this.affichageValeurTarget.textContent = this.valeurValue;

        // Formattage du montant
        const format = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 10 }).format(n);

        this.totalPanierTarget.textContent = format(this.valeurValue * this.prixValue);
    }

    stepValueChanged() {
        this.affichageStepTarget.value = this.stepValue;
    }

    changerStep(event) {
        this.stepValue = parseInt(event.target.value) || 1;
    }

    reinitialiser() {
        this.valeurValue = 0;
        this.stepValue = 1;
        this.historiqueTarget.innerHTML = "<li>1</li>";
    }

    updateMaxValue(event) {
        this.maxValue = parseInt(event.target.value) || 10;
    }
    updateMinValue(event) {
        this.minValue = parseInt(event.target.value) || 0;
    }

    changerValeur(event) {
        if(event.params.operation == "-") {
            this.valeurValue -= this.stepValue;
            if(this.valeurValue < this.minValue) {
                this.valeurValue = this.minValue;
                this.messageTarget.textContent = "Le minimum du compteur est " + this.minValue;
            }
        } else if(event.params.operation == "+") {
            this.valeurValue += this.stepValue;
            if(this.valeurValue > this.maxValue) {
                this.valeurValue = this.maxValue;
                this.messageTarget.textContent = "Le maximum du compteur est " + this.maxValue;
            }
        }
        this.historiqueTarget.innerHTML += "<li>" + event.params.operation + " " + this.stepValue + "</li>";
    }
}