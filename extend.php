<?php

namespace HuseyinFiliz\SortChanger;

use Flarum\Extend;
use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),
    
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),
    
    new Extend\Locales(__DIR__.'/locale'),
    
    // Varsayılan sıralama ayarını forum'a gönder
    (new Extend\Settings())
        ->serializeToForum('sortChangerDefaultSort', 'huseyinfiliz-sort-changer.default_sort', 'strval', 'latest'),
    
    // Backend'de varsayılan sıralamayı uygula
    (new Extend\ApiController(ListDiscussionsController::class))
        ->prepareDataQuery(function ($controller) {
            $settings = resolve(SettingsRepositoryInterface::class);
            $defaultSort = $settings->get('huseyinfiliz-sort-changer.default_sort', 'latest');
            
            // Request'ten sort parametresini kontrol et
            $requestSort = Arr::get($controller->data, 'sort');
            
            // Eğer sort yoksa ve varsayılan ayar varsa
            if (!$requestSort && !$controller->sort && $defaultSort !== 'latest') {
                switch ($defaultSort) {
                    case 'top':
                        $controller->setSort(['commentCount' => 'desc']);
                        break;
                    case 'newest':
                        $controller->setSort(['createdAt' => 'desc']);
                        break;
                    case 'oldest':
                        $controller->setSort(['createdAt' => 'asc']);
                        break;
                    default:
                        $controller->setSort(['lastPostedAt' => 'desc']);
                }
            }
        })
];