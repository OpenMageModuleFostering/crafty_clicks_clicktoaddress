<?php

class Craftyclicks_C2a_Block_Integration extends Mage_Core_Block_Template
{
	public function _construct() {
		parent::_construct();
	}
	public function addJS($param){
		$config = (object) array(
			'cc_pcl_frontend'	=> (int) Mage::getStoreConfig('clicktoaddress/general/active'),
			'cc_pcl_backend'	=> (int) Mage::getStoreConfig('clicktoaddress/general/active_admin_panel'),
			'cc_c2a_global'		=> (int) Mage::getStoreConfig('c2a_global/options/active')
		);
		$head = $this->getLayout()->getBlock('head');
		$path = 'craftyclicks/c2a/';

		$active_file = '';
		if($config->cc_c2a_global){
			switch($param){
				case 'admin':
					$active_file = 'admin.js';
					break;
				default:
					$active_file = 'default.js';
					break;
			}
		}
		/* detect checkouts, that don't use unique layout tags */
		/*if(Mage::getStoreConfig('onestepcheckout/general/enable') == "1"){
			$active_file = 'advanced.js';
		}*/

		$head->addItem('js', $path.$active_file);

		return $this;
	}
	public function addConfig(){
		$config = (object) array(
			'cc_pcl_frontend'	=> (int) Mage::getStoreConfig('clicktoaddress/general/active'),
			'cc_pcl_backend'	=> (int) Mage::getStoreConfig('clicktoaddress/general/active_admin_panel'),
			'cc_c2a_global'		=> (int) Mage::getStoreConfig('c2a_global/options/active')
		);
		if($config->cc_c2a_global){
			echo $this->getLayout()->createBlock('core/template')->setTemplate('craftyclicks/c2a/c2a_config.phtml')->toHtml();
		}
	}
}
