<?php
class Craftyclicks_C2a_HashController extends Mage_Core_Controller_Front_Action{
	public function saveAction(){
		$inputJSON = file_get_contents('php://input');
		$input= json_decode( $inputJSON, TRUE );
		var_dump($input);
		$model = Mage::getModel('craftyclicks_c2a/address');
		echo 'banana';
	}
}
