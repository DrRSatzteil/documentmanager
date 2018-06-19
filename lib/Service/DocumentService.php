<?php
namespace OCA\DocumentManager\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\DocumentManager\Db\Document;
use OCA\DocumentManager\Db\DocumentMapper;


class DocumentService {

    /** @var DocumentMapper */
    private $mapper;

    public function __construct(DocumentMapper $mapper){
        $this->mapper = $mapper;
    }

    public function findAll(string $userId): array {
        return $this->mapper->findAll($userId);
    }

    private function handleException (Exception $e): void {
        if ($e instanceof DoesNotExistException ||
            $e instanceof MultipleObjectsReturnedException) {
            throw new DocumentNotFound($e->getMessage());
        } else {
            throw $e;
        }
    }

    public function find($id, $userId) {
        try {
            return $this->mapper->find($id, $userId);

        // in order to be able to plug in different storage backends like files
        // for instance it is a good idea to turn storage related exceptions
        // into service related exceptions so controllers and service users
        // have to deal with only one type of exception
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }

    public function create($title, $organisation, $userId) {
        $document = new Document();
        $document->setTitle($title);
        $document->setOrganisation($organisation);
        $document->setUserId($userId);
        return $this->mapper->insert($document);
    }

    public function update($id, $title, $organisation, $userId) {
        try {
            $document = $this->mapper->find($id, $userId);
            $document->setTitle($title);
            $document->setOrganisation($organisation);
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