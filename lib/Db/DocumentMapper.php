<?php
namespace OCA\DocumentManager\Db;

use OCP\IDBConnection;
use OCP\AppFramework\Db\Mapper;

class DocumentMapper extends Mapper {

    public function __construct(IDBConnection $db) {
        parent::__construct($db, 'document', '\OCA\DocumentManager\Db\Document');
    }

    public function find(int $id, string $userId): Document {
        $sql = 'SELECT * FROM *PREFIX*document WHERE id = ? AND user_id = ?';
        return $this->findEntity($sql, [$id, $userId]);
    }

    public function findAll(string $userId): array {
        $sql = 'SELECT * FROM *PREFIX*document WHERE user_id = ?';
        return $this->findEntities($sql, [$userId]);
    }

}