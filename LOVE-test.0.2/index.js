/*
  Shape Shifter
  =============
  A canvas experiment by Kenneth Cachia
  http://www.kennethcachia.com

  Updated code
  ------------
  https://github.com/kennethcachia/Shape-Shifter

  移动端适配修改：
  1. 减少粒子数量，优化性能
  2. 调整粒子移动速度，适配手机
  3. 优化Canvas尺寸更新逻辑
  4. 调整字体适配手机
*/

var S = {
  init: function () {
    var action = window.location.href,
        i = action.indexOf('?a=');

    S.Drawing.init('.canvas');
    document.body.classList.add('body--ready');

    if (i !== -1) {
      S.UI.simulate(decodeURI(action).substring(i + 3));
    } else {
      S.UI.simulate('|#countdown 3|与阿婧的未尽之诗|三月十八日的热浪|踩点把我挤进教室|周易文化课上|我落座你身旁|你转头递来课本|书页间|浮动着若有若无的香|你那落落大方的笑容|比盛开的玉兰|还要轻盈|六十四卦的卦辞在书页间沉睡|这一借|便借走了|我此后所有的目光|❤️❤️❤️|原以为姻缘该如流水般随缘|却不曾想|开学五周后的课堂|撞见了宿命的落款|我翻动书页的声响|惊醒了沉睡的爻辞|那些交错的阴阳线|编织成相遇的轨迹|原来所有看似偶然的相遇|都是|命运精心埋下的伏笔|❤️❤️❤️|签到本上|我的名字|顺着你的笔迹跃然纸上|称呼|从大哥到学长|再到专属的大王|每个称谓都是时光酿的蜜|蜜意浸满了对话框|漫过每个晨昏|原来心动早有预兆|就藏在|你主动借出的书间|就藏在|每次调侃我时|你眼里跃动的星光|❤️❤️❤️|那些悬在对话框的晚安|化作|未完待续的诗行|编织成|独属于我们的诗章|你笑着调侃的语气|使得每个标点都长出翅膀|照耀着|我心底的深渊|❤️❤️❤️|当花香漫过|改论文的深夜|每一丝清甜|都在叩击心门|你精心挑选的温柔|在空气中舒展|暗藏温柔的花束里|彷佛藏了一只柔软的手|轻轻拨开|我心里尘封的角落|这一天|因你的心意而与众不同|这一天|也不再是日历上普通的日期|亦不再是|沉浸在游戏中虚度的时光|而是|被花香浸透的诗行|原来|心动早已在无数个瞬间|悄然扎根|只待此刻绽放|❤️❤️❤️|当你说愿意试试的那一刻|卦象里浮动的云翳|骤然消散|我终于读懂 |所谓缘分|是上天递来的因果|而紧攥红线的|是我与你|透过屏幕相连的指尖|从此|便不再信什么命数轮回|只道一句：|你我自掌此间姻缘|❤️❤️❤️|可|时光是错位的齿轮|没能咬合|大学的晨昏|那些本该替你拂去的|疲惫|只能化作|此刻的叹息|我们|相拥于蝉鸣初沸之时|❤️❤️❤️|阿婧|请把这诗|当做白头偕老的邀约|你常常问我|为何执着于带你吃饭|答案是|吃货的执念在撒野|想带你轧过|每条熟悉的街|欲要通过烟火里的谈笑|模糊离别的期限|❤️❤️❤️|请允许我|用一顿顿热乎的烟火|作为笨拙的相随吧|缀满|我两在每一家小店的|欢声笑语|直到|胃袋被幸福填满|直到|你说起某道菜|亦或是某家店时|会忽然想起|曾经有个大王|把四年的味道|都偷偷塞进了你的餐盘|❤️❤️❤️|此刻|键盘洇开勇气|亲爱的|允许我|用简陋的代码敲出|那些|未能给予婧婧的浪漫|❤️❤️❤️|正在长成爱的形状|等你轻轻翻开|我掌心里的|银河系|我愿放下所有顾虑|怯懦|与彷徨|不再于爱前畏缩|牵紧你的手|奔赴每一个朝夕|直至岁月尽头|与你书写|地久天长！|');
    }

    S.Drawing.loop(function () {
      S.Shape.render();
    });
  }
};
   
