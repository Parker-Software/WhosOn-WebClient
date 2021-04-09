
(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connEvents = events.Connection;
    var state = services.Store.state;

    var userName;
    var password;
    var department;

    Vue.component(state.loginViewNameSSO, {
        template:
        `
        <div v-bind:id="$store.state.loginViewNameSSO" class="view">           
            <div class="header" id="app-header">
                <div class="has-text-centered">
                    <h1 class="is-size-6-half has-text-weight-medium">WhosOn Login</h1>
                </div>
            </div>
            <section class="wo-login">
            <div class="container has-text-centered">
            <div class="column is-4 is-offset-4">
                <div class="box">
                    <figure class="avatar" style="margin-bottom: 4px;">
                        <i class="fas fa-user fa-6x"></i>
                    </figure>
                    <form>
                        <div class="field">
                            <div class="control">
                                <label>Username or Email Address:</label>
                                <select name="savedUsername" id="savedUsernameInput" class="input" v-if="!firstTime">

                                </select>
          
                                    <input v-on:keyup.enter="onSubmit" class="input" type="text" id="userNameInput" autofocus="" name="username" required>          
                                    
                            </div>
                        </div>

                        <div class="field" v-if="serverVisible">
                            <div class="control">
                                <label>Server:</label>
                                <input v-on:keyup.enter="onSubmit" class="input" id="serverInput">
                            </div>
                        </div>                        

                        <div class="field" v-if="authVisible">
                            <div class="control">
                                <label>Authentication string:</label>
                                <input v-on:keyup.enter="onSubmit" class="input" id="authInput">
                            </div>
                        </div>                        


                        <div class="field" v-if="passwordVisible">
                            <div class="control">
                                <label>Password:</label>
                                <input v-on:keyup.enter="onSubmit" class="input" type="password" id="passwordInput">
                            </div>
                        </div>                        
                        <input type="button" class="button is-block btn" v-on:click="onSubmit" value="Next">                        
                    </form>
                    <div class="notification is-danger wo-error is-hidden"></div>
                </div>
                <div class="field has-text-left" style="padding-left:20px;">
                    <input id="RememberMe" type="checkbox" name="RememberMe" :checked="rememberMe" class="switch is-rounded">
                    <label for="RememberMe">Keep me signed in</label>
                </div>
                <!--
                <div class="field has-text-left" style="padding-left:20px;">
                    <input id="advSettings" type="checkbox" name="advSettings" class="switch is-rounded" v-on:change="toggleAdvancedSettings">
                    <label for="advSettings">Advanced settings</label>
                </div>
                -->
                <!-- toggle is-hidden  -->
                <div class="box advSettings" id="advSettingsBox" style="visibility: hidden;">  
                    <div class="field">
                        <div class="control">
                            <label>Department:</label>
                            <input class="input" type="text" id="departmentInput" autofocus="">
                        </div>
                    </div>
                </div> 
            </div>
            
        </div>
            </section>
            <div class="footer-bar" style="position: fixed;width: 100%; text-align: center;">
                <a v-on:click="resetPasswordRedirect">Reset Your Password</a>
                <br />
                <a v-on:click="createAccountRedirect">Create WhosOn Account</a>
                <br />
                <p style="bottom:5px; ">Copyright &copy; Parker Software {{CurrentYear}}</p>
            </div>
        </div>
        `,
        beforeCreate() {
            hooks.Register(connEvents.MessageFromServer, (e) => {

                var errorMessage;
                var usernameInput = document.getElementById("userNameInput");           
                var passwordInput = document.getElementById("passwordInput");
               

                switch(e.Data)
                {
                    case "No username specified.":
                        errorMessage = "Please enter your username." 
                        usernameInput.classList.toggle("is-danger");
                    break;
                    case "No password specified.":
                        errorMessage = "Please enter your password."
                        passwordInput.classList.toggle("is-danger");
                    break;                    
                    case "Invalid credentials entered. Please check your login details.":
                        errorMessage = e.Data;
                    break;
                    case "User already logged in.":    
                    errorMessage = e.Data;               
                    break;
                }

                if (errorMessage != null) {
                    if (passwordInput) passwordInput.value = "";                  
                    var woError = document.getElementsByClassName("wo-error")[0];
                    woError.innerText = e.Data;
                    woError.classList.remove("is-hidden"); 
                } else {
                    console.log(e.Data);
                }
            });

            // handle instance when open id is enabled
            hooks.Register(connEvents.OpenIdOn, (e) => {
                // please wait event
            });

            hooks.Register(connEvents.OpenIdAuth, (e) => {
                services.Store.commit("saveLoginDetails", { userName, openid: 2 });
                window.location = e.Data;
            });

            // handle instance when open id is not enabled
            hooks.Register(connEvents.OpenIdOff, (e) => {
                // show password
                this.passwordVisible = true;
            });

            hooks.Register(connEvents.LoggedIn, () => {              
                services.Store.commit("saveLoginDetails", { userName, t:password, department });
                if (this.rememberMe)
                {
                    localStorage.setItem('rememberUsername', null);
                }
                else
                {
                    localStorage.setItem('rememberUsername', userName);
                }
            });

            hooks.Register(connEvents.Connected, (e) => {
                
                if(state.userName != null && state.userName != "") {
                    if (state.t != null && state.t != "") {
                    userName = state.userName;
                    password = state.t;
                    department = state.department;

                    services.Authentication.Login(userName,
                        password,
                        department);
                    } else if (state.openid != null) {
                        userName = state.userName;
                        // returning openid state
                        if (this.QueryString.get("openid")) {
                            services.Authentication.Login(userName, 
                                "whoson-openid-token:" + window.location.search,
                                department);
                        }
                    }
                } else {
                    var remember = localStorage.getItem('rememberUsername');
                    if (remember) {
                        this.rememberMe = true;
                        document.getElementById("userNameInput").value = remember;
                        this.onSubmit();
                    }
                }
            });
        },
        data: function(){ return {
            firstTime: true,
            serverVisible: false,
            authVisible: false,
            passwordVisible: false,
            rememberMe: false,
        }},
        computed: {
            CurrentYear() {
                return new Date().getFullYear();
            },
            QueryString() {
                return new URLSearchParams(window.location.search);
            }
        },
        methods: {
            onSubmit() {

                if (this.passwordVisible) {
                    password = document.getElementById("passwordInput").value;
                    department = document.getElementById("departmentInput").value;
                    services.Authentication.Login(userName, password, department);
                } else {
                    userName = document.getElementById("userNameInput").value;

                    if (userName.indexOf('\\') > 0 || userName.indexOf("@") > 0) {
                        // check with discovery service first
                        services.Authentication.DiscoverUser(userName);
                    } else {
                        // directly trigger the open id service
                        services.Authentication.CheckOpenId(userName);
                    }
                }                         
            },

            toggleAdvancedSettings() {
                var advSettingsToggle = document.getElementById("advSettings");
                var advSettingsArea = document.getElementById("advSettingsBox");
                if (advSettingsToggle.checked == true) {advSettingsArea.style.visibility = "visible";}
                if (advSettingsToggle.checked == false) {advSettingsArea.style.visibility = "hidden";}
            },
            resetPasswordRedirect() {
                var sameServer = window.location.protocol + "//" + window.location.hostname + "/settings";
                window.open((state.settingsPortalAddress || sameServer) + "/ForgottenPassword.aspx", "Settings Portal Forgotten Password", "alwaysRaised=yes,dependent=yes,resizable=no,scrollbars=no,width=700,height=800");
            },
            createAccountRedirect() {
                window.open("https://www.whoson.com/pricing", "Settings Portal Create Account", "alwaysRaised=yes,dependent=yes,resizable=no,scrollbars=no,width=700,height=800");
            }
        }
    });
})(woServices);
