
(function(services){
    var state = services.Store.state;
    var connection = services.WhosOnConn;

    Vue.component("file-menu", {
        props: [
            "show",
            "id",
            "files",
            "domain"
        ],
        data: () => {
            return {
                file: null,
                data: null,
                showLoader: false,
                error: false,
                showSendModal: false,
                showAlreadyUploadedModal: false,
                searchText: "",
            };
        },
        template: `
            <div v-if="show" v-bind:id="id" class="fileMenu">
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
                            <file-item v-for="item in filesToShow"
                                :hashedFileName="item.HashedFileName"
                                :name="item.FileName"
                                :date="item.Dated"
                                :size="item.Size"
                                :who="item.CreatedByUser"
                                :isPinned="item.Pinned"
                                @Clicked="ItemClicked">
                            </file-item>
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
        computed: {
            filesToShow() {
                if(this.searchText.length > 0) {
                    return this.validFiles.filter(x => x.FileName.toLowerCase().includes(this.searchText));
                } else {
                    return this.validFiles;
                }
            },
            validFiles() {
                return this.files.filter(item => item.VisitorUploaded == false);
            },
            sendFileContent() {
                return "<span class=\"fa-stack fa-lg\">" +
                    "<i class=\"fas fa-circle fa-stack-2x\"></i>" +
                    "<i class=\"fas fa-question fa-stack-1x\" style=\"color:white\"></i>" +
                "</span>" +
                "<span>" +
                    `Do you want to send the file <span v-if="file != null">${this.file.FileName}</span>?` +
                    "<br />" +
                    "They will be able to download the file." +
                "</span>"
            },
            sendFileAlreadyUploadedContent() {
                return "<span>File already uploaded. Do you want to upload another copy?<span>"
            }
        },
        methods: {
            SearchTextBoxElem() {
                return document.getElementById("fileSearchTxtBox");
            },
            UploadFileInputElem() {
                return document.getElementById("fileUploaderControl");
            },
            Search() {
                var txt = this.SearchTextBoxElem().value;
                this.searchText = txt.toLowerCase();
            },
            ItemClicked(fileName) {
                this.file = this.filesToShow.find(x => x.HashedFileName == fileName);
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
                this.HideSendModal();
                this.SearchTextBoxElem().value = "";
                this.$emit("Send", this.file.FileName, this.file.URL);
                this.searchText = "";
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
                
                let key = `${state.userName}${state.time.toString()}`;
                let t = CryptoJS.AES.decrypt(
                    state.t,
                    key
                );

                var soapContent = `<?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                  <soap:Body>
                    <DocumentWrite xmlns="http://www.whoson.com/webservices/kb/">
                      <Contents>${base64}</Contents>
                      <FileName>${self.file.name}</FileName>
                      <UserName>${state.userName}</UserName>
                      <Password>${t.toString(CryptoJS.enc.Utf8)}</Password>
                      <Domain>${self.domain}</Domain>
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
                                self.showLoader = false;
                                self.error = true;
                            } else {
                                self.showLoader = false;
                                self.error = false;
                                connection.GetFiles();
                                self.$emit("Send", self.file.name, result);
                                self.UploadFileInputElem().value = "";
                            }
                        } else {
                            self.showLoader = false;
                            self.error = true;
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

                if(files.length <= 0) {return;}

                this.file = files[0];
                var reader = new FileReader(); 
                reader.onload = function(evt) {
                    self.data = evt;
                    var alreadyExists = state.uploadedFiles.filter(x => x.FileName.includes(self.file.name));
                    if(alreadyExists.length > 0) {
                        self.ShowAlreadyUploadedModal();
                        return;
                    } else {
                        self.UploadFile();
                    }
                };
                reader.readAsDataURL(this.file);
            }
        }
    });
})(woServices);