<?php
namespace OCA\DocumentManager\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Document extends Entity implements JsonSerializable {

    protected $title;
    protected $organisation;
    protected $userId;

    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'organisation' => $this->organisation
        ];
    }
}