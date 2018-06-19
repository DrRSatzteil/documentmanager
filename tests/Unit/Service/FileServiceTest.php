<?php
namespace OCA\DocumentManager\Tests\Unit\Service;

use PHPUnit\Framework\TestCase;

use OCA\DocumentManager\Service\File\FileService;

class FileServiceTest extends TestCase {

    private $service;

    public function setUp() {
        
        $app = new \OCP\AppFramework\App('documentmanager');
        $app->getContainer()->registerParameter('UserId', 'admin');
        $this->service = $app->getContainer()->query('OCA\DocumentManager\Service\File\FileService');
    }

    #public function testReadMailAdresses() {
    #    $matches = $this->service->readMailAdresses('dq.pdf');
    #    $this->assertEquals(count($matches[0]), 3);
    #    $this->assertEquals($matches[0][0], 'naumann@hpi.uni');
    #    $this->assertEquals($matches[0][1], 'puppe@informatik.uni');
    #    $this->assertEquals($matches[0][2], 'steinbauer@schufa.de');
    #}
    
    /**
     * @expectedException Exception
     */
    public function testReadFromNonExistingFile() {
        $matches = $this->service->readMailAdresses('doesnotexist.pdf');
    }
    
    public function testFolderRead(\OCP\Files\IRootFolder $storage) {
        $matches = $this->service->loadDocuments('/');
        
    }
}