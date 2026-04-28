import { Controller } from '@hotwired/stimulus';

export default class extends Controller {

    // Déclaration des targets et values
    static targets = ['affichageValeur', 'affichageStep', 'message'];
    static values  = { valeur: Number, step: Number, max: Number, min: Number };

    valeurValueChanged() {
        this.messageTarget.textContent = "";
        this.affichageValeurTarget.textContent = this.valeurValue;
    }
    stepValueChanged() {
        this.affichageStepTarget.value = this.stepValue;
    }
    incrementer() {
        this.valeurValue += this.stepValue;
        if(this.valeurValue > this.maxValue) {
            this.valeurValue = this.maxValue;
            this.messageTarget.textContent = "Le maximum du compteur est " + this.maxValue;
        }
    }

    decrementer() {
        this.valeurValue -= this.stepValue;
        if(this.valeurValue < this.minValue) {
            this.valeurValue = this.minValue;
            this.messageTarget.textContent = "Le minimum du compteur est " + this.minValue;
        }
    }

    changerStep(event) {
        this.stepValue = parseInt(event.target.value) || 1;
    }

    reinitialiser() {
        this.valeurValue = 0;
        this.stepValue = 1;
    }

    updateMaxValue(event) {
        this.maxValue = parseInt(event.target.value) || 10;
    }
    updateMinValue(event) {
        this.minValue = parseInt(event.target.value) || 0;
    }
}