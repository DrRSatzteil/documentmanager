<?php
namespace OCA\DocumentManager\Tests\Unit\Controller;

use PHPUnit\Framework\TestCase;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;

use OCA\DocumentManager\Service\DocumentService;
use OCA\DocumentManager\Service\DiscoveryService;
use OCA\DocumentManager\Controller\DocumentController;
use OCA\DocumentManager\Service\NotFoundException;


class DocumentControllerTest extends TestCase {

    protected $controller;
    protected $service;
    protected $documentService;
    protected $discoveryService;
    protected $userId = 'john';
    protected $request;

    public function setUp() {
        $this->request = $this->getMockBuilder(IRequest::class)->getMock();
        $this->documentService = $this->getMockBuilder(DocumentService::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->discoveryService = $this->getMockBuilder(DiscoveryService::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->controller = new DocumentController(
            'documentmanager', $this->request, $this->documentService, $this->discoveryService, $this->userId
        );
    }

    public function testUpdate() {
        $document = 'just check if this value is returned correctly';
        $this->documentService->expects($this->once())
            ->method('update')
            ->with($this->equalTo(3),
            	   $this->equalTo(555),
                   $this->equalTo('title'),
                   $this->equalTo($this->userId),
                   $this->equalTo(1000),
                   $this->equalTo(new \DateTime('1970-01-01')),
                   $this->equalTo(1))
            ->will($this->returnValue($document));

        $result = $this->controller->update(3, 555, 'title', 1000, new \DateTime('1970-01-01'), 1);

        $this->assertEquals($document, $result->getData());
    }

	/**
     * @expectedException OCA\DocumentManager\Service\NotFoundException
     */
    public function testUpdateNotFound() {
        // test the correct status code if no document is found
        $this->documentService->expects($this->once())
            ->method('update')
            ->will($this->throwException(new NotFoundException()));

        $result = $this->controller->update(3, 555, 'title', 1000, new \DateTime('1970-01-01'), 1);

        $this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
    }

}