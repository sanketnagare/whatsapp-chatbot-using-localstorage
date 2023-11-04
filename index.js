let users = [];
let user = null;

const viewUserInfo = document.getElementById("view-details");
const userDetailsModal = document.getElementById("userInfoModal");
const usernameElement = document.getElementById("username");
const botStarterMessageElement = document.getElementById("botStarterMessage");
const chatTimestampElement = document.getElementById("chat-timestamp");
const chatbox = document.getElementById("chatbox");
const textInput = document.getElementById("textInput");

renderUsers(); 

// render users to the homescreen
function renderUsers() {
    users = JSON.parse(localStorage.getItem('users'));
    
    let homescreenbody = document.getElementById("homescreenbody");
    homescreenbody.innerHTML = "";
    users.forEach((user) => {
        homescreenbody.innerHTML += `
        <div class="d-flex w-100 bg-white px-3 py-2">

                        <img class="rounded-5 me-3" 
                        src="${user.img}" 
                        id="${user.id}"
                        onclick="openDisplayModal(this)";
                        width="50" 
                        height="50" 
                        role="button"
                        data-bs-toggle="modal" 
                        data-bs-target="#userInfoModal"
                        >

                        <button id="userlistname" class="w-100 bg-white border-0 text-black" onclick="togglescreen(${user.id})"> 
                            <div class="d-flex flex-column gap-0">
                                <h5 class="m-0 text-start">${user.username}</h5>
                            </div>
                        </button>
        </div>
        `;
    });
}

// funciton to switch between screens
function togglescreen(id) {
    if(id!==undefined) {
        user = getStoredUser(id+'');
        localStorage.setItem('user',JSON.stringify(user));
        loadChatHistory();
    }
    document.getElementById("chatscreen").classList.toggle('d-none');
    document.getElementById("homescreen").classList.toggle('d-none');
}

//load user info in header
function loadUserInfo(user) {
    usernameElement.innerHTML = user.username;
    document.getElementById("userimg").innerHTML = `
        <img class="rounded-5 me-3" src="${user.img}" width="50" height="50"  alt="">
    `;
}

//call getRespose after send button clicked
function sendButton() {
    getResponse();
}

// function for user message and add to chatbox
function getResponse() {
    let userText = textInput.value;
    if(userText == "") {
        userText = "No Problem here"
    }
    const userMessage = {
        role: "user",
        text: userText,
        timestamp: new Date()
    }
    //push the message to chathistory array
    user.chathistory.push(userMessage);
    //html will be generated using createUserMessage for input text
    let userHtml = createUserMessage(userText);
    chatbox.innerHTML += userHtml;
    //update in localstorage
    updateChatHistory();
    textInput.value = "";
    scrollToBottom();
    //get chatbot response
    setTimeout(() => {
        getHardResponse(userText);
    }, 1000)
}

// adding event listener to top anchor tag to display modal
if(viewUserInfo) {
    console.log(viewUserInfo);
    viewUserInfo.addEventListener('click', function() {
        displayUserDetails(user);
    })
}

// function called by image button in homescreen
function openDisplayModal(currentElement) {
    user = getStoredUser(currentElement.id);
    displayUserDetails(user);
}

//function to display user details in modal
function displayUserDetails(user) {
    if(user) {
        if(userDetailsModal){
            const modalBody = userDetailsModal.querySelector(".modal-body");
            const userDetialsHTML =    
            `
            <p class="d-flex w-100 justify-content-center">
                <img class="rounded-5 text-center" src="${user.img}" width="80" height="80"  alt=""> 
            </p>
            <p class="d-flex w-100 justify-content-between">
                <strong class="w-50 text-end">Name: </strong> 
                <span class="text-start w-75 ms-3"> ${user.username} </span/> 
            </p>
            <p class="d-flex w-100 justify-content-between">
                <strong class="w-50 text-end">Last seen: </strong> 
                <span class="text-start w-75 ms-3"> ${user.lastseen} </span/> 
            </p>
            <p class="d-flex w-100 justify-content-between">
                <strong class="w-50 text-end">Phone: </strong> 
                <span class="text-start w-75 ms-3"> ${user.phonenumber} </span/> 
            </p>
            `;
            modalBody.innerHTML = userDetialsHTML;
        }
    }
}

