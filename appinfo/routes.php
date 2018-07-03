<?php
return [
    'resources' => [
        'document' => ['url' => '/documents'],
    ],
    'routes' => [
        ['name' => 'organisation#index', 'url' => '/organisations', 'verb' => 'GET'],
        ['name' => 'document#load', 'url' => '/load', 'verb' => 'POST'],
        ['name' => 'document#load', 'url' => '/load', 'verb' => 'POST'],
        ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
    ]
];