/* ============================================================
   小王个人简介网站 · 交互脚本 main.js
   功能：深色模式切换 / 导航栏滚动显隐 / 返回顶部 /
        技能进度条动画 / 当前区块导航高亮
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 深色模式切换 ---------- */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      document.body.classList.toggle('dark');
      themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });
  }

  /* ---------- 技能进度条动画 ---------- */
  function animateSkillBars() {
    var bars = document.querySelectorAll('.skill-bar-inner');
    bars.forEach(function (bar) {
      var width = bar.getAttribute('data-width');
      if (width) {
        bar.style.width = width + '%';
      }
    });
  }

  /* ---------- 滚动监听：导航隐藏 / 返回顶部 / 区块高亮 ---------- */
  var navbar = document.getElementById('navbar');
  var backTop = document.getElementById('backTop');
  var navLinks = document.querySelectorAll('.nav-menu a[data-section]');
  var lastScroll = 0;
  var animated = false;

  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset;

    // 导航栏滚动隐藏（仅在索引页有导航锚点时生效）
    if (navbar && currentScroll > lastScroll && currentScroll > 120) {
      navbar.classList.add('hidden');
    } else if (navbar) {
      navbar.classList.remove('hidden');
    }
    lastScroll = currentScroll;

    // 返回顶部按钮
    if (backTop) {
      if (currentScroll > 300) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    }

    // 技能条动画：滚动到技能区块时触发一次
    if (!animated) {
      var skills = document.getElementById('skills');
      if (skills && skills.getBoundingClientRect().top < window.innerHeight * 0.9) {
        animateSkillBars();
        animated = true;
      }
    }

    // 导航高亮
    if (navLinks.length > 0) {
      updateActiveNav(currentScroll);
    }
  });

  function updateActiveNav(scrollPos) {
    var sections = [];
    navLinks.forEach(function (link) {
      sections.push(link.getAttribute('data-section'));
    });
    var pos = scrollPos + 140;
    var current = sections[0];
    for (var i = sections.length - 1; i >= 0; i--) {
      var el = document.getElementById(sections[i]);
      if (el && el.offsetTop <= pos) {
        current = sections[i];
        break;
      }
    }
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-section') === current);
    });
  }

  /* ---------- 返回顶部 ---------- */
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 页面载入后立即触发一次（技能条动画 / 高亮） ---------- */
  window.addEventListener('load', function () {
    var skills = document.getElementById('skills');
    if (skills && skills.getBoundingClientRect().top < window.innerHeight * 0.9) {
      animateSkillBars();
      animated = true;
    }
  });

  /* 兜底：若滚动事件未触发（内容不足一屏），延迟执行进度条动画 */
  setTimeout(function () {
    if (!animated) {
      animateSkillBars();
      animated = true;
    }
  }, 600);
})();
