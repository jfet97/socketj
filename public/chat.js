// Make connection
   const socket = io.connect('https://git.heroku.com/socketj.git:5000');


// Query DOM
const 
    message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', () => {
    // message name, message data
    if((!message.value)||(!handle.value)) return;
    socket.emit('chat', {
        "message": message.value,
        "handle": handle.value
    });


});


/*
message.addEventListener('keypress', () => {
    // message name, message data
    if(!handle.value) return;
    socket.emit('typing', {
        nickname: handle.value,
        emptyMessage: message.value ? false : true // emptyMessage is true if the message is empty
    });
});*/

message.addEventListener('input', () => {
    // message name, message data
    if(!handle.value) return;
    socket.emit('typing', {
        nickname: handle.value,
        emptyMessage: message.value ? false : true // emptyMessage is true if the message is empty
    });
});



// Listen for events

socket.on('chat-response', (data) => {

    // remove always the typing messages because now a valid message is arrived
    console.log(feedback);
    console.log(feedback.firstChild);
    while (feedback.firstChild) {
        feedback.removeChild(feedback.firstChild);
    }

    // console.log(data);
    let p = document.createElement("p");
    let strong = document.createElement("strong");
    let nickname = document.createTextNode(data.handle + ": ");
    let message = document.createTextNode(data.message);

    strong.appendChild(nickname);
    p.appendChild(strong);
    p.appendChild(message);

    output.appendChild(p);
});


socket.on('typing-broadcast', (data) => {

    let feedbackBabies = feedback.children;
    console.log("Questi sono i bimbi di feedback: ", feedbackBabies);
    for(let i = 0; i < feedbackBabies.length; i++) {
         let typedMessage = feedbackBabies[i].firstChild.innerText;
        // console.log(typedMessage);
        let writer = typedMessage.substring(0, typedMessage.indexOf(" "));
        if(writer === data.nickname) feedbackBabies[i].remove();
         

    }
    
    
    // if data.message is null I'm not going to display anything
    if(data.emptyMessage) return;

    let p = document.createElement("p");
    let em = document.createElement("em");
    let text = document.createTextNode(data.nickname + " is typing a message...");

    
    em.appendChild(text);
    p.appendChild(em);
    feedback.appendChild(p);
    // console.log("Questo è feedback: ", feedback);
   
});