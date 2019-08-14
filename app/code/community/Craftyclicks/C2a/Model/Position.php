<?php

class Craftyclicks_C2a_Model_Position
{
	public function toOptionArray()
	{
		return array(
			array(
				'value' => '1',
				'label' => 'Above address lines'
			),
			array(
				'value' => '2',
				'label' => 'On address line #1'
			)
		);
	}
}
