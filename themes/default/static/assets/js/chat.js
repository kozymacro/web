window.onload = function () {
    $('.chat-toast').toast('show');

    var app = new Vue({
        el: '#chat-app',
        delimiters: ['${', '}'],
        data: {
            activated: false,
            language: 'en',
            input: '',
            messages: [],
            chatData: '',
            messageNotFoundCounter: 0
        },
        methods: {
            toggle: async function () {
                this.activated = !this.activated;

                if (this.activated) this.$nextTick(() => this.$refs.inputbox.focus());

                if (this.chatData === '') {
                    let language = this.$refs.wrapper.getAttribute('data-lang');
                    let response = await fetch("/docs/chat_" + language + ".json");
                    this.chatData = await response.json();
                }
            },
            submit: function () {
                if (this.input === '') return;

                let input = this.input;
                this.messages.push({message: this.input});
                this.input = '';

                let message = '';

                let maxFoundCount = 1;
                for (i in this.chatData.messages) {
                    let item = this.chatData.messages[i];

                    let foundCount = 0;
                    let words = input.split(' ');
                    
                    for (j in words) {
                        let word = words[j].toLowerCase();
                        if (item.inputs.some(w => w !== '' && word.includes(w))) foundCount++;
                    }

                    if (foundCount >= maxFoundCount) {
                        message = item.message;
                        maxFoundCount = foundCount;
                    }
                }
                
                this.sendMessage(message);
                this.scroolToLatestMessage();                
            },
            sendMessage: function(message) {
                if (message === '') {
                    if (this.messageNotFoundCounter > 0) {
                        this.messages.push({owner: true, message: this.formatMessage(true, this.chatData.contactUsMessage)});
                        this.messageNotFoundCounter = 0;
                    }
                    else {
                        this.messages.push({owner: true, message: this.formatMessage(true, this.chatData.defaultMessage)});
                    }
                    this.messageNotFoundCounter++;
                }
                else {
                    this.messages.push({owner: true, message: this.formatMessage(true, message)});
                    this.messageNotFoundCounter = 0;
                }
            },
            scroolToLatestMessage: function() {
                this.$nextTick(() =>  {
                    let chatWindow = document.getElementById('chat-wrapper'); 
                    chatWindow.scrollTop = chatWindow.scrollHeight;
                });
            },
            formatMessage: function (owner, message) {
                if (owner) return "<b>K:</b> " + message;
                else return message;
            }
        }
    });
}