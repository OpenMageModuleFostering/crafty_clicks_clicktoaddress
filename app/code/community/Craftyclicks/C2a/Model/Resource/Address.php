<?php

class Craftyclicks_C2a_Model_Resource_Address extends Mage_Core_Model_Resource_Db_Abstract
{
    protected function _construct()
    {
        $this->_init('craftyclicks_c2a/address', 'address_id');
    }
}
