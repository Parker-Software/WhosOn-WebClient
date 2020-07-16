
(function(services){
    var hooks = services.Hooks;
    var events = services.HookEvents;
    var connEvents = events.Connection;
    var state = services.Store.state;

    var userName;
    var password;
    var department;

    Vue.component(state.loginViewName, {
        template:
        `
        <div v-bind:id="$store.state.loginViewName" class="view">           
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
                                <label>Username:</label>
                                <input v-on:keyup.enter="onSubmit" class="input" type="text" id="userNameInput" autofocus="" name="username" required>
                            </div>
                        </div>

                        <div class="field">
                            <div class="control">
                                <label>Password:</label>
                                <input v-on:keyup.enter="onSubmit" class="input" type="password" id="passwordInput">
                            </div>
                        </div>                        
                        <input type="button" class="button is-block btn" v-on:click="onSubmit" value="Login">                        
                    </form>
                    <div class="notification is-danger wo-error is-hidden"></div>
                </div>
                <div class="field has-text-left" style="padding-left:20px;">
                    <input id="RememberMe" type="checkbox" name="RememberMe" class="switch is-rounded"
                        checked="checked">
                    <label for="RememberMe">Keep me signed in</label>
                </div>
                <!--
                <div class="field has-text-left" style="padding-left:20px;">
                    <input id="advSettings" type="checkbox" name="advSettings" class="switch is-rounded" v-on:change="toggleAdvancedSettings">
                    <label for="advSettings">Advanced settings</label>
                </div> -->
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
                var username = document.getElementById("userNameInput");           
                var password = document.getElementById("passwordInput");
               

                switch(e.Data)
                {
                    case "No username specified.":
                        errorMessage = "Please enter your username." 
                        username.classList.toggle("is-danger");
                    break;
                    case "No password specified.":
                        errorMessage = "Please enter your password."
                        password.classList.toggle("is-danger");
                    break;                    
                    case "Invalid credentials entered. Please check your login details.":
                        errorMessage = e.Data;
                    break;
                    case "User already logged in.":    
                    errorMessage = e.Data;               
                    break;
                }

                if (errorMessage != null)
                {
                    document.getElementById("passwordInput").value = "";                  
                    var woError = document.getElementsByClassName("wo-error")[0];
                    woError.innerText = e.Data;
                    woError.classList.remove("is-hidden"); 
                }
            });

            hooks.Register(connEvents.LoggedIn, () => {              
                services.Store.commit("saveLoginDetails", { userName, t:password, department });
            });

            hooks.Register(connEvents.Connected, (e) => {
                if(state.userName != null && state.userName != "" && state.t != null && state.t != "") {
                    userName = state.userName;
                    password = state.t;
                    department = state.department;

                    services.Authentication.Login(userName,
                        password,
                        department);
                }
            });
        },
        computed: {
            CurrentYear() {
                return new Date().getFullYear();
            }
        },
        methods: {
            onSubmit() {
                userName = document.getElementById("userNameInput").value;
                password = document.getElementById("passwordInput").value;              
                department = document.getElementById("departmentInput").value;
                
                var list = document.getElementsByTagName("input");
               
                for (let index = 0; index < list.length; index++) {
                    list[index].classList.remove("is-danger");                    
                }
                var woError = document.getElementsByClassName("wo-error")[0];            
                woError.classList.add("is-hidden");

                services.Authentication.Login(userName, password, department);
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
