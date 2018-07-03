<?php
namespace OCA\DocumentManager\Database;

use OCP\IDBConnection;
use OCP\AppFramework\Db\Mapper;

class OrganisationMapper extends Mapper {

    public function __construct(IDBConnection $db) {
        parent::__construct($db, 'organisation', '\OCA\DocumentManager\Database\Organisation');
    }

    public function find(int $id, string $userId): Document {
        $sql = 'SELECT o.* FROM *PREFIX*organisation o inner join *PREFIX*document d on o.id = d.organisation_id WHERE o.id = ? AND d.user_id = ?';
        return $this->findEntity($sql, [$id, $userId], 1);
    }
    
    public function findByUrl(int $url, string $userId): Document {
        $sql = 'SELECT o.* FROM *PREFIX*organisation o inner join *PREFIX*document d on o.id = d.organisation_id WHERE o.url = ? AND d.user_id = ?';
        return $this->findEntity($sql, [$url, $userId], 1);
    }
    
    public function findAll(string $userId): array {
        $sql = 'SELECT o.* FROM *PREFIX*organisation o inner join *PREFIX*document d on o.id = d.organisation_id WHERE d.user_id = ?';
        return $this->findEntities($sql, [$userId]);
    }

}