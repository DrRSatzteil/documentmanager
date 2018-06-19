<?php

namespace OCA\DocumentManager\Service\File;

use Exception;

class FileService {
    
    private $storage;
    private $parser;
    private $writer;
    private $pattern;
    private $userid;

    public function __construct(\OCP\Files\IRootFolder $storage, $UserId, \OCA\DocumentManager\Service\DocumentService $writer){
        $this->storage = $storage->getUserFolder($UserId);
        $this->writer = $writer;
        $this->parser = new \Smalot\PdfParser\Parser();
        $this->pattern = '/[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.([A-Za-z0-9_-][A-Za-z0-9_]+)/'; //regex for pattern of e-mail address
        $this->userid = $UserId;
    }
    
    public function loadDocuments(String $userPath){
        try {
            $inserts = [];
            $element = $this->storage->get($userPath);
            
            if($element instanceof \OCP\Files\File) {
                if ($element->getMimeType() === 'application/pdf') {
                    $inserts[] = $this->loadDocumentFile($element);
                    return $inserts;
                }
            } else {
                return $this->loadDocumentFolder($inserts, $element);
            }
            
        } catch(\OCP\Files\NotFoundException $e) {
            throw new Exception('File does not exist');
        }
    }
    
    public function loadDocumentFolder(array $inserts, \OCP\Files\Folder $folder){
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
    
    public function loadDocumentFile(\OCP\Files\File $file){
        if ($file->getMimeType() === 'application/pdf') {
            $matches = $this->readMailAdressesFromFile($file);
            return $this->writer->create($file->getName(), $matches[0][0], $this->userid);
        }
    }
    
    public function readMailAdresses(String $element) {
        try {
            $file = $this->storage->get($element);
            
            if($file instanceof \OCP\Files\File) {
                return $this->readMailAdresses($file);
            }  else {
                throw new Exception('Can not read from folder');
            }
        } catch(\OCP\Files\NotFoundException $e) {
            throw new Exception('File does not exist');
        }
        
    }
    
    public function readMailAdressesFromFile(\OCP\Files\File $file) {
        try {
            if($file instanceof \OCP\Files\File) {
                $pdf = $this->parser->parseContent($file->getContent());
                $string = $pdf->getText();
                $matches = array();
                preg_match_all($this->pattern, $string, $matches); //find matching pattern
                return $matches;
            } else {
                throw new Exception('Can not read from folder');
            }
            
        } catch(\OCP\Files\NotFoundException $e) {
            throw new Exception('File does not exist');
        }
        
    }

}

