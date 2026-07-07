var PASTEL_COLORS = ['#FFD6D6','#FFE8CC','#FFF3CC','#D6F5E3','#CCE8FF','#E8D6FF','#FFD6F0','#D6FFFA'];
var PEOPLE_EMOJIS = ['👩🏻','👨🏻‍🦱','👩🏽','👨🏾','👩🏿‍🦱','👦🏼','👧🏾','👱🏻‍♀️','🧑🏽‍🦰','👩🏻‍🦳'];

var state = {
  name: 'luna_mk',
  avatarEmoji: '👧🏾',
  avatarColor: '#E8D6FF',
  xp: 340,
  level: 3,
  streak: 5,
  totalQuests: 18,
  completedToday: ['q1','q3'],
  moments: []
};

var XP_PER_LEVEL = 500;
var selectedQuestId = null;
var tempEmoji = '👧🏾';
var tempColor = '#E8D6FF';

var quests = [
  {id:'q1',  title:'Излез надвор',         desc:'Сликај се на свеж воздух — парк, двор, улица. Неважно каде, важно е да излезеш!', xp:50,  cat:'Физичка',  type:'physical'},
  {id:'q2',  title:'Пешки до некаде',      desc:'Оди пешки до некое место наместо со автобус. Сними го патот!',                    xp:60,  cat:'Физичка',  type:'physical'},
  {id:'q6',  title:'Танцувај 3 минути',    desc:'Пушти ја омилената песна и танцувај! Сними момент за доказ.',                    xp:45,  cat:'Физичка',  type:'physical'},
  {id:'q9',  title:'Трчај 5 минути',       desc:'Трчај барем 5 минути — на место, во парк, каде сакаш.',                          xp:65,  cat:'Физичка',  type:'physical'},
  {id:'q3',  title:'Нацртај нешто',        desc:'Нацртај нешто — сè е добредојдено. Сликај го твојот момент!',                    xp:40,  cat:'Креативна', type:'creative'},
  {id:'q7',  title:'Убав момент надвор',   desc:'Фати го убавиот момент на денот — изгрев, зајдисонце или убаво небо.',           xp:55,  cat:'Креативна', type:'creative'},
  {id:'q10', title:'Читај надвор',         desc:'Прочитај барем 10 минути книга надвор. Сликај се со книгата!',                   xp:50,  cat:'Креативна', type:'creative'},
  {id:'q5',  title:'Мисија со пријател',   desc:'Заврши ја мисијата заедно со пријател — двете лица на фотото!',                  xp:80,  cat:'Социјална', type:'social'},
  {id:'q11', title:'Залеј растение',       desc:'Залеј цвет или засади нешто ново. Сликај го!',                                   xp:35,  cat:'Социјална', type:'social'},
  {id:'q4',  title:'Зготви нешто здраво', desc:'Направи нешто здраво сам — салата, сендвич, смути. Сликај го пред да го изедеш!',xp:70,  cat:'Исхрана',  type:'food'},
  {id:'q8',  title:'Овошје или зеленчук', desc:'Изеди овошје или зеленчук денес и сликај го пред да го изедеш!',                  xp:35,  cat:'Исхрана',  type:'food'},
  {id:'q12', title:'Испечи нешто',        desc:'Испечи колач или мафин заедно со некој. Сликај го резултатот!',                   xp:75,  cat:'Исхрана',  type:'food'},
];

var dailyIds = ['q1','q2','q3','q6'];

// Friend feed with demo photo placeholders
var friendPhotos = [
  {emoji:'👩🏻', color:'#D6F5E3', name:'Ana_mk',    questTitle:'Излез надвор',        time:'пред 10 мин', bg:'#C8E6C9', label:'🌿'},
  {emoji:'👨🏻‍🦱', color:'#FFE8CC', name:'Marko99',   questTitle:'Зготви нешто здраво', time:'пред 23 мин', bg:'#FFF9C4', label:'🍳'},
  {emoji:'👩🏽', color:'#FFD6F0', name:'sofija_mk', questTitle:'Нацртај нешто',       time:'пред 1 час',  bg:'#F8BBD0', label:'🎨'},
  {emoji:'👦🏼', color:'#CCE8FF', name:'Petar_7b',  questTitle:'Мисија со пријател',  time:'пред 2 часа', bg:'#BBDEFB', label:'🤝'},
  {emoji:'👱🏻‍♀️', color:'#E8D6FF', name:'Elena22',   questTitle:'Танцувај 3 минути',   time:'пред 3 часа', bg:'#E1BEE7', label:'💃'},
];

