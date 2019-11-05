
(function(services){

    var hooks = services.Hooks;
    var events = services.HookEvents;

    Vue.component('emojiMenu', {
        data: () => {
            return {

            }
        },
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
        beforeCreate() { 

        },
        methods: {
            Clicked(e) {
                var target = e.target;
                hooks.Call(events.EmojiMenu.Clicked, target.innerHTML);
            }
        }
    });
})(woServices);