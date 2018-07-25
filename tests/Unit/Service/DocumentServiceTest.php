<?php
namespace OCA\DocumentManager\Tests\Unit\Service;

use PHPUnit\Framework\TestCase;

use OCP\AppFramework\Db\DoesNotExistException;

use OCA\DocumentManager\Database\Document;
use OCA\DocumentManager\Database\DocumentMapper;
use OCA\DocumentManager\Service\DocumentService;
use OCA\DocumentManager\Service\NotFoundException;

class DocumentServiceTest extends TestCase {

    private $service;
    private $mapper;
    private $userId = 'john';

    public function setUp() {
        $this->mapper = $this->getMockBuilder(DocumentMapper::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->service = new DocumentService($this->mapper);
    }
    
    public function testFindAll(){
        $document1 = Document::fromRow([
            'id' => 3,
            'fileId' => 666,
            'title' => 'Contract',
            'organisationId' => 123,
            'userId' => $this->userId,
            'creationDate' => new \DateTime('1970-01-01'),
            'status' => 1
        ]);
        $document2 = Document::fromRow([
            'id' => 5,
            'fileId' => 555,
            'title' => 'Invoice',
            'organisationId' => 888,
            'userId' => $this->userId,
            'creationDate' => new \DateTime('1970-01-02'),
            'status' => 1
        ]);
        $this->mapper->expects($this->once())
            ->method('findAll')
            ->with($this->equalTo($this->userId))
            ->will($this->returnValue([$document1, $document2]));

        $result = $this->service->findAll($this->userId);

        $this->assertEquals($document1, $result[0]);
        $this->assertEquals($document2, $result[1]);
    }
    
    public function testFind(){
        $document = Document::fromRow([
            'id' => 3,
            'fileId' => 666,
            'title' => 'Contract',
            'organisationId' => 123,
            'userId' => $this->userId,
            'creationDate' => new \DateTime('1970-01-01'),
            'status' => 1
        ]);
        
        $this->mapper->expects($this->once())
            ->method('find')
            ->with($this->equalTo(3), $this->equalTo($this->userId))
            ->will($this->returnValue($document));

        $result = $this->service->find(3, $this->userId);

        $this->assertEquals($document, $result);
    }
    
    public function testFindByFileId(){
        $document = Document::fromRow([
            'id' => 3,
            'fileId' => 666,
            'title' => 'Contract',
            'organisationId' => 123,
            'userId' => $this->userId,
            'creationDate' => new \DateTime('1970-01-01'),
            'status' => 1
        ]);
        
        $this->mapper->expects($this->once())
            ->method('findByFileId')
            ->with($this->equalTo(666), $this->equalTo($this->userId))
            ->will($this->returnValue($document));

        $result = $this->service->findByFileId(666, $this->userId);

        $this->assertEquals($document, $result);
    }
    
    public function testCreate() {
        $document = new Document();
        $document->setFileId(555);
        $document->setUserId($this->userId);
        $document->setStatus(0);

        $documentAfterInsert = Document::fromRow([
            'id' => 3,
            'fileId' => 555,
            'userId' => $this->userId,
            'status' => 0
        ]);
        
        $this->mapper->expects($this->once())
            ->method('insert')
            ->with($this->equalTo($document))
            ->will($this->returnValue($documentAfterInsert));

        $result = $this->service->create(555, $this->userId);
        
        $this->assertEquals($documentAfterInsert, $result);
    }

    public function testDelete() {
        $document = Document::fromRow([
            'id' => 3,
            'fileId' => 666,
            'title' => 'Contract',
            'organisationId' => 123,
            'userId' => $this->userId,
            'creationDate' => new \DateTime('1970-01-01'),
            'status' => 1
        ]);
        
        $this->mapper->expects($this->once())
            ->method('find')
            ->with($this->equalTo(3), $this->equalTo($this->userId))
            ->will($this->returnValue($document));
        
        $this->mapper->expects($this->once())
            ->method('delete')
            ->with($this->equalTo($document))
            ->will($this->returnValue($document));

        $result = $this->service->delete(3, $this->userId);
        
        $this->assertEquals($document, $result);
    }

	public function testUpdate() {
		$document = Document::fromRow([
            'id' => 3,
            'fileId' => 666,
            'title' => 'Contract',
            'organisationId' => 123,
            'userId' => $this->userId,
            'creationDate' => new \DateTime('1970-01-01'),
            'status' => 1
        ]);
        $this->mapper->expects($this->once())
            ->method('find')
            ->with($this->equalTo(3), $this->equalTo($this->userId))
            ->will($this->returnValue($document));

		$id = 3;
        $fileId = 555;
        $title = 'Invoice';
        $organisationId = 888;
        $creationDate = new \DateTime('1970-01-02');
        $status = 3;

        $updatedDocument = Document::fromRow(['id' => $id, 'userId' => $this->userId]);
        $updatedDocument->setFileId($fileId);
        $updatedDocument->setTitle($title);
        $updatedDocument->setOrganisationId($organisationId);
        $updatedDocument->setCreationDate($creationDate);
        $updatedDocument->setStatus($status);
        $this->mapper->expects($this->once())
            ->method('update')
            ->with($this->equalTo($updatedDocument))
            ->will($this->returnValue($updatedDocument));

        $result = $this->service->update($id, $fileId, $title, $this->userId, $organisationId, $creationDate, $status);

        $this->assertEquals($updatedDocument, $result);
    }


    /**
     * @expectedException OCA\DocumentManager\Service\NotFoundException
     */
    public function testUpdateNotFound() {

        $id = 5;
        $fileId = 555;
        $title = 'Invoice';
        $organisationId = 888;
        $creationDate = new \DateTime('1970-01-02');
        $status = 3;

        $document = Document::fromRow(['id' => $id, 'userId' => $this->userId]);
        $document->setFileId($fileId);
        $document->setTitle($title);
        $document->setOrganisationId($organisationId);
        $document->setCreationDate($creationDate);
        $document->setStatus($status);
        $this->mapper->expects($this->once())
            ->method('find')
            ->with($this->equalTo($id), $this->userId)
            ->will($this->throwException(new NotFoundException()));

        $this->service->update($id, $fileId, $title, $this->userId, $organisationId, $creationDate, $status);
    }

}