// 浮动标签式TOC + 回到顶部
(function() {
  // 检查是否在文章页
  const isPostPage = document.body.classList.contains('post-type') || 
                     document.querySelector('.post-type') ||
                     window.location.pathname.match(/\/posts\/.+\/$/);
  
  if (!isPostPage) {
    return;
  }
  
  const articleContent = document.querySelector('.article-entry');
  const tocContent = document.querySelector('#TableOfContents');
  
  if (!articleContent || !tocContent) {
    return;
  }
  
  // 创建浮动TOC容器 - 标签式
  const tocFloat = document.createElement('div');
  tocFloat.className = 'toc-float-container';
  tocFloat.innerHTML = `
    <div class="toc-toggle-btn">目录</div>
    <div class="toc-float-content">
      <h3>目录</h3>
      ${tocContent.innerHTML}
    </div>
    <div class="back-to-top-custom"></div>
  `;
  
  document.body.appendChild(tocFloat);
  
  // 点击标签展开/收起
  const toggleBtn = tocFloat.querySelector('.toc-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      tocFloat.classList.toggle('expanded');
    });
  }
  
  // 点击目录内容区域不会关闭
  const tocContentEl = tocFloat.querySelector('.toc-float-content');
  if (tocContentEl) {
    tocContentEl.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  // 点击目录链接后自动收起
  const tocLinks = tocFloat.querySelectorAll('.toc-float-content a');
  tocLinks.forEach(link => {
    link.addEventListener('click', function() {
      tocFloat.classList.remove('expanded');
    });
  });
  
  // 点击页面其他地方收起目录
  document.addEventListener('click', function(e) {
    if (tocFloat.classList.contains('expanded')) {
      const isClickInsideToc = tocFloat.contains(e.target);
      if (!isClickInsideToc) {
        tocFloat.classList.remove('expanded');
      }
    }
  });
  
  // 按ESC键收起目录
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && tocFloat.classList.contains('expanded')) {
      tocFloat.classList.remove('expanded');
    }
  });
  
  // 回到顶部功能
  const backToTop = tocFloat.querySelector('.back-to-top-custom');
  if (backToTop) {
    backToTop.addEventListener('click', function(e) {
      e.stopPropagation();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // 滚动监听 - 高亮当前章节
  const headings = document.querySelectorAll('.article-entry h1, .article-entry h2, .article-entry h3, .article-entry h4, .article-entry h5, .article-entry h6');
  
  if (headings.length === 0) {
    return;
  }
  
  function updateActiveToc() {
    let currentHeading = null;
    
    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 100) {
        currentHeading = heading;
      }
    });
    
    // 移除所有active
    tocFloat.querySelectorAll('.active').forEach(el => {
      el.classList.remove('active');
    });
    
    // 添加当前的active
    if (currentHeading && currentHeading.id) {
      const activeLink = tocFloat.querySelector(`a[href="#${currentHeading.id}"]`);
      if (activeLink) {
        activeLink.parentElement.classList.add('active');
      }
    }
  }
  
  // 节流函数
  function throttle(func, wait) {
    let timeout;
    return function() {
      if (!timeout) {
        timeout = setTimeout(() => {
          func.apply(this, arguments);
          timeout = null;
        }, wait);
      }
    };
  }
  
  window.addEventListener('scroll', throttle(updateActiveToc, 100));
  updateActiveToc();
  
})();