<?php

namespace OCA\DocumentManager\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\DocumentManager\Service\DocumentService;
use OCA\DocumentManager\Service\DiscoveryService;

class DocumentController extends Controller {
    
    /** @var DocumentService */
    private $documentService;
    
    /** @var DiscoveryService */
    private $discoveryService;

    /** @var string */
    private $userId;

    use Errors;

	
    public function __construct($appName,
                                IRequest $request,
                                DocumentService $documentService,
                                DiscoveryService $discoveryService,
                                $userId) {
        parent::__construct($appName, $request);
        $this->documentService = $documentService;
        $this->discoveryService = $discoveryService;
        $this->userId = $userId;
    }

    /**
     * @NoAdminRequired
     */
    public function index(): DataResponse {
        return new DataResponse($this->documentService->findAll($this->userId));
    }

    /**
     * @NoAdminRequired
     */
    public function show(int $id): DataResponse {
        return $this->handleNotFound(function () use ($id) {
            return $this->documentService->find($id, $this->userId);
        });
    }
    
    /**
     * @NoAdminRequired
     */
	public function update(int $id, int $fileId, string $title, 
		int $organisationId, \DateTime $creationDate, int $status): DataResponse {
			return $this->handleNotFound(function () use ($id, $fileId, $title, 
			$organisationId, $creationDate, $status) {
				return $this->documentService->update($id, $fileId, $title, $this->userId, 
					$organisationId, $creationDate, $status);
		});
	}

    /**
     * @NoAdminRequired
     */
    public function destroy(int $id): DataResponse {
        return $this->handleNotFound(function () use ($id) {
            return $this->documentService->delete($id, $this->userId);
        });
    }
    
    /**
     * @NoAdminRequired
     */
    public function load(string $path): DataResponse {
    	return $this->handleNotFound(function () use ($path) {
            return $this->discoveryService->discoverDocuments($path);
        });
    }
    
    /**
     * @NoAdminRequired
     */
    public function analyze(int $id): DataResponse {
    	return $this->handleNotFound(function () use ($id) {
            return $this->discoveryService->analyzeDocument($id);
        });
    }
}
