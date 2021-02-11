const clickableButtons = document.querySelectorAll(".btn");
const container = document.getElementById("container");
const title = document.getElementById("title");
const descriptionField = document.getElementById("description");


//query selector gebruiken voor wanneer je meerdere elements gebruikt
// je moet met een foreach eroverheen kunnen loopen
//Lees meer in eventhandlers en selectors

console.log(clickableButtons);

clickableButtons.forEach(element => {
    element.onclick = changeStatement;
});

//this is het object dat geselecteerd wordt met het event

function changeStatement() {
    var nr = 0;
    container.innerHTML = subjects[nr].title;
}

function myAlert() {
    alert(this.innerHTML);
}

//TODO:
// Next button die de volgende stelling weergeeft
// Previous button die de volgende stelling weergeeft
