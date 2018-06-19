<?php

namespace OCA\DocumentManager\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\DocumentManager\Service\DocumentService;
use OCA\DocumentManager\Service\File\FileService;

class DocumentController extends Controller {
    
    /** @var DocumentService */
    private $documentService;
    
    /** @var FileService */
    private $fileService;

    /** @var string */
    private $userId;

    use Errors;

    public function __construct($appName,
                                IRequest $request,
                                DocumentService $documentService,
                                FileService $fileService,
                                $userId) {
        parent::__construct($appName, $request);
        $this->documentService = $documentService;
        $this->fileService = $fileService;
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
    public function create(string $title, string $organisation): DataResponse {
        return new DataResponse($this->documentService->create($title, $organisation,
            $this->userId));
    }

    /**
     * @NoAdminRequired
     */
    public function update(int $id, string $title,
                           string $organisation): DataResponse {
        return $this->handleNotFound(function () use ($id, $title, $organisation) {
            return $this->documentService->update($id, $title, $organisation, $this->userId);
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
        return new DataResponse($this->fileService->loadDocuments($path));
    }

}
