(function (services) {

    var connection = services.WhosOnConn;

    Vue.component("missed-view-chat", {
        props: [
            "site",
            "chat",
            "detail",
        ],

        data: () => {
            return {
                selectedTab: "convo",
                text: [],
                responding: false
            }
        },

        template: `
            <div>
                <div class="info-header">
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> Site: </div>
                        <div class="is-pulled-right"> <b>{{Site}}</b> </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> Visitor Name: </div>
                        <div class="is-pulled-right"> <b>{{chat.VisitorName}}</b> </div>
                    </div>
                    <div v-if="chat.Location" class="info-item">
                        <div class="is-pulled-left info-item-label"> Email: </div>
                        <div class="is-pulled-right"> <b>{{chat.Email}}</b> </div>
                    </div>
                    <div v-if="chat.Location" class="info-item">
                        <div class="is-pulled-left info-item-label"> Location: </div>
                        <div class="is-pulled-right"> <b>{{Location}}</b> </div>
                    </div>
                    <div  v-if="chat.Location" class="info-item">
                        <div class="is-pulled-left info-item-label"> Organization: </div>
                        <div class="is-pulled-right"> <b>{{Org}}</b> </div>
                    </div>
                    <div class="info-item">
                        <div class="is-pulled-left info-item-label"> On: </div>
                        <div class="is-pulled-right"> <b>{{FormattedDate(chat.Started)}}</b></div>
                    </div>
                    <div v-if="detail.PreChatSurvey != null && detail.PreChatSurvey.length > 0" class="PreChatSurveys">
                        <div v-for="field in detail.PreChatSurvey" class="info-item info-survey">
                            <div class="is-pulled-left info-item-label"> {{field.FieldName}}: </div>
                            <div class="is-pulled-right"> 
                                <b>{{field.FieldValue}}</b>
                            </div>
                        </div>
                    </div>
                    <div v-if="detail.PostChatSurvey != null && detail.PostChatSurvey.length > 1" class="PostChatSurveys">
                        <div v-for="field in detail.PostChatSurvey" v-if="field.FieldName != 'RatingField'" class="info-item info-survey">
                            <div class="is-pulled-left info-item-label"> {{field.FieldName}}: </div>
                            <div class="is-pulled-right"> 
                                <b>{{field.FieldValue}}</b>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="convo-tabs">
                    <ul>
                        <li class="is-active tab convo" v-on:click="TabClicked('convo')"><b>Conversation</b></li>
                        <li v-if="detail.VisitDetail != null" class="tab visitor" v-on:click="TabClicked('visitor')"><b>Visitor</b></li>
                    </ul>
                </div>
                <div class="content" style="margin-bottom: 0;">
                    <div v-if="selectedTab == 'convo'" class="conversation">
                        <div v-for="(v,k) in GroupedMessages" class="messages">
                            <chatConversationVisitor v-if="v.type === 0" :groupedMessage="v" preview="true"></chatConversationVisitor>
                            <chatConversationOperator v-if="v.type > 0" :groupedMessage="v" preview="true"></chatConversationOperator>
                        </div>
                    </div>
                    <div v-if="selectedTab == 'visitor' && detail.VisitDetail != null" class="visitorInfo">
                        <div class="info">
                            <div class="info-item">
                                <div class="is-pulled-left info-item-label"> IP address: </div>
                                <div class="is-pulled-right"> <b>{{detail.VisitDetail.IP}}</b> </div>
                            </div>
                            <div class="info-item">
                                <div class="is-pulled-left info-item-label"> Started: </div>
                                <div class="is-pulled-right"> <b>{{FormattedDate(detail.VisitDetail.SessionStarted)}}</b> </div>
                            </div>
                            <div class="info-item">
                                <div class="is-pulled-left info-item-label"> Session Id: </div>
                                <div class="is-pulled-right"> <b>{{detail.VisitDetail.SessionID}}</b> </div>
                            </div>
                            <div class="info-item">
                                <div class="is-pulled-left info-item-label"> Country: </div>
                                <div class="is-pulled-right"> <b>{{detail.VisitDetail.GeoIP.CountryName}}</b> </div>
                            </div>
                            <div class="info-item">
                                <div class="is-pulled-left info-item-label"> Location: </div>
                                <div class="is-pulled-right"> <b>{{chat.VisitorName}}</b> </div>
                            </div>
                            <div class="info-item">
                                <div class="is-pulled-left info-item-label"> Visit number: </div>
                                <div class="is-pulled-right"> <b>{{detail.VisitDetail.VisitNumber}} Of {{detail.VisitDetail.TotalVisits}}</b> </div>
                            </div>
                            <div class="info-item">
                                <div class="is-pulled-left info-item-label"> Operating system: </div>
                                <div class="is-pulled-right"> <b>{{detail.VisitDetail.OS}}</b> </div>
                            </div>
                            <div class="info-item">
                                <div class="is-pulled-left info-item-label"> Browser: </div>
                                <div class="is-pulled-right"> <b>{{detail.VisitDetail.Browser}}</b> </div>
                            </div>
                        </div>
                        <div class="info-pages-viewed">
                            <small><b>Pages Viewed</b></small>
                            <table>
                                <tr>
                                    <th>
                                        No.
                                    </th>
                                    <th>
                                        Time
                                    </th>
                                    <th>
                                        Name
                                    </th>
                                </tr>
                                <tr v-for="page, key in detail.VisitDetail.Pages" class="page" v-on:click="PageClicked(page)">
                                    <td>
                                        {{key + 1}}
                                    </td> 
                                    <td>
                                        {{TimeOnly(page.Dated)}}
                                    </td>
                                    <td>
                                        {{page.Name}}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="response">
                    <div class="textarea" contenteditable="true" placeholder="Enter your reply"
                        style="resize: none;" v-on:keydown="OnKeyDown" >
                    </div>
                </div>
                <div class="actions chat-header-icons">
                    <button v-on:click="Close" class="tooltip" data-tooltip="Close Chat">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="fas fa-times fa-stack-1x fa-inverse white"></i>
                        </span>
                    </button>
                    <button v-on:click="Send" class="tooltip" data-tooltip="Close and Mark As Responded">
                        <span class="fa-stack fa-2x">
                            <i class="fas fa-circle fa-stack-2x"></i>
                            <i class="far fa-check fa-stack-1x fa-inverse white"></i>
                        </span>
                    </button>
                </div>
            </div>
        `,

        
        mounted() {
            window.addEventListener("resize", this.Resize);
            this.$nextTick(function() {    
                this.Resize()
            })
        },

        updated() {
            if(this.detail.VisitDetail == null && this.selectedTab == "visitor") {
                this.TabClicked("convo");
            }

            this.Resize();
        },

        computed: {
            Site() {
                return this.$store.state.sites[this.site].Name;
            },

            Location() {
                return this.chat.Location.split("-")[0];
            },

            Org() {
                return this.chat.Location.split("-")[1];
            },

            GroupedMessages() {
                var grouped = [];
                if(this.detail.Lines == undefined || this.detail.Lines == null) {return grouped;}
                for(var i = 0; i < this.detail.Lines.length; i++) {
                    var message = this.detail.Lines[i];
                    var time =  new Date(message.Dated);
                    var groupedMessage = {
                        type: message.OperatorIndex,
                        messages: [
                            { 
                                msg: message.Message
                            }
                        ],
                        time: `${this.AddZero(time.getHours())}:${this.AddZero(time.getMinutes())}`,
                        isLink: message.isLink || false,
                        isWhisper: message.isWhisper || false,
                        Name: ""
                    };
                    if (message.OperatorIndex == 0) {groupedMessage.Name = this.detail.VisitorName;}
                    else if(message.OperatorIndex == 99) {groupedMessage.Name = "Server";}
                    else {groupedMessage.Name = this.detail.TakenByUser;}

                    var currentTime = this.MessageDateToDate(message.Dated);

                    if(message.isLink == undefined || message.isLink == false) { 
                        for(var k = i + 1; k < this.detail.Lines.length; k++) {
                            var messageTime = this.MessageDateToDate(this.detail.Lines[k].Dated);
                            var diff = (messageTime - currentTime) / 1000;

                            if(this.detail.Lines[k].isWhisper == undefined) {this.detail.Lines[k].isWhisper = false;}
                            if(this.detail.Lines[k].isLink == undefined) {this.detail.Lines[k].isLink = false;}
                            if(
                                this.detail.Lines[k].OperatorIndex == message.OperatorIndex &&
                                diff <= 10 &&
                                this.detail.Lines[k].isLink == groupedMessage.isLink &&
                                this.detail.Lines[k].isWhisper == groupedMessage.isWhisper) {

                                var newMessage = this.detail.Lines[k];
                                newMessage.msg = newMessage.Message;
                                groupedMessage.messages.push(newMessage);
                                var lineTime = new Date(this.detail.Lines[k].Dated);
                                groupedMessage.time = `${this.AddZero(lineTime.getHours())}:${this.AddZero(lineTime.getMinutes())}`;
                            } else {
                                break;
                            }
                        } 
                    }
                    grouped.push(groupedMessage);
                    i += groupedMessage.messages.length - 1;
                }
                return grouped;
            }
        },
        methods: {
            Elem() {
                return document.querySelector(".view-missed-chats");
            },

            ContentElem() {
                return document.querySelector(".view-missed-chats .content");
            },

            ResponseElem() {
                return document.querySelector(".view-missed-chats .response");
            },

            ActionsElem() {
                return document.querySelector(".view-missed-chats .actions");
            },

            InputArea() {
                return document.querySelector(".view-missed-chats .textarea");
            },

            ElemSize() {
                return this.Elem().offsetHeight;
            },

            HeaderSize() {
                var info = document.querySelector(".view-missed-chats .info-header");
                var tabs = document.querySelector(".view-missed-chats .convo-tabs");
                return info.offsetHeight + tabs.offsetHeight;
            },

            ResponseSize() {
                return this.ResponseElem().offsetHeight;
            },

            ActionsSize() {
                return this.ActionsElem().offsetHeight;
            },
            

            UnSelectAllTabs() {
                var tabs = document.querySelectorAll(".view-missed-chats .tab");
                for(var i =0; i < tabs.length; i++) {
                    tabs[i].classList.remove("is-active");
                }
            },

            FormattedDate(datestring) {
                var date = new Date(datestring);
                var day = this.AddZero(date.getDate());
                var month = this.AddZero(date.getMonth() + 1);
                var hour = this.AddZero(date.getHours());
                var mins = this.AddZero(date.getMinutes());
                var seconds = this.AddZero(date.getSeconds());

                return `${day}/${month}/${date.getFullYear()} ${hour}:${mins}:${seconds}`
            },

            TimeOnly(datestring) {
                var date = new Date(datestring);
                var hour = this.AddZero(date.getHours());
                var mins = this.AddZero(date.getMinutes());
                var seconds = this.AddZero(date.getSeconds());
                return `${hour}:${mins}:${seconds}`;
            },

            AddZero(string) {
                if(Number(string) < 10) {string = String("0"+string);}
                return string;
            },

            MessageDateToDate(date) {
                var timeSplit = date.split("T")[1].split(":");
                var currentDate = new Date();
                currentDate.setHours(timeSplit[0]);
                currentDate.setMinutes(timeSplit[1]);
                currentDate.setSeconds(timeSplit[2]);
                return currentDate;
            },

            Close() {
                this.text = [];
                connection.CancelResponseToMissedChat(this.chat.ChatUID);
                this.responding = false;
                this.$emit("CloseClicked");
            },

            Send() {
                var text = this.text.join('\n');
                connection.RespondToMissedChat(this.chat.ChatUID, text);

                this.text = [];
                this.responding = false;
                this.$emit("CloseClicked");
            },

            Resize() {
                if(this.Elem() == null) return;
                var contentSize = (this.ElemSize() - this.HeaderSize() - this.ResponseSize() - this.ActionsSize()) - 5;
                this.ContentElem().style.height = `${contentSize}px`;
            },

            TabClicked(val) {
                this.UnSelectAllTabs();
                this.selectedTab = val;

                switch(val) {
                    case "convo":
                        document.querySelector(".view-missed-chats .convo").classList.add("is-active");
                        break;
                    case "visitor":
                        document.querySelector(".view-missed-chats .visitor").classList.add("is-active");
                        break;
                }
            },

            PageClicked(page) {
                var site = this.$store.state.sites[this.site];
                window.open(`https://${site.Domain}`);
            },

            OnKeyDown(event) {
                //var content = this.InputArea().innerHTML.trim();
                var text = this.InputArea().innerText.trim();

                if(this.responding == false) {
                    connection.RespondingToMissedChat(this.chat.ChatUID);
                    this.responding = true;
                }

                if (event.shiftKey == false &&
                    event.keyCode == 13 &&
                    text.length > 0)
                {
                    this.text.push(text);

                    this.detail.Lines.push({ 
                            Message: text,
                            OperatorIndex: 1,
                            Dated: new Date().toString()
                        }
                    );
                    
                    event.preventDefault();
                    this.InputArea().innerText = "";
                }
            }
        }
    });
})(woServices);