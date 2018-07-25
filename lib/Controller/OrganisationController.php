<?php

namespace OCA\DocumentManager\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\DocumentManager\Service\OrganisationService;

class OrganisationController extends Controller {

	/** @var OrganisationService */
	private $organisationService;

	/** @var string */
	private $userId;

	use Errors;

	public function __construct($appName,
                                IRequest $request,
                                \OCA\DocumentManager\Service\OrganisationService $organisationService,
                                $userId) {
        parent::__construct($appName, $request);
        $this->organisationService = $organisationService;
        $this->userId = $userId;
	}

    /**
     * @NoAdminRequired
     */
    public function index(): DataResponse {
        return new DataResponse($this->organisationService->findAll($this->userId));
    }

    /**
     * @NoAdminRequired
     */
    public function show(int $id): DataResponse {
        return $this->handleNotFound(function () use ($id) {
            return $this->organisationService->find($id, $this->userId);
        });
    }

    /**
     * @NoAdminRequired
     */
	public function update(int $id, string $name, string $logo, 
		\DateTime $logoDate, string $email, string $url): DataResponse {
			return $this->handleNotFound(function () use ($id, $name, $logo, 
				$logoDate, $email, $url) {
					return $this->organisationService->update($id, $this->userId, $name, $logo,
						$logoDate, $email, $url);
			});
	}

    /**
     * @NoAdminRequired
     */
    public function destroy(int $id): DataResponse {
        return $this->handleNotFound(function () use ($id) {
            return $this->organisationService->delete($id, $this->userId);
        });
    }

}
