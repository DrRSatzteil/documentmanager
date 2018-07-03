<?php
namespace OCA\DocumentManager\Service;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;
use OCP\AppFramework\Http\DataResponse;

use OCA\DocumentManager\Database\Document;
use OCA\DocumentManager\Database\DocumentMapper;


class DocumentService {

    /** @var DocumentMapper */
    private $mapper;

    public function __construct(DocumentMapper $mapper) {
        $this->mapper = $mapper;
    }

    private function handleException ($e) {
        if ($e instanceof DoesNotExistException ||
            $e instanceof MultipleObjectsReturnedException) {
            throw new NotFoundException($e->getMessage());
        } else {
            throw $e;
        }
    }
    
    public function findAll(string $userId): array {
    	try {
            return $this->mapper->findAll($userId);
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }

    public function find($id, $userId) {
        try {
            return $this->mapper->find($id, $userId);
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }
    
    public function findByFileId($fileId, $userId) {
        try {
            return $this->mapper->findByFileId($fileId, $userId);
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }

    public function create(int $fileId, string $userId) {
    	try {
        	$document = new Document();
    		$document->setFileId($fileId);
    		$document->setUserId($userId);
    		// Status 0 = Initial load
    		$document->setStatus(0);
    		return $this->mapper->insert($document);
    	} catch (Exception $e) {
    		$this->handleException($e);
    	}
    }

    public function update(int $id, int $fileId, string $title, string $userId,
		int $organisationId, \DateTime $creationDate, int $status) {
			try {
	            $document = $this->mapper->find($id, $userId);
				$document->setTitle($title);
				$document->setFileId($fileId);
				$document->setOrganisationId($organisationId);
				$document->setCreationDate($creationDate);
				$document->setStatus($status);
	         	return $this->mapper->update($document);
	         } catch(Exception $e) {
	             $this->handleException($e);
	         }
    }

    public function delete($id, $userId) {
        try {
            $document = $this->mapper->find($id, $userId);
            $this->mapper->delete($document);
            return $document;
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }

}