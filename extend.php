<?php

namespace HuseyinFiliz\SortChanger;

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),
    
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),
    
    new Extend\Locales(__DIR__.'/locale'),
    
    (new Extend\Settings())
        ->serializeToForum('sortChangerDefaultSort', 'huseyinfiliz-sort-changer.default_sort', 'strval', 'latest'),
];