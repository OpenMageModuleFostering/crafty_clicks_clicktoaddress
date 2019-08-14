<?php
class Craftyclicks_C2a_Block_Gridlight extends Mage_Adminhtml_Block_Widget_Grid_Column_Renderer_Abstract
{
	public function render(Varien_Object $row)
	{
		$error_img = '<img src="'.$this->getSkinUrl('images/error_msg_icon.gif').'"/>';
		$success_img = '<img src="'.$this->getSkinUrl('images/success_msg_icon.gif').'"/>';
		//Get the order details based on the order id ($orderId)
		$order = Mage::getModel('sales/order')->load($row->getData('entity_id'));

		// Get the id of the orders shipping address
		$shippingId = $order->getShippingAddress()->getId();
		$billingId = $order->getBillingAddress()->getId();
		// Get shipping address data using the id
		$shippingaddress = Mage::getModel('sales/order_address')->load($shippingId);
		$billingaddress = Mage::getModel('sales/order_address')->load($billingId);
		/*echo '<pre>';
		//var_dump($row->getData('addresses'));
	    var_dump($shippingaddress);
	    var_dump($billingaddress);
		echo '</pre>';
		*/
		//$test = Mage::getModel('craftyclicks_c2a/address')->getCollection();
		//var_dump($test);
		return $error_img;
		//return print_r($row, true);
	}

}
