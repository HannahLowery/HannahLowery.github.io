
//for diamond clicks
const diamonds = document.querySelectorAll('.diamond, .diamond1, .diamond2, .diamond3, .diamond4, .diamond5');
const banners = document.querySelectorAll('.banner');

diamonds.forEach((diamond, index) => {
  diamond.addEventListener('click', () => {
    diamonds.forEach(d => d.style.background = 'transparent');
    diamond.style.background = 'green';
    banners.forEach(b => b.classList.remove('active'));
    const target = document.getElementById('banner' + index);
    if (target) target.classList.add('active');
  });
});

//text scrambling menu
const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

function scramble(el) {
  const original = el.getAttribute('data-text');
  let iterations = 0;
  const interval = setInterval(() => {
    el.innerText = original
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < iterations) return original[i];
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      })
      .join('');
    if (iterations >= original.length) clearInterval(interval);
    iterations += 0.5;
  }, 30);
}

document.querySelectorAll('#menu p b').forEach(b => {
  b.setAttribute('data-text', b.innerText.trim().toUpperCase());
  b.closest('p').addEventListener('mouseenter', () => scramble(b));
});

//textContainer animation
const textContainer = document.querySelector(".textContainer");
let easeFactor = 0.02;
let scene, camera, renderer, planeMesh;
let mousePosition = { x: 0.5, y: 0.5 };
let targetMousePosition = { x: 0.5, y: 0.5 };
let prevPosition = { x: 0.5, y: 0.5 };

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform vec2 u_prevMouse;

  void main() {
    vec2 gridUV = floor(vUv * vec2(20.0, 20.0)) / vec2(20.0, 20.0);
    vec2 centerOfPixel = gridUV + vec2(1.0/20.0, 1.0/20.0);
    vec2 mouseDirection = u_mouse - u_prevMouse;
    vec2 pixelToMouse = centerOfPixel - u_mouse;
    float pixelDistanceToMouse = length(pixelToMouse);
    float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);
    vec2 uvOffset = strength * -mouseDirection * 0.3;
    vec2 uv = vUv - uvOffset;
    gl_FragColor = texture2D(u_texture, uv);
  }
`;

function createTextTexture(text, font, size, color, fontWeight = '100') {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const canvasWidth = window.innerWidth * 2;
  const canvasHeight = window.innerHeight * 2;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.fillStyle = color || "#ffffff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  const fontSize = size || Math.floor(canvasWidth * 0.08);
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `${fontWeight} ${fontSize}px "${font || "Blanquotey"}"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const scaleFactor = Math.min(1, (canvasWidth * 0.9) / textWidth);
  const aspectCorrection = canvasWidth / canvasHeight;
  ctx.setTransform(scaleFactor, 0, 0, scaleFactor / aspectCorrection, canvasWidth / 2, canvasHeight / 2);
  ctx.fillText(text, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

function initializeScene(texture) {
  scene = new THREE.Scene();
  const aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(-1, 1, 1 / aspectRatio, -1 / aspectRatio, 0.1, 1000);
  camera.position.z = 1;
  let shaderUniforms = {
    u_mouse: { type: "v2", value: new THREE.Vector2() },
    u_prevMouse: { type: "v2", value: new THREE.Vector2() },
    u_texture: { type: "t", value: texture },
  };
  planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ uniforms: shaderUniforms, vertexShader, fragmentShader })
  );
  scene.add(planeMesh);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  textContainer.appendChild(renderer.domElement);
}

initializeScene(createTextTexture("Explore My Projects", "Blanquotey", null, "#ffffff", "100"));

function animateScene() {
  requestAnimationFrame(animateScene);
  mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
  mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;
  planeMesh.material.uniforms.u_mouse.value.set(mousePosition.x, 1.0 - mousePosition.y);
  planeMesh.material.uniforms.u_prevMouse.value.set(prevPosition.x, 1.0 - prevPosition.y);
  renderer.render(scene, camera);
}

animateScene();

textContainer.addEventListener("mousemove", handleMouseMove);
textContainer.addEventListener("mouseenter", handleMouseEnter);
textContainer.addEventListener("mouseleave", handleMouseLeave);

function handleMouseMove(event) {
  easeFactor = 0.04;
  let rect = textContainer.getBoundingClientRect();
  prevPosition = { ...targetMousePosition };
  targetMousePosition.x = (event.clientX - rect.left) / rect.width;
  targetMousePosition.y = (event.clientY - rect.top) / rect.height;
}

function handleMouseEnter(event) {
  easeFactor = 0.02;
  let rect = textContainer.getBoundingClientRect();
  mousePosition.x = targetMousePosition.x = (event.clientX - rect.left) / rect.width;
  mousePosition.y = targetMousePosition.y = (event.clientY - rect.top) / rect.height;
}

function handleMouseLeave() {
  easeFactor = 0.02;
  targetMousePosition = { ...prevPosition };
}

//card flipping
const overlay = document.getElementById('cardOverlay');
const cardFlip = document.getElementById('cardFlip');
const enlargedImg = document.getElementById('enlargedImg');
const flipBtn = document.getElementById('flipBtn');
const backBtn = document.getElementById('backBtn');

document.querySelectorAll('.banner .slider .item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const img = item.querySelector('img');
    enlargedImg.src = img.src;
    const details = item.getAttribute('data-details') || 'No details available';
    document.getElementById('cardBackContent').innerText = details;
    document.querySelectorAll('.banner .slider').forEach(s => {
      s.style.animationPlayState = 'paused';
    });
    cardFlip.classList.remove('flipped');
    overlay.classList.add('active');
  });
});

flipBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  cardFlip.classList.toggle('flipped');
});

backBtn.addEventListener('click', closeOverlay);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeOverlay();
});

function closeOverlay() {
  overlay.classList.remove('active');
  cardFlip.classList.remove('flipped');
  document.querySelectorAll('.banner .slider').forEach(s => {
    s.style.animationPlayState = 'running';
  });
}

//transitions and load events
window.addEventListener('load', () => {

  setTimeout(() => {
    document.getElementById('swipeOverlay').classList.add('exit');
  }, 100);

  const seenIntro = sessionStorage.getItem('seenIntro');

  if (!seenIntro) {
    sessionStorage.setItem('seenIntro', 'true');

    setTimeout(() => {
      document.getElementById('intro').classList.add('hide');
      document.getElementById('layout').classList.add('show');
      document.getElementById('menu').classList.add('show');
      setTimeout(() => {
        document.getElementById('intro').style.display = 'none';
      }, 1500);
    }, 2000);

  } else {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('layout').classList.add('show');
    document.getElementById('menu').classList.add('show');
  }

});

// Click listeners outside load — attached immediately when script runs
document.querySelector('.contact').addEventListener('click', () => {
  document.getElementById('swipeRightOverlay').classList.add('active');
  setTimeout(() => {
    window.location.href = 'ContactPage.html';
  }, 800);
});

document.querySelector('.about').addEventListener('click', () => {
  document.getElementById('swipeLeftOverlay').classList.add('active');
  setTimeout(() => {
    window.location.href = 'AboutPage.html';
  }, 800);
});