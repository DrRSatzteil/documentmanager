<?php

namespace OCA\DocumentManager\Controller;

use Closure;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;

use OCA\DocumentManager\Service\DocumentNotFound;


trait Errors {

    protected function handleNotFound (Closure $callback): DataResponse {
        try {
            return new DataResponse($callback());
        } catch(DocumentNotFound $e) {
            $message = ['message' => $e->getMessage()];
            return new DataResponse($message, Http::STATUS_NOT_FOUND);
        }
    }

}