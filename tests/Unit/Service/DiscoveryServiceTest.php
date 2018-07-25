<?php
namespace OCA\DocumentManager\Tests\Unit\Service;

use PHPUnit\Framework\TestCase;

use OCA\DocumentManager\Service\DiscoveryService;
use OCA\DocumentManager\Service\DocumentService;
use OCA\DocumentManager\Service\OrganisationService;

use OCA\DocumentManager\Database\Document;
use OCA\DocumentManager\Database\Organisation;

class DicoveryServiceTest extends TestCase {

    private $discoveryService;
    private $documentService;
    private $organisationService;
    private $storage;
    private $file;
    private $userFolder;
    private $userId = 'john';

    public function setUp() {
        $this->storage = $this->getMockBuilder(\OCP\Files\IRootFolder::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->documentService = $this->getMockBuilder(DocumentService::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->organisationService = $this->getMockBuilder(OrganisationService::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->file = $this->getMockBuilder(\OCP\Files\File::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->userFolder = $this->getMockBuilder(\OCP\Files\Folder::class)
            ->disableOriginalConstructor()
            ->getMock();
        
        $this->storage->expects($this->once())
            ->method('getUserFolder')
            ->with($this->equalTo($this->userId))
            ->will($this->returnValue($this->userFolder));
            
        $this->discoveryService = new DiscoveryService($this->storage, $this->userId,
            $this->documentService, $this->organisationService);
    }
    
    public function testDiscoverDocuments() {
        $path = 'test.pdf';
        $fileId = 1234;
        
        $document = Document::fromRow([
            'id' => 3,
            'fileId' => $fileId,
            'userId' => $this->userId,
            'status' => 0
        ]);

        $this->userFolder->expects($this->once())
            ->method('get')
            ->with($this->equalTo($path))
            ->will($this->returnValue($this->file));

        $this->file->expects($this->once())
            ->method('getMimeType')
            ->will($this->returnValue('application/pdf'));
            
        $this->file->expects($this->once())
            ->method('getId')
            ->will($this->returnValue($fileId));
        
        $this->documentService->expects($this->once())
            ->method('create')
            ->with($this->equalTo($fileId), $this->equalTo($this->userId))
            ->will($this->returnValue($document));
            
    	$result = $this->discoveryService->discoverDocuments($path);
    	
        $this->assertEquals($document, $result[0]);
    	
    }
    
    public function testAnalyzeDocument() {

        $id = 3;
        $fileId = 1234;
        $fileName = 'test.pdf';
        
        $document = Document::fromRow([
            'id' => $id,
            'fileId' => $fileId,
            'userId' => $this->userId,
            'status' => 0
        ]);
        
        $organisation = Organisation::fromRow([
            'id' => 5,
            'name' => 'dqinstitute',
            'email' => 'contact@dqinstitute.org',
            'url' => 'dqinstitute.org'
        ]);
        
        $this->documentService->expects($this->once())
            ->method('find')
            ->with($this->equalTo($id), $this->equalTo($this->userId))
            ->will($this->returnValue($document));

        $this->userFolder->expects($this->once())
            ->method('getById')
            ->with($this->equalTo($fileId))
            ->will($this->returnValue([$this->file]));

        $this->file->expects($this->once())
            ->method('getName')
            ->will($this->returnValue($fileName));
            
        $this->file->expects($this->once())
            ->method('getContent')
            ->will($this->returnValue(file_get_contents('tests/Unit/Service/dq.pdf')));
            
        $this->organisationService->expects($this->once())
            ->method('create')
            ->with($this->equalTo('dqinstitute'), $this->equalTo('contact@dqinstitute.org'), $this->equalTo('dqinstitute.org'))
            ->will($this->returnValue($organisation));
        
    	$result = $this->discoveryService->analyzeDocument($id);
    	
    	$this->assertEquals($document, $result[0]);
        $this->assertEquals($organisation, $result[1]);
    }
}