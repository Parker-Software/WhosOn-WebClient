
(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component("emoji-menu", {
        template: `
            <div class="emojiMenu">
                <ul class="emojiList">
                    <li v-on:click="Clicked" class="emojiBtn">😀</li>
                    <li v-on:click="Clicked" class="emojiBtn">😁</li>
                    <li v-on:click="Clicked" class="emojiBtn">😂</li>
                    <li v-on:click="Clicked" class="emojiBtn">🤣</li>
                    <li v-on:click="Clicked" class="emojiBtn">😃</li>
                    <li v-on:click="Clicked" class="emojiBtn">😄</li>
                    <li v-on:click="Clicked" class="emojiBtn">😅</li>
                    <li v-on:click="Clicked" class="emojiBtn">😆</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😉</li>
                    <li v-on:click="Clicked" class="emojiBtn">😊</li>
                    <li v-on:click="Clicked" class="emojiBtn">😋</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😎</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😍</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😘</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🥰</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😗</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😙</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😚</li>
                    <li v-on:click="Clicked" class="emojiBtn">🙂</li>
                    <li v-on:click="Clicked" class="emojiBtn">🤗</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤩</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤔</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤨</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😐</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😑</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😶</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🙄</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😏</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😣</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😥</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😮</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤐</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😯</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😪</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😫</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😴</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😌</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😛</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😜</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😝</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤤</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😒</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😓</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😔</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😕</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🙃</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤑</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😲</li> 
                    <li v-on:click="Clicked" class="emojiBtn">☹️</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🙁</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😖</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🥵</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😞</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😟</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🥶</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😤</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🥴</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😢</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😭</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😦</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😧</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🥳</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😨</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😩</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤯</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😬</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😰</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😱</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😳</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤪</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😵</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😡</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🥺</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😠</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😷</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤒</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤕</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤢</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤮</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤧</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😇</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤠</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤥</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤫</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤭</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🧐</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤓</li> 
                    <li v-on:click="Clicked" class="emojiBtn">😈</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👿</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤡</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👹</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👺</li> 
                    <li v-on:click="Clicked" class="emojiBtn">💀</li> 
                    <li v-on:click="Clicked" class="emojiBtn">☠️</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👻</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👽</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👾</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤖</li>  
                    <li v-on:click="Clicked" class="emojiBtn">🙊</li>
                    <li v-on:click="Clicked" class="emojiBtn">🦵</li>
                    <li v-on:click="Clicked" class="emojiBtn">🦶</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤳</li> 
                    <li v-on:click="Clicked" class="emojiBtn">💪</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👈</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👉</li> 
                    <li v-on:click="Clicked" class="emojiBtn">☝️</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👆</li>  
                    <li v-on:click="Clicked" class="emojiBtn">👇</li> 
                    <li v-on:click="Clicked" class="emojiBtn">✌️</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤞</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🖖</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤘</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤙</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🖐️</li> 
                    <li v-on:click="Clicked" class="emojiBtn">✋</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👌</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👍</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👎</li> 
                    <li v-on:click="Clicked" class="emojiBtn">✊</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👊</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤛</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤜</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤚</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👋</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤟</li> 
                    <li v-on:click="Clicked" class="emojiBtn">✍</li>
                    <li v-on:click="Clicked" class="emojiBtn">️👏</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👐</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🙌</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤲</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🙏</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🤝</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👂</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👃</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👀</li> 
                    <li v-on:click="Clicked" class="emojiBtn">👁️</li> 
                    <li v-on:click="Clicked" class="emojiBtn">🧠</li>
                </ul>
            </div>
            `,
        methods: {
            Clicked(e) {
                var target = e.target;
                this.$emit("Clicked", target.innerHTML);
            }
        }
    });
})(woServices);