// ---- helpers ----
function getLevelLabel(lvl) { return 'Level ' + lvl; }
function getXpProgress()    { return Math.round((state.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100); }

function makeAvatarEl(emoji, color, size) {
  size = size || 44;
  var font = Math.round(size * 0.5);
  return '<div style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:'+color+';display:flex;align-items:center;justify-content:center;font-size:'+font+'px;flex-shrink:0">'+emoji+'</div>';
}

function questImg(qid, size) {
  size = size || 52;
  var src = QUEST_IMGS[qid] || '';
  return '<img src="'+src+'" style="width:'+size+'px;height:'+size+'px;object-fit:contain">';
}

function getXpBadge(xp) {
  var thresholds = [200,100,75,50,25,10];
  var idx = thresholds.length - 1;
  for (var i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) { idx = i; break; }
  }
  return XP_IMGS[idx] || '';
}

// ---- date ----
function setDate() {
  var days = ['Недела','Понеделник','Вторник','Среда','Четврток','Петок','Сабота'];
  var d = new Date();
  var el = document.getElementById('hdr-date');
  if (el) el.textContent = days[d.getDay()] + ' • ' + d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear();
}

// ---- header ----
function updateHeader() {
  document.getElementById('home-level').textContent = getLevelLabel(state.level);
  document.getElementById('home-xp-txt').textContent = (state.xp % XP_PER_LEVEL) + ' / ' + XP_PER_LEVEL + ' XP';
  document.getElementById('home-xp-bar').style.width = getXpProgress() + '%';
  document.getElementById('stat-streak').textContent = '🔥 ' + state.streak;
  document.getElementById('stat-done').textContent = state.completedToday.length + '/' + dailyIds.length;
  document.getElementById('stat-total').textContent = state.totalQuests;
  document.getElementById('home-avatar').innerHTML = makeAvatarEl(state.avatarEmoji, state.avatarColor, 40);
}

// ---- quests ----
function makeQuestCard(q, done, onclick) {
  var div = document.createElement('div');
  div.className = 'quest-card' + (done ? ' done' : '');
  var xpBadge = done ? '' : ('<img src="'+getXpBadge(q.xp)+'" style="width:36px;height:36px;object-fit:contain;position:absolute;top:12px;right:12px">');
  div.innerHTML =
      xpBadge +
      '<div style="margin-bottom:10px">'+questImg(q.id, 52)+'</div>' +
      '<div class="q-title">'+q.title+'</div>' +
      '<div class="q-desc">'+q.desc+'</div>' +
      (done
          ? '<div style="margin-top:8px;font-size:12px;font-weight:700;color:#065F46">Завршена ✓</div>'
          : '<div style="margin-top:8px;display:flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg><span style="font-size:12px;font-weight:700;color:var(--purple)">Сликај + добиј +'+q.xp+' XP</span></div>');
  if (!done && onclick) div.onclick = onclick;
  return div;
}

function renderDailyQuests() {
  var el = document.getElementById('quest-list');
  el.innerHTML = '';
  dailyIds.forEach(function(id) {
    var q = quests.find(function(x) { return x.id === id; });
    var done = state.completedToday.indexOf(id) > -1;
    el.appendChild(makeQuestCard(q, done, function() { openQuest(q); }));
  });
}

