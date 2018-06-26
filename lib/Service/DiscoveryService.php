<?php

namespace OCA\DocumentManager\Service;

use OCP\AppFramework\Db\DoesNotExistException;

use OCA\DocumentManager\Database\Document;
use OCA\DocumentManager\Service\Exception\DiscoveryFailedException;

class DiscoveryService {
    
    private $storage;
    private $parser;
    private $documentService;
    private $pattern;
    private $userId;

    public function __construct(\OCP\Files\IRootFolder $storage, $UserId, \OCA\DocumentManager\Service\DocumentService $documentService){
        $this->storage = $storage->getUserFolder($UserId);
        $this->documentService = $documentService;
        $this->parser = new \Smalot\PdfParser\Parser();
        $this->pattern = '/[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.([A-Za-z0-9_-][A-Za-z0-9_]+)/'; //regex for pattern of e-mail address
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
    
    private function loadDocumentFile(\OCP\Files\File $file){
    	return $this->documentService->create($file->getId(), $this->userId);
    }
    
    private function extractDocumentData(\OCP\Files\File $file, array $documentData) {
    	
    	// Parse file
    	$pdf = $this->parseFile($file);
    	
    	// Read Mail Adress
    	/**$documentData['email'] = $this->extractMailAddress($pdf->getText());*/
    	
    	// Extract url from email
    	//if ($email )
    
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
            $matches = mailparse_rfc822_parse_addresses($pdfText);
            
            if ($matches.length > 0) {
            	return $matches[0]['address'];
                // Now we need to guess which mail adress leads us to the sender of the document.
                // We assume that the mail adress we found most times is the one we are looking for
                // If we find more than one adress we'll just randomly pick one for now
                /**$merged_matches = array();
                foreach ($matches as $matcharray) {
                	array_merge($merged_matches, array_count_values($matcharray));
                }
                // Now find the entry with the highest count
                $highest_count = 0;
                $highest_count_value;
                foreach ($merged_matches as $match => $count) {
                	if ($count > $highest_count) {
                		$highest_count_value = $match;
                		$highest_count = $count;
                	}
                }
                return $highest_count_value;*/
	        }
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }
}