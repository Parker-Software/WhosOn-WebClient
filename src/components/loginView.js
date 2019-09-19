
(function(){
    var hooks = woServices.Hooks;
    var events = woServices.HookEvents;
    var connEvents = events.Connection;

    var userName;
    var password;
    var displayName;
    var department;
    var authString;

    Vue.component(woServices.Store.state.loginViewName, {
        data: function () {
            return {
                
            }
        },
        template:
        `
        <div id=loginPage>           
            <div class="columns is-fixed-top header is-marginless" id="app-header">
                <div class="column is-12 has-text-centered">
                    <h1 class="is-size-5">WhosOn</h1>
                </div>
            </div>
            <section class="hero wo-login is-fullheight">
                <div class="hero-body">
                    <div class="container has-text-centered">
                        <div class="column is-4 is-offset-4">
                            <div class="box">
                                <figure class="avatar" style="margin-bottom: 4px;">
                                    <i class="fas fa-user fa-7x"></i>
                                </figure>
                                <form>
                                    <div class="field">
                                        <div class="control">
                                            <label>Username</label>
                                            <input class="input" type="text" id="userNameInput" autofocus="" name="username" placeholder="Username" required>
                                        </div>
                                    </div>

                                    <div class="field">
                                        <div class="control">
                                            <label>Password</label>
                                            <input class="input" type="password" id="passwordInput">
                                        </div>
                                    </div>                           
                                    <input type="button" class="button is-block" v-on:click="onSubmit" value="Login">
                                </form>
                            </div>
                            <div class="field has-text-left" style="padding-left:20px;">
                                <input id="RememberMe" type="checkbox" name="RememberMe" class="switch is-rounded"
                                    checked="checked">
                                <label for="RememberMe">Keep me signed in</label>
                            </div>
                            <div class="field has-text-left" style="padding-left:20px;">
                                <input id="advSettings" type="checkbox" name="advSettings" class="switch is-rounded" v-on:change="toggleAdvancedSettings">
                                <label for="advSettings">Advanced settings</label>
                            </div>
                            <!-- toggle is-hidden  -->
                            <div class="box advSettings" id="advSettingsBox" style="visibility: hidden;">                        
                                <div class="field">
                                    <div class="control">
                                        <label>Your name:</label>
                                        <input class="input" type="text" id="nameInput" autofocus="">
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="control">
                                        <label>Department:</label>
                                        <input class="input" type="text" id="departmentInput" autofocus="">
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="control">
                                        <label>Authentication string:</label>
                                        <input class="input" type="text" id="authStringInput" autofocus="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="errorMessage">

                        </div>
                    </div>
                </div>
            </section>
            <div class="footer-bar" style="position: fixed; bottom:5px; width: 100%; text-align: center;">
                <!-- needs like to settings portal -->
                <a >Reset your password</a>
                <br>
                <p>Copyright &copy; Parker Software 2019</p>
            </div>
        </div>
        `,
        beforeCreate() {
            hooks.Register(connEvents.MessageFromServer, (e) => {

                var errorMessage;
                
                switch(e.Data)
                {
                    case "No username specified.":
                        errorMessage = "Please enter your username."    
                    break;
                    case "No password specified.":
                        errorMessage = "Please enter your password."
                    break;  
                    case "You must specify a display name.":
                        errorMessage = "Please specify your name."
                    break;
                    case "Invalid credentials entered. Please check your login details.":
                        errorMessage = e.Data;
                    break;
                }

                if (errorMessage != null)
                {
                    document.getElementById("passwordInput").value = "";
                    document.getElementById("errorMessage").innerText = e.Data;
                }
            });

            hooks.Register(connEvents.LoggedIn, () => {                
                woServices.Store.commit("saveLoginDetails", { userName, password, displayName, department });
                document.getElementById("loginPage").style.visibility = "hidden"
                document.getElementById("advSettingsBox").style.visibility = "hidden";
            });
        },
        methods: {
            onSubmit() {
                userName = document.getElementById("userNameInput").value;
                password = document.getElementById("passwordInput").value;
                displayName = document.getElementById("nameInput").value;
                department = document.getElementById("departmentInput").value;
                authString = document.getElementById("authStringInput").value;

                woServices.Authentication.Login(userName, password, displayName, department);
            },
            toggleAdvancedSettings() {
                var advSettingsToggle = document.getElementById("advSettings");
                var advSettingsArea = document.getElementById("advSettingsBox");
                if (advSettingsToggle.checked == true) advSettingsArea.style.visibility = "visible";
                if (advSettingsToggle.checked == false) advSettingsArea.style.visibility = "hidden";
            },
            resetPasswordRedirect() {

            }
        }
    });

    hooks.Register(connEvents.LoggedIn, () => {
        
    });
})();
