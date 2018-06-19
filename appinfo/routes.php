<?php
return [
    'resources' => [
        'document' => ['url' => '/documents'],
        'document_api' => ['url' => '/api/0.1/documents']
    ],
    'routes' => [
        ['name' => 'document#load', 'url' => '/load', 'verb' => 'POST'],
        ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
        ['name' => 'document_api#preflighted_cors', 'url' => '/api/0.1/{path}',
         'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']]
    ]
];