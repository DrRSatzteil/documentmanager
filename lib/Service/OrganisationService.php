<?php
namespace OCA\DocumentManager\Service;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;
use OCP\AppFramework\Http\DataResponse;

use OCA\DocumentManager\Database\Organisation;
use OCA\DocumentManager\Database\OrganisationMapper;


class OrganisationService {

    /** @var OrganisationMapper */
    private $mapper;

    public function __construct(OrganisationMapper $mapper) {
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
    
    public function findByUrl($url, $userId) {
        try {
            return $this->mapper->findByUrl($url, $userId);
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }
    
    public function create(string $name, string $logo, string $email, string $url, string $userId) {
    	try {
        	$organisation = new Organisation();
    		$organisation->setName($name);
    		$organisation->setLogo($logo);
    		// TODO: Only set when logo was set
    		$organisation->setLogoDate(new \DateTime());
    		$organisation->setName($email);
    		$organisation->setLogo($url);
    		return $this->mapper->insert($organisation);
    	} catch (Exception $e) {
    		$this->handleException($e);
    	}
    }

    public function update(int $name, string $logo, string $email, string $url, string $userId) {
		try {
            $organisation = $this->mapper->find($id, $userId);
    		$organisation->setName($name);
    		$organisation->setLogo($logo);
    		// TODO: Only set when logo was changed
    		$organisation->setLogoDate(new \DateTime());
    		$organisation->setName($email);
    		$organisation->setLogo($url);
         	return $this->mapper->update($organisation);
         } catch(Exception $e) {
             $this->handleException($e);
         }
    }

    public function delete($id, $userId) {
        try {
            $organisation = $this->mapper->find($id, $userId);
            $this->mapper->delete($organisation);
            return $organisation;
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }

}