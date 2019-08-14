<?php
class Craftyclicks_C2a_Block_Ordergrid extends Mage_Adminhtml_Block_Sales_Order_Grid
{
	protected function _prepareColumns()
	{
 		parent::_prepareColumns();
		$this->addColumn('cc_valid', array(
			'header' => Mage::helper('catalog')->__('CC'),
			'index' => 'cc_valid',
			'width'	 => '50px',
			'type'	  => 'text',
			'filter'	=> false,
			'sortable'  => false,
			'renderer' => 'Craftyclicks_Clicktoaddress_Block_Gridlight'
		));
	}
}
