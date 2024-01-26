const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2311-FSA-ET-WEB-PT-SF/events"
const state = {
  rawPartyData: [],
  htmlPartyCards: []
};

getParties();

async function getParties() {
  let response = await fetch(API_URL);
  let data = await response.json();
  state.rawPartyData = data.data;
  buildPartyCards(state)
}

function buildPartyCards({rawPartyData}){
    state.htmlPartyCards = rawPartyData.map(({id,name,description,location})=>{
        let card = document.createElement("card");
        card.innerHTML = `<p>${id} ${name} ${description} ${location}</p>`
        return card;
    })
    render(state);
}

function render({htmlPartyCards}){
    htmlPartyCards.forEach(element=>{
        document.body.append(element);
    })
}
