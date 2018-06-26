<?php
return [
    'resources' => [
        'document' => ['url' => '/documents'],
    ],
    'routes' => [
        ['name' => 'document#load', 'url' => '/load', 'verb' => 'POST'],
        ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
    ]
];