function renderAllQuests() {
  var cats = {physical:'all-quests-physical', creative:'all-quests-creative', social:'all-quests-social', food:'all-quests-food'};
  Object.keys(cats).forEach(function(type) {
    var el = document.getElementById(cats[type]);
    el.innerHTML = '';
    quests.filter(function(q) { return q.type === type; }).forEach(function(q) {
      var done = state.completedToday.indexOf(q.id) > -1;
      el.appendChild(makeQuestCard(q, done, function() { openQuest(q); showScreen('screen-home'); }));
    });
  });
}

// ---- PHOTO FEED ----
function renderFeed() {
  var el = document.getElementById('feed-list');
  el.innerHTML = '';

  // Header
  var hdr = document.createElement('div');
  hdr.style.cssText = 'font-size:13px;color:var(--gray-400);margin-bottom:16px;line-height:1.5';
  hdr.textContent = 'Фотографиите на твоите пријатели од денес';
  el.appendChild(hdr);

  friendPhotos.forEach(function(f) {
    // Check if this friend's quest was completed by user (demo: show user photo if completed)
    var userPhoto = state.moments.find(function(m) { return m.title === f.questTitle; });

    var card = document.createElement('div');
    card.style.cssText = 'border:1px solid var(--gray-200);border-radius:16px;overflow:hidden;margin-bottom:16px;background:white';

    // Top: avatar + name + time
    var top = '<div style="display:flex;align-items:center;gap:10px;padding:12px 14px 8px">' +
        makeAvatarEl(f.emoji, f.color, 36) +
        '<div>' +
        '<div style="font-size:14px;font-weight:700">'+f.name+'</div>' +
        '<div style="font-size:11px;color:var(--gray-400)">'+f.questTitle+' • '+f.time+'</div>' +
        '</div>' +
        '</div>';

    // Photo area - demo placeholder with emoji
    var photo = '<div style="width:100%;aspect-ratio:1;background:'+f.bg+';display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:64px;position:relative">' +
        f.label +
        '<div style="position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,0.4);color:white;border-radius:99px;padding:3px 10px;font-size:11px;font-weight:600">'+f.questTitle+'</div>' +
        '</div>';

    // Bottom: reactions
    var bottom = '<div style="padding:10px 14px;display:flex;align-items:center;gap:12px">' +
        '<button onclick="likePhoto(this)" style="background:none;border:none;cursor:pointer;font-size:20px;display:flex;align-items:center;gap:4px"><span>🔥</span><span style="font-size:12px;font-weight:600;color:var(--gray-600)">12</span></button>' +
        '<button onclick="likePhoto2(this)" style="background:none;border:none;cursor:pointer;font-size:20px;display:flex;align-items:center;gap:4px"><span>⭐</span><span style="font-size:12px;font-weight:600;color:var(--gray-600)">5</span></button>' +
        '<div style="flex:1"></div>' +
        '<div style="font-size:12px;color:var(--gray-400)">Inspired? Complete this quest!</div>' +
        '</div>';

    card.innerHTML = top + photo + bottom;
    el.appendChild(card);
  });

  // User's own photos section
  if (state.moments.length > 0) {
    var myHdr = document.createElement('div');
    myHdr.style.cssText = 'font-size:13px;font-weight:700;color:var(--gray-900);margin:8px 0 12px';
    myHdr.textContent = 'Твоите моменти';
    el.appendChild(myHdr);

    state.moments.forEach(function(m) {
      if (!m.img) return;
      var card = document.createElement('div');
      card.style.cssText = 'border:1px solid var(--gray-200);border-radius:16px;overflow:hidden;margin-bottom:16px';
      var top = '<div style="display:flex;align-items:center;gap:10px;padding:12px 14px 8px">' +
          makeAvatarEl(state.avatarEmoji, state.avatarColor, 36) +
          '<div><div style="font-size:14px;font-weight:700">'+state.name+'</div>' +
          '<div style="font-size:11px;color:var(--gray-400)">'+m.title+' • токушто</div></div></div>';
      var photo = '<img src="'+m.img+'" style="width:100%;aspect-ratio:1;object-fit:cover;display:block">';
      card.innerHTML = top + photo;
      el.appendChild(card);
    });
  }
}

