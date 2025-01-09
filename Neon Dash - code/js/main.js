document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Предотвращаем отправку формы

  let inputValue = document.getElementById("numberInput").value; // Получаем значение из поля ввода
  let k = Number(inputValue); // Преобразуем строку в число
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const restartButton = document.getElementById("restartButton");
  let live = 10,
    gameOver = false;
  (b = 0), (c = 0), (e = 0), (z = 100), (g = false);
  // Рисуем прямоугольник
  // rect - объект типа {x: 12, y: 12, width: 21, height: 44, color: 'green'}
  function drawRect(rect) {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = rect.color;
    ctx.fill();
  }

  keyClick = {};
  document.addEventListener("keydown", (event) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)
    ) {
      event.preventDefault(); // Отменяем стандартное поведение (например, прокрутку страницы)
    }
    keyClick[event.code] = true;
  });

  document.addEventListener("keyup", (event) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)
    ) {
      event.preventDefault(); // Отменяем стандартное поведение
    }
    keyClick[event.code] = false;
  });

  // Рисуем круг
  // circle - объект типа {x: 12, y: 12, radius: 32, color: 'green'}
  function drawCircle(circle) {
    ctx.beginPath();
    ctx.ellipse(
      circle.x,
      circle.y,
      circle.radius,
      circle.radius,
      Math.PI / 4,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = circle.color;
    ctx.fill();
  }
  // Столкновение окружности и прямоугольника, в аргументах сначала круг
  function resolveCollision(circle, rect) {
    let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    let dx = circle.x - closestX;
    let dy = circle.y - closestY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle.radius) {
      if (Math.abs(dx) > Math.abs(dy)) {
        // Горизонтальное столкновение
        if (circle.x < rect.x) {
          circle.x = rect.x - circle.radius; // Слева от плитки
        } else {
          circle.x = rect.x + rect.width + circle.radius; // Справа от плитки
        }
        circle.dx *= -1;
      } else {
        // Вертикальное столкновение
        if (circle.y < rect.y) {
          circle.y = rect.y - circle.radius; // Сверху от плитки
        } else {
          circle.y = rect.y + rect.height + circle.radius; // Снизу от плитки
        }
        circle.dy *= -1;
      }

      // Корректируем положение шара, если он за границей канваса
      if (circle.x - circle.radius < 0) {
        circle.x = circle.radius;
      }
      if (circle.x + circle.radius > canvas.width) {
        circle.x = canvas.width - circle.radius;
      }
      if (circle.y - circle.radius < 0) {
        circle.y = circle.radius;
      }
      if (circle.y + circle.radius > canvas.height) {
        circle.y = canvas.height - circle.radius;
      }

      return true;
    }
    return false;
  }

  // Случайное число
  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  restartButton.addEventListener("click", () => {
    // Сброс всех игровых параметров
    live = 10;
    gameOver = false;
    c = 0;
    e = 0;
    z = 100;
    g = false;
    renderLoop = window.requestAnimationFrame(render);
    restartButton.style.display = "none";
  });

  let rect = {
    x: 400,
    y: 525,
    width: 350,
    height: 40,
    color: "#ffc75e",
    dx: 6,
    dy: 3,
  };

  let circles = [];
  for (let i = 1; i < k + 1; i++) {
    circles.push({
      x: getRandom(100, 900),
      y: getRandom(100, 150),
      dx: getRandom(0.5, 1.5),
      dy: getRandom(1, 2),
      radius: getRandom(15, 30),
      color: "#8B4513",
      colliding: false, // Новое свойство
    });
  }

  restartButton.addEventListener("click", () => {
    // Сброс всех игровых параметров
    live = 10;
    keyClick = {}; // Сбрасываем управление
    gameOver = false;
    k = Number(prompt("Введите кол-во шариков"));
    c = 0;
    e = 0;
    z = 100;
    g = false;

    // Сброс массива шариков
    circles = [];
    for (let i = 1; i < k + 1; i++) {
      circles.push({
        x: getRandom(100, 900),
        y: getRandom(100, 150),
        dx: getRandom(0.5, 1.5),
        dy: getRandom(1, 2),
        radius: getRandom(15, 30),
        color: "#8B4513",
        colliding: false,
      });
    }

    // Сброс позиции прямоугольника
    rect.x = 400;
    rect.y = 525;

    // Скрываем кнопку
    restartButton.style.display = "none";

    // Останавливаем старый рендер-цикл
    if (renderLoop) {
      window.cancelAnimationFrame(renderLoop);
    }

    // Перезапускаем рендер
    renderLoop = window.requestAnimationFrame(render);
  });
  let renderLoop;
  function render() {
    if (gameOver) {
      alert("Игра закончилась, вы проиграли");
      restartButton.style.display = "none";
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // rect.x = rect.x + rect.dx;
    // if (rect.x + rect.width >= canvas.width || rect.x <= 0) {
    //   rect.dx = rect.dx * -1;
    // }
    if (
      (keyClick["ArrowRight"] && rect.x + rect.width <= canvas.width) ||
      (keyClick["KeyD"] && rect.x + rect.width <= canvas.width)
    ) {
      rect.x = rect.x + rect.dx;
    }
    if (
      (keyClick["ArrowLeft"] && rect.x >= 0) ||
      (keyClick["KeyA"] && rect.x >= 0)
    ) {
      rect.x = rect.x - rect.dx;
    }
    if (
      (keyClick["ArrowUp"] && rect.y >= 0) ||
      (keyClick["KeyW"] && rect.y >= 0)
    ) {
      rect.y = rect.y - rect.dy;
    }
    if (
      (keyClick["ArrowDown"] && rect.y + rect.height <= canvas.height) ||
      (keyClick["KeyS"] && rect.y + rect.height <= canvas.height)
    ) {
      rect.y = rect.y + rect.dy;
    }

    for (circle of circles) {
      circle.x = circle.x + circle.dx;
      circle.y = circle.y + circle.dy;
    }

    for (circle of circles) {
      if (circle.y + circle.radius >= canvas.height) {
        live = live - 1;
      }
      if (
        circle.y + circle.radius >= canvas.height ||
        circle.y - circle.radius <= 0
      ) {
        circle.dy = circle.dy * -1;
      }
      if (
        circle.x + circle.radius >= canvas.width ||
        circle.x - circle.radius <= 0
      ) {
        circle.dx = circle.dx * -1;
      }
      if (resolveCollision(circle, rect)) {
        circle.colliding = true;
        c++;
        g = true;
        console.log(c);
        if (c == 500) {
          z = z * 10;
        } else if (c == 1000) {
          z = z * 10;
        }
      } else {
        circle.colliding = false;
      }
    }
    if (c % z == 0 && c != 0) {
      e++;
      c++;
      g = false;
      circles.push({
        x: getRandom(100, 900),
        y: getRandom(100, 150),
        dx: getRandom(0.5, 1.5),
        dy: getRandom(1, 2),
        radius: getRandom(15, 30),
        color: "#8B4513",
        colliding: false, // Новое свойство
      });
    }
    for (circle of circles) {
      drawCircle(circle);
    }

    drawRect(rect);

    if (live == 0) {
      gameOver = true;
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.53)";
    ctx.fillRect(10, 5, 250, 30);
    ctx.fillStyle = "black";
    ctx.fillText(`Осталось жизней: ${live}, ваш балл: ${e}`, 15, 25);
    renderLoop = window.requestAnimationFrame(render);
  }

  renderLoop = window.requestAnimationFrame(render);

  keyClick = {};
  document.addEventListener("keydown", (even) => {
    keyClick[even.code] = true;
  });
  document.addEventListener("keyup", (even) => {
    keyClick[even.code] = false;
  });
});
