let user = ""
let intervalMessages = null
let intervalParticipant = null
let options = {
    people: "Todos",
    visibility: "Público"
}

function refreshMessages(){

    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promisse.then(printAllMessages)
    reloadParticipants()
}

function printAllMessages(obj){

    
    document.querySelector(".messages-box").innerHTML = ""
    
    let data = obj.data

    for(let i=0; i<data.length; i++){
        printMessage(data[i])
    }

}

function printMessage(content){
    
    if(!(content.type === "private_message" && content.to !== user && content.from !== user)){
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
    
}

function refreshLogIn(){
    let obj = {
        name: user
    }

    let promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", obj)

    promisse.catch((object)=>{
        window.location.reload()
    })
}

function logIn(){

    user = document.querySelector("#name").value

    let obj = {
        name: user
    }

    let promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", obj)
    promisse.then((object)=>{
        refreshMessages()
        intervalMessages = setInterval(refreshMessages, 3000)
        intervalParticipant = setInterval(refreshLogIn, 5000)
        document.querySelector(".login").classList.add("disabled")
    })
    promisse.catch((object)=>{
        window.location.reload()
    })
}

function sendMessage(){

    let message = message_area.value

    if(message === ""){
        return
    }

    let type = ""

    if(options.visibility === "Público"){
        type = "message"
    }

    else{
        type = "private_message"
    }

    let obj = {
        from: user,
        to: options.people,
        text: message,
        type: type // ou "private_message" para o bônus
    }

    let promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", obj)

    message_area.value = ""

    promisse.then(refreshMessages)
    promisse.catch((error)=>{
        window.location.reload()
    })

}

let message_area = document.querySelector("#message_area")

message_area.addEventListener("keypress", (e)=>{
    if(e.key === "Enter"){
        sendMessage()
    }
})


function toggleCheck(obj){

    if(obj.parentNode.classList.contains("people")){
        if(obj.parentNode.querySelector(".check") !== null){
            obj.parentNode.querySelector(".check").classList.remove("check")
            obj.lastElementChild.classList.add("check")
            options.people = obj.querySelector("div > p").innerText
        }
        else{
            obj.lastElementChild.classList.add("check")
            options.people = obj.querySelector("div > p").innerText
        }
    }
    else{
        if(options.visibility !== ""){
            obj.parentNode.querySelector(".check").classList.remove("check")
            obj.lastElementChild.classList.add("check")
            options.visibility = obj.querySelector("div > p").innerText
        }
        else{
            obj.lastElementChild.classList.add("check")
            options.visibility = obj.querySelector("div > p").innerText
        }
    }
}

function toggleAside(){
    reloadParticipants()
    document.querySelector("aside").classList.toggle("disabled")
}

function reloadParticipants(){

    let promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants")

    promisse.then((obj)=>{

        let participants = document.querySelector(".people")

        participants.innerHTML = `
        <div class="option" onclick="toggleCheck(this)">
            <div>
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
            </div>
            <ion-icon name="checkmark"></ion-icon>
        </div>`

        if(options.people === "Todos"){
            participants.lastElementChild.lastElementChild.classList.add("check")
        }

        data = obj.data

        for(let i=0; i<data.length; i++){

            participants.innerHTML += `
            <div class="option" onclick="toggleCheck(this)">
                <div>
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${data[i].name}</p>
                </div>
                <ion-icon name="checkmark"></ion-icon>
            </div>`

            // console.log(options.people, data[i].nome)
            if(options.people === data[i].name){
                participants.lastElementChild.lastElementChild.classList.add("check")
            }
        }
    })

}