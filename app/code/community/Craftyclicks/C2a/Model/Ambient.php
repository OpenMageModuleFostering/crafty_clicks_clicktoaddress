<?php

class Craftyclicks_C2a_Model_Ambient
{
	public function toOptionArray()
	{
		return array(
			array(
				'value' => 'light',
				'label' => 'Light'
			),
			array(
				'value' => 'dark',
				'label' => 'Dark'
			)
		);
	}
}
