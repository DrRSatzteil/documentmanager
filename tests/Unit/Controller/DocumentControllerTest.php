<?php
namespace OCA\DocumentManager\Tests\Unit\Controller;

use PHPUnit\Framework\TestCase;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;

use OCA\DocumentManager\Service\DocumentNotFound;
use OCA\DocumentManager\Service\DocumentService;
use OCA\DocumentManager\Controller\DocumentController;


class DocumentControllerTest extends TestCase {

    protected $controller;
    protected $service;
    protected $userId = 'john';
    protected $request;

    public function setUp() {
        $this->request = $this->getMockBuilder(IRequest::class)->getMock();
        $this->service = $this->getMockBuilder(DocumentService::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->controller = new DocumentController(
            'documentmanager', $this->request, $this->service, $this->userId
        );
    }

    public function testUpdate() {
        $document = 'just check if this value is returned correctly';
        $this->service->expects($this->once())
            ->method('update')
            ->with($this->equalTo(3),
                    $this->equalTo('title'),
                    $this->equalTo('organisation'),
                   $this->equalTo($this->userId))
            ->will($this->returnValue($document));

        $result = $this->controller->update(3, 'title', 'organisation');

        $this->assertEquals($document, $result->getData());
    }


    public function testUpdateNotFound() {
        // test the correct status code if no document is found
        $this->service->expects($this->once())
            ->method('update')
            ->will($this->throwException(new DocumentNotFound()));

        $result = $this->controller->update(3, 'title', 'organisation');

        $this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
    }

}