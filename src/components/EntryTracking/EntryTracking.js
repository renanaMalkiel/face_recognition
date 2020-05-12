import React from 'react';

const EntryTracking = ({ name, entries }) => {
	return (
		<div>
			<div className='black f3'>
			{`${name}, your current entry count is`} <span className='f2'> {` #${entries}`}</span>
			</div>
			
		</div>
	);
}

export default EntryTracking;