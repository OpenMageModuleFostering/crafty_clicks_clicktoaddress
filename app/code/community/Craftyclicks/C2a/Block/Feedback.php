<?php

class Craftyclicks_C2a_Block_Feedback extends Mage_Core_Block_Template
{
	public function _construct() {
		parent::_construct();
	}
	public function getStatus($param){
		echo '<script>alert("banana");</script>';
	}
}
