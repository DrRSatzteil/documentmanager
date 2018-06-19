<?php
namespace OCA\DocumentManager\Tests\Unit\Controller;


use OCA\DocumentManager\Controller\DocumentApiController;

class DocumentApiControllerTest extends DocumentControllerTest {

    public function setUp() {
        parent::setUp();
        $this->controller = new DocumentApiController(
            'documentmanager', $this->request, $this->service, $this->userId
        );
    }

}