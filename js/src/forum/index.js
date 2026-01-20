import { extend, override } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';

app.initializers.add('huseyinfiliz-sort-changer', () => {
  const apiSortMap = {
    'latest': '-lastPostedAt',
    'oldest': 'createdAt',
    'newest': '-createdAt',
    'top': '-commentCount'
  };
  
  const sortIndexMap = { 'latest': 0, 'top': 1, 'newest': 2, 'oldest': 3 };
  
  function isIndexPage() {
    const routeName = app.current.get('routeName');
    return routeName === 'index' || routeName === 'default';
  }
  
  function getDefaultSort() {
    return app.forum.attribute('sortChangerDefaultSort');
  }
  
  // Sort map'i genişlet - latest'i ekle
  override(DiscussionListState.prototype, 'sortMap', function(original) {
    const map = original();
    map['latest'] = '-lastPostedAt';
    return map;
  });
  
  // Dropdown'da doğru değeri göster
  override(DiscussionListState.prototype, 'sortValue', function(original) {
    if (!isIndexPage()) return original();
    
    const currentSort = this.params.sort;
    if (currentSort) return currentSort;
    
    const defaultSort = getDefaultSort();
    if (defaultSort && defaultSort !== 'latest') return defaultSort;
    
    return original();
  });
  
  // API çağrısında sort parametresi
  override(DiscussionListState.prototype, 'requestParams', function(original) {
    const params = original();
    if (!isIndexPage()) return params;
    
    const defaultSort = getDefaultSort();
    const currentSort = this.params.sort;
    
    if (currentSort && apiSortMap[currentSort]) {
      params.sort = apiSortMap[currentSort];
    } else if (defaultSort && defaultSort !== 'latest') {
      params.sort = apiSortMap[defaultSort];
    }
    
    return params;
  });
  
  // Dropdown'u DOM ile güncelle
  function updateDropdown(activeSort) {
    if (!isIndexPage()) return;
    
    if (!activeSort) {
      const currentSort = m.route.param('sort');
      activeSort = currentSort || getDefaultSort();
    }
    
    if (!activeSort || activeSort === 'latest') return;
    
    const targetIndex = sortIndexMap[activeSort];
    if (targetIndex === undefined) return;
    
    const dropdownToggle = document.querySelector('.IndexPage-toolbar .Dropdown-toggle .Button-label');
    const dropdownMenu = document.querySelector('.IndexPage-toolbar .Dropdown-menu');
    
    if (!dropdownToggle || !dropdownMenu) return;
    
    const listItems = dropdownMenu.querySelectorAll('li');
    const targetButton = listItems[targetIndex]?.querySelector('button');
    
    if (targetButton) {
      const targetLabel = targetButton.querySelector('.Button-label');
      if (targetLabel) {
        dropdownToggle.textContent = targetLabel.textContent;
      }
    }
    
    listItems.forEach((li, index) => {
      const button = li.querySelector('button');
      const icon = li.querySelector('.Button-icon');
      
      if (index === targetIndex) {
        if (button) button.setAttribute('active', '');
        if (icon) icon.classList.add('fas', 'fa-check');
      } else {
        if (button) button.removeAttribute('active');
        if (icon) icon.classList.remove('fas', 'fa-check');
      }
    });
  }
  
  // Liste görünürlüğü
  function setListVisibility(ready) {
    const container = document.querySelector('.IndexPage-results');
    if (!container) return;
    
    container.classList.toggle('DiscussionList--loading-sort', !ready);
    container.classList.toggle('DiscussionList--ready', ready);
  }
  
  let initialLoad = true;
  
  // Anasayfa linklerine tıklandığında dropdown'u güncelle
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    const baseUrl = app.forum.attribute('baseUrl');
    const defaultSort = getDefaultSort();
    
    const isHomeLink = href === '/' || 
                       href === baseUrl || 
                       href === baseUrl + '/' ||
                       link.closest('.Header-logo');
    
    if (isHomeLink && defaultSort && defaultSort !== 'latest') {
      requestAnimationFrame(() => updateDropdown(defaultSort));
    }
  }, true);
  
  // Index sayfası kontrolü
  function shouldHandle() {
    const routeName = app.current.get('routeName');
    if (routeName !== 'index' && routeName !== 'default') return false;
    if (m.route.param('tags') || m.route.param('q') || m.route.param('filter')) return false;
    return true;
  }
  
  // Parametresiz gelince varsayılana yönlendir
  extend(IndexPage.prototype, 'oninit', function() {
    if (!shouldHandle()) return;
    
    const defaultSort = getDefaultSort();
    const currentSort = m.route.param('sort');
    
    if (!currentSort && defaultSort && defaultSort !== 'latest') {
      const url = new URL(window.location.href);
      url.searchParams.set('sort', defaultSort);
      window.history.replaceState(null, '', url.toString());
      
      if (app.discussions) {
        app.discussions.params.sort = defaultSort;
        
        if (initialLoad) {
          initialLoad = false;
          requestAnimationFrame(() => setListVisibility(false));
          
          app.discussions.clear();
          app.discussions.refresh().then(() => {
            setListVisibility(true);
            m.redraw();
          });
        }
      }
    }
  });
  
  // Dropdown güncelleme
  extend(IndexPage.prototype, 'oncreate', function() {
    if (!shouldHandle()) return;
    
    const defaultSort = getDefaultSort();
    const currentSort = m.route.param('sort');
    
    if (!currentSort && defaultSort && defaultSort !== 'latest') {
      requestAnimationFrame(() => updateDropdown(defaultSort));
    }
    
    setTimeout(updateDropdown, 100);
  });
  
  extend(IndexPage.prototype, 'onupdate', function() {
    if (!shouldHandle()) return;
    requestAnimationFrame(updateDropdown);
  });
  
  // Latest butonuna tıklandığında ?sort=latest ekle
  document.addEventListener('click', (e) => {
    if (!isIndexPage()) return;
    
    const dropdownButton = e.target.closest('.Dropdown-menu button');
    if (!dropdownButton) return;
    
    const dropdownMenu = dropdownButton.closest('.Dropdown-menu');
    if (!dropdownMenu) return;
    
    const allButtons = dropdownMenu.querySelectorAll('button');
    const buttonIndex = Array.from(allButtons).indexOf(dropdownButton);
    
    if (buttonIndex === 0) {
      const defaultSort = getDefaultSort();
      
      if (defaultSort && defaultSort !== 'latest') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        m.route.set(app.route('index', { sort: 'latest' }));
        return false;
      }
    }
  }, true);
});