setTimeout(function(){
  renderLove(document.getElementById('pinkboard'));
  document.getElementById('child').style.display="block";
},593821);                       //倒计时开始后593.821秒开始播放喷泉爱心动画

S.Drawing = (function () {
  var canvas,
      context,
      renderFn,
      requestFrame = window.requestAnimationFrame       ||
                     window.webkitRequestAnimationFrame ||
                     window.mozRequestAnimationFrame    ||
                     window.oRequestAnimationFrame      ||
                     window.msRequestAnimationFrame     ||
                     function(callback) {
                       window.setTimeout(callback, 1000 / 60);
                     };

  return {
    init: function (el) {
      canvas = document.querySelector(el);
      context = canvas.getContext('2d');
      this.adjustCanvas();

      // 监听手机旋转/resize
      window.addEventListener('resize', function (e) {
        S.Drawing.adjustCanvas();
        // 重新计算粒子位置
        S.Shape.shuffleIdle();
      });
    },

    loop: function (fn) {
      renderFn = !renderFn ? fn : renderFn;
      this.clearFrame();
      renderFn();
      requestFrame.call(window, this.loop.bind(this));
    },

    adjustCanvas: function () {
      // 适配手机视口
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },

    clearFrame: function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
    },

    getArea: function () {
      return { w: canvas.width, h: canvas.height };
    },

    drawCircle: function (p, c) {
      context.fillStyle = c.render();
      context.beginPath();
      context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();
    }
  }
}());

S.UI = (function () {
  var canvas = document.querySelector('.canvas'),
      interval,
      isTouch = ('ontouchstart' in window || navigator.msMaxTouchPoints),
      currentAction,
      resizeTimer,
      time,
      maxShapeSize = 20, // 手机端减小最大形状尺寸
      firstAction = true,
      sequence = [],
      cmd = '#';

  function formatTime(date) {
    var h = date.getHours(),
        m = date.getMinutes();
    m = m < 10 ? '0' + m : m;
    return h + ':' + m;
  }

  function getValue(value) {
    return value && value.split(' ')[1];
  }

  function getAction(value) {
    value = value && value.split(' ')[0];
    return value && value[0] === cmd && value.substring(1);
  }

  function timedAction(fn, delay, max, reverse) {
    clearInterval(interval);
    currentAction = reverse ? max : 1;
    fn(currentAction);

    if (!max || (!reverse && currentAction < max) || (reverse && currentAction > 0)) {
      interval = setInterval(function () {
        currentAction = reverse ? currentAction - 1 : currentAction + 1;
        fn(currentAction);

        if ((!reverse && max && currentAction === max) || (reverse && currentAction === 0)) {
          clearInterval(interval);
        }
      }, delay);
    }
  }

  function reset(destroy) {
    clearInterval(interval);
    sequence = [];
    time = null;
    destroy && S.Shape.switchShape(S.ShapeBuilder.letter(''));
  }

  function performAction(value) {
    var action,
        value,
        current;

    sequence = typeof(value) === 'object' ? value : sequence.concat(value.split('|'));

    timedAction(function (index) {
      current = sequence.shift();

      action = getAction(current);
      value = getValue(current);

      switch (action) {
        case 'countdown':
          value = parseInt(value) || 10;
          value = value > 0 ? value : 10;

          timedAction(function (index) {
            if (index === 0) {
              if (sequence.length === 0) {                
                S.Shape.switchShape(S.ShapeBuilder.letter(''));
              } else {
                performAction(sequence);
              }
            } else {
              S.Shape.switchShape(S.ShapeBuilder.letter(index), true);
            }
          }, 1800, value, true);
          break;    

        case 'rectangle':
          value = value && value.split('x');
          value = (value && value.length === 2) ? value : [maxShapeSize, maxShapeSize / 2];

          S.Shape.switchShape(S.ShapeBuilder.rectangle(Math.min(maxShapeSize, parseInt(value[0])), Math.min(maxShapeSize, parseInt(value[1]))));
          break;

        case 'circle':
          value = parseInt(value) || maxShapeSize;
          value = Math.min(value, maxShapeSize);
          S.Shape.switchShape(S.ShapeBuilder.circle(value));
          break;

        case 'time':
          var t = formatTime(new Date());

          if (sequence.length > 0) {
            S.Shape.switchShape(S.ShapeBuilder.letter(t));
          } else {
            timedAction(function () {
              t = formatTime(new Date());
              if (t !== time) {
                time = t;
                S.Shape.switchShape(S.ShapeBuilder.letter(time));
              }
            }, 2000);
          }
          break;

        default:
          S.Shape.switchShape(S.ShapeBuilder.letter(current[0] === cmd ? 'What?' : current));
      }
    }, 3600, sequence.length);          //文字切换时间3.6秒
  }

  function checkInputWidth(e) {
    // 移动端无需适配输入框宽度，注释即可
  }

  function bindEvents() {
    // 移动端触摸事件兼容
    document.body.addEventListener('keydown', function (e) {
      if (e.keyCode === 13) {
        firstAction = false;
        reset();
        performAction(input.value);
      }
    });

    // 适配手机点击/触摸
    canvas.addEventListener('click', function (e) {
      // 空实现，保留原逻辑
    });
    canvas.addEventListener('touchstart', function (e) {
      // 空实现，保留原逻辑
    }, { passive: true });
  }

  function init() {
    bindEvents();
    isTouch && document.body.classList.add('touch');
  }

  // Init
  init();

  return {
    simulate: function (action) {
      performAction(action);
    }
  }
}());

