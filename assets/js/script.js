
let messages = []

function refreshMessages(){

    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promisse.then(printAllMessages)
}

function printAllMessages(obj){

    document.querySelector(".messages-box").innerHTML = ""

    let data = obj.data

    for(let i=0; i<data.length; i++){
        printMessage(data[i])
    }

}

function printMessage(content){
    
    let message = document.createElement("div")
    message.classList.add("message-display", content.type)
    message.innerHTML = `<p class="time">(${content.time})</p>`
    if(content.type !== "status" ){
        message.innerHTML += `<h2 class="name">${content.from} <span>to</span> ${content.to}: </h2>`
    }
    else{
        message.innerHTML += `<h2 class="name">${content.from}</h2>`
    }
    message.innerHTML += `<p>${content.text}</p>`
    message.scrollIntoView()
    document.querySelector(".messages-box").appendChild(message)
}

setInterval(refreshMessages, 3000)