// 搜索功能实现 - 适配视频链接资源
function setupSearch() {
  // 处理搜索输入框
  const resourceSearchInput = document.getElementById('resource-search') || document.getElementById('search-input');
  const homeSearchInput = document.getElementById('home-search');
  const globalSearchInput = document.getElementById('global-search');
  const globalSearchButton = document.getElementById('global-search-button');
  const searchButtons = document.querySelectorAll('#search-button, #global-search-button, .search-btn');
  
  // 搜索功能处理函数
  function handleSearch(inputValue) {
    const searchTerm = inputValue.trim().toLowerCase();
    
    // 无论在哪个页面，都跳转到搜索页面并带上搜索参数
    if (searchTerm) {
      window.location.href = '/search/?q=' + encodeURIComponent(searchTerm);
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
  
  // 检查是否在搜索页面
  if (window.location.pathname.includes('/search')) {
    setupSearchPage();
  }
  
  // 在首页添加实时搜索功能
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    setupHomeSearch();
  }
}

// 首页实时搜索功能
function setupHomeSearch() {
  const homeSearchInput = document.getElementById('home-search');
  if (!homeSearchInput) return;
  
  homeSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    performHomeSearch(searchTerm);
  });
}

// 首页实时搜索
function performHomeSearch(searchTerm) {
  const resourceItems = document.querySelectorAll('.video-resource-item');
  let hasResults = false;
  
  resourceItems.forEach(item => {
    const title = item.querySelector('.video-resource-title')?.textContent || '';
    const titleLower = title.toLowerCase();
    
    if (searchTerm === '' || titleLower.includes(searchTerm)) {
      item.style.display = '';
      hasResults = true;
    } else {
      item.style.display = 'none';
    }
  });
  
  // 处理无结果状态
  const noResultsContainer = document.querySelector('.no-search-results');
  if (!hasResults && searchTerm) {
    if (!noResultsContainer) {
      const container = document.querySelector('.video-resource-list');
      if (container) {
        const noResults = document.createElement('div');
        noResults.className = 'no-search-results text-center py-12';
        noResults.innerHTML = `
          <p>未找到与 "${searchTerm}" 相关的视频资源</p>
          <p class="text-gray-500 mt-2">请尝试其他关键词</p>
        `;
        container.appendChild(noResults);
      }
    } else {
      noResultsContainer.style.display = 'block';
    }
  } else if (noResultsContainer) {
    noResultsContainer.style.display = 'none';
  }
}

// 执行搜索 - 适配视频资源
function performSearch(searchTerm) {
  if (!searchTerm) return;
  
  // 获取所有视频资源项
  const resourceItems = document.querySelectorAll('.video-resource-item');
  let hasResults = false;
  
  // 遍历并过滤资源项
  resourceItems.forEach(item => {
    const title = item.querySelector('.video-resource-title')?.textContent || '';
    const titleLower = title.toLowerCase();
    
    // 根据标题内容显示或隐藏项
    if (titleLower.includes(searchTerm)) {
      item.style.display = '';
      hasResults = true;
    } else {
      item.style.display = 'none';
    }
  });
  
  // 显示无结果提示
  updateNoResultsMessage(!hasResults, searchTerm);
}

// 更新无结果消息 - 适配视频资源
function updateNoResultsMessage(show, searchTerm) {
  let noResultsEl = document.querySelector('.no-results');
  
  if (show) {
    if (!noResultsEl) {
      const container = document.querySelector('.video-resource-list') || document.querySelector('.simple-list');
      if (container) {
        noResultsEl = document.createElement('div');
        noResultsEl.className = 'no-results';
        noResultsEl.innerHTML = `
          <div class="text-center py-12 text-gray-500">
            <p>未找到与 "${searchTerm}" 相关的视频资源</p>
            <p class="mt-2">请尝试其他关键词或检查拼写</p>
          </div>
        `;
        container.appendChild(noResultsEl);
      }
    } else {
      noResultsEl.style.display = 'block';
    }
  } else if (noResultsEl) {
    noResultsEl.style.display = 'none';
  }
}

// 设置搜索页面功能
function setupSearchPage() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    const popularTags = document.querySelectorAll('.popular-tag');
    const resultsContainer = document.getElementById('results-container');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // 显示加载状态
                if (resultsContainer) {
                    resultsContainer.innerHTML = '<div class="text-center py-12 text-gray-500">搜索中...</div>';
                }
                
                // 模拟搜索延迟
                setTimeout(() => {
                    // 提取页面中的资源数据
                    const pageResources = extractResourcesFromPage();
                    const searchResults = filterResources(pageResources, searchTerm);
                    displaySearchResults(searchResults, searchTerm);
                }, 300);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // 为热门标签添加点击事件
    popularTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.trim();
            if (searchInput) {
                searchInput.value = tagText;
            }
            
            // 触发搜索
            if (searchBtn) {
                searchBtn.click();
            }
        });
    });
}