S.UI.Tabs = (function () {
  var tabs = document.querySelector('.tabs'),
      labels = document.querySelector('.tabs-labels'),
      triggers = document.querySelectorAll('.tabs-label'),
      panels = document.querySelectorAll('.tabs-panel');

  function activate(i) {
    triggers[i].classList.add('tabs-label--active');
    panels[i].classList.add('tabs-panel--active');
  }

  function bindEvents() {
    labels.addEventListener('click', function (e) {
      var el = e.target,
          index;

      if (el.classList.contains('tabs-label')) {
        for (var t = 0; t < triggers.length; t++) {
          triggers[t].classList.remove('tabs-label--active');
          panels[t].classList.remove('tabs-panel--active');

          if (el === triggers[t]) {
            index = t;
          }
        }

        activate(index);
      }
      var a = document.getElementById("dd");
      if(a) { // 防止手机端找不到元素报错
        try {
          a.onload();
          a.onplay();
        } catch(e) {}
      }
    });

    // 移动端触摸标签切换
    labels.addEventListener('touchstart', function (e) {
      e.preventDefault();
      var el = e.target;
      if (el.classList.contains('tabs-label')) {
        for (var t = 0; t < triggers.length; t++) {
          if (el === triggers[t]) {
            activate(t);
            break;
          }
        }
      }
    }, { passive: false });
  }

  function init() {
    activate(0);
    bindEvents();
  }

  // Init
  init();
}());

S.Point = function (args) {
  this.x = args.x;
  this.y = args.y;
  this.z = args.z;
  this.a = args.a;
  this.h = args.h;
};

S.Color = function (r, g, b, a) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
};

S.Color.prototype = {
  render: function () {
    return 'rgba(' + this.r + ',' +  this.g + ',' + this.b + ',' + this.a + ')';
  }
};

S.Dot = function (x, y) {
  this.moveSpeed = 0.08; // 手机端降低移动速度，更流畅
  this.scatterSpeed = 0.18; // 手机端降低散开速度
  this.p = new S.Point({
    x: x,
    y: y,
    z: 2.0,             //手机端减小粒子尺寸，优化性能
    a: 1,
    h: 0
  });

  this.e = 0.08;        //手机端降低粒子移动速度
  this.s = true;

  this.c = new S.Color(255, 50, 100, this.p.a);

  this.t = this.clone();
  this.q = [];
};

