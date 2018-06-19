<?php
namespace OCA\DocumentManager\Tests\Integration\Controller;

use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\App;
use OCP\IRequest;
use PHPUnit\Framework\TestCase;


use OCA\DocumentManager\Db\Document;
use OCA\DocumentManager\Db\DocumentMapper;
use OCA\DocumentManager\Controller\DocumentController;
use OCP\IDBConnection;

class DocumentIntegrationTest extends TestCase {

    private $controller;
    private $mapper;
    private $userId = 'john';

    public function setUp() {
        $app = new App('documentmanager');
        $container = $app->getContainer();

        // only replace the user id
        $container->registerService('userId', function() {
            return $this->userId;
        });

        // we do not care about the request but the controller needs it
        $container->registerService(IRequest::class, function() {
            return $this->createMock(IRequest::class);
        });

        $this->controller = $container->query(DocumentController::class);
        $this->mapper = $container->query(DocumentMapper::class);
    }

    public function testUpdate() {
        // create a new document that should be updated
        $document = new Document();
        $document->setTitle('old_title');
        $document->setOrganisation('old_organisation');
        $document->setUserId($this->userId);

        $id = $this->mapper->insert($document)->getId();

        // fromRow does not set the fields as updated
        $updatedDocument = Document::fromRow([
            'id' => $id,
            'user_id' => $this->userId
        ]);
        $updatedDocument->setOrganisation('organisation');
        $updatedDocument->setTitle('title');

        $result = $this->controller->update($id, 'title', 'organisation');

        $this->assertEquals($updatedDocument, $result->getData());

        // clean up
        $this->mapper->delete($result->getData());
    }

}