function likePhoto(btn) {
  var span = btn.querySelector('span:last-child');
  span.textContent = parseInt(span.textContent) + 1;
  btn.style.transform = 'scale(1.3)';
  setTimeout(function() { btn.style.transform = ''; }, 200);
}
function likePhoto2(btn) { likePhoto(btn); }

// ---- modal with camera ----
function openQuest(q) {
  selectedQuestId = q.id;
  document.getElementById('m-icon-wrap').innerHTML = questImg(q.id, 64);
  document.getElementById('m-title').textContent = q.title;
  document.getElementById('m-desc').textContent = q.desc;
  document.getElementById('m-xp').innerHTML = '<img src="'+getXpBadge(q.xp)+'" style="width:20px;height:20px;object-fit:contain;vertical-align:middle"> +'+q.xp+' XP';
  document.getElementById('m-cat').textContent = q.cat;
  var done = state.completedToday.indexOf(q.id) > -1;
  document.getElementById('m-done-msg').style.display = done ? 'block' : 'none';
  document.getElementById('m-upload-area').style.display = done ? 'none' : 'block';
  document.getElementById('photo-preview-img').style.display = 'none';
  document.getElementById('photo-preview-img').src = '';
  document.getElementById('photo-input').value = '';
  document.getElementById('retake-btn').style.display = 'none';
  document.getElementById('complete-btn').style.display = 'none';
  document.getElementById('camera-zone').style.display = 'flex';
  document.getElementById('quest-modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('quest-modal').style.display = 'none';
  selectedQuestId = null;
  // Stop camera if running
  stopCamera();
}

var cameraStream = null;

function openCamera() {
  var video = document.getElementById('camera-video');
  var zone = document.getElementById('camera-zone');
  var videoWrap = document.getElementById('video-wrap');
  var captureBtn = document.getElementById('capture-btn');

  zone.style.display = 'none';
  videoWrap.style.display = 'block';
  captureBtn.style.display = 'flex';

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then(function(stream) {
          cameraStream = stream;
          video.srcObject = stream;
          video.play();
        })
        .catch(function() {
          // Fallback to file picker if camera denied
          stopCamera();
          document.getElementById('photo-input').click();
        });
  } else {
    document.getElementById('photo-input').click();
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(function(t) { t.stop(); });
    cameraStream = null;
  }
  var video = document.getElementById('camera-video');
  if (video) video.srcObject = null;
}

function capturePhoto() {
  var video = document.getElementById('camera-video');
  var canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 400;
  canvas.height = video.videoHeight || 400;
  canvas.getContext('2d').drawImage(video, 0, 0);
  var dataUrl = canvas.toDataURL('image/jpeg', 0.85);

  stopCamera();
  document.getElementById('video-wrap').style.display = 'none';
  document.getElementById('capture-btn').style.display = 'none';

  var img = document.getElementById('photo-preview-img');
  img.src = dataUrl;
  img.style.display = 'block';
  document.getElementById('retake-btn').style.display = 'block';
  document.getElementById('complete-btn').style.display = 'flex';
}

function retakePhoto() {
  document.getElementById('photo-preview-img').style.display = 'none';
  document.getElementById('retake-btn').style.display = 'none';
  document.getElementById('complete-btn').style.display = 'none';
  document.getElementById('camera-zone').style.display = 'flex';
}

