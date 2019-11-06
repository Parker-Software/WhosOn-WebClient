
(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('emojiMenu', {
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
                hooks.Call(events.EmojiMenu.Clicked, target.innerHTML);
            }
        }
    });
})(woServices);