<?php
class Craftyclicks_C2a_HashController extends Mage_Core_Controller_Front_Action{
	public function saveAction(){
		$inputJSON = file_get_contents('php://input');
		$input= json_decode( $inputJSON, TRUE );
		$model = Mage::getModel('craftyclicks_c2a/address');
	}
}
