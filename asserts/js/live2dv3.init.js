// 创建看板娘div
document.body.insertAdjacentHTML("beforeend", 
    `<div id="l2d-toggle" class="">
        <span>看版娘</span>
     </div>
     <div class="l2d" style="bottom: 0px;">
        <div class="Canvas" id="L2dCanvas">
            <div id="l2d-tool">
                <span class="fa fa-lg fa-comment"></span>
                <span class="fa fa-lg fa-paper-plane"></span>
                <span class="fa fa-lg fa-user-circle"></span>
                <span class="fa fa-lg fa-street-view"></span>
                <span class="fa fa-lg fa-camera-retro"></span>
                <span class="fa fa-lg fa-info-circle"></span>
                <span class="fa fa-lg fa-times"></span>
            </div>
            <div id="l2d-tips" class="">hello word</div>
        </div>
     </div>`);

// 依赖js
// 兼容低版本浏览器
document.write('<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"> </script>');
// 音频播放
document.write('<script src="https://cdn.jsdelivr.net/npm/howler@2.1.3/dist/howler.min.js"></script>');
// 必需
document.write('<script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>');
document.write('<script src="https://cdn.jsdelivr.net/npm/pixi.js@4.6.1/dist/pixi.min.js"></script>');
// live2dv3.js
document.write('<script src="https://cdn.jsdelivr.net/npm/live2dv3@1.2.2/live2dv3.min.js"></script>');
// 内置角色
document.write('<script src="./asserts/js/charData.js"></script>');

window.onload = () => {
    createL2dv();
}

// 创建l2dv
var l2dv
function createL2dv() {
    if(!l2dv) {
        l2dv = new l2dViewer({
            el: document.getElementById('L2dCanvas'), // 要添加Live2d的元素
            basePath: 'https://cdn.jsdelivr.net/gh/alg-wiki/AzurLaneL2DViewer@gh-pages/assets', // 模型根目录
            modelName: 'dujiaoshou_6', // 模型名称
            sounds: [ // 触摸播放声音
                'sounds/demo.mp3', // 相对路径是相对于模型文件夹
                'https://cdn.jsdelivr.net/npm/live2dv3@latest/assets/biaoqiang_3/sounds/demo.mp3' // 也可以是网址
            ]
        })
    }
     // 注册事件
     registerEventListener();
}

// 监听事件
function registerEventListener() {
    const click_tips = ["干嘛呢你，快把手拿开～～", "鼠…鼠标放错地方了！", "你要干嘛呀？", "喵喵喵？", "怕怕(ノ≧∇≦)ノ", "非礼呀！救命！", "这样的话，只能使用武力了！", "我要生气了哦", "不要动手动脚的！", "真…真的是不知羞耻！", "Hentai！"]
    document.querySelector("#L2dCanvas canvas").addEventListener("click", () => {
        showMessage(click_tips[click_tips.length * Math.random() << 0], 1000)
    });

    // tool click event
    document.querySelector("#l2d-tool .fa-comment").addEventListener("click", showHitokoto);
    document.querySelector("#l2d-tool .fa-paper-plane").addEventListener("click", () => {
        showMessage("功能待定");
    });
    document.querySelector("#l2d-tool .fa-user-circle").addEventListener("click", loadModel);
    document.querySelector("#l2d-tool .fa-street-view").addEventListener("click", loadModel);
    document.querySelector("#l2d-tool .fa-camera-retro").addEventListener("click", () => {
        showMessage("功能待定");
    });
    document.querySelector("#l2d-tool .fa-info-circle").addEventListener("click", () => {
        open("https://github.com/jianchengwang/live2d_models");
    });
    document.querySelector("#l2d-tool .fa-times").addEventListener("click", hideModel);

    // toogle click event
    document.getElementById("l2d-toggle").addEventListener("click", showModel);

    // other
    const devtools = () => {};
    console.log("%c", devtools);
    devtools.toString = () => {
        showMessage("哈哈，你打开了控制台，是想要看看我的小秘密吗？", 4000, 9);
    };
    window.addEventListener("copy", () => {
        showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 4000, 9);
    });
    window.addEventListener("visibilitychange", () => {
        if (!document.hidden) showMessage("哇，你终于回来了～", 4000, 9);
    });
}

// 显示模型
function hideModel(l2d_toggle) {
    showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
    setTimeout(() => {
        document.getElementById("L2dCanvas").style.bottom = "-500px";
        document.getElementById("L2dCanvas").style.display = "none";
        document.getElementById("l2d-toggle").classList.add("l2d-toggle-active");
    }, 3000);
}

// 隐藏模型
function showModel() {
    const l2d_toggle = document.getElementById("l2d-toggle");
    l2d_toggle.classList.remove("l2d-toggle-active");
    document.getElementById("L2dCanvas").style.display = "";
    setTimeout(() => {
        document.getElementById("L2dCanvas").style.bottom = 0;
        showMessage("萌萌哒看板娘已上线", 3000, 11);
    }, 500);
}

// 加载model
function loadModel(modelName) {
    showMessage("正在切换看板娘...", 6000, 1);
    if(modelName instanceof MouseEvent) {
        modelName = randomChar();
    } else if(!modelName) {
        if(document.getElementById('modelName')) {
            modelName = document.getElementById('modelName').value
        } else {
            modelName = randomChar();
        }
    }
    console.info(modelName + ' loading....' )
    l2dv.loadModel(modelName)
}

// 随机选择角色模型
function randomChar() {
    var keys = Object.keys(charData)
    return charData[keys[keys.length * Math.random() << 0]];
};

// 显示一句一言
function showHitokoto() {
    // 增加 hitokoto.cn 的 API
    fetch("https://v1.hitokoto.cn")
        .then(response => response.json())
        .then(result => {
            const text = `这句一言来自 <span>「${result.from}」</span>，是 <span>${result.creator}</span> 在 hitokoto.cn 投稿的。`;
            showMessage(result.hitokoto, 6000, 9);
            setTimeout(() => {
                showMessage(text, 4000, 9);
            }, 6000);
        });
}

// 显示tip消息
function showMessage(text, timeout, priority) {
    if (!text) return;
    if(!timeout) timeout = 1000;
    const tips = document.getElementById("l2d-tips");
    tips.innerHTML = text;
    tips.classList.add("l2d-tips-active");
    messageTimer = setTimeout(() => {
        sessionStorage.removeItem("l2d-text");
        tips.classList.remove("l2d-tips-active");
    }, timeout);
}
  