S.Dot.prototype = {
  clone: function () {
    return new S.Point({
      x: this.x,
      y: this.y,
      z: this.z,
      a: this.a,
      h: this.h
    });
  },

  _draw: function () {
    this.c.a = this.p.a;
    S.Drawing.drawCircle(this.p, this.c);
  },

  _moveTowards: function (n,speed) {
    var details = this.distanceTo(n, true),
        dx = details[0],
        dy = details[1],
        d = details[2],
        e = (speed || this.moveSpeed) * d;

    if (this.p.h === -1) {
      this.p.x = n.x;
      this.p.y = n.y;
      return true;
    }

    if (d > 1) {
      this.p.x -= ((dx / d) * e);
      this.p.y -= ((dy / d) * e);
    } else {
      if (this.p.h > 0) {
        this.p.h--;
      } else {
        return true;
      }
    }

    return false;
  },

  _update: function () {
    var currentSpeed = this.s ? this.moveSpeed : this.scatterSpeed;
    if (this._moveTowards(this.t,currentSpeed)){
      var p = this.q.shift();

      if (p) {
        this.t.x = p.x || this.p.x;
        this.t.y = p.y || this.p.y;
        this.t.z = p.z || this.p.z;
        this.t.a = p.a || this.p.a;
        this.p.h = p.h || 0;
      } else {
        if (this.s) {
          this.p.x -= Math.sin(Math.random() * 3.142);
          this.p.y -= Math.sin(Math.random() * 3.142);
        } else {
          this.move(new S.Point({
            x: this.p.x + (Math.random() * 30) - 15, // 手机端减小随机范围
            y: this.p.y + (Math.random() * 30) - 15,
          }));
        }
      }
    }

    d = this.p.a - this.t.a;
    this.p.a = Math.max(0.1, this.p.a - (d * 0.05));
    d = this.p.z - this.t.z;
    this.p.z = Math.max(1, this.p.z - (d * 0.05));
  },

  distanceTo: function (n, details) {
    var dx = this.p.x - n.x,
        dy = this.p.y - n.y,
        d = Math.sqrt(dx * dx + dy * dy);

    return details ? [dx, dy, d] : d;
  },

  move: function (p, avoidStatic) {
    if (!avoidStatic || (avoidStatic && this.distanceTo(p) > 1)) {
      this.q.push(p);
    }
  },

  render: function () {
    this._update();
    this._draw();
  }
};

S.ShapeBuilder = (function () {
  var gap = 7, // 手机端增大粒子间距，减少粒子数量
      shapeCanvas = document.createElement('canvas'),
      shapeContext = shapeCanvas.getContext('2d'),
      fontSize = 500, // 手机端减小基础字体大小
      fontFamily = '"STKaiti", "楷体", KaiTi, "PingFang SC", "Hiragino Sans GB", sans-serif'; 

  function fit() {
    shapeCanvas.width = Math.floor(window.innerWidth / gap) * gap;
    shapeCanvas.height = Math.floor(window.innerHeight / gap) * gap;
    shapeContext.fillStyle = 'red';
    shapeContext.textBaseline = 'middle';
    shapeContext.textAlign = 'center';
  }

  function processCanvas() {
    var pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data;
    var dots = [],
        x = 0,
        y = 0,
        fx = shapeCanvas.width,
        fy = shapeCanvas.height,
        w = 0,
        h = 0;
  
    // 手机端限制最大粒子数量，优化性能
    var maxDots = Math.min(
      6000, // 手机端最大粒子数
      Math.max(
        1200, 
        shapeCanvas.width * shapeCanvas.height / (gap * gap) * 0.8
      )
    );

    for (var p = 0; p < pixels.length; p += (4 * gap)) {
      if (pixels[p + 3] > 0) {
        w = x > w ? x : w;
        h = y > h ? y : h;
        fx = x < fx ? x : fx;
        fy = y < fy ? y : fy;
        
        if (dots.length < maxDots) {
          dots.push(new S.Point({ x: x, y: y }));
        }
      }

      x += gap;

      if (x >= shapeCanvas.width) {
        x = 0;
        y += gap;
        p += gap * 4 * shapeCanvas.width;
      }
    }

    return { dots: dots, w: w + fx, h: h + fy };
  }

  function setFontSize(s) {
    shapeContext.font = 'bold ' + s + 'px ' + fontFamily;
  }

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function init() {
    fit();
    window.addEventListener('resize', fit);
  }

  // Init
  init();

  return {
    imageFile: function (url, callback) {
      var image = new Image(),
          a = S.Drawing.getArea();

      image.onload = function () {
        shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
        shapeContext.drawImage(this, 0, 0, a.h * 0.5, a.h * 0.5); // 手机端减小图片尺寸
        callback(processCanvas());
      };

      image.onerror = function () {
        callback(S.ShapeBuilder.letter('What?'));
      }

      image.src = url;
    },

    circle: function (d) {
      var r = Math.max(0, d) / 2;
      shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
      shapeContext.beginPath();
      shapeContext.arc(r * gap, r * gap, r * gap, 0, 2 * Math.PI, false);
      shapeContext.fill();
      shapeContext.closePath();

      return processCanvas();
    },

    letter: function (l) {
      var s = 0;

      setFontSize(fontSize);

      var chineseFactor = /[\u4e00-\u9fa5]/.test(l) ? 1.5 : 1; 
      s = Math.min(fontSize,
                  (shapeCanvas.width / shapeContext.measureText(l).width) * 0.8 * fontSize,
                  (shapeCanvas.height / fontSize) * (isNumber(l) ? 1 : 0.8) * fontSize * chineseFactor);
      setFontSize(s);

      shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
      shapeContext.fillText(l, shapeCanvas.width / 2, shapeCanvas.height / 2);

      return processCanvas();
    },

    rectangle: function (w, h) {
      var dots = [],
          width = gap * w * 1.2,  
          height = gap * h * 1.2;

      for (var y = 0; y < height; y += gap) {
        for (var x = 0; x < width; x += gap) {
          dots.push(new S.Point({
            x: x,
            y: y,
          }));
        }
      }

      return { dots: dots, w: width, h: height };
    }
  };
}());

