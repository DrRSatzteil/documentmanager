<?php
namespace OCA\DocumentManager\Tests\Unit\Service;

use PHPUnit\Framework\TestCase;

use OCP\AppFramework\Db\DoesNotExistException;

use OCA\DocumentManager\Db\Document;
use OCA\DocumentManager\Service\DocumentService;
use OCA\DocumentManager\Db\DocumentMapper;

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

    public function testUpdate() {
        // the existing note
        $document = Document::fromRow([
            'id' => 3,
            'title' => 'yo',
            'organisation' => 'AOK'
        ]);
        $this->mapper->expects($this->once())
            ->method('find')
            ->with($this->equalTo(3))
            ->will($this->returnValue($document));

        // the document when updated
        $updatedDocument = Document::fromRow(['id' => 3]);
        $updatedDocument->setTitle('title');
        $updatedDocument->setOrganisation('organisation');
        $this->mapper->expects($this->once())
            ->method('update')
            ->with($this->equalTo($updatedDocument))
            ->will($this->returnValue($updatedDocument));

        $result = $this->service->update(3, 'title', 'organisation', $this->userId);

        $this->assertEquals($updatedDocument, $result);
    }


    /**
     * @expectedException OCA\DocumentManager\Service\DocumentNotFound
     */
    public function testUpdateNotFound() {
        // test the correct status code if no document is found
        $this->mapper->expects($this->once())
            ->method('find')
            ->with($this->equalTo(3))
            ->will($this->throwException(new DoesNotExistException('')));

        $this->service->update(3, 'title', 'content', $this->userId);
    }
    
    

}