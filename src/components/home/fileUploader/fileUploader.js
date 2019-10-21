(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connection = services.WhosOnConn;

    Vue.component('fileUploader', {
        data: function() {
            return {
                error: false,
                statusMessage: "",
            }
        },
        template: `
        <div id="fileUploaderModal" class="modal">
            <div class="modal-background" v-on:click="No"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Pick A File</p>
                    <button class="delete" aria-label="close" v-on:click="No"></button>
                </header>
                <div class="field" style="padding-right:20px; padding-left: 20px;">
                    <p class="control has-icons-left">
                        <input id="fileSearchTxtBox" class="input" placeholder="Search" v-on:keyup.enter="Search">
                        <span class="icon is-small is-left">
                            <i class="fas fa-search"></i>
                        </span>
                    </p>
                </div>  
              
                <section class="modal-card-body">   
                    <div id="fileItems" class="list is-hoverable">
                        <uploadedFileItem v-for="item in validFiles"
                        :hashedName="item.HashedFileName"
                        :name="item.FileName"
                        :date="item.Dated"
                        :size="item.Size"
                        :byWho="item.CreatedByUser">
                        </uploadedFileItem>
                    </div>
                </section>
                <br />
                <div class="fileUploadSection"  style="margin-right:20px; margin-left: 20px;">
                    <div class="file">
                        <label class="file-label">
                            <input id="fileUploaderControl" @change="UploadFile" class="file-input" type="file" name="resume">
                            <span id="fileUploaderBtn" class="file-cta button is-small is-link">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label">
                                    Upload File
                                </span>
                            </span>
                        </label>
                        <div class="fileUploadStatusTxt" style="padding:5px">    
                            <label class="help" v-bind:class="{'is-danger':error, 'is-success':error==false}">
                                {{statusMessage}}
                            </label>
                        </div>
                    </div>
                </div>
                <br />
                <div class="status-options" style="padding-right:20px; padding-left: 20px;">
                    <a id="fileUploaderSendBtn" class="button is-success is-small is-pulled-right" v-on:click="Send" disabled>Send File</a>
                </div>
                <footer class="modal-card-foot">
                </footer>
            </div>
        </div>
        `,
        beforeCreate() {
            hooks.Register(events.FileUploader.FileItemClicked, (e) => {
                this.SendElem().removeAttribute("disabled");
            });
            hooks.Register(events.Chat.SendFileClicked, (e) => {
                this.ModalElem().classList.add("is-active");
            });

            hooks.Register(events.Connection.CurrentChatClosed, (e) => {
                this.ModalElem().classList.remove("is-active");
                this.statusMessage = "";
            });

            hooks.Register(events.FileUploader.Successful, (e) => {
                this.error = false;
                this.statusMessage = "File Uploaded";
                connection.GetFiles();
            });

            hooks.Register(events.FileUploader.Failed, (e) => {
                this.error = true;
                this.statusMessage = e;
            });

            
        },
        computed: {
            validFiles() {
                return this.$store.state.uploadedFilesSearchResult.filter(item => item.VisitorUploaded == false);
            }
        },
        methods: {
            ModalElem() {
                return document.getElementById("fileUploaderModal");
            },
            SendElem() {
                return document.getElementById("fileUploaderSendBtn");
            },
            SearchTextBoxElem() {
                return document.getElementById("fileSearchTxtBox");
            },
            UploadFileButtonElem() {
                return document.getElementById("fileUploaderBtn");
            },
            UploadFileInputElem() {
                return document.getElementById("fileUploaderControl");
            },
            SelectedFile() {
                return document.querySelector("#fileItems .is-active");
            },
            UnSelectAllFiles() {
                var fileItems = document.getElementsByClassName("fileItem");

                for(var i = 0; i < fileItems.length; i++) {
                    fileItems[i].classList.remove("is-active");
                }
            },
            No() {
                this.ModalElem().classList.remove("is-active");
                this.SendElem().setAttribute("disabled", true);
                
                this.UnSelectAllFiles();
                this.SearchTextBoxElem().value = "";
                this.statusMessage = "";
            },
            Send() {
                this.statusMessage = "";

                var fileToSend = this.SelectedFile();
                var hash = fileToSend.id;

                var file = this.$store.state.uploadedFilesSearchResult.find(x => x.HashedFileName == hash);
                var url =  `${this.$store.state.webChartsURL}document.aspx?f=${file.HashedFileName}`;
                connection.SendFile(this.$store.state.currentChat.Number,
                    file.FileName,
                    url
                );

                this.SendElem().setAttribute("disabled", true);
                this.ModalElem().classList.remove("is-active");

                this.UnSelectAllFiles();

                this.SearchTextBoxElem().value = "";
                this.$store.state.uploadedFilesSearchResult = this.$store.state.uploadedFiles;

                var msg = {code:1, msg:`<link><name>${file.FileName}</name><url>${url}</url></link>`, date: getDate(new Date()), isLink: true};

                if(this.$store.state.chatMessages[this.$store.state.currentChat.ChatUID] == null) this.$store.state.chatMessages[this.$store.state.currentChat.ChatUID] = [];
                this.$store.state.chatMessages[this.$store.state.currentChat.ChatUID].push(msg);
                this.$store.state.currentChatMessages.push(msg);
                
                hooks.Call(events.Chat.ScrollChat);
            },
            Search() {
                var txt = this.SearchTextBoxElem().value;
                if(txt.length > 0) {
                    var actualText = txt.toLowerCase();
                    this.$store.state.uploadedFilesSearchResult =
                        Copy(this.$store.state.uploadedFiles.filter(x => x.FileName.toLowerCase().includes(actualText)));
                } else {
                    this.$store.state.uploadedFilesSearchResult = this.$store.state.uploadedFiles;
                }
            },
            UploadFile(elem) {
                var self = this;
                var store = this.$store;
                var uploader = elem.target;
                var files = uploader.files;

                if(files.length <= 0) return;

                var file = files[0];

                this.UploadFileInputElem().setAttribute("disabled", true);
                this.UploadFileButtonElem().setAttribute("disabled", true);
                this.UploadFileButtonElem().classList.add("is-loading");

                const reader = new FileReader(); 
                reader.onload = function(evt) {
                    var dataString = evt.target.result;
                    var base64 = dataString.split("base64,")[1].trim();

                    var soapContent = `<?xml version="1.0" encoding="utf-8"?>
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                      <soap:Body>
                        <DocumentWrite xmlns="http://www.whoson.com/webservices/kb/">
                          <Contents>${base64}</Contents>
                          <FileName>${file.name}</FileName>
                          <UserName>${store.state.userName}</UserName>
                          <Password>${store.state.password}</Password>
                          <Domain>${store.state.currentChat.Domain}</Domain>
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
                                    hooks.Call(events.FileUploader.Successful, result);
                                }
                            } else {
                                hooks.Call(events.FileUploader.Failed, documentWriteReq.responseText);
                            }

                            self.UploadFileInputElem().removeAttribute("disabled");
                            self.UploadFileButtonElem().removeAttribute("disabled");
                            self.UploadFileButtonElem().classList.remove("is-loading");
                        }
                    }
                    documentWriteReq.open("POST", `${store.state.webChartsURL}cannedresponseservice.asmx?AspxAutoDetectCookieSupport=1`);
                    documentWriteReq.setRequestHeader("Content-Type", "text/xml");
                    documentWriteReq.send(soapContent);
                };
                reader.readAsDataURL(file);
            }
        }
    });
})(woServices);