function handlePhoto(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('video-wrap').style.display = 'none';
      document.getElementById('capture-btn').style.display = 'none';
      document.getElementById('camera-zone').style.display = 'none';
      var img = document.getElementById('photo-preview-img');
      img.src = e.target.result;
      img.style.display = 'block';
      document.getElementById('retake-btn').style.display = 'block';
      document.getElementById('complete-btn').style.display = 'flex';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function completeQuest() {
  if (!selectedQuestId) return;
  var q = quests.find(function(x) { return x.id === selectedQuestId; });
  if (state.completedToday.indexOf(selectedQuestId) > -1) return;
  state.completedToday.push(selectedQuestId);
  state.totalQuests++;
  state.xp += q.xp;
  if (state.xp >= state.level * XP_PER_LEVEL) state.level++;
  var img = document.getElementById('photo-preview-img');
  state.moments.unshift({
    title: q.title, qid: q.id,
    img: (img.style.display === 'block' && img.src) ? img.src : null
  });
  friendPhotos.unshift({
    emoji: state.avatarEmoji, color: state.avatarColor,
    name: state.name, questTitle: q.title,
    time: 'токушто', bg: '#EDE9FE', label: '📸',
    userImg: (img.style.display === 'block' && img.src) ? img.src : null
  });
  closeModal();
  showXpToast('+' + q.xp + ' XP!');
  renderDailyQuests();
  renderAllQuests();
  renderFeed();
  updateHeader();
}

function showXpToast(msg) {
  var t = document.getElementById('xp-toast');
  t.textContent = msg;
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(function() { t.style.transform = 'translateX(-50%) translateY(-100px)'; }, 2400);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
  var navMap = {'screen-home':'nav-home','screen-quests':'nav-quests','screen-feed':'nav-feed','screen-profile':'nav-profile'};
  document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
  var navId = navMap[id];
  if (navId) document.getElementById(navId).classList.add('active');
  if (id === 'screen-feed') renderFeed();
  if (id === 'screen-profile') renderProfile();
}

// ---- profile ----
function renderProfile() {
  document.getElementById('prof-avatar').innerHTML = makeAvatarEl(state.avatarEmoji, state.avatarColor, 90);
  document.getElementById('prof-name').textContent = state.name;
  document.getElementById('prof-level').textContent = getLevelLabel(state.level);
  document.getElementById('ps-xp').textContent = state.xp;
  document.getElementById('ps-streak').textContent = '🔥 ' + state.streak;
  document.getElementById('ps-quests').textContent = state.totalQuests;
  renderAvatarPicker();
  renderMoments();
}

function renderAvatarPicker() {
  var avEl = document.getElementById('prof-av-pick');
  avEl.innerHTML = '';
  PEOPLE_EMOJIS.forEach(function(em) {
    var d = document.createElement('div');
    d.style.cssText = 'width:52px;height:52px;border-radius:50%;background:'+state.avatarColor+';display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;border:3px solid '+(em===state.avatarEmoji?'#111827':'transparent')+';transition:all 0.15s';
    d.textContent = em;
    d.onclick = function() {
      state.avatarEmoji = em;
      renderAvatarPicker();
      document.getElementById('prof-avatar').innerHTML = makeAvatarEl(em, state.avatarColor, 90);
      document.getElementById('home-avatar').innerHTML = makeAvatarEl(em, state.avatarColor, 40);
    };
    avEl.appendChild(d);
  });
  var colEl = document.getElementById('prof-col-pick');
  colEl.innerHTML = '';
  PASTEL_COLORS.forEach(function(col) {
    var d = document.createElement('div');
    d.className = 'col-opt' + (col === state.avatarColor ? ' selected' : '');
    d.style.background = col;
    d.onclick = function() {
      state.avatarColor = col;
      renderAvatarPicker();
      document.getElementById('prof-avatar').innerHTML = makeAvatarEl(state.avatarEmoji, col, 90);
      document.getElementById('home-avatar').innerHTML = makeAvatarEl(state.avatarEmoji, col, 40);
    };
    colEl.appendChild(d);
  });
}

function renderMoments() {
  var el = document.getElementById('moment-gallery');
  el.innerHTML = '';
  if (state.moments.length === 0) {
    el.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--gray-400);font-size:14px">Заврши мисии за да ги собереш твоите моменти!</div>';
    return;
  }
  state.moments.forEach(function(m) {
    var d = document.createElement('div');
    d.className = 'moment-item';
    if (m.img) {
      d.innerHTML = '<img src="'+m.img+'" style="width:100%;height:100%;object-fit:cover;border-radius:10px"><div class="m-label">'+m.title+'</div>';
    } else {
      d.innerHTML = questImg(m.qid, 40)+'<div class="m-label">'+m.title+'</div>';
    }
    el.appendChild(d);
  });
}

