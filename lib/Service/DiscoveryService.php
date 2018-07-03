<?php
namespace OCA\DocumentManager\Service;

use OCP\AppFramework\Db\DoesNotExistException;

use OCA\DocumentManager\Database\Document;
use OCA\DocumentManager\Service\Exception\DiscoveryFailedException;
use OCA\DocumentManager\Service\DocumentService;
use OCA\DocumentManager\Service\OrganisationService;

class DiscoveryService {
    
    private $storage;
    private $parser;
    private $documentService;
    private $organisationService;
    private $pattern = '/[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.([A-Za-z0-9_-][A-Za-z0-9_]+)/';
    private $userId;

    public function __construct(\OCP\Files\IRootFolder $storage, $UserId, DocumentService $documentService, OrganisationService $organisationService){
        $this->storage = $storage->getUserFolder($UserId);
        $this->documentService = $documentService;
        $this->organisationService = $organisationService;
        $this->parser = new \Smalot\PdfParser\Parser();
        $this->userId = $UserId;
    }
    
    private function handleException (Exception $e): void {
		throw new DiscoveryFailedException($e->getMessage());
    }
    
    public function discoverDocuments(String $userPath){
        try {
            $inserts = [];
            $element = $this->storage->get($userPath);
            
            if($element instanceof \OCP\Files\File) {
                if ($element->getMimeType() === 'application/pdf') {
                    $inserts[] = $this->loadDocumentFile($element);
                }
            } else {
                $this->loadDocumentFolder($inserts, $element);
            }
            
            return $inserts;
            
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }
    
    private function loadDocumentFolder(array $inserts, \OCP\Files\Folder $folder){
        foreach ($folder->getDirectoryListing() as $element) {   
            if($element instanceof \OCP\Files\File) {
                if ($element->getMimeType() === 'application/pdf') {
                    $inserts[] = $this->loadDocumentFile($element);
                }
            } else {
                $this->loadDocumentFolder($inserts, $element);
            }
        }
        return inserts;
    }
    
    private function loadDocumentFile(\OCP\Files\File $file) {
    	return $this->documentService->create($file->getId(), $this->userId);
    }
    
    private function analyzeDocument(int $id) {
    	$document = $this->documentService->find($id, $this->userId);
    	try {
            $file = $this->storage->getById($document->fileId);
            if($file instanceof \OCP\Files\File) {
            	$document->setTitle($file->getName());
            	// Parse file
    			$pdf = $this->parseFile($file);
    			$organisation = $this->determineOrganisationDetails($pdf->getPages()[0].getText());
    			$this->determineDocumentDetails($pdf, $document, $organisation);
    			return [$document, $organisation];
            } else {
            	throw new NotFoundException("Document file not found.");
            }
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }
    
    private function determineDocumentDetails($pdf, $document, $organisation) {
    	$details = $pdf->getDetails();
    	if(isset($details['CreationDate'])) {
    		$document->setCreationDate($details['CreationDate']);
    	}
    	if(isset($organisation)) {
    		$document->setOrganisationId($organisation->getId());
    	}
    }
    
    private function determineOrganisationDetails($pdfText) {
    	$email = $this->extractMailAddress($pdfText);
    	$url;
    	$organisation;
    	
    	if(isset($email)) {
    		$url = substr(strrchr($email, "@"), 1);
    	}
    	if(isset($url)) {
    		try {
    			$organisation = $this->organisationService->findByUrl($url, $this->userId);
    			// Don't change anything if the organisation already exists
    		} catch (Exception $e) {
    			// No need to do anything
    		}
    	}
    	if($organisation === NULL) {
    		$organisation = $this->organisationService->create($url, NULL, $email, $url, $this->userId);
    	}
    	return $organisation;
    }
    
    private function parseFile(\OCP\Files\File $file) {
        try {
        	return $this->parser->parseContent($file->getContent());
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }
    
    private function extractMailAddress(String $pdfText) {
        try {
            $matches = [];
            preg_match_all($this->pattern, $pdfText, $matches);
            
            if (count($matches) > 0) {
                // Now we need to guess which mail adress leads us to the sender of the document.
                // We assume that the mail adress we found most times is the one we are looking for
                // If we find more than one adress we'll just randomly pick one for now
                // Now find the entry with the highest count
                $matchCount = [];
                foreach ($matches[0] as $match) {
                	if(isset($matchCount[$match])){
                		$matchCount[$match] = $matchCount[$match] + 1;
                	}
                	else {
                		$matchCount[$match] = 1;
                	}
                }
                arsort($matchCount);
                return $matchCount[0][0];
	        }
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }
}