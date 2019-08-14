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
		//$head->removeItem('js', 'craftyclicks/clicktoaddress/craftyclicks_magento.js');
		if($config->cc_c2a_global){
			$head->addItem('js', $path.'/lib/cc_c2a.min.js');
			$head->addItem('skin_css', 'css/'.$path.'cc_c2a.min.css');
			switch($param){
				case 'admin':
					$head->addItem('js', $path.'/admin.js');
					break;
				default:
					$head->addItem('js', $path.'/default.js');
					break;
			}
		}
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
