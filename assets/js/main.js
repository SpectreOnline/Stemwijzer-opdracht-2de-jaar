const clickableButtons = document.querySelectorAll(".btn");
const statementOptions = document.querySelectorAll(".form-check-input");
const statementFields = document.querySelectorAll(".form-check");
const container = document.getElementById("container");
const title = document.getElementById("title");
const descriptionField = document.getElementById("description");
var userAnswers = [];
var statementId = 0;
var partyOpinion = [];

// Query selector gebruiken voor wanneer je meerdere elements gebruikt
// Je moet met een foreach eroverheen kunnen loopen
// Lees meer in eventhandlers en selectors
// Lees over compound statements
// Lees over docblock


startTest();

function startTest() {
    setStatement(subjects[0]);
    statementOptions.forEach(element => {
        element.onclick = changeStatement;
    });
    clickableButtons.forEach(element => {
        element.onclick = changeStatement;
    });
    for (i = 0; i < parties.length; i++) {
        partyOpinion.push({
            party: parties[i].name,
            opinionSequence: generateOpinionSequence(parties[i].name),
            score: 0
        });
    }
}


function generateOpinionSequence(party) {
    var opinionArray = [];
    subjects.forEach(subject => {

        subject.parties.forEach(partyInSubject => {
            if (partyInSubject.name == party) {
                opinionArray.push(partyInSubject.position);
            }
        });

    });
    return opinionArray
}


function changeStatement() {

    if (statementId <= subjects.length && this.name == "statementChoice") {
        statementOptions.forEach(element => {
            if (element.checked) {
                userAnswers[statementId] = element.value;
            }
        });

        if (statementId < subjects.length - 1) {
            statementId++;
            this.checked = false;
            setStatement(subjects[statementId]);
        }

    } else {
        title.innerHTML = "Er is een fout opgetreden!"
        descriptionField.innerHTML = "Als u dit leest is er iets fout gegaan"
    }

    // deze if statement detecteerd of de knop de gebruiker naar de vorige
    // stelling stuurt
    if (statementId > 0 && this.id == "prevBtn") {
        statementId--;
        setStatement(subjects[statementId]);
    }

    if (userAnswers.length == subjects.length && this.name == "statementChoice") {
        var nextBtn = document.getElementById("nextBtn");
        nextBtn.disabled = false;
        nextBtn.onclick = function () {
            compareUserAnswerToPartyAnswers();
        }
    }

}

function setStatement(subject) {
    title.innerHTML = subject.title;
    descriptionField.innerHTML = subject.statement;

    statementOptions.forEach(element => {
        if (userAnswers[statementId] == element.value) {
            element.checked = true;
        }
    });
}

// voor elke keer dat userAnswer gelijk is aan de mening van een partij 
//(partyOpinion.opinionsequence)
// voeg een punt toe voor die partij

function compareUserAnswerToPartyAnswers() {

    for (var a = 0; a < partyOpinion.length; a++) {
        for (var b = 0; b < userAnswers.length; b++) {
            if (userAnswers[b] == partyOpinion[a].opinionSequence[b]) {
                partyOpinion[a].score++;
            }
        }
    }

    partyOpinion.sort(function (a, b) { return b.score - a.score });

    title.innerHTML = "De partij die het best bij u past is " + partyOpinion[0].party;
    descriptionField.innerHTML = "";
    statementFields.forEach(element => {
        element.hidden = true;
    });
    clickableButtons.forEach(element => {
        element.hidden = true;
    });
}

//TODO:

// Een startknop met startpagina aanmaken voor de stemwijzer
// een knop aanmaken waarmee de gebruiker een stelling kan overslaan
// In het startmenu kan de gebruiker kiezen welke stelling belangrijk is
// Gekozen belangrijke stellingen moeten meer score geven in berekening.