// get response of bot 
function getHardResponse(userText) {
    let botResponse = getBotResponse(userText);

    const botMessage = {
        role: "bot",
        text: botResponse,
        timestamp: new Date()
    }

    // update to chathitory array
    user.chathistory.push(botMessage);

    // add that message to chatbox
    chatbox.innerHTML += createBotMessage(botResponse);

    scrollToBottom();
    updateChatHistory();
}

// get user form localstorage
function getStoredUser(id) {
    const foundUser = users.find((newuser) => newuser.id == id);
    if (foundUser) {
        return foundUser;
    }
    return null;
}

// load all the chat from localstorage and display in chatbox
function loadChatHistory() {
    document.getElementById('chatbox').innerHTML = "";
    let storedUser = localStorage.getItem('user');
    if (storedUser) {
        user = JSON.parse(storedUser);
        loadUserInfo(user);

        // show time and first message from bot
        chatbox.innerHTML = `<h5 class="fs-6 text-center mt-2" id="chat-timestamp"> ${getTime()} </h5>`;
        chatbox.innerHTML += createBotMessage("how its going");

        // Display the chat history from the user object
        user.chathistory.forEach((message) => {
            if (message.text) {
                // if user then userText element created
                if (message.role === "user") {
                    let userHtml = createUserMessage(message.text);
                    document.getElementById('chatbox').innerHTML += userHtml;
                } 
                // if bot message then botText element created
                else if (message.role === "bot") {
                    let botHtml = createBotMessage(message.text);
                    document.getElementById('chatbox').innerHTML += botHtml;
                }
            }
        });
        scrollToBottom();
    }
}

//to get the current day and time
function getTime() {
    let today = new Date();
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = daysOfWeek[today.getDay()];
    let hours = today.getHours();
    let minutes = today.getMinutes();

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    let time = day + " " + hours + ":" + minutes;
    return time;
}

// funtion to scroll down when new message comes
function scrollToBottom() {
    var chatbox = document.getElementById('chatbox');
    chatbox.scrollTop = chatbox.scrollHeight;
}

// creates user message element
function createUserMessage(message) {
    let userHtml = `<p class="userText"> <span> ${message} </span> </p>`;
    return userHtml;
}

// creates bot message element
function createBotMessage(message) {
    const botHtml = `<p class="botText"><span>${message}</span></p>`;
    return botHtml;
}

// function to update chat history
function updateChatHistory() {
    localStorage.setItem('user', JSON.stringify(user));

    users.forEach((currentuser) => {
        if(currentuser.id === user.id){
            currentuser.chathistory = user.chathistory;
        }
    })
    localStorage.setItem('users', JSON.stringify(users));
}

// function to get response from the bot
function getBotResponse(input) {
    if (input == "hello") {
       return "Hello there!";
    } 
    else if (input == "goodbye") {
       return "Talk to you later!";
    } 
    else {
       return "Try asking something else!";
    }
}

//funciton for enter to send a message
document.getElementById("textInput").addEventListener("keypress", function(e) {
    if (e.which == 13) { 
        getResponse();
    }
});





const emojiicon = document.getElementById("emoji");
const emojiselector = document.getElementById("emojiSelector");

emojiicon.addEventListener('click', () => {
    emojiselector.classList.toggle('active');
})

const emojilist= document.getElementById('emojiList');

fetch('https://emoji-api.com/emojis?access_key=ca0efd2216e714a273a6eeddc160090be166c04e')
.then(res => res.json())
.then(data => loadEmoji(data));


function loadEmoji(data) {
    data.forEach(emoji => {
        let li = document.createElement('li');
        li.setAttribute('emoji-name', emoji.slug);
        li.textContent = emoji.character;

        // Add click event listener to each emoji
        li.addEventListener('click', (event) => {
            const selectedEmoji = event.target.textContent;
            textInput.value += selectedEmoji; // Add the selected emoji to the input field
            emojiselector.classList.remove('active'); // Close the emoji selector
        });


        emojilist.appendChild(li);
    });
}

const emojisearch = document.getElementById("emojiSearch");

emojisearch.addEventListener('keyup', e => {
    let value = e.target.value;
    let emojis = document.querySelectorAll('#emojiList li');
    emojis.forEach(emoji => {
        if(emoji.getAttribute('emoji-name').toLowerCase().includes(value)){
            emoji.style.display = 'flex';
        }
        else {
            emoji.style.display = 'none';
        }
    })
})