// 从页面提取视频资源数据
function extractResourcesFromPage() {
    const resources = [];
    
    // 从页面元素提取数据 - 适配视频资源
    const videoItems = document.querySelectorAll('.video-resource-item');
    
    videoItems.forEach(item => {
        const titleElement = item.querySelector('.video-resource-title');
        const statusElement = item.querySelector('.video-resource-status');
        const urlElement = item.querySelector('a[href]');
        
        if (titleElement) {
            const resource = {
                title: titleElement.textContent.trim(),
                type: '视频', // 所有资源都默认为视频类型
                status: statusElement ? statusElement.textContent.trim() : '未知',
                url: urlElement ? urlElement.getAttribute('href') : '#'
            };
            resources.push(resource);
        }
    });
    
    // 如果页面上没有足够的数据，使用视频资源模拟数据
    if (resources.length === 0) {
        return [
            { title: '唐朝诡事录3', type: '视频', status: '完结', url: '#' },
            { title: '四喜', type: '视频', status: '完结', url: '#' },
            { title: '繁花', type: '视频', status: '完结', url: '#' },
            { title: '熊出没·逆转时空', type: '视频', status: '完结', url: '#' },
            { title: '奔跑吧兄弟', type: '视频', status: '更新中', url: '#' },
            { title: '鬼灭之刃', type: '视频', status: '完结', url: '#' },
            { title: '流浪地球3', type: '视频', status: '完结', url: '#' },
            { title: '王牌对王牌', type: '视频', status: '更新中', url: '#' },
            { title: '庆余年2', type: '视频', status: '完结', url: '#' },
            { title: '年会不能停！', type: '视频', status: '完结', url: '#' },
            { title: '画江湖之天罡', type: '视频', status: '完结', url: '#' },
            { title: '哈哈哈哈哈', type: '视频', status: '更新中', url: '#' }
        ];
    }
    
    return resources;
}

// 根据查询过滤资源
function filterResources(resources, query) {
    const lowercaseQuery = query.toLowerCase();
    return resources.filter(resource => 
        resource.title.toLowerCase().includes(lowercaseQuery) ||
        resource.type.toLowerCase().includes(lowercaseQuery)
    );
}

// 显示搜索结果 - 适配视频资源
function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('results-container');
    
    if (!resultsContainer) return;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                未找到与 "${query}" 相关的视频资源
                <p class="mt-2">请尝试其他关键词或检查拼写</p>
            </div>
        `;
        return;
    }
    
    // 使用与首页一致的视频资源卡片样式
    let html = `
        <div class="video-resource-list">
    `;
    
    results.forEach(resource => {
        // 生成模拟的链接数据
        const links = [
            { name: '百度网盘', url: '#', password: '1234' },
            { name: '夸克网盘', url: '#', password: '5678' }
        ];
        
        // 根据状态设置颜色类
        let statusColorClass = resource.status === '更新中' ? 'bg-green-500' : 'bg-blue-500';
        
        html += `
            <div class="video-resource-item">
                <div class="video-resource-header">
                    <h3 class="video-resource-title">${resource.title}</h3>
                    <span class="video-resource-status ${statusColorClass}">${resource.status}</span>
                </div>
                <div class="video-links-wrapper">
        `;
        
        // 添加链接
        links.forEach((link, index) => {
            html += `
                <div class="video-link-item">
                    <button class="video-link-btn" onclick="toggleLinkDetails(this)">
                        <div class="video-platform-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                            </svg>
                        </div>
                        <span class="video-link-text">${link.name}</span>
                    </button>
                    <div class="video-link-details">
                        <span class="link-url">${link.url} 提取码: ${link.password}</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
    `;
    
    resultsContainer.innerHTML = html;
}

// 切换链接详情显示
function toggleLinkDetails(button) {
    const details = button.nextElementSibling;
    if (details) {
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
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
    
    // 处理URL参数中的搜索词
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    if (searchQuery) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = searchQuery;
            // 自动触发搜索
            const searchButton = document.getElementById('search-button') || document.querySelector('.search-btn');
            if (searchButton) {
                setTimeout(() => searchButton.click(), 300);
            }
        }
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

// 页面加载完成后初始化 - 适配视频资源
window.addEventListener('DOMContentLoaded', function() {
  setupSearch();
  setupMobileMenu();
  initMobileOptimizations();
  
  // 初始化链接详情切换功能
  document.querySelectorAll('.video-link-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      toggleLinkDetails(this);
    });
  });
});
