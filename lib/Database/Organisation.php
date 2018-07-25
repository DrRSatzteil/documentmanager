<?php
namespace OCA\DocumentManager\Database;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Organisation extends Entity implements JsonSerializable {

    protected $name;
    protected $logo;
    protected $logoDate;
    protected $email;
    protected $url;
    
    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
			'logo' => $this->logo,
			'logoDate' => $this->logoDate,
			'email' => $this->email,
			'url' => $this->url
        ];
    }
}