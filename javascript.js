const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2311-FSA-ET-WEB-PT-SF/events";
const state = {
  rawPartyData: [],
  htmlPartyCards: [],
};
const partyList = document.createElement("div");
partyList.id = "PartyList";
document.body.append(partyList);

class partyForm {
  constructor() {
    const card = document.createElement("card");
    const Form = document.createElement("form");
    Form.className = "form";
    this.#initInput(Form,"New Party Form","","hidden")
    this.#initInput(Form, "What should we call this party?", "name");
    this.#initInput(Form, "Where is this party?", "location");
    this.#initTextarea(Form, "Why are we partying?", "description");
    this.#initInput(
      Form,
      "When is it?",
      "date",
      "datetime-local",
      `${new Date().toJSON().split("T")[0]}T17:00:00`
    );
    this.#initInput(Form, "", undefined, "submit", "Add this party");
    Form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      addParty(evt.target);
    });

    card.append(Form);
    return card;
  }

  #initInput(
    form,
    labelText,
    variableName,
    inputType = "text",
    defaultValue = ""
  ) {
    let label = document.createElement("label");
    label.innerText = labelText;
    let field = document.createElement("input");
    field.name = variableName;
    label.append(field);
    field.setAttribute("type", inputType);
    field.defaultValue = defaultValue;
    field.setAttribute("required", true);
    form.append(label);
  }

  #initTextarea(form, labelText, variableName) {
    let label = document.createElement("label");
    label.innerText = labelText;
    let field = document.createElement("textarea");
    field.style.resize = "none";
    field.name = variableName;
    label.append(field);
    field.setAttribute("required", true);
    form.append(label);
  }
}

const addPartyForm = new partyForm();

getParties();

async function getParties() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const data = await response.json();
      state.rawPartyData = data.data.sort((a, b) => (a.date < b.date ? -1 : 1));
    }
    buildPartyCards(state);
  } catch (error) {
    console.log(error);
  }
}

function buildPartyCards({ rawPartyData }) {
  state.htmlPartyCards = rawPartyData.map(
    ({ id, name, description, location, date }) => {
      let card = document.createElement("card");

      card.setAttribute("partyID", id);
      card.innerHTML = `
      <partyTitle>${name}</partyTitle>
      <partyLocation>${location}</partyLocation>
      <partyDesc>${description}</partyDesc>
      <partyDate>${new Date(date).toLocaleString().replace(","," @")}</partyDate>
      `;

      let deletePartyButton = document.createElement("deleteParty");
      deletePartyButton.innerText = "X";
      card.append(deletePartyButton);
      deletePartyButton.addEventListener("click", () => {
        removeParty(id);
      });
      return card;
    }
  );
  render(state);
}

function render({ htmlPartyCards }) {
  partyList.replaceChildren(...htmlPartyCards, addPartyForm);
}

async function addParty({ name, location, date, description }) {
  try {
    let formData = {
      name: name.value,
      description: description.value,
      date: new Date(date.value),
      location: location.value,
    };
    if (confirm("Are you sure you want to add this party?")) {
      const response = await fetch(API_URL, {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        let data = await response.json();
        name.form.reset();
        getParties();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function removeParty(id) {
  try {
    if (confirm("Are you sure you want to remove this party?")) {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok && response.status == 204) {
        getParties();
      }
    }
  } catch (error) {
    console.log(error);
  }
}
