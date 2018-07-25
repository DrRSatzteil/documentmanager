<?php
namespace OCA\DocumentManager\Database;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Document extends Entity implements JsonSerializable {

    protected $fileId;
    protected $title;
    protected $userId;
    protected $organisationId;
    protected $status;
    protected $creationDate;
    
    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'fileId' => $this->fileId,
			'title' => $this->title,
			'userId' => $this->userId,
			'organisationId' => $this->organisationId,
			'status' => $this->status,
			'creationDate' => $this->creationDate
        ];
    }
}