// ---- onboarding ----
function goStep2() {
  var name = document.getElementById('ob-name').value.trim();
  var age  = document.getElementById('ob-age').value;
  if (!name) { alert('Внеси корисничко ime!'); return; }
  if (!age)  { alert('Избери возраст!'); return; }
  state.name = name;
  document.getElementById('ob-step1').style.display = 'none';
  document.getElementById('ob-step2').style.display = 'block';
  renderObPicker();
}

function renderObPicker() {
  var avEl = document.getElementById('ob-av-pick');
  avEl.innerHTML = '';
  PEOPLE_EMOJIS.forEach(function(em) {
    var d = document.createElement('div');
    d.style.cssText = 'width:52px;height:52px;border-radius:50%;background:'+tempColor+';display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;border:3px solid '+(em===tempEmoji?'#111827':'transparent')+';transition:all 0.15s';
    d.textContent = em;
    d.onclick = function() { tempEmoji = em; renderObPicker(); };
    avEl.appendChild(d);
  });
}

function selectColor(el, col) {
  tempColor = col;
  document.querySelectorAll('#ob-col-pick .col-opt').forEach(function(x) { x.classList.remove('selected'); });
  el.classList.add('selected');
  renderObPicker();
}

function finishOnboard() {
  state.avatarEmoji = tempEmoji;
  state.avatarColor = tempColor;
  state.name = document.getElementById('ob-name').value.trim() || 'Играч';
  document.getElementById('onboard-screen').style.display = 'none';
  document.getElementById('app-screens').style.display    = 'block';
  document.getElementById('bottom-nav').style.display     = 'flex';
  setDate();
  updateHeader();
  renderDailyQuests();
  renderAllQuests();
  renderFeed();
}

setDate();

// ---- FRIENDS ----
var friendsList = [
  {emoji:'👩🏻', color:'#D6F5E3', name:'Ana_mk',    streak:8,  quests:24},
  {emoji:'👨🏻‍🦱', color:'#FFE8CC', name:'Marko99',   streak:3,  quests:11},
  {emoji:'👩🏽', color:'#FFD6F0', name:'sofija_mk', streak:12, quests:38},
];

var currentFeedTab = 'photos';

function switchFeedTab(tab) {
  currentFeedTab = tab;
  document.getElementById('tab-photos').style.display = tab === 'photos' ? 'block' : 'none';
  document.getElementById('tab-friends').style.display = tab === 'friends' ? 'block' : 'none';
  var photosBtn = document.getElementById('tab-photos-btn');
  var friendsBtn = document.getElementById('tab-friends-btn');
  if (tab === 'photos') {
    photosBtn.style.background = 'white';
    photosBtn.style.color = 'var(--purple)';
    photosBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
    friendsBtn.style.background = 'transparent';
    friendsBtn.style.color = 'var(--gray-400)';
    friendsBtn.style.boxShadow = 'none';
  } else {
    friendsBtn.style.background = 'white';
    friendsBtn.style.color = 'var(--purple)';
    friendsBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
    photosBtn.style.background = 'transparent';
    photosBtn.style.color = 'var(--gray-400)';
    photosBtn.style.boxShadow = 'none';
    renderFriendsList();
  }
}

var INSPIRE_MSGS = [
  'те inspira да излезе надвор! 🌿',
  'те поканува на авантура! ✨',
  'те мотивира да се движиш! 🏃',
  'сака да го поделиш денот! 📸',
  'ве повикува на заедничка мисија! 🤝',
];

