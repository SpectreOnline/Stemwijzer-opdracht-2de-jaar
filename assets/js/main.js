const clickableButtons = document.querySelectorAll(".btn");
const statementOptions = document.querySelectorAll(".form-check-input");
const container = document.getElementById("container");
const title = document.getElementById("title");
const descriptionField = document.getElementById("description");
var userAnswers = [];
var statementId = 0;

// Query selector gebruiken voor wanneer je meerdere elements gebruikt
// Je moet met een foreach eroverheen kunnen loopen
// Lees meer in eventhandlers en selectors
// Lees over compound statements

startTest();

function startTest() {
    setStatement(subjects[0]);
    clickableButtons.forEach(element => {
        element.onclick = changeStatement;
    });
}

//this is het object dat geselecteerd wordt met het event

function changeStatement() {

    if (statementId <= subjects.length - 1 && this.innerHTML == "Volgende") {
        statementId++;
        setStatement(subjects[statementId]);
    } else if (statementId > 0 && this.innerHTML == "Vorige") {
        statementId--;
        setStatement(subjects[statementId]);
    } else {
        title.innerHTML = "Er is een fout opgetreden!"
        descriptionField.innerHTML = "Als u dit leest is er iets fout gegaan"
    }

    if (statementId == subjects.length - 1) {
        var nextBtn = document.getElementById("nextBtn");
        nextBtn.innerHTML = "Rond test af";
        nextBtn.onclick = function () {
            console.log("fin");
        }
    } else if (statementId != subjects.length) {
        var nextBtn = document.getElementById("nextBtn");
        nextBtn.innerHTML = "Volgende";
        nextBtn.onclick = changeStatement;
    }
}

function setStatement(subject) {
    title.innerHTML = subject.title;
    descriptionField.innerHTML = subject.statement
}

//TODO:
// Wanneer de gebruiker op de volgende knop drukt dan detecteert het
// systeem welke radio input is geselecteerd en slaat dit op als antwoord

// vorig antwoord selecteren wanneer de gebruiker terug gaat