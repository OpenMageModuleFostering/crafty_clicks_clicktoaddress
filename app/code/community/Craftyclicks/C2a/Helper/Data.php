<?php
class Craftyclicks_C2a_Helper_Data extends Mage_Core_Helper_Abstract
{
	public function getExtensionVersion()
	{
		return (string) Mage::getConfig()->getNode()->modules->Craftyclicks_C2a->version;
	}
}
