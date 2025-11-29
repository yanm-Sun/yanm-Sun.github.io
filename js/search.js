// 搜索功能实现 - 三级标题搜索功能

// 添加搜索结果模态框样式
function addSearchModalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* 搜索结果模态框样式 */
    .search-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .search-modal-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 800px;
      max-height: 80vh;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .search-modal-header {
      padding: 16px 24px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .search-modal-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    
    .search-modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
    
    .search-modal-close:hover {
      background-color: #f5f5f5;
    }
    
    .search-modal-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }
    
    .search-results {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .search-result-group {
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .search-result-group-header {
      padding: 12px 16px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e5e5e5;
      font-weight: 600;
      font-size: 16px;
    }
    
    .search-result-item {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .search-result-item:last-child {
      border-bottom: none;
    }
    
    .search-result-heading {
      font-weight: 500;
      font-size: 16px;
      margin: 0 0 8px 0;
      color: #333;
    }
    
    .search-result-content {
      color: #666;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-word;
    }
    
    .search-result-link {
      color: #1a73e8;
      text-decoration: none;
      font-size: 14px;
      margin-top: 8px;
      display: inline-block;
    }
    
    .search-result-link:hover {
      text-decoration: underline;
    }
    
    .no-search-results {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }
    
    .search-highlight {
      background-color: #ffeb3b;
      padding: 0 2px;
      font-weight: 500;
    }
    
    /* 响应式设计 */
    @media (max-width: 768px) {
      .search-modal-content {
        width: 95%;
        max-height: 90vh;
      }
      
      .search-modal-body {
        padding: 16px;
      }
    }
    
    /* 链接格式化 */
    .search-result-content a {
      color: #1a73e8;
      text-decoration: none;
    }
    
    .search-result-content a:hover {
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);
}

// 创建搜索结果模态框
function createSearchModal() {
  const modal = document.createElement('div');
  modal.className = 'search-modal';
  modal.id = 'search-results-modal';
  
  modal.innerHTML = `
    <div class="search-modal-content">
      <div class="search-modal-header">
        <h3 class="search-modal-title">搜索结果</h3>
        <button class="search-modal-close" onclick="closeSearchModal()">&times;</button>
      </div>
      <div class="search-modal-body">
        <div id="search-results-container" class="search-results">
          <!-- 搜索结果将在这里显示 -->
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 添加遮罩层点击关闭功能
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeSearchModal();
    }
  });
}

// 打开搜索模态框
function openSearchModal() {
  const modal = document.getElementById('search-results-modal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
  }
}

// 关闭搜索模态框
function closeSearchModal() {
  const modal = document.getElementById('search-results-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // 恢复背景滚动
  }
}

// 高亮搜索关键词
function highlightText(text, keyword) {
  if (!keyword) return text;
  
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// 转换Markdown格式为HTML
function convertMarkdownToHtml(text) {
  // 转换链接
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // 转换列表项
  text = text.replace(/^\*\s+/gm, '• ');
  
  // 转换换行符
  text = text.replace(/\n/g, '<br>');
  
  return text;
}

// 执行搜索 - 从resources_index.json搜索三级标题
async function performSearch(searchTerm) {
  if (!searchTerm) return;
  
  const indexFile = '/data/resources_index.json';
  console.log('开始搜索，搜索词:', searchTerm);
  console.log('尝试加载索引文件:', indexFile);
  
  try {
    // 显示加载状态
    const resultsContainer = document.getElementById('search-results-container');
    if (resultsContainer) {
      resultsContainer.innerHTML = '<div class="no-search-results">搜索中...</div>';
    }
    
    // 从JSON文件获取数据
    console.log('正在发送fetch请求...');
    const response = await fetch(indexFile);
    console.log('fetch请求完成，状态码:', response.status);
    
    if (!response.ok) {
      const errorMsg = `无法获取搜索索引，状态码: ${response.status}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('开始解析JSON数据...');
    const data = await response.json();
    console.log('JSON解析完成，数据结构:', data);
    const resources = data.resources || [];
    console.log('找到资源数量:', resources.length);
    
    // 搜索结果
    const searchResults = {};
    let hasResults = false;
    
    // 遍历所有资源
    resources.forEach(resource => {
      const resourceResults = [];
      console.log('检查资源:', resource.title);
      
      // 遍历三级标题
      if (resource.third_level_headings && resource.third_level_headings.length > 0) {
        console.log('资源包含三级标题数量:', resource.third_level_headings.length);
        resource.third_level_headings.forEach((heading, index) => {
          const headingLower = heading.title.toLowerCase();
          const contentLower = heading.content.toLowerCase();
          const searchTermLower = searchTerm.toLowerCase();
          
          // 如果标题或内容中包含搜索词
          if (headingLower.includes(searchTermLower) || contentLower.includes(searchTermLower)) {
            console.log('找到匹配:', heading.title);
            hasResults = true;
            resourceResults.push({
              heading: heading,
              index: index
            });
          }
        });
      }
      
      // 如果该资源有匹配结果，添加到结果集
      if (resourceResults.length > 0) {
        searchResults[resource.title] = {
          resource: resource,
          results: resourceResults
        };
      }
    });
    
    // 显示搜索结果
    if (resultsContainer) {
      if (!hasResults) {
        resultsContainer.innerHTML = `
          <div class="no-search-results">
            <p>未找到与 "${searchTerm}" 相关的内容</p>
            <p>请尝试其他关键词</p>
          </div>
        `;
      } else {
        // 按标题排序
        const sortedKeys = Object.keys(searchResults).sort();
        let html = '';
        
        sortedKeys.forEach(title => {
          const group = searchResults[title];
          
          // 按标题索引排序
          group.results.sort((a, b) => a.index - b.index);
          
          html += `
            <div class="search-result-group">
              <div class="search-result-group-header">
                ${highlightText(group.resource.title, searchTerm)}
                <span style="font-weight: normal; color: #666; margin-left: 8px;">(${group.resource.type})</span>
              </div>
          `;
          
          group.results.forEach(item => {
            const heading = item.heading;
            const highlightedTitle = highlightText(heading.title, searchTerm);
            const highlightedContent = highlightText(convertMarkdownToHtml(heading.content), searchTerm);
            
            html += `
              <div class="search-result-item">
                <h4 class="search-result-heading">${highlightedTitle}</h4>
                <div class="search-result-content">${highlightedContent}</div>
                ${group.resource.url ? `<a href="${group.resource.url}" target="_blank" class="search-result-link">查看原文</a>` : ''}
              </div>
            `;
          });
          
          html += `</div>`;
        });
        
        resultsContainer.innerHTML = html;
      }
    }
    
    // 打开搜索结果模态框
    openSearchModal();
    
  } catch (error) {
    console.error('搜索出错:', error);
    const resultsContainer = document.getElementById('search-results-container');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="no-search-results">
          <p>搜索过程中出现错误</p>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
}

// 设置搜索功能
function setupSearch() {
  // 添加模态框样式和创建模态框
  addSearchModalStyles();
  createSearchModal();
  
  // 处理搜索输入框
  const resourceSearchInput = document.getElementById('resource-search') || document.getElementById('search-input');
  const homeSearchInput = document.getElementById('home-search');
  const globalSearchInput = document.getElementById('global-search');
  const globalSearchButton = document.getElementById('global-search-button');
  const searchButtons = document.querySelectorAll('#search-button, #global-search-button, .search-btn');
  
  // 搜索功能处理函数
  function handleSearch(inputValue) {
    const searchTerm = inputValue.trim();
    if (searchTerm) {
      performSearch(searchTerm);
    }
  }
  
  // 为所有搜索按钮添加事件
  searchButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 优先使用globalSearchInput，然后是homeSearchInput，最后是resourceSearchInput
      const input = globalSearchInput || homeSearchInput || resourceSearchInput;
      if (input) {
        handleSearch(input.value);
      }
    });
  });
  
  // 为搜索输入框添加回车事件
  if (resourceSearchInput) {
    resourceSearchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSearch(this.value);
      }
    });
  }
  
  if (homeSearchInput) {
    homeSearchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSearch(this.value);
      }
    });
  }
  
  if (globalSearchInput) {
    globalSearchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSearch(this.value);
      }
    });
  }
  
  // 处理URL参数中的搜索词
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('q');
  if (searchQuery) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = searchQuery;
      // 自动触发搜索
      setTimeout(() => performSearch(searchQuery), 300);
    }
  }
}