function renderFriendsList() {
  var el = document.getElementById('friends-list');
  if (!el) return;
  el.innerHTML = '';
  if (friendsList.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:32px;color:var(--gray-400);font-size:14px">Немаш пријатели уште.<br>Додај некого горе!</div>';
    return;
  }
  friendsList.forEach(function(f, idx) {
    var div = document.createElement('div');
    div.style.cssText = 'background:white;border:1px solid var(--gray-200);border-radius:14px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all 0.15s';
    div.innerHTML =
        '<div style="display:flex;align-items:center;gap:12px">' +
        makeAvatarEl(f.emoji, f.color, 44) +
        '<div style="flex:1;min-width:0">' +
        '<div style="font-size:14px;font-weight:700;color:var(--gray-900)">' + f.name + '</div>' +
        '<div style="font-size:12px;color:var(--gray-400);margin-top:2px">🔥 ' + f.streak + ' ден streak</div>' +
        '</div>' +
        '<button onclick="event.stopPropagation();sendInspire(\'' + f.name + '\',this)" style="background:var(--purple-light);border:none;border-radius:8px;padding:7px 12px;font-size:12px;font-weight:700;color:var(--purple);cursor:pointer;white-space:nowrap">✨ Inspire</button>' +
    '</div>';
    // Long press / hold for options
    div.onclick = function() { toggleFriendOptions(div, f, idx); };
    el.appendChild(div);
  });
}

function toggleFriendOptions(div, f, idx) {
  var existing = div.querySelector('.friend-options');
  if (existing) { existing.remove(); return; }
  var opts = document.createElement('div');
  opts.className = 'friend-options';
  opts.style.cssText = 'margin-top:12px;padding-top:12px;border-top:1px solid var(--gray-100);display:flex;flex-direction:column;gap:6px';
  opts.innerHTML =
      '<button onclick="sendInspire(\'' + f.name + '\',this)" style="background:var(--purple-light);border:none;border-radius:8px;padding:9px;font-size:13px;font-weight:600;color:var(--purple);cursor:pointer;text-align:left">✨ Испрати Inspire</button>' +
  '<button onclick="showRemoveConfirm(\'' + f.name + '\')" style="background:var(--gray-50);border:none;border-radius:8px;padding:9px;font-size:13px;font-weight:600;color:var(--gray-400);cursor:pointer;text-align:left">Отстрани пријател</button>';
  div.appendChild(opts);
}

function sendInspire(name, btn) {
  var msg = INSPIRE_MSGS[Math.floor(Math.random() * INSPIRE_MSGS.length)];
  // Show toast
  var t = document.getElementById('xp-toast');
  t.textContent = name + ' ' + msg;
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(function() { t.style.transform = 'translateX(-50%) translateY(-100px)'; }, 3000);
  // Animate button
  if (btn && btn.tagName === 'BUTTON') {
    btn.textContent = 'Испратено! ✓';
    btn.style.background = 'var(--green-light)';
    btn.style.color = '#065F46';
    setTimeout(function() {
      btn.textContent = '✨ Inspire';
      btn.style.background = 'var(--purple-light)';
      btn.style.color = 'var(--purple)';
    }, 2500);
  }
}

