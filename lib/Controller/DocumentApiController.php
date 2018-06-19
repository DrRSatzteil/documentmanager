<?php

namespace OCA\DocumentManager\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\ApiController;

use OCA\DocumentManager\Service\DocumentService;

class DocumentApiController extends ApiController {
    /** @var DocumentService */
    private $service;

    /** @var string */
    private $userId;

    use Errors;

    public function __construct($appName,
                                IRequest $request,
                                DocumentService $service,
                                $userId) {
        parent::__construct($appName, $request);
        $this->service = $service;
        $this->userId = $userId;
    }

    /**
     * @CORS
     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function index(): DataResponse {
        return new DataResponse($this->service->findAll($this->userId));
    }

    /**
     * @CORS
     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function show(int $id): DataResponse {
        return $this->handleNotFound(function () use ($id) {
            return $this->service->find($id, $this->userId);
        });
    }

    /**
     * @CORS
     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function create(string $title, string $organisation): DataResponse {
        return new DataResponse($this->service->create($title, $organisation,
            $this->userId));
    }

    /**
     * @CORS
     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function update(int $id, string $title,
                           string $organisation): DataResponse {
        return $this->handleNotFound(function () use ($id, $title, $organisation) {
            return $this->service->update($id, $title, $organisation, $this->userId);
        });
    }

    /**
     * @CORS
     * @NoCSRFRequired
     * @NoAdminRequired
     */
    public function destroy(int $id): DataResponse {
        return $this->handleNotFound(function () use ($id) {
            return $this->service->delete($id, $this->userId);
        });
    }

}