// 移动端菜单切换
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const header = document.querySelector('header');
  
  if (!menuToggle || !navLinks) return;
  
  // 菜单切换函数
  function toggleMenu() {
    navLinks.classList.toggle('active');
    // 切换菜单图标
    menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    
    // 禁止页面滚动当菜单打开时
    if (navLinks.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
      // 添加一个半透明遮罩
      const overlay = document.createElement('div');
      overlay.className = 'menu-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '60px';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = '998';
      document.body.appendChild(overlay);
      
      // 确保菜单在遮罩层之上
      navLinks.style.zIndex = '999';
      
      // 点击遮罩关闭菜单
      overlay.addEventListener('click', function() {
        closeMenu();
      });
    } else {
      document.body.style.overflow = '';
      const overlay = document.querySelector('.menu-overlay');
      if (overlay) {
        overlay.remove();
      }
    }
  }
  
  function closeMenu() {
    navLinks.classList.remove('active');
    menuToggle.textContent = '☰';
    document.body.style.overflow = '';
    const overlay = document.querySelector('.menu-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
  
  // 添加点击事件
  menuToggle.addEventListener('click', toggleMenu);
  
  // 点击链接后关闭菜单
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });
  
  // 处理屏幕旋转事件
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

// 初始化移动端优化
function initMobileOptimizations() {
  // 延迟加载图片（如果有）
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  }
  
  // 优化触摸事件
  optimizeTouchEvents();
}

// 优化触摸事件
function optimizeTouchEvents() {
  // 为所有可点击元素添加适当的触摸处理
  const clickableElements = document.querySelectorAll('a, button, .resource-link, .global-search-btn');
  clickableElements.forEach(element => {
    // 避免双击缩放
    element.addEventListener('touchstart', function(e) {
      this.style.transition = 'background-color 0.1s';
    }, { passive: true });
    
    element.addEventListener('touchend', function() {
      this.style.transition = '';
    }, { passive: true });
  });
  
  // 特别为搜索框添加触摸优化
  const searchInputs = document.querySelectorAll('.global-search-input, .search-input');
  searchInputs.forEach(input => {
    // 确保在移动设备上可以正常获取焦点
    input.addEventListener('touchstart', function(e) {
      // 修复某些移动设备上的点击延迟
      e.stopPropagation();
    }, { passive: true });
  });
}

// 暴露函数到全局作用域
window.closeSearchModal = closeSearchModal;

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
  setupSearch();
  setupMobileMenu();
  initMobileOptimizations();
});