function showRemoveConfirm(name) {
  var existing = document.getElementById('remove-confirm-modal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'remove-confirm-modal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:200;max-width:390px;left:50%;transform:translateX(-50%)';
  modal.innerHTML =
      '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.5)" onclick="this.parentElement.remove()"></div>' +
      '<div style="position:absolute;bottom:0;left:0;right:0;background:white;border-radius:20px 20px 0 0;padding:24px 20px 40px">' +
      '<div style="font-size:16px;font-weight:800;margin-bottom:8px">Отстрани пријател?</div>' +
      '<div style="font-size:14px;color:var(--gray-600);margin-bottom:20px">Дали си сигурен дека сакаш да го отстраниш <strong>' + name + '</strong> од пријателите?</div>' +
      '<div style="display:flex;gap:10px">' +
      '<button onclick="this.closest(\'#remove-confirm-modal\').remove()" style="flex:1;padding:12px;border:1.5px solid var(--gray-200);border-radius:8px;background:white;font-size:14px;font-weight:600;cursor:pointer;color:var(--gray-600)">Откажи</button>' +
  '<button onclick="removeFriend(\'' + name + '\');this.closest(\'[id=remove-confirm-modal]\').remove()" style="flex:1;padding:12px;border:none;border-radius:8px;background:#FEE2E2;font-size:14px;font-weight:600;cursor:pointer;color:#991B1B">Отстрани</button>' +
  '</div>' +
  '</div>';
  document.body.appendChild(modal);
}

function addFriendByUsername() {
  var input = document.getElementById('friend-username');
  var username = input.value.trim();
  var msg = document.getElementById('add-friend-msg');
  if (!username) return;

  // Check if already friend
  var exists = friendsList.find(function(f) { return f.name.toLowerCase() === username.toLowerCase(); });
  if (exists) {
    msg.style.display = 'block';
    msg.style.background = '#FEF3C7';
    msg.style.color = '#92400E';
    msg.textContent = username + ' е веќе твој пријател!';
    setTimeout(function() { msg.style.display = 'none'; }, 3000);
    return;
  }
  // Check if in demo feed
  var demo = friendPhotos.find(function(f) { return f.name.toLowerCase() === username.toLowerCase(); });
  if (demo) {
    friendsList.push({emoji: demo.emoji, color: demo.color, name: demo.name, streak: Math.floor(Math.random()*10)+1, quests: Math.floor(Math.random()*20)+5});
    input.value = '';
    msg.style.display = 'block';
    msg.style.background = '#D1FAE5';
    msg.style.color = '#065F46';
    msg.textContent = '✓ ' + username + ' е додаден!';
    setTimeout(function() { msg.style.display = 'none'; }, 3000);
    renderFriendsList();
  } else {
    msg.style.display = 'block';
    msg.style.background = '#FEE2E2';
    msg.style.color = '#991B1B';
    msg.textContent = 'Корисникот "' + username + '" не е пронајден.';
    setTimeout(function() { msg.style.display = 'none'; }, 3000);
  }
}

function removeFriend(name) {
  friendsList = friendsList.filter(function(f) { return f.name !== name; });
  var modal = document.getElementById('remove-confirm-modal');
  if (modal) modal.remove();
  renderFriendsList();
}

function showQR() {
  var modal = document.getElementById('qr-modal');
  modal.style.display = 'block';
  document.getElementById('qr-username-label').textContent = '@' + state.name;
  drawQR(state.name);
}

function drawQR(text) {
  var canvas = document.getElementById('qr-canvas');
  var ctx = canvas.getContext('2d');
  var size = 160;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, size, size);

  // Simple visual QR-like pattern based on username
  var seed = 0;
  for (var i = 0; i < text.length; i++) seed += text.charCodeAt(i);

  var modules = 21;
  var cellSize = Math.floor(size / modules);
  var offset = Math.floor((size - modules * cellSize) / 2);

  // Deterministic pattern from seed
  function pseudoRand(x, y) {
    var n = (x * 31 + y * 17 + seed * 7) % 100;
    return n < 45;
  }

  ctx.fillStyle = '#111827';
  for (var row = 0; row < modules; row++) {
    for (var col = 0; col < modules; col++) {
      // Finder patterns (corners)
      var inFinder =
          (row < 7 && col < 7) ||
          (row < 7 && col >= modules-7) ||
          (row >= modules-7 && col < 7);
      var filled = inFinder ? drawFinderCell(ctx, row, col, modules, cellSize, offset) : pseudoRand(col, row);
      if (!inFinder && filled) {
        ctx.fillRect(offset + col*cellSize, offset + row*cellSize, cellSize-1, cellSize-1);
      }
    }
  }
  // Draw finder patterns properly
  drawFinder(ctx, offset, offset, cellSize);
  drawFinder(ctx, offset + (modules-7)*cellSize, offset, cellSize);
  drawFinder(ctx, offset, offset + (modules-7)*cellSize, cellSize);
}

function drawFinderCell() { return false; }
function drawFinder(ctx, x, y, cs) {
  ctx.fillStyle = '#111827';
  ctx.fillRect(x, y, 7*cs, 7*cs);
  ctx.fillStyle = 'white';
  ctx.fillRect(x+cs, y+cs, 5*cs, 5*cs);
  ctx.fillStyle = '#111827';
  ctx.fillRect(x+2*cs, y+2*cs, 3*cs, 3*cs);
}