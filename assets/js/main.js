const clickableButtons = document.querySelectorAll(".btn");
const statementOptions = document.querySelectorAll(".form-check-input");
const statementFields = document.querySelectorAll(".form-check");
const container = document.getElementById("container");
const afterTestField = document.getElementById("afterTestField");
const title = document.getElementById("title");
const descriptionField = document.getElementById("description");
var userAnswers = [];
var statementIsImportantArray = [];
var statementId = 0;
var partyOpinion = [];

// Query selector gebruiken voor wanneer je meerdere elements gebruikt
// Je moet met een foreach eroverheen kunnen loopen
// Lees meer in eventhandlers en selectors
// Lees over compound statements
// Lees over docblock

startWebPage();

function startWebPage() {
    title.innerHTML = "Welkom bij de stemwijzer";
    setButtonMode("start", "Start de stemwijzer");
}

function setButtonMode(mode, mainButtonTxt) {
    if (mode == "start" || mode == "end") {
        clickableButtons.forEach(element => {
            if (element.id == "nextBtn") {
                element.innerHTML = mainButtonTxt;
                if (mode == "start") {
                    element.onclick = function () {
                        startTest();
                    }
                }
                if (mode == "end") {
                    element.onclick = function () {
                        compareUserAnswerToPartyAnswers();
                    }
                }
            } else {
                element.hidden = true;
            }
        });
        statementFields.forEach(element => {
            element.hidden = true;
        });
    }
    if (mode == "advanced") {
        statementFields.forEach(element => {
            element.hidden = false;
        });
        clickableButtons.forEach(element => {
            element.hidden = false;
            element.onclick = changeStatement;
            if (element.id == "nextBtn") {
                element.disabled = true;
                element.innerHTML = mainButtonTxt;
            }
        });
    }

}

/*
* Start de stemwijzer, veranderd de functionaliteit van de knoppen
* Genereert een array waarin benodigde informatie zoals de meningen
* van de politieke partijen worden opgeslagen
*/
function startTest() {
    setStatement(subjects[0]);
    statementOptions.forEach(element => {
        element.onclick = changeStatement;
    });
    setButtonMode("advanced", "Volgende stap");
    for (i = 0; i < parties.length; i++) {
        partyOpinion.push({
            party: parties[i].name,
            opinionSequence: generateOpinionSequence(parties[i].name),
            score: 0
        });
    }
}

/*
* Genereer een array met daarin alle partijen en hun antwoorden op
* de stellingen
*/
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

/* 
* Detecteer op welke knop is gedrukt en verander de stelling
*/
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
    if (statementId > 0) {
        clickableButtons.forEach(element => {
            if (element.id == "prevBtn") {
                element.disabled = false;
            }
        });
        if (this.id == "prevBtn") {
            statementId--;
            setStatement(subjects[statementId]);
        }
    }

    /* 
    *Deze if statement detecteert of deze knop de sla over knop is
    * en slaat de stelling over
    *
    * Deze knop veranderd uiteindelijk in een rond de test af knop
    * bij de laaste stelling
    */
    if (statementId <= subjects.length && this.id == "skipBtn") {
        userAnswers[statementId] = "";
        statementOptions.forEach(element => {
            if (element.checked) {
                userAnswers[statementId] = element.value;
                element.checked = false;
            }
        });
        if (statementId < subjects.length - 1) {
            statementId++;
            setStatement(subjects[statementId]);
        } else {
            compareUserAnswerToPartyAnswers();
        }
    }

    // Deze if statement detecteerd of de gebruiker bij de laatste vraag
    // is aangekomen en wanneer dit het geval is geeft de afrond knop
    // zijn functionaliteit en zet hem aan
    if (userAnswers.length == subjects.length && this.name == "statementChoice") {

        clickableButtons.forEach(element => {
            if (element.id == "nextBtn") {
                element.disabled = false;
                element.onclick = function () {
                    recordStatementImportance();
                }
            }
        });
    }

}

/*
*  Pas de elementen aan de content van een stelling
*  Check of de gebruiker de stelling al heeft beantwoord
*  Zo ja selecteer het antwoord zodat de gebruiker het kan zien
*/
function setStatement(subject) {
    title.innerHTML = subject.title;
    descriptionField.innerHTML = subject.statement;

    statementOptions.forEach(element => {
        if (userAnswers[statementId] == element.value) {
            element.checked = true;
        }
    });
}

/*
* Deze functie verwijt de gebruiker naar een serie aan
* checkboxes waarmee de gebruiker kan aangeven welke
* stellingen het meest belangrijk zijn
*/
function recordStatementImportance() {
    afterTestField.hidden = false;
    var loopCount = 0;
    subjects.forEach(subject => {
        var newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        newCheckbox.id = loopCount;
        newCheckbox.setAttribute("class", "mr-2 ml-1 statementCheckbox");
        var newLabel = document.createElement("label");
        newLabel.innerHTML = subject.title;
        var newLine = document.createElement("br");
        afterTestField.append(newLabel);
        afterTestField.append(newCheckbox);
        afterTestField.append(newLine);
        newCheckbox = null;
        loopCount++;
    });
    setButtonMode("end", "Rond de test af");
    title.innerHTML = "Welke stelling(en) zijn belangrijk?";
    descriptionField.innerHTML = "";
}


/* voor elke keer dat userAnswer gelijk is aan de mening van een partij 
*  voeg een punt toe voor die partij
*
*  sorteer daarna de partijen op scores en laat de partij met de
*  hoogste score zien
*/

function compareUserAnswerToPartyAnswers() {
    var statementCheckboxes = document.querySelectorAll(".statementCheckbox");
    statementCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            statementIsImportantArray[checkbox.id] = true;
        } else {
            statementIsImportantArray[checkbox.id] = false;
        }
    });
    for (var a = 0; a < partyOpinion.length; a++) {
        for (var b = 0; b < userAnswers.length; b++) {
            if (userAnswers[b] == partyOpinion[a].opinionSequence[b]) {
                partyOpinion[a].score++;
                if (statementIsImportantArray[b]) {
                    partyOpinion[a].score++;
                }
            }

        }
    }

    partyOpinion.sort(function (a, b) { return b.score - a.score });

    title.innerHTML = "De partij die het best bij u past is " + partyOpinion[0].party;
    descriptionField.innerHTML = `De twee partijen hierna zijn ${partyOpinion[1].party} en ${partyOpinion[2].party}`;
    statementFields.forEach(element => {
        element.hidden = true;
    });
    clickableButtons.forEach(element => {
        element.hidden = true;
    });
}

//TODO:

// De gebruiker kan partijen filteren in de resultaten