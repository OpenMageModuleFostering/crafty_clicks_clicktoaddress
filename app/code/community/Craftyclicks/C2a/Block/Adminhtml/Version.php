<?php
class Craftyclicks_C2a_Block_Adminhtml_Version
	extends Mage_Adminhtml_Block_System_Config_Form_Field
{
	protected function _getElementHtml(Varien_Data_Form_Element_Abstract $element)
	{
		return (string) Mage::helper('c2a')->getExtensionVersion();
	}
}
