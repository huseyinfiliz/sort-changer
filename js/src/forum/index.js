import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';

app.initializers.add('huseyinfiliz-sort-changer', () => {
  console.log('[SortChanger] Uzantı başlatıldı');
  let wasOnIndex = false;
  
  extend(IndexPage.prototype, 'oninit', function(vnode) {
    // Tag veya arama parametresi varsa çık
    if (m.route.param('tags') || m.route.param('q')) {
      return;
    }
    
    const defaultSort = app.forum.attribute('sortChangerDefaultSort');
    const currentSort = m.route.param('sort');
    
    // İlk yüklemede varsayılan sıralama parametresi varsa temizle
    if (currentSort === defaultSort && !wasOnIndex) {
      // URL'den sort parametresini temizle
      const params = Object.assign({}, m.route.param() || {});
      delete params.sort;
      delete params.key;
      
      // URL'i temizle (sıralama zaten uygulanmış durumda)
      window.history.replaceState(null, '', app.route('index', params));
    }
    // Sort parametresi yoksa ve varsayılan ayar varsa
    else if (!wasOnIndex && !currentSort && defaultSort && defaultSort !== 'latest') {
      const params = Object.assign({}, m.route.param() || {});
      delete params.key;
      params.sort = defaultSort;
      
      setTimeout(() => {
        m.route.set(app.route('index', params), true, { replace: true });
        
        // Hemen URL'i temizle (varsayılan olduğu için)
        setTimeout(() => {
          window.history.replaceState(null, '', app.route('index', {}));
        }, 50);
      }, 0);
    }
    
    wasOnIndex = true;
  });
  
  extend(IndexPage.prototype, 'onremove', function() {
    wasOnIndex = false;
  });
  
  // Dropdown'daki Latest butonunu değiştir
  extend(IndexPage.prototype, 'oncreate', function(vnode) {
    // Tag veya arama parametresi varsa çık
    if (m.route.param('tags') || m.route.param('q')) {
      return;
    }
    
    const defaultSort = app.forum.attribute('sortChangerDefaultSort');
    
    console.log('[SortChanger] oncreate - Dropdown aranıyor...');
    
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkAndModify = () => {
      attempts++;
      
      let dropdownMenu = document.querySelector('.item-sort .Dropdown-menu');
      if (!dropdownMenu) {
        dropdownMenu = document.querySelector('.Dropdown-menu');
      }
      
      if (dropdownMenu) {
        const buttons = dropdownMenu.querySelectorAll('li button');
        
        buttons.forEach((button) => {
          const label = button.querySelector('.Button-label');
          const labelText = label ? label.textContent.trim() : '';
          
          if (labelText === 'Latest') {
            button.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              console.log('[SortChanger] Latest tıklandı!');
              
              // Eğer latest varsayılan ise URL'e ekleme
              if (defaultSort === 'latest') {
                // Sadece sıralamayı değiştir, URL'e ekleme
                if (app.discussions) {
                  app.discussions.refreshParams({sort: ''});
                  app.discussions.refresh();
                }
              } else {
                // Latest varsayılan değilse URL'e ekle
                const params = Object.assign({}, m.route.param() || {});
                delete params.key;
                params.sort = 'latest';
                
                m.route.set(app.route('index', params));
                
                if (app.discussions) {
                  app.discussions.refreshParams({sort: ''});
                  app.discussions.refresh();
                }
              }
              
              // Dropdown'u kapat
              const dropdown = button.closest('.Dropdown');
              if (dropdown) {
                dropdown.classList.remove('open');
              }
            };
            
            console.log('[SortChanger] Latest butonu güncellendi!');
          }
        });
      } else if (attempts < maxAttempts) {
        setTimeout(checkAndModify, 500);
      }
    };
    
    setTimeout(checkAndModify, 500);
  });
});