S.Shape = (function () {
  var dots = [],
      width = 0,
      height = 0,
      cx = 0,
      cy = 0;

  function compensate() {
    var a = S.Drawing.getArea();

    cx = a.w / 2 - width / 2;
    cy = a.h / 2 - height / 2;
  }

  return {
    shuffleIdle: function () {
      var a = S.Drawing.getArea();

      for (var d = 0; d < dots.length; d++) {
        if (!dots[d].s) {
          dots[d].move({
            x: Math.random() * a.w,
            y: Math.random() * a.h
          });
        }
      }
    },

    switchShape: function (n, fast) {
      var size,
          a = S.Drawing.getArea();

      width = n.w;
      height = n.h;

      compensate();

      if (n.dots.length > dots.length) {
        size = n.dots.length - dots.length;
        // 手机端限制单次新增粒子数
        size = Math.min(size, 500);
        for (var d = 1; d <= size; d++) {
          dots.push(new S.Dot(a.w / 2, a.h / 2));
        }
      }

      var d = 0,
          i = 0;

      while (n.dots.length > 0) {
        i = Math.floor(Math.random() * n.dots.length);
        dots[d].e = fast ? 0.12 : (dots[d].s ? 0.06 : 0.04); // 手机端降低速度

        if (dots[d].s) {
          dots[d].move(new S.Point({
            z: Math.random() * 15 + 8, // 手机端减小粒子尺寸
            a: Math.random(),
            h: 15
          }));
        } else {
          dots[d].move(new S.Point({
            z: Math.random() * 4 + 4,
            h: fast ? 15 : 25
          }));
        }

        dots[d].s = true;
        dots[d].move(new S.Point({
          x: n.dots[i].x + cx,
          y: n.dots[i].y + cy,
          a: 1,
          z: 1.0,
          h: 0
        }));

        n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
        d++;
      }

      for (var i = d; i < dots.length; i++) {
        if (dots[i].s) {
          dots[i].move(new S.Point({
            z: Math.random() * 15 + 8,
            a: Math.random(),
            h: 18
          }));

          dots[i].s = false;
          dots[i].e = 0.03; // 手机端降低速度
          dots[i].move(new S.Point({
            x: Math.random() * a.w,
            y: Math.random() * a.h,
            a: 0.1,
            z: Math.random() * 1.0,
            h: 0
          }));
        }
      }
    },

    render: function () {
      // 手机端性能优化：每帧最多渲染固定数量粒子
      var renderCount = Math.min(dots.length, 2000);
      for (var d = 0; d < renderCount; d++) {
        dots[d].render();
      }
    }
  }
}());

S.init();