const clickableButtons = document.querySelectorAll(".btn");
const statementOptions = document.querySelectorAll(".form-check-input");
const statementFields = document.querySelectorAll(".form-check");
const container = document.getElementById("container");
const importantStatementField = document.getElementById("importantStatementField");
const partyFilterField = document.getElementById("partyFilterField");
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

/*
* Deze functie past de stijl aan van de knoppen aan gebaseerd
* op waar de gebruiker zich bevind in de stemwijzer
*/
function setButtonMode(mode, mainButtonTxt) {

    clickableButtons.forEach(element => {
        if (element.id == "nextBtn") {
            element.innerHTML = mainButtonTxt;

            switch (mode) {
                case "start":

                    statementFields.forEach(element => {
                        element.hidden = true;
                    });

                    element.onclick = function () {
                        startTest();
                    }
                    break;

                case "advanced":

                    statementFields.forEach(element => {
                        element.hidden = false;
                    });

                    clickableButtons.forEach(button => {
                        button.hidden = false;
                        button.onclick = changeStatement;
                        if (button.id == "nextBtn") {
                            button.disabled = true;
                            button.innerHTML = mainButtonTxt;
                        }
                    });
                    break;

                case "filter":

                    statementFields.forEach(element => {
                        element.hidden = true;
                    });

                    element.onclick = function () {
                        recordPartyFilter();
                    }
                    break;
                case "end":

                    statementFields.forEach(element => {
                        element.hidden = true;
                    });

                    element.onclick = function () {
                        compareUserAnswerToPartyAnswers();
                    }
                    break;
            }

        }
        else {
            element.hidden = true;
        }
    });

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

    var skipBtn = document.getElementById("skipBtn");
    skipBtn.hidden = false;

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
            var nextBtn = document.getElementById("nextBtn");
            nextBtn.disabled = false;
            recordStatementImportance();
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
* Deze functie genereert een lijst met knoppen die de gebruiker
* later kan gebruiken om partijen te filteren en aan te tonen
* welke stellingen belangrijk zijn
*/
function generateCheckboxList(givenArray, givenField) {

    var checkboxClass = "";
    var labelClass = "";

    if (givenArray == subjects) {
        checkboxClass = "statementCheckbox";
        labelClass = "statementLabel";
    }

    if (givenArray == parties) {
        checkboxClass = "partyCheckbox";
        labelClass = "partyLabel";
    }

    var loopCount = 0;
    givenArray.forEach(object => {
        var newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        newCheckbox.value = loopCount;
        if (givenArray == parties) {
            newCheckbox.dataset.secular = parties[loopCount].secular;
            newCheckbox.dataset.partysize = parties[loopCount].size;
        }

        newCheckbox.setAttribute("class", `mr-2 ml-1 ${checkboxClass}`);
        var newLabel = document.createElement("label");
        if (object.title != null) {
            newLabel.innerHTML = object.title;
        }
        if (object.name != null) {
            newLabel.innerHTML = object.name;
        }
        newLabel.setAttribute("class", labelClass);
        var newLine = document.createElement("br");
        givenField.append(newLabel);
        givenField.append(newCheckbox);
        givenField.append(newLine);
        newCheckbox = null;
        loopCount++;
    });

    if (givenArray == parties) {
        var btnSecular = document.createElement("button");
        var partyCheckboxes = document.querySelectorAll(".partyCheckbox");
        btnSecular.setAttribute("class", "btn btn-primary");
        btnSecular.innerHTML = "Selecteer alle seculaire partijen";
        btnSecular.onclick = function () {
            partyCheckboxes.forEach(element => {
                if (element.dataset.secular == "true") {
                    element.checked = true;
                }
            });
        }

        var btnSize = document.createElement("button");
        var partyCheckboxes = document.querySelectorAll(".partyCheckbox");
        btnSize.setAttribute("class", "btn btn-primary");
        btnSize.innerHTML = "Selecteer alle grote partijen";
        btnSize.onclick = function () {
            partyCheckboxes.forEach(element => {
                if (element.dataset.partysize != "0") {
                    element.checked = true;
                }
            });
        }

        givenField.append(btnSize);
        givenField.append(btnSecular);
    }

}

/*
* Deze functie verwijt de gebruiker naar een serie aan
* checkboxes waarmee de gebruiker kan aangeven welke
* stellingen het meest belangrijk zijn
*
* Ik ben bewust dat ik deze twee functies kan samenvoegen
* maar ik ben nogal moe en wil aan de volgende opdracht beginnen
*/
function recordStatementImportance() {
    partyFilterField.hidden = true;
    importantStatementField.hidden = false;

    generateCheckboxList(subjects, importantStatementField);
    title.innerHTML = "Welke stelling(en) zijn belangrijk?";
    descriptionField.innerHTML = "";

    setButtonMode("filter", "Volgende stap");
}

function recordPartyFilter() {
    importantStatementField.hidden = true;
    partyFilterField.hidden = false;

    generateCheckboxList(parties, partyFilterField);
    title.innerHTML = "Welke partijen wilt u NIET in uw resultaten zien?";
    descriptionField.innerHTML = "";

    setButtonMode("end", "Rond de test af");
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
            statementIsImportantArray[checkbox.value] = true;
        } else {
            statementIsImportantArray[checkbox.value] = false;
        }
    });

    var partyCheckboxes = document.querySelectorAll(".partyCheckbox");
    partyCheckboxes.forEach(checkbox => {
        checkbox.hidden = true;
        if (checkbox.checked) {
            partyOpinion.splice(checkbox.value, 1, null);
        }
    });

    for (var a = 0; a < partyOpinion.length; a++) {
        if (partyOpinion[a] != null) {
            for (var b = 0; b < userAnswers.length; b++) {
                if (userAnswers[b] == partyOpinion[a].opinionSequence[b]) {
                    partyOpinion[a].score++;
                    if (statementIsImportantArray[b]) {
                        partyOpinion[a].score++;
                    }
                }

            }
        }
    }

    partyOpinion = partyOpinion.filter(function (item) {
        return item != null;
    });

    partyOpinion.sort(function (a, b) { return b.score - a.score });

    title.innerHTML = "De partij die het best bij u past is " + partyOpinion[0].party;
    descriptionField.innerHTML = `De twee partijen hierna zijn ${partyOpinion[1].party} en ${partyOpinion[2].party}`;
    statementFields.forEach(element => {
        element.hidden = true;
    });
    clickableButtons.forEach(element => {
        element.hidden = true;
    });
    partyFilterField.hidden = true;
}
