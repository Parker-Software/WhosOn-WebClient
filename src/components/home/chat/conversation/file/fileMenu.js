
(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var state = services.Store.state;
    var connection = services.WhosOnConn;

    Vue.component('fileMenu', {
        data: () => {
            return {
                file: null,
                data: null,
                showLoader: false,
                error: false,
                showSendModal: false,
                showAlreadyUploadedModal: false,
            };
        },
        template: `
            <div class="fileMenu">
                <div style="position:relative; height: 100%; width: 100%;">
                    <div style="height: 40px;">
                        <form autocomplete="off" class="is-pulled-left" onsubmit="event.preventDefault();" style="width: calc(100% - 35px);">
                            <div class="field">
                                <p class="control has-icons-right">
                                    <input id="fileSearchTxtBox" type="text" class="input searchBox" placeholder="Search" v-on:keyup.enter="Search">
                                    <span class="icon is-small is-right" style="height: 2em;">
                                        <i class="fas fa-search"></i>
                                    </span>
                                </p>
                            </div>
                        </form>
                        <button class="roundedBtn is-pulled-left" v-on:click="UploadClicked" style="margin-top: 2px; margin-left: 10px;"><i class="fas fa-upload"></i> </button>
                    </div>
                    <section>   
                        <table class="table" style="width:100%">
                            <fileItem v-for="item in validFiles"
                                :hashedFileName="item.HashedFileName"
                                :name="item.FileName"
                                :date="item.Dated"
                                :size="item.Size"
                                :who="item.CreatedByUser"
                                :isPinned="item.Pinned"
                                @Clicked="ItemClicked">
                            </fileItem>
                        </table>
                    </section>
                    <div v-bind:class="{'is-hidden': showLoader == false}" style="width:100%; height:100%; background-color: rgba(255,255,255, 0.5); position:absolute; left: 0; top: 0;">
                        <loader id="fileLoader" text="Uploading..."></loader>
                    </div>
                </div>
                
                <input id="fileUploaderControl" @change="ReadFile" class="is-hidden" type="file">
                <dialogue 
                    v-if="this.file != null"
                    title="Send File"
                    :content="sendFileContent"
                    :show="showSendModal"
                    :yesCallback="Send"
                    :noCallback="HideSendModal"
                ></dialogue>

                <dialogue 
                    title="Send File"
                    :content="sendFileAlreadyUploadedContent"
                    :show="showAlreadyUploadedModal" 
                    :yesCallback="UploadFile"
                    :noCallback="HideAlreadyUploadedModal"
                ></dialogue>
            </div>
            `,
        beforeCreate() {
            hooks.Register(events.FileUploader.Successful, (e) => {
                this.showLoader = false;
                this.error = false;
                connection.GetFiles();
                this.AddFileToChat(e.name, e.url);
            });

            hooks.Register(events.FileUploader.Failed, (e) => {       
                this.showLoader = false;
                this.error = true;
            });
        },
        computed: {
            validFiles() {
                return state.uploadedFilesSearchResult.filter(item => item.VisitorUploaded == false);
            },
            sendFileContent() {
                return '<span class="fa-stack fa-lg">' +
                    '<i class="fas fa-circle fa-stack-2x"></i>' +
                    '<i class="fas fa-question fa-stack-1x" style="color:white"></i>' +
                '</span>' +
                '<span>' +
                    `Do you want to send the file <span v-if="file != null">${this.file.FileName}</span>?` +
                    '<br />' +
                    'The visitor will be able to download the file via their chat window.' +
                '</span>'
            },
            sendFileAlreadyUploadedContent() {
                return '<span>File already uploaded. Do you want to upload another copy?<span>'
            }
        },
        methods: {
            SearchTextBoxElem() {
                return document.getElementById("fileSearchTxtBox");
            },
            UploadFileInputElem() {
                return document.getElementById("fileUploaderControl");
            },
            AddFileToChat(name, url) {
                connection.SendFile(state.currentChat.Number,
                    name,
                    url
                );

                var msg = {code:1, msg:`<link><name>${name}</name><url>${url}</url></link>`, date: getDate(new Date()), isLink: true};

                if(state.chatMessages[state.currentChat.ChatUID] == null) state.chatMessages[state.currentChat.ChatUID] = [];
                state.chatMessages[state.currentChat.ChatUID].push(msg);
                state.currentChatMessages.push(msg);
                hooks.Call(events.Chat.ScrollChat);
            },
            Search() {
                var txt = this.SearchTextBoxElem().value;
                if(txt.length > 0) {
                    var actualText = txt.toLowerCase();
                    state.uploadedFilesSearchResult =
                        Copy(state.uploadedFiles.filter(x => x.FileName.toLowerCase().includes(actualText)));
                } else {
                    state.uploadedFilesSearchResult = state.uploadedFiles;
                }
            },
            ItemClicked(fileName) {
                this.file = state.uploadedFilesSearchResult.find(x => x.HashedFileName == fileName);
                this.ShowSendModal();
            },
            ShowSendModal() {
                this.showSendModal = true;
            },
            HideSendModal() {
                this.showSendModal = false;
            },
            ShowAlreadyUploadedModal() {
                this.showAlreadyUploadedModal = true;
            },
            HideAlreadyUploadedModal() {
                this.showAlreadyUploadedModal = false
            },
            Send() {
                hooks.Call(events.FileUploader.Yes);
                this.HideSendModal();
                this.SearchTextBoxElem().value = "";
                state.uploadedFilesSearchResult = state.uploadedFiles;
                this.AddFileToChat(this.file.FileName, this.file.URL);
            },
            UploadClicked() {
                this.UploadFileInputElem().click();
            },
            UploadFile() {
                this.HideAlreadyUploadedModal();
                var self = this;
                self.showLoader = true;
                var dataString = this.data.target.result;
                var base64 = dataString.split("base64,")[1].trim();

                var soapContent = `<?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                  <soap:Body>
                    <DocumentWrite xmlns="http://www.whoson.com/webservices/kb/">
                      <Contents>${base64}</Contents>
                      <FileName>${self.file.name}</FileName>
                      <UserName>${state.userName}</UserName>
                      <Password>${state.password}</Password>
                      <Domain>${state.currentChat.Domain}</Domain>
                    </DocumentWrite>
                  </soap:Body>
                </soap:Envelope>`;

                var documentWriteReq = new XMLHttpRequest();
                documentWriteReq.onreadystatechange = function() { 
                    if (this.readyState === XMLHttpRequest.DONE) {
                        if(this.status === 200) {
                            var docResult = new DOMParser().parseFromString(documentWriteReq.responseText, "text/xml");
                            var result = docResult.getElementsByTagName("DocumentWriteResult")[0].innerHTML;
                            if(result.indexOf("Error") != -1) {
                                hooks.Call(events.FileUploader.Failed, result);
                            } else {
                                hooks.Call(events.FileUploader.Successful, {"name":self.file.name, "url":result});
                                self.UploadFileInputElem().value = "";
                            }
                        } else {
                            hooks.Call(events.FileUploader.Failed, documentWriteReq.responseText);
                        }
                    }
                }
                documentWriteReq.open("POST", `${state.webChartsURL}cannedresponseservice.asmx?AspxAutoDetectCookieSupport=1`);
                documentWriteReq.setRequestHeader("Content-Type", "text/xml");
                documentWriteReq.send(soapContent);
            },
            ReadFile(elem) {
                var self = this;
                var uploader = elem.target;
                var files = uploader.files;

                if(files.length <= 0) return;

                this.file = files[0];
                var reader = new FileReader(); 
                reader.onload = function(evt) {
                    self.data = evt;
                    var alreadyExists = state.uploadedFiles.filter(x => x.FileName.includes(self.file.name));
                    if(alreadyExists.length > 0) {
                        self.ShowAlreadyUploadedModal();
                        return;
                    } else self.UploadFile();
                };
                reader.readAsDataURL(this.file);
            }
        }
    });
})(woServices);