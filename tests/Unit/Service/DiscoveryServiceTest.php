<?php
namespace OCA\DocumentManager\Tests\Unit\Service;

use PHPUnit\Framework\TestCase;

use OCA\DocumentManager\Service\File\FileService;

class DicoveryServiceTest extends TestCase {

    private $discoveryService;
    private $documentService;
    private $storage;
    private $userId = 'john';

    public function setUp() {
        $this->storage = $this->getMockBuilder(\OCP\Files\IRootFolder::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->documentService = $this->getMockBuilder(DiscoveryService::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->discoveryService = new DiscoveryService($this->storage, $this->userId, $this->documentService);
    }
    
    public function testNothing() {
    	$this->assertEquals('ASF', 'ASF');
    }

}