<?php
namespace OCA\DocumentManager\Database;

use OCP\IDbConnection;
use OCP\AppFramework\Db\Mapper;

class DocumentMapper extends Mapper {

    public function __construct(IDbConnection $db) {
        parent::__construct($db, 'document', '\OCA\DocumentManager\Database\Document');
    }

    public function find(int $id, string $userId): Document {
        $sql = 'SELECT * FROM *PREFIX*document WHERE id = ? AND user_id = ?';
        return $this->findEntity($sql, [$id, $userId], 1);
    }
    
    public function findByFileId(int $fileId, string $userId): Document {
        $sql = 'SELECT * FROM *PREFIX*document WHERE file_id = ? AND user_id = ?';
        return $this->findEntity($sql, [$fileId, $userId], 1);
    }

    public function findAll(string $userId): array {
        $sql = 'SELECT * FROM *PREFIX*document WHERE user_id = ?';
        return $this->findEntities($sql, [$userId]);
    }

}