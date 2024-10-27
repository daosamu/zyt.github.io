// 设置画布

const para = document.querySelector("p");
// 获取页面中第一个<canvas>元素
const canvas = document.querySelector('canvas');

// 获取2D渲染上下文，用于在画布上绘制图形
const ctx = canvas.getContext('2d');

// 设置画布的宽度为浏览器窗口的内部宽度
const width = canvas.width = window.innerWidth;

// 设置画布的高度为浏览器窗口的内部高度
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
// 定义一个生成指定范围内随机整数的函数
function random(min, max) {
  // Math.random()生成一个0到1之间的随机数
  // 乘以(max - min)后得到一个0到(max - min)之间的随机数
  // Math.floor()向下取整，得到一个整数
  // 最后加上min，得到一个min到max之间的随机整数
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num; // 返回生成的随机数
}



// 定义一个生成随机RGB颜色字符串的函数
function randomColor() {
  // 调用random函数三次，分别生成R、G、B三个随机值
  // 将这些值组合成RGB格式的字符串并返回
  return (
    "rgb(" +
    random(0, 255) + // 随机红色分量
    ", " +
    random(0, 255) + // 随机绿色分量
    ", " +
    random(0, 255) + // 随机蓝色分量
    ")"
  );
}

// 全局变量
const balls = [];
let count = 0;

class Shape {
  constructor(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size, exists) {
    super(x, y, velX, velY, exists);

    this.color = color;
    this.size = size;
  }

  // 在Ball的原型上定义一个draw方法，用于绘制小球
  draw() {
    // 开始一个新的绘制路径
    ctx.beginPath();
    // 设置填充颜色为小球的color属性
    ctx.fillStyle = this.color;
    // 绘制一个圆，圆心在(x, y)，半径为size
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    // 填充圆的颜色
    ctx.fill();
  };

  // 在Ball的原型上定义一个update方法，用于更新小球的位置和速度
  update() {
    // 检查小球是否触及画布的右侧边缘
    // 如果小球的位置加上它的半径大于或等于画布的宽度
    if (this.x + this.size >= width) {
      // 反转小球在X轴上的速度，使其向左移动
      this.velX = -this.velX;
    }

    // 检查小球是否触及画布的左侧边缘
    // 如果小球的位置减去它的半径小于或等于0
    if (this.x - this.size <= 0) {
      // 反转小球在X轴上的速度，使其向右移动
      this.velX = -this.velX;
    }

    // 检查小球是否触及画布的底部边缘
    // 如果小球的位置加上它的半径大于或等于画布的高度
    if (this.y + this.size >= height) {
      // 反转小球在Y轴上的速度，使其向上移动
      this.velY = -this.velY;
    }

    // 检查小球是否触及画布的顶部边缘
    // 如果小球的位置减去它的半径小于或等于0
    if (this.y - this.size <= 0) {
      // 反转小球在Y轴上的速度，使其向下移动
      this.velY = -this.velY;
    }

    // 更新小球在X轴上的位置，根据其速度velX进行移动
    this.x += this.velX;

    // 更新小球在Y轴上的位置，根据其速度velY进行移动
    this.y += this.velY;
  };



  // 在Ball的原型上定义一个collisionDetect方法，用于检测和响应小球之间的碰撞
  collisionDetect() {
    // 遍历balls数组中的每一个小球对象，检查当前小球是否与数组中的其他小球发生碰撞
    for (let j = 0; j < balls.length; j++) {
      // 检查当前小球(this)是否与balls数组中的第j个小球是同一个对象
      // 如果是同一个对象，则跳过此次循环迭代，因为小球不会与自己碰撞
      if (this !== balls[j]) {
        // 计算当前小球与第j个小球在X轴和Y轴上的距离差
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;

        // 使用勾股定理计算当前小球与第j个小球之间的直线距离
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 检查两个小球之间的距离是否小于或等于它们半径之和
        // 如果是，则认为两个小球发生了碰撞
        if (distance < this.size + balls[j].size) {
          // 发生碰撞后，将两个小球的颜色都设置为一个新的随机颜色
          balls[j].color = this.color = randomColor();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y, exists) {
    super(x, y, exists);

    this.velX = 20;
    this.velY = 20;
    this.color = "white";
    this.size = 10;
    this.setControls();
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }

    if (this.x - this.size <= 0) {
      this.x += this.size;
    }

    if (this.y + this.size >= height) {
      this.y -= this.size;
    }

    if (this.y - this.size < 0) {
      this.y += this.size;
    }
  }

  setControls() {
    window.onkeydown = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          this.y -= this.velY;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          this.y += this.velY;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          this.x -= this.velX;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          this.x += this.velX;
          break;
      }
    }
  }

  collisionDetect() {
    for (let j = 0; j < balls.length; j++) {
      if (balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].exists = false;
          count--;
          para.textContent = "还剩 " + count + " 个球";
        }
      }
    }
  }
}

//创建一个新的恶魔圈的对象实例
const evilBall = new EvilCircle(
  random(0, width),
  random(0, height),
  true,
);

loop();

// 使用while循环，直到数组中包含25个小球对象为止
while (balls.length < 25) {
  // 生成一个随机的尺寸大小，小球直径在10到20像素之间
  let size = random(10, 20);

  // 创建一个新的Ball对象，传入以下参数：
  // - x坐标：在画布宽度范围内，但至少离边缘有一个球的大小，避免小球绘制时部分在画布外
  // - y坐标：在画布高度范围内，同样至少离边缘有一个球的大小
  // - velX：小球在X轴的初始速度，范围在-7到7之间
  // - velY：小球在Y轴的初始速度，范围在-7到7之间
  // - color：小球的颜色，使用randomColor函数生成
  // - size：小球的尺寸，使用上面生成的随机大小
  const ball = new Ball(
    random(0 + size, width - size),  // x坐标
    random(0 + size, height - size), // y坐标
    random(-7, 7),                   // X轴速度
    random(-7, 7),                   // Y轴速度
    randomColor(),                   // 颜色
    size,                            // 尺寸
    true,                            // 是否存在
  );

  // 将新创建的小球对象添加到balls数组中
  balls.push(ball);
  count++;
  para.textContent = "还剩 " + count + " 个球";
}

// 定义一个loop函数，用于绘制和更新小球，并创建一个动画循环
function loop() {
  // 设置画布的填充样式为半透明的黑色，用于创建一个渐变的背景效果
  // rgba(0, 0, 0, 0.25)表示黑色，其中alpha值为0.25，即25%的透明度
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";

  // 使用fillRect方法绘制一个矩形，这个矩形覆盖整个画布
  // 参数依次为矩形的x坐标，y坐标，宽度和高度
  ctx.fillRect(0, 0, width, height);

  // 遍历balls数组中的每一个小球对象
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      // 调用每个小球的draw方法来在画布上绘制小球
      balls[i].draw();

      // 调用每个小球的update方法来更新小球的位置和速度
      balls[i].update();

      // 调用每个小球的collisionDetect方法来检测和响应小球之间的碰撞
      balls[i].collisionDetect();
    }
  }
  // 绘制恶魔圈
  evilBall.draw();
  evilBall.checkBounds();
  evilBall.collisionDetect();

  // 使用requestAnimationFrame方法来请求浏览器在下一次重绘之前调用loop函数
  // 这样就创建了一个动画循环，loop函数会反复调用，实现动画效果
  requestAnimationFrame(loop);
}




