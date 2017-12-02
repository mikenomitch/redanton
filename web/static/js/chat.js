import {Socket} from "phoenix"
import moment from 'moment'

// let date = new Date()
// let offset = date.getTimezoneOffset()

// FOR KNOWING IF PAGE IS CHAT PAGE
let chatInput = document.querySelector('#chat-input')


// INSERT PROPER CHAT TIMES

function formatTime(element) {
  // hard coding chicago which is wrong
  let time = moment(element.dataset.time).utcOffset(720).format('llll')
  element.append(time)
}

function formatTimes() {
  let chatTimes = document.getElementsByClassName('message-time')
  for (var i = 0; i < chatTimes.length; i++) {
    formatTime(chatTimes[i])
  }
}

// SET UP CHAT

function newMessageInnerHTML(payload) {
  return `
  <div class="message-user">
  ${payload.user_name}
  </div>
  <div class="message-body">
  ${payload.body}
  </div>
  `
}

function newMessageClassList(payload, currentUserId) {
  return parseInt(currentUserId) === parseInt(payload.user_id) ? 'message message-current-user' : 'message message-other-user'
}

function setUpChat() {

  formatTimes()

  let socket = new Socket("/socket", {params: {token: window.userToken}})
  socket.connect()

  let channel           = socket.channel('room:' + chatInput.dataset.roomid, {})
  let messagesContainer = document.querySelector('#messages')
  messagesContainer.scrollTop = messagesContainer.scrollHeight

  chatInput.addEventListener('keypress', event => {
    if(event.keyCode === 13){

      channel.push('new_msg', {
        body: chatInput.value,
        post_id: chatInput.dataset.postid,
        user_id: parseInt(chatInput.dataset.currentuserid)
      })

      chatInput.value = ''
    }
  })

  channel.on('new_msg', payload => {
    let chatPrompt = document.querySelector('#chat-prompt')
    if (chatPrompt) { chatPrompt.remove() }

    let messageItem = document.createElement('div')
    messageItem.classList = newMessageClassList(payload, chatInput.dataset.currentuserid)
    messageItem.innerHTML = newMessageInnerHTML(payload)


    messagesContainer.appendChild(messageItem)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  })

  channel.join()
    .receive('ok', resp => { console.log('Joined successfully', resp) })
    .receive('error', resp => { console.log('Unable to join', resp) })
}

// SET UP CHAT IF NEEDED
if (chatInput) {
  setUpChat()
}

